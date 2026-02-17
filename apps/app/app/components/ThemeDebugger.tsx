"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { useTheme, type ThemeKey } from "../context/ThemeContext";

const DEV_ONLY = process.env.NODE_ENV !== "production";

const THEMES: ThemeKey[] = ["happy", "sad", "neutral"];

export function ThemeDebugger() {
  const { theme, setTheme } = useTheme();

  if (!DEV_ONLY) return null;

  return (
    <div className="flex gap-2">
      {THEMES.map((t) => (
        <Button
          className={`border-white/20 bg-white/5 text-white hover:bg-white/10 ${theme === t ? "ring-2 ring-white/50" : ""}`}
          key={t}
          onClick={() => setTheme(t)}
          size="sm"
          variant="outline"
        >
          {t}
        </Button>
      ))}
    </div>
  );
}
