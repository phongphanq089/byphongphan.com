import { Lock, Unlock } from "lucide-react"
import { useEffect, useState } from "react"

import { usePreventBodyScroll } from "@/registry/hooks/use-prevent-body-scroll"
import { Switch } from "@/registry/ui/switch"
import { cn } from "@/shared/lib/utils"

export function UsePreventBodyScrollDemo() {
  const [isLocked, setIsLocked] = useState(false)
  const [overflow, setOverflow] = useState("auto")

  usePreventBodyScroll(isLocked)

  useEffect(() => {
    if (typeof document === "undefined") return

    const updateOverflow = () => {
      setOverflow(document.body.style.overflow || "auto")
    }

    const frame = requestAnimationFrame(updateOverflow)

    return () => cancelAnimationFrame(frame)
  }, [isLocked])

  return (
    <div className="w-full min-w-0 p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
        {/* Main control */}
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors",
            isLocked
              ? "border-primary/40 bg-primary/[0.04]"
              : "border-border bg-muted/10"
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors",
                isLocked
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground"
              )}
            >
              {isLocked ? (
                <Lock className="size-4" />
              ) : (
                <Unlock className="size-4" />
              )}
            </div>

            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium text-foreground">Body scroll</p>
              <p className="text-xs text-muted-foreground">
                {isLocked ? "Scrolling is disabled" : "Scrolling is enabled"}
              </p>
            </div>
          </div>

          <Switch
            checked={isLocked}
            onCheckedChange={setIsLocked}
            aria-label="Toggle body scroll lock"
          />
        </div>

        {/* Current state */}
        <div className="flex items-center justify-between rounded-lg border border-border/60 px-3.5 py-3">
          <span className="text-xs text-muted-foreground">
            document.body.style.overflow
          </span>

          <code
            className={cn(
              "font-mono text-xs font-medium",
              isLocked ? "text-primary" : "text-muted-foreground"
            )}
          >
            {overflow}
          </code>
        </div>
      </div>
    </div>
  )
}

export default UsePreventBodyScrollDemo
