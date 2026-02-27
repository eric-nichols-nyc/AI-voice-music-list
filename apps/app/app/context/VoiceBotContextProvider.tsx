"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type OrbThemeKey = "sad" | "neutral" | "happy";

/** Orb color palettes per theme (transparent, shadow, dusk, steel, ash, mist, gloom, navy). */
export const ORB_THEMES: Record<OrbThemeKey, readonly string[]> = {
  happy: [
    "transparent",
    "#22c55ecc",
    "#4ade80cc",
    "#facc15cc",
    "#fb923ccc",
    "#a5f3fccc",
    "#c084fccc",
    "#38bdf8cc",
  ],
  sad: [
    "transparent",
    "#0f172acc",
    "#1e293bcc",
    "#334155cc",
    "#475569cc",
    "#64748bcc",
    "#3b0764cc",
    "#172554cc",
  ],
  neutral: [
    "transparent",
    "#2563ebcc",
    "#14b8a6cc",
    "#3b82f6cc",
    "#2dd4bfcc",
    "#93c5fdcc",
    "#5eead4cc",
    "#dbeafecc",
  ],
} as const;

export const VoiceBotStatus = {
  NONE: "none",
  LISTENING: "listening",
  THINKING: "thinking",
  SPEAKING: "speaking",
  SLEEPING: "sleeping",
} as const;

export type VoiceBotStatusType =
  (typeof VoiceBotStatus)[keyof typeof VoiceBotStatus];

type VoiceBotContextValue = {
  status: VoiceBotStatusType;
  setStatus: (status: VoiceBotStatusType) => void;
  orbTheme: OrbThemeKey;
  setOrbTheme: (theme: OrbThemeKey) => void;
};

const VoiceBotContext = createContext<VoiceBotContextValue | null>(null);

export function VoiceBotProvider({ children }: { children: ReactNode }) {
  const [status, setStatusState] = useState<VoiceBotStatusType>(
    VoiceBotStatus.SLEEPING,
  );
  const [orbTheme, setOrbThemeState] = useState<OrbThemeKey>("sad");
  const setStatus = useCallback((s: VoiceBotStatusType) => setStatusState(s), []);
  const setOrbTheme = useCallback((t: OrbThemeKey) => setOrbThemeState(t), []);
  const value = useMemo(
    () => ({ status, setStatus, orbTheme, setOrbTheme }),
    [status, setStatus, orbTheme, setOrbTheme],
  );
  return (
    <VoiceBotContext.Provider value={value}>
      {children}
    </VoiceBotContext.Provider>
  );
}

export function useVoiceBot(): VoiceBotContextValue {
  const ctx = useContext(VoiceBotContext);
  if (!ctx) {
    throw new Error("useVoiceBot must be used within a VoiceBotProvider");
  }
  return ctx;
}
