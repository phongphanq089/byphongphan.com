import type React from "react"

import { cn } from "@/shared/lib/utils"
import { StripedPattern } from "@/shared/ui/system/striped-pattern"

export interface ArchitecturalSpineProps {
  /** Max-width utility class (defaults to Home's 1024px blueprint sheet). */
  maxWidthClassName?: string
  /** Left rail width in px on lg+ viewports (default: 224). */
  leftRailWidth?: number
  /** Width of each striped gutter channel in px on lg+ viewports (default: 48). */
  gutterWidth?: number
  /** Right rail width in px on lg+ viewports (default: 128, i.e. 976px inner - 848px). */
  rightRailWidth?: number
  /** Optional className on the outer spine container. */
  className?: string
}

/**
 * Continuous Architectural Spine (6 Vertical Hairlines + 2 Striped Gutter Channels).
 *
 * Uses left-anchored tracks for the left rail + left gutter and right-anchored
 * tracks for the right gutter + right rail so it works seamlessly at any container
 * max-width (e.g. 1024px on `/` and 1360px on `/ui`).
 */
export function ArchitecturalSpine({
  maxWidthClassName = "max-w-[1024px]",
  leftRailWidth = 224,
  gutterWidth = 48,
  rightRailWidth = 128,
  className,
}: ArchitecturalSpineProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 mx-auto w-full px-4 select-none sm:px-6",
        maxWidthClassName,
        className
      )}
      style={
        {
          "--spine-left": `${leftRailWidth}px`,
          "--spine-gutter": `${gutterWidth}px`,
          "--spine-right": `${rightRailWidth}px`,
        } as React.CSSProperties
      }
    >
      <div className="relative size-full">
        {/* Left Gutter Channel Striped Hatching */}
        <div className="absolute top-0 bottom-0 left-(--spine-left) hidden w-(--spine-gutter) lg:block">
          <StripedPattern variant="full" className="opacity-70" />
        </div>

        {/* Right Gutter Channel Striped Hatching */}
        <div className="absolute top-0 right-(--spine-right) bottom-0 hidden w-(--spine-gutter) lg:block">
          <StripedPattern variant="full" className="opacity-70" />
        </div>

        {/* 6 Vertical Hairlines Top to Bottom */}
        <div className="absolute top-0 bottom-0 left-0 w-px bg-border/60" />
        <div className="absolute top-0 bottom-0 left-(--spine-left) hidden w-px bg-border/60 lg:block" />
        <div className="absolute top-0 bottom-0 left-[calc(var(--spine-left)+var(--spine-gutter))] hidden w-px bg-border/60 lg:block" />
        <div className="absolute top-0 right-[calc(var(--spine-right)+var(--spine-gutter))] bottom-0 hidden w-px bg-border/60 lg:block" />
        <div className="absolute top-0 right-(--spine-right) bottom-0 hidden w-px bg-border/60 lg:block" />
        <div className="absolute top-0 right-0 bottom-0 w-px bg-border/60" />
      </div>
    </div>
  )
}
