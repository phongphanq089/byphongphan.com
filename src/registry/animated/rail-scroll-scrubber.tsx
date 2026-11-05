import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { MotionValue } from "motion/react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"

import { cn } from "@/shared/lib/utils"

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface RailSection {
  id: string
  title: string
  label?: string
  start: number
  end?: number
  anchor: number
  flightRange: [number, number]
  subtitle?: string
  description?: string
  accent?: string
  meta?: string
  timestamp?: string
}

export function formatSectionTitle(title: string): string {
  if (!title) return ""
  if (/[a-z]/.test(title)) return title
  return title
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export interface SpringConfig {
  stiffness?: number
  damping?: number
  mass?: number
}

export interface RailScrollScrubberProps {
  /** Custom list of sections. Defaults to 5 standard sections */
  sections?: RailSection[]
  /** Custom MotionValue for scroll progress (0..1). If omitted, connects to window scroll or scrollContainerRef */
  scrollProgressMV?: MotionValue<number>
  /** Optional container ref for scrolling (useful for overflow-y scroll containers like in artcraft-scroll-01) */
  scrollContainerRef?: React.RefObject<HTMLElement | null>
  /** Callback when user clicks or drags the ruler to scrub to a target progress (0..1) */
  onScrubToProgress?: (progress: number, options?: { smooth?: boolean }) => void
  /** Spring configuration for smooth scrolling interpolation */
  springConfig?: SpringConfig
  /** Zoom scale expansion factor when not hovering in overview (default: 3.6) */
  zoomScale?: number
  /** S-Curve intensity factor (default: 1.0) */
  curveIntensity?: number
  /** Accent laser color (default: var(--primary)) */
  accentColor?: string
  /** Whether to hide native browser scrollbars on html and body (default: true) */
  hideNativeScrollbar?: boolean
  /** Whether to reserve responsive layout space (padding-right) on small screens to prevent content overlap (default: true when connected to window scroll) */
  reserveLayoutSpace?: boolean
  /** Whether to enable the Section Jump Menu on desktop when clicking the ruler rail (default: false) */
  showDesktopSectionMenu?: boolean
  /** Alias for showDesktopSectionMenu */
  enableDesktopMenu?: boolean
  /** Presentation variant for section menu: "list" (classic list) or "card" (rich card with dot rail & preview) */
  sectionMenuVariant?: "list" | "card"
  /** Alias for sectionMenuVariant */
  menuVariant?: "list" | "card"
  /** Shorthand to activate the card-style section menu */
  cardMenu?: boolean
  /** Initial scroll progress on mount (0..1, e.g. 0.47) */
  initialProgress?: number
  /** Enable automatic continuous scrolling cruise mode */
  autoScroll?: boolean
  /** Speed of auto-scroll cruise mode in pixels per frame (default: 2.2) */
  autoScrollSpeed?: number
  /** Callback when scroll progress changes */
  onProgressChange?: (progress: number, percentage: number) => void
  /** Callback when active section changes */
  onSectionChange?: (section: RailSection, index: number) => void
  /** Whether to show the floating percentage readout pill (default: true) */
  showPercentageReadout?: boolean
  /** Additional CSS class names */
  className?: string
}

export interface RailScrollScrubberSpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional custom width */
  width?: string
}

/**
 * Utility spacer component that reserves the exact responsive horizontal layout
 * gutter matching the RailScrollScrubber (22px on mobile, 56px on tablet, 0px on desktop xl).
 */
export function RailScrollScrubberSpacer({
  className,
  style,
  ...props
}: RailScrollScrubberSpacerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none shrink-0",
        "w-0 sm:w-[var(--rail-scrubber-width,56px)] xl:w-0",
        className
      )}
      style={style}
      {...props}
    />
  )
}

// ============================================================================
// DEFAULT SECTIONS CONFIGURATION (Matches Artcraft 5-stage reference)
// ============================================================================

export const DEFAULT_RAIL_SECTIONS: RailSection[] = [
  {
    id: "artcraft",
    title: "ARTCRAFT",
    start: 0.0,
    end: 0.2,
    anchor: 0.04,
    flightRange: [-0.15, -0.02],
    subtitle: "NEXT-GEN CREATIVE ENGINE",
    description:
      "High-precision procedural graphics & node-based creative engine.",
    accent: "var(--primary)",
    meta: "Stage 01",
    timestamp: "10:00 AM",
  },
  {
    id: "features",
    title: "FEATURES",
    start: 0.2,
    end: 0.48,
    anchor: 0.17,
    flightRange: [0.08, 0.28],
    subtitle: "NON-DESTRUCTIVE NODE GRAPH",
    description:
      "Real-time compositing, shader graphs, and non-destructive pipeline.",
    accent: "var(--primary)",
    meta: "Stage 02",
    timestamp: "10:15 AM",
  },
  {
    id: "ownership",
    title: "OWNERSHIP",
    start: 0.48,
    end: 0.7,
    anchor: 0.6,
    flightRange: [0.58, 0.7],
    subtitle: "LOCAL-FIRST & VERIFIABLE ASSETS",
    description:
      "Cryptographically verifiable ownership with zero vendor lock-in.",
    accent: "var(--primary)",
    meta: "Stage 03",
    timestamp: "10:22 AM",
  },
  {
    id: "community",
    title: "COMMUNITY",
    start: 0.7,
    end: 0.86,
    anchor: 0.73,
    flightRange: [0.655, 0.79],
    subtitle: "OPEN ECOSYSTEM & SHADER REGISTRY",
    description:
      "Collaborative developer network, open marketplace, and plugin ecosystem.",
    accent: "var(--primary)",
    meta: "Stage 04",
    timestamp: "10:45 AM",
  },
  {
    id: "get-started",
    title: "GET STARTED",
    start: 0.86,
    end: 1.0,
    anchor: 0.81,
    flightRange: [0.78, 0.93],
    subtitle: "DEPLOY IN SECONDS",
    description:
      "Instant drop-in integration, accessible semantic primitives, and full TypeScript typings.",
    accent: "var(--primary)",
    meta: "Stage 05",
    timestamp: "11:00 AM",
  },
]

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max)

// ============================================================================
// 5-STAGE CONTINUOUS RAIL PATH SOLVER
// Stage 1: Bottom Horizontal Stack (0 deg)
// Stage 2: Bottom-Right Quarter Circle Peeling Up (0 deg -> -90 deg)
// Stage 3: Vertical Ruler Spine Alignment (-90 deg, flush with ticks)
// Stage 4: Top-Right Quarter Circle Peeling Left (-90 deg -> 0 deg)
// Stage 5: Top Horizontal Active Stack (0 deg, scaled up)
// ============================================================================

