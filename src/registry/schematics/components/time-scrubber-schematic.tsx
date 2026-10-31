export function TimeScrubberSchematic() {
  return (
    <div className="flex w-[210px] flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-accent/70 px-4 py-3 font-mono shadow-md select-none dark:bg-neutral-950/70">
      {/* Time Readout */}
      <div className="flex items-baseline gap-1 font-mono">
        <span className="text-base font-semibold tracking-tight text-foreground">
          09:30:45
        </span>
        <span className="text-[10px] font-medium text-muted-foreground">
          AM
        </span>
      </div>

      {/* Mini Dial Ruler */}
      <div className="relative flex h-8 w-full items-center justify-center overflow-hidden rounded-md border border-white/5 bg-neutral-900/40">
        {/* Ticks */}
        <div className="relative flex h-full w-full items-start justify-center gap-1.5 pt-1">
          <span className="h-2 w-0.5 rounded-full bg-foreground/20" />
          <span className="h-3 w-0.5 rounded-full bg-foreground/35" />
          <span className="h-2 w-0.5 rounded-full bg-foreground/50" />
          <span className="h-4 w-0.5 rounded-full bg-foreground/75" />
          <span className="h-2 w-0.5 rounded-full bg-foreground/90" />
          {/* Center Mark */}
          <span className="h-5 w-0.5 rounded-full bg-red-500 shadow-xs" />
          <span className="h-2 w-0.5 rounded-full bg-foreground/90" />
          <span className="h-4 w-0.5 rounded-full bg-foreground/75" />
          <span className="h-2 w-0.5 rounded-full bg-foreground/50" />
          <span className="h-3 w-0.5 rounded-full bg-foreground/35" />
          <span className="h-2 w-0.5 rounded-full bg-foreground/20" />
        </div>
      </div>
    </div>
  )
}
