import { motion } from "motion/react"
import { useEffect, useState } from "react"

import { cn } from "@/shared/lib/utils"
import AnimatedButton from "@/shared/ui/animation/animated-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/core"

import { useMusicStore } from "../store/music-store"

interface MusicToggleButtonProps {
  className?: string
  active?: boolean
  onClick?: () => void
}

export function MusicToggleButton({
  className,
  active = false,
  onClick,
}: MusicToggleButtonProps) {
  // Selective subscription — 0 re-renders on audio timeupdate!
  const isPlaying = useMusicStore((s) => s.isPlaying)
  const currentTrack = useMusicStore((s) => s.tracks[s.currentIndex] ?? null)
  const togglePlay = useMusicStore((s) => s.togglePlay)

  const bars = 3

  const getRandomHeights = () => {
    return Array.from({ length: bars }, () => Math.random() * 0.75 + 0.25)
  }

  const [heights, setHeights] = useState(getRandomHeights)

  // Dynamic waveform animation only while playing
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setHeights(getRandomHeights())
    }, 120)
    return () => clearInterval(interval)
  }, [isPlaying])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onClick) {
      onClick()
    } else {
      togglePlay()
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <AnimatedButton
          type="button"
          onClick={handleClick}
          aria-label={
            isPlaying
              ? `Music playing: ${currentTrack?.title || "Lo-Fi"}`
              : "Open Lo-Fi Music Player"
          }
          className={cn("flex items-center gap-1.5", className)}
        >
          <span
            className={cn(
              "mr-2 text-[10px] font-bold tracking-wider whitespace-nowrap uppercase transition-colors",
              active || isPlaying
                ? "text-pp-primary"
                : "text-muted-foreground group-hover:text-foreground"
            )}
          >
            LO-FI
          </span>

          <div className="flex h-3.5 items-center gap-[2px]">
            {heights.map((height, index) => (
              <motion.span
                key={index}
                className={cn(
                  "w-[2px] rounded-full transition-colors",
                  isPlaying ? "bg-pp-primary" : "bg-muted-foreground/50"
                )}
                animate={{
                  height: isPlaying ? Math.max(3, height * 12) : 3,
                }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 12,
                }}
              />
            ))}
          </div>
        </AnimatedButton>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={8}>
        <div className="flex flex-col gap-0.5 text-xs">
          <span className="font-semibold">
            {isPlaying ? "Now Playing" : "Lo-Fi Chill Beats"}
          </span>
          {currentTrack && (
            <span className="max-w-[180px] truncate text-[11px] text-muted-foreground">
              {currentTrack.title} — {currentTrack.artist}
            </span>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
