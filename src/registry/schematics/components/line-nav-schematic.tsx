const ITEMS = [
  { active: true, width: 44 },
  { active: false, width: 24 },
  { active: false, width: 24 },
  { active: false, width: 24 },
  { active: false, width: 24 },
  { active: false, width: 24 },
]

export function LineNavSchematic() {
  return (
    <div className="relative flex h-34 w-54 flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-background p-3 select-none dark:bg-neutral-950/80">
      <div className="flex items-center justify-between border-b border-white/10 pb-1">
        <span className="font-mono text-[9px] text-muted-foreground/60">
          LINE NAV
        </span>
        <span className="size-1.5 rounded-full bg-primary" />
      </div>

      <div className="flex flex-col gap-1.5 py-1">
        {ITEMS.map((item, index) => (
          <div key={index} className="flex h-3 items-center gap-3">
            <div className="flex h-full w-8 shrink-0 items-center">
              <span
                className={
                  item.active
                    ? "block h-0.5 w-10 bg-primary shadow-[0_0_8px_var(--primary)]"
                    : "block h-px w-6 bg-white/20"
                }
              />
            </div>
            <div className="flex min-w-0 flex-1 items-center">
              <span
                className={
                  item.active
                    ? "block h-1.5 w-20 rounded bg-primary/70"
                    : "block h-1 w-14 rounded bg-white/20"
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-1 font-mono text-[9px] text-muted-foreground/60">
        <span>Spring Kinematics</span>
        <span className="font-medium text-primary">Active</span>
      </div>
    </div>
  )
}
