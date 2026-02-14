import Link from "next/link";
import { AssistantIcon } from "./assistant-icon";

const NEUTRAL_GRADIENT =
  "linear-gradient(to right, #2563eb, #14b8a6, #3b82f6)";

export const AppName = () => (
  <Link
    href="/"
    className="flex w-fit items-center gap-2 drop-shadow-md transition-opacity hover:opacity-90 active:opacity-80"
    aria-label="Hal home"
  >
    <AssistantIcon className="size-8" />
    <span
      className="bg-clip-text font-semibold text-2xl tracking-tight text-transparent"
      style={{ backgroundImage: NEUTRAL_GRADIENT }}
    >
      Hal
    </span>
  </Link>
);
