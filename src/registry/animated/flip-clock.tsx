/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"

import { cn } from "@/shared/lib/utils"

export type FlipClockSize = "sm" | "md" | "lg" | "xl" | "full"
export type FlipClockVariant = "default" | "blueprint" | "amber" | "outline"
export type FlipClockMode =
  "clock" | "date-time" | "countdown" | "stopwatch" | "counter"

export interface FlipClockProps {
  /** Mode of operation */
  mode?: FlipClockMode
  /** Direct numerical or string value (for "counter" mode) */
  value?: string | number
  /** Label for counter mode */
  label?: string
  /** Target date/time for "countdown" mode */
  targetDate?: Date | string | number
  /** Countdown duration in seconds (alternative to targetDate) */
  durationSeconds?: number
  /** Pause or resume the clock/timer */
  isPaused?: boolean
  /** 12-hour clock format instead of 24-hour */
  format12h?: boolean
  /** Display AM / PM indicator in 12h clock mode */
  showAmPm?: boolean
  /** Display Days group (countdown mode) */
  showDays?: boolean
  /** Display Day of Week (e.g., MON, TUE) in date-time mode */
  showDayOfWeek?: boolean
  /** Display Day of Month in date-time mode */
  showDate?: boolean
  /** Display Month in date-time mode */
  showMonth?: boolean
  /** Display Year in date-time mode */
  showYear?: boolean
  /** Display Hours group */
  showHours?: boolean
  /** Display Minutes group */
  showMinutes?: boolean
  /** Display Seconds group */
  showSeconds?: boolean
  /** Display text labels underneath cards (HOURS, MINUTES, etc.) */
  showLabels?: boolean
  /** Display mechanical separators (colons or slashes) */
  showSeparators?: boolean
  /** Separator character */
  separator?: string
  /** Size scale: sm, md, lg, xl, full */
  size?: FlipClockSize
  /** Time zone string (e.g. "Asia/Ho_Chi_Minh") for timezone-aware display */
  timeZone?: string
  /** Visual theme variant */
  variant?: FlipClockVariant
  /** Plays mechanical procedural split-flap audio click on update */
  sound?: boolean
  /** Callback fired when countdown timer reaches zero */
  onComplete?: () => void
  /** Additional CSS class names */
  className?: string
}

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

const SIZE_CONFIG: Record<
  FlipClockSize,
  {
    cardW: string
    cardH: string
    fontSize: string
    gap: string
    labelClass: string
    separatorClass: string
    groupGap: string
  }
> = {
  sm: {
    cardW: "w-[28px] sm:w-[32px]",
    cardH: "h-[42px] sm:h-[48px]",
    fontSize: "text-[20px] sm:text-[24px]",
    gap: "gap-[2px]",
    labelClass: "text-[8px] tracking-wider mt-1.5",
    separatorClass: "text-[16px] sm:text-[18px]",
    groupGap: "gap-1",
  },
  md: {
    cardW: "w-[44px] sm:w-[52px]",
    cardH: "h-[66px] sm:h-[78px]",
    fontSize: "text-[32px] sm:text-[38px]",
    gap: "gap-[3px]",
    labelClass: "text-[9px] sm:text-[10px] tracking-widest mt-2",
    separatorClass: "text-[26px] sm:text-[30px]",
    groupGap: "gap-1.5",
  },
  lg: {
    cardW: "w-[60px] sm:w-[72px]",
    cardH: "h-[90px] sm:h-[108px]",
    fontSize: "text-[44px] sm:text-[52px]",
    gap: "gap-[3px]",
    labelClass: "text-[10px] tracking-widest mt-2.5",
    separatorClass: "text-[38px] sm:text-[44px]",
    groupGap: "gap-2",
  },
  xl: {
    cardW: "w-[80px] sm:w-[96px]",
    cardH: "h-[120px] sm:h-[144px]",
    fontSize: "text-[56px] sm:text-[68px]",
    gap: "gap-[4px]",
    labelClass: "text-[11px] sm:text-xs tracking-widest mt-3",
    separatorClass: "text-[50px] sm:text-[60px]",
    groupGap: "gap-2.5",
  },
  full: {
    cardW: "flex-1 min-w-[20px] sm:min-w-[28px] max-w-[140px] aspect-[2/3]",
    cardH: "h-auto",
    fontSize: "text-[clamp(14px,74cqw,120px)]",
    gap: "gap-1 sm:gap-1.5",
    labelClass:
      "text-[9px] sm:text-[10px] md:text-xs tracking-wider sm:tracking-widest mt-1 sm:mt-1.5",
    separatorClass: "text-base sm:text-xl md:text-2xl lg:text-3xl",
    groupGap: "gap-1.5 sm:gap-2.5 md:gap-3.5",
  },
}

