import type { EChartsOption } from "echarts"
import * as echarts from "echarts"
import { TrendingUp } from "lucide-react"
import { useMemo } from "react"

import { AdminContentCard } from "@/admin"
import { Badge } from "@/shared/ui"

import type { TrafficSeriesPoint } from "../types"
import { EvilEChart } from "./evil-echarts"

interface DashboardTrafficChartProps {
  data: TrafficSeriesPoint[]
  deltaLabel: string
}

export function DashboardTrafficChart({
  data,
  deltaLabel,
}: DashboardTrafficChartProps) {
  const option = useMemo<EChartsOption>(
    () => ({
      grid: {
        top: 20,
        right: 12,
        bottom: 24,
        left: 12,
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(24, 24, 27, 0.92)",
        borderColor: "rgba(63, 63, 70, 0.7)",
        borderWidth: 1,
        textStyle: {
          color: "#fafafa",
          fontSize: 12,
        },
        axisPointer: {
          type: "line",
          lineStyle: {
            color: "rgba(161, 161, 170, 0.35)",
            type: "dashed",
          },
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.map((d) => d.label),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          fontSize: 11,
          margin: 10,
        },
      },
      yAxis: {
        type: "value",
        splitNumber: 4,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: {
            color: "rgba(161, 161, 170, 0.14)",
            type: "dashed",
          },
        },
        axisLabel: {
          fontSize: 11,
        },
      },
      series: [
        {
          name: "Pageviews",
          type: "line",
          smooth: 0.4,
          showSymbol: false,
          symbolSize: 6,
          data: data.map((d) => d.pageviews),
          lineStyle: {
            width: 2.5,
            color: "#3b82f6",
          },
          itemStyle: {
            color: "#3b82f6",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(59, 130, 246, 0.35)" },
              { offset: 1, color: "rgba(59, 130, 246, 0.0)" },
            ]),
          },
        },
        {
          name: "Unique Visitors",
          type: "line",
          smooth: 0.4,
          showSymbol: false,
          symbolSize: 6,
          data: data.map((d) => d.visitors),
          lineStyle: {
            width: 2.5,
            color: "#10b981",
          },
          itemStyle: {
            color: "#10b981",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(16, 185, 129, 0.28)" },
              { offset: 1, color: "rgba(16, 185, 129, 0.0)" },
            ]),
          },
        },
      ],
    }),
    [data]
  )

  return (
    <AdminContentCard
      title={
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <TrendingUp className="size-4 text-muted-foreground" />
          <span>Traffic &amp; Pageviews</span>
        </span>
      }
      description="PostHog $pageview & unique visitor trend"
      minHeight="min-h-0"
      padding="default"
      className="h-full"
      actions={
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 text-[11px] text-muted-foreground sm:flex">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-blue-500" />
              Pageviews
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              Visitors
            </span>
          </div>
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"
          >
            {deltaLabel}
          </Badge>
        </div>
      }
    >
      <div className="min-h-[280px] flex-1">
        <EvilEChart option={option} height="100%" />
      </div>
    </AdminContentCard>
  )
}
