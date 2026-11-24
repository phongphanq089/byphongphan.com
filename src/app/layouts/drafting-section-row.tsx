import React from "react"

import { cn } from "@/shared/lib/utils"
import TextBurnNeon from "@/shared/ui/animation/text-burn-neon"

export interface DraftingSectionRowProps {
  /**
   * Unique section HTML ID matching TOC anchors (e.g. "about", "tech-stack", "components-ui")
   */
  id: string

  /**
   * Roman numeral identifier (e.g. "I", "II", "III", "IV")
   */
  romanIndex: string

  /**
   * Section title in uppercase font-mono (e.g. "ABOUT", "TECH STACK", "COMPONENTS")
   */
  title: string

  /**
   * Optional left rail slot content (e.g. PPPixelMark badge on Section I, or custom plate label)
   */
  leftSlot?: React.ReactNode

  /**
   * Main center column content (constrained to 528px max width aligning with spine hairlines)
   */
  children: React.ReactNode

  /**
   * Additional className for the outer row container
   */
  className?: string

  /**
   * Additional className for the center content column
   */
  contentClassName?: string
}

/**
 * Reusable Architectural Drafting Section Row Primitive
 *
 * Implements the 1024px 5-track layout standard:
 * - Track 1: Left column (224px wide) for section ID & plate badges
 * - Track 2: Gutter channel (48px wide) aligning with spine lines 224px - 272px
 * - Track 3: Center content column (528px wide) aligning with spine lines 272px - 800px
 * - Track 4: Gutter channel (48px wide) aligning with spine lines 800px - 848px
 * - Track 5: Right rail (176px wide) for floating TOC scroll indicator
 *
 * Fully responsive: stacks into a clean mobile layout below lg breakpoint.
 */
export function DraftingSectionRow({
  id,
  romanIndex,
  title,
  leftSlot,
  children,
  className,
  contentClassName,
}: DraftingSectionRowProps) {
  return (
    <section
      id={id}
      data-section={id}
      className={cn(
        "relative flex w-full flex-col items-center pb-8 md:pb-16 lg:flex-row lg:items-start lg:pb-20",
        className
      )}
    >
      {/* ─── TRACK 1: LEFT RAIL COLUMN (224px) ─── */}
      <div className="mb-6 flex w-full flex-col items-start pr-0 lg:mb-0 lg:w-[224px] lg:shrink-0 lg:items-end lg:pr-6">
        {leftSlot}

        {/* Desktop Section Header: Roman Numeral + Title + Hairline border */}
        <div
          className={cn(
            "hidden w-full items-center gap-2 pl-6 font-mono text-xs select-none lg:flex",
            leftSlot ? "mt-10" : "mt-2"
          )}
        >
          <span className="font-serif text-lg font-medium text-pp-secondary italic">
            {romanIndex}
          </span>
          <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            <TextBurnNeon>{title}</TextBurnNeon>
          </span>
          <div className="ml-2 flex-1 border-b border-border" />
        </div>
      </div>

      {/* ─── TRACK 2: GUTTER CHANNEL SPACER (48px) ─── */}
      <div className="hidden w-[48px] shrink-0 lg:block" aria-hidden="true" />

      {/* ─── TRACK 3: MAIN CENTER CONTENT COLUMN (528px) ─── */}
      <div className={cn("w-full max-w-[528px] space-y-5", contentClassName)}>
        {/* Mobile Section Header (visible below lg) */}
        <div className="mb-4 flex items-center gap-2 font-mono text-xs select-none lg:hidden">
          <span className="font-serif text-lg font-medium text-pp-secondary italic">
            {romanIndex}
          </span>
          <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            <TextBurnNeon>{title}</TextBurnNeon>
          </span>
          <div className="ml-2 flex-1 border-b border-border" />
        </div>

        {children}
      </div>
    </section>
  )
}
