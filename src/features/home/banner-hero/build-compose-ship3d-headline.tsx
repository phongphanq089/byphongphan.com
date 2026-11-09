import type { Transition } from "motion/react"
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"
import React, { useEffect, useId, useRef } from "react"

import { cn } from "@/shared/lib/utils"

function playTapSound() {
  if (typeof window === "undefined") return
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(540, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.06)
    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.06)
  } catch {
    // Ignore audio context errors
  }
}

const transition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 18,
  stiffness: 200,
}

// ── 3D Isometric Block Font Geometry Engine ──
type Pt = [number, number]

interface GlyphDef {
  width: number
  loops: Pt[][] // First loop = outer boundary (CW), subsequent = inner cutouts (CW)
}

// Base height: y from 42 (top) to 178 (bottom) -> height = 136, stem = 22
const GLYPHS: Record<string, GlyphDef> = {
  B: {
    width: 76,
    loops: [
      [
        [0, 42],
        [64, 42],
        [64, 99],
        [76, 99],
        [76, 178],
        [0, 178],
      ],
      [
        [22, 64],
        [42, 64],
        [42, 99],
        [22, 99],
      ],
      [
        [22, 121],
        [54, 121],
        [54, 156],
        [22, 156],
      ],
    ],
  },
  U: {
    width: 76,
    loops: [
      [
        [0, 42],
        [22, 42],
        [22, 156],
        [54, 156],
        [54, 42],
        [76, 42],
        [76, 178],
        [0, 178],
      ],
    ],
  },
  I: {
    width: 26,
    loops: [
      [
        [0, 42],
        [26, 42],
        [26, 178],
        [0, 178],
      ],
    ],
  },
  L: {
    width: 68,
    loops: [
      [
        [0, 42],
        [22, 42],
        [22, 156],
        [68, 156],
        [68, 178],
        [0, 178],
      ],
    ],
  },
  D: {
    width: 76,
    loops: [
      [
        [0, 42],
        [62, 42],
        [76, 56],
        [76, 164],
        [62, 178],
        [0, 178],
      ],
      [
        [22, 64],
        [54, 64],
        [54, 156],
        [22, 156],
      ],
    ],
  },
  C: {
    width: 74,
    loops: [
      [
        [0, 42],
        [74, 42],
        [74, 64],
        [22, 64],
        [22, 156],
        [74, 156],
        [74, 178],
        [0, 178],
      ],
    ],
  },
  O: {
    width: 78,
    loops: [
      [
        [0, 42],
        [78, 42],
        [78, 178],
        [0, 178],
      ],
      [
        [22, 64],
        [56, 64],
        [56, 156],
        [22, 156],
      ],
    ],
  },
  M: {
    width: 96,
    loops: [
      [
        [0, 42],
        [22, 42],
        [48, 108],
        [74, 42],
        [96, 42],
        [96, 178],
        [74, 178],
        [74, 96],
        [54, 144],
        [42, 144],
        [22, 96],
        [22, 178],
        [0, 178],
      ],
    ],
  },
  P: {
    width: 76,
    loops: [
      [
        [0, 42],
        [76, 42],
        [76, 118],
        [22, 118],
        [22, 178],
        [0, 178],
      ],
      [
        [22, 64],
        [54, 64],
        [54, 96],
        [22, 96],
      ],
    ],
  },
  S: {
    width: 74,
    loops: [
      [
        [0, 42],
        [74, 42],
        [74, 64],
        [22, 64],
        [22, 99],
        [74, 99],
        [74, 178],
        [0, 178],
        [0, 156],
        [52, 156],
        [52, 121],
        [0, 121],
      ],
    ],
  },
  E: {
    width: 72,
    loops: [
      [
        [0, 42],
        [72, 42],
        [72, 64],
        [22, 64],
        [22, 99],
        [62, 99],
        [62, 121],
        [22, 121],
        [22, 156],
        [72, 156],
        [72, 178],
        [0, 178],
      ],
    ],
  },
  H: {
    width: 78,
    loops: [
      [
        [0, 42],
        [22, 42],
        [22, 99],
        [56, 99],
        [56, 42],
        [78, 42],
        [78, 178],
        [56, 178],
        [56, 121],
        [22, 121],
        [22, 178],
        [0, 178],
      ],
    ],
  },
  ".": {
    width: 26,
    loops: [
      [
        [0, 152],
        [26, 152],
        [26, 178],
        [0, 178],
      ],
    ],
  },
}

