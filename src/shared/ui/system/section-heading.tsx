import React from "react"

import { cn } from "@/shared/lib/utils"

import { StripedPattern } from "./striped-pattern"

/* ─────────────────────────────────────────────────────────────────────────────
 * SectionHeading
 *
 * A minimal, standardised blueprint heading block used at the top of sections.
 * Displays title, optional count, expanding striped space, and action slot.
 *
 * Visual anatomy:
 *
 *   ┌──────────────────────────────────────────────────────────────────────────┐
 *   │ Projects (6)  ───────────── [Striped Pattern] ──────────  [ View all → ] │
 *   └──────────────────────────────────────────────────────────────────────────┘
 * ─────────────────────────────────────────────────────────────────────────────
 */

type SectionHeadingProps = {
  /** Main heading text e.g. "Projects" */
  heading: string
  /** Optional count badge rendered inline e.g. "(6)" */
  count?: string | number
  /** @deprecated Label removed in favor of clean title */
  label?: string
  /** @deprecated Subtitle removed in favor of compact blueprint header design */
  subtitle?: string
  /** Extra slot rendered to the right of the heading block (e.g. a CTA button) */
  action?: React.ReactNode
  /** Additional className forwarded to the root wrapper */
  className?: string
  /** HTML element used for the heading — defaults to h2 */
  as?: "h1" | "h2" | "h3"
  /**
   * Section anchor ID — used by TOCMinimap (IntersectionObserver) and
   * any scroll-to navigation links (e.g. banner hero menu, mobile dock).
   * Should match the `url` field in TOCItems (without the leading #).
   * Example: id="about" → TOCItem url="#about"
   */
  id?: string
}

export function SectionHeading({
  heading,
  count,
  action,
  className,
  as: Tag = "h2",
  id,
}: SectionHeadingProps) {
  return (
    <div
      id={id}
      className={cn(
        "relative flex w-full items-center justify-between gap-4 overflow-hidden px-4 py-4 sm:px-6 md:px-8",
        className
      )}
    >
      {/* Full Absolute Blueprint Striped Background Pattern */}
      <StripedPattern
        variant="absolute"
        className="opacity-60 dark:opacity-30"
      />

      {/* ── Left info: Heading + Count ── */}
      <div className="relative z-10 flex shrink-0 items-center gap-2">
        <Tag className="flex items-center gap-2 text-base font-bold tracking-tight text-foreground sm:text-lg md:text-xl">
          <span>{heading}</span>
          {count !== undefined && (
            <span className="text-xs font-normal text-muted-foreground/60">
              ({count})
            </span>
          )}
        </Tag>
      </div>

      {/* ── Right action slot ── */}
      {action && <div className="relative z-10 shrink-0">{action}</div>}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
 * SectionDivider
 *
 * The slim horizontal rule with the title on the left and full absolute striped pattern.
 *
 *   About ────────────────────────────────────────────────
 * ─────────────────────────────────────────────────────────────────────────────
 */

type SectionDividerProps = {
  label: string
  className?: string
}

export function SectionDivider({ label, className }: SectionDividerProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-between overflow-hidden px-4 py-2.5 sm:px-6",
        className
      )}
    >
      <StripedPattern
        variant="absolute"
        className="opacity-50 dark:opacity-25"
      />
      <span className="relative z-10 text-sm font-semibold tracking-tight text-foreground sm:text-base">
        {label}
      </span>
    </div>
  )
}
