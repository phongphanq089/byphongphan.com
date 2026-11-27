import type { LucideIcon } from "lucide-react"

import { cn } from "@/shared/lib/utils"

export interface AdminStatItem {
  label: string
  value: number | string
  hint?: string
  icon: LucideIcon
  tone?: string
}

interface AdminStatsStripProps {
  items: AdminStatItem[]
  className?: string
}

export function AdminStatsStrip({ items, className }: AdminStatsStripProps) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.label}
            className="flex items-start justify-between rounded-xl border border-border/70 bg-card p-4 shadow-xs"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-1.5 font-mono text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {item.value}
              </p>
              {item.hint && (
                <p className="mt-1 truncate text-xs text-muted-foreground/80">
                  {item.hint}
                </p>
              )}
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40">
              <Icon className={cn("size-4 text-foreground", item.tone)} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
