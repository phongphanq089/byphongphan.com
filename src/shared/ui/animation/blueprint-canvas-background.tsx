import { useId } from "react"

import { cn } from "@/shared/lib/utils"

export interface BlueprintCanvasBackgroundProps {
  className?: string
  /** Whether to show the dotted background matrix grid (default: true) */
  showGrid?: boolean
  /** Optional legacy ruler prop (deprecated: rulers removed for clean minimalist geometry) */
  showRuler?: boolean
  /** Whether to show subtle technical coordinate annotations (default: false) */
  showCoordinates?: boolean
}

/**
 * Modern Minimalist Architectural Blueprint Vector Background
 *
 * Symmetrical, sophisticated geometric layout focusing on pure Squares & Circles:
 * - Perfect bilateral symmetry centered on (720, 340) in a 1440×680 viewBox
 * - Balanced Left & Right Modular Geometric Complexes:
 *     - 240×240 primary squares with inscribed precision circles (Ø240) and concentric inner rings (Ø120)
 *     - Symmetrical corner-to-corner diagonal bisectors
 *     - Top & Bottom 240×100 architectural framing rectangles with bisectors
 * - Central Radial Framing:
 *     - 320×320 center framing square with inscribed circle (Ø320) and outer orbital ring (Ø520)
 *     - Elegant symmetrical bridging arches connecting left and right complexes
 * - Clean continuous structural datum alignment lines across the canvas (no choppy short lines or rulers)
 * - Seamless adaptation for dark & light themes using semantic design tokens
 */
