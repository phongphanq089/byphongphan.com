import { ArrowDown } from "lucide-react"

export function ScrollPositionSchematic() {
  return (
    <div className="relative flex h-32 w-full max-w-[240px] items-center justify-center select-none">
      {/* Mockup browser window */}
      <div className="relative flex h-22 w-38 flex-col overflow-hidden rounded-lg border border-border/70 bg-card/60 shadow-xs">
        {/* Window header */}
        <div className="flex h-4 items-center justify-between border-b border-border/50 bg-muted/40 px-2">
          <div className="flex items-center gap-1">
            <div className="size-1.5 rounded-full bg-red-500/60" />
            <div className="size-1.5 rounded-full bg-yellow-500/60" />
            <div className="size-1.5 rounded-full bg-green-500/60" />
          </div>
          <div className="h-1.5 w-10 rounded bg-muted-foreground/30" />
        </div>

        {/* Window body */}
        <div className="relative flex flex-1 items-stretch p-2">
          {/* Content lines indicating scrolled content */}
          <div className="flex flex-1 flex-col gap-1.5 opacity-40">
            <div className="h-1.5 w-20 rounded bg-muted-foreground" />
            <div className="h-1.5 w-14 rounded bg-muted-foreground" />
            <div className="h-1.5 w-18 rounded bg-muted-foreground" />
            <div className="h-1.5 w-10 rounded bg-muted-foreground" />
          </div>

          {/* Active scrollbar with positioned thumb */}
          <div className="ml-1 flex h-full w-1.5 flex-col rounded-full bg-muted/50 p-0.5">
            <div className="mt-2 h-4 w-full rounded-full bg-primary/90 shadow-[0_0_8px_var(--pp-primary-glow)]" />
          </div>
        </div>
      </div>

      {/* Floating scroll coordinate pill */}
      <div className="absolute right-5 bottom-3 flex items-center gap-1.5 rounded-full border border-primary/40 bg-background/95 px-2.5 py-0.5 shadow-[0_0_12px_var(--pp-primary-glow)]">
        <ArrowDown className="size-2.5 animate-bounce text-primary" />
        <span className="font-mono text-[9px] font-semibold text-primary">
          y: 420
        </span>
      </div>
    </div>
  )
}

export default ScrollPositionSchematic
