export function DrawerSchematic() {
  return (
    <div className="relative flex h-34 w-54 flex-col justify-end overflow-hidden rounded-xl border border-white/15 bg-muted/40 p-2.5 select-none dark:bg-neutral-950/80">
      {/* Background dimmed simulated page content */}
      <div className="absolute inset-x-3 top-2.5 flex flex-col gap-1.5 opacity-30">
        <div className="h-1.5 w-16 rounded bg-black/50 dark:bg-white/60" />
        <div className="h-1.5 w-28 rounded bg-black/30 dark:bg-white/40" />
      </div>

      {/* Dimmed backdrop */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] dark:bg-black/30" />

      {/* Bottom Sheet Drawer Surface */}
      <div className="relative flex flex-col rounded-t-xl border border-b-0 border-white/20 bg-card p-2 shadow-md dark:bg-neutral-900">
        {/* Drag handle pill */}
        <div className="mx-auto mb-1.5 h-1 w-8 rounded-full bg-muted-foreground/40" />

        {/* Header */}
        <div className="mb-1.5 flex items-center justify-between">
          <div className="h-1.5 w-14 rounded bg-primary" />
          <div className="size-1.5 rounded-full bg-white/30" />
        </div>

        {/* Content rows */}
        <div className="flex flex-col gap-1">
          <div className="h-1 w-24 rounded bg-white/40" />
          <div className="h-1 w-16 rounded bg-white/25" />
        </div>

        {/* Footer buttons */}
        <div className="mt-2 flex items-center justify-end gap-1.5 border-t border-white/10 pt-1">
          <div className="h-3 w-8 rounded bg-muted dark:bg-neutral-800" />
          <div className="h-3 w-10 rounded bg-primary" />
        </div>
      </div>
    </div>
  )
}
