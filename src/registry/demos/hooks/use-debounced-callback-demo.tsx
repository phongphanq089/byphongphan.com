import {
  Ban,
  Clock,
  FastForward,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react"
import { useEffect, useState } from "react"

import { useDebouncedCallback } from "@/registry/hooks/use-debounced-callback"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Input } from "@/registry/ui/input"
import { cn } from "@/shared/lib/utils"

export function UseDebouncedCallbackDemo() {
  const [instantText, setInstantText] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [keystrokesCount, setKeystrokesCount] = useState(0)
  const [executionCount, setExecutionCount] = useState(0)
  const [delay, setDelay] = useState(500)
  const [isPendingState, setIsPendingState] = useState(false)

  const debouncedSearch = useDebouncedCallback((query: string) => {
    setDebouncedQuery(query)
    setExecutionCount((c) => c + 1)
    setIsPendingState(false)
  }, delay)

  const handleInputChange = (value: string) => {
    setInstantText(value)
    setKeystrokesCount((c) => c + 1)
    setIsPendingState(true)
    debouncedSearch(value)
  }

  // Sync isPending status on ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPendingState(debouncedSearch.isPending())
    }, 50)
    return () => clearInterval(interval)
  }, [debouncedSearch])

  const handleFlush = () => {
    debouncedSearch.flush()
    setIsPendingState(false)
  }

  const handleCancel = () => {
    debouncedSearch.cancel()
    setIsPendingState(false)
  }

  const handleReset = () => {
    debouncedSearch.cancel()
    setInstantText("")
    setDebouncedQuery("")
    setKeystrokesCount(0)
    setExecutionCount(0)
    setIsPendingState(false)
  }

  return (
    <div className="w-full min-w-0 p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        {/* Header bar */}
        <div className="flex flex-col gap-2.5 border-b border-border/40 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Debounced Callback Telemetry
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Delay selector */}
            <div className="flex rounded-lg border border-border/60 bg-muted/30 p-0.5 text-xs">
              {[300, 500, 1000].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDelay(d)}
                  className={cn(
                    "cursor-pointer rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors",
                    delay === d
                      ? "bg-background font-semibold text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {d}ms
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={handleReset}
              title="Reset all inputs and metrics"
            >
              <RotateCcw className="size-3" />
              Reset
            </Button>
          </div>
        </div>

        {/* Real-time Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Keystrokes / Trigger count */}
          <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/60 p-3 shadow-xs">
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              Trigger Calls
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-2xl font-bold text-foreground tabular-nums">
                {keystrokesCount}
              </span>
              <span className="text-[10px] text-muted-foreground">
                invocations
              </span>
            </div>
          </div>

          {/* Actual Debounced Executions */}
          <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/60 p-3 shadow-xs">
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              Actual Executions
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-2xl font-bold text-primary tabular-nums">
                {executionCount}
              </span>
              <span className="text-[10px] text-muted-foreground">
                callback runs
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Search Input Sandbox */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <label
              htmlFor="debounced-input"
              className="font-medium text-foreground"
            >
              Simulated API Search Query
            </label>

            <Badge
              variant={isPendingState ? "default" : "outline"}
              className={cn(
                "gap-1 text-[10px] transition-colors",
                isPendingState
                  ? "animate-pulse border-amber-500/30 bg-amber-500/10 text-amber-500"
                  : "text-muted-foreground"
              )}
            >
              {isPendingState ? `Debouncing (${delay}ms)...` : "Idle"}
            </Badge>
          </div>

          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
            <Input
              id="debounced-input"
              placeholder="Type rapidly to test debounced execution..."
              value={instantText}
              onChange={(e) => handleInputChange(e.target.value)}
              className="h-9 pl-9 text-xs"
            />
          </div>

          {/* Controller buttons (flush / cancel) */}
          <div className="flex items-center justify-between border-t border-border/40 pt-1">
            <span className="text-[11px] text-muted-foreground">Controls:</span>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={handleFlush}
                disabled={!isPendingState}
                title="Immediately invoke pending callback"
              >
                <FastForward className="size-3 text-primary" />
                Flush
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs text-muted-foreground hover:text-destructive"
                onClick={handleCancel}
                disabled={!isPendingState}
                title="Cancel pending callback"
              >
                <Ban className="size-3" />
                Cancel
              </Button>
            </div>
          </div>
        </div>

        {/* Output log */}
        <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs">
          <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              <span>Executed Callback Result</span>
            </div>
            <span className="font-mono text-[10px]">
              Saved {Math.max(0, keystrokesCount - executionCount)} calls
            </span>
          </div>

          <div className="rounded-lg border border-border/40 bg-background/50 p-2.5 font-mono text-xs">
            <div className="text-[11px] text-muted-foreground">
              Query:{" "}
              <span className="font-semibold text-foreground">
                {debouncedQuery
                  ? `"${debouncedQuery}"`
                  : "— (none executed yet)"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UseDebouncedCallbackDemo
