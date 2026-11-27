import type { EChartsOption } from "echarts"
import * as echarts from "echarts"
import { BarChart3 } from "lucide-react"
import { useMemo } from "react"

import { AdminContentCard } from "@/admin"

import type { EngagementSeriesPoint } from "../types"
import { EvilEChart } from "./evil-echarts"

interface DashboardEngagementChartProps {
  data: EngagementSeriesPoint[]
}

export function DashboardEngagementChart({
  data,
}: DashboardEngagementChartProps) {
  const totalBlogReads = useMemo(
    () => data.reduce((sum, item) => sum + item.blogReads, 0),
    [data]
  )
  const totalRegistryCopies = useMemo(
    () => data.reduce((sum, item) => sum + item.registryCopies, 0),
    [data]
  )

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
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(24, 24, 27, 0.92)",
        borderColor: "rgba(63, 63, 70, 0.7)",
        borderWidth: 1,
        textStyle: {
          color: "#fafafa",
          fontSize: 12,
        },
      },
      xAxis: {
        type: "category",
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
          name: "Blog Reads",
          type: "bar",
          barMaxWidth: 18,
          data: data.map((d) => d.blogReads),
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#8b5cf6" },
              { offset: 1, color: "rgba(139, 92, 246, 0.45)" },
            ]),
          },
        },
        {
          name: "Registry Installs",
          type: "bar",
          barMaxWidth: 18,
          data: data.map((d) => d.registryCopies),
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#f59e0b" },
              { offset: 1, color: "rgba(245, 158, 11, 0.45)" },
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
          <BarChart3 className="size-4 text-muted-foreground" />
          <span>Blog Reads &amp; Registry</span>
        </span>
      }
      description="Article views vs shadcn CLI / copy events"
      minHeight="min-h-0"
      padding="default"
      className="h-full"
      actions={
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-violet-500" />
            Blog
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-500" />
            Registry
          </span>
        </div>
      }
    >
      <div className="flex flex-1 flex-col justify-between gap-4">
        <div className="min-h-[240px] flex-1">
          <EvilEChart option={option} height="100%" />
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-3">
          <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
            <p className="text-[11px] text-muted-foreground">
              Total Blog Reads
            </p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-foreground tabular-nums">
              {totalBlogReads.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
            <p className="text-[11px] text-muted-foreground">
              Total Registry Installs
            </p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-foreground tabular-nums">
              {totalRegistryCopies.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </AdminContentCard>
  )
}
