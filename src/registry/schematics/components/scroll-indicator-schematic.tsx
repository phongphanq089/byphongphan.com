export function ScrollIndicatorSchematic() {
  return (
    <div className="relative flex h-28 w-44 items-center justify-between overflow-hidden rounded-xl border border-white/10 bg-accent/70 p-3 font-mono shadow-md select-none dark:bg-neutral-950/70">
      {/* Left Skeleton section badges */}
      <div className="flex flex-col gap-1.5 opacity-60">
        <div className="h-3 w-16 rounded border border-primary/40 bg-primary/20" />
        <div className="h-2.5 w-20 rounded bg-foreground/20" />
        <div className="h-2.5 w-14 rounded bg-foreground/20" />
        <div className="h-2.5 w-18 rounded bg-foreground/20" />
      </div>

      {/* Right Ruler Track & Laser Indicator */}
      <div className="relative flex h-full w-12 items-center justify-end">
        {/* Vertical Rail Spine */}
        <div className="absolute top-0 right-0 bottom-0 w-px bg-white/20" />

        {/* Laser Indicator Line */}
        <div className="absolute top-[38%] right-0 z-10 flex items-center">
          <div className="h-[2.5px] w-7 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
        </div>

        {/* Ruler Ticks */}
        <div className="flex h-full flex-col justify-between py-1 opacity-70">
          {[...Array(11)].map((_, i) => (
            <div
              key={i}
              className={`self-end rounded-full ${
                i === 4
                  ? "h-[2px] w-6 bg-primary"
                  : i % 2 === 0
                    ? "h-[1.5px] w-5 bg-foreground/70"
                    : "h-[1px] w-2.5 bg-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
