import { ArrowUpRightIcon } from "@phosphor-icons/react"
import { Link, useNavigate } from "@tanstack/react-router"
import { AnimatePresence, motion, useInView } from "motion/react"
import React, { useRef } from "react"

import { playClickSound, playHoverSound } from "@/shared/lib/sound"
import { cn } from "@/shared/lib/utils"

import type { LazyShowcaseCardProps } from "../types"
import { ShowcaseLiveComponent } from "./showcase-live-component"

export function LazyShowcaseCard({ item, className }: LazyShowcaseCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  // Lazy loading: triggers 250px before reaching viewport for zero stutter
  const isInView = useInView(containerRef, { once: true, margin: "250px 0px" })

  const handleCardClick = () => {
    playClickSound()
    navigate({
      to: "/ui/$collection/$slug",
      params: { collection: item.category, slug: item.slug },
    })
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => playHoverSound()}
      onClick={handleCardClick}
      className={cn(
        "group relative flex w-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl bg-muted p-3 backdrop-blur-md select-none hover:border",
        item.gridPlacementClass,
        "2xl:h-full 2xl:min-h-0",
        className
      )}
    >
      {/* ─── CAD Blueprint Micro-Dot Matrix Background ─── */}

      <div className="relative z-20 flex shrink-0 items-center justify-between bg-muted px-3 py-2 backdrop-blur-xs sm:px-3.5 sm:py-2.5">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          {item.index && (
            <span className="shrink-0 font-mono text-[10px] font-semibold text-muted-foreground/50">
              [{item.index}]
            </span>
          )}
          <h3 className="truncate text-xs font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-sm">
            {item.title}
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 font-mono">
          <Link
            to="/ui/$collection/$slug"
            params={{ collection: item.category, slug: item.slug }}
            onClick={(e) => {
              e.stopPropagation()
              playClickSound()
            }}
            title={`Explore ${item.title}`}
            className="flex size-6 items-center justify-center text-muted-foreground shadow-xs active:scale-95"
          >
            <ArrowUpRightIcon
              className="size-5 transition-transform duration-200"
              weight="bold"
            />
          </Link>
        </div>
      </div>

      {/* ─── 2. Center Stage: Interactive Live Component Preview or CAD Radar Loader ─── */}
      <div className="relative z-10 flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-background p-2.5 sm:p-3.5">
        <AnimatePresence mode="wait">
          {isInView ? (
            <motion.div
              key="live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex h-full min-h-[300px] w-full items-center justify-center px-4 py-10"
            >
              <ShowcaseLiveComponent slug={item.slug} />
            </motion.div>
          ) : (
            <motion.div
              key="loading"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 select-none"
            >
              {/* Precision CAD Radar Dial */}
              <div className="relative flex size-7 items-center justify-center">
                {/* Outer concentric subtle dashed ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-border/70 opacity-60" />

                {/* Rotating precision scanner ring */}
                <div className="absolute inset-0.5 animate-spin rounded-full border border-primary/20 border-t-primary [animation-duration:1.2s]" />

                {/* Center glowing micro sensor dot */}
                <div className="size-1.5 animate-pulse rounded-full bg-primary/90 shadow-[0_0_8px_var(--color-primary)]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default LazyShowcaseCard
