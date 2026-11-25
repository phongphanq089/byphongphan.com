import { useInView } from "motion/react"
import { lazy, Suspense, useRef } from "react"

import { DraftingSectionRow } from "@/app/layouts/drafting-section-row"
import { cn } from "@/shared/lib/utils"

const LazyMapVietnamese = lazy(() => import("./map"))

function MapPlaceholder() {
  return (
    <div
      aria-label="Loading Vietnam map"
      className="w-full border-y border-border/70 bg-transparent"
    >
      <div className="flex items-center justify-between border-b border-border/60 py-2.5 pl-2">
        <span className="font-mono text-[10px] text-muted-foreground">
          Ninh Hoà, Vietnam • 12.49°N, 109.13°E
        </span>
      </div>
      <div className="relative flex h-[280px] w-full flex-col items-center justify-center gap-2 sm:h-[320px]">
        <span className="font-mono text-[10px] tracking-wider text-muted-foreground/60 uppercase">
          Initializing spatial canvas...
        </span>
      </div>
    </div>
  )
}

export interface SectionLocationProps {
  className?: string
}

/**
 * Section VIII: Location (Vietnam) & Philosophy Quote + Signature
 *
 * Fully integrated into the 1024px Swiss Drafting Architecture:
 * - Roman Numeral: VIII
 * - Title: LOCATION
 * - Viewport-deferred MapLibre GL map centered on Ninh Hoà, Khánh Hoà, Vietnam
 * - Craft philosophy quote card
 * - SIGNED flourish with tactile glowing blue signature
 */
export function SectionLocation({ className }: SectionLocationProps) {
  const mapStageRef = useRef<HTMLDivElement>(null)
  const isMapInView = useInView(mapStageRef, {
    once: true,
    margin: "300px 0px",
  })

  return (
    <DraftingSectionRow
      id="vietnam-map"
      romanIndex="VIII"
      title="LOCATION"
      className={cn("pb-8 lg:pb-12", className)}
    >
      <div className="w-full space-y-4">
        {/* 1. Interactive Vietnam Map (lazy-loaded near viewport) */}
        <div ref={mapStageRef}>
          {isMapInView ? (
            <Suspense fallback={<MapPlaceholder />}>
              <LazyMapVietnamese />
            </Suspense>
          ) : (
            <MapPlaceholder />
          )}
        </div>

        <div className="relative px-3">
          <div className="flex items-start gap-3">
            <span className="-mt-0.5 shrink-0 font-serif text-2xl leading-none font-normal text-pp-secondary italic select-none">
              &ldquo;
            </span>
            <div className="space-y-1.5">
              <p className="font-serif text-xs leading-relaxed tracking-wide text-foreground/90 italic sm:text-[13px]">
                Before you can be great, you must first be good. Before being
                good, you must accept being bad. And before being bad, you must
                allow yourself to start.
              </p>
            </div>
          </div>
        </div>

        {/* 3. SIGNED Flourish (SIGNED + Blue Signature) */}
        <div className="flex items-center justify-end gap-5 pt-10 pb-2 select-none sm:pt-14 sm:pb-4">
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground/60 uppercase">
            SIGNED
          </span>
          <div className="w-16 border-b border-border sm:w-20" />

          <div className="text-pp-secondary transition-colors hover:brightness-110">
            <svg
              className="h-10 w-28 overflow-visible sm:h-12 sm:w-34"
              viewBox="0 0 160 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Signature"
            >
              <path
                d="M 12 38 C 15 20, 25 8, 32 10 C 38 12, 34 32, 28 42 C 25 47, 20 48, 18 42 C 16 34, 22 18, 38 22 C 48 24, 46 36, 52 36 C 58 36, 62 26, 68 24 C 74 22, 78 30, 84 30 C 90 30, 94 20, 102 20 C 110 20, 114 34, 122 34 C 130 34, 138 18, 148 16 C 154 15, 156 22, 152 26"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_8px_var(--pp-secondary-glow)]"
              />
              <path
                d="M 22 24 C 42 22, 75 25, 110 22"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="opacity-70"
              />
            </svg>
          </div>
        </div>
      </div>
    </DraftingSectionRow>
  )
}

export default SectionLocation
