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
      label: "Mobile (< 640px)",
      icon: Smartphone,
      active: isMobile,
    },
    {
      label: "Tablet (640px - 1024px)",
      icon: Tablet,
      active: isTablet,
    },
    {
      label: "Desktop (> 1024px)",
      icon: Monitor,
      active: isDesktop,
    },
  ]

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 p-6">
      <div className="flex w-full items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Live Window matchMedia
        </span>
        <Badge
          variant="outline"
          className="gap-1.5 font-mono text-xs text-blue-400"
        >
          <span className="size-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
          SSR Synchronized
        </Badge>
      </div>

      <div className="grid w-full grid-cols-3 gap-3">
        {queries.map((q) => {
          const Icon = q.icon
          return (
            <div
              key={q.label}
              className={cn(
                "flex flex-col items-center justify-center gap-2.5 rounded-xl border p-4 transition-all duration-300",
                q.active
                  ? "border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_18px_rgba(59,130,246,0.3)] ring-1 ring-blue-500/50"
                  : "border-white/10 bg-white/[0.02] text-muted-foreground/60"
              )}
            >
              <Icon className="size-6" />
              <span className="text-center text-[10px] leading-tight font-medium">
                {q.label}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase",
                  q.active
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-white/5 text-muted-foreground/40"
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
