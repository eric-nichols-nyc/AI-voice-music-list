"use client";

import { motion } from "motion/react";
import type { ThemeKey } from "../context/ThemeContext";
import { useTheme } from "../context/ThemeContext";

type GradientSpec = {
  kind: "linear" | "radial";
  from: string;
  to: string;
  /** Optional third stop for richer gradients. */
  mid?: string;
  /** CSS gradient position, e.g. "50% 30%" or "center". */
  at?: string;
  /** CSS gradient angle, e.g. "180deg". */
  angle?: string;
};

/** Gradient stops per theme for the dynamic background. */
const THEME_GRADIENTS: Record<ThemeKey, GradientSpec> = {
  sad: {
    kind: "linear",
    from: "#0f172a",
    mid: "#0b1220",
    to: "#000000",
    angle: "180deg",
  },
  neutral: {
    kind: "linear",
    from: "#020617",
    mid: "#0b1a3a",
    to: "#000000",
    angle: "160deg",
  },
  happy: {
    kind: "radial",
    from: "#7dd3fc",
    mid: "#2563eb",
    to: "#0b1f4d",
    at: "50% 35%",
  },
};
const INITIAL_BG = {
  kind: "linear",
  from: "#05070f",
  mid: "#05060d",
  to: "#02030a",
  angle: "180deg",
} satisfies GradientSpec;

type Props = {
  /** Override theme-based colors with explicit gradient (e.g. for testing). */
  from?: string;
  to?: string;
  /** Transition duration in ms when colors change. */
  transitionMs?: number;
};

export function DynamicBackground({ from, to, transitionMs = 1200 }: Props) {
  const { theme } = useTheme();
  const preset = THEME_GRADIENTS[theme];
  const resolvedFrom = from ?? preset.from;
  const resolvedTo = to ?? preset.to;
  const resolvedMid = preset.mid ?? resolvedFrom;
  const resolvedKind = preset.kind;
  const resolvedAt = preset.at ?? "center";
  const resolvedAngle = preset.angle ?? "180deg";
  const background =
    resolvedKind === "radial"
      ? "radial-gradient(circle at var(--bg-at), var(--bg-from), var(--bg-mid), var(--bg-to))"
      : "linear-gradient(var(--bg-angle), var(--bg-from), var(--bg-mid), var(--bg-to))";

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background,
      }}
      initial={{
        "--bg-from": INITIAL_BG.from,
        "--bg-mid": INITIAL_BG.mid,
        "--bg-to": INITIAL_BG.to,
        "--bg-at": INITIAL_BG.at ?? "center",
        "--bg-angle": INITIAL_BG.angle ?? "180deg",
      }}
      animate={{
        "--bg-from": resolvedFrom,
        "--bg-mid": resolvedMid,
        "--bg-to": resolvedTo,
        "--bg-at": resolvedAt,
        "--bg-angle": resolvedAngle,
      }}
      transition={{ duration: transitionMs / 1000, ease: "easeInOut" }}
    />
  );
}
