import { Check, Power } from "lucide-react"
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react"
import React, {
  type MouseEvent,
  type PointerEvent,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

import { cn } from "@/shared/lib/utils"

export type SlideVariant = "unlock" | "power" | "confirm"

export interface SlideToUnlockProps {
  /** Style preset. "unlock" = classic iOS unlock, "power" = iOS slide to power off, "confirm" = action/payment. @default "unlock" */
  variant?: SlideVariant
  /** Main track label. Defaults to "slide to unlock" | "slide to power off" | "slide to confirm". */
  label?: string
  /** Readout while onConfirm runs. */
  confirmingLabel?: string
  /** Readout once completed. */
  doneLabel?: string
  /** Custom icon inside the thumb. */
  icon?: React.ReactNode
  /** Async or sync callback executed upon slide commitment. */
  onConfirm?: () => Promise<unknown> | unknown
  /** Milliseconds before auto-resetting. Pass null to stay in done state. @default 2400 */
  resetAfter?: number | null
  /** Track height in pixels. @default 56 */
  height?: number
  /** Thumb width in pixels. @default 64 */
  thumbWidth?: number
  /** Disabled state. */
  disabled?: boolean
  className?: string
  /** Accessible label for assistive technology. */
  "aria-label"?: string
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const
const COMMIT_AT = 0.88
const FLICK_SPEED = 850
const FLICK_FROM = 0.4
const OVERDRAG = 8
const TAP_SLOP = 4

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function band(raw: number, max: number) {
  if (raw > max) {
    return max + OVERDRAG * (1 - Math.exp(-(raw - max) / 40))
  }
  if (raw < 0) {
    return -OVERDRAG * (1 - Math.exp(raw / 40))
  }
  return raw
}

// ─── Classic iOS Filled Block Arrow ──────────────────────────────────────────

const BlockArrow = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn("size-5", className)}
    aria-hidden="true"
  >
    <path d="M4 10.25h8.5v-4.25l7.5 6-7.5 6v-4.25H4z" />
  </svg>
)

