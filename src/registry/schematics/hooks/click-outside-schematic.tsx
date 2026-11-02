import { MousePointer2 } from "lucide-react"

export function ClickOutsideSchematic() {
  return (
    <div className="relative flex h-32 w-full max-w-[260px] items-center justify-between px-2 select-none">
      <div className="flex w-28 flex-col gap-1 rounded-lg border border-black/10 bg-card/90 p-1.5 shadow-sm backdrop-blur-xs dark:border-white/10 dark:bg-neutral-900/90">
        <div className="rounded bg-accent/70 px-2 py-1 text-[10px] font-medium text-foreground">
          Option 1
        </div>
        <div className="rounded px-2 py-1 text-[10px] text-muted-foreground">
          Option 2
        </div>
        <div className="rounded px-2 py-1 text-[10px] text-muted-foreground">
          Option 3
        </div>
      </div>

      {/* Target indicator on right with concentric rings and pointer */}
      <div className="relative flex size-18 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-primary/20 bg-primary/5" />
        <div className="absolute inset-2.5 rounded-full border border-primary/30" />
        <div className="size-2 rounded-full bg-primary shadow-[0_0_8px_var(--pp-primary-glow)]" />
        <MousePointer2 className="absolute -right-1 -bottom-1 size-4 fill-foreground text-background drop-shadow-sm" />
      </div>
    </div>
  )
}

export default ClickOutsideSchematic
