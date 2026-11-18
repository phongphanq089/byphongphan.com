export function Letter3DSwapSchematic() {
  const CUBES = [
    { char: "3", rotated: true },
    { char: "D", rotated: true },
    { char: "S", rotated: false },
    { char: "W", rotated: false },
    { char: "A", rotated: false },
    { char: "P", rotated: false },
  ]

  return (
    <div className="relative flex h-34 w-54 flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-background p-3 select-none dark:bg-neutral-950/80">
      <div className="flex items-center justify-between border-b border-white/10 pb-1">
        <span className="font-mono text-[9px] text-muted-foreground/60">
          LETTER 3D SWAP
        </span>
        <span className="size-1.5 rounded-full bg-primary" />
      </div>

      <div className="flex items-center justify-center gap-1.5 py-2">
        {CUBES.map((cube, idx) => (
          <div
            key={idx}
            className={`flex size-7 items-center justify-center rounded-md border font-mono text-xs font-bold transition-all ${
              cube.rotated
                ? "-translate-y-0.5 border-primary/50 bg-primary/20 text-primary shadow-[0_0_10px_var(--primary)]"
                : "border-white/20 bg-white/5 text-muted-foreground"
            }`}
          >
            {cube.char}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-1 font-mono text-[9px] text-muted-foreground/60">
        <span>Isometric Stagger</span>
        <span className="font-medium text-primary">Active</span>
      </div>
    </div>
  )
}
