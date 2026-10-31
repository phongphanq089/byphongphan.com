export function RailScrollScrubberSchematic() {
  return (
    <div className="relative flex h-28 w-44 items-center justify-between overflow-hidden rounded-xl border border-white/10 bg-accent/70 p-3 font-mono shadow-md select-none dark:bg-neutral-950/70">
      {/* Left Skeleton section lines */}
      <div className="flex flex-col gap-1.5 opacity-40">
        <div className="h-2 w-16 rounded bg-foreground/60" />
        <div className="h-1.5 w-24 rounded bg-foreground/30" />
        <div className="h-1.5 w-20 rounded bg-foreground/20" />
        <div className="mt-1 flex gap-1">
          <div className="h-4 w-7 rounded bg-foreground/15" />
          <div className="h-4 w-7 rounded bg-foreground/15" />
        </div>
      </div>

      {/* Right Rail Track & Ticks */}
      <div className="relative flex h-full w-14 items-center justify-end">
        {/* Curved Rail Path SVG */}
        <svg
          viewBox="0 0 60 100"
          className="absolute inset-0 h-full w-full stroke-primary/40"
          fill="none"
        >
          <path
            d="M 10 15 L 35 15 A 12 12 0 0 1 47 27 L 47 70 A 12 12 0 0 1 35 82 L 10 82"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
        </svg>

        {/* Laser Indicator Line */}
        <div className="absolute top-[48%] right-0 z-10 flex items-center">
          <span className="mr-1 text-[8px] font-bold text-primary">047%</span>
          <div className="h-[2px] w-6 bg-primary shadow-[0_0_6px_var(--primary)]" />
        </div>

        {/* Vertical Ruler Ticks */}
        <div className="flex h-full flex-col justify-between py-1 opacity-60">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`h-[1px] self-end bg-foreground/50 ${
                i % 2 === 0 ? "w-3" : "w-1.5"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
