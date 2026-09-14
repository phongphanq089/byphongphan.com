import { Link, useRouterState } from "@tanstack/react-router"
import { ArrowLeft, Boxes } from "lucide-react"
import React from "react"

import { GridContainer } from "@/app/layouts"
import { cn } from "@/shared/lib/utils"
import { Badge, Button } from "@/shared/ui/core"
import {
  UnboxingBucket,
  type UnboxingChipItem,
} from "@/shared/ui/system/unboxing-bucket"

export interface UnderConstructionDestination {
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

export interface UnderConstructionBlockProps {
  /** Name of the module/page currently being built (e.g., "Technical Blog & Articles") */
  moduleName?: string
  /** Technical badge code displayed at the top (e.g., "MODULE_STATUS_202") */
  moduleBadge?: string
  /** Main headline title */
  title?: string
  /** Detailed explanatory description */
  description?: string
  /** Primary call-to-action button */
  primaryCta?: {
    label: string
    href: string
    icon?: React.ComponentType<{ className?: string }>
  }
  /** Secondary action button */
  secondaryCta?: {
    label: string
    href?: string
    onClick?: () => void
    icon?: React.ComponentType<{ className?: string }>
  }
  /** Metadata bar under title similar to Admin inspector bar */
  inspectInfo?: {
    label: string
    value: string
    badge?: string
  }
  /** Custom list of feature chips to unbox */
  chips?: UnboxingChipItem[]
  /** Custom additional wrapper className */
  className?: string
}

export function UnderConstructionBlock({
  moduleName = "Technical Module",
  moduleBadge = "MODULE_STATUS_202",
  title,
  description,
  primaryCta,
  secondaryCta,
  inspectInfo,
  chips,
  className,
}: UnderConstructionBlockProps) {
  const router = useRouterState()
  const currentPath = router.location.pathname

  const PrimaryIcon = primaryCta?.icon ?? Boxes
  const SecondaryIcon = secondaryCta?.icon ?? ArrowLeft
  const hasActions = Boolean(primaryCta || secondaryCta)

  return (
    <div className={cn("w-full", className)}>
      <GridContainer
        borderTop
        borderBottom
        showCrosshairs
        className="relative overflow-hidden px-4 py-12 sm:px-8 sm:py-16 md:py-20"
      >
        <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center">
          {/* Main Status Glassmorphism Card */}
          <div className="w-full p-6 text-center sm:p-10">
            {/* ─── 3D Isometric Unboxing Centerpiece ─── */}
            <UnboxingBucket chips={chips} className="-mt-2 mb-6 sm:mb-8" />

            {/* Status Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge
                variant="outline"
                className="rounded-md border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-primary"
              >
                {moduleBadge}
              </Badge>
              <Badge
                variant="outline"
                className="rounded-md border-border/80 bg-background/50 px-2 py-0.5 font-mono text-xs text-muted-foreground"
              >
                COMING_SOON
              </Badge>
            </div>

            {title && (
              <h1 className="mt-3 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                {title}
              </h1>
            )}

            {description && (
              <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}

            {/* Inspector Telemetry Bar */}
            <div className="mt-6 flex flex-col items-stretch justify-between gap-2.5 rounded-xl border border-border/70 bg-muted/35 px-4 py-2.5 text-left font-mono text-xs sm:flex-row sm:items-center">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  {inspectInfo?.label ?? "Target Module"}
                </span>
                <span className="truncate font-semibold text-foreground">
                  {inspectInfo?.value ?? moduleName}
                </span>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <span className="truncate text-[11px] text-muted-foreground">
                  {currentPath}
                </span>
                <Badge
                  variant="outline"
                  className="shrink-0 rounded-md border-border/80 bg-background/70 px-2 py-0 text-[10px] font-medium text-primary"
                >
                  {inspectInfo?.badge ?? "Work in progress"}
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            {hasActions && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {primaryCta?.href && (
                  <Button
                    asChild
                    size="default"
                    className="h-10 gap-2 rounded-xl px-5 text-xs font-semibold shadow-xs"
                  >
                    <Link to={primaryCta.href}>
                      <PrimaryIcon className="size-4" />
                      <span>{primaryCta.label}</span>
                    </Link>
                  </Button>
                )}

                {secondaryCta?.href ? (
                  <Button
                    asChild
                    variant="outline"
                    size="default"
                    className="h-10 gap-2 rounded-xl border-border/80 bg-background/60 px-5 text-xs font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  >
                    <Link to={secondaryCta.href}>
                      <SecondaryIcon className="size-4" />
                      <span>{secondaryCta.label}</span>
                    </Link>
                  </Button>
                ) : secondaryCta?.onClick ? (
                  <Button
                    variant="outline"
                    size="default"
                    onClick={secondaryCta.onClick}
                    className="h-10 gap-2 rounded-xl border-border/80 bg-background/60 px-5 text-xs font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  >
                    <SecondaryIcon className="size-4" />
                    <span>{secondaryCta.label}</span>
                  </Button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </GridContainer>
    </div>
  )
}
