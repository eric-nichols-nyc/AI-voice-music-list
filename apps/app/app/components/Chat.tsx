"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import {
  Avatar,
  AvatarFallback,
} from "@repo/design-system/components/ui/avatar";
import { cn } from "@repo/design-system/lib/utils";
import { Send } from "lucide-react";

const STATIC_MESSAGES = [
  { id: "1", role: "user" as const, content: "What's the best way to get started with Next.js?" },
  { id: "2", role: "assistant" as const, content: "I'd recommend starting with the official Next.js docs and the App Router. Create a new project with `npx create-next-app@latest` and explore the file-based routing." },
  { id: "3", role: "user" as const, content: "Can you suggest a good place for lunch around here?" },
  { id: "4", role: "assistant" as const, content: "There are a few solid options: the café on the corner has great sandwiches, and the Thai place two blocks down is popular for lunch specials." },
  { id: "5", role: "user" as const, content: "How do I center a div in CSS?" },
  { id: "6", role: "assistant" as const, content: "You can use flexbox: `display: flex; justify-content: center; align-items: center;` on the parent, or `margin: 0 auto` with a fixed width on the div." },
  { id: "7", role: "user" as const, content: "What time does the meeting start tomorrow?" },
  { id: "8", role: "assistant" as const, content: "The meeting is scheduled for 10:00 AM in Conference Room B. I can send a calendar invite if you'd like." },
  { id: "9", role: "user" as const, content: "Thanks, that's really helpful!" },
  { id: "10", role: "assistant" as const, content: "You're welcome! Let me know if you need anything else." },
];

const Chat = () => {
  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b border-border bg-background px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
          AI
        </div>
        <div>
          <h2 className="font-semibold text-sm">Chat</h2>
          <p className="text-muted-foreground text-xs">Assistant</p>
        </div>
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-6 p-4">
          {STATIC_MESSAGES.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3",
                msg.role === "user" && "flex-row-reverse"
              )}
            >
              <Avatar className="size-8 shrink-0">
                <AvatarFallback
                  className={cn(
                    "text-xs",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {msg.role === "user" ? "U" : "AI"}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="sticky bottom-0 z-10 shrink-0 border-t border-border bg-background p-3">
        <form className="flex gap-2">
          <Input
            placeholder="Type a message..."
            className="min-w-0 flex-1"
            disabled
          />
          <Button type="submit" size="icon" aria-label="Send message" disabled>
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