interface TrackGeometry {
  charRestX: number
  charTopX: number
  bottomY: number
  topY: number
  spineX: number
  bottomRadius: number
  topRadius: number
  L1: number
  L2: number
  L3: number
  L4: number
  totalLength: number
}

function sampleRailTrack(charS: number, geom: TrackGeometry) {
  const {
    charRestX,
    charTopX,
    bottomY,
    topY,
    spineX,
    bottomRadius,
    topRadius,
    L1,
    L2,
    L3,
    L4,
    totalLength,
  } = geom

  // Before track starts: sits in bottom horizontal waiting stack
  if (charS <= 0) {
    return {
      x: charRestX,
      y: bottomY,
      rotate: 0,
      topArrivalRatio: 0,
      onSpineRatio: 0,
    }
  }

  // After track ends: sits in top horizontal active stack
  if (charS >= totalLength) {
    return {
      x: charTopX,
      y: topY,
      rotate: 0,
      topArrivalRatio: 1,
      onSpineRatio: 0,
    }
  }

  // Stage 1: Moving horizontally right along bottom stack
  if (charS <= L1) {
    return {
      x: charRestX + charS,
      y: bottomY,
      rotate: 0,
      topArrivalRatio: 0,
      onSpineRatio: 0,
    }
  }

  // Stage 2: Bottom-Right Quarter-Circle Curve (0 deg -> -90 deg onto vertical spine)
  const s2 = charS - L1
  if (s2 <= L2) {
    const u = s2 / L2
    const theta = u * (Math.PI / 2)
    const cx = spineX - bottomRadius
    const cy = bottomY - bottomRadius
    return {
      x: cx + bottomRadius * Math.sin(theta),
      y: cy + bottomRadius * Math.cos(theta),
      rotate: -u * 90,
      topArrivalRatio: 0,
      onSpineRatio: u,
    }
  }

  // Stage 3: Straight Vertical Spine along Ruler Ticks (-90 deg)
  const s3 = s2 - L2
  if (s3 <= L3) {
    const bottomCurveExitY = bottomY - bottomRadius
    return {
      x: spineX,
      y: bottomCurveExitY - s3,
      rotate: -90,
      topArrivalRatio: 0,
      onSpineRatio: 1,
    }
  }

  // Stage 4: Top-Right Quarter-Circle Curve (-90 deg -> 0 deg peeling left)
  const s4 = s3 - L3
  if (s4 <= L4) {
    const u = s4 / L4
    const theta = u * (Math.PI / 2)
    const cx = spineX - topRadius
    const cy = topY + topRadius
    return {
      x: cx + topRadius * Math.cos(theta),
      y: cy - topRadius * Math.sin(theta),
      rotate: -90 * (1 - u),
      topArrivalRatio: u,
      onSpineRatio: 1 - u,
    }
  }

  // Stage 5: Top Horizontal Run into final right-aligned slot
  const s5 = s4 - L4
  const topCurveExitX = spineX - topRadius
  return {
    x: topCurveExitX - s5,
    y: topY,
    rotate: 0,
    topArrivalRatio: 1,
    onSpineRatio: 0,
  }
}

// ============================================================================
// FLYING CHARACTER COMPONENT (MEMOIZED & FRAME-CACHED FOR 80% LESS MATH)
// ============================================================================

interface FlyingCharacterProps {
  char: string
  charIndex: number
  totalChars: number
  sectionIndex: number
  totalSections: number
  section: RailSection
  smoothScroll: MotionValue<number>
  smoothHover: MotionValue<number>
  viewportHeight: number
  curveIntensity: number
  isCurrentActive: boolean
}

interface CharStateResult {
  x: number
  y: number
  rotate: number
  scale: number
  color: string
}

