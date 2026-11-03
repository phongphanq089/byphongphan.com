import { useState } from "react"
import { ArrowUpRight, MousePointer2 } from "lucide-react"

import { usePageLeave } from "@/registry/hooks/use-page-leave"
import { Badge } from "@/registry/ui/badge"
import { cn } from "cn"

export function UsePageLeaveDemo() {
  const [onlyTop, setOnlyTop] = useState(true)
  const [once, setOnce] = useState(false)
  const [leaveCount, setLeaveCount] = useState(0)

  const isLeft = usePageLeave(
    () => {
      setLeaveCount((count) => count + 1)
    },
    {
      onlyTop,
      once,
    }
  )

  return (
    <div className="space-y-5">
      {/* Status */}
      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-lg",
              isLeft
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            <MousePointer2 className="size-5" />
          </div>

          <div>
            <p className="text-sm font-medium">
              {isLeft ? "Cursor left the page" : "Cursor is inside the page"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isLeft
                ? "Move your cursor back into the viewport"
                : onlyTop
                  ? "Move your cursor beyond the top edge"
                  : "Move your cursor outside the viewport"}
            </p>
          </div>
        </div>

        <Badge variant={isLeft ? "default" : "secondary"}>
          {isLeft ? "LEFT" : "ACTIVE"}
        </Badge>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setOnlyTop((value) => !value)}
          className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-3 text-left transition-colors hover:bg-muted/50"
        >
          <div>
            <p className="text-sm font-medium">Only trigger from top</p>
            <p className="text-xs text-muted-foreground">
              Detect exit-intent from the top boundary
            </p>
          </div>

          <span
            className={cn(
              "relative h-5 w-9 rounded-full transition-colors",
              onlyTop ? "bg-primary" : "bg-muted"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-4 rounded-full bg-background transition-transform",
                onlyTop ? "translate-x-4" : "translate-x-0.5"
              )}
            />
          </span>
        </button>

        <button
          type="button"
          onClick={() => setOnce((value) => !value)}
          className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-3 text-left transition-colors hover:bg-muted/50"
        >
          <div>
            <p className="text-sm font-medium">Trigger only once</p>
            <p className="text-xs text-muted-foreground">
              Invoke the callback only once per component lifecycle
            </p>
          </div>

          <span
            className={cn(
              "relative h-5 w-9 rounded-full transition-colors",
              once ? "bg-primary" : "bg-muted"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-4 rounded-full bg-background transition-transform",
                once ? "translate-x-4" : "translate-x-0.5"
              )}
            />
          </span>
        </button>
      </div>

      {/* Callback counter */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowUpRight className="size-4 text-primary" />
          Callback triggered
        </div>

        <span className="font-mono text-lg font-semibold tabular-nums">
          {leaveCount}
        </span>
      </div>
    </div>
  )
}
