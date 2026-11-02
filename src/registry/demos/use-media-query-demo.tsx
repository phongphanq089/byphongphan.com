import { Monitor, Smartphone, Tablet } from "lucide-react"

import { useMediaQuery } from "@/registry/hooks/use-media-query"
import { Badge } from "@/registry/ui/badge"
import { cn } from "@/shared/lib/utils"

export function UseMediaQueryDemo() {
  const isMobile = useMediaQuery("max-sm")
  const isTablet = useMediaQuery("sm:max-lg")
  const isDesktop = useMediaQuery("lg")

  const queries = [
    {
      label: "Mobile",
      range: "< 640px",
      icon: Smartphone,
      active: isMobile,
    },
    {
      label: "Tablet",
      range: "640px - 1023px",
      icon: Tablet,
      active: isTablet,
    },
    {
      label: "Desktop",
      range: "≥ 1024px",
      icon: Monitor,
      active: isDesktop,
    },
  ]

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 p-3 sm:gap-6 sm:p-5">
      {/* Header */}
      <div className="flex min-w-0 items-center justify-between gap-2">
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase sm:text-xs">
          Live Window MatchMedia
        </span>

        <Badge
          variant="outline"
          className="shrink-0 gap-1.5 px-2 py-1 font-mono text-[9px] sm:text-xs"
        >
          <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--pp-primary-glow)] sm:size-2" />
          SSR Synchronized
        </Badge>
      </div>

      {/* Breakpoints */}
      <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {queries.map((q) => {
          const Icon = q.icon

          return (
            <div
              key={q.label}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-2 rounded-xl border p-2.5 transition-all duration-300 sm:gap-3 sm:p-4",
                q.active
                  ? "border-primary/60 bg-primary/10 text-foreground shadow-[0_0_16px_var(--pp-primary-glow)] ring-1 ring-primary/30 dark:border-primary/70 dark:bg-primary/15"
                  : "border-black/10 bg-card/50 text-muted-foreground/60 dark:border-white/10 dark:bg-neutral-900/40"
              )}
            >
              <Icon
                className={cn(
                  "size-5 transition-colors sm:size-6",
                  q.active ? "text-primary" : "text-muted-foreground"
                )}
                strokeWidth={1.8}
              />

              <div className="flex min-w-0 flex-col items-center gap-0.5">
                <span className="text-xs font-semibold sm:text-sm">
                  {q.label}
                </span>

                <span className="text-[9px] text-muted-foreground sm:text-[10px]">
                  {q.range}
                </span>
              </div>

              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[8px] font-bold tracking-wide uppercase sm:text-[9px]",
                  q.active
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground/60"
                )}
              >
                {q.active ? "Matches" : "False"}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default UseMediaQueryDemo
