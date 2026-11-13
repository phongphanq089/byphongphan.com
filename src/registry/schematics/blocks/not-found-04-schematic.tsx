import { Terminal } from "lucide-react"

export function NotFound04Schematic() {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Top Header Badge */}
      <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <Terminal className="size-3 text-primary" />
        <span>ASCII SKYLINE • 404 MATRIX</span>
      </div>

      <div className="relative flex h-30 w-52 flex-col items-center justify-center overflow-hidden rounded-md border border-zinc-900/10 bg-background p-2 shadow-xs dark:border-white/10 dark:bg-zinc-950">
        {/* Background ASCII building columns skeleton */}
        <div className="absolute inset-0 flex items-end justify-between px-3 pb-1 opacity-25">
          <div className="h-16 w-4 rounded-t bg-foreground/60" />
          <div className="h-24 w-5 rounded-t bg-foreground/70" />
          <div className="h-12 w-3 rounded-t bg-foreground/50" />
          <div className="h-20 w-6 rounded-t bg-foreground/80" />
          <div className="h-14 w-4 rounded-t bg-foreground/60" />
          <div className="h-22 w-5 rounded-t bg-foreground/75" />
          <div className="h-10 w-3 rounded-t bg-foreground/45" />
        </div>

        {/* Lit Matrix Windows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-10 left-9 size-1 rounded-[1px] bg-primary" />
          <div className="absolute top-14 left-10 size-1 rounded-[1px] bg-primary" />
          <div className="absolute top-12 left-26 size-1 rounded-[1px] bg-primary" />
          <div className="absolute top-18 left-27 size-1 rounded-[1px] bg-primary" />
          <div className="absolute top-8 left-40 size-1 rounded-[1px] bg-primary" />
        </div>

        {/* Center 404 overlay (open typography directly over skyline) */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="font-mono text-2xl font-black tracking-tighter text-foreground drop-shadow-sm">
            404
          </span>
          <span className="font-mono text-[6.5px] font-semibold text-muted-foreground uppercase">
            ASCII CITYSCAPE
          </span>
        </div>
      </div>
    </div>
  )
}