const FlyingCharacter = React.memo(function FlyingCharacter({
  char,
  charIndex,
  totalChars,
  sectionIndex,
  totalSections,
  section,
  smoothScroll,
  smoothHover,
  viewportHeight,
  curveIntensity,
  isCurrentActive,
}: FlyingCharacterProps) {
  const reverseIdx = totalChars - 1 - charIndex
  const [rangeStart, rangeEnd] = section.flightRange

  // Intra-frame cache: prevents recomputing trigonometry 5 times across the 5 transforms per frame
  const frameCache = useRef<{
    s: number
    h: number
    res: CharStateResult
  } | null>(null)

  const computeCharState = useCallback(
    (s: number, h: number): CharStateResult => {
      if (
        frameCache.current &&
        frameCache.current.s === s &&
        frameCache.current.h === h
      ) {
        return frameCache.current.res
      }

      const baseSpacing = 11.5
      const topActiveSpacing = isCurrentActive ? 17.5 : 11.8

      const spacing = Math.min(
        24,
        Math.max(16, Math.floor(170 / totalSections))
      )
      const bottomSpacing = Math.min(
        22,
        Math.max(14, Math.floor(155 / totalSections))
      )

      const topStackY =
        sectionIndex === 0
          ? 18
          : isCurrentActive
            ? 18 + sectionIndex * spacing + 4
            : 18 + sectionIndex * spacing

      const reverseSecIdx = totalSections - 1 - sectionIndex
      const bottomStackY = viewportHeight - 28 - reverseSecIdx * bottomSpacing
      const overviewY = 20 + section.anchor * (viewportHeight - 40)

      const charBottomRestX = -reverseIdx * baseSpacing
      const charTopFinalX = -reverseIdx * topActiveSpacing
      const charOverviewX = -reverseIdx * 11.2

      if (sectionIndex === 0) {
        const res: CharStateResult = {
          x: charTopFinalX * (1 - h) + charOverviewX * h,
          y: topStackY * (1 - h) + overviewY * h,
          rotate: 0,
          scale: (isCurrentActive ? 1.55 : 1.0) * (1 - h) + 1.05 * h,
          color:
            h > 0.5
              ? "var(--foreground)"
              : isCurrentActive
                ? "var(--primary)"
                : "var(--muted-foreground)",
        }
        frameCache.current = { s, h, res }
        return res
      }

      const spineX = 26
      const bottomRadius = clamp(68 * curveIntensity, 28, 120)
      const topRadius = clamp(92 * curveIntensity, 36, 150)

      const bottomCurveEntryX = spineX - bottomRadius
      const topCurveExitX = spineX - topRadius

      const leadBottomRestX = 0
      const L1_lead = Math.max(0, bottomCurveEntryX - leadBottomRestX)
      const L2 = (Math.PI / 2) * bottomRadius
      const L3 = Math.max(
        90,
        bottomStackY - bottomRadius - (topStackY + topRadius)
      )
      const L4 = (Math.PI / 2) * topRadius

      const charTrainOffset = reverseIdx * baseSpacing
      const L5_char = Math.max(0, topCurveExitX - charTopFinalX)
      const charTotalLength = L1_lead + L2 + L3 + L4 + L5_char

      const maxTrainTravel =
        L1_lead +
        L2 +
        L3 +
        L4 +
        Math.max(0, topCurveExitX - -(totalChars - 1) * topActiveSpacing) +
        (totalChars - 1) * baseSpacing

      const rawP = clamp((s - rangeStart) / (rangeEnd - rangeStart), 0, 1)
      const frontDist = rawP * maxTrainTravel
      const charS = frontDist - charTrainOffset

      const sampled = sampleRailTrack(charS, {
        charRestX: charBottomRestX,
        charTopX: charTopFinalX,
        bottomY: bottomStackY,
        topY: topStackY,
        spineX,
        bottomRadius,
        topRadius,
        L1: L1_lead,
        L2,
        L3,
        L4,
        totalLength: charTotalLength,
      })

      const targetTopScale = isCurrentActive ? 1.68 : 1.0
      const normalScale =
        1.04 + sampled.topArrivalRatio * (targetTopScale - 1.04)

      let normalColor = "var(--muted-foreground)"
      if (rawP >= 0.99) {
        normalColor = isCurrentActive
          ? "var(--primary)"
          : "var(--muted-foreground)"
      } else if (sampled.topArrivalRatio > 0.15) {
        normalColor = "var(--primary)"
      } else if (sampled.onSpineRatio > 0.2) {
        normalColor = "var(--foreground)"
      }

      const res: CharStateResult = {
        x: sampled.x * (1 - h) + charOverviewX * h,
        y: sampled.y * (1 - h) + overviewY * h,
        rotate: sampled.rotate * (1 - h),
        scale: normalScale * (1 - h) + 1.08 * h,
        color: h > 0.5 ? "var(--foreground)" : normalColor,
      }

      frameCache.current = { s, h, res }
      return res
    },
    [
      reverseIdx,
      sectionIndex,
      totalSections,
      section.anchor,
      rangeStart,
      rangeEnd,
      viewportHeight,
      curveIntensity,
      isCurrentActive,
      totalChars,
    ]
  )

  const x = useTransform(
    [smoothScroll, smoothHover],
    ([s, h]) => computeCharState(s as number, h as number).x
  )
  const y = useTransform(
    [smoothScroll, smoothHover],
    ([s, h]) => computeCharState(s as number, h as number).y
  )
  const rotate = useTransform(
    [smoothScroll, smoothHover],
    ([s, h]) => computeCharState(s as number, h as number).rotate
  )
  const scale = useTransform(
    [smoothScroll, smoothHover],
    ([s, h]) => computeCharState(s as number, h as number).scale
  )
  const color = useTransform(
    [smoothScroll, smoothHover],
    ([s, h]) => computeCharState(s as number, h as number).color
  )

  return (
    <motion.span
      style={{
        x,
        y,
        rotate,
        scale,
        color,
        position: "absolute",
        right: "74px",
        top: 0,
        transformOrigin: "center center",
      }}
      className="pointer-events-none inline-block font-mono text-[13px] leading-none font-extrabold tracking-wider will-change-transform select-none"
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  )
})

// ============================================================================
// SINGLE RULER TICK (MEMOIZED WITH FAST CULLING)
// ============================================================================

interface RulerTickProps {
  tickValue: number
  smoothScroll: MotionValue<number>
  smoothHover: MotionValue<number>
  blueIndicatorY: MotionValue<number>
  viewportHeight: number
  zoomScale: number
}

const RulerTick = React.memo(function RulerTick({
  tickValue,
  smoothScroll,
  smoothHover,
  blueIndicatorY,
  viewportHeight,
  zoomScale,
}: RulerTickProps) {
  const isMajor = tickValue % 5 === 0
  const isDecade = tickValue % 10 === 0
  const tickProgress = tickValue / 100

  const y = useTransform(
    [smoothScroll, smoothHover, blueIndicatorY],
    ([s, h, indicatorY]) => {
      const pad = 16
      const usableHeight = viewportHeight - pad * 2
      const overviewY = pad + tickProgress * usableHeight
      const zoomedY =
        (indicatorY as number) +
        (tickProgress - (s as number)) * usableHeight * zoomScale
      return zoomedY * (1 - (h as number)) + overviewY * (h as number)
    }
  )

  // Direct transform from y: avoids redundant multi-value subscriptions
  const opacity = useTransform(y, (currY) => {
    if (currY < 4 || currY > viewportHeight - 4) return 0
    if (isDecade) return 0.9
    if (isMajor) return 0.7
    return 0.35
  })

  return (
    <motion.div
      style={{ y, opacity }}
      className="absolute top-0 right-0 flex items-center justify-end will-change-transform"
    >
      {isMajor && (
        <span
          className={cn(
            "mr-1 hidden font-mono text-[8px] leading-none font-medium text-muted-foreground select-none sm:mr-1.5 sm:inline sm:text-[10px]",
            !isDecade && "sm:hidden md:inline"
          )}
        >
          {tickValue}
        </span>
      )}
      <div
        className={cn(
          isMajor
            ? "h-[1px] w-[5px] bg-foreground/60 sm:w-[12px]"
            : "h-[1px] w-[2.5px] bg-border sm:w-[6px]"
        )}
      />
    </motion.div>
  )
})

// ============================================================================
// SECTION CLICK TARGET (MEMOIZED)
// ============================================================================

interface SectionClickTargetProps {
  section: RailSection
  secIdx: number
  totalSections: number
  smoothScroll: MotionValue<number>
  smoothHover: MotionValue<number>
  viewportHeight: number
  onSelect: () => void
}

const SectionClickTarget = React.memo(function SectionClickTarget({
  section,
  secIdx,
  totalSections,
  smoothScroll,
  smoothHover,
  viewportHeight,
  onSelect,
}: SectionClickTargetProps) {
  const y = useTransform([smoothScroll, smoothHover], ([s, h]) => {
    const spacing = Math.min(24, Math.max(16, Math.floor(170 / totalSections)))
    const bottomSpacing = Math.min(
      22,
      Math.max(14, Math.floor(155 / totalSections))
    )
    const topStackY = 18 + secIdx * spacing
    const reverseSecIdx = totalSections - 1 - secIdx
    const bottomStackY = viewportHeight - 28 - reverseSecIdx * bottomSpacing
    const overviewY = 20 + section.anchor * (viewportHeight - 40)

    const midFlight = (section.flightRange[0] + section.flightRange[1]) / 2
    const normalY =
      (s as number) >= midFlight || secIdx === 0 ? topStackY : bottomStackY
    return normalY * (1 - (h as number)) + overviewY * (h as number) - 8
  })

  return (
    <motion.button
      type="button"
      onPointerDown={(e) => {
        e.stopPropagation()
      }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onSelect()
      }}
      style={{ y, position: "absolute", right: "70px", top: 0 }}
      className="z-40 h-[22px] w-[140px] cursor-pointer opacity-0 transition-opacity hover:opacity-100"
      title={`Jump to ${section.title}`}
    />
  )
})

