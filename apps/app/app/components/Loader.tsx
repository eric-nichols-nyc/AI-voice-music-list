"use client";

const LOADER_GRADIENT =
  "linear-gradient(90deg, #2563eb, #14b8a6, #3b82f6, #eab308, #2563eb)";

export const Loader = () => (
  <div className="flex items-center justify-center gap-3">
    <div
      className="size-5 shrink-0 rounded-full border-2 border-white/20"
      style={{
        borderTopColor: "#14b8a6",
        animation: "loader-spin 0.8s linear infinite",
      }}
      aria-hidden
    />
    <span
      className="inline-block bg-clip-text text-lg font-medium tracking-wide text-transparent"
      style={{
        backgroundImage: LOADER_GRADIENT,
        backgroundSize: "200% 100%",
        animation: "loader-shimmer 1.5s ease-in-out infinite",
      }}
    >
      analyzing..
    </span>
  </div>
);
