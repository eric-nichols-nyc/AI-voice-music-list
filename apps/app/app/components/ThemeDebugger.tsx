"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  type OrbThemeKey,
  useVoiceBot,
} from "../context/VoiceBotContextProvider";

const TESTING = process.env.TESTING;

const THEMES: OrbThemeKey[] = ["happy", "sad", "neutral"];

export function ThemeDebugger() {
  const { orbTheme, setOrbTheme } = useVoiceBot();

  if (!TESTING) return null;

  return (
    <div className="flex gap-2">
      {THEMES.map((t) => (
        <Button
          className={`border-white/20 bg-white/5 text-white hover:bg-white/10 ${orbTheme === t ? "ring-2 ring-white/50" : ""}`}
          key={t}
          onClick={() => setOrbTheme(t)}
          size="sm"
          variant="outline"
        >
          {t}
        </Button>
      ))}
    </div>
  );
}
