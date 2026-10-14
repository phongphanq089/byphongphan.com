import {
  ListMusic,
  Minus,
  Pause,
  Play,
  Plus,
  Repeat,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import * as React from "react"
import { useCallback, useRef } from "react"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui"

import { useMusicStore } from "../store/music-store"
import type { MusicTrack } from "../types"

interface MusicPlayerProps {
  className?: string
  onClose?: () => void
  showCloseButton?: boolean
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

/**
 * Isolated progress bar — ONLY this component re-renders on audio timeupdate!
 */
function MusicProgressBar({ fallbackDuration }: { fallbackDuration?: number }) {
  const currentTime = useMusicStore((s) => s.currentTime)
  const duration = useMusicStore((s) => s.duration)
  const seek = useMusicStore((s) => s.seek)

  const progressBarRef = useRef<HTMLDivElement>(null)
  const activeDuration = duration || fallbackDuration || 0
  const progressPercent =
    activeDuration > 0 ? (currentTime / activeDuration) * 100 : 0

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressBarRef.current || !activeDuration) return
      const rect = progressBarRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const ratio = Math.min(Math.max(clickX / rect.width, 0), 1)
      seek(ratio * activeDuration)
    },
    [activeDuration, seek]
  )

  return (
    <div className="flex flex-col gap-1">
      <div
        ref={progressBarRef}
        onClick={handleSeek}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={activeDuration}
        aria-valuenow={currentTime}
        aria-label="Audio progress bar"
        tabIndex={0}
        className="group relative flex h-3 cursor-pointer items-center"
      >
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted transition-all group-hover:h-2">
          <div
            className="h-full rounded-full bg-pp-primary transition-all duration-75"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(activeDuration)}</span>
      </div>
    </div>
  )
}

