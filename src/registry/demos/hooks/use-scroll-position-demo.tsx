import {
  ArrowDown,
  ArrowUp,
  Compass,
  Minus,
  MoveDown,
  MoveUp,
  RotateCcw,
} from "lucide-react"
import { useRef, useState } from "react"

import { useScrollPosition } from "@/registry/hooks/use-scroll-position"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Switch } from "@/registry/ui/switch"
import { cn } from "@/shared/lib/utils"

export function UseScrollPositionDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(true)
  const [activeMode, setActiveMode] = useState<"container" | "window">(
    "container"
  )

  // Container scroll tracking
  const containerPosition = useScrollPosition({
    targetRef: activeMode === "container" ? containerRef : undefined,
    enabled: enabled && activeMode === "container",
  })

  // Window scroll tracking
  const windowPosition = useScrollPosition({
    enabled: enabled && activeMode === "window",
  })

  const currentPos =
    activeMode === "container" ? containerPosition : windowPosition

  const scrollTo = (offset: number) => {
    if (activeMode === "container" && containerRef.current) {
      containerRef.current.scrollTo({ top: offset, behavior: "smooth" })
    } else if (activeMode === "window" && typeof window !== "undefined") {
      window.scrollTo({ top: offset, behavior: "smooth" })
    }
  }

  return (
    <div className="w-full min-w-0 p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        {/* Top Control Bar */}
        <div className="flex flex-col gap-3 border-b border-border/40 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Compass className="size-4 text-primary" />
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Scroll Telemetry
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Target mode switcher */}
            <div className="flex rounded-lg border border-border/60 bg-muted/30 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveMode("container")}
                className={cn(
                  "cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  activeMode === "container"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Container
              </button>
              <button
                type="button"
                onClick={() => setActiveMode("window")}
                className={cn(
                  "cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  activeMode === "window"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Window
              </button>
            </div>

            <div className="flex items-center gap-1.5 border-l border-border/40 pl-2">
              <span className="text-[11px] text-muted-foreground">Active</span>
              <Switch
                checked={enabled}
                onCheckedChange={setEnabled}
                size="sm"
                aria-label="Toggle tracking"
              />
            </div>
          </div>
        </div>

        {/* Real-time Telemetry Readout Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Scroll Y */}
          <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/60 p-3 shadow-xs">
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              Scroll Y
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-lg font-bold text-foreground tabular-nums">
                {Math.round(currentPos.y)}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                px
              </span>
            </div>
          </div>

          {/* Scroll X */}
          <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/60 p-3 shadow-xs">
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              Scroll X
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-lg font-bold text-foreground tabular-nums">
                {Math.round(currentPos.x)}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                px
              </span>
            </div>
          </div>

          {/* Direction */}
          <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/60 p-3 shadow-xs">
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              Direction
            </span>
            <div className="flex items-center gap-1.5">
              {currentPos.direction === "down" ? (
                <Badge
                  variant="default"
                  className="gap-1 border-primary/30 bg-primary/15 text-primary"
                >
                  <ArrowDown className="size-3" />
                  <span>Down</span>
                </Badge>
              ) : currentPos.direction === "up" ? (
                <Badge
                  variant="default"
                  className="gap-1 border-amber-500/30 bg-amber-500/15 text-amber-500"
                >
                  <ArrowUp className="size-3" />
                  <span>Up</span>
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="gap-1 text-muted-foreground"
                >
                  <Minus className="size-3" />
                  <span>Idle</span>
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Container Sandbox */}
        {activeMode === "container" ? (
          <div className="relative flex flex-col overflow-hidden rounded-xl border border-border bg-card/40 shadow-xs">
            {/* Sticky mini header reacting to scroll */}
            <div className="flex items-center justify-between border-b border-border/40 bg-background/80 px-3 py-2 text-xs backdrop-blur-xs">
              <span className="text-[11px] font-medium text-muted-foreground">
                Scrollable Content Viewport
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1 px-2 text-[10px]"
                  onClick={() => scrollTo(0)}
                >
                  <MoveUp className="size-2.5" />
                  Top
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1 px-2 text-[10px]"
                  onClick={() => scrollTo(450)}
                >
                  Mid
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1 px-2 text-[10px]"
                  onClick={() => scrollTo(9999)}
                >
                  <MoveDown className="size-2.5" />
                  End
                </Button>
              </div>
            </div>

            {/* Scroll view */}
            <div
              ref={containerRef}
              tabIndex={0}
              aria-label="Scrollable demo viewport"
              className="flex h-56 flex-col gap-3 overflow-y-auto p-4 select-none focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 p-3 text-xs"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-foreground">
                      Document Section {item}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Continuous stream block at position {item * 120}px
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground/70">
                    #0{item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/70 bg-card/20 p-6 text-center">
            <Compass className="size-6 animate-pulse text-primary" />
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-foreground">
                Listening to Global Window Scroll
              </p>
              <p className="max-w-xs text-[11px] text-muted-foreground">
                Scroll the main page up and down to observe the real-time window
                coordinates and direction detection.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => scrollTo(0)}
            >
              <RotateCcw className="size-3" />
              Scroll Window to Top
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
