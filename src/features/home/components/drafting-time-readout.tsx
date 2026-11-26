"use client"

import { memo, useEffect, useState } from "react"

import { cn } from "@/shared/lib/utils"

export interface DraftingTimeReadoutProps {
  className?: string
  location?: string
  coordinates?: string
  showCoordinates?: boolean
  showCornerMarks?: boolean
  variant?: "card" | "compact"
}

/**
 * Determine dynamic daylight phase according to Vietnam (ICT, UTC+7) time.
 */
function getDaylightPhase(hour: number): {
  label: string
  isBlueHour: boolean
} {
  // Morning blue hour / dawn: 05:15 - 06:15
  if (hour >= 5 && hour < 6) {
    return { label: "blue hour", isBlueHour: true }
  }
  // Daytime: 06:00 - 16:30
  if (hour >= 6 && hour < 17) {
    return { label: "daylight", isBlueHour: false }
  }
  // Golden hour: 16:30 - 17:30
  if (hour >= 17 && hour < 18) {
    return { label: "golden hour", isBlueHour: false }
  }
  // Evening blue hour / dusk: 18:00 - 19:15
  if (hour >= 18 && hour < 19) {
    return { label: "blue hour", isBlueHour: true }
  }
  // Night shift
  return { label: "night shift", isBlueHour: false }
}

/**
 * Architectural Drafting Origin & Time Readout
 *
 * Encapsulates the live Asia/Ho_Chi_Minh clock, geographic coordinates,
 * date, and daylight phase within a precision CAD blueprint bordered container.
 *
 * Explicit borders (top, bottom, left, right) and interior hairlines
 * delineate and structure every metric like a technical drafting instrument.
 */
export const DraftingTimeReadout = memo(function DraftingTimeReadout({
  className,
  location = "vietnamese",
  coordinates = "12°30'N 109°08'E",
  showCoordinates = true,
  variant = "compact",
}: DraftingTimeReadoutProps) {
  const [time, setTime] = useState<string>("")
  const [date, setDate] = useState<string>("")
  const [phaseInfo, setPhaseInfo] = useState<{
    label: string
    isBlueHour: boolean
  }>({
    label: "blue hour",
    isBlueHour: true,
  })

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()

      // Format time with seconds (hh:mm:ss) in ICT (Asia/Ho_Chi_Minh)
      const timeStr = now.toLocaleTimeString("en-GB", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })

      // Format date in ICT
      const dateStr = now.toLocaleDateString("en-GB", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "numeric",
        month: "short",
        year: "numeric",
      })

      // Extract current hour in ICT to calculate phase
      const hourFormatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "numeric",
        hour12: false,
      })
      const hour = parseInt(hourFormatter.format(now), 10)

      setTime(timeStr)
      setDate(dateStr)
      setPhaseInfo(getDaylightPhase(hour))
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "relative inline-flex items-stretch rounded-xs border border-border/70 bg-card/50 font-mono text-[10px] text-foreground shadow-2xs backdrop-blur-xs transition-colors select-none hover:border-border",
          className
        )}
      >
        {/* Status dot + Origin */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 text-muted-foreground">
          <span className="relative flex size-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-pp-secondary opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-pp-secondary" />
          </span>
          <span className="text-[9px] font-semibold tracking-wider text-foreground/85 uppercase">
            {location}
          </span>
        </div>

        {/* Date cell */}
        <div className="flex items-center border-l border-border/50 px-2.5 py-1 text-muted-foreground">
          <span>{date || "23 Nov 2026"}</span>
        </div>

        {/* Time cell */}
        <div className="flex items-center gap-1.5 border-l border-border/50 px-2.5 py-1 font-medium text-foreground">
          <span className="tabular-nums">{time || "--:--:--"}</span>
          <span
            className={cn(
              "py-0.2 rounded-xs border px-1 text-[8px] font-normal tracking-wider uppercase",
              phaseInfo.isBlueHour
                ? "border-pp-secondary/30 bg-pp-secondary/10 text-pp-secondary"
                : "border-border/60 bg-muted/40 text-muted-foreground"
            )}
          >
            {phaseInfo.label}
          </span>
        </div>
      </div>
    )
  }

  // Default: Architectural Card Layout (4-sided border frame with top header + divided cells)
  return (
    <div
      className={cn(
        "relative inline-flex flex-col rounded-xs border border-border/70 bg-card/60 shadow-2xs backdrop-blur-xs transition-colors select-none hover:border-border max-sm:mr-10",
        className
      )}
    >
      {/* ─── TOP HEADER BAR (BORDER-B) ─── */}
      <div className="flex items-center justify-between gap-4 border-b border-border/50 bg-muted/20 px-3 py-1 font-mono text-[9px]">
        <div className="flex items-center gap-1.5">
          <span className="relative flex size-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-pp-secondary opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-pp-secondary" />
          </span>
          <span className="font-semibold tracking-wider text-foreground/85 uppercase">
            ORIGIN
          </span>
        </div>

        {showCoordinates && (
          <div className="font-mono text-[9px] tracking-wider text-muted-foreground/70">
            {coordinates}
          </div>
        )}
      </div>

      {/* ─── DATA COMPARTMENTS (BORDER-R / DIVIDE-X) ─── */}
      <div className="grid grid-cols-1 divide-y divide-border/50 font-mono text-[10px] sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:divide-border/50">
        {/* Cell 1: Location */}
        <div className="flex flex-col justify-center px-3 py-1.5">
          <span className="text-[8px] font-semibold tracking-wider text-muted-foreground/60 uppercase">
            LOCATION
          </span>
          <div className="mt-0.5 flex items-baseline gap-1 text-[11px] font-medium text-foreground">
            <span className="text-xs font-normal text-muted-foreground">
              From
            </span>
            <span>{location}</span>
          </div>
        </div>

        {/* Cell 2: Date */}
        <div className="flex flex-col justify-center px-3 py-1.5">
          <span className="text-[8px] font-semibold tracking-wider text-muted-foreground/60 uppercase">
            DATE
          </span>
          <div className="mt-0.5 text-[11px] font-medium text-foreground">
            {date || "23 Nov 2026"}
          </div>
        </div>

        {/* Cell 3: Time & Phase */}
        <div className="flex flex-col justify-center px-3 py-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[8px] font-semibold tracking-wider text-muted-foreground/60 uppercase">
              TIME (ICT)
            </span>
            <span
              className={cn(
                "py-0.2 rounded-xs border px-1 text-[8px] font-normal tracking-wider uppercase",
                phaseInfo.isBlueHour
                  ? "border-pp-secondary/30 bg-pp-secondary/10 text-pp-secondary"
                  : "border-border/60 bg-muted/40 text-muted-foreground"
              )}
            >
              {phaseInfo.label}
            </span>
          </div>
          <div className="mt-0.5 font-mono text-[11px] font-semibold tracking-tight text-foreground tabular-nums">
            {time || "--:--:--"}
          </div>
        </div>
      </div>
    </div>
  )
})

export const OriginTimeReadout = DraftingTimeReadout
