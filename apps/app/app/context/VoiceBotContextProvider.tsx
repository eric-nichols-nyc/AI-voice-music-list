"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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
};

const VoiceBotContext = createContext<VoiceBotContextValue | null>(null);

export function VoiceBotProvider({ children }: { children: ReactNode }) {
  const [status, setStatusState] = useState<VoiceBotStatusType>(
    VoiceBotStatus.SLEEPING,
  );
  const setStatus = useCallback((s: VoiceBotStatusType) => setStatusState(s), []);
  const value = useMemo(
    () => ({ status, setStatus }),
    [status, setStatus],
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
