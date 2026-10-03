"use client"

import React, { useId } from "react"

import { cn } from "@/shared/lib/utils"

export interface BlueprintCanvasBackgroundProps {
  className?: string
  /** Whether to show the dotted background matrix grid (default: true) */
  showGrid?: boolean
  /** Whether to show the left edge measurement scale ticks (default: true) */
  showRuler?: boolean
  /** Whether to show subtle technical coordinate annotations (default: false) */
  showCoordinates?: boolean
}

/**
 * Technical CAD / Blueprint Vector Canvas Background
 *
 * Faithfully replicates the vector drafting layout from the reference image:
 * - Subtle CAD dotted grid matrix (32px tile) spanning full screen width and height
 * - Precision viewport measurement ruler pinned to the left edge with major/minor ticks
 * - Left circle drafting complex:
 *     - Shaded circle with 1px stroke
 *     - Center anchor node and coordinate axes (vertical up to edge, horizontal extension with drop-line)
 *     - Exact 45-degree diagonal guideline passing through circle center
 *     - Perimeter vector anchor handles (top-right, bottom-right, extension node)
 * - Top center drafting arc
 * - Top right bounding rectangle:
 *     - Shaded translucent fill and 1px stroke
 *     - Diagonal line passing from top-right corner through center node to bottom-left corner
 *     - Corner and center anchor nodes
 * - Top right drafting arc connecting to top-right corner of rectangle
 * - Bottom right shaded drafting triangle/polygon with horizontal baseline
 * - Rhythmic CAD snap handles (square node handles) aligned to grid coordinates
 * - Seamless adaptation for both dark & light themes using design tokens
 */
