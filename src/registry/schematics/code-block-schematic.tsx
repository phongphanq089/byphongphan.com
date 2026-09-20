import { Copy, Terminal } from "lucide-react"

export function CodeBlockSchematic() {
  return (
    <div className="flex w-full max-w-[215px] flex-col overflow-hidden rounded-lg border border-white/15 bg-neutral-950/90 font-mono shadow-xl select-none">
      {/* Header bar */}
      <div className="flex h-7 items-center justify-between border-b border-white/10 bg-white/[0.02] px-2.5">
        <div className="flex items-center gap-1.5">
          <Terminal className="size-3 text-white/40" />
          <div className="h-1.5 w-12 rounded-full bg-white/50" />
        </div>
        <Copy className="size-2.5 text-white/40" />
      </div>

      {/* Code line blocks */}
      <div className="flex flex-col gap-1.5 p-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 text-right text-[9px] text-white/25 select-none">
            1
          </span>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-8 rounded-full bg-white/35" />
            <div className="h-1.5 w-14 rounded-full bg-white/80" />
            <div className="h-1.5 w-10 rounded-full bg-emerald-400/60" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 text-right text-[9px] text-white/25 select-none">
            2
          </span>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-10 rounded-full bg-white/35" />
            <div className="h-1.5 w-16 rounded-full bg-white/70" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 text-right text-[9px] text-white/25 select-none">
            3
          </span>
          <div className="flex items-center gap-1.5 pl-2">
            <div className="h-1.5 w-12 rounded-full bg-white/40" />
            <div className="h-1.5 w-8 rounded-full bg-sky-400/60" />
          </div>
        </div>
      </div>
    </div>
  )
}
