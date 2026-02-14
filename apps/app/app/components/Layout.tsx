"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GripVertical } from "lucide-react";
import AnimationManager from "./AnimationManager";
import { AppName } from "./AppName";
import Chat from "./Chat";

const MIN_LEFT_PERCENT = 20;
const MAX_LEFT_PERCENT = 80;
const DEFAULT_LEFT_PERCENT = 60;
const RESIZER_WIDTH_PX = 10;

export default function Layout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftPercent, setLeftPercent] = useState(DEFAULT_LEFT_PERCENT);
  const [isDragging, setIsDragging] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

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
        Math.max(MIN_LEFT_PERCENT, (x / rect.width) * 100),
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
      ref={containerRef}
      className="relative flex h-screen flex-col overflow-hidden bg-gradient-to-b from-gray-900 to-black md:flex-row"
    >
      <div className="absolute left-4 top-4 z-10">
        <AppName />
      </div>

      {/* Mobile: stacked */}
      <section className="flex h-[200px] min-w-0 shrink-0 flex-col border-b border-border md:hidden">
        <AnimationManager />
      </section>
      <section className="flex min-h-0 min-w-0 flex-1 flex-col md:hidden">
        <Chat />
      </section>

      {/* Desktop: resizable columns */}
      <section
        className="hidden min-h-0 min-w-0 flex-col border-r border-border md:flex"
        style={isDesktop ? { flex: `0 0 ${leftPercent}%` } : undefined}
      >
        <AnimationManager />
      </section>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={leftPercent}
        aria-label="Resize panels"
        tabIndex={0}
        onMouseDown={handleResizerMouseDown}
        className="hidden shrink-0 cursor-col-resize items-center justify-center border-border bg-border md:flex"
        style={{
          width: RESIZER_WIDTH_PX,
          minWidth: RESIZER_WIDTH_PX,
          ...(isDragging ? { userSelect: "none" } : {}),
        }}
      >
        <GripVertical className="size-3 text-white/50" aria-hidden />
      </div>
      <section
        className="hidden min-h-0 min-w-0 flex-1 flex-col md:flex"
        style={isDesktop ? { flex: "1 1 0" } : undefined}
      >
        <Chat />
      </section>
    </main>
  );
}