export function BlueprintCanvasBackground({
  className,
  showGrid = true,

  showCoordinates = false,
}: BlueprintCanvasBackgroundProps) {
  const patternId = useId()
  const gridPatternId = `blueprint-grid-pattern-${patternId}`

  // Rhythmic snap nodes at grid intersections (matches reference image placement)
  const snapNodes = [
    { x: 680, y: 160 },
    { x: 680, y: 340 },
    { x: 680, y: 520 },
    { x: 990, y: 520 },
    { x: 414, y: 600 },
    { x: 680, y: 600 },
    { x: 990, y: 600 },
  ]

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden opacity-60 transition-opacity duration-300 select-none",
        className
      )}
    >
      {/* ─── 1. Full-Bleed CAD Dotted Matrix Grid ─── */}
      {!showGrid && (
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id={gridPatternId}
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              {/* Subtle dashed vertical grid line */}
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="32"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeDasharray="1 3"
                className="text-foreground/[0.07] dark:text-white/[0.08]"
              />
              {/* Subtle dashed horizontal grid line */}
              <line
                x1="0"
                y1="0"
                x2="32"
                y2="0"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeDasharray="1 3"
                className="text-foreground/[0.07] dark:text-white/[0.08]"
              />
              {/* Intersection coordinate dot */}
              <circle
                cx="0"
                cy="0"
                r="1"
                className="fill-foreground/20 dark:fill-white/25"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={`url(#${gridPatternId})`}
            opacity="0.9"
          />
        </svg>
      )}

      {/* ─── 3. Main Vector Drafting Geometry Canvas ─── */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 680"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
      >
        {/* ─── Circle Drafting Complex ─── */}
        <g id="drafting-circle-group">
          {/* Shaded circle body */}
          <circle
            cx="280"
            cy="340"
            r="190"
            className="fill-foreground/[0.045] stroke-foreground/25 dark:fill-white/[0.04] dark:stroke-white/25"
            strokeWidth="1"
          />

          {/* Vertical axis: center to top */}
          <line
            x1="280"
            y1="340"
            x2="280"
            y2="0"
            className="stroke-foreground/25 dark:stroke-white/25"
            strokeWidth="1"
          />

          {/* Horizontal axis: center to right extension */}
          <line
            x1="280"
            y1="340"
            x2="540"
            y2="340"
            className="stroke-foreground/25 dark:stroke-white/25"
            strokeWidth="1"
          />

          {/* Vertical guide from right extension to top */}
          <line
            x1="540"
            y1="0"
            x2="540"
            y2="340"
            className="stroke-foreground/25 dark:stroke-white/25"
            strokeWidth="1"
          />

          {/* 45° Diagonal line passing precisely through circle center */}
          <line
            x1="0"
            y1="60"
            x2="620"
            y2="680"
            className="stroke-foreground/30 dark:stroke-white/30"
            strokeWidth="1"
          />

          {/* Circle Center Anchor Node */}
          <rect
            x="277"
            y="337"
            width="6"
            height="6"
            className="fill-background stroke-foreground/70 dark:fill-neutral-950 dark:stroke-white/80"
            strokeWidth="1"
          />

          {/* Perimeter 45° Top-Right Node */}
          <rect
            x={280 + 190 * 0.7071 - 3}
            y={340 - 190 * 0.7071 - 3}
            width="6"
            height="6"
            className="fill-background stroke-foreground/70 dark:fill-neutral-950 dark:stroke-white/80"
            strokeWidth="1"
          />

          {/* Perimeter -45° Bottom-Right Node */}
          <rect
            x={280 + 190 * 0.7071 - 3}
            y={340 + 190 * 0.7071 - 3}
            width="6"
            height="6"
            className="fill-background stroke-foreground/70 dark:fill-neutral-950 dark:stroke-white/80"
            strokeWidth="1"
          />

          {/* Right Extension Guide Node */}
          <rect
            x="537"
            y="337"
            width="6"
            height="6"
            className="fill-background stroke-foreground/70 dark:fill-neutral-950 dark:stroke-white/80"
            strokeWidth="1"
          />
        </g>

        {/* ─── Top Center Arc ─── */}
        <g id="drafting-top-center-arc">
          <path
            d="M 595 0 A 85 85 0 0 0 765 0"
            fill="none"
            className="stroke-foreground/25 dark:stroke-white/25"
            strokeWidth="1"
          />
        </g>

        {/* ─── Top Right Arc ─── */}
        <g id="drafting-top-right-arc">
          <path
            d="M 1120 0 A 85 85 0 0 0 1290 0"
            fill="none"
            className="stroke-foreground/25 dark:stroke-white/25"
            strokeWidth="1"
          />
        </g>

        {/* ─── Top Right Rectangle Group ─── */}
        <g id="drafting-rectangle-group">
          {/* Shaded Rectangle */}
          <rect
            x="860"
            y="10"
            width="260"
            height="225"
            className="fill-foreground/[0.045] stroke-foreground/25 dark:fill-white/[0.04] dark:stroke-white/25"
            strokeWidth="1"
          />

          {/* Diagonal bisector extending from top-right corner down towards baseline */}
          <line
            x1="1120"
            y1="10"
            x2="530"
            y2="520"
            className="stroke-foreground/30 dark:stroke-white/30"
            strokeWidth="1"
          />

          {/* Center Anchor Node */}
          <rect
            x="987"
            y="119.5"
            width="6"
            height="6"
            className="fill-background stroke-foreground/70 dark:fill-neutral-950 dark:stroke-white/80"
            strokeWidth="1"
          />

          {/* Bottom-Left Corner Node */}
          <rect
            x="857"
            y="232"
            width="6"
            height="6"
            className="fill-background stroke-foreground/70 dark:fill-neutral-950 dark:stroke-white/80"
            strokeWidth="1"
          />

          {/* Bottom-Right Corner Node */}
          <rect
            x="1117"
            y="232"
            width="6"
            height="6"
            className="fill-background stroke-foreground/70 dark:fill-neutral-950 dark:stroke-white/80"
            strokeWidth="1"
          />
        </g>

        {/* ─── Bottom Right Triangle / Slanted Drafting Ramp ─── */}
        <g id="drafting-triangle-group">
          {/* Shaded Triangle/Polygon between diagonal hypotenuse and horizontal baseline */}
          <polygon
            points="530,520 1440,520 1440,235 860,235"
            className="fill-foreground/[0.035] stroke-foreground/20 dark:fill-white/[0.03] dark:stroke-white/20"
            strokeWidth="1"
          />

          {/* Horizontal drafting baseline at y=520 */}
          <line
            x1="530"
            y1="520"
            x2="1440"
            y2="520"
            className="stroke-foreground/25 dark:stroke-white/25"
            strokeWidth="1"
          />

          {/* Apex node at triangle start on baseline (530, 520) */}
          <rect
            x="527"
            y="517"
            width="6"
            height="6"
            className="fill-background stroke-foreground/70 dark:fill-neutral-950 dark:stroke-white/80"
            strokeWidth="1"
          />
        </g>

        {/* ─── Rhythmic Grid Snap Nodes (CAD / Figma Vector Handles) ─── */}
        <g id="drafting-snap-nodes">
          {snapNodes.map((node, index) => (
            <rect
              key={`snap-node-${index}`}
              x={node.x - 3}
              y={node.y - 3}
              width="6"
              height="6"
              className="fill-background stroke-foreground/50 transition-opacity duration-300 dark:fill-neutral-950 dark:stroke-white/50"
              strokeWidth="1"
            />
          ))}
        </g>

        {/* ─── Optional Subtle Blueprint Coordinate Labels ─── */}
        {showCoordinates && (
          <g className="fill-foreground/30 font-mono text-[9px] tracking-tight select-none dark:fill-white/30">
            <text x="290" y="335">
              C(280, 340) • R190
            </text>
            <text x="870" y="30">
              W260 × H225
            </text>
            <text x="50" y="100">
              ∠ 45.0°
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}

export default BlueprintCanvasBackground
