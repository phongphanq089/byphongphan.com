export function ToggleSchematic() {
  return (
    <div className="flex h-32 w-full max-w-[240px] items-center justify-center gap-3 select-none">
      {/* Dual state pill indicator */}
      <div className="flex items-center rounded-lg border border-black/10 bg-card/80 p-1 shadow-xs dark:border-white/10 dark:bg-neutral-900/60">
        <span className="rounded px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
          False
        </span>
        <span className="rounded bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground shadow-[0_0_8px_var(--pp-primary-glow)]">
          True
        </span>
      </div>

      {/* Switch representation */}
      <div className="relative flex h-5 w-9 items-center rounded-full border border-primary/40 bg-primary/20 p-0.5">
        <div className="size-4 translate-x-4 rounded-full bg-primary shadow-xs" />
      </div>
    </div>
  )
}

export default ToggleSchematic
