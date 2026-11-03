import { Lock } from "lucide-react"

export function PreventBodyScrollSchematic() {
  return (
    <div className="relative flex h-32 w-full max-w-[240px] items-center justify-center select-none">
      {/* Mockup browser window */}
      <div className="relative flex h-20 w-36 flex-col overflow-hidden rounded-lg border border-border/70 bg-card/60 shadow-xs">
        {/* Window header */}
        <div className="flex h-4 items-center gap-1 border-b border-border/50 bg-muted/40 px-2">
          <div className="size-1.5 rounded-full bg-red-500/60" />
          <div className="size-1.5 rounded-full bg-yellow-500/60" />
          <div className="size-1.5 rounded-full bg-green-500/60" />
        </div>

        {/* Window body with locked scrollbar */}
        <div className="relative flex flex-1 items-center justify-center p-2">
          {/* Content lines */}
          <div className="flex flex-1 flex-col gap-1.5 opacity-40">
            <div className="h-1.5 w-16 rounded bg-muted-foreground" />
            <div className="h-1.5 w-20 rounded bg-muted-foreground" />
            <div className="h-1.5 w-12 rounded bg-muted-foreground" />
          </div>

          {/* Locked scrollbar bar */}
          <div className="flex h-full w-2 flex-col items-center justify-center rounded-full bg-muted/40">
            <div className="h-4 w-1 rounded-full bg-primary/80" />
          </div>
        </div>
      </div>

      {/* Floating lock badge */}
      <div className="absolute right-6 bottom-4 flex items-center gap-1 rounded-full border border-primary/40 bg-background/95 px-2 py-0.5 shadow-[0_0_10px_var(--pp-primary-glow)]">
        <Lock className="size-2.5 text-primary" />
        <span className="font-mono text-[9px] font-semibold text-primary">
          Locked
        </span>
      </div>
    </div>
  )
}

export default PreventBodyScrollSchematic
