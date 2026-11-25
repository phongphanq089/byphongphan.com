import { useId } from "react"

import { cn } from "@/shared/lib/utils"

export interface BlueprintCanvasBackgroundProps {
  className?: string
  /** Whether to show the dotted background matrix grid (default: true) */
  showGrid?: boolean
  /** Optional legacy ruler prop */
  showRuler?: boolean
  /** Whether to show FE / Design technical spec annotations & dimensions (default: true) */
  showCoordinates?: boolean
}

/**
 * Design Engineering & Frontend Spec Blueprint Background
 *
 * Combines architectural symmetry with Figma inspection redlines, CAD hollow arrows,
 * 45° diagonal hatching zones, 30° isometric bevel callouts, and Tailwind/CSS token specs.
 */
export function BlueprintCanvasBackground({
  className,
  showGrid = true,
  showCoordinates = true,
}: BlueprintCanvasBackgroundProps) {
  const rawId = useId().replace(/:/g, "")
  const gridPatternId = `bp-grid-${rawId}`
  const hatchPatternId = `bp-hatch-${rawId}`

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden select-none",
        className
      )}
    >
      {/* ─── Layer 1: Micro Dot & Dashed Sub-Grid (32×32px) ─── */}
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
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="32"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeDasharray="1 3"
                className="text-foreground/[0.08] dark:text-white/[0.07]"
              />
              <line
                x1="0"
                y1="0"
                x2="32"
                y2="0"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeDasharray="1 3"
                className="text-foreground/[0.08] dark:text-white/[0.07]"
              />
              <circle
                cx="0"
                cy="0"
                r="1"
                className="fill-foreground/20 dark:fill-white/20"
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

      {/* ─── Layer 2: Main Design / FE Architectural Spec Vector ─── */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 680"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
      >
        <defs>
          {/* 45° Diagonal Technical Hatching (for padding/bevel inspection zones) */}
          <pattern
            id={hatchPatternId}
            width="8"
            height="8"
            patternTransform="rotate(45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="currentColor"
              strokeWidth="1"
              className="text-foreground/[0.07] dark:text-white/[0.07]"
            />
          </pattern>
        </defs>

        {/* ─── 1. Continuous Structural Alignment Guidelines (Full Bleed) ─── */}
        <g id="structural-alignment-lines" strokeWidth="1" fill="none">
          {/* Main Horizontal Center Axis (Y = 340) */}
          <line
            x1="-2000"
            y1="340"
            x2="3500"
            y2="340"
            className="stroke-foreground/[0.11] dark:stroke-white/[0.11]"
          />

          {/* Main Vertical Center Axis (X = 720) */}
          <line
            x1="720"
            y1="-2000"
            x2="720"
            y2="3000"
            strokeDasharray="4 6"
            className="stroke-foreground/[0.10] dark:stroke-white/[0.10]"
          />

          {/* Left & Right Modular Axes (X = 240, X = 1200) */}
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

          {/* Horizontal Component Bounding Guidelines */}
          {[70, 180, 220, 460, 500, 610].map((y) => (
            <line
              key={`h-guide-${y}`}
              x1="-2000"
              y1={y}
              x2="3500"
              y2={y}
              className="stroke-foreground/[0.06] dark:stroke-white/[0.06]"
            />
          ))}

          {/* Vertical Column Grid Struts */}
          {[120, 360, 496, 560, 880, 944, 1080, 1320].map((x) => (
            <line
              key={`v-guide-${x}`}
              x1={x}
              y1="-2000"
              x2={x}
              y2="3000"
              className="stroke-foreground/[0.06] dark:stroke-white/[0.06]"
            />
          ))}
        </g>

        {/* ─── 2. Center UI Viewport Frame & Radial Lens (X: 496..944, W: 448) ─── */}
        <g id="center-ui-viewport">
          {/* Outer Max-W-MD (448px) Container Guide */}
          <rect
            x="496"
            y="148"
            width="448"
            height="384"
            rx="12"
            strokeDasharray="3 5"
            className="fill-foreground/[0.01] stroke-foreground/[0.09] dark:fill-white/[0.01] dark:stroke-white/[0.09]"
            strokeWidth="1"
          />

          {/* Hatched Top & Bottom Padding Strips (h-8 / 32px) */}
          <rect
            x="560"
            y="148"
            width="320"
            height="32"
            fill={`url(#${hatchPatternId})`}
            className="stroke-foreground/[0.07] dark:stroke-white/[0.07]"
            strokeWidth="0.75"
          />
          <rect
            x="560"
            y="500"
            width="320"
            height="32"
            fill={`url(#${hatchPatternId})`}
            className="stroke-foreground/[0.07] dark:stroke-white/[0.07]"
            strokeWidth="0.75"
          />

          {/* Outer Orbital Ring (Ø520) */}
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
            className="fill-foreground/[0.015] stroke-foreground/[0.13] dark:fill-white/[0.015] dark:stroke-white/[0.13]"
            strokeWidth="1"
          />

          {/* Inscribed Circle (Ø320) */}
          <circle
            cx="720"
            cy="340"
            r="160"
            className="fill-foreground/[0.015] stroke-foreground/[0.12] dark:fill-white/[0.015] dark:stroke-white/[0.12]"
            strokeWidth="1"
          />

          {/* Inner Core Circle (Ø160 -> r=80, matching Reference Image 1) */}
          <circle
            cx="720"
            cy="340"
            r="80"
            strokeDasharray="2 4"
            className="fill-foreground/[0.02] stroke-foreground/[0.14] dark:fill-white/[0.02] dark:stroke-white/[0.14]"
            strokeWidth="1"
          />

          {/* Cubic-Bezier Easing Curve Overlay & Tangents */}
          <path
            d="M 560 500 C 640 500, 650 180, 880 180"
            className="stroke-foreground/[0.14] dark:stroke-white/[0.14]"
            strokeWidth="1.25"
            fill="none"
          />
          {/* Bezier Control Handles */}
          <line
            x1="560"
            y1="500"
            x2="640"
            y2="500"
            strokeDasharray="2 2"
            className="stroke-foreground/[0.16] dark:stroke-white/[0.16]"
            strokeWidth="1"
          />
          <circle
            cx="640"
            cy="500"
            r="3"
            className="fill-background stroke-foreground/40 dark:stroke-white/40"
            strokeWidth="1"
          />
          <line
            x1="880"
            y1="180"
            x2="650"
            y2="180"
            strokeDasharray="2 2"
            className="stroke-foreground/[0.16] dark:stroke-white/[0.16]"
            strokeWidth="1"
          />
          <circle
            cx="650"
            cy="180"
            r="3"
            className="fill-background stroke-foreground/40 dark:stroke-white/40"
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

        {/* ─── 3. Left Design System Complex (Component Card, Ø160 Callout & 30° Bevel) ─── */}
        <g id="left-design-complex">
          {/* Top UI Header Slot (240 × 100) with Mock Skeleton Bars */}
          <rect
            x="120"
            y="70"
            width="240"
            height="100"
            rx="6"
            className="fill-foreground/[0.02] stroke-foreground/[0.12] dark:fill-white/[0.02] dark:stroke-white/[0.12]"
            strokeWidth="1"
          />
          <rect
            x="136"
            y="88"
            width="56"
            height="14"
            rx="7"
            className="fill-foreground/[0.05] stroke-foreground/[0.12] dark:fill-white/[0.05] dark:stroke-white/[0.12]"
            strokeWidth="0.75"
          />
          <line
            x1="136"
            y1="118"
            x2="290"
            y2="118"
            className="stroke-foreground/[0.10] dark:stroke-white/[0.10]"
            strokeWidth="1"
          />
          <line
            x1="136"
            y1="134"
            x2="230"
            y2="134"
            className="stroke-foreground/[0.07] dark:stroke-white/[0.07]"
            strokeWidth="1"
          />

          {/* Hatched Gap Zone between Top Card & Main Square (Y: 170..220) */}
          <rect
            x="120"
            y="170"
            width="240"
            height="50"
            fill={`url(#${hatchPatternId})`}
          />

          {/* Primary Left Square (240 × 240) */}
          <rect
            x="120"
            y="220"
            width="240"
            height="240"
            className="fill-foreground/[0.025] stroke-foreground/[0.13] dark:fill-white/[0.025] dark:stroke-white/[0.13]"
            strokeWidth="1"
          />
          <line
            x1="120"
            y1="220"
            x2="360"
            y2="460"
            className="stroke-foreground/[0.06] dark:stroke-white/[0.06]"
            strokeWidth="1"
          />
          <line
            x1="120"
            y1="460"
            x2="360"
            y2="220"
            className="stroke-foreground/[0.06] dark:stroke-white/[0.06]"
            strokeWidth="1"
          />

          {/* Inscribed Circle (Ø240) & Inner Ring (Ø160 -> r=80) */}
          <circle
            cx="240"
            cy="340"
            r="120"
            className="fill-foreground/[0.015] stroke-foreground/[0.12] dark:fill-white/[0.015] dark:stroke-white/[0.12]"
            strokeWidth="1"
          />
          <circle
            cx="240"
            cy="340"
            r="80"
            strokeDasharray="3 5"
            className="stroke-foreground/[0.14] dark:stroke-white/[0.14]"
            strokeWidth="1"
            fill="none"
          />

          {/* Bottom 30° Isometric Hatched Bevel Block (Matches Reference Image 3) */}
          <rect
            x="120"
            y="510"
            width="240"
            height="100"
            className="fill-foreground/[0.015] stroke-foreground/[0.10] dark:fill-white/[0.015] dark:stroke-white/[0.10]"
            strokeWidth="1"
          />
          {/* 30° Sloped Hatched Polygon: from (170, 510) sloping down at exactly 30° to (343.2, 610) */}
          <polygon
            points="120,610 120,540 170,510 343.2,610"
            fill={`url(#${hatchPatternId})`}
            className="stroke-foreground/[0.18] dark:stroke-white/[0.18]"
            strokeWidth="1"
          />
        </g>

        {/* ─── 4. Right Frontend / Layout Complex (Flex/Grid Wireframe & Tokens) ─── */}
        <g id="right-fe-complex">
          {/* Top Bento Grid Wireframe (240 × 100) */}
          <rect
            x="1080"
            y="70"
            width="240"
            height="100"
            rx="6"
            className="fill-foreground/[0.02] stroke-foreground/[0.12] dark:fill-white/[0.02] dark:stroke-white/[0.12]"
            strokeWidth="1"
          />
          <rect
            x="1092"
            y="82"
            width="68"
            height="76"
            rx="4"
            strokeDasharray="2 3"
            className="fill-foreground/[0.02] stroke-foreground/[0.10] dark:fill-white/[0.02] dark:stroke-white/[0.10]"
            strokeWidth="1"
          />
          <rect
            x="1168"
            y="82"
            width="140"
            height="34"
            rx="4"
            className="fill-foreground/[0.025] stroke-foreground/[0.10] dark:fill-white/[0.025] dark:stroke-white/[0.10]"
            strokeWidth="1"
          />
          <rect
            x="1168"
            y="124"
            width="140"
            height="34"
            rx="4"
            fill={`url(#${hatchPatternId})`}
            className="stroke-foreground/[0.10] dark:stroke-white/[0.10]"
            strokeWidth="1"
          />

          {/* Primary Right Square (240 × 240) */}
          <rect
            x="1080"
            y="220"
            width="240"
            height="240"
            className="fill-foreground/[0.025] stroke-foreground/[0.13] dark:fill-white/[0.025] dark:stroke-white/[0.13]"
            strokeWidth="1"
          />
          <line
            x1="1080"
            y1="220"
            x2="1320"
            y2="460"
            className="stroke-foreground/[0.06] dark:stroke-white/[0.06]"
            strokeWidth="1"
          />
          <line
            x1="1080"
            y1="460"
            x2="1320"
            y2="220"
            className="stroke-foreground/[0.06] dark:stroke-white/[0.06]"
            strokeWidth="1"
          />

          {/* Inscribed Circle (Ø240) & Inner Ring (Ø120) */}
          <circle
            cx="1200"
            cy="340"
            r="120"
            className="fill-foreground/[0.015] stroke-foreground/[0.12] dark:fill-white/[0.015] dark:stroke-white/[0.12]"
            strokeWidth="1"
          />
          <circle
            cx="1200"
            cy="340"
            r="60"
            strokeDasharray="3 5"
            className="stroke-foreground/[0.12] dark:stroke-white/[0.12]"
            strokeWidth="1"
            fill="none"
          />

          {/* Hatched Margin Zone (Y: 460..510) */}
          <rect
            x="1080"
            y="460"
            width="240"
            height="50"
            fill={`url(#${hatchPatternId})`}
          />

          {/* Bottom Architectural Slot (240 × 100) */}
          <rect
            x="1080"
            y="510"
            width="240"
            height="100"
            rx="6"
            className="fill-foreground/[0.02] stroke-foreground/[0.12] dark:fill-white/[0.02] dark:stroke-white/[0.12]"
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

        {/* ─── 5. Figma Vertex Selection Handles (5×5px Squares at Key Intersections) ─── */}
        <g
          id="figma-selection-nodes"
          className="fill-background stroke-foreground/30 dark:stroke-white/30"
          strokeWidth="1"
        >
          {[
            [120, 220],
            [360, 220],
            [120, 460],
            [360, 460],
            [560, 180],
            [880, 180],
            [560, 500],
            [880, 500],
            [1080, 220],
            [1320, 220],
            [1080, 460],
            [1320, 460],
          ].map(([cx, cy], idx) => (
            <rect
              key={`node-${idx}`}
              x={cx - 2.5}
              y={cy - 2.5}
              width="5"
              height="5"
            />
          ))}
        </g>

        {/* ─── 6. CAD / Figma / Tailwind Dimension Callouts (Matches Attached Images) ─── */}
        {showCoordinates && (
          <g
            id="technical-spec-callouts"
            className="font-mono text-[10px] tracking-wider select-none"
          >
            {/* ── A. Top Width T-Bar Dimension: "w-full - max 448" (Reference Image 2) ── */}
            <g
              className="stroke-foreground/25 dark:stroke-white/25"
              strokeWidth="1"
            >
              <line x1="496" y1="126" x2="944" y2="126" />
              <line x1="496" y1="120" x2="496" y2="132" />
              <line x1="944" y1="120" x2="944" y2="132" />
            </g>
            <text
              x="720"
              y="116"
              textAnchor="middle"
              className="fill-foreground/45 dark:fill-white/45"
            >
              w-full - max 448
            </text>

            {/* ── B. Left Inner Ring Vertical Diameter: "Ø160" with Hollow Arrows (Reference Image 1) ── */}
            <g
              className="stroke-foreground/30 dark:stroke-white/30"
              strokeWidth="1"
              fill="none"
            >
              {/* Top & Bottom Horizontal Witness Lines */}
              <line x1="228" y1="260" x2="252" y2="260" />
              <line x1="228" y1="420" x2="252" y2="420" />
              {/* Top Hollow Arrowhead */}
              <polygon points="240,261 236.5,270 243.5,270" />
              <line x1="240" y1="270" x2="240" y2="326" />
              {/* Bottom Hollow Arrowhead */}
              <line x1="240" y1="354" x2="240" y2="410" />
              <polygon points="240,419 236.5,410 243.5,410" />
            </g>
            <text
              x="240"
              y="343.5"
              textAnchor="middle"
              className="fill-foreground/50 dark:fill-white/50"
            >
              Ø160
            </text>

            {/* ── C. Center Lens Vertical Diameter: "Ø160" with Hollow Arrows ── */}
            <g
              className="stroke-foreground/30 dark:stroke-white/30"
              strokeWidth="1"
              fill="none"
            >
              <line x1="708" y1="260" x2="732" y2="260" />
              <line x1="708" y1="420" x2="732" y2="420" />
              <polygon points="720,261 716.5,270 723.5,270" />
              <line x1="720" y1="270" x2="720" y2="326" />
              <line x1="720" y1="354" x2="720" y2="410" />
              <polygon points="720,419 716.5,410 723.5,410" />
            </g>
            <text
              x="720"
              y="343.5"
              textAnchor="middle"
              className="fill-foreground/50 dark:fill-white/50"
            >
              Ø160
            </text>

            {/* ── D. Bottom-Left 30° Bevel Angle Callout (Reference Image 3) ── */}
            <g
              className="stroke-foreground/30 dark:stroke-white/30"
              strokeWidth="1"
              fill="none"
            >
              {/* Horizontal Reference Line from Vertex (170, 510) */}
              <line x1="170" y1="510" x2="268" y2="510" />
              {/* Arc from 8° to 24° (radius = 76) between the two hollow arrowheads */}
              <path d="M 245.2 520.5 A 76 76 0 0 1 239.4 540.9" />
              {/* Top Hollow Arrowhead at (246, 510) */}
              <polygon points="246,510.5 242.5,520.5 249,520.5" />
              {/* Bottom Hollow Arrowhead on 30° slope at (235.8, 548) */}
              <polygon points="235.8,548 236.5,537.5 242.6,541.2" />
            </g>
            <text
              x="256"
              y="539"
              className="fill-foreground/50 dark:fill-white/50"
            >
              30°
            </text>

            {/* ── E. Right Block Width & Height T-Bar Specs ── */}
            <g
              className="stroke-foreground/25 dark:stroke-white/25"
              strokeWidth="1"
            >
              {/* Top T-Bar on Right Square */}
              <line x1="1080" y1="202" x2="1320" y2="202" />
              <line x1="1080" y1="197" x2="1080" y2="207" />
              <line x1="1320" y1="197" x2="1320" y2="207" />

              {/* Right Vertical T-Bar */}
              <line x1="1340" y1="220" x2="1340" y2="460" />
              <line x1="1335" y1="220" x2="1345" y2="220" />
              <line x1="1335" y1="460" x2="1345" y2="460" />
            </g>
            <text
              x="1200"
              y="194"
              textAnchor="middle"
              className="fill-foreground/40 dark:fill-white/40"
            >
              w-60 · 240px
            </text>
            <text
              x="1200"
              y="343.5"
              textAnchor="middle"
              className="fill-foreground/45 dark:fill-white/45"
            >
              Ø240 // 1:1
            </text>

            {/* ── F. Subtle FE / Design System Metadata Annotations ── */}
            <g className="fill-foreground/30 text-[9px] tracking-widest uppercase dark:fill-white/30">
              <text x="120" y="54">
                FIGMA // LAYER_INSPECT · 01
              </text>
              <text x="1320" y="54" textAnchor="end">
                DISPLAY: GRID · GAP-6 (24PX)
              </text>
              <text x="572" y="198">
                cubic-bezier(0.22, 1, 0.36, 1)
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  )
}

export default BlueprintCanvasBackground
