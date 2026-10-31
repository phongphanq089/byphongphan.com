"use client"

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
  /** Custom MotionValue for scroll progress (0..1). If omitted, connects to window scroll */
  scrollProgressMV?: MotionValue<number>
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
  /** Additional CSS class names */
  className?: string
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
    accent: "var(--primary)",
  },
  {
    id: "features",
    title: "FEATURES",
    start: 0.2,
    end: 0.48,
    anchor: 0.17,
    flightRange: [0.08, 0.28],
    subtitle: "NON-DESTRUCTIVE NODE GRAPH",
    accent: "var(--primary)",
  },
  {
    id: "ownership",
    title: "OWNERSHIP",
    start: 0.48,
    end: 0.7,
    anchor: 0.6,
    flightRange: [0.58, 0.7],
    subtitle: "LOCAL-FIRST & VERIFIABLE ASSETS",
    accent: "var(--primary)",
  },
  {
    id: "community",
    title: "COMMUNITY",
    start: 0.7,
    end: 0.86,
    anchor: 0.73,
    flightRange: [0.655, 0.79],
    subtitle: "OPEN ECOSYSTEM & SHADER REGISTRY",
    accent: "var(--primary)",
  },
  {
    id: "get-started",
    title: "GET STARTED",
    start: 0.86,
    end: 1.0,
    anchor: 0.81,
    flightRange: [0.78, 0.93],
    subtitle: "DEPLOY IN SECONDS",
    accent: "var(--primary)",
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

      const topStackY =
        sectionIndex === 0
          ? 18
          : isCurrentActive
            ? 20 + sectionIndex * 24 + 6
            : 18 + sectionIndex * 24

      const reverseSecIdx = totalSections - 1 - sectionIndex
      const bottomStackY = viewportHeight - 28 - reverseSecIdx * 22
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
    const topStackY = 18 + secIdx * 26
    const reverseSecIdx = totalSections - 1 - secIdx
    const bottomStackY = viewportHeight - 28 - reverseSecIdx * 22
    const overviewY = 20 + section.anchor * (viewportHeight - 40)

    const midFlight = (section.flightRange[0] + section.flightRange[1]) / 2
    const normalY =
      (s as number) >= midFlight || secIdx === 0 ? topStackY : bottomStackY
    return normalY * (1 - (h as number)) + overviewY * (h as number) - 8
  })

  return (
    <motion.button
      type="button"
      onClick={(e) => {
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
  onScrubToProgress,
  springConfig = { stiffness: 140, damping: 26, mass: 0.45 },
  zoomScale = 3.6,
  curveIntensity = 1.0,
  accentColor = "var(--primary)",
  hideNativeScrollbar = true,
  className,
}: RailScrollScrubberProps) {
  const rulerRef = useRef<HTMLDivElement>(null)
  const [viewportHeight, setViewportHeight] = useState(() => {
    if (typeof window !== "undefined") return window.innerHeight
    return 800
  })
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSectionIdx, setActiveSectionIdx] = useState(0)

  // Automatically hide native browser scrollbars on html and body when scrubber is active
  useEffect(() => {
    if (!hideNativeScrollbar || typeof document === "undefined") return

    const htmlEl = document.documentElement
    const bodyEl = document.body

    const prevHtmlClass = htmlEl.classList.contains("no-scrollbar")
    const prevBodyClass = bodyEl.classList.contains("no-scrollbar")

    htmlEl.classList.add("no-scrollbar")
    bodyEl.classList.add("no-scrollbar")

    return () => {
      if (!prevHtmlClass) htmlEl.classList.remove("no-scrollbar")
      if (!prevBodyClass) bodyEl.classList.remove("no-scrollbar")
    }
  }, [hideNativeScrollbar])

  // Respect user's motion preferences
  const prefersReduced = useReducedMotion()
  const effectiveSpringConfig = useMemo(() => {
    if (prefersReduced) {
      return { stiffness: 1000, damping: 50, mass: 0.1 }
    }
    return springConfig
  }, [prefersReduced, springConfig])

  // Fallback to window scroll if no external MotionValue passed
  const { scrollYProgress: windowScrollMV } = useScroll()
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

  // Only update activeSectionIdx when crossing section boundaries
  useMotionValueEvent(smoothScroll, "change", (v) => {
    let currentIdx = 0
    for (let i = sections.length - 1; i >= 0; i--) {
      const threshold = sections[i].start - 0.02
      if (v >= threshold) {
        currentIdx = i
        break
      }
    }
    setActiveSectionIdx((prev) => (prev !== currentIdx ? currentIdx : prev))
  })

  const ticks = useMemo(() => Array.from({ length: 101 }, (_, i) => i), [])

  const defaultScrub = useCallback(
    (targetProgress: number, options?: { smooth?: boolean }) => {
      if (typeof window === "undefined") return
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({
        top: clamp(targetProgress, 0, 1) * maxScroll,
        behavior: options?.smooth ? "smooth" : "auto",
      })
    },
    []
  )

  const handleScrub = onScrubToProgress ?? defaultScrub

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
    updateScrollFromClientY(e.clientY, { smooth: false })
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
      if (dist > 6) {
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

      const wasTap = dragStartInfo.current && !dragStartInfo.current.hasMoved
      dragStartInfo.current = null

      if (wasTap) {
        // Tapped without dragging -> Toggle mobile section jump menu
        setIsMobileMenuOpen((prev) => !prev)
        dragState.current = null
        return
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
    <div
      ref={rulerRef}
      tabIndex={0}
      role="region"
      aria-label="Scroll scrubber"
      onFocus={(e) => {
        if (
          e.target === rulerRef.current &&
          typeof window !== "undefined" &&
          window.innerWidth < 768
        ) {
          setIsMobileMenuOpen(true)
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          setIsMobileMenuOpen((prev) => !prev)
        } else if (e.key === "Escape") {
          setIsMobileMenuOpen(false)
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        hoverPercentMV.set(null)
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={cn(
        "fixed inset-y-0 right-0 z-40 w-[18px] touch-none select-none focus:outline-none sm:w-[56px] md:w-[260px]",
        isDragging ? "cursor-grabbing" : "cursor-ns-resize",
        className
      )}
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, color-mix(in oklch, var(--background) 88%, transparent) 28%, var(--background) 100%)",
      }}
    >
      {/* Subtle vertical guide border */}
      <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-[18px] border-l border-border/40 sm:w-[56px]" />

      {/* 1. Flying Characters along 5-Stage Rail Path (Responsive: hidden on narrow mobile/tablet screens) */}
      <div className="pointer-events-none relative hidden h-full w-full md:block">
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
                onSelect={() => handleScrub(sec.start + 0.02)}
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

      {/* 2. Hover Overview Lens Box */}
      <motion.div
        style={{
          top: lensTop,
          height: lensHeight,
          opacity: smoothHover,
        }}
        className="pointer-events-none absolute right-0 w-[16px] border-t border-b border-l border-primary/30 bg-primary/[0.08] backdrop-blur-[1px] sm:w-[52px]"
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
        className="pointer-events-none absolute top-0 right-0 z-30 w-[18px] sm:w-[56px]"
      >
        <div
          className="relative h-[2px] w-full"
          style={{
            backgroundColor: accentColor,
            boxShadow: "0 0 14px 2px var(--color-primary, var(--primary))",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground to-primary" />
        </div>

        {/* Isolated Percentage Readout (Zero parent re-render on scroll) */}
        <PercentReadout
          smoothScroll={smoothScroll}
          accentColor={accentColor}
          isDragging={isDragging}
          onToggleMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />
      </motion.div>

      {/* 6. Mobile Focus Section Jump Menu (Matches TOC Minimap visual format) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop for click outside */}
            <motion.div
              key="mobile-scrubber-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => {
                e.stopPropagation()
                setIsMobileMenuOpen(false)
              }}
              className="fixed inset-0 z-40 bg-background/20 backdrop-blur-[2px] md:hidden"
            />

            {/* Section Jump Card */}
            <motion.div
              key="mobile-scrubber-menu"
              initial={{ opacity: 0, scale: 0.94, x: 12 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.94, x: 12 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed top-1/2 right-6 z-50 max-h-[70vh] w-52 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border/80 bg-card/95 p-4 shadow-2xl backdrop-blur-xl md:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              <div className="flex flex-col gap-2.5">
                {sections.map((sec, idx) => {
                  const isActive = idx === activeSectionIdx
                  const displayTitle =
                    sec.label ?? formatSectionTitle(sec.title)
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleScrub(sec.start + 0.01, { smooth: true })
                        setIsMobileMenuOpen(false)
                      }}
                      className={cn(
                        "cursor-pointer text-left text-sm transition-colors select-none",
                        isActive
                          ? "font-semibold text-foreground"
                          : "font-normal text-muted-foreground/80 hover:text-foreground"
                      )}
                    >
                      {displayTitle}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* Alias for ergonomic and alternative naming */
export { RailScrollScrubber as ArtcraftScrollScrubber }
