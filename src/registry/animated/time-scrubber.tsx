import { useEffect, useId, useMemo, useRef, useState } from "react"

import { cn } from "@/shared/lib/utils"

/* ══ Time Scrubber ════════════════════════════════════════
  A tactile precision time dial with elastic spring kinematics,
  momentum fling coasting, rolling motion-blur digits, and
  continuous live-second ruler advancement.

  ── ONE SPRING FOR THE THROW AND THE SNAP ───────────────
  On release the landing is decided at once: where the ruler
  would coast to at the speed it was let go, rounded to the
  nearest step. Then one spring carries it there, starting with
  the hand's own velocity — so a flick coasts and a slow
  release just settles, and there is no seam between "gliding"
  and "snapping" because they are the same motion.

  ── A DIAL SEEN FROM THE FRONT ──────────────────────────
  Ticks at the centre stand tall and dark and fall away toward
  the edges in height and in ink, creating the illusion of a
  cylindrical dial seen edge-on. Only the ticks visible in the
  window are drawn at all.
═════════════════════════════════════════════════════════ */

const STILLNESS = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

const DAY_MIN = 1440 // 24 hours in minutes
const DAY_SEC = 86400 // 24 hours in seconds

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const wrapMin = (m: number) => ((m % DAY_MIN) + DAY_MIN) % DAY_MIN
const wrapSec = (s: number) => ((s % DAY_SEC) + DAY_SEC) % DAY_SEC

/**
 * Returns current minutes elapsed from midnight in the specified timezone
 */
export function getMinutesFromMidnight(timeZone?: string): number {
  const now = new Date()
  if (!timeZone) {
    return now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60
  }
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    })
    const parts = formatter.formatToParts(now)
    let h = 0
    let m = 0
    let s = 0
    for (const p of parts) {
      if (p.type === "hour") h = parseInt(p.value, 10) % 24
      if (p.type === "minute") m = parseInt(p.value, 10)
      if (p.type === "second") s = parseInt(p.value, 10)
    }
    return h * 60 + m + s / 60
  } catch {
    return now.getHours() * 60 + now.getMinutes()
  }
}

/**
 * Returns high-precision current seconds elapsed from midnight with fractional milliseconds
 */
export function getSecondsFromMidnight(timeZone?: string): {
  totalSeconds: number
  hours: number
  mins: number
  secs: number
  ms: number
} {
  const now = new Date()
  const ms = now.getMilliseconds()
  if (!timeZone) {
    const h = now.getHours()
    const m = now.getMinutes()
    const s = now.getSeconds()
    return {
      totalSeconds: h * 3600 + m * 60 + s + ms / 1000,
      hours: h,
      mins: m,
      secs: s,
      ms,
    }
  }
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    })
    const parts = formatter.formatToParts(now)
    let h = 0
    let m = 0
    let s = 0
    for (const p of parts) {
      if (p.type === "hour") h = parseInt(p.value, 10) % 24
      if (p.type === "minute") m = parseInt(p.value, 10)
      if (p.type === "second") s = parseInt(p.value, 10)
    }
    return {
      totalSeconds: h * 3600 + m * 60 + s + ms / 1000,
      hours: h,
      mins: m,
      secs: s,
      ms,
    }
  } catch {
    const h = now.getHours()
    const m = now.getMinutes()
    const s = now.getSeconds()
    return {
      totalSeconds: h * 3600 + m * 60 + s + ms / 1000,
      hours: h,
      mins: m,
      secs: s,
      ms,
    }
  }
}

let sharedAudioCtx: AudioContext | null = null

