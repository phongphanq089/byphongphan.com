import {
  animate,
  type AnimationPlaybackControls,
  motion,
  type MotionValue,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react"
import {
  type ComponentProps,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
} from "react"

import { getAudioContext, isSoundMuted } from "@/shared/lib/sound"
import { cn } from "@/shared/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui"

/**
 * Calligraphic multi-stroke SVG paths spelling "Phong Phan" + drafting flourish
 * calibrated for a 264×74 architectural baseline grid.
 */
const STROKE_PHONG =
  "M 14 52 C 19 36, 26 20, 32 10 C 46 8, 57 12, 54 22 C 51 31, 35 34, 24 31 C 21 30, 26 39, 32 43 C 37 33, 42 18, 45 11 C 47 7, 50 9, 48 16 C 45 27, 41 37, 39 44 C 42 36, 46 30, 50 31 C 54 32, 52 40, 54 43 C 55 44, 58 42, 61 39 C 64 33, 68 30, 71 32 C 74 34, 65 44, 62 42 C 59 40, 65 32, 70 35 C 72 36, 74 37, 77 35 C 79 32, 81 31, 81 35 L 79 43 C 81 36, 85 31, 88 32 C 91 33, 89 41, 91 43 C 92 44, 95 41, 98 37 C 102 32, 107 31, 108 33 C 103 33, 98 39, 101 43 C 104 46, 108 38, 110 34 C 107 46, 103 58, 98 63 C 93 66, 88 61, 92 55 C 96 49, 108 46, 116 47"

const STROKE_PHAN =
  "M 128 48 C 133 34, 138 21, 143 11 C 155 8, 168 11, 165 21 C 162 30, 144 33, 136 30 C 134 29, 140 38, 147 43 C 151 33, 156 18, 158 12 C 160 8, 163 10, 161 17 C 158 28, 155 37, 154 44 C 157 36, 161 31, 165 32 C 169 33, 167 41, 169 43 C 170 44, 173 41, 176 38 C 181 32, 185 30, 187 33 C 181 33, 176 39, 179 43 C 182 45, 187 37, 189 34 L 187 43 C 189 43, 191 41, 195 36 C 197 32, 199 31, 198 36 L 197 43 C 200 36, 204 31, 207 32 C 210 33, 209 40, 211 43 C 215 45, 232 41, 250 36"

const STROKE_FLOURISH = "M 34 57 C 96 55, 174 52, 244 49"

const PHONG_END = { x: 116, y: 47 }
const PHAN_START = { x: 128, y: 48 }
const PHAN_END = { x: 250, y: 36 }
const FLOURISH_START = { x: 34, y: 57 }

const PHONG_DURATION = 0.88
const HOP_ONE_DURATION = 0.14
const PHAN_DURATION = 0.82
const HOP_TWO_DURATION = 0.24
const FLOURISH_DURATION = 0.34

const DRAW_EASE = [0.35, 0, 0.55, 1] as const
const FLOURISH_EASE = [0.22, 1, 0.36, 1] as const
const PEN_EASE = [0.25, 0.46, 0.45, 0.94] as const
const PEN_LAND_DURATION = 0.16
const PEN_LIFT_DURATION = 0.22
const PEN_LIFT_OVERLAP = 0.06
const PEN_LIFT_DISTANCE = 13
const PEN_ANGLE = 42
const INK_FADE_DURATION = 0.3
const IN_VIEW_MARGIN = "0px 0px -80px 0px"

interface SignatureTimelineValues {
  phongProgress: MotionValue<number>
  hopOneProgress: MotionValue<number>
  phanProgress: MotionValue<number>
  hopTwoProgress: MotionValue<number>
  flourishProgress: MotionValue<number>
  inkOpacity: MotionValue<number>
  penLift: MotionValue<number>
}

interface StrokeLengths {
  phong?: number
  phan?: number
  flourish?: number
}

function getSafePoint(
  path: SVGPathElement | null,
  cachedLength: number | undefined,
  progress: number,
  fallback: { x: number; y: number }
): { point: { x: number; y: number }; length: number | undefined } {
  if (!path) return { point: fallback, length: cachedLength }
  const total = cachedLength ?? path.getTotalLength()
  const clamped = Math.min(1, Math.max(0, progress))
  const pt = path.getPointAtLength(clamped * total)
  return { point: { x: pt.x, y: pt.y }, length: total }
}

function lerpPoint(
  from: { x: number; y: number },
  to: { x: number; y: number },
  t: number,
  arcHeight: number
) {
  const clamped = Math.min(1, Math.max(0, t))
  const lift = Math.sin(clamped * Math.PI) * arcHeight
  return {
    x: from.x + (to.x - from.x) * clamped,
    y: from.y + (to.y - from.y) * clamped - lift,
  }
}

/**
 * Synthesizes an understated technical-pen-on-vellum audio cue via Web Audio API.
 * Only called on explicit user click so scroll animations never violate autoplay UX.
 */
function usePenScratchAudio() {
  const activeNodesRef = useRef<{
    stop: () => void
  } | null>(null)

  useEffect(() => {
    return () => {
      activeNodesRef.current?.stop()
    }
  }, [])

  return useCallback(() => {
    if (isSoundMuted()) return
    const ctx = getAudioContext()
    if (!ctx) return

    activeNodesRef.current?.stop()

    try {
      const totalSeconds =
        PEN_LAND_DURATION +
        PHONG_DURATION +
        HOP_ONE_DURATION +
        PHAN_DURATION +
        HOP_TWO_DURATION +
        FLOURISH_DURATION +
        0.05

      const sampleCount = Math.floor(ctx.sampleRate * totalSeconds)
      const noiseBuffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate)
      const channel = noiseBuffer.getChannelData(0)

      // Soft pink-ish paper grain noise
      let lastOut = 0
      for (let i = 0; i < sampleCount; i++) {
        const white = Math.random() * 2 - 1
        channel[i] = (lastOut + 0.08 * white) / 1.08
        lastOut = channel[i]
        channel[i] *= 1.8
      }

      const source = ctx.createBufferSource()
      source.buffer = noiseBuffer

      const filter = ctx.createBiquadFilter()
      filter.type = "bandpass"
      filter.frequency.value = 2650
      filter.Q.value = 1.6

      const gain = ctx.createGain()
      const t0 = ctx.currentTime

      // Envelope tracks real nib-to-paper contact across all 3 strokes + aerial hops
      const tPhongStart = t0 + PEN_LAND_DURATION
      const tHop1Start = tPhongStart + PHONG_DURATION
      const tPhanStart = tHop1Start + HOP_ONE_DURATION
      const tHop2Start = tPhanStart + PHAN_DURATION
      const tFlourishStart = tHop2Start + HOP_TWO_DURATION
      const tEnd = tFlourishStart + FLOURISH_DURATION

      gain.gain.setValueAtTime(0.0001, t0)
      gain.gain.setValueAtTime(0.0001, tPhongStart)
      gain.gain.linearRampToValueAtTime(0.045, tPhongStart + 0.06)
      gain.gain.setValueAtTime(0.038, tHop1Start - 0.03)
      gain.gain.linearRampToValueAtTime(0.0001, tHop1Start)

      gain.gain.setValueAtTime(0.0001, tPhanStart)
      gain.gain.linearRampToValueAtTime(0.045, tPhanStart + 0.05)
      gain.gain.setValueAtTime(0.036, tHop2Start - 0.03)
      gain.gain.linearRampToValueAtTime(0.0001, tHop2Start)

      gain.gain.setValueAtTime(0.0001, tFlourishStart)
      gain.gain.linearRampToValueAtTime(0.055, tFlourishStart + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.0001, tEnd)

      source.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      source.start(t0)
      source.stop(tEnd + 0.02)

      activeNodesRef.current = {
        stop: () => {
          try {
            source.stop()
            source.disconnect()
            filter.disconnect()
            gain.disconnect()
          } catch {
            // Already stopped
          }
        },
      }
    } catch {
      // Ignore constrained AudioContext environments
    }
  }, [])
}

