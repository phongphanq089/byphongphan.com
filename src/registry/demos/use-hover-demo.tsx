import { MousePointer, RotateCcw, Sparkles } from "lucide-react"
import { useState } from "react"

import { useHover } from "@/registry/hooks/use-hover"
import { Button } from "@/registry/ui/button"
import { cn } from "@/shared/lib/utils"

export function UseHoverDemo() {
  const [hoverCount, setHoverCount] = useState(0)

  const [hoverRef, isHovered] = useHover<HTMLDivElement>({
    onEnter: () => setHoverCount((c) => c + 1),
  })

  const [delayedHoverRef, isDelayedHovered] = useHover<HTMLDivElement>({
    enterDelay: 250,
    leaveDelay: 250,
  })

  return (
    <div className="w-full min-w-0 p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Pointer interaction
            </span>
            <span className="text-[11px] text-muted-foreground">
              Enter and leave detection
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              Count
            </span>
            <span className="font-mono text-sm font-semibold text-foreground tabular-nums">
              {hoverCount}
            </span>

            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground"
              onClick={() => setHoverCount(0)}
              aria-label="Reset hover count"
            >
              <RotateCcw className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* Instant Hover */}
        <div
          ref={hoverRef}
          tabIndex={0}
          className={cn(
            "group relative flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border p-5 text-center transition-colors duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-primary/40",
            isHovered
              ? "border-primary/40 bg-primary/[0.04]"
              : "border-border bg-muted/10 hover:border-border/80"
          )}
        >
          <div
            className={cn(
              "flex size-11 items-center justify-center rounded-lg border transition-all duration-200",
              isHovered
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground"
            )}
          >
            <MousePointer
              className={cn(
                "size-5 transition-transform duration-200",
                isHovered && "scale-110"
              )}
            />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">
              {isHovered ? "Pointer is inside" : "Hover over this area"}
            </h3>

            <p className="text-xs text-muted-foreground">
              Instant response to pointer events
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span
              className={cn(
                "size-1.5 rounded-full",
                isHovered ? "bg-primary" : "bg-muted-foreground/30"
              )}
            />
            <span
              className={cn(
                isHovered ? "text-primary" : "text-muted-foreground"
              )}
            >
              isHovered: {String(isHovered)}
            </span>
          </div>
        </div>

        {/* Delayed Hover */}
        <div
          ref={delayedHoverRef}
          tabIndex={0}
          className={cn(
            "flex min-w-0 items-center justify-between gap-3 rounded-xl border p-3.5 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:p-4",
            isDelayedHovered
              ? "border-primary/40 bg-primary/[0.04]"
              : "border-border bg-muted/10"
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                isDelayedHovered
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground"
              )}
            >
              <Sparkles className="size-4" />
            </div>

            <div className="min-w-0 space-y-1">
              <h3 className="text-xs font-semibold text-foreground">
                Delayed Hover
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Enter / leave · 250ms
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className={cn(
                "size-1.5 rounded-full transition-colors",
                isDelayedHovered ? "bg-primary" : "bg-muted-foreground/30"
              )}
            />
            <span
              className={cn(
                "font-mono text-[10px]",
                isDelayedHovered ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isDelayedHovered ? "Active" : "Idle"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UseHoverDemo
