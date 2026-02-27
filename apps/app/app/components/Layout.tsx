"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { GripVertical, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useVoiceBot, VoiceBotStatus } from "../context/VoiceBotContextProvider";
import AnimationManager from "./AnimationManager";
import { AppName } from "./AppName";
import Chat from "./Chat";
import { DynamicBackground } from "./DynamicBackground";

const MIN_LEFT_PERCENT = 20;
const MAX_LEFT_PERCENT = 80;
const DEFAULT_LEFT_PERCENT = 60;
const RESIZER_WIDTH_PX = 10;

/** Chat panel always uses sad theme gradient (unchanged by global theme). */
const CHAT_BG_STYLE = {
  background: "linear-gradient(to bottom, #0f172a, #020617)",
};

export default function Layout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftPercent, setLeftPercent] = useState(DEFAULT_LEFT_PERCENT);
  const [isDragging, setIsDragging] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const { setStatus, setOrbTheme } = useVoiceBot();

  const handleStartJourney = useCallback(() => {
    setShowOverlay(false);
    setStatus(VoiceBotStatus.LISTENING);
    setOrbTheme("neutral");
  }, [setStatus, setOrbTheme]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleResizerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const el = containerRef.current;
    if (!el) return;

    const onMove = (moveEvent: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = moveEvent.clientX - rect.left;
      const pct = Math.min(
        MAX_LEFT_PERCENT,
        Math.max(MIN_LEFT_PERCENT, (x / rect.width) * 100)
      );
      setLeftPercent(pct);
    };

    const onUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    setIsDragging(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  return (
    <main
      className="relative flex h-screen flex-col overflow-hidden md:flex-row"
      ref={containerRef}
    >
      {showOverlay ? (
        <div
          aria-label="Welcome. This experience uses audio."
          className="fixed inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-black/50 px-4"
          role="dialog"
        >
          <p className="text-center font-medium text-white text-2xl md:text-4xl">
            Discover music that matches your mood
          </p>
          <Button
            className="h-12 px-10 text-lg bg-white text-gray-900 hover:bg-white/90"
            onClick={handleStartJourney}
            size="lg"
          >
            Start your journey
          </Button>
          <p className="flex items-center justify-center gap-2 text-center text-base italic text-white/80">
            <Volume2 className="size-4 shrink-0" aria-hidden />
            This experience uses audio.
          </p>
        </div>
      ) : null}
      <DynamicBackground />
      <div className="relative z-10 flex flex-1 flex-col md:min-h-0 md:min-w-0 md:flex-row">
        <div className="absolute top-4 left-4 z-10">
          <AppName />
        </div>

        {/* Mobile: stacked — taller section so Hal orb has more room */}
        <section
          className="flex min-w-0 shrink-0 flex-col border-border border-b md:hidden"
          style={{ height: "min(320px, 42vh)" }}
        >
          <AnimationManager />
        </section>
        <section
          className="flex min-h-0 min-w-0 flex-1 flex-col md:hidden"
          style={CHAT_BG_STYLE}
        >
          <Chat />
        </section>

        {/* Desktop: resizable columns */}
        <section
          className="hidden min-h-0 min-w-0 flex-col border-border border-r md:flex"
          style={isDesktop ? { flex: `0 0 ${leftPercent}%` } : undefined}
        >
          <AnimationManager />
        </section>
        <div
          aria-label="Resize panels"
          aria-orientation="vertical"
          aria-valuenow={leftPercent}
          className="hidden shrink-0 cursor-col-resize items-center justify-center border-white/10 bg-gray-900/90 md:flex"
          onMouseDown={handleResizerMouseDown}
          role="separator"
          style={{
            width: RESIZER_WIDTH_PX,
            minWidth: RESIZER_WIDTH_PX,
            ...(isDragging ? { userSelect: "none" } : {}),
          }}
          tabIndex={0}
        >
          <GripVertical aria-hidden className="size-3 text-white/50" />
        </div>
        <section
          className="hidden min-h-0 min-w-0 flex-1 flex-col md:flex"
          style={{
            ...(isDesktop ? { flex: "1 1 0" } : {}),
            ...CHAT_BG_STYLE,
          }}
        >
          <Chat />
        </section>
      </div>
    </main>
  );
}
