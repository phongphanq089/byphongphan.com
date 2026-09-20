import { Headphones } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/shared/lib"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/core"

const AUDIO_SRC =
  "https://cdn.sanity.io/files/i6rvgdeu/music-app-player/ee8c9a37cff4bd27011cdfe042a215ae0a42f082.mp3"

interface MusicToggleButtonProps {
  className?: string
  autoPlay?: boolean
}

export const MusicToggleButton = ({
  className,
  autoPlay = true,
}: MusicToggleButtonProps) => {
  const bars = 3
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const getRandomHeights = () => {
    return Array.from({ length: bars }, () => Math.random() * 0.75 + 0.25)
  }

  const [heights, setHeights] = useState(getRandomHeights())
  const [isPlaying, setIsPlaying] = useState(false)

  // Auto-play logic with browser user gesture unlocking
  useEffect(() => {
    if (!autoPlay) return

    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.35

    const startPlayback = async () => {
      try {
        await audio.play()
        setIsPlaying(true)
        cleanupListeners()
      } catch {
        // Browser blocked un-interacted autoplay — wait for user interaction
      }
    }

    // Try immediate playback
    startPlayback()

    const onUserGesture = () => {
      startPlayback()
    }

    const cleanupListeners = () => {
      window.removeEventListener("pointerdown", onUserGesture)
      window.removeEventListener("click", onUserGesture)
      window.removeEventListener("touchstart", onUserGesture)
      window.removeEventListener("keydown", onUserGesture)
    }

    window.addEventListener("pointerdown", onUserGesture, { once: true })
    window.addEventListener("click", onUserGesture, { once: true })
    window.addEventListener("touchstart", onUserGesture, { once: true })
    window.addEventListener("keydown", onUserGesture, { once: true })

    return () => {
      cleanupListeners()
    }
  }, [autoPlay])

  // Animate waveform while playing
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setHeights(getRandomHeights())
    }, 120)
    return () => clearInterval(interval)
  }, [isPlaying])

  const handleClick = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch (err) {
        console.error("Playback error:", err)
      }
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleClick}
            aria-label={
              isPlaying ? "Pause Lo-Fi Chill music" : "Play Lo-Fi Chill music"
            }
            className={cn(
              "group relative flex h-9 items-center gap-1.5 rounded-lg border px-2.5 transition-all duration-200 active:scale-95",
              isPlaying
                ? "border-pp-primary/60 bg-pp-primary/15 text-pp-primary shadow-[0_0_14px_rgba(220,38,38,0.25)]"
                : "border-border/60 bg-muted/40 text-muted-foreground hover:border-border hover:bg-muted/70 hover:text-foreground",
              className
            )}
          >
            {/* Headphones Icon */}
            <Headphones
              className={cn(
                "size-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                isPlaying && "animate-pulse text-pp-primary"
              )}
            />

            {/* LO-FI Label */}
            <span
              className={cn(
                "text-[10px] font-bold tracking-wider whitespace-nowrap uppercase transition-colors",
                isPlaying
                  ? "text-pp-primary"
                  : "text-muted-foreground group-hover:text-foreground"
              )}
            >
              LO-FI
            </span>

            {/* Animated Equalizer Waveform */}
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
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={8}>
          <div className="flex items-center gap-1.5 text-xs">
            <span>
              {isPlaying ? "⏸ Pause Lo-Fi Chill" : "▶ Play Lo-Fi Chill Beats"}
            </span>
          </div>
        </TooltipContent>
      </Tooltip>
    </>
  )
}
