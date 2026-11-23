# Scroll Indicator

> Vertical scroll progress indicator with tick marks, click-to-reveal section titles, Web Audio micro-interactions, and spring physics.

## Overview

**Scroll Indicator** is an ultra-clean vertical progress indicator and table-of-contents navigation component inspired by Nexvyn UI and precision telemetry HUDs.

As the user scrolls, a glowing laser indicator line glides smoothly across calibrated tick marks using Framer Motion spring physics. Section labels reveal on hover or click, accompanied by zero-latency synthesized Web Audio sound effects.

### Features

- **Static Percentage Layout**: Pure CSS percentage positioning for all 60 ruler ticks ensures instant, glitch-free initial render with zero layout shift during SSR or hydration.
- **Click to Reveal Titles**: Click anywhere on the ruler line to toggle the section titles open with card backdrops, or hover to preview.
- **Automatic Scroll Spy**: Detects the active section in view automatically on both `window` and custom scroll containers.
- **Web Audio Micro-Interactions**: Real-time sine and triangle wave oscillator chirps on hover and click without external audio assets.
- **Spring Physics**: Organic, natural movement with `motion/react` springs, automatically respecting `prefers-reduced-motion`.

---

## Installation

  

  
    ```bash
npx shadcn@latest add https://byphongphan.com/r/scroll-indicator.json
```
  

  
    
      - Install dependencies:
      ```bash
npm install motion
```
      - Copy and paste the sound utility into your project:
      ```tsx
// animated/scroll-indicator.tsx
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { motion, useReducedMotion } from "motion/react"

import { playClickSound, playHoverSound } from "@/lib/sound"
import { cn } from "@/lib/utils"

export interface ScrollIndicatorSection {
  id: string
  title: ReactNode
  level?: number
  label?: string
  start?: number
  end?: number
  anchor?: number
  flightRange?: [number, number]
  subtitle?: string
  description?: string
  accent?: string
  meta?: string
  timestamp?: string
}

export interface ScrollIndicatorProps {
  /** Array of section items containing id and title */
  sections: ScrollIndicatorSection[]
  /** Controlled active section index */
  activeIndex?: number
  /** Callback triggered when the active section changes */
  onIndexChange?: (index: number) => void
  /** Optional custom scrollable container. If omitted, tracks window scroll */
  scrollRef?: React.RefObject<HTMLElement | null>
  /** Vertical offset in pixels when scrolling to a target section */
  scrollOffset?: number
  /** Total number of ticks along the ruler track (default: 60) */
  totalTicks?: number
  /** Additional CSS class names */
  className?: string
}

type TickRole = "main" | "sub-mid" | "sub-small"

/** Base (resting) geometry for each tick role — dual-theme via foreground tokens. */
const BASE_TICK: Record<
  TickRole,
  { width: number; heightClass: string; className: string }
> = {
  main: {
    width: 14,
    heightClass: "h-[1.5px]",
    className: "bg-foreground/40 dark:bg-white/30",
  },
  "sub-mid": {
    width: 10,
    heightClass: "h-px",
    className: "bg-foreground/25 dark:bg-white/20",
  },
  "sub-small": {
    width: 6,
    heightClass: "h-px",
    className: "bg-foreground/15 dark:bg-white/12",
  },
}

/**
 * Level look-up table for the proximity wave (Δ ticks from target).
 * Matches LineNav Gaussian proximity wave with spring kinematics.
 */
const WAVE: {
  width: number
  heightClass: string
  className: string
  glowClass: string
}[] = [
  {
    width: 44,
    heightClass: "h-[2px]",
    className: "bg-primary",
    glowClass:
      "shadow-[0_0_8px_var(--primary)] drop-shadow-[0_0_6px_var(--primary)]",
  },
  {
    width: 34,
    heightClass: "h-[1.5px]",
    className: "bg-primary/80",
    glowClass: "shadow-[0_0_5px_var(--primary)]",
  },
  {
    width: 26,
    heightClass: "h-px",
    className: "bg-primary/55",
    glowClass: "shadow-none",
  },
  {
    width: 19,
    heightClass: "h-px",
    className: "bg-primary/35",
    glowClass: "shadow-none",
  },
  {
    width: 13,
    heightClass: "h-px",
    className: "bg-primary/20",
    glowClass: "shadow-none",
  },
]

function getTickGeometry(role: TickRole, delta: number) {
  const wave = WAVE[delta]
  if (wave) return wave
  const base = BASE_TICK[role]
  return {
    width: base.width,
    heightClass: base.heightClass,
    className: base.className,
    glowClass: "shadow-none",
  }
}

export const ScrollIndicator = forwardRef<HTMLDivElement, ScrollIndicatorProps>(
  function ScrollIndicatorComponent(
    {
      sections,
      activeIndex: controlledIndex,
      onIndexChange,
      scrollRef: externalScrollRef,
      scrollOffset = 64,
      totalTicks: totalTicksProp = 60,
      className,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const [internalIndex, setInternalIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    // Allows force-closing the labels even while pointer remains over the track
    const [isDismissed, setIsDismissed] = useState(false)
    const [hoveredTrackTick, setHoveredTrackTick] = useState<number | null>(null)
    const [hoveredSectionIndex, setHoveredSectionIndex] = useState<
      number | null
    >(null)
    const reduceMotion = useReducedMotion()

    const activeIndex = controlledIndex ?? internalIndex

    // Filter level 2 or 3 sections if hierarchical levels exist; otherwise keep all sections
    const filteredSections = useMemo(() => {
      if (!sections.length) return []
      const hasHierarchicalLevels = sections.some(
        (s) => s.level === 2 || s.level === 3
      )
      return hasHierarchicalLevels
        ? sections.filter((s) => s.level === 2 || s.level === 3)
        : sections
    }, [sections])

    const totalTicks = Math.max(10, totalTicksProp)
    const lastTick = totalTicks - 1

    const sectionMetrics = useMemo(() => {
      const denom = Math.max(filteredSections.length - 1, 1)
      return filteredSections.map((section, index) => {
        const tick = Math.round((index / denom) * lastTick)
        return {
          section,
          index,
          tick,
          pct: (tick / lastTick) * 100,
        }
      })
    }, [filteredSections, lastTick])

    const sectionTicksSet = useMemo(() => {
      const set = new Set<number>()
      sectionMetrics.forEach((m) => set.add(m.tick))
      return set
    }, [sectionMetrics])

    // Precompute ruler ticks with LineNav roles
    const ticks = useMemo(
      () =>
        Array.from({ length: totalTicks }, (_, i) => {
          let role: TickRole = "sub-small"
          if (sectionTicksSet.has(i) || i % 5 === 0) {
            role = "main"
          } else if (i % 5 === 2 || i % 5 === 3) {
            role = "sub-mid"
          }
          return {
            index: i,
            pct: (i / lastTick) * 100,
            role,
          }
        }),
      [totalTicks, lastTick, sectionTicksSet]
    )

    const safeActiveIndex = Math.min(
      Math.max(0, activeIndex),
      Math.max(0, sectionMetrics.length - 1)
    )
    const activeTick = sectionMetrics[safeActiveIndex]?.tick ?? 0

    // Focus target for LineNav proximity wave (hovered section tick ?? hovered track tick ?? active tick)
    const targetTick =
      hoveredSectionIndex !== null && sectionMetrics[hoveredSectionIndex]
        ? sectionMetrics[hoveredSectionIndex].tick
        : hoveredTrackTick !== null
          ? hoveredTrackTick
          : activeTick

    // Scroll spy optimized with requestAnimationFrame
    useEffect(() => {
      if (controlledIndex !== undefined || sectionMetrics.length === 0) return

      const container = externalScrollRef?.current
      let rafId: number | null = null

      const resolveElement = (
        id: string,
        index: number
      ): HTMLElement | null => {
        if (container) {
          return (
            container.querySelector<HTMLElement>(
              `[data-section-index="${index}"]`
            ) || (id ? document.getElementById(id) : null)
          )
        }
        return (
          (id ? document.getElementById(id) : null) ||
          document.querySelector<HTMLElement>(`[data-section-index="${index}"]`)
        )
      }

      const updateActiveSection = () => {
        rafId = null

        const isAtBottom = container
          ? container.scrollTop + container.clientHeight >=
            container.scrollHeight - 48
          : typeof window !== "undefined" &&
            window.innerHeight + window.scrollY >=
              document.documentElement.scrollHeight - 48

        if (isAtBottom) {
          setInternalIndex((prev) =>
            prev !== sectionMetrics.length - 1
              ? sectionMetrics.length - 1
              : prev
          )
          return
        }

        const viewportThreshold =
          (container ? container.clientHeight : window.innerHeight) * 0.32
        const containerTop = container
          ? container.getBoundingClientRect().top
          : 0

        let nextActiveIdx = 0
        for (let i = 0; i < sectionMetrics.length; i++) {
          const el = resolveElement(sectionMetrics[i].section.id, i)
          if (!el) continue

          const top = el.getBoundingClientRect().top - containerTop
          if (top <= viewportThreshold) {
            nextActiveIdx = i
          } else {
            break
          }
        }

        setInternalIndex((prev) =>
          prev !== nextActiveIdx ? nextActiveIdx : prev
        )
      }

      const handleScroll = () => {
        if (rafId === null) {
          rafId = window.requestAnimationFrame(updateActiveSection)
        }
      }

      updateActiveSection()
      const scrollTarget: EventTarget = container ?? window
      scrollTarget.addEventListener("scroll", handleScroll, { passive: true })
      window.addEventListener("resize", handleScroll, { passive: true })

      return () => {
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId)
        }
        scrollTarget.removeEventListener("scroll", handleScroll)
        window.removeEventListener("resize", handleScroll)
      }
    }, [controlledIndex, externalScrollRef, sectionMetrics])

    const scrollToSection = useCallback(
      (index: number) => {
        const container = externalScrollRef?.current
        const metric = sectionMetrics[index]
        if (!metric) return

        const { id } = metric.section

        if (container) {
          const sectionEl =
            container.querySelector<HTMLElement>(
              `[data-section-index="${index}"]`
            ) || (id ? document.getElementById(id) : null)

          if (sectionEl) {
            const top =
              sectionEl.getBoundingClientRect().top -
              container.getBoundingClientRect().top +
              container.scrollTop -
              scrollOffset
            container.scrollTo({
              top: Math.max(0, top),
              behavior: reduceMotion ? "auto" : "smooth",
            })
          }
        } else if (typeof window !== "undefined") {
          const sectionEl =
            (id ? document.getElementById(id) : null) ||
            document.querySelector<HTMLElement>(
              `[data-section-index="${index}"]`
            )

          if (sectionEl) {
            try {
              window.history.pushState(null, "", `#${id}`)
            } catch {
              // Ignore history state errors in sandboxed environments
            }

            const top =
              sectionEl.getBoundingClientRect().top +
              window.scrollY -
              scrollOffset
            window.scrollTo({
              top: Math.max(0, top),
              behavior: reduceMotion ? "auto" : "smooth",
            })
          }
        }
      },
      [externalScrollRef, reduceMotion, scrollOffset, sectionMetrics]
    )

    const handleClickSection = useCallback(
      (index: number) => {
        playClickSound()
        if (onIndexChange) {
          onIndexChange(index)
        } else {
          setInternalIndex(index)
        }
        scrollToSection(index)
        setIsOpen(false)
        setIsDismissed(true)
      },
      [onIndexChange, scrollToSection]
    )

    const handleCloseText = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        playClickSound()
        setIsOpen(false)
        setIsDismissed(true)
      },
      []
    )

    const handleTrackMouseMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!trackRef.current) return
        const rect = trackRef.current.getBoundingClientRect()
        if (rect.height <= 0) return
        const relY = Math.max(
          0,
          Math.min(1, (e.clientY - rect.top) / rect.height)
        )
        const tick = Math.round(relY * lastTick)
        setHoveredTrackTick(tick)
      },
      [lastTick]
    )

    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest("button")) return

      if (!trackRef.current) return
      const rect = trackRef.current.getBoundingClientRect()

      if (e.clientX < rect.left) {
        return
      }

      playClickSound()
      if (isDismissed) {
        setIsDismissed(false)
        setIsOpen(true)
      } else {
        setIsOpen((prev) => !prev)
      }

      if (sectionMetrics.length > 0 && rect.height > 0) {
        const clickY = e.clientY - rect.top
        const progress = Math.max(0, Math.min(1, clickY / rect.height))
        const closestIdx = Math.round(progress * (sectionMetrics.length - 1))
        if (onIndexChange) {
          onIndexChange(closestIdx)
        } else {
          setInternalIndex(closestIdx)
        }
        scrollToSection(closestIdx)
      }
    }

    // Close labels when clicking outside or pressing Escape
    useEffect(() => {
      if (!isOpen && !isHovered) return

      const handlePointerDownOutside = (e: PointerEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false)
          setIsDismissed(true)
        }
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false)
          setIsDismissed(true)
        }
      }

      window.addEventListener("pointerdown", handlePointerDownOutside)
      window.addEventListener("keydown", handleKeyDown)

      return () => {
        window.removeEventListener("pointerdown", handlePointerDownOutside)
        window.removeEventListener("keydown", handleKeyDown)
      }
    }, [isOpen, isHovered])

    const isVisible = (isOpen || isHovered) && !isDismissed

    return (
      <div
        ref={(node) => {
          containerRef.current = node
          if (typeof ref === "function") {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        className={cn("select-none", className)}
      >
        <div
          ref={trackRef}
          className="group relative flex h-full w-8 cursor-pointer justify-end sm:w-10"
          onMouseEnter={() => {
            setIsHovered(true)
            setIsDismissed(false)
          }}
          onMouseMove={handleTrackMouseMove}
          onMouseLeave={() => {
            setIsHovered(false)
            setIsDismissed(false)
            setHoveredTrackTick(null)
            setHoveredSectionIndex(null)
          }}
          onClick={handleTrackClick}
          title={
            isVisible ? "Click to jump to section" : "Click to view sections"
          }
        >
          {/* Subtle ambient gradient backdrop behind section labels for contrast */}
          <div
            className={cn(
              "absolute -inset-y-8 right-0 z-10 w-64 cursor-default transition-opacity duration-300 ease-out sm:w-72",
              isVisible
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            )}
            title=""
          >
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 bg-gradient-to-l from-background/95 via-background/60 to-transparent backdrop-blur-[2px]",
                "[mask-image:radial-gradient(100%_55%_at_100%_50%,black_65%,transparent_100%)]"
              )}
            />
          </div>

          {/* Vertical spine line along the right edge of ruler track */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-px bg-border/40 transition-colors duration-300 group-hover:bg-border/70" />

          {/* Close button centered directly at the top of vertical axis to dismiss labels */}
          <div
            className={cn(
              "absolute -top-8 right-0 z-40 translate-x-1/2 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
              isVisible
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                : "pointer-events-none translate-y-1.5 scale-75 opacity-0"
            )}
          >
            <button
              type="button"
              onMouseEnter={() => playHoverSound()}
              onClick={handleCloseText}
              aria-label="Close section labels"
              title="Close section labels (Esc)"
              className={cn(
                "group/close relative flex size-6 cursor-pointer items-center justify-center rounded-full border border-border/70 bg-background/90 text-muted-foreground shadow-xs backdrop-blur-md transition-all duration-150",
                "hover:scale-105 hover:border-foreground/40 hover:bg-card hover:text-foreground active:scale-95",
                "focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none"
              )}
            >
              <span className="pointer-events-none absolute -bottom-2 left-1/2 h-2 w-px -translate-x-1/2 bg-border/60" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3 transition-transform duration-200 group-hover/close:rotate-90"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* 1. LineNav-inspired Vernier Caliper Ladder Ticks with Proximity Wave & Spring Kinematics */}
          <div className="pointer-events-none absolute inset-0 z-10">
            {ticks.map(({ index, pct, role }) => {
              const delta = Math.abs(index - targetTick)
              const geo = getTickGeometry(role, delta)

              return (
                <div
                  key={index}
                  className="absolute right-0 flex -translate-y-1/2 items-center justify-end"
                  style={{ top: `${pct}%` }}
                >
                  <motion.span
                    initial={false}
                    animate={{ width: geo.width }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 400, damping: 30 }
                    }
                    className={cn(
                      "block rounded-l-full",
                      geo.heightClass,
                      geo.className,
                      geo.glowClass
                    )}
                  />
                </div>
              )
            })}
          </div>

          {/* 2. Interactive Section Labels (Clean, borderless, dotless typography matching LineNav) */}
          <div className="pointer-events-none absolute inset-0 z-30">
            {sectionMetrics.map(({ section, index, pct }) => {
              const isActive = index === safeActiveIndex
              const isSectionHovered = hoveredSectionIndex === index
              const staggerDelay =
                isVisible && !reduceMotion
                  ? `${Math.min(index * 16, 90)}ms`
                  : "0ms"

              return (
                <div key={section.id}>
                  {/* Clean text button: NO border, NO dot, pure LineNav typography */}
                  <div
                    className={cn(
                      "absolute right-full z-30 flex -translate-y-1/2 items-center justify-end pr-3",
                      reduceMotion
                        ? ""
                        : "transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isVisible
                        ? "pointer-events-auto translate-x-0 scale-100 opacity-100"
                        : "pointer-events-none translate-x-2 scale-[0.97] opacity-0"
                    )}
                    style={{
                      top: `${pct}%`,
                      transitionDelay: staggerDelay,
                    }}
                  >
                    <button
                      type="button"
                      onMouseEnter={() => {
                        playHoverSound()
                        setHoveredSectionIndex(index)
                      }}
                      onMouseLeave={() => {
                        setHoveredSectionIndex(null)
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleClickSection(index)
                      }}
                      className={cn(
                        "group/btn relative flex cursor-pointer items-center gap-2 py-1 font-mono text-xs tracking-wider whitespace-nowrap uppercase transition-all duration-150 outline-none select-none",
                        "focus-visible:ring-1 focus-visible:ring-primary focus-visible:rounded-xs",
                        isActive
                          ? "font-semibold text-primary drop-shadow-[0_0_8px_var(--primary)]"
                          : isSectionHovered
                            ? "font-medium text-foreground -translate-x-0.5"
                            : "text-muted-foreground/60 hover:text-foreground hover:-translate-x-0.5"
                      )}
                    >
                      <span
                        className={cn(
                          "text-[10px] tabular-nums font-mono transition-colors",
                          isActive
                            ? "font-semibold text-primary"
                            : isSectionHovered
                              ? "text-foreground/80"
                              : "text-muted-foreground/40 group-hover/btn:text-foreground/70"
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate">{section.title}</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
)

```
      - Copy and paste the component into your project:
      ```tsx
// animated/scroll-indicator.tsx
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { motion, useReducedMotion } from "motion/react"

import { playClickSound, playHoverSound } from "@/lib/sound"
import { cn } from "@/lib/utils"

export interface ScrollIndicatorSection {
  id: string
  title: ReactNode
  level?: number
  label?: string
  start?: number
  end?: number
  anchor?: number
  flightRange?: [number, number]
  subtitle?: string
  description?: string
  accent?: string
  meta?: string
  timestamp?: string
}

export interface ScrollIndicatorProps {
  /** Array of section items containing id and title */
  sections: ScrollIndicatorSection[]
  /** Controlled active section index */
  activeIndex?: number
  /** Callback triggered when the active section changes */
  onIndexChange?: (index: number) => void
  /** Optional custom scrollable container. If omitted, tracks window scroll */
  scrollRef?: React.RefObject<HTMLElement | null>
  /** Vertical offset in pixels when scrolling to a target section */
  scrollOffset?: number
  /** Total number of ticks along the ruler track (default: 60) */
  totalTicks?: number
  /** Additional CSS class names */
  className?: string
}

type TickRole = "main" | "sub-mid" | "sub-small"

/** Base (resting) geometry for each tick role — dual-theme via foreground tokens. */
const BASE_TICK: Record<
  TickRole,
  { width: number; heightClass: string; className: string }
> = {
  main: {
    width: 14,
    heightClass: "h-[1.5px]",
    className: "bg-foreground/40 dark:bg-white/30",
  },
  "sub-mid": {
    width: 10,
    heightClass: "h-px",
    className: "bg-foreground/25 dark:bg-white/20",
  },
  "sub-small": {
    width: 6,
    heightClass: "h-px",
    className: "bg-foreground/15 dark:bg-white/12",
  },
}

/**
 * Level look-up table for the proximity wave (Δ ticks from target).
 * Matches LineNav Gaussian proximity wave with spring kinematics.
 */
const WAVE: {
  width: number
  heightClass: string
  className: string
  glowClass: string
}[] = [
  {
    width: 44,
    heightClass: "h-[2px]",
    className: "bg-primary",
    glowClass:
      "shadow-[0_0_8px_var(--primary)] drop-shadow-[0_0_6px_var(--primary)]",
  },
  {
    width: 34,
    heightClass: "h-[1.5px]",
    className: "bg-primary/80",
    glowClass: "shadow-[0_0_5px_var(--primary)]",
  },
  {
    width: 26,
    heightClass: "h-px",
    className: "bg-primary/55",
    glowClass: "shadow-none",
  },
  {
    width: 19,
    heightClass: "h-px",
    className: "bg-primary/35",
    glowClass: "shadow-none",
  },
  {
    width: 13,
    heightClass: "h-px",
    className: "bg-primary/20",
    glowClass: "shadow-none",
  },
]

function getTickGeometry(role: TickRole, delta: number) {
  const wave = WAVE[delta]
  if (wave) return wave
  const base = BASE_TICK[role]
  return {
    width: base.width,
    heightClass: base.heightClass,
    className: base.className,
    glowClass: "shadow-none",
  }
}

export const ScrollIndicator = forwardRef<HTMLDivElement, ScrollIndicatorProps>(
  function ScrollIndicatorComponent(
    {
      sections,
      activeIndex: controlledIndex,
      onIndexChange,
      scrollRef: externalScrollRef,
      scrollOffset = 64,
      totalTicks: totalTicksProp = 60,
      className,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const [internalIndex, setInternalIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    // Allows force-closing the labels even while pointer remains over the track
    const [isDismissed, setIsDismissed] = useState(false)
    const [hoveredTrackTick, setHoveredTrackTick] = useState<number | null>(null)
    const [hoveredSectionIndex, setHoveredSectionIndex] = useState<
      number | null
    >(null)
    const reduceMotion = useReducedMotion()

    const activeIndex = controlledIndex ?? internalIndex

    // Filter level 2 or 3 sections if hierarchical levels exist; otherwise keep all sections
    const filteredSections = useMemo(() => {
      if (!sections.length) return []
      const hasHierarchicalLevels = sections.some(
        (s) => s.level === 2 || s.level === 3
      )
      return hasHierarchicalLevels
        ? sections.filter((s) => s.level === 2 || s.level === 3)
        : sections
    }, [sections])

    const totalTicks = Math.max(10, totalTicksProp)
    const lastTick = totalTicks - 1

    const sectionMetrics = useMemo(() => {
      const denom = Math.max(filteredSections.length - 1, 1)
      return filteredSections.map((section, index) => {
        const tick = Math.round((index / denom) * lastTick)
        return {
          section,
          index,
          tick,
          pct: (tick / lastTick) * 100,
        }
      })
    }, [filteredSections, lastTick])

    const sectionTicksSet = useMemo(() => {
      const set = new Set<number>()
      sectionMetrics.forEach((m) => set.add(m.tick))
      return set
    }, [sectionMetrics])

    // Precompute ruler ticks with LineNav roles
    const ticks = useMemo(
      () =>
        Array.from({ length: totalTicks }, (_, i) => {
          let role: TickRole = "sub-small"
          if (sectionTicksSet.has(i) || i % 5 === 0) {
            role = "main"
          } else if (i % 5 === 2 || i % 5 === 3) {
            role = "sub-mid"
          }
          return {
            index: i,
            pct: (i / lastTick) * 100,
            role,
          }
        }),
      [totalTicks, lastTick, sectionTicksSet]
    )

    const safeActiveIndex = Math.min(
      Math.max(0, activeIndex),
      Math.max(0, sectionMetrics.length - 1)
    )
    const activeTick = sectionMetrics[safeActiveIndex]?.tick ?? 0

    // Focus target for LineNav proximity wave (hovered section tick ?? hovered track tick ?? active tick)
    const targetTick =
      hoveredSectionIndex !== null && sectionMetrics[hoveredSectionIndex]
        ? sectionMetrics[hoveredSectionIndex].tick
        : hoveredTrackTick !== null
          ? hoveredTrackTick
          : activeTick

    // Scroll spy optimized with requestAnimationFrame
    useEffect(() => {
      if (controlledIndex !== undefined || sectionMetrics.length === 0) return

      const container = externalScrollRef?.current
      let rafId: number | null = null

      const resolveElement = (
        id: string,
        index: number
      ): HTMLElement | null => {
        if (container) {
          return (
            container.querySelector<HTMLElement>(
              `[data-section-index="${index}"]`
            ) || (id ? document.getElementById(id) : null)
          )
        }
        return (
          (id ? document.getElementById(id) : null) ||
          document.querySelector<HTMLElement>(`[data-section-index="${index}"]`)
        )
      }

      const updateActiveSection = () => {
        rafId = null

        const isAtBottom = container
          ? container.scrollTop + container.clientHeight >=
            container.scrollHeight - 48
          : typeof window !== "undefined" &&
            window.innerHeight + window.scrollY >=
              document.documentElement.scrollHeight - 48

        if (isAtBottom) {
          setInternalIndex((prev) =>
            prev !== sectionMetrics.length - 1
              ? sectionMetrics.length - 1
              : prev
          )
          return
        }

        const viewportThreshold =
          (container ? container.clientHeight : window.innerHeight) * 0.32
        const containerTop = container
          ? container.getBoundingClientRect().top
          : 0

        let nextActiveIdx = 0
        for (let i = 0; i < sectionMetrics.length; i++) {
          const el = resolveElement(sectionMetrics[i].section.id, i)
          if (!el) continue

          const top = el.getBoundingClientRect().top - containerTop
          if (top <= viewportThreshold) {
            nextActiveIdx = i
          } else {
            break
          }
        }

        setInternalIndex((prev) =>
          prev !== nextActiveIdx ? nextActiveIdx : prev
        )
      }

      const handleScroll = () => {
        if (rafId === null) {
          rafId = window.requestAnimationFrame(updateActiveSection)
        }
      }

      updateActiveSection()
      const scrollTarget: EventTarget = container ?? window
      scrollTarget.addEventListener("scroll", handleScroll, { passive: true })
      window.addEventListener("resize", handleScroll, { passive: true })

      return () => {
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId)
        }
        scrollTarget.removeEventListener("scroll", handleScroll)
        window.removeEventListener("resize", handleScroll)
      }
    }, [controlledIndex, externalScrollRef, sectionMetrics])

    const scrollToSection = useCallback(
      (index: number) => {
        const container = externalScrollRef?.current
        const metric = sectionMetrics[index]
        if (!metric) return

        const { id } = metric.section

        if (container) {
          const sectionEl =
            container.querySelector<HTMLElement>(
              `[data-section-index="${index}"]`
            ) || (id ? document.getElementById(id) : null)

          if (sectionEl) {
            const top =
              sectionEl.getBoundingClientRect().top -
              container.getBoundingClientRect().top +
              container.scrollTop -
              scrollOffset
            container.scrollTo({
              top: Math.max(0, top),
              behavior: reduceMotion ? "auto" : "smooth",
            })
          }
        } else if (typeof window !== "undefined") {
          const sectionEl =
            (id ? document.getElementById(id) : null) ||
            document.querySelector<HTMLElement>(
              `[data-section-index="${index}"]`
            )

          if (sectionEl) {
            try {
              window.history.pushState(null, "", `#${id}`)
            } catch {
              // Ignore history state errors in sandboxed environments
            }

            const top =
              sectionEl.getBoundingClientRect().top +
              window.scrollY -
              scrollOffset
            window.scrollTo({
              top: Math.max(0, top),
              behavior: reduceMotion ? "auto" : "smooth",
            })
          }
        }
      },
      [externalScrollRef, reduceMotion, scrollOffset, sectionMetrics]
    )

    const handleClickSection = useCallback(
      (index: number) => {
        playClickSound()
        if (onIndexChange) {
          onIndexChange(index)
        } else {
          setInternalIndex(index)
        }
        scrollToSection(index)
        setIsOpen(false)
        setIsDismissed(true)
      },
      [onIndexChange, scrollToSection]
    )

    const handleCloseText = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        playClickSound()
        setIsOpen(false)
        setIsDismissed(true)
      },
      []
    )

    const handleTrackMouseMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!trackRef.current) return
        const rect = trackRef.current.getBoundingClientRect()
        if (rect.height <= 0) return
        const relY = Math.max(
          0,
          Math.min(1, (e.clientY - rect.top) / rect.height)
        )
        const tick = Math.round(relY * lastTick)
        setHoveredTrackTick(tick)
      },
      [lastTick]
    )

    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest("button")) return

      if (!trackRef.current) return
      const rect = trackRef.current.getBoundingClientRect()

      if (e.clientX < rect.left) {
        return
      }

      playClickSound()
      if (isDismissed) {
        setIsDismissed(false)
        setIsOpen(true)
      } else {
        setIsOpen((prev) => !prev)
      }

      if (sectionMetrics.length > 0 && rect.height > 0) {
        const clickY = e.clientY - rect.top
        const progress = Math.max(0, Math.min(1, clickY / rect.height))
        const closestIdx = Math.round(progress * (sectionMetrics.length - 1))
        if (onIndexChange) {
          onIndexChange(closestIdx)
        } else {
          setInternalIndex(closestIdx)
        }
        scrollToSection(closestIdx)
      }
    }

    // Close labels when clicking outside or pressing Escape
    useEffect(() => {
      if (!isOpen && !isHovered) return

      const handlePointerDownOutside = (e: PointerEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false)
          setIsDismissed(true)
        }
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false)
          setIsDismissed(true)
        }
      }

      window.addEventListener("pointerdown", handlePointerDownOutside)
      window.addEventListener("keydown", handleKeyDown)

      return () => {
        window.removeEventListener("pointerdown", handlePointerDownOutside)
        window.removeEventListener("keydown", handleKeyDown)
      }
    }, [isOpen, isHovered])

    const isVisible = (isOpen || isHovered) && !isDismissed

    return (
      <div
        ref={(node) => {
          containerRef.current = node
          if (typeof ref === "function") {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        className={cn("select-none", className)}
      >
        <div
          ref={trackRef}
          className="group relative flex h-full w-8 cursor-pointer justify-end sm:w-10"
          onMouseEnter={() => {
            setIsHovered(true)
            setIsDismissed(false)
          }}
          onMouseMove={handleTrackMouseMove}
          onMouseLeave={() => {
            setIsHovered(false)
            setIsDismissed(false)
            setHoveredTrackTick(null)
            setHoveredSectionIndex(null)
          }}
          onClick={handleTrackClick}
          title={
            isVisible ? "Click to jump to section" : "Click to view sections"
          }
        >
          {/* Subtle ambient gradient backdrop behind section labels for contrast */}
          <div
            className={cn(
              "absolute -inset-y-8 right-0 z-10 w-64 cursor-default transition-opacity duration-300 ease-out sm:w-72",
              isVisible
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            )}
            title=""
          >
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 bg-gradient-to-l from-background/95 via-background/60 to-transparent backdrop-blur-[2px]",
                "[mask-image:radial-gradient(100%_55%_at_100%_50%,black_65%,transparent_100%)]"
              )}
            />
          </div>

          {/* Vertical spine line along the right edge of ruler track */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-px bg-border/40 transition-colors duration-300 group-hover:bg-border/70" />

          {/* Close button centered directly at the top of vertical axis to dismiss labels */}
          <div
            className={cn(
              "absolute -top-8 right-0 z-40 translate-x-1/2 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
              isVisible
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                : "pointer-events-none translate-y-1.5 scale-75 opacity-0"
            )}
          >
            <button
              type="button"
              onMouseEnter={() => playHoverSound()}
              onClick={handleCloseText}
              aria-label="Close section labels"
              title="Close section labels (Esc)"
              className={cn(
                "group/close relative flex size-6 cursor-pointer items-center justify-center rounded-full border border-border/70 bg-background/90 text-muted-foreground shadow-xs backdrop-blur-md transition-all duration-150",
                "hover:scale-105 hover:border-foreground/40 hover:bg-card hover:text-foreground active:scale-95",
                "focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none"
              )}
            >
              <span className="pointer-events-none absolute -bottom-2 left-1/2 h-2 w-px -translate-x-1/2 bg-border/60" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3 transition-transform duration-200 group-hover/close:rotate-90"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* 1. LineNav-inspired Vernier Caliper Ladder Ticks with Proximity Wave & Spring Kinematics */}
          <div className="pointer-events-none absolute inset-0 z-10">
            {ticks.map(({ index, pct, role }) => {
              const delta = Math.abs(index - targetTick)
              const geo = getTickGeometry(role, delta)

              return (
                <div
                  key={index}
                  className="absolute right-0 flex -translate-y-1/2 items-center justify-end"
                  style={{ top: `${pct}%` }}
                >
                  <motion.span
                    initial={false}
                    animate={{ width: geo.width }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 400, damping: 30 }
                    }
                    className={cn(
                      "block rounded-l-full",
                      geo.heightClass,
                      geo.className,
                      geo.glowClass
                    )}
                  />
                </div>
              )
            })}
          </div>

          {/* 2. Interactive Section Labels (Clean, borderless, dotless typography matching LineNav) */}
          <div className="pointer-events-none absolute inset-0 z-30">
            {sectionMetrics.map(({ section, index, pct }) => {
              const isActive = index === safeActiveIndex
              const isSectionHovered = hoveredSectionIndex === index
              const staggerDelay =
                isVisible && !reduceMotion
                  ? `${Math.min(index * 16, 90)}ms`
                  : "0ms"

              return (
                <div key={section.id}>
                  {/* Clean text button: NO border, NO dot, pure LineNav typography */}
                  <div
                    className={cn(
                      "absolute right-full z-30 flex -translate-y-1/2 items-center justify-end pr-3",
                      reduceMotion
                        ? ""
                        : "transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isVisible
                        ? "pointer-events-auto translate-x-0 scale-100 opacity-100"
                        : "pointer-events-none translate-x-2 scale-[0.97] opacity-0"
                    )}
                    style={{
                      top: `${pct}%`,
                      transitionDelay: staggerDelay,
                    }}
                  >
                    <button
                      type="button"
                      onMouseEnter={() => {
                        playHoverSound()
                        setHoveredSectionIndex(index)
                      }}
                      onMouseLeave={() => {
                        setHoveredSectionIndex(null)
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleClickSection(index)
                      }}
                      className={cn(
                        "group/btn relative flex cursor-pointer items-center gap-2 py-1 font-mono text-xs tracking-wider whitespace-nowrap uppercase transition-all duration-150 outline-none select-none",
                        "focus-visible:ring-1 focus-visible:ring-primary focus-visible:rounded-xs",
                        isActive
                          ? "font-semibold text-primary drop-shadow-[0_0_8px_var(--primary)]"
                          : isSectionHovered
                            ? "font-medium text-foreground -translate-x-0.5"
                            : "text-muted-foreground/60 hover:text-foreground hover:-translate-x-0.5"
                      )}
                    >
                      <span
                        className={cn(
                          "text-[10px] tabular-nums font-mono transition-colors",
                          isActive
                            ? "font-semibold text-primary"
                            : isSectionHovered
                              ? "text-foreground/80"
                              : "text-muted-foreground/40 group-hover/btn:text-foreground/70"
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate">{section.title}</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
)

```
      - Update import paths to match your project structure.
    
  

---

## Usage

### 1. Window Scroll Integration

Mount the component fixed on the right viewport edge for full-page documentation or landing pages:

```tsx
import { ScrollIndicator } from "@/components/scroll-indicator"

const SECTIONS = [
  { id: "intro", title: "Introduction" },
  { id: "features", title: "Features" },
  { id: "pricing", title: "Pricing" },
  { id: "faq", title: "FAQ" },
]

export function Page() {
  return (
    <div>
      <main>
        <section id="intro">...</section>
        <section id="features">...</section>
        <section id="pricing">...</section>
        <section id="faq">...</section>
      </main>

      <ScrollIndicator
        sections={SECTIONS}
        className="fixed top-1/2 right-4 z-40 h-[380px] -translate-y-1/2 sm:right-6 sm:h-[440px]"
      />
    </div>
  )
}
```

### 2. Custom Scrollable Container

Attach to an `overflow-y-auto` scroll container using `scrollRef`:

```tsx
import { useRef } from "react"
import { ScrollIndicator } from "@/components/scroll-indicator"

export function ModalOrPanel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative flex h-[500px]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto pr-14">
        <div id="step-1">...</div>
        <div id="step-2">...</div>
        <div id="step-3">...</div>
      </div>

      <div className="absolute top-0 right-3 bottom-0 my-auto h-[320px]">
        <ScrollIndicator
          sections={[
            { id: "step-1", title: "Step 1" },
            { id: "step-2", title: "Step 2" },
            { id: "step-3", title: "Step 3" },
          ]}
          scrollRef={scrollRef}
        />
      </div>
    </div>
  )
}
```

---

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `sections` | `ScrollIndicatorSection[]` | `[]` | Array of section objects `{ id, title, level? }`. |
| `activeIndex` | `number` | `undefined` | Controlled active section index. If omitted, uses automatic scroll spy. |
| `onIndexChange` | `(index: number) => void` | `undefined` | Callback fired when the active section changes via click or scroll. |
| `scrollRef` | `RefObject<HTMLElement>` | `undefined` | Optional ref to a scrollable container. If omitted, tracks `window` scroll. |
| `scrollOffset` | `number` | `64` | Offset in pixels when scrolling to an anchor (e.g. to accommodate a sticky header). |
| `totalTicks` | `number` | `60` | Number of tick marks rendered along the vertical track. |
| `className` | `string` | `undefined` | Additional CSS classes for positioning or sizing. |
