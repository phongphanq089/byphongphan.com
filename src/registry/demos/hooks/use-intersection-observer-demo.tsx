import { useIntersectionObserver } from "@/registry/hooks/use-intersection-observer"
import { cn } from "@/shared/lib/utils"

export function UseIntersectionObserverDemo() {
  const { ref, isIntersecting, entry } =
    useIntersectionObserver<HTMLDivElement>({
      threshold: 0.5,
    })

  const ratio = Math.round((entry?.intersectionRatio ?? 0) * 100)

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 p-3 sm:p-5">
      {/* Status */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-muted-foreground">
          Visibility observer
        </span>

        <span
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
          aria-live="polite"
        >
          <span
            className={cn(
              "size-1.5 rounded-full transition-colors",
              isIntersecting ? "bg-primary" : "bg-muted-foreground/40"
            )}
          />
          {isIntersecting ? "In viewport" : "Out of viewport"}
        </span>
      </div>

      {/* Observed element */}
      <div
        ref={ref}
        className={cn(
          "rounded-lg border p-4 transition-colors duration-200 sm:p-5",
          isIntersecting
            ? "border-primary/40 bg-primary/[0.04]"
            : "border-border bg-muted/20"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors",
              isIntersecting
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-muted text-muted-foreground"
            )}
          >
            <span className="text-sm font-semibold">01</span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">
              Observed element
            </p>
            <p className="text-xs text-muted-foreground">
              {isIntersecting
                ? "Element is currently visible"
                : "Scroll to bring this element into view"}
            </p>
          </div>
        </div>

        {/* Intersection ratio */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Intersection ratio</span>
            <span className="font-mono font-medium text-foreground tabular-nums">
              {ratio}%
            </span>
          </div>

          <div
            className="h-1.5 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={ratio}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Intersection ratio"
          >
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-200",
                isIntersecting ? "bg-primary" : "bg-muted-foreground/40"
              )}
              style={{ width: `${ratio}%` }}
            />
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
        <span className="text-muted-foreground">Threshold</span>
        <code className="rounded bg-muted px-2 py-1 font-mono text-foreground">
          0.5
        </code>
      </div>
    </div>
  )
}

export default UseIntersectionObserverDemo
