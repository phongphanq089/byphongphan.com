import { Copy, Terminal } from "lucide-react"

export function CodeBlockSchematic() {
  return (
    <div className="flex h-34 w-54 flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-muted font-mono select-none dark:bg-neutral-950/90">
      {/* Header bar */}
      <div className="flex h-6 items-center justify-between border-b border-white/10 bg-white/[0.02] px-2.5">
        <div className="flex items-center gap-1.5">
          <Terminal className="size-2.5 text-muted-foreground" />
          <div className="h-1.5 w-14 rounded-full bg-white/50" />
        </div>
        <Copy className="size-2.5 text-muted-foreground" />
      </div>

      {/* Code line blocks */}
      <div className="flex flex-col gap-1.5 px-2.5 py-1 text-[9px]">
        <div className="flex items-center gap-2">
          <span className="w-2 text-right text-muted-foreground/40">1</span>
          <div className="h-1.5 w-24 rounded-full bg-primary/60" />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 text-right text-muted-foreground/40">2</span>
          <div className="h-1.5 w-32 rounded-full bg-white/50" />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 text-right text-muted-foreground/40">3</span>
          <div className="h-1.5 w-20 rounded-full bg-white/30" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/10 px-2.5 py-1 text-[8px] text-muted-foreground/50">
        <span>TypeScript</span>
        <span>UTF-8</span>
      </div>
    </div>
  )
}