function playTick(isMajor = false) {
  if (typeof window === "undefined") return
  try {
    if (!sharedAudioCtx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      if (AudioCtx) sharedAudioCtx = new AudioCtx()
    }
    if (sharedAudioCtx && sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {})
    }
    if (!sharedAudioCtx || sharedAudioCtx.state !== "running") return

    const osc = sharedAudioCtx.createOscillator()
    const gain = sharedAudioCtx.createGain()
    const now = sharedAudioCtx.currentTime

    osc.type = "sine"
    osc.frequency.setValueAtTime(isMajor ? 480 : 800, now)
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.015)

    gain.gain.setValueAtTime(isMajor ? 0.04 : 0.018, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016)

    osc.connect(gain)
    gain.connect(sharedAudioCtx.destination)

    osc.start(now)
    osc.stop(now + 0.018)
  } catch {
    // Ignore audio context restriction errors
  }
}

/* ── A digit that rolls, through a window that fades ────────
   A strip of 0–9 slides to the digit, as it did first — but the
   window it slides through is taller than the line and fades to
   nothing at its top and bottom instead of clipping. */
function Digit({ d }: { d: string }) {
  const prev = useRef(d)
  const flip = useRef<boolean | null>(null)

  if (prev.current !== d) {
    prev.current = d
    flip.current = !flip.current
  }

  const flipState = flip.current === null ? undefined : flip.current ? "a" : "b"

  return (
    <span className="tms-col" aria-hidden="true">
      <span
        className="tms-strip"
        data-flip={flipState}
        style={{ transform: `translateY(${-Number(d) * 1.5}em)` }}
      >
        {"0123456789".split("").map((n) => (
          <span key={n}>{n}</span>
        ))}
      </span>
    </span>
  )
}

function formatLabel(
  val: number,
  h24: boolean,
  showSeconds: boolean
): {
  time: string
  mer: string
  hours: number
  mins: number
  secs: number
} {
  if (showSeconds) {
    const t = wrapSec(Math.round(val))
    const h = Math.floor(t / 3600)
    const mm = String(Math.floor((t % 3600) / 60)).padStart(2, "0")
    const ss = String(t % 60).padStart(2, "0")

    if (h24) {
      return {
        time: `${String(h).padStart(2, "0")}:${mm}:${ss}`,
        mer: "",
        hours: h,
        mins: Math.floor((t % 3600) / 60),
        secs: t % 60,
      }
    }
    const h12 = h % 12 || 12
    return {
      time: `${h12}:${mm}:${ss}`,
      mer: h < 12 ? "AM" : "PM",
      hours: h,
      mins: Math.floor((t % 3600) / 60),
      secs: t % 60,
    }
  }

  // Minute mode
  const t = wrapMin(Math.round(val))
  const h = Math.floor(t / 60)
  const mm = String(t % 60).padStart(2, "0")
  if (h24) {
    return {
      time: `${String(h).padStart(2, "0")}:${mm}`,
      mer: "",
      hours: h,
      mins: t % 60,
      secs: 0,
    }
  }
  return {
    time: `${h % 12 || 12}:${mm}`,
    mer: h < 12 ? "AM" : "PM",
    hours: h,
    mins: t % 60,
    secs: 0,
  }
}

export type TimeScrubberVariant = "default" | "outline" | "card" | "ghost"