function drawSignatureSequence(values: SignatureTimelineValues) {
  const {
    phongProgress,
    hopOneProgress,
    phanProgress,
    hopTwoProgress,
    flourishProgress,
    inkOpacity,
    penLift,
  } = values

  // Reset all channels cleanly for deterministic click-to-replay
  phongProgress.set(0)
  hopOneProgress.set(0)
  phanProgress.set(0)
  hopTwoProgress.set(0)
  flourishProgress.set(0)

  return animate([
    [penLift, [1, 0], { duration: PEN_LAND_DURATION, ease: PEN_EASE }],
    [inkOpacity, [0, 1], { duration: 0 }],
    [phongProgress, [0, 1], { duration: PHONG_DURATION, ease: DRAW_EASE }],

    // Hop 1: Phong -> Phan
    [penLift, [0, 0.55, 0], { duration: HOP_ONE_DURATION, ease: PEN_EASE }],
    [
      hopOneProgress,
      [0, 1],
      {
        duration: HOP_ONE_DURATION,
        ease: PEN_EASE,
        at: `<`,
      },
    ],

    // Stroke 2: Phan
    [phanProgress, [0, 1], { duration: PHAN_DURATION, ease: DRAW_EASE }],

    // Hop 2: sweep back for drafting underline flourish
    [penLift, [0, 0.85, 0], { duration: HOP_TWO_DURATION, ease: PEN_EASE }],
    [
      hopTwoProgress,
      [0, 1],
      {
        duration: HOP_TWO_DURATION,
        ease: FLOURISH_EASE,
        at: `<`,
      },
    ],

    // Stroke 3: Crisp drafting underline flourish + mid-stroke pen lift
    [
      flourishProgress,
      [0, 1],
      { duration: FLOURISH_DURATION, ease: FLOURISH_EASE },
    ],
    [
      penLift,
      [0, 1],
      {
        duration: PEN_LIFT_DURATION,
        ease: PEN_EASE,
        at: `-${PEN_LIFT_OVERLAP}`,
      },
    ],
  ])
}

