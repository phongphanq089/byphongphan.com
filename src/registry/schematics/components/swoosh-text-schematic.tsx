export function SwooshTextSchematic() {
  const LAYERS = [
    { offset: 6, color: "text-primary/30" },
    { offset: 4, color: "text-primary/60" },
    { offset: 2, color: "text-primary/80" },
    { offset: 0, color: "text-foreground font-black" },
  ]

  return (
    <div className="relative flex h-34 w-54 flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-background p-3 select-none dark:bg-neutral-950/80">
      <div className="flex items-center justify-between border-b border-white/10 pb-1">
        <span className="font-mono text-[9px] text-muted-foreground/60">
          SWOOSH TEXT
        </span>
        <span className="size-1.5 rounded-full bg-primary" />
      </div>

      <div className="relative flex h-14 items-center justify-center py-2">
        {LAYERS.map((layer, idx) => (
          <span
            key={idx}
            className={`absolute font-mono text-xl tracking-widest ${layer.color}`}
            style={{
              transform: `translate(${layer.offset * 1.5}px, ${layer.offset * 1.5}px)`,
            }}
          >
            SWOOSH
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-1 font-mono text-[9px] text-muted-foreground/60">
        <span>Dynamic 3D Light</span>
        <span className="font-medium text-primary">Interactive</span>
      </div>
    </div>
  )
}
