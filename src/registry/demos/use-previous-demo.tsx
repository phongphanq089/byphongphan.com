import { ArrowRight, Minus, Plus } from "lucide-react"
import { useState } from "react"

import { usePrevious } from "@/registry/hooks/use-previous"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"

export function UsePreviousDemo() {
  const [count, setCount] = useState(0)
  const previousCount = usePrevious(count)

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 p-6">
      <div className="flex w-full items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Render State History
        </span>
        <Badge variant="outline" className="font-mono text-xs">
          usePrevious(count)
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3">
          <span className="text-[10px] text-muted-foreground uppercase">
            Previous
          </span>
          <span className="font-mono text-xl font-bold text-muted-foreground">
            {previousCount !== undefined ? previousCount : "—"}
          </span>
        </div>

        <ArrowRight className="size-4 text-blue-400" />

        <div className="flex flex-col items-center rounded-xl border border-blue-500/50 bg-blue-500/10 px-5 py-3 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <span className="text-[10px] font-semibold text-blue-400 uppercase">
            Current
          </span>
          <span className="font-mono text-xl font-bold text-foreground">
            {count}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCount((c) => c - 1)}
          className="h-8 gap-1 text-xs"
        >
          <Minus className="size-3" />
          Decrement
        </Button>
        <Button
          size="sm"
          onClick={() => setCount((c) => c + 1)}
          className="h-8 gap-1 text-xs"
        >
          <Plus className="size-3" />
          Increment
        </Button>
      </div>
    </div>
  )
}
