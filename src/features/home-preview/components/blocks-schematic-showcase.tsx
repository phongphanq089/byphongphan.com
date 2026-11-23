import { Link } from "@tanstack/react-router"
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import React, { useEffect, useRef, useState } from "react"

import { BLOCKS_DATA } from "@/features/blocks/blocks-data"
import { RenderBlockCategorySchematic } from "@/features/blocks/components/schematics"
import { cn } from "@/shared/lib/utils"
import { SpotlightCard } from "@/shared/ui/core"
import { SchematicWrapper, StripedPattern } from "@/shared/ui/system"

/**
 * Slide configuration representing the Production Block categories.
 * Each slide features technical CAD schematics with 9-slice grid and dimension rulers.
 * Uses official dark mode semantic tokens:
 * - Surfaces: bg-card, bg-background, bg-muted
 * - Borders: border-border
 * - Typography: text-foreground, text-muted-foreground
 */
const BLOCK_SLIDES = [
  {
    id: "marketing" as const,
    index: "01",
    title: "MARKETING",
    category: "marketing" as const,
    count: BLOCKS_DATA.filter((b) => b.category === "marketing").length,
    specsLabel: "p16 - r8 - hero & metrics",
    paddingPx: 16,
    badge: "ALIGNED",
    desc: "Hero & metrics sections for high-conversion landing pages",
    widthLabel: "w-full - max 224",
  },
  {
    id: "404-page" as const,
    index: "02",
    title: "404 PAGE",
    category: "404-page" as const,
    count: BLOCKS_DATA.filter((b) => b.category === "404-page").length,
    specsLabel: "p14 - r6 - 2d physics game",
    paddingPx: 14,
    badge: "BLEED",
    desc: "Playable 2D physics game & gravity canvas error screens",
    widthLabel: "w-full - max 224",
  },
  {
    id: "auth" as const,
    index: "03",
    title: "AUTH",
    category: "auth" as const,
    count: BLOCKS_DATA.filter((b) => b.category === "auth").length,
    specsLabel: "p16 - r8 - form & input",
    paddingPx: 16,
    badge: "COLUMN",
    desc: "Authentication screens, login modals, and form inputs",
    widthLabel: "w-full - max 224",
  },
  {
    id: "ecommerce" as const,
    index: "04",
    title: "E-COMMERCE",
    category: "ecommerce" as const,
    count: BLOCKS_DATA.filter((b) => b.category === "ecommerce").length,
    specsLabel: "p16 - r8 - store & checkout",
    paddingPx: 16,
    badge: "WRAPPER",
    desc: "Storefronts, cart drawers, and product showcase cards",
    widthLabel: "w-full - max 224",
  },
  {
    id: "application" as const,
    index: "05",
    title: "APPLICATION",
    category: "application" as const,
    count: BLOCKS_DATA.filter((b) => b.category === "application").length,
    specsLabel: "p16 - r8 - console & app",
    paddingPx: 16,
    badge: "DASHBOARD",
    desc: "Application consoles, telemetry docks, and settings panels",
    widthLabel: "w-full - max 224",
  },
  {
    id: "view-all" as const,
    index: "06",
    title: "VIEW ALL BLOCKS",
    category: "view-all" as const,
    count: BLOCKS_DATA.length,
    specsLabel: "p16 - r8 - full directory",
    paddingPx: 16,
    badge: "DIRECTORY",
    desc: "Explore full directory of production blocks & layouts",
    widthLabel: "w-full - catalog",
  },
]

/**
 * Production Blocks Horizontal Slider Showcase
 * - Aligned with the 1024px content column on the left
 * - Bleeds out to the right edge of the screen
 * - Fully draggable via mouse grab & touch swipe with real-time feedback
 * - Autoplay disabled by default per user request
 * - Interactive prev/next icon buttons and dot pagination
 */
