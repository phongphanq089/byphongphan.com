import type { EChartsOption } from "echarts"
import { PieChart } from "lucide-react"
import { useMemo } from "react"

import { AdminContentCard } from "@/admin"

import type { TrafficSourceItem } from "../types"
import { EvilEChart } from "./evil-echarts"

interface DashboardSourcesChartProps {
  data: TrafficSourceItem[]
}

export function DashboardSourcesChart({ data }: DashboardSourcesChartProps) {
  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  )

  const option = useMemo<EChartsOption>(
    () => ({
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(24, 24, 27, 0.92)",
        borderColor: "rgba(63, 63, 70, 0.7)",
        borderWidth: 1,
        textStyle: {
          color: "#fafafa",
          fontSize: 12,
        },
        formatter: "{b}: {c} ({d}%)",
      },
      series: [
        {
          name: "Traffic Sources",
          type: "pie",
          radius: ["56%", "80%"],
          center: ["50%", "50%"],
          padAngle: 3,
          itemStyle: {
            borderRadius: 6,
          },
          label: {
            show: false,
          },
          emphasis: {
            scale: true,
            scaleSize: 4,
          },
          data: data.map((item) => ({
            name: item.name,
            value: item.value,
            itemStyle: { color: item.color },
          })),
        },
      ],
    }),
    [data]
  )

  return (
    <AdminContentCard
      title={
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <PieChart className="size-4 text-muted-foreground" />
          <span>Acquisition Channels</span>
        </span>
      }
      description="Referrer breakdown from $referring_domain"
      minHeight="min-h-0"
      padding="default"
      className="h-full"
    >
      <div className="space-y-4">
        <div className="relative">
          <EvilEChart option={option} height={210} />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-foreground tabular-nums">
              {total.toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground">Visitors</span>
          </div>
        </div>

        <div className="space-y-2">
          {data.map((item) => {
            const pct = total > 0 ? Math.round((item.value / total) * 100) : 0
            return (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs"
              >
                <span className="inline-flex items-center gap-2 text-foreground">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </span>
                <span className="font-mono text-muted-foreground tabular-nums">
                  {item.value.toLocaleString()} ({pct}%)
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </AdminContentCard>
  )
}
