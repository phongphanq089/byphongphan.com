import { useState } from "react"

import { AdminPageHeader } from "@/admin"
import { Button } from "@/shared/ui"

import { DashboardEngagementChart } from "./components/dashboard-engagement-chart"
import { DashboardKpiStrip } from "./components/dashboard-kpi-strip"
import { DashboardPostHogCard } from "./components/dashboard-posthog-card"
import { DashboardSourcesChart } from "./components/dashboard-sources-chart"
import { DashboardTopPagesCard } from "./components/dashboard-top-pages-card"
import { DashboardTrafficChart } from "./components/dashboard-traffic-chart"
import { DASHBOARD_MOCK_DATA } from "./mock-data"
import type { DashboardRange } from "./types"

const RANGE_OPTIONS: { value: DashboardRange; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
]

export function AdminDashboardView() {
  const [range, setRange] = useState<DashboardRange>("7d")
  const dataset = DASHBOARD_MOCK_DATA[range]

  return (
    <div className="flex flex-1 flex-col gap-6">
      <AdminPageHeader
        title="Dashboard Overview"
        description="Portfolio analytics, content engagement, and PostHog telemetry overview."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Overview" },
        ]}
        actions={
          <div className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-muted/40 p-1">
            {RANGE_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                type="button"
                size="sm"
                variant={range === opt.value ? "secondary" : "ghost"}
                onClick={() => setRange(opt.value)}
                className="h-7 px-2.5 text-xs"
              >
                {opt.label}
              </Button>
            ))}
          </div>
        }
      />

      <DashboardKpiStrip kpis={dataset.kpis} />

      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DashboardTrafficChart
            data={dataset.traffic}
            deltaLabel={dataset.kpis.pageviewsDelta}
          />
        </div>

        <DashboardSourcesChart data={dataset.sources} />
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2">
        <DashboardEngagementChart data={dataset.engagement} />
        <DashboardTopPagesCard pages={dataset.topPages} />
      </div>

      <DashboardPostHogCard />
    </div>
  )
}