function build3DHeadlineGeometry(
  text: string,
  dxNormal = 18,
  dyNormal = -18,
  dxPressed = 6,
  dyPressed = -6
) {
  let cursorX = 0
  const letterGap = 16
  const spaceWidth = 42

  const frontPaths: string[] = []
  let wallsNormal = ""
  let wallsPressed = ""
  let strokeNormal = ""
  let strokePressed = ""

  for (const ch of text) {
    if (ch === " ") {
      cursorX += spaceWidth
      continue
    }
    const glyph = GLYPHS[ch]
    if (!glyph) continue

    let glyphFront = ""

    glyph.loops.forEach((loop, loopIdx) => {
      const pts: Pt[] = loop.map(([x, y]) => [cursorX + x, y])
      const n = pts.length

      // 1. Front face polygon path
      glyphFront +=
        pts
          .map(
            (p, i) =>
              `${i === 0 ? "M" : "L"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`
          )
          .join("") + "Z "

      // 2. Extruded side walls & wireframe strokes
      for (let i = 0; i < n; i++) {
        const [x1, y1] = pts[i]
        const [x2, y2] = pts[(i + 1) % n]

        // Front edge stroke (identical in normal & pressed)
        const frontEdge = `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`
        strokeNormal += frontEdge
        strokePressed += frontEdge

        // Outward normal check along extrusion vector (1, -1)
        const ex = x2 - x1
        const ey = y2 - y1
        // For outer loop (CW in SVG Y-down), outward normal is (ey, -ex).
        // For inner cutout loop, solid wall faces inward so normal is (-ey, ex).
        const nx = loopIdx === 0 ? ey : -ey
        const ny = loopIdx === 0 ? -ex : ex
        const isExtrudedFaceVisible = nx * 1 + ny * -1 > 0

        if (isExtrudedFaceVisible) {
          // Normal state extruded quad & edges
          const bx1N = x1 + dxNormal
          const by1N = y1 + dyNormal
          const bx2N = x2 + dxNormal
          const by2N = y2 + dyNormal

          wallsNormal += `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}L${bx2N.toFixed(1)} ${by2N.toFixed(1)}L${bx1N.toFixed(1)} ${by1N.toFixed(1)}Z`
          strokeNormal += `M${x1.toFixed(1)} ${y1.toFixed(1)}L${bx1N.toFixed(1)} ${by1N.toFixed(1)}M${x2.toFixed(1)} ${y2.toFixed(1)}L${bx2N.toFixed(1)} ${by2N.toFixed(1)}M${bx1N.toFixed(1)} ${by1N.toFixed(1)}L${bx2N.toFixed(1)} ${by2N.toFixed(1)}`

          // Pressed state extruded quad & edges
          const bx1P = x1 + dxPressed
          const by1P = y1 + dyPressed
          const bx2P = x2 + dxPressed
          const by2P = y2 + dyPressed

          wallsPressed += `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}L${bx2P.toFixed(1)} ${by2P.toFixed(1)}L${bx1P.toFixed(1)} ${by1P.toFixed(1)}Z`
          strokePressed += `M${x1.toFixed(1)} ${y1.toFixed(1)}L${bx1P.toFixed(1)} ${by1P.toFixed(1)}M${x2.toFixed(1)} ${y2.toFixed(1)}L${bx2P.toFixed(1)} ${by2P.toFixed(1)}M${bx1P.toFixed(1)} ${by1P.toFixed(1)}L${bx2P.toFixed(1)} ${by2P.toFixed(1)}`
        }
      }
    })

    frontPaths.push(glyphFront.trim())
    cursorX += glyph.width + letterGap
  }

  const totalFrontWidth = cursorX - letterGap
  const totalCadWidth = totalFrontWidth + dxNormal

  return {
    frontPaths,
    wallsNormal,
    wallsPressed,
    strokeNormal,
    strokePressed,
    totalCadWidth,
    totalCadHeight: 178 - (42 + dyNormal), // 154
    topY: 42 + dyNormal, // 24
    bottomY: 178,
  }
}

const HEADLINE_GEOMETRY = build3DHeadlineGeometry("BUILD. COMPOSE. SHIP.")

export interface BuildComposeShip3DHeadlineProps {
  className?: string
  subtitle?: string
  enableSound?: boolean
  showDimensions?: boolean
  onTap?: () => void
}

/**
 * "Build. Compose. Ship." 3D Isometric Headline with Technical CAD Dimension Lines
 * - Solid 3D extruded geometry & wireframes with cursor-following radial flashlight
 * - Interactive spring press displacement & tactile audio
 * - Blueprint / CAD dimension measuring lines with arrows and precise measurements
 * - Technical sub-headline specification bar below
 */
