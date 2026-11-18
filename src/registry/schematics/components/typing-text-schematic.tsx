export function TypingTextSchematic() {
  return (
    <div className="relative flex h-34 w-54 flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-background p-3 select-none dark:bg-neutral-950/80">
      <div className="flex items-center justify-between border-b border-white/10 pb-1">
        <span className="font-mono text-[9px] text-muted-foreground/60">
          TYPING TEXT
        </span>
        <span className="size-1.5 rounded-full bg-primary" />
      </div>

      <div className="flex flex-col gap-2 py-2">
        {/* Typed phrase with blinking caret */}
        <div className="flex items-center gap-1 font-mono text-xs font-semibold">
          <span className="text-foreground">Hello,</span>
          <span className="font-bold text-primary">World</span>
          <span className="h-3.5 w-0.5 bg-primary shadow-[0_0_8px_var(--primary)]" />
        </div>

        {/* Selection sweep preview indicator */}
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-8 rounded-sm bg-white/20" />
          <span className="h-1.5 w-12 rounded-sm bg-primary/40" />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-1 font-mono text-[9px] text-muted-foreground/60">
        <span>Organic Speed & Typos</span>
        <span className="font-medium text-primary">Active</span>
      </div>
    </div>
  )
}
