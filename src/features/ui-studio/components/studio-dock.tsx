import { DotsSixIcon } from "@phosphor-icons/react"
import { play } from "cuelume"
import { motion } from "motion/react"

import { cn } from "@/shared/lib/utils"

import type { StudioItem } from "../model/types"
import { useStudioStore } from "../store/studio-store"

interface StudioDockProps {
  item: StudioItem | null
}

/**
 * Floating variant selector pill at the bottom-center of the preview stage.
 * Separated cleanly from primary header actions and rendered ONLY when
 * the staged item exposes two or more variants (or variant tabs).
 */
export function StudioVariantBar({ item }: StudioDockProps) {
  const storedVariantId = useStudioStore((state) => state.activeVariantId)
  const setActiveVariantId = useStudioStore((state) => state.setActiveVariantId)

  const variants = item?.variants ?? []
  if (!item || variants.length === 0) return null

  const activeVariant =
    variants.find((variant) => variant.id === storedVariantId) ??
    variants[0] ??
    null

  return (
    <div className="pointer-events-none absolute bottom-3.5 left-1/2 z-20 max-w-[calc(100%-1.5rem)] -translate-x-1/2 sm:bottom-4">
      <div
        role="tablist"
        aria-label="Component variants"
        className="pointer-events-auto no-scrollbar flex items-center gap-1 overflow-x-auto rounded-lg border border-border/60 bg-background/90 p-1 shadow-xs backdrop-blur-md"
      >
        <span
          aria-hidden="true"
          className="inline-flex size-8 shrink-0 items-center justify-center text-muted-foreground/50"
        >
          <DotsSixIcon size={16} aria-hidden="true" />
        </span>

        {variants.map((variant) => {
          const isActive = variant.id === activeVariant?.id
          return (
            <button
              key={variant.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                play("tap", { emphasis: "subtle" })
                setActiveVariantId(variant.id)
              }}
              className={cn(
                "relative shrink-0 cursor-pointer rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-primary",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="studio-variant-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-lg bg-muted shadow-2xs"
                />
              ) : null}
              <span className="relative z-10">{variant.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export const StudioDock = StudioVariantBar
