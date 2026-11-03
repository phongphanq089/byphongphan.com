import { Minus, Plus, Redo2, RotateCcw, Undo2 } from "lucide-react"

import { useStateHistory } from "@/registry/hooks/use-state-history"
import { Button } from "@/registry/ui/button"

export function UseStateHistoryDemo() {
  const {
    state,
    set,
    undo,
    redo,
    canUndo,
    canRedo,
    history,
    pointer,
    jump,
    reset,
  } = useStateHistory(0)

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:p-5">
      {/* Current state */}
      <div className="flex flex-col items-center justify-center rounded-lg bg-muted/30 py-6">
        <span className="text-xs font-medium text-muted-foreground">
          Current state
        </span>

        <span className="mt-2 font-mono text-4xl font-semibold tracking-tight">
          {state}
        </span>

        <span className="mt-1 text-xs text-muted-foreground">
          Snapshot {pointer + 1} of {history.length}
        </span>
      </div>

      {/* State controls */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo}>
          <Undo2 className="mr-1.5 size-3.5" />
          Undo
        </Button>

        <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo}>
          <Redo2 className="mr-1.5 size-3.5" />
          Redo
        </Button>

        <Button variant="ghost" size="sm" onClick={() => reset()}>
          <RotateCcw className="mr-1.5 size-3.5" />
          Reset
        </Button>
      </div>

      {/* Counter actions */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => set((prev) => prev - 1)}
          aria-label="Decrease counter"
        >
          <Minus className="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => set((prev) => prev + 1)}
          aria-label="Increase counter"
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {/* History timeline */}
      <div className="border-t border-border pt-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            History timeline
          </span>

          <span className="font-mono text-[10px] text-muted-foreground">
            {history.length} snapshots
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {history.map((snapshot, index) => (
            <button
              key={index}
              type="button"
              onClick={() => jump(index)}
              aria-current={index === pointer ? "step" : undefined}
              className={[
                "flex size-9 items-center justify-center rounded-md border font-mono text-xs transition-colors",
                index === pointer
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
              ].join(" ")}
            >
              {snapshot}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UseStateHistoryDemo
