"use client";

const Hal = () => {
  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex shrink-0 items-center gap-3 border-b border-border bg-background px-4 py-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-red-500/80 bg-red-950/90 text-red-400 shadow-inner"
          aria-hidden
        >
          <span className="text-lg font-light">●</span>
        </div>
        <div>
          <h2 className="font-semibold text-sm tracking-wide">HAL 9000</h2>
          <p className="text-muted-foreground text-xs">Heuristically programmed</p>
        </div>
      </header>

      <div className="min-h-0 flex-1 flex flex-col items-center justify-center p-6">
        <p className="text-muted-foreground text-center text-sm">
          I am putting myself to the fullest possible use.
        </p>
      </div>
    </div>
  );
};

export default Hal;