/* -------------------------------------------------------------------------- */
/*  VARIANT STYLES                                                              */
/* -------------------------------------------------------------------------- */

interface VariantStyle {
  card: string
  border: string
  divider: string
  label: string
  separator: string
  shadow: string
}

const VARIANT_STYLES: Record<FlipClockVariant, VariantStyle> = {
  default: {
    card: "bg-neutral-900 text-neutral-50",
    border: "border-neutral-800",
    divider: "bg-black/90",
    label: "text-neutral-400",
    separator: "text-neutral-500",
    shadow: "shadow-[0_4px_16px_rgba(0,0,0,0.5)]",
  },
  outline: {
    card: "bg-background text-foreground",
    border: "border-border",
    divider: "bg-border/60",
    label: "text-muted-foreground",
    separator: "text-muted-foreground/60",
    shadow: "shadow-xs shadow-black/20",
  },
  blueprint: {
    card: "bg-[#061325] text-[#38bdf8]",
    border: "border-sky-400/30",
    divider: "bg-sky-950",
    label: "text-sky-400/75",
    separator: "text-sky-400/60",
    shadow: "shadow-[0_0_16px_rgba(56,189,248,0.18)]",
  },
  amber: {
    card: "bg-[#190e03] text-[#fbbf24]",
    border: "border-amber-500/30",
    divider: "bg-amber-950",
    label: "text-amber-400/75",
    separator: "text-amber-400/60",
    shadow: "shadow-[0_0_16px_rgba(245,158,11,0.18)]",
  },
}

interface FlipCardProps {
  digit: string
  cardW: string
  cardH: string
  fontSize: string
  vs: VariantStyle
  isFull?: boolean
}

/* Total flip animation duration in milliseconds */
const FLIP_DURATION_MS = 600

/**
 * Injects CSS @keyframes for 3D flip animations.
 * Rendered once at the top of the component tree — idempotent via React key.
 */
function FlipClockStyles() {
  return (
    <style>{`
      @keyframes flipTop {
        0%   { transform: rotateX(0deg); }
        100% { transform: rotateX(-90deg); }
      }
      @keyframes flipBottom {
        0%   { transform: rotateX(90deg); }
        80%  { transform: rotateX(-4deg); }
        90%  { transform: rotateX(2deg); }
        100% { transform: rotateX(0deg); }
      }
      @keyframes flapDarken {
        0%   { opacity: 0; }
        100% { opacity: 0.6; }
      }
      @keyframes flapLighten {
        0%   { opacity: 0.5; }
        100% { opacity: 0; }
      }
      @keyframes flapShadow {
        0%   { opacity: 0; }
        30%  { opacity: 1; }
        60%  { opacity: 0.7; }
        100% { opacity: 0; }
      }
    `}</style>
  )
}

