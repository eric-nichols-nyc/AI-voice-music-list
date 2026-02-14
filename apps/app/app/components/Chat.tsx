"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import {
  Avatar,
  AvatarFallback,
} from "@repo/design-system/components/ui/avatar";
import { cn } from "@repo/design-system/lib/utils";
import { Send, User } from "lucide-react";
import { AssistantIcon } from "./assistant-icon";

type Message = { id: string; role: "user" | "assistant"; content: string };

const INITIAL_MESSAGES: Message[] = [
  { id: "1", role: "user", content: "What's the best way to get started with Next.js?" },
  { id: "2", role: "assistant", content: "I'd recommend starting with the official Next.js docs and the App Router. Create a new project with `npx create-next-app@latest` and explore the file-based routing." },
  { id: "3", role: "user", content: "Can you suggest a good place for lunch around here?" },
  { id: "4", role: "assistant", content: "There are a few solid options: the café on the corner has great sandwiches, and the Thai place two blocks down is popular for lunch specials." },
];

const DUMMY_RESPONSES = [
  "Got it—I'm a demo assistant. Real responses will hook up here soon!",
  "Thanks for your message. This is a placeholder reply.",
  "Noted! I'm just a dummy for now, but I'll pass this along when the real assistant is connected.",
];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isResponding) return;

    const userMsg: Message = { id: `user-${Date.now()}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsResponding(true);

    const dummy =
      DUMMY_RESPONSES[Math.floor(Math.random() * DUMMY_RESPONSES.length)];
    const assistantMsg: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: dummy,
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, assistantMsg]);
      setIsResponding(false);
    }, 600);
  };

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b border-white/10 bg-gray-900/80 px-4 py-3 backdrop-blur-sm">
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
              key={msg.id}
              className={cn(
                "flex gap-3",
                msg.role === "user" && "flex-row-reverse"
              )}
            >
              <Avatar className="size-8 shrink-0 ring-1 ring-white/10">
                {msg.role === "user" ? (
                  <AvatarFallback className="flex items-center justify-center bg-white/15 text-white p-0">
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
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm border border-white/10",
                  msg.role === "user"
                    ? "bg-white/15 text-white"
                    : "bg-white/5 text-gray-200 border-white/5"
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="sticky bottom-0 z-10 shrink-0 border-t border-white/10 bg-gray-900/80 p-3 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Type a message..."
            className="min-w-0 flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isResponding}
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Send message"
            disabled={!input.trim() || isResponding}
          >
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