export function SlideToUnlock({
  variant = "unlock",
  label,
  confirmingLabel,
  doneLabel,
  icon,
  onConfirm = () => wait(1000),
  resetAfter = 2400,
  height = 56,
  thumbWidth = 64,
  disabled = false,
  className,
  "aria-label": ariaLabel,
}: SlideToUnlockProps) {
  const defaultLabel =
    variant === "power"
      ? "slide to power off"
      : variant === "confirm"
        ? "slide to confirm"
        : "slide to unlock"

  const defaultConfirming =
    variant === "power"
      ? "Powering off…"
      : variant === "confirm"
        ? "Processing…"
        : "Unlocking…"

  const defaultDone =
    variant === "power"
      ? "Power off"
      : variant === "confirm"
        ? "Confirmed"
        : "Unlocked"

  const resolvedLabel = label ?? defaultLabel
  const resolvedConfirming = confirmingLabel ?? defaultConfirming
  const resolvedDone = doneLabel ?? defaultDone

  const [phase, setPhase] = useState<
    "idle" | "dragging" | "confirming" | "done"
  >("idle")
  const [armed, setArmed] = useState(false)
  const reduceMotion = useReducedMotion()

  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ pointer: 0, from: 0, moved: false })
  const runRef = useRef(0)
  const confirmRef = useRef(onConfirm)
  confirmRef.current = onConfirm

  const x = useMotionValue(0)
  const width = useMotionValue(0)
  const cover = useMotionValue(0)
  const uniqueId = useId()
  const animId = uniqueId.replace(/:/g, "")

  const inset = 4
  const border = 1
  const innerHeight = height - border * 2
  const thumbHeight = innerHeight - inset * 2
  const outerRadius = Math.round(height * 0.38)
  const thumbRadius = Math.max(6, outerRadius - border - inset)
  const thumbSlot = thumbWidth + (inset + border) * 2

  const max = () =>
    Math.max(0, width.get() - border * 2 - thumbWidth - inset * 2)

  // Label opacity fades smoothly as thumb slides across
  const labelOpacity = useTransform(
    [x, width],
    ([currentX, totalWidth]: number[]) => {
      const travel = Math.max(
        1,
        totalWidth - border * 2 - thumbWidth - inset * 2
      )
      const progress = currentX / travel
      return Math.max(0, 1 - progress * 1.5)
    }
  )

  // Dynamic fill behind the thumb with concentric corner radius
  const fillClip = useTransform(
    [x, width, cover],
    ([currentX, totalWidth, covered]: number[]) => {
      const innerW = Math.max(0, totalWidth - border * 2)
      const endOffset =
        (1 - covered) * Math.max(0, innerW - currentX - inset - thumbWidth / 2)
      return `inset(0px ${endOffset}px 0px 0px round ${outerRadius}px)`
    }
  )
  const fillOpacity = useTransform(x, (currentX) => Math.min(1, currentX / 20))

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    const observer = new ResizeObserver(() => {
      const before = width.get()
      const newWidth = track.offsetWidth
      width.set(newWidth)
      const currentMax = Math.max(
        0,
        newWidth - border * 2 - thumbWidth - inset * 2
      )
      if (before > 0 && x.get() >= currentMax) {
        x.set(currentMax)
      }
    })
    observer.observe(track)
    return () => observer.disconnect()
  }, [thumbWidth, width, x])

  useEffect(
    () => () => {
      runRef.current += 1
    },
    []
  )

  const spring = (velocity = 0) =>
    reduceMotion
      ? { duration: 0.15, ease: EASE_OUT }
      : { type: "spring" as const, stiffness: 450, damping: 38, velocity }

  const settleBack = (velocity = 0) => {
    setArmed(false)
    setPhase("idle")
    animate(cover, 0, { duration: reduceMotion ? 0 : 0.25, ease: EASE_OUT })
    animate(x, 0, spring(velocity))
  }

  const rewind = () => {
    setArmed(false)
    setPhase("idle")
    const duration = reduceMotion ? 0 : 0.5
    animate(cover, 0, { duration: duration * 0.6, ease: EASE_OUT })
    animate(x, 0, { duration, ease: EASE_IN_OUT })
  }

  const commit = async (velocity: number, glide = false) => {
    const run = ++runRef.current
    const alive = () => runRef.current === run
    setPhase("confirming")
    setArmed(true)

    const landing = animate(
      x,
      max(),
      glide && !reduceMotion
        ? { duration: 0.36, ease: EASE_IN_OUT }
        : spring(velocity)
    )
    const flooding = animate(cover, 1, {
      duration: reduceMotion ? 0 : 0.3,
      ease: EASE_OUT,
    })

    try {
      await Promise.all([confirmRef.current(), wait(700), landing, flooding])
    } catch {
      if (alive()) settleBack()
      return
    }
    if (!alive()) return

    setPhase("done")
    if (resetAfter === null) return
    await wait(resetAfter)
    if (alive()) rewind()
  }

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (disabled || phase !== "idle" || event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    x.stop()
    dragRef.current = { pointer: event.clientX, from: x.get(), moved: false }
    setPhase("dragging")
  }

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (phase !== "dragging") return
    const drag = dragRef.current
    const delta = event.clientX - drag.pointer
    if (Math.abs(delta) > TAP_SLOP) {
      drag.moved = true
    }
    const raw = drag.from + delta
    x.set(band(raw, max()))
    const isArmed = raw >= max() * COMMIT_AT
    if (isArmed !== armed) {
      setArmed(isArmed)
    }
  }

  const onPointerUp = () => {
    if (phase !== "dragging") return
    if (!dragRef.current.moved) {
      setPhase("idle")
      return
    }
    const velocity = x.getVelocity()
    const progress = x.get() / Math.max(1, max())
    const flicked = velocity > FLICK_SPEED && progress > FLICK_FROM
    if (progress >= COMMIT_AT || flicked) {
      commit(velocity)
    } else {
      settleBack(velocity)
    }
  }

  const onClick = async (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled || phase !== "idle") return
    // Enter / Space bar confirmation
    if (event.detail === 0) {
      commit(0, true)
      return
    }
    if (dragRef.current.moved || reduceMotion) return
    // Gentle bounce hint on plain click
    await animate(x, 26, { duration: 0.16, ease: EASE_OUT })
    if (phase === "idle") {
      animate(x, 0, spring())
    }
  }

  const busy = phase === "confirming"
  const done = phase === "done"

  const defaultIcon =
    variant === "power" ? (
      <Power className="size-5 text-red-500" strokeWidth={2.5} />
    ) : (
      <BlockArrow className="text-zinc-500 dark:text-zinc-600" />
    )

  const resolvedIcon = icon ?? defaultIcon

  return (
    <div
      className={cn("relative w-full max-w-sm select-none", className)}
      data-phase={phase}
      data-variant={variant}
    >
      <motion.div
        ref={trackRef}
        className={cn(
          "relative overflow-hidden border transition-colors",
          variant === "power"
            ? "border-red-950/50 bg-zinc-950/90 dark:border-red-900/40 dark:bg-zinc-950/90"
            : "border-zinc-800/80 bg-zinc-900/90 backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/90",
          disabled && "pointer-events-none opacity-50"
        )}
        style={{ height, borderRadius: outerRadius }}
      >
        {/* 1. Shimmering iOS Track Label (Centered in the visible track opening) */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 flex items-center justify-center"
          style={{
            left: thumbSlot,
            right: 0,
            opacity: labelOpacity,
          }}
        >
          <span
            className={cn(
              "font-sans text-[15px] font-normal tracking-wide lowercase select-none",
              variant === "power" ? "ios-shimmer-power" : "ios-shimmer-text"
            )}
          >
            {resolvedLabel}
          </span>
        </motion.div>

        {/* 2. Dynamic Wipe Fill Layer */}
        <motion.div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 transition-all duration-300 ease-out",
            done
              ? variant === "power"
                ? "bg-gradient-to-r from-red-700 via-red-600 to-red-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]"
                : "bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]"
              : variant === "power"
                ? "bg-red-950/80"
                : "bg-zinc-800/80 dark:bg-zinc-800"
          )}
          style={{
            clipPath: fillClip,
            opacity: fillOpacity,
            borderRadius: outerRadius,
          }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={phase}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.2, ease: EASE_OUT }
              }
              className="absolute inset-y-0 flex items-center justify-center text-[15px] font-medium tracking-normal text-white select-none"
              style={
                done || busy
                  ? {
                      left: 0,
                      right: thumbSlot,
                    }
                  : {
                      left: thumbSlot,
                      right: 0,
                    }
              }
            >
              <span>
                {busy
                  ? resolvedConfirming
                  : done
                    ? resolvedDone
                    : resolvedLabel}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* 3. iOS Squircle Thumb Button */}
        <motion.button
          type="button"
          role="slider"
          aria-label={ariaLabel ?? `${resolvedLabel}. Press Enter to confirm.`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round((x.get() / Math.max(1, max())) * 100)}
          aria-disabled={disabled || phase !== "idle"}
          className={cn(
            "absolute flex touch-none items-center justify-center outline-none select-none",
            "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.12)]",
            "focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900",
            phase === "idle" &&
              !disabled &&
              "cursor-grab active:cursor-grabbing",
            phase === "dragging" && "cursor-grabbing"
          )}
          onClick={onClick}
          onPointerCancel={onPointerUp}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{
            x,
            left: inset,
            top: inset,
            width: thumbWidth,
            height: thumbHeight,
            borderRadius: thumbRadius,
          }}
        >
          <div className="relative flex items-center justify-center">
            {/* Custom / Default Arrow or Power Icon */}
            <div
              className={cn(
                "transition-all duration-200",
                armed && !busy && !done && "translate-x-0.5",
                (busy || done) && "scale-50 opacity-0 blur-[2px]"
              )}
            >
              {resolvedIcon}
            </div>

            {/* Done Success Checkmark */}
            <Check
              aria-hidden="true"
              className={cn(
                "absolute size-5 text-emerald-600 transition-all duration-200 dark:text-emerald-500",
                done && variant !== "power"
                  ? "scale-100 opacity-100"
                  : "scale-50 opacity-0 blur-[2px]"
              )}
              strokeWidth={2.75}
            />

            {/* Power off completed icon */}
            <Power
              aria-hidden="true"
              className={cn(
                "absolute size-5 text-red-600 transition-all duration-200",
                done && variant === "power"
                  ? "scale-100 opacity-100"
                  : "scale-50 opacity-0 blur-[2px]"
              )}
              strokeWidth={2.75}
            />

            {/* Spinner for async confirmation */}
            <svg
              aria-hidden="true"
              className={cn(
                "absolute size-5 animate-spin transition-opacity duration-200",
                busy ? "opacity-100" : "pointer-events-none opacity-0"
              )}
              viewBox="0 0 24 24"
            >
              <circle
                className="stroke-zinc-300"
                cx="12"
                cy="12"
                fill="none"
                r="9"
                strokeWidth="2.5"
              />
              <circle
                className="stroke-zinc-800 dark:stroke-zinc-900"
                cx="12"
                cy="12"
                fill="none"
                r="9"
                strokeDasharray="14 43"
                strokeLinecap="round"
                strokeWidth="2.5"
              />
            </svg>
          </div>
        </motion.button>
      </motion.div>

      {/* Screen Reader Announcements */}
      <span aria-live="polite" className="sr-only">
        {busy && resolvedConfirming}
        {done && resolvedDone}
      </span>

      {/* Scoped iOS Shimmer Animation */}
      <style>{`
        @keyframes ios-shimmer-${animId} {
          0% {
            background-position: -180% 0;
          }
          100% {
            background-position: 180% 0;
          }
        }

        .ios-shimmer-text {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.28) 0%,
            rgba(255, 255, 255, 0.35) 30%,
            rgba(255, 255, 255, 0.98) 50%,
            rgba(255, 255, 255, 0.35) 70%,
            rgba(255, 255, 255, 0.28) 100%
          );
          background-size: 220% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: ios-shimmer-${animId} 2.6s infinite linear;
        }

        .ios-shimmer-power {
          background: linear-gradient(
            90deg,
            rgba(239, 68, 68, 0.35) 0%,
            rgba(239, 68, 68, 0.45) 30%,
            rgba(255, 255, 255, 0.98) 50%,
            rgba(239, 68, 68, 0.45) 70%,
            rgba(239, 68, 68, 0.35) 100%
          );
          background-size: 220% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: ios-shimmer-${animId} 2.6s infinite linear;
        }
      `}</style>
    </div>
  )
}

export const SlideToConfirm = SlideToUnlock
export type SlideToConfirmProps = SlideToUnlockProps
export default SlideToUnlock
