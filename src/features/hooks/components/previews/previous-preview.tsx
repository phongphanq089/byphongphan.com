import { ArrowRight, Minus, Plus } from "lucide-react"
import { useState } from "react"

import { usePrevious } from "@/shared/hooks/use-previous"

export function PreviousPreview() {
  const [count, setCount] = useState(5)
  const prevCount = usePrevious(count) ?? 4

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 select-none">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5">
          <span className="text-[10px] tracking-wider text-muted-foreground uppercase">
            Previous
          </span>
          <span className="font-mono text-sm font-bold text-muted-foreground/80">
            {prevCount}
          </span>
        </div>

        <ArrowRight className="size-3.5 text-blue-400" />

        <div className="flex flex-col items-center rounded-md border border-blue-500/50 bg-blue-500/10 px-3 py-1.5 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
          <span className="text-[10px] font-semibold tracking-wider text-blue-400 uppercase">
            Current
          </span>
          <span className="font-mono text-sm font-bold text-foreground">
            {count}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setCount((c) => c - 1)
          }}
          className="flex size-6 items-center justify-center rounded border border-white/10 bg-white/5 text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground active:scale-90"
        >
          <Minus className="size-3" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setCount((c) => c + 1)
          }}
          className="flex size-6 items-center justify-center rounded border border-white/10 bg-white/5 text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground active:scale-90"
        >
          <Plus className="size-3" />
        </button>
      </div>
    </div>
  )
}
