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
import { useEffect, useRef, useState } from "react";
import { type NormalizedAnswers, normalizeAll } from "@/lib/normalize";
import type { PlaylistResult } from "@/types/playlist-types";
import { type ThemeKey, useTheme } from "../context/ThemeContext";
import { AssistantIcon } from "./assistant-icon";

type Step = "INTRO" | "MOOD" | "ANXIETY" | "ENERGY" | "GENERATING" | "RESULTS";

type AnswersRaw = {
  mood?: string;
  anxiety?: string;
  energy?: string;
};

type Message = { id: string; role: "user" | "assistant"; content: string };

const PROMPTS: Record<Exclude<Step, "RESULTS" | "GENERATING">, string> = {
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
      return "GENERATING";
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
const Chat = () => {
  const { setTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    { id: uid(), role: "assistant", content: PROMPTS.INTRO },
  ]);
  const [currentStep, setCurrentStep] = useState<Step>("INTRO");
  const [input, setInput] = useState("");
  const [answersRaw, setAnswersRaw] = useState<AnswersRaw>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const [normalized, setNormalized] = useState<NormalizedAnswers | null>(null);
  const [playlist, setPlaylist] = useState<PlaylistResult | null>(null);

  useEffect(() => {
    if (messages) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const canSubmit = currentStep !== "RESULTS" && currentStep !== "GENERATING";
  const hasInput = input.trim().length > 0;
  const isSendDisabled = !(hasInput && canSubmit);

  function appendMsg(msg: Message) {
    setMessages((prev) => [...prev, msg]);
  }

  function appendAssistantForStep(next: Step) {
    if (next === "RESULTS" || next === "GENERATING") {
      return;
    }
    appendMsg({ id: uid(), role: "assistant", content: PROMPTS[next] });
  }

  function mapMoodToTheme(moodCategory: NormalizedAnswers["moodCategory"]) {
    const map: Record<NormalizedAnswers["moodCategory"], ThemeKey> = {
      positive: "happy",
      neutral: "neutral",
      low: "sad",
      stressed: "sad",
      angry: "sad",
    };

    return map[moodCategory];
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
      const nextAnswers = { ...answersRaw, energy: text };
      setAnswersRaw(nextAnswers);

      let n: NormalizedAnswers;
      try {
        n = normalizeAll(nextAnswers);
        setNormalized(n);
        setTheme(mapMoodToTheme(n.moodCategory));
        console.log("Hals theme is ", n.moodCategory);
      } catch (err) {
        console.error(err);
        return;
      }

      setCurrentStep("GENERATING");
      appendMsg({
        id: uid(),
        role: "assistant",
        content: "Generating…",
      });

      fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ normalized: n }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Recommend request failed");
          }
          return res.json();
        })
        .then((result: PlaylistResult) => {
          setPlaylist(result);
          setCurrentStep("RESULTS");
          appendMsg({
            id: uid(),
            role: "assistant",
            content: "Done.",
          });
        })
        .catch((err) => {
          console.error(err);
          appendMsg({
            id: uid(),
            role: "assistant",
            content: "Something went wrong. Please try again.",
          });
          setCurrentStep("ENERGY");
        });

      return;
    }
  };

  return (
    <div className="flex h-full flex-col">
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

          {currentStep === "RESULTS" && playlist && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 600 }}>
                {playlist.playlistTitle}
              </div>

              <div style={{ opacity: 0.7, fontSize: 13, marginBottom: 16 }}>
                {playlist.playlistSubtitle}
              </div>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  color: "#fff",
                }}
              >
                <thead>
                  <tr
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <th style={{ padding: "8px 0" }}>#</th>
                    <th>Title</th>
                    <th>Artist</th>
                  </tr>
                </thead>
                <tbody>
                  {playlist.tracks.map((track, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <td style={{ padding: "10px 0" }}>{i + 1}</td>
                      <td>
                        <a
                          href={`https://open.spotify.com/search/${encodeURIComponent(track.spotifyQuery)}`}
                          rel="noopener noreferrer"
                          style={{ textDecoration: "underline" }}
                          target="_blank"
                        >
                          {track.title}
                        </a>
                      </td>
                      <td>{track.artist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
