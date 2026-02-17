"use client";

import { useTheme } from "../context/ThemeContext";
import {
  useVoiceBot,
  VoiceBotStatus,
} from "../context/VoiceBotContextProvider";
import Hal from "./Hal";
import { Loader } from "./Loader";
import { ThemeDebugger } from "./ThemeDebugger";

const STATIC_CANVAS_WIDTH = 480;
const STATIC_CANVAS_HEIGHT = 480;
const STATIC_AGENT_VOLUME = 0;
const STATIC_USER_VOLUME = 0;

/** Indices: transparent, shadow, dusk, steel, ash, mist, gloom, navy */
const ORB_THEMES = {
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

const AnimationManager = () => {
  const { theme, setTheme } = useTheme();
  const { setStatus } = useVoiceBot();

  const handleOrbClick = () => {
    setTheme("neutral");
    setStatus(VoiceBotStatus.LISTENING);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <ThemeDebugger />
      <div
        className="flex min-h-0 min-w-0 flex-1 cursor-pointer items-center justify-center p-4"
        onClick={handleOrbClick}
        onKeyDown={(e) => e.key === "Enter" && handleOrbClick()}
        role="button"
        tabIndex={0}
      >
        <Hal
          agentVolume={STATIC_AGENT_VOLUME}
          canvasClassName="max-h-full max-w-full"
          colors={ORB_THEMES[theme]}
          height={STATIC_CANVAS_HEIGHT}
          userVolume={STATIC_USER_VOLUME}
          width={STATIC_CANVAS_WIDTH}
        />
      </div>
      <Loader />
    </div>
  );
};

export default AnimationManager;
