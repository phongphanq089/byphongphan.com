export function ElasticSliderSchematic() {
  return (
    <div className="relative flex h-34 w-54 flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-background p-3 select-none dark:bg-neutral-950/80">
      <div className="flex items-center justify-between border-b border-white/10 pb-1">
        <span className="font-mono text-[9px] text-muted-foreground/60">
          ELASTIC SLIDER
        </span>
        <span className="size-1.5 rounded-full bg-primary" />
      </div>

      <div className="relative flex h-16 w-full flex-col items-center justify-center">
        {/* Track */}
        <div className="relative flex h-7 w-full items-center justify-between overflow-hidden rounded-lg border border-white/20 bg-white/5 px-2.5">
          {/* Progress fill */}
          <div className="absolute inset-y-0 left-0 w-3/5 bg-primary/25" />

          {/* Handle */}
          <div className="absolute top-1/2 left-[60%] h-4 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-xs" />

          {/* Ticks */}
          {[20, 40, 60, 80].map((tick) => (
            <div
              key={tick}
              className="absolute top-1/2 h-1.5 w-px -translate-y-1/2 bg-white/20"
              style={{ left: `${tick}%` }}
            />
          ))}

          {/* Label & Value */}
          <span className="relative z-10 text-[9px] font-medium text-muted-foreground">
            Volume
          </span>
          <span className="relative z-10 font-mono text-[9px] font-semibold text-foreground">
            60%
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-1 font-mono text-[9px] text-muted-foreground/60">
        <span>Rubber Physics</span>
        <span className="font-medium text-primary">Decile Snap</span>
      </div>
    </div>
  )
}

export default ElasticSliderSchematic
