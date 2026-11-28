import {
  Activity,
  ArrowUpRight,
  Eye,
  Layers,
  type LucideIcon,
  Users,
} from "lucide-react"

import type { DashboardKpiSummary } from "../types"

interface DashboardKpiStripProps {
  kpis: DashboardKpiSummary
}

interface KpiCardItem {
  label: string
  value: string
  badge: string
  subtitle: string
  icon: LucideIcon
  iconWrapClass: string
  badgeClass: string
}

export function DashboardKpiStrip({ kpis }: DashboardKpiStripProps) {
  const items: KpiCardItem[] = [
    {
      label: "Unique Visitors",
      value: kpis.visitors.toLocaleString(),
      badge: kpis.visitorsDelta.split(" ")[0] ?? "+14.2%",
      subtitle:
        kpis.visitorsDelta.replace(/^\S+\s*/, "") || "vs previous period",
      icon: Users,
      iconWrapClass:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      badgeClass:
        "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    },
    {
      label: "Total Pageviews",
      value: kpis.pageviews.toLocaleString(),
      badge: kpis.pageviewsDelta.split(" ")[0] ?? "+18.6%",
      subtitle:
        kpis.pageviewsDelta.replace(/^\S+\s*/, "") || "vs previous period",
      icon: Eye,
      iconWrapClass:
        "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400",
      badgeClass:
        "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-400",
    },
    {
      label: "Avg. Session",
      value: kpis.avgDuration,
      badge: kpis.bounceRate,
      subtitle: "bounce rate",
      icon: Activity,
      iconWrapClass:
        "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400",
      badgeClass:
        "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-400",
    },
    {
      label: "Registry Installs",
      value: kpis.registryInstalls.toLocaleString(),
      badge: kpis.registryDelta.split(" ")[0] ?? "+22.4%",
      subtitle: "CLI & copy events",
      icon: Layers,
      iconWrapClass:
        "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      badgeClass:
        "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.label}
            className="flex flex-col justify-between gap-4 rounded-xl border border-border/70 bg-card p-4 shadow-xs transition-colors hover:border-border"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                  {item.value}
                </p>
              </div>
              <div
                className={`flex size-9 shrink-0 items-center justify-center rounded-xl border ${item.iconWrapClass}`}
              >
                <Icon className="size-4" />
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-border/50 pt-3 text-[11px]">
              <span
                className={`inline-flex items-center gap-0.5 rounded-md border px-1.5 py-0.5 font-mono font-medium tabular-nums ${item.badgeClass}`}
              >
                <ArrowUpRight className="size-3" />
                <span>{item.badge}</span>
              </span>
              <span className="truncate text-muted-foreground">
                {item.subtitle}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
