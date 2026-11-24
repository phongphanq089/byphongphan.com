/* eslint-disable react-hooks/set-state-in-effect */
import { ArrowRightIcon } from "@phosphor-icons/react"
import { Link } from "@tanstack/react-router"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
import React, { useCallback, useEffect, useState } from "react"

import { BLOCKS_DATA } from "@/features/blocks/blocks-data"
import { RenderBlockCategorySchematic } from "@/features/blocks/components/schematics"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/registry/ui/carousel"
import type { BlockCategoryId } from "@/shared/config"
import { playClickSound, playHoverSound } from "@/shared/lib/sound"
import { cn } from "@/shared/lib/utils"
import TextBurnNeon from "@/shared/ui/animation/text-burn-neon"
import UnderlineToBackground from "@/shared/ui/animation/underline-to-background"
import { SpotlightCard } from "@/shared/ui/core"
import { SchematicWrapper } from "@/shared/ui/system"

type BlockSlideCategory = BlockCategoryId

interface BlockSlideItem {
  id: string
  index: string
  title: string
  category: BlockSlideCategory
  count: number
  specsLabel: string
  paddingPx: number
  badge: string
  desc: string
  widthLabel: string
}

/**
 * Slide configuration representing the Production Block categories.
 * Each slide features technical CAD schematics with 9-slice grid and dimension rulers.
 */
const BLOCK_SLIDES: BlockSlideItem[] = [
  {
    id: "marketing",
    index: "01",
    title: "MARKETING",
    category: "marketing",
    count: BLOCKS_DATA.filter((b) => b.category === "marketing").length,
    specsLabel: "p16 - r8 - hero & metrics",
    paddingPx: 16,
    badge: "ALIGNED",
    desc: "Hero & metrics sections for high-conversion landing pages",
    widthLabel: "w-full - max 280",
  },
  {
    id: "404-page",
    index: "02",
    title: "404 PAGE",
    category: "404-page",
    count: BLOCKS_DATA.filter((b) => b.category === "404-page").length,
    specsLabel: "p14 - r6 - 2d physics game",
    paddingPx: 14,
    badge: "BLEED",
    desc: "Playable 2D physics game & gravity canvas error screens",
    widthLabel: "w-full - max 280",
  },
  {
    id: "auth",
    index: "03",
    title: "AUTH",
    category: "auth",
    count: BLOCKS_DATA.filter((b) => b.category === "auth").length,
    specsLabel: "p16 - r8 - form & input",
    paddingPx: 16,
    badge: "COLUMN",
    desc: "Authentication screens, login modals, and form inputs",
    widthLabel: "w-full - max 280",
  },
  {
    id: "ecommerce",
    index: "04",
    title: "E-COMMERCE",
    category: "ecommerce",
    count: BLOCKS_DATA.filter((b) => b.category === "ecommerce").length,
    specsLabel: "p16 - r8 - store & checkout",
    paddingPx: 16,
    badge: "WRAPPER",
    desc: "Storefronts, cart drawers, and product showcase cards",
    widthLabel: "w-full - max 280",
  },
  {
    id: "application",
    index: "05",
    title: "APPLICATION",
    category: "application",
    count: BLOCKS_DATA.filter((b) => b.category === "application").length,
    specsLabel: "p16 - r8 - console & app",
    paddingPx: 16,
    badge: "DASHBOARD",
    desc: "Application consoles, telemetry docks, and settings panels",
    widthLabel: "w-full - max 280",
  },
]

export interface SectionBlocksProps {
  className?: string
}

/**
 * Section IV: Production Blocks Horizontal Slider Showcase
 *
 * Implements a high-craft architectural carousel using embla-carousel-react:
 * - Aligned with the 1024px content column on the left
 * - Bleeds out to the right edge of the screen
 * - Native smooth drag, momentum panning, and keyboard navigation
 * - Interactive prev/next icon buttons and dot pagination
 * - Tactile sound integration on hover and navigation clicks
 */
