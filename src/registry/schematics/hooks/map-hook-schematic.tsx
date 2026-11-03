import { ArrowRight, Database } from "lucide-react"

export function MapHookSchematic() {
  return (
    <div className="relative flex h-32 w-full max-w-[240px] items-center justify-center select-none">
      {/* Key-Value map container */}
      <div className="relative flex h-24 w-40 flex-col overflow-hidden rounded-lg border border-border/70 bg-card/60 shadow-xs">
        {/* Header */}
        <div className="flex h-5 items-center justify-between border-b border-border/50 bg-muted/40 px-2.5">
          <span className="font-mono text-[9px] font-semibold text-muted-foreground">
            Map&lt;K, V&gt;
          </span>
          <div className="flex items-center gap-1">
            <div className="size-1 rounded-full bg-primary/70" />
            <div className="size-1 rounded-full bg-primary/40" />
          </div>
        </div>

        {/* Key-Value entries */}
        <div className="flex flex-1 flex-col justify-center gap-1.5 p-2">
          {/* Entry 1 */}
          <div className="flex items-center justify-between rounded bg-muted/30 px-1.5 py-0.5 font-mono text-[9px]">
            <span className="font-medium text-primary">"theme"</span>
            <ArrowRight className="size-2 text-muted-foreground/60" />
            <span className="text-foreground/80">"dark"</span>
          </div>

          {/* Entry 2 */}
          <div className="flex items-center justify-between rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono text-[9px]">
            <span className="font-medium text-primary">"count"</span>
            <ArrowRight className="size-2 text-primary/70" />
            <span className="font-bold text-foreground">42</span>
          </div>

          {/* Entry 3 */}
          <div className="flex items-center justify-between rounded bg-muted/30 px-1.5 py-0.5 font-mono text-[9px]">
            <span className="font-medium text-primary">"auth"</span>
            <ArrowRight className="size-2 text-muted-foreground/60" />
            <span className="text-foreground/80">true</span>
          </div>
        </div>
      </div>

      {/* Floating size badge */}
      <div className="absolute right-4 bottom-2 flex items-center gap-1 rounded-full border border-primary/40 bg-background/95 px-2 py-0.5 shadow-[0_0_10px_var(--pp-primary-glow)]">
        <Database className="size-2.5 text-primary" />
        <span className="font-mono text-[9px] font-semibold text-primary">
          size: 3
        </span>
      </div>
    </div>
  )
}

export { MapHookSchematic as UseMapSchematic }
export default MapHookSchematic
