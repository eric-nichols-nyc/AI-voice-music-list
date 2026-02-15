"use client";

import {
  Avatar,
  AvatarFallback,
} from "@repo/design-system/components/ui/avatar";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import { cn } from "@repo/design-system/lib/utils";
import { Send, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AssistantIcon } from "./assistant-icon";

type Step = "INTRO" | "MOOD" | "ANXIETY" | "ENERGY" | "RESULTS";

type AnswersRaw = {
  mood?: string;
  anxiety?: string;
  energy?: string;
};

type Message = { id: string; role: "user" | "assistant"; content: string };

const PROMPTS: Record<Exclude<Step, "RESULTS">, string> = {
  INTRO: "Hi — I’ll recommend a short music list. Ready to begin? Type “yes”.",
  MOOD: "What’s your mood right now? (e.g., happy, low, stressed)",
  ANXIETY: "Anxiety level: low / medium / high, or 1–10.",
  ENERGY: "Energy level: low / medium / high, or 1–10.",
};

function uid() {
  return Math.random().toString(16).slice(2);
}

function getNextStep(step: Step): Step {
  switch (step) {
    case "INTRO":
      return "MOOD";
    case "MOOD":
      return "ANXIETY";
    case "ANXIETY":
      return "ENERGY";
    case "ENERGY":
      return "RESULTS";
    default:
      return "RESULTS";
  }
}

const placeholders = [
  "Type 'yes' to continue...",
  "Type your mood...",
  "Type your anxiety level...",
  "Type your energy level...",
];

function getNextPlaceholder(step: Step) {
  switch (step) {
    case "INTRO":
      return placeholders[0];
    case "MOOD":
      return placeholders[1];
    case "ANXIETY":
      return placeholders[2];
    case "ENERGY":
      return placeholders[3];
    default:
      return "";
  }
}
function isYes(text: string) {
  const t = text.trim().toLowerCase();
  return ["yes", "y", "ok", "okay", "sure", "ready"].includes(t);
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: uid(), role: "assistant", content: PROMPTS.INTRO },
  ]);
  const [currentStep, setCurrentStep] = useState<Step>("INTRO");
  const [input, setInput] = useState("");
  const [answersRaw, setAnswersRaw] = useState<AnswersRaw>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    console.log(answersRaw);
  }, [messages, answersRaw]);

  // 1. wake up hal and load intro message
  //const handleStart = () => {};
  const canSubmit = currentStep !== "RESULTS";
  const hasInput = input.trim().length > 0;
  const isSendDisabled = !(hasInput && canSubmit);

  const fakePlaylist = useMemo(() => {
    if (currentStep !== "RESULTS") {
      return null;
    }
    // v1 placeholder — later replace with LLM output JSON
    return {
      title: "Focus Lift (Demo)",
      subtitle: "A short list based on your answers",
      tracks: [
        {
          title: "Dog Days Are Over",
          artist: "Florence + The Machine",
          reason: "Upbeat, bright release.",
        },
        {
          title: "Put Your Records On",
          artist: "Corinne Bailey Rae",
          reason: "Warm and steady.",
        },
        {
          title: "Good as Hell",
          artist: "Lizzo",
          reason: "Confident, energizing.",
        },
      ],
    };
  }, [currentStep]);

  function appendMsg(msg: Message) {
    setMessages((prev) => [...prev, msg]);
  }

  function appendAssistantForStep(next: Step) {
    if (next === "RESULTS") {
      return;
    }
    appendMsg({ id: uid(), role: "assistant", content: PROMPTS[next] });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) {
      return;
    }

    appendMsg({ id: uid(), role: "user", content: text });
    setInput("");

    if (currentStep === "INTRO") {
      // validate store and advance
      const next = getNextStep(currentStep);
      setCurrentStep(next);
      appendAssistantForStep(next);
      return;
    }

    if (currentStep === "MOOD") {
      setAnswersRaw((p) => ({ ...p, mood: text }));
      const next = getNextStep(currentStep);
      setCurrentStep(next);
      appendAssistantForStep(next);
      return;
    }

    if (currentStep === "ANXIETY") {
      setAnswersRaw((p) => ({ ...p, anxiety: text }));
      const next = getNextStep(currentStep);
      setCurrentStep(next);
      appendAssistantForStep(next);
      return;
    }

    if (currentStep === "ENERGY") {
      setAnswersRaw((a) => ({ ...a, energy: text }));
      const next = getNextStep(currentStep);
      setCurrentStep(next);

      // In v1, immediately show results.
      appendMsg({
        id: uid(),
        role: "assistant",
        content: "Thanks. Generating your tracklist…",
      });

      setTimeout(() => {
        appendMsg({
          id: uid(),
          role: "assistant",
          content: "Done. Your tracklist is ready below.",
        });
      }, 4000);

      return;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-white/10 border-b bg-gray-900/80 px-4 py-3 backdrop-blur-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center">
          <AssistantIcon />
        </div>
        <div>
          <h2 className="font-semibold text-sm text-white">Chat</h2>
          <p className="text-gray-400 text-xs">Assistant</p>
        </div>
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-6 p-4">
          {messages.map((msg) => (
            <div
              className={cn(
                "flex gap-3",
                msg.role === "user" && "flex-row-reverse"
              )}
              key={msg.id}
            >
              <Avatar className="size-8 shrink-0 ring-1 ring-white/10">
                {msg.role === "user" ? (
                  <AvatarFallback className="flex items-center justify-center bg-white/15 p-0 text-white">
                    <User className="size-4" />
                  </AvatarFallback>
                ) : (
                  <AvatarFallback className="flex items-center justify-center bg-white/10 p-0">
                    <AssistantIcon className="size-6" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div
                className={cn(
                  "max-w-[85%] rounded-lg border border-white/10 px-3 py-2 text-sm",
                  msg.role === "user"
                    ? "bg-white/15 text-white"
                    : "border-white/5 bg-white/5 text-gray-200"
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {currentStep === "RESULTS" && fakePlaylist && (
            <div
              style={{
                marginTop: 16,
                border: "1px solid #fff",
                borderRadius: 16,
                padding: 16,
                color: "#fff",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 16 }}>
                {fakePlaylist.title}
              </div>
              <div style={{ opacity: 0.75, fontSize: 12, marginTop: 4 }}>
                {fakePlaylist.subtitle}
              </div>

              <div style={{ marginTop: 12 }}>
                {fakePlaylist.tracks.map((t, idx) => (
                  <div
                    key={t.title}
                    style={{
                      padding: "10px 0",
                      borderBottom:
                        idx < fakePlaylist.tracks.length - 1
                          ? "1px solid rgba(255,255,255,0.08)"
                          : "none",
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>
                      {idx + 1}. {t.title}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>{t.artist}</div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                      {t.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="sticky bottom-0 z-10 shrink-0 border-white/10 border-t bg-gray-900/80 p-3 backdrop-blur-sm">
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <Input
            className="min-w-0 flex-1 border-white/10 bg-white/5 text-white placeholder:text-gray-500"
            onChange={(e) => setInput(e.target.value)}
            placeholder={getNextPlaceholder(currentStep)}
            value={input}
          />
          <Button
            aria-label="Send message"
            disabled={isSendDisabled}
            size="icon"
            type="submit"
          >
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