export interface TimeScrubberProps {
  /** Display seconds in readout and enable continuous second-advancing ruler */
  showSeconds?: boolean
  /** Snap step: in seconds if showSeconds=true (e.g. 1, 5, 15, 60), or in minutes if showSeconds=false (e.g. 1, 5, 15) */
  step?: number | string
  /** Fling momentum carry factor: 0..100 (default: 50) */
  momentum?: number
  /** Time format: "12h" or "24h" (default: "12h") */
  format?: "12h" | "24h"
  /** Corner radius in pixels (default: 20) */
  corner?: number
  /** Start time (seconds or minutes). If undefined or "now", starts at current time */
  start?: number | "now"
  /** Controlled value */
  value?: number
  /** Callback fired when time changes */
  onChange?: (
    value: number,
    formatted: {
      time: string
      mer: string
      hours: number
      mins: number
      secs: number
    }
  ) => void
  /** Auto-sync live clock when untouched (default: false) */
  live?: boolean
  /** Timezone string (e.g. "Asia/Ho_Chi_Minh") */
  timeZone?: string
  /** Play subtle mechanical click audio when crossing ticks (default: true) */
  sound?: boolean
  /** Visual variant (default: "default") */
  variant?: TimeScrubberVariant
  /** Show a "Reset to Now" button if scrubbed away from live time */
  showReset?: boolean
  /** Show hour and minute text markers underneath ticks */
  showHours?: boolean
  /** Expand edge-to-edge / full width in its parent container */
  fullWidth?: boolean
  /** Live movement style: "smooth" (continuous 60fps sweep) or "step" (crisp 1s physical hops) */
  tickMode?: "smooth" | "step"
  /** Pixels per unit (px per second if showSeconds, or px per minute). Defaults to 3.5 for seconds, 2.0 for minutes */
  pxPerUnit?: number
  /** Additional CSS class names */
  className?: string
}

