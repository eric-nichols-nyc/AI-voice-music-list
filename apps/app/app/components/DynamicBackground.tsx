"use client";

/** Static full-page background. Single dark blue gradient, no theme or animation. */
export function DynamicBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          "linear-gradient(180deg, #0c1929 0%, #0a1628 50%, #020617 100%)",
      }}
    />
  );
}
