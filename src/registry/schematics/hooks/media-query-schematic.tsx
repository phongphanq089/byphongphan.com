import { Monitor, Smartphone, Tablet } from "lucide-react"

export function MediaQuerySchematic() {
  return (
    <div className="flex h-32 w-full max-w-[280px] items-center justify-center gap-2 whitespace-nowrap select-none">
      <div className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-sm border border-black/10 bg-card/50 p-2 text-muted-foreground dark:border-white/10 dark:bg-neutral-900/40">
        <Smartphone className="size-4 opacity-70" />
        <span className="font-mono text-[8px] tracking-tight">&lt; 640px</span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-sm border border-primary/40 bg-primary/10 p-2 text-foreground shadow-[0_0_12px_var(--pp-primary-glow)] dark:border-primary/70 dark:bg-primary/15">
        <Tablet className="size-4 text-primary" />
        <span className="font-mono text-[8px] font-semibold text-primary">
          640-1024px
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-sm border border-black/10 bg-card/50 p-2 text-muted-foreground dark:border-white/10 dark:bg-neutral-900/40">
        <Monitor className="size-4 opacity-70" />
        <span className="font-mono text-[8px] tracking-tight">&gt; 1024px</span>
      </div>
    </div>
  )
}

export default MediaQuerySchematic
