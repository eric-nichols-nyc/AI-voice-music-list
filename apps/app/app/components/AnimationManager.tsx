"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { VolumeX } from "lucide-react";
import {
  ORB_THEMES,
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

const AnimationManager = () => {
  const { orbTheme, setOrbTheme, setStatus } = useVoiceBot();

  const handleOrbClick = () => {
    setOrbTheme("neutral");
    setStatus(VoiceBotStatus.LISTENING);
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4">
      <Button
        aria-label="Mute or cancel sound"
        className="absolute top-2 right-2 z-10 size-10 shrink-0 rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={() => {
          /* dummy: mute not implemented */
        }}
        size="icon"
        variant="ghost"
      >
        <VolumeX className="size-5" />
      </Button>
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
          colors={ORB_THEMES[orbTheme]}
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
