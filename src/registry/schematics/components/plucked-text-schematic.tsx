export function PluckedTextSchematic() {
  return (
    <div className="relative flex h-34 w-54 flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-background p-3 select-none dark:bg-neutral-950/80">
      <div className="flex items-center justify-between border-b border-white/10 pb-1">
        <span className="font-mono text-[9px] text-muted-foreground/60">
          PLUCKED TEXT
        </span>
        <span className="size-1.5 rounded-full bg-primary" />
      </div>

      <div className="relative flex h-14 flex-col items-center justify-center">
        {/* Curving string schematic */}
        <svg
          className="absolute inset-x-0 h-10 w-full overflow-visible"
          viewBox="0 0 200 40"
          fill="none"
        >
          <path
            d="M 10 20 Q 100 35 190 20"
            stroke="currentColor"
            className="text-primary/70"
            strokeWidth="1.5"
          />
          <circle cx="10" cy="20" r="2.5" className="fill-primary" />
          <circle cx="190" cy="20" r="2.5" className="fill-primary" />
        </svg>

        <span className="relative z-10 font-mono text-lg font-black tracking-widest text-foreground">
          PLUCK
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-1 font-mono text-[9px] text-muted-foreground/60">
        <span>String Physics</span>
        <span className="font-medium text-primary">Harmonic Wave</span>
      </div>
    </div>
  )
}
