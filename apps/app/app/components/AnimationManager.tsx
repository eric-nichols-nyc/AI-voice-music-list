import Hal from "./Hal";

const STATIC_CANVAS_WIDTH = 480;
const STATIC_CANVAS_HEIGHT = 480;
const STATIC_AGENT_VOLUME = 0;
const STATIC_USER_VOLUME = 0;
const STATIC_ORB_STATE = "sleeping" as const;

const AnimationManager = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="rounded-lg bg-transparent p-4">
        <Hal
          width={STATIC_CANVAS_WIDTH}
          height={STATIC_CANVAS_HEIGHT}
          agentVolume={STATIC_AGENT_VOLUME}
          userVolume={STATIC_USER_VOLUME}
          orbState={STATIC_ORB_STATE}
        />
      </div>
    </div>
  );
};

export default AnimationManager;
