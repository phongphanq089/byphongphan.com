import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"
import React from "react"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/core/button"

import TextBurnNeon from "../animation/text-burn-neon"
import { StripedPattern } from "./striped-pattern"

/* ─────────────────────────────────────────────────────────────────────────────
 * SectionHeading
 *
 * An architectural blueprint heading block integrated with the GridContainer.
 * Displays title, optional index, optional count badge, striped blueprint pattern,
 * and a synchronized full-height right grid cell for the action button.
 *
 * Visual anatomy:
 *
 *   ┌─────────────────────────────────────────────────────────┬──────────────────────┐
 *   │ [01] Projects (6)       ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ View all projects  → │
 *   └─────────────────────────────────────────────────────────┴──────────────────────┘
 * ─────────────────────────────────────────────────────────────────────────────
 */

type SectionHeadingProps = {
  /** Main heading text e.g. "Projects" */
  heading: string
  /** Optional count badge rendered inline e.g. "(6)" */
  count?: string | number
  /** Optional technical section index e.g. "01" */
  index?: string
  /** @deprecated Label removed in favor of clean title */
  label?: string
  /** @deprecated Subtitle removed in favor of compact blueprint header design */
  subtitle?: string
  /** Custom action slot rendered inside the right grid cell */
  action?: React.ReactNode
  /** Convenience prop: URL for the action link (e.g. "/blocks") */
  actionHref?: string
  /** Convenience prop: Label for the action link (e.g. "View all blocks") */
  actionLabel?: string
  /** Additional className forwarded to the root wrapper */
  className?: string
  /** HTML element used for the heading — defaults to h2 */
  as?: "h1" | "h2" | "h3"
  /**
   * Section anchor ID — used by TOCMinimap (IntersectionObserver) and
   * any scroll-to navigation links.
   * Should match the `url` field in TOCItems (without the leading #).
   * Example: id="about" → TOCItem url="#about"
   */
  id?: string
}

export function SectionHeading({
  heading,
  count,
  index,
  action,
  actionHref,
  actionLabel,
  className,
  as: Tag = "h2",
  id,
}: SectionHeadingProps) {
  const hasAction = Boolean(action || (actionHref && actionLabel))

  return (
    <div
      id={id}
      className={cn(
        "group/heading relative flex w-full items-stretch justify-between overflow-hidden",
        className
      )}
    >
      {/* ── Left main area: Title + Index + Count + Striped Blueprint Pattern ── */}
      <div className="relative flex flex-1 items-center gap-3 overflow-hidden px-4 py-3 sm:px-6 md:px-8">
        {/* Full Absolute Blueprint Striped Background Pattern in Left Area */}
        <StripedPattern
          variant="absolute"
          className="opacity-60 dark:opacity-30"
        />

        <div className="relative z-10 flex items-center gap-2.5">
          {index && (
            <span className="font-mono text-xs text-muted-foreground/60 select-none">
              [{index}]
            </span>
          )}

          <Tag className="flex items-center gap-2 text-sm font-medium tracking-tight text-foreground sm:text-lg">
            <h2 className="uppercase">
              <TextBurnNeon>{heading}</TextBurnNeon>
            </h2>

            {count !== undefined && (
              <span className="font-mono text-xs font-normal text-muted-foreground/70">
                ({count})
              </span>
            )}
          </Tag>
        </div>
      </div>

      {/* ── Right Action Cell: Full-Height Grid Cell with vertical border divider ── */}
      {hasAction && (
        <div className="relative z-10 flex shrink-0 items-stretch border-l border-border bg-background/50 backdrop-blur-xs">
          {action ? (
            action
          ) : actionHref && actionLabel ? (
            <Button
              variant="ghost"
              className="group/btn h-full rounded-none border-0 px-3.5 py-3 font-mono text-[11px] font-medium text-foreground transition-all duration-200 hover:bg-accent/60 hover:text-foreground active:bg-accent sm:px-6 sm:text-xs"
              asChild
            >
              <Link to={actionHref}>
                <span>{actionLabel}</span>
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          ) : null}
        </div>
      )}
    </div>
  )
}
