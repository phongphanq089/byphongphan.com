import React from "react"

import { GridContainer } from "@/app/layouts"
import { cn } from "@/shared/lib/utils"
export interface PageHeroBadge {
  label: string
  icon?: React.ReactNode
  pulsingDot?: boolean
}

export interface PageHeroStat {
  label: string
  highlight?: boolean
  hideOnMobile?: boolean
}

export interface PageHeroProps {
  /** Small category/badge indicator above title */
  badge?: string | PageHeroBadge | React.ReactNode
  /** Count pill displayed next to badge e.g. "26 RESOURCES" or 26 */
  count?: string | number
  /** Icon displayed inside the count pill */
  countIcon?: React.ReactNode
  /** Main heading */
  title: string
  /** Short description below title */
  description?: string
  /** Sub-bar stats / blueprint chips displayed in a border-bottom bar */
  stats?: PageHeroStat[]
  /** Extra slot for custom actions or widgets */
  children?: React.ReactNode
  /** Additional className for the hero GridContainer */
  className?: string
}

export function PageHero({
  badge,
  count,
  countIcon,
  title,
  description,
  children,
  className,
}: PageHeroProps) {
  return (
    <>
      {/* 1. Main Hero Container */}
      <GridContainer
        borderTop
        borderBottom
        showCrosshairs
        className={cn(
          "relative flex flex-col justify-center overflow-hidden px-4 py-8 sm:px-8 sm:py-10 md:py-12",
          className
        )}
      >
        <div className="relative z-10 flex flex-col gap-2.5">
          {(badge || count !== undefined) && (
            <div className="flex flex-wrap items-center gap-2">
              {badge && (
                <>
                  {typeof badge === "string" ? (
                    <span className="text-xs font-semibold text-muted-foreground/80 sm:text-sm">
                      {badge}
                    </span>
                  ) : React.isValidElement(badge) ? (
                    badge
                  ) : typeof badge === "object" && "label" in badge ? (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-pp-primary uppercase">
                      {badge.pulsingDot && (
                        <span className="size-1.5 animate-pulse rounded-full bg-pp-primary" />
                      )}
                      {badge.icon}
                      {badge.label}
                    </span>
                  ) : null}
                </>
              )}

              {count !== undefined && (
                <span className="flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {countIcon}
                  <span>{count}</span>
                </span>
              )}
            </div>
          )}

          {/* Large Main Heading */}
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
            {title}
          </h1>

          {/* Optional Description */}
          {description && (
            <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {description}
            </p>
          )}

          {children}
        </div>
      </GridContainer>
    </>
  )
}
