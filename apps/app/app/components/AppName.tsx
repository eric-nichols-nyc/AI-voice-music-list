import { AssistantIcon } from "./assistant-icon";

export const AppName = () => (
  <span className="flex items-center gap-2">
    <AssistantIcon className="size-8" />
    <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text font-semibold text-2xl tracking-tight text-transparent">
      Orb
    </span>
  </span>
);