function fadeInSignature({
  phongProgress,
  hopOneProgress,
  phanProgress,
  hopTwoProgress,
  flourishProgress,
  inkOpacity,
  penLift,
}: SignatureTimelineValues) {
  phongProgress.set(1)
  hopOneProgress.set(1)
  phanProgress.set(1)
  hopTwoProgress.set(1)
  flourishProgress.set(1)
  penLift.set(1)
  return animate(inkOpacity, [0, 1], { duration: INK_FADE_DURATION })
}

export interface PhongPhanSignatureProps extends Omit<
  ComponentProps<"button">,
  "children"
> {
  /** Show subtle interactive replay tooltip (defaults to true). */
  showTooltip?: boolean
}

/**
 * Interactive calligraphic "Phong Phan" signature crafted for the Swiss Drafting canvas.
 *
 * Enhancements over a basic single-stroke SVG draw:
 * - Multi-stroke choreography (`Phong` -> aerial hop -> `Phan` -> underline flourish)
 * - Dual-pass luminous ink bleed (`pp-secondary`) with subtle nib-contact halo
 * - Rotring-inspired technical pen tracking cached SVG path lengths at 60fps
 * - Built-in zero-bundle Web Audio pen-on-vellum synthesis respecting global mute
 */
export function PhongPhanSignature({
  className,
  showTooltip = true,
  onClick,
  ...props
}: PhongPhanSignatureProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const phongRef = useRef<SVGPathElement>(null)
  const phanRef = useRef<SVGPathElement>(null)
  const flourishRef = useRef<SVGPathElement>(null)
  const lengthsRef = useRef<StrokeLengths>({})
  const controlsRef = useRef<AnimationPlaybackControls | null>(null)
  const hasAutoSignedRef = useRef(false)

  const isInView = useInView(buttonRef, {
    once: true,
    amount: "all",
    margin: IN_VIEW_MARGIN,
  })
  const shouldReduceMotion = useReducedMotion()
  const playScratch = usePenScratchAudio()

  const phongProgress = useMotionValue(0)
  const hopOneProgress = useMotionValue(0)
  const phanProgress = useMotionValue(0)
  const hopTwoProgress = useMotionValue(0)
  const flourishProgress = useMotionValue(0)
  const inkOpacity = useMotionValue(0)
  const penLift = useMotionValue(1)

  const nibPosition = useTransform(() => {
    const lift = penLift.get()
    const flourishP = flourishProgress.get()
    const hopTwoP = hopTwoProgress.get()
    const phanP = phanProgress.get()
    const hopOneP = hopOneProgress.get()
    const phongP = phongProgress.get()
    let point = { x: 14, y: 52 }

    if (flourishP > 0) {
      const res = getSafePoint(
        flourishRef.current,
        lengthsRef.current.flourish,
        flourishP,
        FLOURISH_START
      )
      lengthsRef.current.flourish = res.length
      point = res.point
    } else if (hopTwoP > 0) {
      point = lerpPoint(PHAN_END, FLOURISH_START, hopTwoP, 10)
    } else if (phanP > 0) {
      const res = getSafePoint(
        phanRef.current,
        lengthsRef.current.phan,
        phanP,
        PHAN_START
      )
      lengthsRef.current.phan = res.length
      point = res.point
    } else if (hopOneP > 0) {
      point = lerpPoint(PHONG_END, PHAN_START, hopOneP, 4)
    } else {
      const res = getSafePoint(
        phongRef.current,
        lengthsRef.current.phong,
        phongP,
        { x: 14, y: 52 }
      )
      lengthsRef.current.phong = res.length
      point = res.point
    }

    const offsetDistance = lift * PEN_LIFT_DISTANCE
    const angleRad = (PEN_ANGLE * Math.PI) / 180

    return {
      x: point.x + offsetDistance * Math.sin(angleRad),
      y: point.y - offsetDistance * Math.cos(angleRad),
      contactX: point.x,
      contactY: point.y,
    }
  })

  const penX = useTransform(nibPosition, (p) => p.x)
  const penY = useTransform(nibPosition, (p) => p.y)
  const contactX = useTransform(nibPosition, (p) => p.contactX)
  const contactY = useTransform(nibPosition, (p) => p.contactY)
  const penOpacity = useTransform(penLift, [0, 1], [1, 0])
  const nibContactOpacity = useTransform(penLift, [0, 0.25, 1], [0.85, 0, 0])

  const triggerSign = useCallback(
    (withAudio: boolean) => {
      controlsRef.current?.stop()
      if (withAudio && !shouldReduceMotion) {
        playScratch()
      }

      const values: SignatureTimelineValues = {
        phongProgress,
        hopOneProgress,
        phanProgress,
        hopTwoProgress,
        flourishProgress,
        inkOpacity,
        penLift,
      }

      controlsRef.current = shouldReduceMotion
        ? fadeInSignature(values)
        : drawSignatureSequence(values)
    },
    [
      flourishProgress,
      hopOneProgress,
      hopTwoProgress,
      inkOpacity,
      penLift,
      phanProgress,
      phongProgress,
      playScratch,
      shouldReduceMotion,
    ]
  )

  // Silent initial auto-sign once scrolled into view
  useEffect(() => {
    if (!isInView || hasAutoSignedRef.current) return
    hasAutoSignedRef.current = true
    triggerSign(false)
  }, [isInView, triggerSign])

  useEffect(() => {
    return () => {
      controlsRef.current?.stop()
    }
  }, [])

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    hasAutoSignedRef.current = true
    triggerSign(true)
    onClick?.(event)
  }

  const buttonNode = (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      aria-label="Phong Phan handwritten signature — click to replay"
      className={cn(
        "group relative inline-flex cursor-pointer items-center justify-center rounded-lg px-2 py-1 text-pp-secondary transition-transform duration-150 outline-none hover:brightness-110 focus-visible:ring-2 focus-visible:ring-pp-secondary active:scale-[0.98]",
        className
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 264 74"
        fill="none"
        overflow="visible"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="block h-full w-auto"
      >
        {/* Subtle luminous ink bleed underlay */}
        <g
          className="opacity-25 drop-shadow-[0_0_8px_var(--pp-secondary-glow)]"
          strokeWidth={3.2}
        >
          <motion.path
            d={STROKE_PHONG}
            initial={{ pathSpacing: 2 }}
            style={{ pathLength: phongProgress, opacity: inkOpacity }}
          />
          <motion.path
            d={STROKE_PHAN}
            initial={{ pathSpacing: 2 }}
            style={{ pathLength: phanProgress, opacity: inkOpacity }}
          />
          <motion.path
            d={STROKE_FLOURISH}
            initial={{ pathSpacing: 2 }}
            style={{ pathLength: flourishProgress, opacity: inkOpacity }}
          />
        </g>

        {/* Primary calligraphic ink layer */}
        <g strokeWidth={1.85}>
          <motion.path
            ref={phongRef}
            d={STROKE_PHONG}
            initial={{ pathSpacing: 2 }}
            style={{ pathLength: phongProgress, opacity: inkOpacity }}
          />
          <motion.path
            ref={phanRef}
            d={STROKE_PHAN}
            initial={{ pathSpacing: 2 }}
            style={{ pathLength: phanProgress, opacity: inkOpacity }}
          />
        </g>

        {/* Crisp thinner drafting underline */}
        <motion.path
          ref={flourishRef}
          d={STROKE_FLOURISH}
          strokeWidth={1.35}
          initial={{ pathSpacing: 2 }}
          style={{ pathLength: flourishProgress, opacity: inkOpacity }}
          className="opacity-85"
        />

        {/* Fresh ink contact dot at nib tip */}
        <motion.circle
          cx={0}
          cy={0}
          r={2.2}
          stroke="none"
          className="fill-pp-secondary"
          style={{
            x: contactX,
            y: contactY,
            opacity: nibContactOpacity,
          }}
        />

        {/* Rotring-inspired technical drafting pen */}
        <motion.g
          style={{ x: penX, y: penY, opacity: penOpacity }}
          className="text-foreground/90"
        >
          <DraftingTechnicalPen transform={`rotate(${PEN_ANGLE})`} />
        </motion.g>
      </svg>

      <span className="sr-only">Sign again</span>
    </button>
  )

  if (!showTooltip) return buttonNode

  return (
    <Tooltip>
      <TooltipTrigger asChild>{buttonNode}</TooltipTrigger>
      <TooltipContent side="top" className="font-mono text-[10px]">
        Click to sign again
      </TooltipContent>
    </Tooltip>
  )
}

/**
 * Rotring Isograph-inspired technical drafting pen drawn upright with nib at (0, 0).
 * Barrel fills with `bg-background` to cleanly occlude freshly laid ink underneath,
 * while its calibration collar ring accents in `pp-secondary`.
 */
function DraftingTechnicalPen(props: ComponentProps<"g">) {
  return (
    <g className="fill-background" strokeWidth={1.35} {...props}>
      {/* Upper barrel */}
      <path d="M -4.8 -34 V -74 Q -4.8 -77 -2.4 -77 H 2.4 Q 4.8 -77 4.8 -74 V -34 Z" />
      {/* Precision collar band tinted in ink accent */}
      <path
        className="fill-pp-secondary stroke-pp-secondary"
        d="M -5.4 -30 H 5.4 V -34 H -5.4 Z"
      />
      {/* Grip sleeve */}
      <path d="M -4.2 -14 H 4.2 V -30 H -4.2 Z" />
      {/* Nib cone */}
      <path d="M -1.4 -6 L -4.2 -14 H 4.2 L 1.4 -6 Z" />
      {/* Micro tubular nib point */}
      <path d="M 0 0 V -6" />
    </g>
  )
}

export default PhongPhanSignature
