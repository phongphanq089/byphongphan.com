import React from "react"

import { cn } from "@/shared/lib/utils"

export interface AboutHeroBannerProps {
  className?: string
  src?: string
  alt?: string
  figId?: string
  specText?: string
}

/**
 * Architectural CAD Visual Banner Frame
 *
 * Houses the Vegeta Ultra Ego signature graphic within a precision-engineered
 * blueprint specification frame, placed as the opening visual anchor of Section I.
 */
export function AboutHeroBanner({
  className,
  src = "/vegeta-ultra-ego.gif",
  alt = "Vegeta Ultra Ego Banner",
}: AboutHeroBannerProps) {
  return (
    <div
      className={cn(
        "group/banner relative w-full overflow-hidden bg-card/40 backdrop-blur-xs transition-colors hover:border-border",
        className
      )}
    >
      {/* Viewport Frame with CAD Corner Crosshairs */}
      <div className="relative aspect-video overflow-hidden rounded-xs border border-border/60 bg-black/60">
        <img
          src={src}
          alt={alt}
          className="size-full object-cover object-center transition-transform duration-700 ease-out select-none group-hover/banner:scale-[1.01]"
          loading="eager"
        />
      </div>
    </div>
  )
}
