import React from "react"

import { cn } from "@/shared/lib/utils"

export interface AboutHeroHeadlineProps {
  className?: string
  role?: string
  statusText?: string
}

/**
 * Architectural Identity & Availability Status Meta
 *
 * Sits directly below the Visual CAD Banner, framing the discipline
 * and live availability status before the editorial bio story.
 */
export function AboutHeroHeadline({
  className,
  role = "Design Engineer · Creative Technologist",
  statusText = "Available for select projects",
}: AboutHeroHeadlineProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pt-1 pb-3 font-mono text-xs text-muted-foreground select-none",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold tracking-wider text-foreground/90 uppercase">
          {role}
        </span>
      </div>

      {/* Live Availability Badge */}
      <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[9px] font-medium text-emerald-400">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
        </span>
        <span>{statusText}</span>
      </div>
    </div>
  )
}
