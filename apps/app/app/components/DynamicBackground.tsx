"use client";

import type { ThemeKey } from "../context/ThemeContext";
import { useTheme } from "../context/ThemeContext";

/** Gradient stops [from, to] per theme for the dynamic background. */
const THEME_GRADIENTS: Record<ThemeKey, { from: string; to: string }> = {
  sad: { from: "#0f172a", to: "#000000" },
  neutral: { from: "#020617", to: "#000" }, //020617 2b4e99
  happy: {
    from: "#2563eb", // bright blue
    to: "#1e3a8a", // rich navy
  },
};

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

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: `linear-gradient(to bottom, ${resolvedFrom}, ${resolvedTo})`,
        transition: `background ${transitionMs}ms ease-in-out`,
      }}
    />
  );
}
