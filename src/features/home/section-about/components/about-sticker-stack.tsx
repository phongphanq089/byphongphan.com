import { motion } from "motion/react"
import React, { useState } from "react"
import { Sticker } from "stick-it-up"

import { playClickSound, playHoverSound } from "@/shared/lib/sound"
import { cn } from "@/shared/lib/utils"

export interface StickerItem {
  name: string
  label: string
  rotate: number
}

export const TECH_VISIONARY_STICKERS: StickerItem[] = [
  { name: "elon", label: "Elon", rotate: -8 },
  { name: "steve-jobs", label: "Steve Jobs", rotate: 5 },
  { name: "jensen-huang", label: "Jensen Huang", rotate: -6 },
  { name: "mark-zuckerberg", label: "Mark Zuckerberg", rotate: 7 },
  { name: "mark-socialnetwork", label: "Mark Social Network", rotate: -5 },
  { name: "socialnetwork-badge", label: "Social Network Badge", rotate: 9 },
]

export interface AboutStickerStackProps {
  className?: string
  stickers?: StickerItem[]
  size?: number
}

/**
 * Horizontal Stacked Vinyl Sticker Deck
 *
 * Renders physical vinyl stickers overlapping horizontally.
 * On hover, a sticker lifts up (z-index jump, scale up, straighten angle)
 * with tactile sound feedback and the interactive 3D peel effect.
 */
export function AboutStickerStack({
  className,
  stickers = TECH_VISIONARY_STICKERS,
  size = 130,
}: AboutStickerStackProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center py-2 select-none",
        className
      )}
    >
      {/* Horizontal overlapping stack row */}
      <div className="relative flex w-full max-w-full items-center justify-center -space-x-8 overflow-x-auto overflow-y-visible py-4 sm:-space-x-12 sm:overflow-visible md:-space-x-14">
        {stickers.map((item, idx) => {
          const isHovered = hoveredIndex === idx
          return (
            <motion.div
              key={item.name}
              onMouseEnter={() => {
                playHoverSound()
                setHoveredIndex(idx)
              }}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => playClickSound()}
              style={{
                zIndex: isHovered ? 40 : idx + 1,
              }}
              animate={{
                scale: isHovered ? 1.15 : 1,
                y: isHovered ? -14 : 0,
                rotate: isHovered ? 0 : item.rotate,
              }}
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 24,
                bounce: 0.2,
              }}
              className="relative cursor-pointer transition-shadow"
            >
              <div className="drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transition-all duration-200 dark:drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]">
                <Sticker name={item.name} size={size} peel />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default AboutStickerStack
