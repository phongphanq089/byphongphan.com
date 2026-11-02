import { ArrowRight, Minus, Plus, RotateCcw } from "lucide-react"
import { useState } from "react"

import { usePrevious } from "@/registry/hooks/use-previous"
import { Button } from "@/registry/ui/button"

export function UsePreviousDemo() {
  const [count, setCount] = useState(0)
  const previousCount = usePrevious(count)

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 p-3 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-muted-foreground">
          State history
        </span>

        <code className="rounded-md bg-muted px-2 py-1 font-mono text-[11px] text-muted-foreground">
          usePrevious(count)
        </code>
      </div>

      {/* Values */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
        {/* Previous */}
        <div className="flex min-w-0 flex-col gap-2 rounded-lg border border-border bg-muted/20 p-3 sm:p-4">
          <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            Previous
          </span>

          <span className="font-mono text-2xl font-medium text-muted-foreground tabular-nums sm:text-3xl">
            {previousCount !== undefined ? previousCount : "—"}
          </span>
        </div>

        <ArrowRight className="size-4 text-muted-foreground/50" />

        {/* Current */}
        <div className="flex min-w-0 flex-col gap-2 rounded-lg border border-primary/40 bg-primary/[0.06] p-3 sm:p-4">
          <span className="text-[10px] font-medium tracking-wide text-primary uppercase">
            Current
          </span>

          <span className="font-mono text-2xl font-semibold text-foreground tabular-nums sm:text-3xl">
            {count}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">Change counter</span>

        <div className="flex items-center gap-1.5">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setCount((c) => c - 1)}
            className="size-8"
            aria-label="Decrement counter"
          >
            <Minus className="size-3.5" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={() => setCount((c) => c + 1)}
            className="size-8"
            aria-label="Increment counter"
          >
            <Plus className="size-3.5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setCount(0)}
            className="size-8 text-muted-foreground"
            aria-label="Reset counter"
          >
            <RotateCcw className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UsePreviousDemo
