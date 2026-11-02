import { Search } from "lucide-react"

export function DebounceSchematic() {
  return (
    <div className="flex h-32 w-full max-w-[260px] items-center justify-between gap-3 px-2 select-none">
      {/* Search Bar Input */}
      <div className="flex flex-1 items-center gap-2 rounded-sm border border-black/10 bg-card/80 px-2.5 py-2 shadow-xs dark:border-white/10 dark:bg-neutral-900/60">
        <Search className="size-3.5 text-muted-foreground/70" />
        <span className="font-sans text-[11px] text-muted-foreground">
          Search...
        </span>
      </div>

      {/* Throttle / Debounce indicator dots */}
      <div className="flex items-center gap-1.5 pr-1">
        <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_var(--pp-primary-glow)]" />
        <span className="size-2 rounded-full bg-primary/70" />
        <span className="size-2 rounded-full bg-primary/40" />
        <span className="size-2 rounded-full bg-primary/20" />
      </div>
    </div>
  )
}

export default DebounceSchematic
