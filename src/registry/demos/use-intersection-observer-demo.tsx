import { useIntersectionObserver } from "@/registry/hooks/use-intersection-observer"
import { Badge } from "@/registry/ui/badge"
import { cn } from "@/shared/lib/utils"

export function UseIntersectionObserverDemo() {
  const { ref, isIntersecting, entry } =
    useIntersectionObserver<HTMLDivElement>({
      threshold: 0.5,
    })

  const ratio = entry?.intersectionRatio
    ? Math.round(entry.intersectionRatio * 100)
    : 0

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 p-6">
      <div className="flex w-full items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Viewport Intersection
        </span>
        <Badge
          className={cn(
            "gap-1.5 font-mono text-xs transition-colors",
            isIntersecting
              ? "border-blue-500/30 bg-blue-500/20 text-blue-400"
              : "border-white/10 bg-white/5 text-muted-foreground"
          )}
        >
          <span
            className={cn(
              "size-2 rounded-full",
              isIntersecting
                ? "bg-blue-500 shadow-[0_0_8px_#3b82f6]"
                : "bg-muted-foreground/40"
            )}
          />
          {isIntersecting ? `Intersecting (${ratio}%)` : "Offscreen"}
        </Badge>
      </div>

      <div
        ref={ref}
        className={cn(
          "flex w-full flex-col gap-3 rounded-xl border p-6 transition-all duration-300",
          isIntersecting
            ? "border-blue-500 bg-blue-500/10 shadow-[0_0_24px_rgba(59,130,246,0.25)] ring-1 ring-blue-500/40"
            : "border-white/10 bg-white/[0.02] opacity-60"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "size-8 rounded-lg transition-colors",
              isIntersecting
                ? "bg-blue-500 shadow-[0_0_12px_#3b82f6]"
                : "bg-white/10"
            )}
          />
          <div className="flex flex-1 flex-col gap-1.5">
            <div
              className={cn(
                "h-2.5 rounded transition-colors",
                isIntersecting ? "w-3/4 bg-blue-400" : "w-1/2 bg-white/10"
              )}
            />
            <div
              className={cn(
                "h-2 rounded transition-colors",
                isIntersecting ? "w-1/2 bg-blue-400/50" : "w-1/3 bg-white/5"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
