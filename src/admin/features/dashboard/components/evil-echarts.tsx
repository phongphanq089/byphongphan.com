import type { EChartsOption } from "echarts"
import * as echarts from "echarts"
import { useEffect, useRef } from "react"

import { cn } from "@/shared/lib/utils"
import { useTheme } from "@/shared/providers/theme-provider"

interface EvilEChartProps {
  option: EChartsOption
  className?: string
  height?: number | string
}

/**
 * Responsive Apache ECharts canvas wrapper styled for EvilCharts-inspired
 * Admin analytics cards, reacting automatically to theme and container resizes.
 */
export function EvilEChart({
  option,
  className,
  height = 260,
}: EvilEChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.ECharts | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const instance = echarts.init(el, undefined, { renderer: "svg" })
    chartRef.current = instance

    const observer = new ResizeObserver(() => {
      instance.resize()
    })
    observer.observe(el)

    return () => {
      observer.disconnect()
      instance.dispose()
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    const instance = chartRef.current
    if (!instance) return

    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)

    instance.setOption(
      {
        backgroundColor: "transparent",
        textStyle: {
          fontFamily: "inherit",
          color: isDark ? "#a1a1aa" : "#71717a",
        },
        ...option,
      },
      { notMerge: true }
    )
  }, [option, theme])

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={cn("w-full select-none", className)}
    />
  )
}