function FlipCard({
  digit,
  cardH,
  cardW,
  fontSize,
  vs,
  isFull,
}: FlipCardProps) {
  const [current, setCurrent] = useState(digit)
  const [previous, setPrevious] = useState(digit)
  const [flipKey, setFlipKey] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (digit !== current) {
      setPrevious(current)
      setCurrent(digit)
      setIsFlipping(true)
      setFlipKey((k) => k + 1)

      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setIsFlipping(false)
        setPrevious(digit)
      }, FLIP_DURATION_MS)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [digit, current])

  const textContainer = cn(
    "absolute right-0 left-0 flex h-[200%] items-center justify-center leading-none font-black tracking-tight select-none",
    isFull ? "text-[clamp(14px,74cqw,120px)]" : fontSize
  )

  const topHalfBase = cn(
    "absolute inset-x-0 top-0 h-[calc(50%-1px)] overflow-hidden select-none",
    "border-x border-t",
    vs.border,
    vs.card
  )

  const bottomHalfBase = cn(
    "absolute inset-x-0 bottom-0 h-[calc(50%-1px)] overflow-hidden select-none",
    "border-x border-b",
    vs.border,
    vs.card
  )

  const textStyle = isFull
    ? { fontSize: "clamp(14px, 74cqw, 120px)" }
    : undefined

  return (
    <div
      className={cn(
        "relative flex-shrink-0 overflow-hidden rounded select-none sm:rounded-md",
        cardW,
        cardH,
        vs.shadow,
        isFull &&
          "[container-type:inline-size] aspect-[2/3] max-w-[140px] min-w-[20px] flex-1 sm:min-w-[28px]"
      )}
      style={{
        perspective: "800px",
        perspectiveOrigin: "50% 50%",
        ...(isFull ? { containerType: "inline-size" } : {}),
      }}
    >
      {/* ── Mechanical Center Divider (Groove) ── */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-40 -translate-y-1/2">
        {/* Shadow below the groove */}
        <div className="absolute inset-x-0 top-[1px] h-[2px] bg-black/40 blur-[0.5px]" />
        {/* Main groove line */}
        <div className={cn("absolute inset-x-0 top-0 h-[2px]", vs.divider)} />
        {/* Highlight on top edge of groove for depth illusion */}
        <div className="absolute inset-x-0 -top-px h-px bg-white/[0.04]" />
        {/* Small side notches for mechanical feel */}
        <div className="absolute -top-[3px] left-0 h-[8px] w-[3px] rounded-r-sm bg-black/30" />
        <div className="absolute -top-[3px] right-0 h-[8px] w-[3px] rounded-l-sm bg-black/30" />
      </div>

      {/* ── Static Top Half — always shows the CURRENT digit ── */}
      <div
        className={cn(topHalfBase, "z-[1]")}
        style={{ backfaceVisibility: "hidden" }}
      >
        <div className={cn(textContainer, "top-0")} style={textStyle}>
          {current}
        </div>
        {/* Subtle inner shadow at bottom edge */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.07] via-transparent to-black/[0.18]" />
      </div>

      {/* ── Static Bottom Half — shows previous during flip, current after ── */}
      <div
        className={cn(bottomHalfBase, "z-[1]")}
        style={{ backfaceVisibility: "hidden" }}
      >
        <div className={cn(textContainer, "bottom-0")} style={textStyle}>
          {isFlipping ? previous : current}
        </div>
        {/* Subtle inner lighting */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/[0.18] via-transparent to-white/[0.03]" />
      </div>

      {/* ── Animated Flipping Top Flap — folds down 0° → −180° ── */}
      {isFlipping && (
        <div
          key={`top-flap-${flipKey}`}
          className={cn(topHalfBase, "z-[20]")}
          style={{
            transformOrigin: "50% 100%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            willChange: "transform",
            animation: `flipTop ${FLIP_DURATION_MS * 0.5}ms cubic-bezier(0.32, 0.72, 0.37, 1.02) forwards`,
          }}
        >
          <div className={cn(textContainer, "top-0")} style={textStyle}>
            {previous}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.07] via-transparent to-black/[0.18]" />
          {/* Darkening overlay as flap rotates away */}
          <div
            className="pointer-events-none absolute inset-0 bg-black"
            style={{
              animation: `flapDarken ${FLIP_DURATION_MS * 0.5}ms ease-in forwards`,
            }}
          />
        </div>
      )}

      {/* ── Animated Flipping Bottom Flap — unfolds 90° → 0° with subtle bounce ── */}
      {isFlipping && (
        <div
          key={`bot-flap-${flipKey}`}
          className={cn(bottomHalfBase, "z-[30]")}
          style={{
            transformOrigin: "50% 0%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            willChange: "transform",
            animation: `flipBottom ${FLIP_DURATION_MS * 0.6}ms cubic-bezier(0.15, 0.85, 0.3, 1.06) ${FLIP_DURATION_MS * 0.35}ms forwards`,
            transform: "rotateX(90deg)",
          }}
        >
          <div className={cn(textContainer, "bottom-0")} style={textStyle}>
            {current}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/[0.18] via-transparent to-white/[0.03]" />
          {/* Lightening overlay as flap settles in */}
          <div
            className="pointer-events-none absolute inset-0 bg-black"
            style={{
              opacity: 0.5,
              animation: `flapLighten ${FLIP_DURATION_MS * 0.55}ms ease-out ${FLIP_DURATION_MS * 0.35}ms forwards`,
            }}
          />
        </div>
      )}

      {/* ── Shadow cast by flipping flap onto bottom half ── */}
      {isFlipping && (
        <div
          key={`shadow-${flipKey}`}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-1/2"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 60%)",
            animation: `flapShadow ${FLIP_DURATION_MS}ms ease-in-out forwards`,
          }}
        />
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  DIGIT GROUP (e.g. "09" -> two FlipCards side by side)                      */
/* -------------------------------------------------------------------------- */

interface DigitGroupProps {
  value: string
  label?: string
  showLabels: boolean
  sc: (typeof SIZE_CONFIG)[FlipClockSize]
  vs: VariantStyle
  isFull?: boolean
}

function DigitGroup({
  value,
  label,
  showLabels,
  sc,
  vs,
  isFull,
}: DigitGroupProps) {
  const digits = value.split("")
  const count = digits.length
  return (
    <div
      className={cn("flex flex-col items-center", isFull && "w-full min-w-0")}
      style={isFull ? { flex: `${count} ${count} 0%` } : undefined}
    >
      <div className={cn("flex w-full items-center justify-center", sc.gap)}>
        {digits.map((d, i) => (
          <FlipCard
            key={i}
            digit={d}
            cardW={sc.cardW}
            cardH={sc.cardH}
            fontSize={sc.fontSize}
            vs={vs}
            isFull={isFull}
          />
        ))}
      </div>
      {showLabels && label && (
        <span
          className={cn(
            "text-center font-semibold tracking-wider whitespace-nowrap uppercase",
            sc.labelClass,
            vs.label
          )}
        >
          {label}
        </span>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  SEPARATOR                                                                   */
/* -------------------------------------------------------------------------- */

interface SepProps {
  char: string
  sc: (typeof SIZE_CONFIG)[FlipClockSize]
  vs: VariantStyle
  isFull?: boolean
}

function Separator({ char, sc, vs, isFull }: SepProps) {
  return (
    <span
      className={cn(
        "flex-shrink-0 leading-none font-extrabold select-none",
        isFull
          ? "self-center px-0.5 text-base sm:px-1 sm:text-xl md:text-2xl lg:text-3xl"
          : cn("self-start", sc.separatorClass),
        vs.separator
      )}
      style={isFull ? undefined : { marginTop: "0.38em" }}
    >
      {char}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/*  HELPER                                                                      */
/* -------------------------------------------------------------------------- */

function pad(n: number, width = 2): string {
  return String(n).padStart(width, "0")
}

/* -------------------------------------------------------------------------- */
/*  MAIN COMPONENT                                                              */
/* -------------------------------------------------------------------------- */

export function FlipClock({
  mode = "clock",
  value,
  label,
  targetDate,
  durationSeconds,
  isPaused = false,
  format12h = false,
  showAmPm = true,
  showDays = true,
  showDayOfWeek = true,
  showDate = true,
  showMonth = true,
  showYear = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  showLabels = true,
  showSeparators = true,
  separator = ":",
  size = "md",
  timeZone,
  variant = "default",
  sound = false,
  onComplete,
  className,
}: FlipClockProps) {
  const [displayValues, setDisplayValues] = useState<Record<string, string>>({})

  const onCompleteRef = useRef(onComplete)
  const soundRef = useRef(sound)
  const valueRef = useRef(value)
  const completedFiredRef = useRef(false)
  const isPausedRef = useRef(isPaused)

  const stopwatchStartMsRef = useRef(0)
  const stopwatchAccumulatedMsRef = useRef(0)
  const lastPauseMsRef = useRef<number | null>(null)
  const targetMsRef = useRef<number>(0)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])
  useEffect(() => {
    soundRef.current = sound
  }, [sound])
  useEffect(() => {
    valueRef.current = value
  }, [value])
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  useEffect(() => {
    completedFiredRef.current = false
    if (targetDate) {
      targetMsRef.current = new Date(targetDate).getTime()
    } else if (durationSeconds !== undefined) {
      targetMsRef.current = Date.now() + durationSeconds * 1000
    }
  }, [targetDate, durationSeconds])

  useEffect(() => {
    if (mode !== "stopwatch") return
    if (isPaused) {
      lastPauseMsRef.current = Date.now()
    } else {
      if (lastPauseMsRef.current !== null) {
        stopwatchAccumulatedMsRef.current += Date.now() - lastPauseMsRef.current
        lastPauseMsRef.current = null
      }
    }
  }, [isPaused, mode])

  const playSound = useCallback(() => {
    if (!soundRef.current || typeof window === "undefined") return
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = "sine"
      osc.frequency.setValueAtTime(140, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.035)

      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.035)
    } catch {
      /* AudioContext muted or not allowed */
    }
  }, [])

  const computeDisplayValues = useCallback((): Record<string, string> => {
    if (mode === "counter") {
      return { counter: String(valueRef.current ?? 0) }
    }

    if (mode === "stopwatch") {
      const now = Date.now()
      if (!stopwatchStartMsRef.current) stopwatchStartMsRef.current = now
      const pausedOffset = lastPauseMsRef.current
        ? now - lastPauseMsRef.current
        : 0
      const totalMs = Math.max(
        0,
        now -
          stopwatchStartMsRef.current -
          stopwatchAccumulatedMsRef.current -
          pausedOffset
      )
      const elapsedSec = Math.floor(totalMs / 1000)
      return {
        hours: pad(Math.floor(elapsedSec / 3600)),
        minutes: pad(Math.floor((elapsedSec % 3600) / 60)),
        seconds: pad(elapsedSec % 60),
      }
    }

    if (mode === "countdown") {
      const remainingMs = targetMsRef.current - Date.now()
      if (remainingMs <= 0) {
        if (!completedFiredRef.current) {
          completedFiredRef.current = true
          onCompleteRef.current?.()
        }
        return { days: "00", hours: "00", minutes: "00", seconds: "00" }
      }
      const diffSec = Math.ceil(remainingMs / 1000)
      return {
        days: pad(Math.floor(diffSec / (3600 * 24))),
        hours: pad(Math.floor((diffSec % (3600 * 24)) / 3600)),
        minutes: pad(Math.floor((diffSec % 3600) / 60)),
        seconds: pad(diffSec % 60),
      }
    }

    const now = new Date()
    let hours = now.getHours()
    let minutes = now.getMinutes()
    let seconds = now.getSeconds()
    let ampm = "AM"

    if (timeZone) {
      try {
        const parts = new Intl.DateTimeFormat("en-US", {
          timeZone,
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: false,
        }).formatToParts(now)
        const h = parts.find((p) => p.type === "hour")?.value
        const m = parts.find((p) => p.type === "minute")?.value
        const s = parts.find((p) => p.type === "second")?.value
        if (h !== undefined) hours = parseInt(h, 10)
        if (m !== undefined) minutes = parseInt(m, 10)
        if (s !== undefined) seconds = parseInt(s, 10)
      } catch {
        /* fallback to local browser time */
      }
    }

    if (format12h) {
      ampm = hours >= 12 ? "PM" : "AM"
      hours = hours % 12 || 12
    }

    if (mode === "date-time") {
      return {
        dow: DAY_NAMES[now.getDay()] ?? "SUN",
        date: pad(now.getDate()),
        month: pad(now.getMonth() + 1),
        year: String(now.getFullYear()),
        hours: pad(hours),
        minutes: pad(minutes),
        seconds: pad(seconds),
      }
    }

    return {
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
      ampm,
    }
  }, [mode, format12h, timeZone])

  useEffect(() => {
    // Defer initial value so it's not synchronous inside the effect body
    queueMicrotask(() => {
      setDisplayValues(computeDisplayValues())
    })
    if (mode === "counter") return

    const timerId = setInterval(() => {
      if (isPausedRef.current) return
      setDisplayValues(computeDisplayValues())
      playSound()
    }, 1000)

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        setDisplayValues(computeDisplayValues())
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      clearInterval(timerId)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [mode, computeDisplayValues, playSound])

  useEffect(() => {
    if (mode === "counter") {
      queueMicrotask(() => {
        setDisplayValues(computeDisplayValues())
        playSound()
      })
    }
  }, [value, mode, computeDisplayValues, playSound])

  const sc = SIZE_CONFIG[size]
  const vs = VARIANT_STYLES[variant]
  const id = useId()
  const isFull = size === "full"

  const groups = useMemo(() => {
    if (mode === "counter") {
      return (
        <div
          className={cn(
            "flex items-end",
            isFull
              ? "w-full max-w-2xl justify-center gap-1 sm:gap-2"
              : sc.groupGap
          )}
        >
          <DigitGroup
            value={displayValues.counter ?? "0"}
            label={label}
            showLabels={showLabels}
            sc={sc}
            vs={vs}
            isFull={isFull}
          />
        </div>
      )
    }

    if (mode === "date-time") {
      return (
        <div
          className={cn(
            "flex flex-col items-center gap-3 sm:gap-5",
            isFull && "w-full"
          )}
        >
          {/* Row 1: Day of Week + Calendar Date */}
          <div
            className={cn(
              "flex items-end justify-center",
              isFull
                ? "w-full max-w-4xl flex-wrap gap-x-3 gap-y-2.5 sm:flex-nowrap sm:gap-x-4 md:gap-x-6"
                : sc.groupGap
            )}
          >
            {showDayOfWeek && (
              <div
                className={cn(
                  "flex items-end justify-center",
                  isFull &&
                    "w-full basis-full sm:w-auto sm:max-w-[28%] sm:flex-[3_3_0%] sm:basis-0"
                )}
              >
                <div
                  className={cn(
                    isFull &&
                      "flex w-full max-w-[150px] justify-center sm:max-w-none"
                  )}
                >
                  <DigitGroup
                    value={displayValues.dow ?? "MON"}
                    label="DAY"
                    showLabels={showLabels}
                    sc={sc}
                    vs={vs}
                    isFull={isFull}
                  />
                </div>
              </div>
            )}

            {(showDate || showMonth || showYear) && (
              <div
                className={cn(
                  "flex items-end justify-center",
                  isFull
                    ? cn(
                        "gap-1 sm:gap-1.5 md:gap-2",
                        showDayOfWeek
                          ? "w-full max-w-full min-w-0 basis-full sm:w-auto sm:flex-[10_10_0%] sm:basis-0"
                          : "w-full max-w-3xl"
                      )
                    : sc.groupGap
                )}
              >
                {showDate && (
                  <DigitGroup
                    value={displayValues.date ?? "01"}
                    label="DATE"
                    showLabels={showLabels}
                    sc={sc}
                    vs={vs}
                    isFull={isFull}
                  />
                )}
                {showMonth && (
                  <>
                    {showDate && showSeparators && (
                      <Separator char="/" sc={sc} vs={vs} isFull={isFull} />
                    )}
                    <DigitGroup
                      value={displayValues.month ?? "01"}
                      label="MONTH"
                      showLabels={showLabels}
                      sc={sc}
                      vs={vs}
                      isFull={isFull}
                    />
                  </>
                )}
                {showYear && (
                  <>
                    {(showDate || showMonth) && showSeparators && (
                      <Separator char="/" sc={sc} vs={vs} isFull={isFull} />
                    )}
                    <DigitGroup
                      value={displayValues.year ?? "2025"}
                      label="YEAR"
                      showLabels={showLabels}
                      sc={sc}
                      vs={vs}
                      isFull={isFull}
                    />
                  </>
                )}
              </div>
            )}
          </div>

          {/* Row 2: Clock Time (Hours : Minutes : Seconds) */}
          <div
            className={cn(
              "flex items-end justify-center",
              isFull ? "w-full max-w-2xl gap-1 sm:gap-2 md:gap-3" : sc.groupGap
            )}
          >
            {showHours && (
              <DigitGroup
                value={displayValues.hours ?? "00"}
                label="HOURS"
                showLabels={showLabels}
                sc={sc}
                vs={vs}
                isFull={isFull}
              />
            )}
            {showSeparators && showHours && showMinutes && (
              <Separator char={separator} sc={sc} vs={vs} isFull={isFull} />
            )}
            {showMinutes && (
              <DigitGroup
                value={displayValues.minutes ?? "00"}
                label="MINUTES"
                showLabels={showLabels}
                sc={sc}
                vs={vs}
                isFull={isFull}
              />
            )}
            {showSeconds && (
              <>
                {showSeparators && showMinutes && (
                  <Separator char={separator} sc={sc} vs={vs} isFull={isFull} />
                )}
                <DigitGroup
                  value={displayValues.seconds ?? "00"}
                  label="SECONDS"
                  showLabels={showLabels}
                  sc={sc}
                  vs={vs}
                  isFull={isFull}
                />
              </>
            )}
          </div>
        </div>
      )
    }

    const isCountdown = mode === "countdown"

    return (
      <div
        className={cn(
          "flex items-end",
          isFull
            ? "w-full max-w-5xl justify-center gap-1.5 sm:gap-2.5 md:gap-3.5"
            : sc.groupGap
        )}
      >
        {isCountdown && showDays && (
          <>
            <DigitGroup
              value={displayValues.days ?? "00"}
              label="DAYS"
              showLabels={showLabels}
              sc={sc}
              vs={vs}
              isFull={isFull}
            />
            {showSeparators && (
              <Separator char={separator} sc={sc} vs={vs} isFull={isFull} />
            )}
          </>
        )}
        {showHours && (
          <DigitGroup
            value={displayValues.hours ?? "00"}
            label="HOURS"
            showLabels={showLabels}
            sc={sc}
            vs={vs}
            isFull={isFull}
          />
        )}
        {showSeparators && showHours && showMinutes && (
          <Separator char={separator} sc={sc} vs={vs} isFull={isFull} />
        )}
        {showMinutes && (
          <DigitGroup
            value={displayValues.minutes ?? "00"}
            label="MINUTES"
            showLabels={showLabels}
            sc={sc}
            vs={vs}
            isFull={isFull}
          />
        )}
        {showSeconds && (
          <>
            {showSeparators && (showMinutes || showHours) && (
              <Separator char={separator} sc={sc} vs={vs} isFull={isFull} />
            )}
            <DigitGroup
              value={displayValues.seconds ?? "00"}
              label="SECONDS"
              showLabels={showLabels}
              sc={sc}
              vs={vs}
              isFull={isFull}
            />
          </>
        )}
        {format12h && showAmPm && mode === "clock" && (
          <DigitGroup
            value={displayValues.ampm ?? "AM"}
            label="PERIOD"
            showLabels={showLabels}
            sc={sc}
            vs={vs}
            isFull={isFull}
          />
        )}
      </div>
    )
  }, [
    mode,
    displayValues,
    label,
    showLabels,
    showDayOfWeek,
    showDate,
    showMonth,
    showYear,
    showHours,
    showMinutes,
    showSeconds,
    showSeparators,
    separator,
    format12h,
    showAmPm,
    showDays,
    sc,
    vs,
    isFull,
  ])

  return (
    <div
      id={id}
      className={cn(
        "relative flex flex-col items-center justify-center select-none",
        isFull && "@container w-full max-w-full",
        className
      )}
    >
      <FlipClockStyles />
      {groups}
    </div>
  )
}
