export function DrawerSchematic() {
  return (
    <div className="relative flex h-36 w-full max-w-[320px] flex-col justify-end overflow-hidden rounded-lg border border-black/10 bg-muted/40 p-2 select-none dark:border-white/15 dark:bg-neutral-900/60">
      {/* Background dimmed simulated page content */}
      <div className="absolute inset-x-3 top-3 flex flex-col gap-1.5 opacity-30">
        <div className="h-2 w-20 rounded bg-black/50 dark:bg-white/60" />
        <div className="h-1.5 w-32 rounded bg-black/30 dark:bg-white/40" />
        <div className="h-1.5 w-24 rounded bg-black/30 dark:bg-white/40" />
      </div>

      {/* Dimmed backdrop */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] dark:bg-black/30" />

      {/* Bottom Sheet Drawer Surface */}
      <div className="relative flex flex-col rounded-t-xl border border-b-0 border-black/10 bg-card p-2.5 shadow-md dark:border-white/20 dark:bg-neutral-900">
        {/* Drag handle pill */}
        <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-muted-foreground/30" />

        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <div className="h-2 w-16 rounded bg-pp-primary/80 dark:bg-pp-primary" />
          <div className="size-2 rounded-full bg-black/20 dark:bg-white/30" />
        </div>

        {/* Content rows */}
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-28 rounded bg-black/30 dark:bg-white/40" />
          <div className="h-1.5 w-20 rounded bg-black/20 dark:bg-white/30" />
        </div>

        {/* Footer buttons */}
        <div className="mt-2.5 flex items-center justify-end gap-1.5 border-t border-black/5 pt-1 dark:border-white/10">
          <div className="h-3 w-8 rounded bg-muted dark:bg-neutral-800" />
          <div className="h-3 w-10 rounded bg-pp-primary/70 dark:bg-pp-primary" />
        </div>
      </div>
    </div>
  )
}