export function TimeScrubber({
  showSeconds = false,
  step,
  momentum = 50,
  format = "12h",
  corner = 20,
  start,
  value,
  onChange,
  live = false,
  timeZone,
  sound = true,
  variant = "default",
  showReset = false,
  showHours = true,
  fullWidth = false,
  tickMode = "smooth",
  pxPerUnit,
  className,
}: TimeScrubberProps) {
  const isSec = Boolean(showSeconds)
  const DAY_UNIT = isSec ? DAY_SEC : DAY_MIN
  const PX = pxPerUnit ?? (isSec ? 3.5 : 2.0)
  const defaultStep = isSec ? 5 : 15
  const stepNum = Math.max(1, Number(step) || defaultStep)

  const wrapVal = (v: number) => ((v % DAY_UNIT) + DAY_UNIT) % DAY_UNIT

  const initialTime = useMemo(() => {
    if (typeof value === "number") return wrapVal(value)
    if (typeof start === "number") {
      if (isSec && start <= 1440) return wrapVal(start * 60)
      return wrapVal(start)
    }
    if (isSec) {
      return getSecondsFromMidnight(timeZone).totalSeconds
    }
    return getMinutesFromMidnight(timeZone)
  }, [value, start, timeZone, isSec])

  const [pos, setPos] = useState(initialTime)
  const [hasScrubbed, setHasScrubbed] = useState(false)
  const [rulerWidth, setRulerWidth] = useState(fullWidth ? 800 : 320)

  const p = useRef({ x: initialTime, v: 0, to: initialTime })
  const raf = useRef(0)
  const ruler = useRef<HTMLDivElement>(null)
  const drag = useRef<null | {
    x: number
    t: number
    v: number
    k: number
  }>(null)

  const knobs = useRef({ step: stepNum, momentum, sound, isSec })
  knobs.current = { step: stepNum, momentum, sound, isSec }

  const lastStep = useRef(Math.floor(initialTime / stepNum))
  const isControlled = typeof value === "number"

  /* Synchronize controlled value changes */
  useEffect(() => {
    if (isControlled && typeof value === "number" && drag.current === null) {
      p.current.to = value
      p.current.x = value
      setPos(value)
    }
  }, [value, isControlled])

  /* Measure actual ruler width for responsive dial math */
  useEffect(() => {
    const el = ruler.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width
        if (w > 0) setRulerWidth(w)
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* A tick sound under the thumb for every step crossed */
  const hear = (x: number) => {
    const s = knobs.current.step
    const k = Math.floor(x / s)
    if (k === lastStep.current) return
    lastStep.current = k
    if (knobs.current.sound) {
      const rounded = wrapVal(Math.round(x))
      const isMajor = isSec ? rounded % 60 === 0 : rounded % 60 === 0
      playTick(isMajor)
    }
  }

  const set = (x: number) => {
    p.current.x = x
    hear(x)
    setPos(x)
    if (onChange) {
      const res = formatLabel(x, format === "24h", isSec)
      onChange(wrapVal(Math.round(x)), res)
    }
  }

  /* One spring for the throw and the snap */
  const run = () => {
    if (raf.current) return
    let prev = 0
    const tick = (t: number) => {
      const dt = prev ? clamp((t - prev) / 16.67, 0, 2.5) : 1
      prev = t
      const c = p.current
      /* Tuned spring constants for critical damping */
      const springK = isSec ? 0.045 : 0.022
      const springD = isSec ? 0.32 : 0.26
      c.v += ((c.to - c.x) * springK - c.v * springD) * dt
      const x = c.x + c.v * dt
      if (Math.abs(c.to - x) < 0.01 && Math.abs(c.v) < 0.01) {
        c.v = 0
        set(c.to)
        raf.current = 0
        return
      }
      set(x)
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    return () => {
      cancelAnimationFrame(raf.current)
      raf.current = 0
    }
  }, [])

  /* Spring navigate to target time */
  const goTo = (to: number, v = p.current.v) => {
    p.current.to = to
    p.current.v = v
    if (STILLNESS()) {
      p.current.v = 0
      set(to)
      return
    }
    run()
  }

  /* ── Live Clock Synchronization ───────────────────────── */
  useEffect(() => {
    if (!live) return

    // Smooth 60fps continuous sweep mode
    if (isSec && tickMode === "smooth") {
      let animId = 0
      const continuousTick = () => {
        if (drag.current === null && !hasScrubbed && raf.current === 0) {
          const now = getSecondsFromMidnight(timeZone)
          set(now.totalSeconds)
        }
        animId = requestAnimationFrame(continuousTick)
      }
      animId = requestAnimationFrame(continuousTick)
      return () => cancelAnimationFrame(animId)
    }

    // Step mode (discrete physical hops per second / minute)
    const intervalMs = isSec ? 1000 : 1000
    const interval = setInterval(() => {
      if (drag.current !== null || raf.current !== 0) return
      if (hasScrubbed) return

      if (isSec) {
        const now = getSecondsFromMidnight(timeZone)
        const targetSec = Math.floor(now.totalSeconds)
        goTo(targetSec, 0)
      } else {
        const nowMins = getMinutesFromMidnight(timeZone)
        goTo(nowMins, 0)
      }
    }, intervalMs)

    return () => clearInterval(interval)
  }, [live, isSec, tickMode, timeZone, hasScrubbed])

  /* Reset to live system time */
  const handleResetNow = () => {
    setHasScrubbed(false)
    if (isSec) {
      const now = getSecondsFromMidnight(timeZone)
      const s = knobs.current.step
      const rounded = Math.round(now.totalSeconds / s) * s
      goTo(rounded, 0)
    } else {
      const nowMins = getMinutesFromMidnight(timeZone)
      const s = knobs.current.step
      const rounded = Math.round(nowMins / s) * s
      goTo(rounded, 0)
    }
  }

  /* ── Pointer Drag Mechanics ──────────────────────────── */
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
    cancelAnimationFrame(raf.current)
    raf.current = 0
    const rect = e.currentTarget.getBoundingClientRect()
    const k = rect.width / e.currentTarget.offsetWidth || 1
    drag.current = { x: e.clientX, t: performance.now(), v: 0, k }
    p.current.v = 0
    setHasScrubbed(true)
  }

  const onMove = (e: React.PointerEvent) => {
    const g = drag.current
    if (!g) return
    const now = performance.now()
    /* left is later: ruler moves under fixed needle */
    const dm = -(e.clientX - g.x) / g.k / PX
    const dt = Math.max(1, now - g.t) / 16.67
    g.v = g.v * 0.5 + (dm / dt) * 0.5
    g.x = e.clientX
    g.t = now
    set(p.current.x + dm)
  }

  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = drag.current
    drag.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
    if (!g) return
    const v = performance.now() - g.t > 80 ? 0 : clamp(g.v, -20, 20)
    const s = knobs.current.step
    const carry = 8 + (clamp(knobs.current.momentum, 0, 100) / 100) * 35
    const land = Math.round((p.current.x + v * carry) / s) * s
    goTo(land, v * 0.6)
  }

  /* Trackpad horizontal swipe listener */
  useEffect(() => {
    const el = ruler.current
    if (!el) return
    let idle = 0
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      cancelAnimationFrame(raf.current)
      raf.current = 0
      setHasScrubbed(true)
      set(p.current.x + e.deltaX / PX)
      clearTimeout(idle)
      idle = window.setTimeout(() => {
        const s = knobs.current.step
        goTo(Math.round(p.current.x / s) * s, 0)
      }, 120)
    }
    el.addEventListener("wheel", wheel, { passive: false })
    return () => {
      el.removeEventListener("wheel", wheel)
      clearTimeout(idle)
    }
  }, [PX])

  /* ── Visible Ticks in Window ─────────────────────────── */
  const half = Math.max(80, (rulerWidth - 36) / 2)
  const span = half / PX + (isSec ? 15 : 10)
  const ticks: {
    unit: number
    x: number
    f: number
    kind: "hour" | "minute" | "quarter" | "five" | "second"
  }[] = []

  if (isSec) {
    // Generate seconds ticks
    const startS = Math.floor(pos - span)
    const endS = Math.ceil(pos + span)
    for (let s = startS; s <= endS; s++) {
      const x = (s - pos) * PX
      const f = clamp(1 - Math.pow(Math.abs(x) / half, 2), 0, 1)
      const w = wrapSec(s)

      let kind: "hour" | "minute" | "quarter" | "five" | "second" = "second"
      if (w % 3600 === 0) kind = "hour"
      else if (w % 60 === 0) kind = "minute"
      else if (w % 15 === 0) kind = "quarter"
      else if (w % 5 === 0) kind = "five"

      ticks.push({ unit: s, x, f, kind })
    }
  } else {
    // Generate minutes ticks
    for (let m = Math.ceil((pos - span) / 5) * 5; m <= pos + span; m += 5) {
      const x = (m - pos) * PX
      const f = clamp(1 - Math.pow(Math.abs(x) / half, 2), 0, 1)
      const w = wrapMin(m)
      ticks.push({
        unit: m,
        x,
        f,
        kind: w % 60 === 0 ? "hour" : w % 15 === 0 ? "quarter" : "five",
      })
    }
  }

  const h24 = format === "24h"
  const { time, mer } = formatLabel(pos, h24, isSec)
  const uniqueId = useId()

  const variantClasses = {
    default: "bg-card text-foreground border border-border shadow",
    outline: "bg-transparent text-foreground border border-border",
    card: "bg-neutral-900 text-neutral-100 dark:bg-neutral-950 border border-white/10 shadow-lg",
    ghost: "bg-transparent text-foreground border-transparent shadow-none",
  }[variant]

  return (
    <div
      className={cn(
        "tms-root relative select-none",
        fullWidth && "tms-full",
        variantClasses,
        className
      )}
      style={
        {
          "--tms-r": `${Math.max(0, corner)}px`,
        } as React.CSSProperties
      }
    >
      <TimeScrubberStyles id={uniqueId} />

      {/* Header bar: Time Readout & Optional Reset */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex-1" />
        <div
          className="tms-read"
          aria-live="polite"
          aria-label={`${time} ${mer}`}
        >
          <span className="tms-time">
            {time.split("").map((c, i) =>
              c === ":" ? (
                <span key={`c${i}`} className="tms-colon">
                  :
                </span>
              ) : (
                <Digit key={`d-${time.length - i}`} d={c} />
              )
            )}
          </span>
          {mer && <span className="tms-mer">{mer}</span>}
        </div>

        <div className="flex flex-1 justify-end">
          {showReset && hasScrubbed && (
            <button
              type="button"
              onClick={handleResetNow}
              className="rounded-full border border-border/80 bg-muted/60 px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              title="Reset to current time"
            >
              Now
            </button>
          )}
        </div>
      </div>

      {/* Elastic Ruler Dial */}
      <div
        ref={ruler}
        className="tms-ruler"
        role="slider"
        tabIndex={0}
        aria-label="Time Scrubber"
        aria-valuetext={`${time} ${mer}`}
        aria-valuenow={wrapVal(Math.round(pos))}
        aria-valuemin={0}
        aria-valuemax={DAY_UNIT - 1}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={(e) => {
          const d =
            e.key === "ArrowRight"
              ? stepNum
              : e.key === "ArrowLeft"
                ? -stepNum
                : 0
          if (!d) return
          e.preventDefault()
          setHasScrubbed(true)
          goTo(Math.round(p.current.to / stepNum) * stepNum + d, 0)
        }}
      >
        <div className="tms-track">
          {ticks.map((t) => (
            <span
              key={t.unit}
              className="tms-tick"
              data-kind={t.kind}
              style={{
                transform: `translateX(${t.x.toFixed(2)}px) scaleY(${(0.55 + 0.45 * t.f).toFixed(3)})`,
                opacity: 0.18 + 0.82 * t.f,
              }}
            />
          ))}

          {showHours &&
            (isSec
              ? ticks
                  .filter((t) => t.kind === "minute" || t.kind === "hour")
                  .map((t) => {
                    const w = wrapSec(t.unit)
                    const mins = Math.floor(w / 60)
                    const h = Math.floor(mins / 60)
                    const m = mins % 60
                    const hrStr = h24
                      ? String(h).padStart(2, "0")
                      : String(h % 12 || 12)
                    const mStr = String(m).padStart(2, "0")
                    const isHr = m === 0
                    const hrLabel =
                      isHr && !h24
                        ? `${hrStr}:00 ${h < 12 ? "AM" : "PM"}`
                        : `${hrStr}:${mStr}`

                    return (
                      <span
                        key={`l${t.unit}`}
                        className={cn(
                          "tms-hour",
                          isHr && "font-semibold text-foreground/90"
                        )}
                        style={{
                          transform: `translateX(${t.x.toFixed(2)}px) translateX(-50%)`,
                          opacity: 0.15 + 0.85 * t.f,
                        }}
                      >
                        {hrLabel}
                      </span>
                    )
                  })
              : ticks
                  .filter((t) => t.kind === "hour")
                  .map((t) => {
                    const h = Math.floor(wrapMin(t.unit) / 60)
                    const hrLabel = h24
                      ? String(h).padStart(2, "0")
                      : `${h % 12 || 12} ${h < 12 ? "AM" : "PM"}`
                    return (
                      <span
                        key={`l${t.unit}`}
                        className="tms-hour"
                        style={{
                          transform: `translateX(${t.x.toFixed(2)}px) translateX(-50%)`,
                          opacity: 0.15 + 0.85 * t.f,
                        }}
                      >
                        {hrLabel}
                      </span>
                    )
                  }))}
        </div>

        {/* Central Red Needle Mark */}
        <span className="tms-mark" aria-hidden="true" />
      </div>
    </div>
  )
}

