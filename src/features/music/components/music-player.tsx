import {
  Disc3,
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

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui"

import { useMusicStore } from "../store/music-store"
import type { MusicTrack } from "../types"
import {
  Disc,
  GlassFilter,
  ROLL_KEYFRAMES,
  RollingTime,
  Tonearm,
} from "./liquid-glass-card"

interface MusicPlayerProps {
  className?: string
  onClose?: () => void
  showCloseButton?: boolean
}

// Turntable physics constants
const CRUISE = 200 // 33⅓ rpm = 200 deg/s
const CRUISE_MS = 1800
const MAX_OMEGA = 2160
const COAST_TAU = 0.45
const SPIN_UP_TAU = 0.22
const SPIN_DOWN_TAU = 0.2
const SETTLE_EPSILON = 2
const DEAD_ZONE = 10
const VELOCITY_WINDOW_MS = 80
const STALE_MOVE_MS = 60
const HOLD_SETTLE_S = 0.05
const BAR_REST = 0.14
const BAR_DECAY_S = 0.3
const BAR_ATTACK_S = 0.08
const MAX_DT = 0.05

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

function hash(n: number) {
  const s = Math.sin(n * 127.1) * 43758.5453
  return s - Math.floor(s)
}

function noise(x: number) {
  const i = Math.floor(x)
  const f = x - i
  const u = f * f * (3 - 2 * f)
  return hash(i) * (1 - u) + hash(i + 1) * u
}

function barLevel(index: number, t: number) {
  return (
    0.6 * noise(t * 4.3 + index * 17.3) +
    0.4 * noise(t * 9.1 + index * 31.7 + 100)
  )
}

function scrubGain(speed: number) {
  const excess = Math.max(0, Math.abs(speed) - CRUISE) / CRUISE
  return 1 + 1.5 * excess ** 1.5
}

function trackRate(omega: number) {
  return (omega / CRUISE) * scrubGain(omega)
}

function rotate(angle: number) {
  return `rotate(${Math.round((angle % 360) * 100) / 100}deg)`
}

export function MusicPlayer({
  className,
  onClose,
  showCloseButton = true,
}: MusicPlayerProps) {
  const filterId = React.useId()

  // Store bindings
  const tracks = useMusicStore((s) => s.tracks)
  const currentIndex = useMusicStore((s) => s.currentIndex)
  const isPlaying = useMusicStore((s) => s.isPlaying)
  const currentTime = useMusicStore((s) => s.currentTime)
  const duration = useMusicStore((s) => s.duration)
  const volume = useMusicStore((s) => s.volume)
  const isMuted = useMusicStore((s) => s.isMuted)
  const loop = useMusicStore((s) => s.loop)
  const isPlaylistCollapsed = useMusicStore((s) => s.isPlaylistCollapsed)

  const togglePlay = useMusicStore((s) => s.togglePlay)
  const nextTrack = useMusicStore((s) => s.nextTrack)
  const prevTrack = useMusicStore((s) => s.prevTrack)
  const selectTrack = useMusicStore((s) => s.selectTrack)
  const seek = useMusicStore((s) => s.seek)
  const setVolume = useMusicStore((s) => s.setVolume)
  const toggleMute = useMusicStore((s) => s.toggleMute)
  const toggleLoop = useMusicStore((s) => s.toggleLoop)
  const togglePlaylistCollapsed = useMusicStore(
    (s) => s.togglePlaylistCollapsed
  )

  const currentTrack = tracks[currentIndex] ?? null

  // DOM Refs
  const rootRef = React.useRef<HTMLDivElement>(null)
  const discRef = React.useRef<HTMLDivElement>(null)
  const railRef = React.useRef<HTMLDivElement>(null)
  const rpmRef = React.useRef<HTMLSpanElement>(null)
  const barRefs = React.useRef<(HTMLSpanElement | null)[]>([])

  // Turntable engine state kept in ref for silky 60fps WAAPI/RAF
  const engineRef = React.useRef({
    angle: 0,
    omega: isPlaying ? CRUISE : 0,
    time: currentTime,
    duration: duration || currentTrack?.duration || 1,
    playing: isPlaying,
    held: false,
    pointerId: null as number | null,
    visible: true,
    reduced: false,
    env: 0,
    scrubOmega: 0,
    pointerAngle: 0,
    center: { x: 0, y: 0 },
    lastMoveAt: 0,
    samples: [] as { t: number; a: number }[],
    cruise: null as Animation | null,
    cruiseAngle: 0,
  })

  // Sync state into engine
  React.useEffect(() => {
    const e = engineRef.current
    e.playing = isPlaying
    if (!e.held) {
      e.time = currentTime
    }
    const targetDuration = duration || currentTrack?.duration || 1
    e.duration = targetDuration
  }, [isPlaying, currentTime, duration, currentTrack])

  // Rolling time clock state
  const [clock, setClock] = React.useState<{ s: number; dir: 1 | -1 }>({
    s: Math.floor(currentTime),
    dir: 1,
  })
  const clockRef = React.useRef(Math.floor(currentTime))

  React.useEffect(() => {
    const s = Math.floor(currentTime)
    if (s !== clockRef.current) {
      const dir = s >= clockRef.current ? 1 : -1
      clockRef.current = s
      setClock({ s, dir })
    }
  }, [currentTime])

  // Turntable animation loop
  React.useEffect(() => {
    const e = engineRef.current
    let raf = 0
    let last = 0

    const readAngle = () => {
      if (e.cruise && e.cruise.currentTime !== null) {
        return e.cruiseAngle + (Number(e.cruise.currentTime) / CRUISE_MS) * 360
      }
      return e.angle
    }

    const stopCruise = () => {
      if (!e.cruise) return
      e.angle = readAngle()
      if (discRef.current) {
        discRef.current.style.transform = rotate(e.angle)
      }
      e.cruise.cancel()
      e.cruise = null
    }

    const startCruise = () => {
      if (
        e.cruise ||
        e.reduced ||
        !discRef.current ||
        typeof discRef.current.animate !== "function"
      ) {
        return
      }
      e.angle %= 360
      e.cruiseAngle = e.angle
      e.cruise = discRef.current.animate(
        [
          { transform: `rotate(${e.angle}deg)` },
          { transform: `rotate(${e.angle + 360}deg)` },
        ],
        { duration: CRUISE_MS, iterations: Number.POSITIVE_INFINITY }
      )
      if (!e.visible) {
        e.cruise.pause()
      }
    }

    const integrateDisc = (dt: number) => {
      const target = e.playing ? CRUISE : 0
      if (e.reduced) {
        e.omega = target
        return
      }
      if (e.cruise) {
        e.omega = CRUISE
        return
      }
      let tau = SPIN_UP_TAU
      if (Math.abs(e.omega) > Math.abs(target)) {
        tau = e.playing ? COAST_TAU : SPIN_DOWN_TAU
      }
      e.omega = target + (e.omega - target) * Math.exp(-dt / tau)
      if (Math.abs(e.omega - target) < SETTLE_EPSILON) {
        e.omega = target
      }
      e.angle += e.omega * dt

      if (e.playing && e.omega === CRUISE) {
        startCruise()
      }
    }

    const updateMeter = (dt: number) => {
      const target = e.held
        ? clamp(Math.abs(e.scrubOmega) / CRUISE, 0, 1)
        : clamp(Math.abs(e.omega) / CRUISE, 0, 1)

      if (e.reduced) {
        e.env = e.playing ? 1 : 0
      } else if (target > e.env) {
        e.env = Math.min(target, e.env + dt / BAR_ATTACK_S)
      } else {
        e.env = Math.max(target, e.env - dt / BAR_DECAY_S)
      }

      const t = e.reduced ? 0.37 : e.time
      for (const [i, bar] of barRefs.current.entries()) {
        if (bar) {
          const level = BAR_REST + (1 - BAR_REST) * barLevel(i, t) * e.env
          bar.style.transform = `scaleY(${level.toFixed(3)})`
        }
      }
    }

    const paint = () => {
      if (discRef.current && !e.cruise) {
        discRef.current.style.transform = rotate(e.angle)
      }
      let label = "0 rpm"
      if (e.held) {
        label = `${Math.round(e.scrubOmega / 6)} rpm`
      } else if (e.omega === CRUISE || e.cruise) {
        label = "33⅓ rpm"
      } else {
        label = `${Math.round(e.omega / 6)} rpm`
      }
      if (rpmRef.current && rpmRef.current.textContent !== label) {
        rpmRef.current.textContent = label
      }
    }

    const isAwake = () => e.playing || e.held || e.omega !== 0 || e.env > 0

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, MAX_DT) : 0
      last = now
      if (e.held) {
        e.scrubOmega *= Math.exp(-dt / HOLD_SETTLE_S)
      } else {
        integrateDisc(dt)
      }
      updateMeter(dt)
      paint()
      if (isAwake() && e.visible) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = 0
        last = 0
      }
    }

    const wake = () => {
      paint()
      if (raf === 0 && e.visible) {
        last = 0
        raf = requestAnimationFrame(tick)
      }
    }

    if (e.playing && !e.held) {
      if (!e.cruise) {
        startCruise()
      }
    } else {
      stopCruise()
    }

    wake()

    return () => {
      cancelAnimationFrame(raf)
      stopCruise()
    }
  }, [isPlaying])

  // Disc drag & scrub interactions
  const onDiscDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const e = engineRef.current
    if (event.button !== 0 || e.pointerId !== null) return
    e.pointerId = event.pointerId
    event.currentTarget.setPointerCapture(event.pointerId)
    const rect = event.currentTarget.getBoundingClientRect()
    e.center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }

    if (e.cruise) {
      if (e.cruise.currentTime !== null) {
        e.angle =
          e.cruiseAngle + (Number(e.cruise.currentTime) / CRUISE_MS) * 360
      }
      e.cruise.cancel()
      e.cruise = null
      if (discRef.current) {
        discRef.current.style.transform = rotate(e.angle)
      }
    }

    e.held = true
    e.omega = 0
    e.scrubOmega = 0
    const dx = event.clientX - e.center.x
    const dy = event.clientY - e.center.y
    e.pointerAngle = (Math.atan2(dy, dx) * 180) / Math.PI
    e.lastMoveAt = performance.now()
    e.samples = [{ t: e.lastMoveAt, a: e.angle }]
  }

  const onDiscMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const e = engineRef.current
    if (event.pointerId !== e.pointerId) return
    const dx = event.clientX - e.center.x
    const dy = event.clientY - e.center.y
    const dist = Math.hypot(dx, dy)
    if (dist < DEAD_ZONE) return

    const now = performance.now()
    const currentAngle = (Math.atan2(dy, dx) * 180) / Math.PI
    let da = currentAngle - e.pointerAngle
    if (da > 180) da -= 360
    if (da < -180) da += 360

    e.pointerAngle = currentAngle
    e.angle += da

    // Calculate scrub speed
    const dtMove = Math.max(0.001, (now - e.lastMoveAt) / 1000)
    e.lastMoveAt = now
    const instOmega = da / dtMove
    e.scrubOmega = clamp(instOmega, -MAX_OMEGA, MAX_OMEGA)

    // Scrub real audio
    const dTime = trackRate(e.scrubOmega) * dtMove
    const newTime = clamp(e.time + dTime, 0, e.duration)
    e.time = newTime
    seek(newTime)

    e.samples.push({ t: now, a: e.angle })
    const cutoff = now - VELOCITY_WINDOW_MS
    while (e.samples.length > 0 && e.samples[0].t < cutoff) {
      e.samples.shift()
    }

    if (discRef.current) {
      discRef.current.style.transform = rotate(e.angle)
    }
  }

  const onDiscUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const e = engineRef.current
    if (event.pointerId !== e.pointerId) return
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {
      // Ignore pointer capture release error if already released
    }
    e.pointerId = null
    e.held = false

    const now = performance.now()
    if (now - e.lastMoveAt > STALE_MOVE_MS || e.samples.length < 2) {
      e.omega = 0
    } else {
      const oldest = e.samples[0]
      const dt = Math.max(0.001, (now - oldest.t) / 1000)
      const measured = (e.angle - oldest.a) / dt
      e.omega = clamp(measured, -MAX_OMEGA, MAX_OMEGA)
    }
    e.samples = []
  }

  // Seek bar click / drag
  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!railRef.current) return
    const rect = railRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const ratio = clamp(clickX / rect.width, 0, 1)
    const activeDuration = duration || currentTrack?.duration || 1
    seek(ratio * activeDuration)
  }

  if (!currentTrack) return null

  const activeDuration = duration || currentTrack.duration || 1
  const progressRatio = clamp(currentTime / activeDuration, 0, 1)

  return (
    <>
      <style>{ROLL_KEYFRAMES}</style>
      <div
        ref={rootRef}
        className={cn(
          "relative flex w-[calc(100vw-32px)] max-w-[340px] flex-col overflow-hidden text-foreground select-none xs:max-w-[350px] sm:w-[410px] sm:max-w-[420px] md:w-[440px] md:max-w-[450px]",
          className
        )}
      >
        {/* SVG Liquid Refraction Filter */}
        <GlassFilter id={filterId} scale={30} />

        {/* 1. Header with Lo-Fi / Vinyl identity */}
        <div className="flex items-center justify-between border-b border-border/40 px-3.5 py-2.5 sm:px-5 sm:py-3 dark:border-white/10">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary sm:size-6.5">
              <Disc3
                className={cn(
                  "size-3.5 sm:size-4",
                  isPlaying && "animate-spin"
                )}
                style={{ animationDuration: "3s" }}
              />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-semibold tracking-wide text-foreground sm:text-sm">
                Vinyl Player
              </span>
              <span className="rounded-full border border-border/60 bg-muted/60 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground sm:px-2 sm:text-[10px]">
                {currentIndex + 1}/{tracks.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {showCloseButton && onClose && (
              <Button
                type="button"
                onClick={onClose}
                size="icon-xs"
                className="size-6 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground sm:size-6.5"
                variant="ghost"
                aria-label="Close music player"
              >
                <X className="size-3.5 sm:size-4" />
              </Button>
            )}
          </div>
        </div>

        {/* 2. Turntable Deck & Track Details */}
        <div className="p-3.5 sm:p-5 md:p-6">
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Turntable Platter Container with dedicated right clearance for tonearm */}
            <div className="relative shrink-0 pr-4 xs:pr-6 sm:pr-8">
              <div className="relative size-20 xs:size-24 sm:size-28 md:size-32">
                <div
                  ref={discRef}
                  role="slider"
                  tabIndex={0}
                  aria-label="Vinyl turntable disc, drag to scrub"
                  aria-valuemin={0}
                  aria-valuemax={activeDuration}
                  aria-valuenow={currentTime}
                  className="relative size-full cursor-grab rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.4)] ring-1 ring-black/20 focus:outline-none active:cursor-grabbing sm:shadow-[0_6px_20px_rgba(0,0,0,0.4)] dark:ring-white/15"
                  onPointerDown={onDiscDown}
                  onPointerMove={onDiscMove}
                  onPointerUp={onDiscUp}
                  onPointerCancel={onDiscUp}
                >
                  <Disc
                    artwork={currentIndex % 3}
                    imageUrl={currentTrack.artwork}
                  />
                </div>

                {/* Tonearm needle positioned within the platter's dedicated clearance lane */}
                <Tonearm
                  down={isPlaying}
                  className="-right-2 xs:-right-2.5 sm:-right-3.5"
                />
              </div>
            </div>

            {/* Track Info & Equalizer — Completely free of overlap */}
            <div className="min-w-0 flex-1 pl-0.5 sm:pl-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[9px] font-semibold tracking-wider text-muted-foreground uppercase xs:text-[10px] sm:text-[11px]">
                  Now playing
                </span>
              </div>

              <h3
                className="mt-1 truncate text-xs font-semibold tracking-tight text-foreground xs:text-sm sm:mt-2 sm:text-base"
                title={currentTrack.title}
              >
                {currentTrack.title}
              </h3>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground xs:text-xs sm:text-[13px]">
                {currentTrack.artist || currentTrack.album || "Lo-Fi Beats"}
              </p>

              {/* Dynamic RPM speed badge & album */}
              <div className="mt-1.5 flex items-center gap-1.5 sm:mt-2.5 sm:gap-2">
                <span
                  ref={rpmRef}
                  className="inline-block rounded-md border border-border/60 bg-muted/50 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground tabular-nums sm:px-2 sm:text-[10px]"
                >
                  {isPlaying ? "33⅓ rpm" : "0 rpm"}
                </span>
                {currentTrack.album && (
                  <span className="truncate text-[10px] text-muted-foreground/70 sm:text-[11px]">
                    {currentTrack.album}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 3. Timeline Scrubber */}
          <div className="mt-3.5 sm:mt-5">
            <div
              ref={railRef}
              onClick={onSeek}
              role="slider"
              tabIndex={0}
              aria-label="Seek track"
              aria-valuemin={0}
              aria-valuemax={activeDuration}
              aria-valuenow={currentTime}
              className="group/seek relative -my-1.5 flex h-4 cursor-pointer items-center py-1.5 sm:h-4.5"
            >
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted transition-all group-hover/seek:h-2 sm:h-2 sm:group-hover/seek:h-2.5">
                <div
                  className="h-full origin-left rounded-full bg-primary transition-all duration-75"
                  style={{ transform: `scaleX(${progressRatio})` }}
                />
              </div>
            </div>

            <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground tabular-nums sm:mt-1.5 sm:text-[11px]">
              <RollingTime direction={clock.dir} seconds={clock.s} />
              <span>{formatTime(activeDuration)}</span>
            </div>
          </div>

          {/* 4. Transport Controls */}
          <div className="mt-2.5 flex items-center justify-between pt-1 sm:mt-4">
            {/* Loop Toggle */}
            <button
              type="button"
              onClick={toggleLoop}
              aria-label={loop ? "Disable repeat" : "Enable repeat"}
              className={cn(
                "flex size-7.5 items-center justify-center rounded-lg transition-colors active:scale-95 sm:size-9",
                loop
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
              title={loop ? "Repeat: On" : "Repeat: Off"}
            >
              {loop ? (
                <Repeat className="size-3.5 sm:size-4" />
              ) : (
                <RotateCcw className="size-3.5 sm:size-4" />
              )}
            </button>

            {/* Prev, Play/Pause, Next */}
            <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => prevTrack()}
                aria-label="Previous track"
                className="flex size-7.5 items-center justify-center rounded-full text-foreground/80 transition-all hover:bg-muted/80 hover:text-foreground active:scale-95 sm:size-9.5"
              >
                <SkipBack className="size-3.5 fill-current sm:size-4.5" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="flex size-9.5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_16px_var(--pp-primary-glow)] transition-all hover:scale-105 active:scale-95 sm:size-12"
              >
                {isPlaying ? (
                  <Pause className="size-4 fill-current sm:size-5" />
                ) : (
                  <Play className="ml-0.5 size-4 fill-current sm:size-5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => nextTrack()}
                aria-label="Next track"
                className="flex size-7.5 items-center justify-center rounded-full text-foreground/80 transition-all hover:bg-muted/80 hover:text-foreground active:scale-95 sm:size-9.5"
              >
                <SkipForward className="size-3.5 fill-current sm:size-4.5" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground active:scale-95 sm:size-8"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="size-3.5 text-muted-foreground sm:size-4" />
                ) : (
                  <Volume2 className="size-3.5 sm:size-4" />
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
                className="h-1.5 w-8 cursor-pointer accent-primary xs:w-11 sm:w-16"
              />
            </div>
          </div>
        </div>

        {/* 5. Collapsible Playlist */}
        <div className="border-t border-border/40 px-3.5 pt-2 pb-2.5 sm:px-5 sm:pb-3.5 dark:border-white/10">
          <button
            type="button"
            onClick={togglePlaylistCollapsed}
            aria-expanded={!isPlaylistCollapsed}
            aria-label={
              isPlaylistCollapsed ? "Expand playlist" : "Collapse playlist"
            }
            className="group flex w-full items-center justify-between rounded-md py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground sm:text-[11px]"
          >
            <div className="flex items-center gap-1.5">
              <ListMusic className="size-3.5" />
              <span>Playlist</span>
              <span className="rounded-full border border-border/60 bg-muted/60 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground sm:text-[10px]">
                {tracks.length}
              </span>
            </div>

            <div className="flex size-5 items-center justify-center rounded border border-border/60 bg-muted/40 text-muted-foreground transition-all group-hover:border-border group-hover:bg-muted group-hover:text-foreground active:scale-95 sm:size-5.5">
              {isPlaylistCollapsed ? (
                <Plus className="size-3 sm:size-3.5" />
              ) : (
                <Minus className="size-3 sm:size-3.5" />
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
                className="overflow-hidden pt-1.5 sm:pt-2"
              >
                <div className="no-scrollbar flex max-h-[140px] flex-col gap-1 overflow-y-auto pr-0.5 text-xs sm:max-h-[200px]">
                  {tracks.map((t: MusicTrack, idx: number) => {
                    const isCurrent = idx === currentIndex
                    return (
                      <button
                        key={t.id || idx}
                        type="button"
                        onClick={() => selectTrack(idx)}
                        className={cn(
                          "group/track flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-all active:scale-[0.99] xs:px-2.5 xs:py-2 sm:py-2.5",
                          isCurrent
                            ? "bg-primary/10 font-semibold text-primary shadow-xs"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        )}
                      >
                        {/* Track STT or Equalizer Wave */}
                        <div className="flex size-4.5 shrink-0 items-center justify-center font-mono text-[10px] sm:size-5 sm:text-[11px]">
                          {isCurrent && isPlaying ? (
                            <div className="flex items-end gap-[1.5px]">
                              <span className="h-2.5 w-[2px] animate-pulse rounded-full bg-primary" />
                              <span className="h-3.5 w-[2px] animate-pulse rounded-full bg-primary delay-75" />
                              <span className="h-1.5 w-[2px] animate-pulse rounded-full bg-primary delay-150" />
                            </div>
                          ) : (
                            <span
                              className={cn(
                                "font-mono text-[10px] sm:text-[11px]",
                                isCurrent
                                  ? "font-bold text-primary"
                                  : "text-muted-foreground/60 group-hover/track:text-foreground"
                              )}
                            >
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                          )}
                        </div>

                        {/* Track Title */}
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs sm:text-sm">
                            {t.title}
                          </div>
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
    </>
  )
}
