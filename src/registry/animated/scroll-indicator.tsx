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
    const reduceMotion = useReducedMotion()

    const activeIndex = controlledIndex ?? internalIndex

    // Filter to level 2 or 3 if explicit heading hierarchy is specified; otherwise include all sections
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

    const sectionTick = useCallback(
      (index: number) =>
        Math.round(
          (index / Math.max(filteredSections.length - 1, 1)) * lastTick
        ),
      [filteredSections.length, lastTick]
    )

    const safeActiveIndex = Math.min(
      Math.max(0, activeIndex),
      Math.max(0, filteredSections.length - 1)
    )
    const activeTick = sectionTick(safeActiveIndex)
    const activePct = (activeTick / lastTick) * 100

    // Spring interpolation for smooth progress movement without initial layout jumps
    const progressPct = useMotionValue(activePct)
    const smoothPct = useSpring(progressPct, {
      stiffness: reduceMotion ? 1000 : 320,
      damping: reduceMotion ? 100 : 28,
    })

    useEffect(() => {
      progressPct.set(activePct)
    }, [activePct, progressPct])

    // Built-in scroll spy for automatic section tracking
    useEffect(() => {
      if (controlledIndex !== undefined) return

      const container = externalScrollRef?.current

      const handleScroll = () => {
        if (filteredSections.length === 0) return

        // Check if reached bottom of container / window
        const isAtBottom = container
          ? container.scrollTop + container.clientHeight >=
            container.scrollHeight - 60
          : typeof window !== "undefined" &&
            window.innerHeight + window.scrollY >=
              document.documentElement.scrollHeight - 60

        if (isAtBottom) {
          setInternalIndex(filteredSections.length - 1)
          return
        }

        const viewportThreshold =
          (container ? container.clientHeight : window.innerHeight) * 0.35

        let activeIdx = 0
        for (let i = 0; i < filteredSections.length; i++) {
          const sec = filteredSections[i]
          const el = container
            ? (container.querySelector(
                `[data-section-index="${i}"]`
              ) as HTMLElement | null) ||
              (container.querySelector(`#${sec.id}`) as HTMLElement | null) ||
              document.getElementById(sec.id)
            : document.getElementById(sec.id) ||
              (document.querySelector(
                `[data-section-index="${i}"]`
              ) as HTMLElement | null)

          if (!el) continue

          const top = container
            ? el.getBoundingClientRect().top -
              container.getBoundingClientRect().top
            : el.getBoundingClientRect().top

          if (top <= viewportThreshold) {
            activeIdx = i
          } else {
            break
          }
        }

        setInternalIndex(activeIdx)
      }

      handleScroll()
      const scrollTarget: EventTarget = container ?? window
      scrollTarget.addEventListener("scroll", handleScroll, { passive: true })
      window.addEventListener("resize", handleScroll, { passive: true })

      return () => {
        scrollTarget.removeEventListener("scroll", handleScroll)
        window.removeEventListener("resize", handleScroll)
      }
    }, [controlledIndex, externalScrollRef, filteredSections])

    const scrollToSection = useCallback(
      (index: number) => {
        const container = externalScrollRef?.current
        const sec = filteredSections[index]
        if (!sec) return

        if (container) {
          const sectionEl =
            (container.querySelector(
              `[data-section-index="${index}"]`
            ) as HTMLElement | null) ||
            (container.querySelector(`#${sec.id}`) as HTMLElement | null) ||
            document.getElementById(sec.id)

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
            document.getElementById(sec.id) ||
            (document.querySelector(
              `[data-section-index="${index}"]`
            ) as HTMLElement | null)

          if (sectionEl) {
            try {
              window.history.pushState(null, "", `#${sec.id}`)
            } catch {
              // Ignore navigation state errors
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
      [externalScrollRef, filteredSections, reduceMotion, scrollOffset]
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
      },
      [onIndexChange, scrollToSection]
    )

    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
      // Ignore click if clicking directly on a section button
      if ((e.target as HTMLElement).closest("button")) return

      playClickSound()
      // Toggle the section title list open / closed
      setIsOpen((prev) => !prev)

      // Jump to section nearest to click position
      if (trackRef.current && filteredSections.length > 0) {
        const rect = trackRef.current.getBoundingClientRect()
        if (rect.height > 0) {
          const clickY = e.clientY - rect.top
          const progress = Math.max(0, Math.min(1, clickY / rect.height))
          const closestIdx = Math.round(
            progress * (filteredSections.length - 1)
          )
          if (onIndexChange) {
            onIndexChange(closestIdx)
          } else {
            setInternalIndex(closestIdx)
          }
          scrollToSection(closestIdx)
        }
      }
    }

    // Close on click outside or Escape key
    useEffect(() => {
      if (!isOpen) return

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
        }
      }

      window.addEventListener("pointerdown", handlePointerDownOutside)
      window.addEventListener("keydown", handleKeyDown)

      return () => {
        window.removeEventListener("pointerdown", handlePointerDownOutside)
        window.removeEventListener("keydown", handleKeyDown)
      }
    }, [isOpen])

    const isVisible = isOpen || isHovered

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
          className="relative flex h-full w-8 cursor-pointer justify-end sm:w-10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleTrackClick}
          title={isOpen ? "Đóng danh sách mục" : "Nhấp vào để xem các mục"}
        >
          {/* Subtle vertical ruler backbone */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-border/50" />

          {/* 1. Static Ruler Ticks using pure CSS percentage (No SSR/initial-load stack glitch) */}
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: totalTicks }).map((_, i) => {
              const tickPct = (i / lastTick) * 100
              const isMajor = i % 5 === 0
              const isPast = i <= activeTick

              return (
                <div
                  key={i}
                  className="absolute right-0 flex -translate-y-1/2 items-center justify-end"
                  style={{ top: `${tickPct}%` }}
                >
                  <div
                    className={cn(
                      "ease rounded-full transition-colors duration-150 motion-reduce:transition-none",
                      isMajor
                        ? isPast
                          ? "h-[2px] w-5 bg-foreground sm:w-6"
                          : "h-[2px] w-5 bg-foreground/60 sm:w-6"
                        : isPast
                          ? "h-[1.5px] w-2.5 bg-foreground/80 sm:w-3.5"
                          : "h-[1.5px] w-2.5 bg-muted-foreground/35 sm:w-3.5"
                    )}
                  />
                </div>
              )
            })}
          </div>

          {/* 2. Section Markers & Labels */}
          <div className="absolute inset-0">
            {filteredSections.map((section, i) => {
              const sectionPct = (sectionTick(i) / lastTick) * 100
              const isActive = i === safeActiveIndex

              return (
                <div key={section.id}>
                  {/* Section Line on Ruler Track */}
                  <div
                    className={cn(
                      "ease pointer-events-none absolute right-0 h-[2.5px] -translate-y-1/2 rounded-full transition-all duration-150 motion-reduce:transition-none",
                      isActive
                        ? "w-7 bg-primary shadow-[0_0_8px_var(--primary)] sm:w-8"
                        : "w-5 bg-foreground/85 sm:w-6"
                    )}
                    style={{ top: `${sectionPct}%` }}
                  />

                  {/* Section Title Button (revealed on hover or on click) */}
                  <div
                    className={cn(
                      "absolute flex -translate-y-1/2 items-center justify-end",
                      reduceMotion
                        ? ""
                        : "transition-[opacity,transform] duration-200 ease-out",
                      isVisible
                        ? "pointer-events-auto translate-x-0 opacity-100"
                        : "pointer-events-none translate-x-3 opacity-0"
                    )}
                    style={{
                      top: `${sectionPct}%`,
                      right: "26px",
                      transitionDelay: isVisible ? `${i * 25}ms` : "0ms",
                    }}
                  >
                    <button
                      type="button"
                      onMouseEnter={() => playHoverSound()}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleClickSection(i)
                      }}
                      className={cn(
                        "ease cursor-pointer rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wider whitespace-nowrap uppercase shadow-sm backdrop-blur-md transition-all duration-150 motion-reduce:transition-none",
                        "focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:outline-none",
                        isActive
                          ? "border-primary/50 bg-primary/20 text-primary shadow-primary/10"
                          : "border-border/70 bg-card/90 text-muted-foreground hover:border-foreground/30 hover:bg-card hover:text-foreground"
                      )}
                    >
                      {section.title}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 3. Bold Active Laser Indicator Line (No 1/9 numbers) */}
          <motion.div
            className="pointer-events-none absolute right-0 z-20 flex -translate-y-1/2 items-center justify-end"
            style={{
              top: useTransform(smoothPct, (v) => `${v}%`),
            }}
          >
            <div className="h-[3px] w-8 rounded-full bg-primary shadow-[0_0_12px_2px_var(--primary)] sm:w-10" />
          </motion.div>
        </div>
      </div>
    )
  }
)