export function SectionBlocks({ className }: SectionBlocksProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) return
    setCurrentIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on("reInit", onSelect)
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api, onSelect])

  const handlePrev = () => {
    playClickSound()
    api?.scrollPrev()
  }

  const handleNext = () => {
    playClickSound()
    api?.scrollNext()
  }

  const handleDotClick = (idx: number) => {
    playClickSound()
    api?.scrollTo(idx)
  }

  return (
    <section
      id="blocks"
      data-section="blocks"
      className={cn(
        "relative z-10 w-full overflow-hidden border-b border-border py-8 select-none",
        className
      )}
    >
      {/* ─── Architectural Header (Full-width border-b) ─── */}
      <div className="w-full border-b border-border pb-5 md:mb-8">
        <div className="mx-auto flex w-full max-w-[1024px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="font-serif text-lg font-medium text-pp-secondary italic">
              IV
            </span>
            <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
              <TextBurnNeon>PRODUCTION BLOCKS</TextBurnNeon>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/ui/$collection"
              params={{ collection: "blocks" }}
              onMouseEnter={() => playHoverSound()}
              onClick={() => playClickSound()}
            >
              <UnderlineToBackground
                targetTextColor="var(--background)"
                className="font-medium whitespace-nowrap text-foreground/80 transition-colors group-hover:text-foreground"
              >
                <span className="flex items-center gap-2">
                  All block
                  <ArrowRightIcon size={18} />
                </span>
              </UnderlineToBackground>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Carousel Outer Container (Bleed off right edge) ─── */}
      <Carousel
        opts={{
          align: "start",
          loop: false,
          dragFree: false,
          containScroll: "trimSnaps",
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent
          className="ml-0 items-stretch py-5 md:py-10"
          style={{
            paddingLeft: "max(1rem, calc((100vw - 1024px) / 2 + 1rem))",
            paddingRight: "max(1rem, calc((100vw - 1024px) / 2 + 1rem))",
          }}
        >
          {BLOCK_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex

            return (
              <CarouselItem
                key={slide.id}
                className={cn(
                  "h-[400px] w-[74vw] shrink-0 basis-auto pl-4 transition-opacity duration-300 xs:w-[72vw] sm:h-[460px] sm:w-[440px] sm:pl-5 md:w-[480px] lg:w-[520px]",
                  isActive ? "opacity-100" : "opacity-60 hover:opacity-90"
                )}
              >
                <SpotlightCard
                  spotlightSize={360}
                  className="group relative flex h-full w-full"
                  contentClassName="h-full flex-col justify-between"
                >
                  <Link
                    to="/ui/$collection"
                    params={{ collection: slide.category }}
                    onMouseEnter={() => playHoverSound()}
                    onClick={() => playClickSound()}
                    className="flex h-full w-full flex-col justify-between p-4 focus:outline-none sm:p-7"
                  >
                    {/* Top Header */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[11px] font-bold text-pp-secondary select-none">
                          [{slide.index}]
                        </span>
                        <h3 className="font-mono text-sm font-bold tracking-widest text-foreground uppercase group-hover:text-pp-secondary">
                          {slide.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground group-hover:text-foreground">
                          <span>({slide.count})</span>
                          <ArrowUpRight className="size-3 text-muted-foreground group-hover:text-pp-secondary" />
                        </span>
                      </div>
                    </div>

                    {/* Middle Schematic CAD Blueprint Area */}
                    <div className="pointer-events-none relative my-auto flex h-[250px] w-full items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-background/80 sm:h-[300px]">
                      <SchematicWrapper
                        specsLabel={slide.specsLabel}
                        paddingPx={slide.paddingPx}
                        widthLabel={slide.widthLabel}
                        contentClassName="w-auto flex flex-col items-center"
                        className="flex items-center justify-center py-2"
                      >
                        <RenderBlockCategorySchematic
                          category={slide.category}
                        />
                      </SchematicWrapper>
                    </div>
                  </Link>
                </SpotlightCard>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>

      {/* ─── Bottom Controls: Prev Icon + Dots + Next Icon ─── */}
      <div className="flex items-center justify-center gap-4 pt-6 select-none">
        <button
          type="button"
          onClick={handlePrev}
          disabled={!canScrollPrev}
          onMouseEnter={() => playHoverSound()}
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
              onClick={() => handleDotClick(idx)}
              onMouseEnter={() => playHoverSound()}
              className={cn(
                "cursor-pointer transition-all duration-300",
                currentIndex === idx
                  ? "h-1.5 w-7 rounded-full bg-foreground shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                  : "size-1.5 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/60"
              )}
              aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={!canScrollNext}
          onMouseEnter={() => playHoverSound()}
          className="cursor-pointer p-1 text-muted-foreground transition hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground"
          aria-label="Next slide"
        >
          <ChevronRight className="size-4 sm:size-5" />
        </button>
      </div>
    </section>
  )
}

export default SectionBlocks
