"use client"

import React, { memo, useCallback, useRef, useState } from "react"

import { cn } from "@/shared/lib/utils"

/**
 * Maximum ruler static coverage width in pixels (covers up to 5K displays 5120x2880)
 * Pre-computed statically so ruler renders 100% full width from frame 0 even without JS / SSR
 */
const MAX_RULER_WIDTH = 5120

/** Pitch between ticks in pixels */
const PITCH = 10

/** Total number of ticks */
const TOTAL_TICKS = Math.floor(MAX_RULER_WIDTH / PITCH)

/** Tick roles based on 10px pitch */
type TickRole = "main" | "sub-mid" | "sub-small"

function getTickRole(pixelX: number): TickRole {
  if (pixelX % 100 === 0) return "main"
  if (pixelX % 50 === 0) return "sub-mid"
  return "sub-small"
}

/** Base resting geometry for ticks */
const BASE_TICK: Record<TickRole, { height: number; className: string }> = {
  main: {
    height: 14,
    className: "bg-foreground/40 dark:bg-white/30",
  },
  "sub-mid": {
    height: 9,
    className: "bg-foreground/25 dark:bg-white/20",
  },
  "sub-small": {
    height: 5,
    className: "bg-foreground/15 dark:bg-white/10",
  },
}

/**
 * LineNav-inspired proximity wave geometry table
 * Δ is the distance in ticks from the cursor
 */
const WAVE: { height: number; className: string; glowClass: string }[] = [
  {
    height: 30,
    className: "bg-pp-secondary",
    glowClass:
      "shadow-[0_0_10px_var(--pp-secondary-glow)] drop-shadow-[0_0_8px_var(--pp-secondary-glow)]",
  },
  {
    height: 24,
    className: "bg-pp-secondary/75",
    glowClass: "shadow-[0_0_6px_var(--pp-secondary-glow)]",
  },
  {
    height: 19,
    className: "bg-pp-secondary/50",
    glowClass: "shadow-none",
  },
  {
    height: 14,
    className: "bg-pp-secondary/30",
    glowClass: "shadow-none",
  },
  {
    height: 10,
    className: "bg-pp-secondary/20",
    glowClass: "shadow-none",
  },
]

function getTickGeometry(role: TickRole, delta: number) {
  if (delta < WAVE.length) {
    return WAVE[delta]
  }
  const base = BASE_TICK[role]
  return {
    height: base.height,
    className: base.className,
    glowClass: "shadow-none",
  }
}

/** Pre-computed static labels at every 100px: 0, 100, 200, ... 5100 */
const STATIC_LABELS: number[] = []
for (let x = 0; x <= MAX_RULER_WIDTH; x += 100) {
  STATIC_LABELS.push(x)
}

/** Pre-computed static tick list: 0px to 5120px */
const STATIC_TICKS = Array.from({ length: TOTAL_TICKS + 1 }, (_, i) => {
  const pixelX = i * PITCH
  return {
    index: i,
    pixelX,
    role: getTickRole(pixelX),
  }
})

export const FullWidthCaliperRuler = memo(function FullWidthCaliperRuler() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoverX, setHoverX] = useState<number | null>(null)

  const hoverTickIndex = hoverX !== null ? Math.round(hoverX / PITCH) : null

  // Mouse event handlers with client coordinates
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
    setHoverX(x)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoverX(null)
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative z-20 w-full overflow-hidden border-b border-border/40 bg-transparent pt-7 pb-2 select-none"
      aria-label="Full-Width Caliper Ruler"
    >
      {/* Dynamic Hover Vertical Crosshair line slicing all the way through the ruler */}
      {hoverX !== null && (
        <div
          style={{ left: `${hoverX}px` }}
          className="pointer-events-none absolute inset-y-0 z-20 w-px bg-pp-secondary/50"
        />
      )}

      {/* Floating Proximity Cursor Tooltip (Safely inside container top padding, never cut off) */}
      {hoverX !== null && (
        <div
          style={{ left: `${hoverX}px` }}
          className="pointer-events-none absolute top-1 z-40 -translate-x-1/2 rounded border border-pp-secondary/50 bg-background/95 px-1.5 py-0.5 font-mono text-[9px] font-semibold whitespace-nowrap text-pp-secondary shadow-[0_0_12px_var(--pp-secondary-glow)] backdrop-blur-md"
        >
          {Math.round(hoverX)} px
        </div>
      )}

      {/* Static Uniform Number Labels across the screen (SSR-safe, full from frame 0) */}
      <div className="relative h-4 w-full">
        {STATIC_LABELS.map((x) => {
          const isNearby = hoverX !== null && Math.abs(x - hoverX) < 35
          return (
            <span
              key={x}
              style={{
                left: `${x}px`,
                transform: x === 0 ? "translateX(0)" : "translateX(-50%)",
              }}
              className={cn(
                "absolute top-0 font-mono text-[9px] tracking-wider whitespace-nowrap text-muted-foreground/60 tabular-nums transition-colors duration-150 select-none",
                x === 0 && "pl-2",
                isNearby && "font-semibold text-pp-secondary"
              )}
            >
              {x}
            </span>
          )
        })}
      </div>

      {/* Ruler Graduation Ticks Row (SSR-safe, pre-computed up to 5120px) */}
      <div className="relative mt-1 flex h-8 w-full items-end">
        {/* Continuous bottom baseline hairline */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-border/60" />

        {/* Static ticks with dynamic hover wave */}
        {STATIC_TICKS.map((tick) => {
          const delta =
            hoverTickIndex !== null
              ? Math.abs(tick.index - hoverTickIndex)
              : 999
          const geo = getTickGeometry(tick.role, delta)

          return (
            <span
              key={tick.pixelX}
              style={{
                left: `${tick.pixelX}px`,
                height: `${geo.height}px`,
              }}
              className={cn(
                "absolute bottom-0 w-px transition-[height,background-color,box-shadow] duration-150 ease-out",
                geo.className,
                geo.glowClass
              )}
            />
          )
        })}
      </div>
    </div>
  )
})
