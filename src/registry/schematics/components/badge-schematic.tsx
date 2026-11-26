export function BadgeSchematic() {
  return (
    <div className="relative flex h-34 w-54 flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-background p-3 select-none dark:bg-neutral-950/80">
      <div className="flex items-center justify-between border-b border-white/10 pb-1">
        <span className="font-mono text-[9px] text-muted-foreground/60">
          BADGE
        </span>
        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
      </div>

      <div className="flex flex-col items-center justify-center gap-2 py-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-medium text-emerald-400">
            <span className="size-1 rounded-full bg-emerald-400" />
            Live
          </span>
          <span className="inline-flex items-center rounded-md border border-white/20 bg-white/5 px-1.5 py-0.5 text-[9px] font-medium text-foreground">
            v3.2
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[9px] font-medium text-primary">
            Featured
          </span>
          <span className="inline-flex items-center rounded-xs border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[8px] text-muted-foreground">
            PRO
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-1 font-mono text-[9px] text-muted-foreground/60">
        <span>Precision Micro UI</span>
        <span className="font-medium text-primary">Refined</span>
      </div>
    </div>
  )
}

export default BadgeSchematic