export function BlocksSchematicShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardWidth, setCardWidth] = useState(580)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const dragStartX = useRef<number>(0)
  const hasDragged = useRef<boolean>(false)
  const cardMeasureRef = useRef<HTMLDivElement>(null)

  // Measure card width responsively
  useEffect(() => {
    const updateWidth = () => {
      if (cardMeasureRef.current) {
        setCardWidth(cardMeasureRef.current.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(BLOCK_SLIDES.length - 1, prev + 1))
  }

  // Drag handling logic
  const handleDragStart = (clientX: number) => {
    setIsDragging(true)
    dragStartX.current = clientX
    hasDragged.current = false
    setDragOffset(0)
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return
    const diff = clientX - dragStartX.current
    if (Math.abs(diff) > 5) {
      hasDragged.current = true
    }

    // Rubber-band resistance at boundaries
    if (
      (currentIndex === 0 && diff > 0) ||
      (currentIndex === BLOCK_SLIDES.length - 1 && diff < 0)
    ) {
      setDragOffset(diff * 0.35)
    } else {
      setDragOffset(diff)
    }
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = 60 // Pixels to trigger slide change
    if (dragOffset < -threshold && currentIndex < BLOCK_SLIDES.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else if (dragOffset > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }

    setDragOffset(0)
    // Small timeout to prevent the link from opening if user was dragging
    setTimeout(() => {
      hasDragged.current = false
    }, 60)
  }

  // Mouse event handlers
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Only left-click
    handleDragStart(e.clientX)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX)
  }

  const onMouseUp = () => {
    handleDragEnd()
  }

  const onMouseLeave = () => {
    if (isDragging) {
      handleDragEnd()
    }
  }

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX)
  }

  const onTouchEnd = () => {
    handleDragEnd()
  }

  const gapPx = 20

  return (
    <div className="relative w-full select-none">
      {/* ─── Architectural Header (Aligned inside 1024px container) ─── */}
      <div className="mx-auto mb-8 flex w-full max-w-[1024px] items-center justify-between border-b border-border px-4 pb-5 sm:px-6">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="font-serif text-sm font-medium text-pp-secondary italic">
            IV
          </span>
          <span className="text-[10px] font-medium tracking-widest text-foreground uppercase">
            PRODUCTION BLOCKS
          </span>
          <span className="text-[11px] text-muted-foreground">
            ({BLOCKS_DATA.length}+)
          </span>
          <span className="hidden text-muted-foreground/40 sm:inline">•</span>
          <span className="hidden font-mono text-[9px] text-muted-foreground sm:inline">
            HORIZONTAL SLIDE // CAD SCHEMATICS
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Interaction Mode Pill */}
          <div className="hidden items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 font-mono text-[9px] text-muted-foreground sm:flex">
            <span className="size-1.5 rounded-full bg-muted-foreground/60" />
            <span>DRAG // HORIZONTAL</span>
          </div>

          <a
            href="/ui/blocks"
            className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground transition hover:text-pp-secondary"
          >
            <span>All blocks</span>
            <span className="text-pp-secondary/80">→</span>
          </a>
        </div>
      </div>

      {/* ─── Slider Outer Container (Draggable) ─── */}
      <div
        className={cn(
          "relative w-full overflow-hidden py-2",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* ─── Sliding Track with Real-Time Drag Offset ─── */}
        <div
          className="flex items-stretch"
          style={{
            paddingLeft: "max(1rem, calc((100vw - 1024px) / 2 + 1rem))",
            paddingRight: "max(1rem, calc((100vw - 1024px) / 2 + 1rem))",
            gap: `${gapPx}px`,
            transform: `translateX(calc(-${currentIndex * (cardWidth + gapPx)}px + ${dragOffset}px))`,
            transition: isDragging
              ? "none"
              : "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {BLOCK_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex

            return (
              <div
                key={slide.id}
                ref={idx === 0 ? cardMeasureRef : undefined}
                className={cn(
                  "h-[360px] w-[86vw] shrink-0 transition-opacity duration-300 sm:h-[390px] sm:w-[480px] md:w-[560px] lg:w-[620px]",
                  isActive ? "opacity-100" : "opacity-60 hover:opacity-90"
                )}
              >
                {slide.category === "view-all" ? (
                  /* Slide 06: View All Blocks Showcase Card */
                  <SpotlightCard
                    enableTilt={!isDragging}
                    spotlightSize={360}
                    className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-2xl transition-all duration-300 hover:border-foreground/20"
                    contentClassName="h-full flex-col justify-between"
                  >
                    <Link
                      to="/ui/$collection"
                      params={{ collection: "blocks" }}
                      onClick={(e) => {
                        if (hasDragged.current) {
                          e.preventDefault()
                          e.stopPropagation()
                        }
                      }}
                      className="flex h-full w-full flex-col justify-between p-6 focus:outline-none sm:p-7"
                    >
                      {/* Top Header */}
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-pp-secondary select-none">
                            [{slide.index}]
                          </span>
                          <h3 className="font-mono text-sm font-bold tracking-widest text-foreground uppercase">
                            {slide.title}
                          </h3>
                        </div>
                        <span className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                          {slide.badge}
                        </span>
                      </div>

                      {/* Schematic Visual Canvas */}
                      <div className="pointer-events-none relative my-auto flex h-[210px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-background/80 p-4">
                        <StripedPattern className="opacity-20" />
                        <div className="relative z-10 space-y-3 text-center">
                          <span className="inline-block rounded-full border border-border bg-muted/50 px-3 py-1 font-mono text-[9px] tracking-wider text-muted-foreground">
                            {slide.count}+ PRODUCTION BLOCKS ACROSS CATEGORIES
                          </span>
                          <h4 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                            Explore Complete Blocks Directory
                          </h4>
                          <p className="mx-auto max-w-sm text-xs text-muted-foreground">
                            Interactive full-bleed layouts, games, marketing
                            hero sections, and auth flows.
                          </p>
                          <div className="pt-2">
                            <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/80 px-4 py-1.5 font-mono text-xs text-foreground transition-all group-hover:bg-foreground group-hover:text-background">
                              <span>Browse Full Directory</span>
                              <ArrowRight className="size-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Specs */}
                      <div className="relative z-10 flex items-center justify-between border-t border-border/60 pt-2 font-mono text-[9px] text-muted-foreground/80">
                        <span>REGISTRY INDEX // ARCHITECTURE</span>
                        <span>{slide.specsLabel}</span>
                      </div>
                    </Link>
                  </SpotlightCard>
                ) : (
                  /* Standard Blueprint CAD Category Card */
                  <SpotlightCard
                    enableTilt={!isDragging}
                    spotlightSize={360}
                    className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-2xl transition-all duration-300 hover:border-foreground/20"
                    contentClassName="h-full flex-col justify-between"
                  >
                    <Link
                      to="/ui/$collection"
                      params={{ collection: slide.category }}
                      onClick={(e) => {
                        if (hasDragged.current) {
                          e.preventDefault()
                          e.stopPropagation()
                        }
                      }}
                      className="flex h-full w-full flex-col justify-between p-6 focus:outline-none sm:p-7"
                    >
                      {/* Top Header */}
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-[11px] font-bold text-pp-secondary select-none">
                            [{slide.index}]
                          </span>
                          <h3 className="font-mono text-sm font-bold tracking-widest text-foreground uppercase transition-colors group-hover:text-pp-secondary">
                            {slide.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="rounded-full border border-border bg-muted/40 px-2 py-0.5 font-mono text-[9px] text-muted-foreground">
                            {slide.badge}
                          </span>
                          <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground transition group-hover:text-foreground">
                            <span>({slide.count})</span>
                            <ArrowUpRight className="size-3 text-muted-foreground transition group-hover:text-pp-secondary" />
                          </span>
                        </div>
                      </div>

                      {/* Middle Schematic CAD Blueprint Area */}
                      <div className="pointer-events-none relative my-auto flex h-[210px] w-full items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-background/80">
                        <SchematicWrapper
                          specsLabel={slide.specsLabel}
                          paddingPx={slide.paddingPx}
                          widthLabel={slide.widthLabel}
                          className="flex size-full items-center justify-center"
                        >
                          <RenderBlockCategorySchematic
                            category={slide.category}
                          />
                        </SchematicWrapper>
                      </div>

                      {/* Bottom Technical Bar */}
                      <div className="relative z-10 flex items-center justify-between border-t border-border/60 pt-2 font-mono text-[9px] text-muted-foreground/80">
                        <span className="max-w-[280px] truncate">
                          {slide.desc}
                        </span>
                        <span>{slide.specsLabel}</span>
                      </div>
                    </Link>
                  </SpotlightCard>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Bottom Controls: Prev Icon + Dots + Next Icon (Same row, pure icons, no border/bg) ─── */}
      <div className="flex items-center justify-center gap-4 pt-6 select-none">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="cursor-pointer p-1 text-muted-foreground transition hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground"
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-4 sm:size-5" />
        </button>

        <div className="flex items-center gap-2">
          {BLOCK_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`cursor-pointer transition-all duration-300 ${
                currentIndex === idx
                  ? "h-1.5 w-7 rounded-full bg-foreground shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                  : "size-1.5 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
              aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentIndex === BLOCK_SLIDES.length - 1}
          className="cursor-pointer p-1 text-muted-foreground transition hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground"
          aria-label="Next slide"
        >
          <ChevronRight className="size-4 sm:size-5" />
        </button>
      </div>
    </div>
  )
}
