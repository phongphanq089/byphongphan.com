import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

import { playClickSound, playHoverSound } from "@/shared/lib/sound"
import { cn } from "@/shared/lib/utils"

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
    // Allows force-closing the labels even while the pointer remains over the track
    const [isDismissed, setIsDismissed] = useState(false)
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

    // Precompute ruler ticks and section percentage positions to avoid recalculating on every render
    const ticks = useMemo(
      () =>
        Array.from({ length: totalTicks }, (_, i) => ({
          index: i,
          pct: (i / lastTick) * 100,
          isMajor: i % 5 === 0,
        })),
      [totalTicks, lastTick]
    )

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

    const safeActiveIndex = Math.min(
      Math.max(0, activeIndex),
      Math.max(0, sectionMetrics.length - 1)
    )
    const activeTick = sectionMetrics[safeActiveIndex]?.tick ?? 0
    const activePct = sectionMetrics[safeActiveIndex]?.pct ?? 0

    // 1. Spring physics for the primary active indicator (smooth, damped, without overshoot)
    const progressPct = useMotionValue(activePct)
    const smoothPct = useSpring(progressPct, {
      stiffness: reduceMotion ? 1000 : 380,
      damping: reduceMotion ? 100 : 34,
      mass: 0.65,
    })
    const activeLaserTop = useTransform(smoothPct, (v) => `${v}%`)

    // 2. Ghost scrubber following the cursor along the ruler track (zero React re-renders)
    const hoverPct = useMotionValue(activePct)
    const smoothHoverPct = useSpring(hoverPct, {
      stiffness: 550,
      damping: 40,
      mass: 0.4,
    })
    const ghostLaserTop = useTransform(smoothHoverPct, (v) => `${v}%`)

    useEffect(() => {
      progressPct.set(activePct)
    }, [activePct, progressPct])

    // Scroll spy optimized with requestAnimationFrame to prevent layout thrashing
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
        hoverPct.set(relY * 100)
      },
      [hoverPct]
    )

    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest("button")) return

      playClickSound()
      if (isDismissed) {
        setIsDismissed(false)
        setIsOpen(true)
      } else {
        setIsOpen((prev) => !prev)
      }

      if (trackRef.current && sectionMetrics.length > 0) {
        const rect = trackRef.current.getBoundingClientRect()
        if (rect.height > 0) {
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
    }

    // Close menu when clicking outside or pressing Escape
    useEffect(() => {
      if (!isOpen && !isHovered) return

      const handlePointerDownOutside = (e: PointerEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false)
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
          className="group relative flex h-full w-7 cursor-pointer justify-end sm:w-8"
          onMouseEnter={() => {
            setIsHovered(true)
            setIsDismissed(false)
          }}
          onMouseMove={handleTrackMouseMove}
          onMouseLeave={() => {
            setIsHovered(false)
            setIsDismissed(false)
          }}
          onClick={handleTrackClick}
          title={
            isVisible ? "Click to jump to section" : "Click to view sections"
          }
        >
          {/* 0. Subtle ambient gradient backdrop behind section labels for improved contrast */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute -inset-y-8 right-0 z-10 w-64 bg-gradient-to-l from-background/95 via-background/70 to-transparent backdrop-blur-[2px] transition-opacity duration-300 ease-out sm:w-72",
              "[mask-image:radial-gradient(100%_55%_at_100%_50%,black_65%,transparent_100%)]",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          />

          {/* Subtle vertical spine line along the right edge of the ruler track */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-px bg-border/40 transition-colors duration-300 group-hover:bg-border/70" />

          {/* Close button centered directly at the top of the vertical axis line to dismiss labels */}
          <div
            className={cn(
              "absolute -top-8 right-2 z-40 translate-x-1/2 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
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
                "group/close relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-border/70 bg-background/90 text-muted-foreground shadow-sm backdrop-blur-md transition-all duration-150",
                "hover:scale-105 hover:border-foreground/40 hover:bg-card hover:text-foreground active:scale-95",
                "focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none"
              )}
            >
              {/* Short connector stem linking the close button to the top of the vertical axis */}
              <span className="pointer-events-none absolute -bottom-2 left-1/2 h-2 w-px -translate-x-1/2 bg-border/60" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3 transition-transform duration-200 group-hover/close:rotate-90"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* 1. Static Ruler Ticks */}
          <div className="pointer-events-none absolute inset-0 z-10">
            {ticks.map(({ index, pct, isMajor }) => {
              const isPast = index <= activeTick

              return (
                <div
                  key={index}
                  className="absolute right-0 flex -translate-y-1/2 items-center justify-end"
                  style={{ top: `${pct}%` }}
                >
                  <div
                    className={cn(
                      "rounded-full transition-[width,background-color,opacity] duration-300 ease-out motion-reduce:transition-none",
                      isMajor
                        ? isPast
                          ? "h-[1.5px] w-3.5 bg-foreground/75 sm:w-4"
                          : "h-[1.5px] w-3 bg-foreground/30 sm:w-3.5"
                        : isPast
                          ? "h-px w-2 bg-foreground/45 sm:w-2.5"
                          : "h-px w-1.5 bg-muted-foreground/25 sm:w-2"
                    )}
                  />
                </div>
              )
            })}
          </div>

          {/* 2. Ghost Scrubber (Subtle guide line following the cursor on hover) */}
          <motion.div
            className={cn(
              "pointer-events-none absolute right-0 z-20 flex -translate-y-1/2 items-center justify-end transition-opacity duration-200",
              isHovered ? "opacity-100" : "opacity-0"
            )}
            style={{ top: ghostLaserTop }}
          >
            <div className="h-[1.5px] w-4 rounded-full bg-foreground/40 sm:w-5" />
          </motion.div>

          {/* 3. Section Anchor Markers & Interactive Label Buttons */}
          <div className="pointer-events-none absolute inset-0 z-30">
            {sectionMetrics.map(({ section, index, pct }) => {
              const isActive = index === safeActiveIndex
              // Slight stagger on reveal (max 90ms) and instant hide (0ms) for snappy responsiveness
              const staggerDelay =
                isVisible && !reduceMotion
                  ? `${Math.min(index * 16, 90)}ms`
                  : "0ms"

              return (
                <div key={section.id}>
                  {/* Static anchor marker for each section along the ruler */}
                  <div
                    className={cn(
                      "pointer-events-none absolute right-0 -translate-y-1/2 rounded-full transition-all duration-300 ease-out",
                      isActive
                        ? "h-[2px] w-4 bg-primary/40 sm:w-5"
                        : "h-[1.5px] w-3.5 bg-foreground/55 sm:w-4"
                    )}
                    style={{ top: `${pct}%` }}
                  />

                  {/* Section title button — Offset cleanly to the left of the ruler via right-full + pr-2.5 */}
                  <div
                    className={cn(
                      "absolute right-full z-30 flex -translate-y-1/2 items-center justify-end pr-2.5",
                      reduceMotion
                        ? ""
                        : "transition-[opacity,transform,filter] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isVisible
                        ? "blur-0 pointer-events-auto translate-x-0 scale-100 opacity-100"
                        : "pointer-events-none translate-x-2 scale-[0.97] opacity-0 blur-[1px]"
                    )}
                    style={{
                      top: `${pct}%`,
                      transitionDelay: staggerDelay,
                    }}
                  >
                    <button
                      type="button"
                      onMouseEnter={() => playHoverSound()}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleClickSection(index)
                      }}
                      className={cn(
                        "group/btn relative flex cursor-pointer items-center gap-1.5 overflow-hidden rounded-md border px-2.5 py-1 font-mono text-[11px] leading-none font-medium tracking-wider whitespace-nowrap uppercase backdrop-blur-md transition-all duration-150 motion-reduce:transition-none",
                        "focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:outline-none",
                        isActive
                          ? "border-primary/45 bg-gradient-to-r from-primary/10 via-background/95 to-background/95 font-semibold text-foreground shadow-[0_2px_10px_-2px_rgba(0,0,0,0.2)]"
                          : "border-border/60 bg-gradient-to-r from-card/95 to-card/80 text-muted-foreground shadow-xs hover:-translate-x-0.5 hover:border-foreground/30 hover:text-foreground"
                      )}
                    >
                      {/* Status indicator dot highlighting the active section without blurring text */}
                      <span
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200",
                          isActive
                            ? "scale-100 bg-primary shadow-[0_0_6px_var(--primary)]"
                            : "scale-75 bg-muted-foreground/35 group-hover/btn:scale-90 group-hover/btn:bg-foreground/60"
                        )}
                      />
                      <span>{section.title}</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 4. Primary Active Laser Indicator driven by spring physics */}
          <motion.div
            className="pointer-events-none absolute right-0 z-20 flex -translate-y-1/2 items-center justify-end"
            style={{ top: activeLaserTop }}
          >
            <div className="flex items-center">
              {/* Subtle glowing laser tip */}
              <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_1px_var(--primary)]" />
              {/* Laser body kept strictly within the ruler bounds (20px-24px), never overlapping text labels */}
              <div className="-ml-0.5 h-[2px] w-4.5 rounded-r-full bg-primary shadow-[0_0_10px_var(--primary)] sm:w-5.5" />
            </div>
          </motion.div>
        </div>
      </div>
    )
  }
)
