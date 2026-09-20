import { Inbox } from "lucide-react"
import React from "react"

import { cn } from "@/shared/lib/utils"
import { CardCanvas, GlowCard } from "@/shared/ui/animation/animated-glow-card"

import { StripedPattern } from "./striped-pattern"

/* ─────────────────────────────────────────────────────────────────────────────
 * SectionEmptyState
 *
 * Standardised empty state and placeholder cell for subpage catalogs and grids.
 * Powered by Animated Glow Card Canvas with precision corner crosshairs,
 * mouse-tracking radial spotlight, and blueprint patterns.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface SectionEmptyStateProps {
  /** Main heading */
  title?: string
  /** Supporting description */
  subtitle?: string
  description?: string
  /** Custom icon or graphic */
  icon?: React.ReactNode
  /** Monospace badge above title */
  badge?: string
  /** CTA Action button or slot */
  action?: React.ReactNode
  /** Display variant: "page" (full catalog empty), "cell" (single placeholder cell), "card" */
  variant?: "page" | "cell" | "card"
  /** Custom className */
  className?: string
  /** Whether to show corner crosshairs */
  showCrosshairs?: boolean
  /** Whether to show blueprint striped pattern background */
  withStripes?: boolean
}

export function SectionEmptyState({
  title = "No items found",
  subtitle,
  description,
  icon,
  badge,
  action,
  variant = "page",
  className,
  showCrosshairs = true,
  withStripes = true,
}: SectionEmptyStateProps) {
  const descText = description || subtitle

  if (variant === "cell") {
    return (
      <CardCanvas className="h-full w-full">
        <GlowCard
          showCrosshairs={showCrosshairs}
          className={cn("h-full min-h-[220px] w-full", className)}
          contentClassName="p-6 flex flex-col items-center justify-center text-center relative"
        >
          {withStripes && (
            <StripedPattern
              variant="absolute"
              size={12}
              className="opacity-40 dark:opacity-20"
            />
          )}

          <div className="relative z-10 flex w-full flex-col items-center justify-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-muted-foreground/60 shadow-xs">
              {icon || <Inbox className="size-4" />}
            </div>
            <span className="text-[11px] font-medium tracking-wider text-muted-foreground/70 uppercase">
              {title}
            </span>
            {descText && (
              <p className="max-w-[220px] text-[11px] text-muted-foreground/50">
                {descText}
              </p>
            )}
            {action && <div className="mt-2">{action}</div>}
          </div>
        </GlowCard>
      </CardCanvas>
    )
  }

  return (
    <CardCanvas className="w-full">
      <GlowCard
        showCrosshairs={showCrosshairs}
        className={cn("min-h-[280px] w-full sm:min-h-[340px]", className)}
        contentClassName="px-6 py-12 sm:px-8 sm:py-16 flex flex-col items-center justify-center text-center relative"
      >
        {withStripes && (
          <StripedPattern
            variant="absolute"
            size={10}
            className="opacity-50 dark:opacity-25"
          />
        )}

        <div className="relative z-10 flex w-full max-w-md flex-col items-center justify-center text-center">
          {/* Icon Badge */}
          <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-border/80 bg-muted/50 text-pp-primary shadow-xs backdrop-blur-md">
            {icon || <Inbox className="size-6" />}
          </div>

          {/* Optional Monospace Badge */}
          {badge && (
            <span className="mb-2 text-[10px] font-semibold tracking-widest text-pp-primary/80 uppercase">
              {badge}
            </span>
          )}

          {/* Heading */}
          <h3 className="text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
            {title}
          </h3>

          {/* Subtitle / Description */}
          {descText && (
            <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {descText}
            </p>
          )}

          {/* Action Slot */}
          {action && (
            <div className="mt-6 flex items-center justify-center gap-3">
              {action}
            </div>
          )}
        </div>
      </GlowCard>
    </CardCanvas>
  )
}