export function BlueprintCanvasBackground({
  className,
  showGrid = true,
  showCoordinates = false,
}: BlueprintCanvasBackgroundProps) {
  const patternId = useId()
  const gridPatternId = `blueprint-grid-pattern-${patternId}`

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden opacity-100 transition-opacity duration-300 select-none",
        className
      )}
    >
      {showGrid && (
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
                className="text-foreground/[0.09] dark:text-white/[0.08]"
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
                className="text-foreground/[0.09] dark:text-white/[0.08]"
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

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 680"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
      >
        {/* ─── 1. Continuous Structural Alignment Guidelines (Full Bleed Edge-to-Edge) ─── */}
        <g id="structural-alignment-lines" strokeWidth="1" fill="none">
          {/* Main Horizontal Datum (Y = 340) */}
          <line
            x1="-2000"
            y1="340"
            x2="3500"
            y2="340"
            className="stroke-foreground/[0.12] dark:stroke-white/[0.12]"
          />

          {/* Main Vertical Center Datum (X = 720) - Dashed */}
          <line
            x1="720"
            y1="-2000"
            x2="720"
            y2="3000"
            strokeDasharray="4 6"
            className="stroke-foreground/[0.10] dark:stroke-white/[0.10]"
          />

          {/* Left & Right Circle Center Vertical Axes - Dashed */}
          <line
            x1="240"
            y1="-2000"
            x2="240"
            y2="3000"
            strokeDasharray="4 6"
            className="stroke-foreground/[0.08] dark:stroke-white/[0.08]"
          />
          <line
            x1="1200"
            y1="-2000"
            x2="1200"
            y2="3000"
            strokeDasharray="4 6"
            className="stroke-foreground/[0.08] dark:stroke-white/[0.08]"
          />

          {/* Horizontal Tangent Alignment Datums */}
          <line
            x1="-2000"
            y1="220"
            x2="3500"
            y2="220"
            className="stroke-foreground/[0.07] dark:stroke-white/[0.07]"
          />
          <line
            x1="-2000"
            y1="460"
            x2="3500"
            y2="460"
            className="stroke-foreground/[0.07] dark:stroke-white/[0.07]"
          />
          <line
            x1="-2000"
            y1="180"
            x2="3500"
            y2="180"
            className="stroke-foreground/[0.06] dark:stroke-white/[0.06]"
          />
          <line
            x1="-2000"
            y1="500"
            x2="3500"
            y2="500"
            className="stroke-foreground/[0.06] dark:stroke-white/[0.06]"
          />
          <line
            x1="-2000"
            y1="70"
            x2="3500"
            y2="70"
            className="stroke-foreground/[0.05] dark:stroke-white/[0.05]"
          />
          <line
            x1="-2000"
            y1="610"
            x2="3500"
            y2="610"
            className="stroke-foreground/[0.05] dark:stroke-white/[0.05]"
          />

          {/* Vertical Grid Struts (Full Bleed Top-to-Bottom) */}
          <line
            x1="120"
            y1="-2000"
            x2="120"
            y2="3000"
            className="stroke-foreground/[0.07] dark:stroke-white/[0.07]"
          />
          <line
            x1="360"
            y1="-2000"
            x2="360"
            y2="3000"
            className="stroke-foreground/[0.07] dark:stroke-white/[0.07]"
          />
          <line
            x1="560"
            y1="-2000"
            x2="560"
            y2="3000"
            className="stroke-foreground/[0.06] dark:stroke-white/[0.06]"
          />
          <line
            x1="880"
            y1="-2000"
            x2="880"
            y2="3000"
            className="stroke-foreground/[0.06] dark:stroke-white/[0.06]"
          />
          <line
            x1="1080"
            y1="-2000"
            x2="1080"
            y2="3000"
            className="stroke-foreground/[0.07] dark:stroke-white/[0.07]"
          />
          <line
            x1="1320"
            y1="-2000"
            x2="1320"
            y2="3000"
            className="stroke-foreground/[0.07] dark:stroke-white/[0.07]"
          />
        </g>

        {/* ─── 2. Center Geometric Composition (Framing Square & Circles) ─── */}
        <g id="center-geometric-complex">
          {/* Outer Orbital Circle */}
          <circle
            cx="720"
            cy="340"
            r="260"
            strokeDasharray="4 6"
            className="stroke-foreground/[0.08] dark:stroke-white/[0.08]"
            strokeWidth="1"
            fill="none"
          />

          {/* Center Framing Square (320 × 320) */}
          <rect
            x="560"
            y="180"
            width="320"
            height="320"
            className="fill-foreground/[0.015] stroke-foreground/[0.10] dark:fill-white/[0.015] dark:stroke-white/10"
            strokeWidth="1"
          />

          {/* Inscribed Center Circle (Ø320) */}
          <circle
            cx="720"
            cy="340"
            r="160"
            className="fill-foreground/[0.02] stroke-foreground/[0.12] dark:fill-white/[0.02] dark:stroke-white/12"
            strokeWidth="1"
          />

          {/* Symmetrical Bridging Arcs */}
          <path
            d="M 360 120 A 360 100 0 0 1 1080 120"
            className="stroke-foreground/[0.08] dark:stroke-white/[0.08]"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M 360 560 A 360 100 0 0 0 1080 560"
            className="stroke-foreground/[0.08] dark:stroke-white/[0.08]"
            strokeWidth="1"
            fill="none"
          />
        </g>

        {/* ─── 3. Left Symmetrical Modular Blocks (Squares & Circles) ─── */}
        <g id="left-geometric-blocks">
          {/* Top Architectural Rectangle */}
          <rect
            x="120"
            y="70"
            width="240"
            height="100"
            className="fill-foreground/[0.02] stroke-foreground/[0.10] dark:fill-white/[0.02] dark:stroke-white/10"
            strokeWidth="1"
          />
          <line
            x1="120"
            y1="70"
            x2="360"
            y2="170"
            className="stroke-foreground/[0.06] dark:stroke-white/[0.06]"
            strokeWidth="1"
          />

          {/* Primary Left Square (240 × 240) */}
          <rect
            x="120"
            y="220"
            width="240"
            height="240"
            className="fill-foreground/[0.025] stroke-foreground/[0.12] dark:fill-white/[0.025] dark:stroke-white/12"
            strokeWidth="1"
          />

          {/* Corner-to-Corner Diagonal Bisectors */}
          <line
            x1="120"
            y1="220"
            x2="360"
            y2="460"
            className="stroke-foreground/[0.07] dark:stroke-white/[0.07]"
            strokeWidth="1"
          />
          <line
            x1="120"
            y1="460"
            x2="360"
            y2="220"
            className="stroke-foreground/[0.07] dark:stroke-white/[0.07]"
            strokeWidth="1"
          />

          {/* Inscribed Precision Circle (Ø240) */}
          <circle
            cx="240"
            cy="340"
            r="120"
            className="fill-foreground/[0.02] stroke-foreground/[0.12] dark:fill-white/[0.02] dark:stroke-white/12"
            strokeWidth="1"
          />

          {/* Inner Concentric Circle (Ø120) */}
          <circle
            cx="240"
            cy="340"
            r="60"
            strokeDasharray="3 5"
            className="stroke-foreground/[0.10] dark:stroke-white/10"
            strokeWidth="1"
            fill="none"
          />

          {/* Bottom Architectural Rectangle */}
          <rect
            x="120"
            y="510"
            width="240"
            height="100"
            className="fill-foreground/[0.02] stroke-foreground/[0.10] dark:fill-white/[0.02] dark:stroke-white/10"
            strokeWidth="1"
          />
          <line
            x1="120"
            y1="610"
            x2="360"
            y2="510"
            className="stroke-foreground/[0.06] dark:stroke-white/[0.06]"
            strokeWidth="1"
          />
        </g>

        {/* ─── 4. Right Symmetrical Modular Blocks (Exact Mirror of Left) ─── */}
        <g id="right-geometric-blocks">
          {/* Top Architectural Rectangle */}
          <rect
            x="1080"
            y="70"
            width="240"
            height="100"
            className="fill-foreground/[0.02] stroke-foreground/[0.10] dark:fill-white/[0.02] dark:stroke-white/10"
            strokeWidth="1"
          />
          <line
            x1="1080"
            y1="70"
            x2="1320"
            y2="170"
            className="stroke-foreground/[0.06] dark:stroke-white/[0.06]"
            strokeWidth="1"
          />

          {/* Primary Right Square (240 × 240) */}
          <rect
            x="1080"
            y="220"
            width="240"
            height="240"
            className="fill-foreground/[0.025] stroke-foreground/[0.12] dark:fill-white/[0.025] dark:stroke-white/12"
            strokeWidth="1"
          />

          {/* Corner-to-Corner Diagonal Bisectors */}
          <line
            x1="1080"
            y1="220"
            x2="1320"
            y2="460"
            className="stroke-foreground/[0.07] dark:stroke-white/[0.07]"
            strokeWidth="1"
          />
          <line
            x1="1080"
            y1="460"
            x2="1320"
            y2="220"
            className="stroke-foreground/[0.07] dark:stroke-white/[0.07]"
            strokeWidth="1"
          />

          {/* Inscribed Precision Circle (Ø240) */}
          <circle
            cx="1200"
            cy="340"
            r="120"
            className="fill-foreground/[0.02] stroke-foreground/[0.12] dark:fill-white/[0.02] dark:stroke-white/12"
            strokeWidth="1"
          />

          {/* Inner Concentric Circle (Ø120) */}
          <circle
            cx="1200"
            cy="340"
            r="60"
            strokeDasharray="3 5"
            className="stroke-foreground/[0.10] dark:stroke-white/10"
            strokeWidth="1"
            fill="none"
          />

          {/* Bottom Architectural Rectangle */}
          <rect
            x="1080"
            y="510"
            width="240"
            height="100"
            className="fill-foreground/[0.02] stroke-foreground/[0.10] dark:fill-white/[0.02] dark:stroke-white/10"
            strokeWidth="1"
          />
          <line
            x1="1080"
            y1="610"
            x2="1320"
            y2="510"
            className="stroke-foreground/[0.06] dark:stroke-white/[0.06]"
            strokeWidth="1"
          />
        </g>

        {/* ─── 5. Optional Minimalist Technical Typography ─── */}
        {showCoordinates && (
          <g className="fill-foreground/35 font-mono text-[9px] tracking-widest uppercase select-none dark:fill-white/30">
            <text x="720" y="34" textAnchor="middle">
              MODULE // 01 · RATIO 1:1 · GRID 1440 × 680
            </text>
            <text x="240" y="345" textAnchor="middle">
              240 × 240 // Ø 240
            </text>
            <text x="1200" y="345" textAnchor="middle">
              240 × 240 // Ø 240
            </text>
            <text x="720" y="654" textAnchor="middle">
              CENTER // 720.00 · 340.00
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}

export default BlueprintCanvasBackground
