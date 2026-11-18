export function MiddleTruncationSchematic() {
  return (
    <div className="flex h-34 w-54 flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-muted/60 p-3 select-none dark:bg-neutral-950/80">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1 font-mono text-[9px] text-muted-foreground/60">
        <span>FILE PATH</span>
        <span className="size-1.5 rounded-full bg-primary" />
      </div>

      {/* File pill with middle truncation badge */}
      <div className="flex items-center justify-between gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 font-mono text-[10px]">
        <span className="truncate text-white/90">component</span>
        <span className="rounded bg-primary/20 px-1 py-0.5 text-[8px] font-bold text-primary">
          ...
        </span>
        <span className="shrink-0 text-white/60">.tsx</span>
      </div>

      {/* Hash / Address representation */}
      <div className="flex items-center justify-between gap-1 rounded-md border border-white/5 bg-white/[0.02] px-2 py-1 font-mono text-[9px]">
        <span className="text-white/50">12x71Ca...</span>
        <span className="text-primary/70">b947</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/10 pt-1 font-mono text-[8px] text-muted-foreground/60">
        <span>Ellipsis: Center</span>
        <span className="font-medium text-primary">Zero-Shift</span>
      </div>
    </div>
  )
}
