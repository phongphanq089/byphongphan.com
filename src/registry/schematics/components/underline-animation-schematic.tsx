export function UnderlineAnimationSchematic() {
  return (
    <div className="relative flex h-34 w-54 flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-background p-3 select-none dark:bg-neutral-950/80">
      <div className="flex items-center justify-between border-b border-white/10 pb-1">
        <span className="font-mono text-[9px] text-muted-foreground/60">
          UNDERLINE ANIMATION
        </span>
        <span className="size-1.5 rounded-full bg-primary" />
      </div>

      <div className="flex flex-col gap-2.5 py-1">
        {/* Idle state: text without underline */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-12 rounded-sm bg-white/20" />
          <span className="h-2 w-16 rounded-sm bg-white/30" />
          <span className="h-2 w-10 rounded-sm bg-white/15" />
        </div>

        {/* Hover center-expanding underline */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-8 rounded-sm bg-white/20" />
          <div className="relative flex flex-col items-center">
            <span className="block h-2 w-20 rounded-sm bg-primary/80" />
            <span className="absolute -bottom-1 h-0.5 w-full rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
          </div>
          <span className="h-2 w-6 rounded-sm bg-white/15" />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-1 font-mono text-[9px] text-muted-foreground/60">
        <span>Origin: Center</span>
        <span className="font-medium text-primary">Active</span>
      </div>
    </div>
  )
}