function TimeScrubberStyles({ id }: { id: string }) {
  return (
    <style>{`
      .tms-root {
        width: 100%;
        max-width: 340px;
        padding: 20px 20px 16px;
        border-radius: var(--tms-r, 16px);
        user-select: none;
        -webkit-user-select: none;
        box-sizing: border-box;
      }

      .tms-root.tms-full {
        width: 100%;
        max-width: 100%;
        padding: 24px 24px 20px;
      }

      .tms-read {
        display: inline-flex;
        align-items: baseline;
        justify-content: center;
        gap: 6px;
      }

      .tms-time {
        display: inline-flex;
        font-size: 32px;
        font-weight: 500;
        line-height: 1;
        letter-spacing: -0.03em;
        font-variant-numeric: tabular-nums;
      }

      .tms-full .tms-time {
        font-size: clamp(32px, 5vw, 54px);
        font-weight: 500;
        letter-spacing: -0.035em;
      }

      .tms-col {
        display: inline-block;
        height: 1.5em;
        margin: -0.25em 0;
        overflow: hidden;
        mask-image: linear-gradient(transparent, #000 30%, #000 70%, transparent);
        -webkit-mask-image: linear-gradient(transparent, #000 30%, #000 70%, transparent);
      }

      .tms-strip {
        display: flex;
        flex-direction: column;
        transition: transform 220ms cubic-bezier(0.24, 1.34, 0.38, 1);
      }

      .tms-strip > span {
        height: 1.5em;
        line-height: 1.5em;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .tms-strip[data-flip="a"] {
        animation: tms-blur-a 260ms ease-out;
      }

      .tms-strip[data-flip="b"] {
        animation: tms-blur-b 260ms ease-out;
      }

      .tms-colon {
        padding: 0 0.03em;
        opacity: 0.6;
      }

      .tms-mer {
        font-size: 13px;
        font-weight: 500;
        color: var(--color-muted-foreground, #888888);
        letter-spacing: -0.01em;
      }

      .tms-full .tms-mer {
        font-size: clamp(12px, 1.8vw, 18px);
        margin-left: 4px;
      }

      .tms-ruler {
        position: relative;
        height: 60px;
        margin-top: 14px;
        cursor: grab;
        touch-action: pan-y;
        outline: none;
        mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
        -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
        border-radius: 10px;
      }

      .tms-full .tms-ruler {
        height: 66px;
        margin-top: 20px;
      }

      .tms-ruler:active {
        cursor: grabbing;
      }

      .tms-ruler:focus-visible {
        box-shadow: inset 0 0 0 2px var(--color-ring, #e5484d);
      }

      .tms-track {
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
      }

      .tms-tick {
        position: absolute;
        left: -1px;
        top: 8px;
        border-radius: 1px;
        background: currentColor;
        transform-origin: 50% 0;
      }

      .tms-tick[data-kind="second"] {
        width: 1px;
        height: 7px;
        opacity: 0.28;
      }

      .tms-tick[data-kind="five"] {
        width: 1.5px;
        height: 12px;
        opacity: 0.55;
      }

      .tms-tick[data-kind="quarter"] {
        width: 2px;
        height: 18px;
        opacity: 0.8;
      }

      .tms-tick[data-kind="minute"] {
        width: 2px;
        height: 26px;
        opacity: 1;
      }

      .tms-tick[data-kind="hour"] {
        width: 2.5px;
        height: 28px;
        opacity: 1;
      }

      .tms-hour {
        position: absolute;
        left: 0;
        top: 40px;
        font-size: 11px;
        font-weight: 400;
        white-space: nowrap;
        color: var(--color-muted-foreground, #888888);
        letter-spacing: 0em;
      }

      .tms-mark {
        position: absolute;
        left: 50%;
        top: 2px;
        width: 3px;
        height: 34px;
        margin-left: -1.5px;
        border-radius: 2px;
        background: #e5484d;
        box-shadow: 0 0 8px rgba(229, 72, 77, 0.45);
      }

      .tms-full .tms-mark {
        height: 38px;
      }

      @keyframes tms-blur-a {
        from { filter: blur(2px); }
        to { filter: blur(0); }
      }

      @keyframes tms-blur-b {
        from { filter: blur(2px); }
        to { filter: blur(0); }
      }
    `}</style>
  )
}

/* Aliases for backwards compatibility and ergonomic import */
export { TimeScrubber as Scrub }
export { TimeScrubber as FlipClock }