export function MusicPlayer({
  className,
  onClose,
  showCloseButton = true,
}: MusicPlayerProps) {
  // Selective store subscriptions
  const tracks = useMusicStore((s) => s.tracks)
  const currentIndex = useMusicStore((s) => s.currentIndex)
  const isPlaying = useMusicStore((s) => s.isPlaying)
  const volume = useMusicStore((s) => s.volume)
  const isMuted = useMusicStore((s) => s.isMuted)
  const loop = useMusicStore((s) => s.loop)
  const isPlaylistCollapsed = useMusicStore((s) => s.isPlaylistCollapsed)

  const togglePlay = useMusicStore((s) => s.togglePlay)
  const nextTrack = useMusicStore((s) => s.nextTrack)
  const prevTrack = useMusicStore((s) => s.prevTrack)
  const selectTrack = useMusicStore((s) => s.selectTrack)
  const setVolume = useMusicStore((s) => s.setVolume)
  const toggleMute = useMusicStore((s) => s.toggleMute)
  const toggleLoop = useMusicStore((s) => s.toggleLoop)
  const togglePlaylistCollapsed = useMusicStore(
    (s) => s.togglePlaylistCollapsed
  )

  const currentTrack = tracks[currentIndex] ?? null

  if (!currentTrack) return null

  return (
    <div
      className={cn(
        "flex w-[330px] max-w-[calc(100vw-32px)] flex-col overflow-hidden bg-transparent text-foreground select-none sm:w-[380px]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border/50 px-3.5 py-2.5 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-pp-primary/15 text-pp-primary">
            <ListMusic className="size-3.5" />
          </div>
          <span className="text-xs font-semibold tracking-wide text-foreground">
            Lo-Fi Player
          </span>
          <span className="py-0.2 rounded-full border border-border/60 bg-muted/50 px-1.5 font-mono text-[9px] text-muted-foreground">
            {currentIndex + 1}/{tracks.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {showCloseButton && onClose && (
            <Button
              type="button"
              onClick={onClose}
              size={"icon-xs"}
              className="rounded!"
              variant={"secondary"}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 2. Now Playing Section */}
      <div className="flex flex-col gap-3 p-3.5">
        <div className="flex items-center gap-3">
          {/* Artwork */}
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-black/10 shadow-sm dark:border-white/15">
            {currentTrack.artwork ? (
              <img
                src={currentTrack.artwork}
                alt={`${currentTrack.title} artwork`}
                className={cn(
                  "size-full object-cover transition-transform duration-700",
                  isPlaying && "scale-105"
                )}
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
                <ListMusic className="size-6" />
              </div>
            )}
            {isPlaying && (
              <div className="absolute inset-0 bg-radial from-transparent to-black/25" />
            )}
          </div>

          {/* Track Info */}
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <h4 className="truncate text-sm font-semibold tracking-tight text-foreground">
              {currentTrack.title}
            </h4>
            <p className="truncate text-xs text-muted-foreground">
              {currentTrack.artist}
            </p>
            {currentTrack.album && (
              <span className="truncate text-[10px] text-muted-foreground/70">
                {currentTrack.album}
              </span>
            )}
          </div>
        </div>

        {/* Timeline Scrubber (Isolated component) */}
        <MusicProgressBar fallbackDuration={currentTrack.duration} />

        {/* Transport Controls */}
        <div className="flex items-center justify-between pt-0.5">
          {/* Loop toggle */}
          <button
            type="button"
            onClick={toggleLoop}
            aria-label={loop ? "Disable repeat" : "Enable repeat"}
            className={cn(
              "flex size-7 items-center justify-center rounded-lg transition-colors",
              loop
                ? "bg-pp-primary/15 text-pp-primary"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            )}
          >
            {loop ? (
              <Repeat className="size-3.5" />
            ) : (
              <RotateCcw className="size-3.5" />
            )}
          </button>

          {/* Center: Prev, Play/Pause, Next */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={prevTrack}
              aria-label="Previous track"
              className="flex size-8 items-center justify-center rounded-full text-foreground/80 transition-all hover:bg-muted/80 hover:text-foreground active:scale-95"
            >
              <SkipBack className="size-4 fill-current" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="flex size-10 items-center justify-center rounded-full bg-primary text-background shadow-[0_0_16px_var(--pp-primary-glow)] transition-all hover:scale-105 active:scale-95"
            >
              {isPlaying ? (
                <Pause className="size-4.5 fill-current" />
              ) : (
                <Play className="ml-0.5 size-4.5 fill-current" />
              )}
            </button>

            <button
              type="button"
              onClick={nextTrack}
              aria-label="Next track"
              className="flex size-8 items-center justify-center rounded-full text-foreground/80 transition-all hover:bg-muted/80 hover:text-foreground active:scale-95"
            >
              <SkipForward className="size-4 fill-current" />
            </button>
          </div>

          {/* Volume Mute Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
              className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="size-3.5 text-muted-foreground" />
              ) : (
                <Volume2 className="size-3.5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
              aria-label="Volume slider"
              className="h-1 w-12 cursor-pointer accent-pp-primary"
            />
          </div>
        </div>
      </div>

      {/* 3. Playlist / Track List (Collapsible) */}
      <div className="border-t border-border/50 px-3.5 pt-2 pb-2.5 dark:border-white/10">
        <button
          type="button"
          onClick={togglePlaylistCollapsed}
          aria-expanded={!isPlaylistCollapsed}
          aria-label={
            isPlaylistCollapsed ? "Expand playlist" : "Collapse playlist"
          }
          className="group flex w-full items-center justify-between rounded-md py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          <div className="flex items-center gap-1.5">
            <span>Playlist</span>
            <span className="py-0.2 rounded-full border border-border/60 bg-muted/60 px-1.5 font-mono text-[9px] text-muted-foreground">
              {tracks.length}
            </span>
          </div>

          <div className="flex size-5 items-center justify-center rounded border border-border/60 bg-muted/40 text-muted-foreground transition-all group-hover:border-border group-hover:bg-muted group-hover:text-foreground active:scale-95">
            {isPlaylistCollapsed ? (
              <Plus className="size-3" />
            ) : (
              <Minus className="size-3" />
            )}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {!isPlaylistCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden pt-1.5"
            >
              <div className="flex max-h-[160px] flex-col gap-1 overflow-y-auto pr-1 text-xs">
                {tracks.map((t: MusicTrack, idx: number) => {
                  const isCurrent = idx === currentIndex
                  return (
                    <button
                      key={t.id || idx}
                      type="button"
                      onClick={() => selectTrack(idx)}
                      className={cn(
                        "group/track flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left transition-all active:scale-98",
                        isCurrent
                          ? "bg-pp-primary/10 font-medium text-pp-primary shadow-xs"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      )}
                    >
                      {/* Number or Equalizer animation */}
                      <div className="flex size-4 shrink-0 items-center justify-center font-mono text-[10px]">
                        {isCurrent && isPlaying ? (
                          <div className="flex items-end gap-[1.5px]">
                            <span className="h-2.5 w-[2px] animate-pulse rounded-full bg-pp-primary" />
                            <span className="h-3.5 w-[2px] animate-pulse rounded-full bg-pp-primary delay-75" />
                            <span className="h-1.5 w-[2px] animate-pulse rounded-full bg-pp-primary delay-150" />
                          </div>
                        ) : (
                          <span className="opacity-60">{idx + 1}</span>
                        )}
                      </div>

                      {/* Track Details */}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-medium">
                          {t.title}
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="shrink-0 font-mono text-[10px] opacity-60">
                        {formatTime(t.duration || 0)}
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
