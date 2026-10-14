import { Copy, Terminal } from "lucide-react"

export function CodeBlockSchematic() {
  return (
    <div className="flex w-full max-w-[415px] flex-col overflow-hidden rounded-lg border bg-muted font-mono select-none dark:bg-neutral-950/90">
      {/* Header bar */}
      <div className="flex h-7 items-center justify-between border-b border-white/10 bg-white/[0.02] px-2.5">
        <div className="flex items-center gap-1.5">
          <Terminal className="size-3 dark:text-white/40" />
          <div className="h-1.5 w-12 rounded-full bg-black dark:bg-white/50" />
        </div>
        <Copy className="size-2.5 dark:text-white/40" />
      </div>

      {/* Code line blocks */}
      <div className="flex flex-col gap-1.5 p-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 text-right text-[9px] select-none dark:text-white/25">
            1
          </span>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-30 rounded-full bg-black dark:bg-white/50" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 text-right text-[9px] select-none dark:text-white/25">
            2
          </span>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-30 rounded-full bg-black dark:bg-white/50" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 text-right text-[9px] select-none dark:text-white/25">
            3
          </span>
          <div className="flex items-center gap-1.5 pl-2">
            <div className="h-1.5 w-30 rounded-full bg-black dark:bg-white/50" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 text-right text-[9px] select-none dark:text-white/25">
            4
          </span>
          <div className="flex items-center gap-1.5 pl-2">
            <div className="h-1.5 w-30 rounded-full bg-black dark:bg-white/50" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 text-right text-[9px] select-none dark:text-white/25">
            5
          </span>
          <div className="flex items-center gap-1.5 pl-2">
            <div className="h-1.5 w-30 rounded-full bg-black dark:bg-white/50" />
          </div>
        </div>
      </div>
    </div>
  )
}