// ============================================================================
// ISOLATED PERCENTAGE READOUT (PREVENTS PARENT RE-RENDERS ON SCROLL)
// ============================================================================

const PercentReadout = React.memo(function PercentReadout({
  smoothScroll,
  accentColor,
  isDragging,
  onToggleMenu,
}: {
  smoothScroll: MotionValue<number>
  accentColor: string
  isDragging?: boolean
  onToggleMenu?: () => void
}) {
  const [percent, setPercent] = useState(0)

  useMotionValueEvent(smoothScroll, "change", (v) => {
    const next = clamp(Math.round(v * 100), 0, 100)
    setPercent((prev) => (prev !== next ? next : prev))
  })

  return (
    <>
      {/* Mobile: Floating bubble pill to the LEFT of user's thumb when actively scrubbing */}
      {isDragging && (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onToggleMenu?.()
          }}
          className="pointer-events-auto absolute -top-3.5 right-6 z-40 flex cursor-pointer items-center rounded-md border border-border bg-card/95 px-2 py-0.5 font-mono text-[10px] font-bold text-primary shadow-lg backdrop-blur-md sm:hidden"
          style={{ color: accentColor }}
        >
          {String(percent).padStart(3, "0")}%
        </button>
      )}

      {/* Desktop & Tablet: Telemetry readout below the indicator line */}
      <div
        className="mt-1 hidden pr-1 text-right font-mono text-[8.5px] font-semibold tracking-wider select-none sm:block sm:pr-1.5 sm:text-[10px]"
        style={{
          color: accentColor,
          textShadow: `0 0 6px ${accentColor}`,
        }}
      >
        {String(percent).padStart(3, "0")}%
      </div>
    </>
  )
})

// ============================================================================
// ISOLATED HOVER CURSOR LINE (PREVENTS PARENT RE-RENDERS ON POINTER MOVE)
// ============================================================================

const HoverCursorLine = React.memo(function HoverCursorLine({
  mouseYMV,
  hoverPercentMV,
  isHovered,
}: {
  mouseYMV: MotionValue<number>
  hoverPercentMV: MotionValue<number | null>
  isHovered: boolean
}) {
  const [hoverPercent, setHoverPercent] = useState<number | null>(null)

  useMotionValueEvent(hoverPercentMV, "change", (val) => {
    setHoverPercent((prev) => (prev !== val ? val : prev))
  })

  return (
    <motion.div
      style={{
        y: mouseYMV,
        opacity: isHovered ? 1 : 0,
      }}
      className="pointer-events-none absolute top-0 right-0 z-20 h-[2px] w-[18px] bg-primary shadow-[0_0_8px_var(--primary)] sm:w-[56px]"
    >
      {hoverPercent !== null && (
        <span className="absolute -top-[7px] right-5 rounded border border-border bg-card/95 px-1.5 py-0.5 font-mono text-[9px] text-foreground shadow-xs select-none sm:right-[60px] sm:text-[10px]">
          {String(hoverPercent).padStart(3, "0")}%
        </span>
      )}
    </motion.div>
  )
})

// ============================================================================
// MAIN EXPORTED COMPONENT: RailScrollScrubber
// ============================================================================

