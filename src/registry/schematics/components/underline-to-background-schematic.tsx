export function UnderlineToBackgroundSchematic() {
  return (
    <div className="relative flex h-34 w-54 flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-background p-3 select-none dark:bg-neutral-950/80">
      <div className="flex items-center justify-between border-b border-white/10 pb-1">
        <span className="font-mono text-[9px] text-muted-foreground/60">
          UNDERLINE TO BG
        </span>
        <span className="size-1.5 rounded-full bg-primary" />
      </div>

      <div className="flex flex-col gap-2 py-1">
        {/* Normal underline state */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-10 rounded-sm bg-white/30" />
          <div className="relative">
            <span className="block h-2 w-14 rounded-sm bg-primary/70" />
            <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary" />
          </div>
          <span className="h-2 w-8 rounded-sm bg-white/20" />
        </div>

        {/* Hover expanded background state */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-6 rounded-sm bg-white/20" />
          <div className="rounded-sm bg-primary px-1.5 py-0.5">
            <span className="block h-2 w-16 rounded-xs bg-primary-foreground font-mono text-[7px]" />
          </div>
          <span className="h-2 w-10 rounded-sm bg-white/30" />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-1 font-mono text-[9px] text-muted-foreground/60">
        <span>Micro-interaction</span>
        <span className="font-medium text-primary">Hover</span>
      </div>
    </div>
  )
}