export function BuildComposeShip3DHeadline({
  className,
  subtitle = "A collection of reusable UI primitives for modern React applications.",
  enableSound = true,
  showDimensions = true,
  onTap,
}: BuildComposeShip3DHeadlineProps) {
  const id = useId()
  const ids = {
    facePattern: `bcs-3d-pat-${id}`,
    frontFill: `bcs-3d-front-${id}`,
    stroke: `bcs-3d-stroke-${id}`,
    radialGradient: `bcs-3d-grad-${id}`,
  }

  const {
    frontPaths,
    wallsNormal,
    wallsPressed,
    strokeNormal,
    strokePressed,
    totalCadWidth,
    totalCadHeight,
    topY,
    bottomY,
  } = HEADLINE_GEOMETRY

  // Expanded viewBox to accommodate dimension lines and right-side vertical callout
  const viewBox = `-45 -40 ${totalCadWidth + 115} 255`
  const ref = useRef<SVGSVGElement>(null)

  const shouldReduceMotion = useReducedMotion()
  const isInView = useInView(ref, { margin: "80px" })

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const cx = useSpring(useTransform(mouseX, [0, 1], [0, totalCadWidth]), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  })

  const cy = useSpring(useTransform(mouseY, [0, 1], [0, 200]), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  })

  useEffect(() => {
    if (shouldReduceMotion || !isInView) return
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches
    )
      return

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      mouseX.set((e.clientX - rect.left) / rect.width)
      mouseY.set((e.clientY - rect.top) / rect.height)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [shouldReduceMotion, isInView, mouseX, mouseY])

  const midX = totalCadWidth / 2
  const rightDimX = totalCadWidth + 36

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center py-4",
        className
      )}
    >
      <motion.svg
        ref={ref}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        className="block h-auto w-full max-w-6xl cursor-pointer touch-manipulation overflow-visible select-none [--pattern:color-mix(in_oklab,var(--foreground)_28%,transparent)] [--stroke:color-mix(in_oklab,var(--foreground)_82%,transparent)]"
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Build. Compose. Ship. 3D Isometric Typography with CAD Dimension Lines"
        initial="normal"
        whileTap="pressed"
        onTap={() => {
          if (enableSound) playTapSound()
          onTap?.()
        }}
      >
        <defs>
          {/* Diagonal Hatching Pattern for Front Face */}
          <pattern
            id={ids.facePattern}
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2"
              stroke="var(--pattern)"
              strokeWidth="1.2"
            />
          </pattern>

          {/* Front Faces (Letter Geometry) with interactive press displacement */}
          <motion.g
            id={ids.frontFill}
            variants={{
              normal: { transform: "translate(0px, 0px)" },
              pressed: { transform: "translate(6px, -6px)" },
            }}
            transition={transition}
          >
            {frontPaths.map((d, index) => (
              <path key={index} d={d} fillRule="evenodd" clipRule="evenodd" />
            ))}
          </motion.g>

          {/* Stroke outlines with normal and pressed wireframe edges */}
          <motion.path
            id={ids.stroke}
            variants={{
              normal: { d: strokeNormal },
              pressed: { d: strokePressed },
            }}
            transition={transition}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Cursor-following Radial Gradient Flashlight */}
          <motion.radialGradient
            id={ids.radialGradient}
            cx={cx}
            cy={cy}
            r="420"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              className="[stop-color:var(--primary,#ef4444)] dark:[stop-color:#ffffff]"
              stopColor="var(--primary, #ef4444)"
              stopOpacity="1"
            />
            <stop
              className="[stop-color:var(--primary,#ef4444)] dark:[stop-color:var(--foreground)]"
              offset="0.45"
              stopColor="var(--foreground)"
              stopOpacity="0.6"
            />
            <stop offset="1" stopColor="var(--foreground)" stopOpacity="0" />
          </motion.radialGradient>
        </defs>

        {/* Solid 3D Side & Top Walls */}
        <g className="fill-background">
          <motion.path
            variants={{
              normal: { d: wallsNormal },
              pressed: { d: wallsPressed },
            }}
            transition={transition}
          />
        </g>

        {/* Front Faces: Solid background + Diagonal hatched pattern overlay */}
        <use href={`#${ids.frontFill}`} className="fill-background" />
        <use href={`#${ids.frontFill}`} fill={`url(#${ids.facePattern})`} />

        {/* Wireframe Strokes: Base Subtle Stroke + Cursor Radial Flashlight */}
        <use href={`#${ids.stroke}`} stroke="var(--stroke)" />
        <use href={`#${ids.stroke}`} stroke={`url(#${ids.radialGradient})`} />

        {/* ── Technical CAD Dimension Measuring Lines ── */}
        {showDimensions && (
          <g
            className="text-foreground dark:text-white"
            strokeWidth="1.4"
            stroke="currentColor"
          >
            {/* 1. TOP HORIZONTAL DIMENSION LINE */}
            <g>
              {/* Left Extension Line */}
              <line x1="0" y1="-30" x2="0" y2="35" strokeOpacity="0.85" />
              {/* Right Extension Line */}
              <line
                x1={totalCadWidth}
                y1="-30"
                x2={totalCadWidth}
                y2="35"
                strokeOpacity="0.85"
              />

              {/* Horizontal Dimension Arrow Line Left Segment */}
              <line
                x1="0"
                y1="-18"
                x2={midX - 56}
                y2="-18"
                strokeOpacity="0.9"
              />
              {/* Left Arrow Head */}
              <path
                d="M14 -23 L0 -18 L14 -13"
                fill="none"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Horizontal Dimension Arrow Line Right Segment */}
              <line
                x1={midX + 56}
                y1="-18"
                x2={totalCadWidth}
                y2="-18"
                strokeOpacity="0.9"
              />
              {/* Right Arrow Head */}
              <path
                d={`M${totalCadWidth - 14} -23 L${totalCadWidth} -18 L${totalCadWidth - 14} -13`}
                fill="none"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dimension Number Badge (Total CAD Width) */}
              <g>
                <rect
                  x={midX - 50}
                  y="-29"
                  width="100"
                  height="22"
                  rx="3"
                  className="fill-background stroke-foreground/50 dark:stroke-white/50"
                  strokeWidth="1.2"
                />
                <text
                  x={midX}
                  y="-15"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground font-mono text-[13px] font-bold tracking-widest select-none dark:fill-white"
                  stroke="none"
                >
                  {totalCadWidth}
                </text>
              </g>
            </g>

            {/* 2. RIGHT VERTICAL DIMENSION LINE */}
            <g>
              {/* Top Extension Line */}
              <line
                x1={totalCadWidth - 10}
                y1={topY}
                x2={rightDimX + 16}
                y2={topY}
                strokeOpacity="0.85"
              />
              {/* Bottom Extension Line */}
              <line
                x1={totalCadWidth - 10}
                y1={bottomY}
                x2={rightDimX + 16}
                y2={bottomY}
                strokeOpacity="0.85"
              />

              {/* Vertical Dimension Line Top Segment */}
              <line
                x1={rightDimX}
                y1={topY}
                x2={rightDimX}
                y2="82"
                strokeOpacity="0.9"
              />
              {/* Top Arrow Head */}
              <path
                d={`M${rightDimX - 5} ${topY + 12} L${rightDimX} ${topY} L${rightDimX + 5} ${topY + 12}`}
                fill="none"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Vertical Dimension Line Bottom Segment */}
              <line
                x1={rightDimX}
                y1="118"
                x2={rightDimX}
                y2={bottomY}
                strokeOpacity="0.9"
              />
              {/* Bottom Arrow Head */}
              <path
                d={`M${rightDimX - 5} ${bottomY - 12} L${rightDimX} ${bottomY} L${rightDimX + 5} ${bottomY - 12}`}
                fill="none"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Height Number Badge */}
              <g>
                <rect
                  x={rightDimX - 24}
                  y="88"
                  width="48"
                  height="22"
                  rx="3"
                  className="fill-background stroke-foreground/50 dark:stroke-white/50"
                  strokeWidth="1.2"
                />
                <text
                  x={rightDimX}
                  y="102"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground font-mono text-[13px] font-bold tracking-wider select-none dark:fill-white"
                  stroke="none"
                >
                  {totalCadHeight}
                </text>
              </g>
            </g>

            {/* 3. Corner Crop Marks & CAD Crosshairs */}
            <g opacity="0.75" strokeWidth="1.3">
              <line x1="-16" y1={topY} x2="-2" y2={topY} />
              <line x1="-16" y1={bottomY} x2="-2" y2={bottomY} />
              <line x1="0" y1="188" x2="0" y2="202" />
              <line x1={totalCadWidth} y1="188" x2={totalCadWidth} y2="202" />
            </g>
          </g>
        )}
      </motion.svg>

      {/* ── Sub-headline Technical Spec Caption ── */}
      {subtitle && (
        <div className="mt-2 flex w-full max-w-6xl items-center justify-center gap-3 px-4">
          <span
            aria-hidden="true"
            className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-border to-foreground/25 sm:block"
          />
          <p className="text-center font-mono text-xs tracking-wide text-muted-foreground sm:text-sm dark:text-white/90">
            {subtitle}
          </p>
          <span
            aria-hidden="true"
            className="hidden h-px flex-1 bg-gradient-to-l from-transparent via-border to-foreground/25 sm:block"
          />
        </div>
      )}
    </div>
  )
}