export function RailScrollScrubber({
  sections = DEFAULT_RAIL_SECTIONS,
  scrollProgressMV,
  scrollContainerRef,
  onScrubToProgress,
  springConfig = { stiffness: 140, damping: 26, mass: 0.45 },
  zoomScale = 3.6,
  curveIntensity = 1.0,
  accentColor = "var(--primary)",
  hideNativeScrollbar = true,
  reserveLayoutSpace,
  showDesktopSectionMenu = false,
  enableDesktopMenu = false,
  sectionMenuVariant = "list",
  menuVariant,
  cardMenu = false,
  initialProgress,
  autoScroll = false,
  autoScrollSpeed = 2.2,
  onProgressChange,
  onSectionChange,
  showPercentageReadout = true,
  className,
}: RailScrollScrubberProps) {
  const isCardMenu =
    sectionMenuVariant === "card" || menuVariant === "card" || Boolean(cardMenu)
  const allowDesktopMenu =
    showDesktopSectionMenu || enableDesktopMenu || isCardMenu
  const rulerRef = useRef<HTMLDivElement>(null)
  const menuCardRef = useRef<HTMLDivElement>(null)
  const dotRailRef = useRef<HTMLDivElement>(null)
  const lastTapTimeRef = useRef(0)
  const [viewportHeight, setViewportHeight] = useState(() => {
    if (typeof window !== "undefined") return window.innerHeight
    return 800
  })
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false)
  const [activeSectionIdx, setActiveSectionIdx] = useState(0)
  const [previewIdx, setPreviewIdx] = useState(0)

  // Graceful hover timers for card popover
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const scheduleClose = useCallback(
    (delay = 280) => {
      cancelCloseTimer()
      closeTimerRef.current = setTimeout(() => {
        setIsSectionMenuOpen(false)
      }, delay)
    },
    [cancelCloseTimer]
  )

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  const safePreviewIdx = Math.min(
    Math.max(previewIdx, 0),
    Math.max(sections.length - 1, 0)
  )
  const previewSec = sections[safePreviewIdx] ?? sections[0]

  // Close menu when clicking outside (without any visible blurred backdrop layer)
  useEffect(() => {
    if (!isSectionMenuOpen) return

    const handlePointerDownOutside = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      // If clicking inside menu card, on dot rail, or on ruler rail, do not close
      if (
        menuCardRef.current?.contains(target) ||
        rulerRef.current?.contains(target) ||
        dotRailRef.current?.contains(target)
      ) {
        return
      }
      cancelCloseTimer()
      setIsSectionMenuOpen(false)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelCloseTimer()
        setIsSectionMenuOpen(false)
      }
    }

    window.addEventListener("pointerdown", handlePointerDownOutside)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("pointerdown", handlePointerDownOutside)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isSectionMenuOpen, cancelCloseTimer])

  // Automatically reserve responsive layout space (padding-right) on small screens
  // and hide native browser scrollbars on html and body when scrubber is active
  useEffect(() => {
    if (typeof document === "undefined") return

    const shouldReserve = reserveLayoutSpace ?? scrollProgressMV === undefined

    const styleId = "rail-scroll-hide-scrollbar"
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null
    if (!styleEl) {
      styleEl = document.createElement("style")
      styleEl.id = styleId
      styleEl.textContent = `
        :root {
          --rail-scrubber-width: 0px;
        }
        @media (max-width: 639px) {
          :root.has-rail-scrubber,
          html.has-rail-scrubber,
          body.has-rail-scrubber {
            --rail-scrubber-width: 0px;
          }
          html.has-rail-scrubber body,
          body.has-rail-scrubber {
            padding-right: 0px !important;
          }
        }
        @media (min-width: 640px) and (max-width: 1279px) {
          :root.has-rail-scrubber,
          html.has-rail-scrubber,
          body.has-rail-scrubber {
            --rail-scrubber-width: 56px;
          }
          html.has-rail-scrubber body,
          body.has-rail-scrubber {
            padding-right: var(--rail-scrubber-width) !important;
          }
        }
        @media (min-width: 1280px) {
          :root.has-rail-scrubber,
          html.has-rail-scrubber,
          body.has-rail-scrubber {
            --rail-scrubber-width: 0px;
          }
        }
        ${
          hideNativeScrollbar
            ? `
        html, body {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        html::-webkit-scrollbar,
        body::-webkit-scrollbar,
        ::-webkit-scrollbar {
          width: 0px !important;
          height: 0px !important;
          display: none !important;
          background: transparent !important;
        }
        ::-webkit-scrollbar-thumb,
        ::-webkit-scrollbar-track {
          display: none !important;
          background: transparent !important;
        }
        `
            : ""
        }
      `
      document.head.appendChild(styleEl)
    }

    const htmlEl = document.documentElement
    const bodyEl = document.body

    const prevHtmlNoScroll = htmlEl.classList.contains("no-scrollbar")
    const prevBodyNoScroll = bodyEl.classList.contains("no-scrollbar")
    const prevHtmlHasScrubber = htmlEl.classList.contains("has-rail-scrubber")
    const prevBodyHasScrubber = bodyEl.classList.contains("has-rail-scrubber")

    if (shouldReserve) {
      htmlEl.classList.add("has-rail-scrubber")
      bodyEl.classList.add("has-rail-scrubber")
    }

    if (hideNativeScrollbar) {
      htmlEl.classList.add("no-scrollbar")
      bodyEl.classList.add("no-scrollbar")
      htmlEl.style.scrollbarWidth = "none"
      bodyEl.style.scrollbarWidth = "none"
    }

    return () => {
      const remaining = document.querySelectorAll("[data-rail-scrubber]")
      if (remaining.length <= 1) {
        const el = document.getElementById(styleId)
        if (el) el.remove()
        if (shouldReserve) {
          if (!prevHtmlHasScrubber) htmlEl.classList.remove("has-rail-scrubber")
          if (!prevBodyHasScrubber) bodyEl.classList.remove("has-rail-scrubber")
        }
        if (hideNativeScrollbar) {
          if (!prevHtmlNoScroll) htmlEl.classList.remove("no-scrollbar")
          if (!prevBodyNoScroll) bodyEl.classList.remove("no-scrollbar")
          htmlEl.style.scrollbarWidth = ""
          bodyEl.style.scrollbarWidth = ""
        }
      }
    }
  }, [hideNativeScrollbar, reserveLayoutSpace, scrollProgressMV])

  // Respect user's motion preferences
  const prefersReduced = useReducedMotion()
  const effectiveSpringConfig = useMemo(() => {
    if (prefersReduced) {
      return { stiffness: 1000, damping: 50, mass: 0.1 }
    }
    return springConfig
  }, [prefersReduced, springConfig])

  // Fallback to window scroll (or container scroll if scrollContainerRef provided)
  const { scrollYProgress: windowScrollMV } = useScroll(
    scrollContainerRef ? { container: scrollContainerRef } : undefined
  )
  const activeScrollMV = scrollProgressMV ?? windowScrollMV

  useEffect(() => {
    const el = rulerRef.current
    if (!el) return

    const updateHeight = () => {
      const h = el.clientHeight
      if (h > 0) {
        setViewportHeight((prev) => (Math.abs(prev - h) > 1 ? h : prev))
      }
    }

    updateHeight()

    // Observe actual container element size changes
    const ro = new ResizeObserver(updateHeight)
    ro.observe(el)

    window.addEventListener("resize", updateHeight, { passive: true })
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", updateHeight)
    }
  }, [])

  const smoothScroll = useSpring(activeScrollMV, effectiveSpringConfig)

  const hoverTarget = useMotionValue(0)
  const smoothHover = useSpring(hoverTarget, {
    stiffness: 220,
    damping: 28,
    mass: 0.5,
  })

  const mouseYMV = useMotionValue(0)
  const hoverPercentMV = useMotionValue<number | null>(null)

  useEffect(() => {
    hoverTarget.set(isHovered || isDragging ? 1 : 0)
  }, [isHovered, isDragging, hoverTarget])

  // Track progress and update activeSectionIdx when crossing section boundaries
  useMotionValueEvent(smoothScroll, "change", (v) => {
    onProgressChange?.(v, Math.round(v * 100))

    let currentIdx = 0
    for (let i = sections.length - 1; i >= 0; i--) {
      const threshold = sections[i].start - 0.02
      if (v >= threshold) {
        currentIdx = i
        break
      }
    }
    setActiveSectionIdx((prev) => {
      if (prev !== currentIdx) {
        onSectionChange?.(sections[currentIdx], currentIdx)
        return currentIdx
      }
      return prev
    })
  })

  const ticks = useMemo(() => Array.from({ length: 101 }, (_, i) => i), [])

  const defaultScrub = useCallback(
    (targetProgress: number, options?: { smooth?: boolean }) => {
      const targetEl = scrollContainerRef?.current
      if (targetEl) {
        const maxScroll = targetEl.scrollHeight - targetEl.clientHeight
        const targetTop = clamp(targetProgress, 0, 1) * maxScroll
        if (options?.smooth) {
          targetEl.scrollTo({ top: targetTop, behavior: "smooth" })
        } else {
          targetEl.scrollTop = targetTop
        }
        return
      }

      if (typeof window === "undefined") return
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({
        top: clamp(targetProgress, 0, 1) * maxScroll,
        behavior: options?.smooth ? "smooth" : "auto",
      })
    },
    [scrollContainerRef]
  )

  const handleScrub = onScrubToProgress ?? defaultScrub

  // Automatic initial progress positioning on mount
  const hasInitialScrubbed = useRef(false)
  useEffect(() => {
    if (hasInitialScrubbed.current || typeof initialProgress !== "number")
      return
    hasInitialScrubbed.current = true
    const timer = setTimeout(() => {
      handleScrub(initialProgress, { smooth: true })
    }, 100)
    return () => clearTimeout(timer)
  }, [initialProgress, handleScrub])

  // Continuous auto-cruise scrolling loop
  useEffect(() => {
    if (!autoScroll) return
    let rafId: number
    let direction = 1
    const speed = autoScrollSpeed ?? 2.2

    const step = () => {
      const containerEl =
        scrollContainerRef?.current ??
        (typeof document !== "undefined" ? document.documentElement : null)
      if (containerEl) {
        const isWin = !scrollContainerRef?.current
        const maxScroll = isWin
          ? document.documentElement.scrollHeight - window.innerHeight
          : containerEl.scrollHeight - containerEl.clientHeight
        const currentScroll = isWin ? window.scrollY : containerEl.scrollTop

        const nextScroll = currentScroll + direction * speed
        if (isWin) {
          window.scrollTo(0, nextScroll)
        } else {
          containerEl.scrollTop = nextScroll
        }

        if (nextScroll >= maxScroll - 2) direction = -1
        if (nextScroll <= 2) direction = 1
      }
      rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [autoScroll, autoScrollSpeed, scrollContainerRef])

  const updateScrollFromClientY = useCallback(
    (clientY: number, options?: { smooth?: boolean }) => {
      if (!rulerRef.current) return
      const rect = rulerRef.current.getBoundingClientRect()
      const pad = 16
      const usableHeight = rect.height - pad * 2
      const relY = clamp(clientY - rect.top - pad, 0, usableHeight)
      const targetProgress = relY / usableHeight
      handleScrub(targetProgress, options)
    },
    [handleScrub]
  )

  const handleJumpToSection = useCallback(
    (sec: RailSection) => {
      const containerEl = scrollContainerRef?.current
      if (containerEl) {
        const el =
          containerEl.querySelector(`#${sec.id}`) ||
          document.getElementById(sec.id)
        if (el) {
          const containerRect = containerEl.getBoundingClientRect()
          const elRect = el.getBoundingClientRect()
          const targetY =
            containerEl.scrollTop + (elRect.top - containerRect.top) - 20
          containerEl.scrollTo({
            top: Math.max(0, targetY),
            behavior: "smooth",
          })
          return
        }
        handleScrub(sec.anchor, { smooth: true })
        return
      }

      if (typeof document !== "undefined") {
        const rawId = sec.id
        const lowerId = rawId.toLowerCase()
        const targetEl =
          document.getElementById(rawId) ||
          document.getElementById(lowerId) ||
          document.querySelector(`[id="${rawId}"]`) ||
          document.querySelector(`[id="${lowerId}"]`)

        if (targetEl) {
          try {
            window.history.pushState(null, "", `#${rawId}`)
          } catch {
            /* ignore */
          }
          const headerOffset = 84
          const elementPosition = targetEl.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.scrollY - headerOffset
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: "smooth",
          })
          return
        }
      }

      handleScrub(sec.start + 0.005, { smooth: true })
    },
    [handleScrub, scrollContainerRef]
  )

  // Track drag velocity for momentum fling on touch/mouse release
  const dragState = useRef<{
    lastY: number
    lastTime: number
    velocity: number
  } | null>(null)

  // Track initial tap position to distinguish quick tap vs drag
  const dragStartInfo = useRef<{
    x: number
    y: number
    time: number
    hasMoved: boolean
  } | null>(null)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // If clicked on an interactive button, do not capture or start dragging
    if ((e.target as HTMLElement).closest("button")) return

    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsDragging(true)
    dragStartInfo.current = {
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
      hasMoved: false,
    }
    dragState.current = {
      lastY: e.clientY,
      lastTime: performance.now(),
      velocity: 0,
    }
    // Only immediately scrub on pointerdown if desktop menu mode is NOT enabled
    if (
      !allowDesktopMenu &&
      typeof window !== "undefined" &&
      window.innerWidth >= 768
    ) {
      updateScrollFromClientY(e.clientY, { smooth: false })
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!rulerRef.current) return
    const rect = rulerRef.current.getBoundingClientRect()
    const pad = 16
    const usableHeight = rect.height - pad * 2
    const relY = clamp(e.clientY - rect.top, 0, rect.height)
    mouseYMV.set(relY)

    const pct = clamp(
      Math.round(((e.clientY - rect.top - pad) / usableHeight) * 100),
      0,
      100
    )
    hoverPercentMV.set(pct)

    if (dragStartInfo.current) {
      const dist = Math.hypot(
        e.clientX - dragStartInfo.current.x,
        e.clientY - dragStartInfo.current.y
      )
      const isTouch = e.pointerType === "touch"
      const tapDistThreshold = isTouch ? 18 : 6
      if (dist > tapDistThreshold) {
        dragStartInfo.current.hasMoved = true
      }
    }

    if (isDragging) {
      if (dragState.current) {
        const now = performance.now()
        const dt = Math.max(1, now - dragState.current.lastTime)
        const dy = e.clientY - dragState.current.lastY
        const instV = dy / dt
        // Smooth exponential moving average for velocity
        dragState.current.velocity =
          dragState.current.velocity * 0.4 + instV * 0.6
        dragState.current.lastY = e.clientY
        dragState.current.lastTime = now
      }
      updateScrollFromClientY(e.clientY, { smooth: false })
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
      setIsDragging(false)

      const now = performance.now()
      const touchDuration = dragStartInfo.current
        ? now - dragStartInfo.current.time
        : 9999
      const isTouch = e.pointerType === "touch"
      const dist = dragStartInfo.current
        ? Math.hypot(
            e.clientX - dragStartInfo.current.x,
            e.clientY - dragStartInfo.current.y
          )
        : 999

      const wasTap =
        dragStartInfo.current &&
        (!dragStartInfo.current.hasMoved ||
          (isTouch && touchDuration < 320 && dist < 22) ||
          (!isTouch && touchDuration < 250 && dist < 8))

      dragStartInfo.current = null

      if (wasTap) {
        lastTapTimeRef.current = now
        // In card menu mode, tapping ruler does not toggle menu (clicking the dot rail does)
        if (!isCardMenu) {
          const isMobile =
            typeof window !== "undefined" && window.innerWidth < 768
          if (allowDesktopMenu || isMobile) {
            setIsSectionMenuOpen((prev) => !prev)
            dragState.current = null
            return
          }
        }
      }

      if (dragState.current && rulerRef.current) {
        const now = performance.now()
        const elapsed = now - dragState.current.lastTime
        // If finger stopped moving before release (> 80ms), there was no fling
        const v = elapsed > 80 ? 0 : clamp(dragState.current.velocity, -3, 3)

        if (Math.abs(v) > 0.08) {
          const rect = rulerRef.current.getBoundingClientRect()
          const pad = 16
          const usableHeight = rect.height - pad * 2
          // Carry fling momentum
          const carryMs = 240
          const coastPx = v * carryMs
          const currentRelY = clamp(e.clientY - rect.top - pad, 0, usableHeight)
          const targetRelY = clamp(currentRelY + coastPx, 0, usableHeight)
          const targetProgress = targetRelY / usableHeight

          handleScrub(targetProgress, { smooth: true })
        }
        dragState.current = null
      }
    }
  }

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
      setIsDragging(false)
      dragStartInfo.current = null
      dragState.current = null
    }
  }

  const blueIndicatorY = useTransform([smoothScroll, smoothHover], ([s, h]) => {
    const pad = 16
    const usableHeight = viewportHeight - pad * 2
    const overviewY = pad + (s as number) * usableHeight
    const zoomedY = pad + (0.18 + (s as number) * 0.64) * usableHeight
    return zoomedY * (1 - (h as number)) + overviewY * (h as number)
  })

  const lensHeight = Math.max(76, viewportHeight * 0.16)
  const lensTop = useTransform(blueIndicatorY, (by) =>
    clamp(by - lensHeight / 2, 16, viewportHeight - lensHeight - 16)
  )

  return (
    <>
      <div
        ref={rulerRef}
        data-rail-scrubber="true"
        tabIndex={0}
        role="region"
        aria-label="Scroll scrubber"
        title={
          allowDesktopMenu
            ? "Click to view sections or drag to scrub"
            : "Scroll scrubber"
        }
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            if (!isCardMenu) {
              e.preventDefault()
              setIsSectionMenuOpen((prev) => !prev)
            }
          } else if (e.key === "Escape") {
            setIsSectionMenuOpen(false)
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          hoverPercentMV.set(null)
        }}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("button")) return
          // In card menu mode, clicking ruler does not toggle menu (clicking the dot rail does)
          if (isCardMenu) return

          const isMobile =
            typeof window !== "undefined" && window.innerWidth < 768
          if (allowDesktopMenu || isMobile) {
            if (performance.now() - lastTapTimeRef.current > 350) {
              lastTapTimeRef.current = performance.now()
              setIsSectionMenuOpen((prev) => !prev)
            }
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className={cn(
          "fixed inset-y-0 right-0 z-40 touch-none select-none focus:outline-none",
          "hidden sm:block sm:w-[56px]",
          allowDesktopMenu ? "xl:w-[56px]" : "xl:w-[260px]",
          isDragging
            ? "cursor-grabbing"
            : allowDesktopMenu ||
                (typeof window !== "undefined" && window.innerWidth < 768)
              ? "cursor-pointer"
              : "cursor-ns-resize",
          className
        )}
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, color-mix(in oklch, var(--background) 88%, transparent) 28%, var(--background) 100%)",
        }}
      >
        {/* Subtle vertical guide border */}
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-[56px] border-l border-border/40" />

        {/* 1. Flying Characters along 5-Stage Rail Path (Responsive: shown on desktop xl when wide arc mode is enabled) */}
        {!allowDesktopMenu && (
          <div className="pointer-events-none relative hidden h-full w-full xl:block">
            {sections.map((sec, secIdx) => {
              const chars = sec.title.split("")
              const isCurrentActive = secIdx === activeSectionIdx

              return (
                <React.Fragment key={sec.id}>
                  <SectionClickTarget
                    section={sec}
                    secIdx={secIdx}
                    totalSections={sections.length}
                    smoothScroll={smoothScroll}
                    smoothHover={smoothHover}
                    viewportHeight={viewportHeight}
                    onSelect={() => handleJumpToSection(sec)}
                  />

                  {chars.map((char, charIdx) => (
                    <FlyingCharacter
                      key={`${sec.id}-char-${charIdx}`}
                      char={char}
                      charIndex={charIdx}
                      totalChars={chars.length}
                      sectionIndex={secIdx}
                      totalSections={sections.length}
                      section={sec}
                      smoothScroll={smoothScroll}
                      smoothHover={smoothHover}
                      viewportHeight={viewportHeight}
                      curveIntensity={curveIntensity}
                      isCurrentActive={isCurrentActive}
                    />
                  ))}
                </React.Fragment>
              )
            })}
          </div>
        )}

        {/* 2. Hover Overview Lens Box */}
        <motion.div
          style={{
            top: lensTop,
            height: lensHeight,
            opacity: smoothHover,
          }}
          className="pointer-events-none absolute right-0 w-[20px] border-t border-b border-l border-primary/30 bg-primary/[0.08] backdrop-blur-[1px] sm:w-[52px]"
        />

        {/* 3. Hover Cursor Line (Isolated, 0 parent re-renders) */}
        <HoverCursorLine
          mouseYMV={mouseYMV}
          hoverPercentMV={hoverPercentMV}
          isHovered={isHovered}
        />

        {/* 4. Dynamic Ruler Ticks */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {ticks.map((tickVal) => (
            <RulerTick
              key={tickVal}
              tickValue={tickVal}
              smoothScroll={smoothScroll}
              smoothHover={smoothHover}
              blueIndicatorY={blueIndicatorY}
              viewportHeight={viewportHeight}
              zoomScale={zoomScale}
            />
          ))}
        </div>

        {/* 5. Glowing Progress Line & Percentage Readout */}
        <motion.div
          style={{ y: blueIndicatorY }}
          className="pointer-events-none absolute top-0 right-0 z-30 w-[56px]"
        >
          <div
            className="relative h-[2px] w-full"
            style={{
              backgroundColor: accentColor,
              boxShadow: "0 0 14px 2px var(--color-primary, var(--primary))",
            }}
          ></div>

          {/* Isolated Percentage Readout (Zero parent re-render on scroll) */}
          {showPercentageReadout && (
            <PercentReadout
              smoothScroll={smoothScroll}
              accentColor={accentColor}
              isDragging={isDragging}
              onToggleMenu={() => setIsSectionMenuOpen((prev) => !prev)}
            />
          )}
        </motion.div>
      </div>

      {/* 6. Vertical Dot Indicator Rail:
          - Visible on all screens in "card" mode.
          - On mobile (< sm), 101-tick ruler is hidden, so this compact dot rail serves as the sleek touch navigation anchor.
      */}
      <div
        ref={dotRailRef}
        className={cn(
          "pointer-events-auto fixed top-1/2 z-40 -translate-y-1/2",
          "right-2 sm:right-16 md:right-18",
          "flex flex-col items-center gap-1.5 rounded-md border border-border/80 bg-muted/90 px-1 py-2 shadow-lg backdrop-blur-xl sm:gap-2 sm:px-1.5 sm:py-3 dark:bg-zinc-900/90",
          !isCardMenu && "sm:hidden"
        )}
        onMouseEnter={cancelCloseTimer}
        onMouseLeave={() => scheduleClose(280)}
        onClick={(e) => {
          if ((e.target as HTMLElement).tagName === "BUTTON") return
          setIsSectionMenuOpen((prev) => !prev)
        }}
      >
        {sections.map((sec, idx) => {
          const isActive = idx === activeSectionIdx
          const isSelected = isSectionMenuOpen && idx === safePreviewIdx
          return (
            <button
              key={sec.id}
              type="button"
              title={sec.label ?? formatSectionTitle(sec.title)}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseEnter={() => {
                cancelCloseTimer()
                setPreviewIdx(idx)
                setIsSectionMenuOpen(true)
              }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                cancelCloseTimer()
                setPreviewIdx(idx)
                setIsSectionMenuOpen(true)
                handleJumpToSection(sec)
              }}
              className="group relative flex size-3.5 cursor-pointer touch-manipulation items-center justify-center sm:size-4"
            >
              <span
                className={cn(
                  "rounded-full transition-all duration-200",
                  isActive
                    ? "size-2 bg-primary shadow-[0_0_8px_var(--primary)] ring-2 ring-primary/30 sm:size-2.5"
                    : isSelected
                      ? "size-1.5 scale-110 bg-foreground sm:size-2"
                      : "size-1 bg-muted-foreground/40 hover:scale-125 hover:bg-muted-foreground/80 sm:size-1.5"
                )}
                style={
                  isActive
                    ? { backgroundColor: sec.accent ?? accentColor }
                    : undefined
                }
              />
            </button>
          )
        })}
      </div>

      {/* 7. Section Jump Menu (Rendered OUTSIDE rulerRef, without any blurred backdrop layer) */}
      <AnimatePresence>
        {isSectionMenuOpen && (
          <motion.div
            key={isCardMenu ? "scrubber-card-menu" : "scrubber-list-menu"}
            ref={menuCardRef}
            initial={{ opacity: 0, scale: 0.94, x: 12 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.94, x: 12 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            onMouseEnter={cancelCloseTimer}
            onMouseLeave={() => {
              if (isCardMenu) {
                scheduleClose(280)
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "pointer-events-auto fixed top-1/2 z-50 -translate-y-1/2",
              isCardMenu
                ? "right-9 max-w-[calc(100vw-3rem)] sm:right-24 md:right-27"
                : cn(
                    "right-6 max-h-[75vh] w-56 max-w-[calc(100vw-3rem)] overflow-y-auto rounded-xl border border-border/80 bg-card/95 p-4 shadow-2xl backdrop-blur-xl",
                    allowDesktopMenu
                      ? "sm:right-16 md:right-16 md:w-60"
                      : "md:hidden"
                  )
            )}
            style={{ scrollbarWidth: "none" }}
          >
            {isCardMenu ? (
              /* Rich Card Bubble containing Section List with Distinct Surface & Percentage coordinates */
              <div
                className={cn(
                  "relative flex flex-col overflow-hidden rounded-xl border border-border/80",
                  "bg-muted/95 text-foreground shadow-2xl backdrop-blur-xl dark:bg-zinc-900/95",
                  "w-[220px] p-2 sm:w-[250px]"
                )}
              >
                {/* Minimal Header */}
                <div className="flex items-center justify-between border-b border-border/60 px-2 py-1.5 pb-2 text-xs">
                  <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Sections
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    <strong className="text-foreground">
                      {activeSectionIdx + 1}
                    </strong>{" "}
                    of {sections.length}
                  </span>
                </div>

                {/* Section List Items */}
                <div className="mt-1 flex flex-col gap-1">
                  {sections.map((sec, idx) => {
                    const isActive = idx === activeSectionIdx
                    const isPreview =
                      isSectionMenuOpen && idx === safePreviewIdx
                    const displayTitle =
                      sec.label ?? formatSectionTitle(sec.title)
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          cancelCloseTimer()
                          handleJumpToSection(sec)
                          setIsSectionMenuOpen(false)
                        }}
                        onMouseEnter={() => setPreviewIdx(idx)}
                        className={cn(
                          "group flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs transition-all select-none",
                          isActive
                            ? "border border-primary/25 bg-primary/15 font-semibold text-foreground shadow-xs"
                            : isPreview
                              ? "bg-background/80 text-foreground"
                              : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                        )}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={cn(
                              "size-1.5 shrink-0 rounded-full transition-all",
                              isActive
                                ? "size-2 bg-primary shadow-[0_0_6px_var(--primary)]"
                                : "bg-muted-foreground/40 group-hover:bg-muted-foreground/80"
                            )}
                            style={
                              isActive
                                ? { backgroundColor: sec.accent ?? accentColor }
                                : undefined
                            }
                          />
                          <span className="truncate">{displayTitle}</span>
                        </div>
                        <span
                          className={cn(
                            "ml-2 shrink-0 font-mono text-[10px]",
                            isActive
                              ? "font-semibold text-primary"
                              : "text-muted-foreground/75"
                          )}
                        >
                          {Math.round(sec.start * 100)}%
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              /* Classic List Variant */
              <div className="flex flex-col gap-1.5">
                {sections.map((sec, idx) => {
                  const isActive = idx === activeSectionIdx
                  const displayTitle =
                    sec.label ?? formatSectionTitle(sec.title)
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleJumpToSection(sec)
                        setIsSectionMenuOpen(false)
                      }}
                      className={cn(
                        "group flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors select-none",
                        isActive
                          ? "bg-primary/10 font-semibold text-foreground"
                          : "font-normal text-muted-foreground/80 hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <span className="truncate">{displayTitle}</span>
                      {isActive && (
                        <span
                          className="ml-2 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: accentColor }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* Alias for ergonomic and alternative naming */
export { RailScrollScrubber as ArtcraftScrollScrubber }
