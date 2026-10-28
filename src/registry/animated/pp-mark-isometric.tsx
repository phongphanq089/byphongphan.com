"use client"

import type { Transition } from "motion/react"
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"
import React, { useEffect, useId, useRef } from "react"

import { cn } from "@/shared/lib/utils"

function playTapSound() {
  if (typeof window === "undefined") return
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
    osc.frequency.setValueAtTime(540, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.06)
    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.06)
  } catch {
    // Ignore audio context errors
  }
}

// Snappy mechanical keycap switch spring transition
const transition: Transition = {
  type: "spring",
  stiffness: 480,
  damping: 26,
  mass: 0.45,
}

// Canonical unpressed wireframe stroke paths (height = 40px)
const STROKE_NORMAL_D =
  "M0 345L0 385M0 345L69.28 305M0 345L346.41 545M0 385L346.41 585M68.64 305L68.64 345M68.64 305L137.92 345M68.64 305L207.21 225M68.64 345L137.92 385M69.28 305L415.69 505M137.92 345L137.92 385M137.92 345L276.49 265M137.92 385L276.49 305M207 225L207 265M207 225L276.28 185M207 225L345.56 305M207 225L345.57 305M207 265L345.56 345M207.21 225L276.49 265M250 360L250 400M250 360L319.28 400M250 360L414.55 265M250 400L319.28 440M276.28 185L414.85 265M276.49 265L276.49 305M319.28 400L319.28 440M319.28 400L483.83 305M319.28 440L483.83 345M334 160L334 200M334 160L403.28 120M334 160L680.41 360M334 200L680.41 400M345.56 305L345.56 345M345.56 305L414.85 265M345.56 345L414.85 305M345.57 305L414.85 265M346.41 545L346.41 585M346.41 545L415.69 505M346.41 585L415.69 545M402.64 120L402.64 160M402.64 120L471.92 160M402.64 120L541.21 40M402.64 160L471.92 200M403.28 120L749.69 320M414.55 265L483.83 305M414.85 265L414.85 305M415.69 505L415.69 545M471.92 160L471.92 200M471.92 160L610.49 80M471.92 200L610.49 120M483.83 305L483.83 345M541 40L541 80M541 40L610.28 0M541 40L679.56 120M541 40L679.57 120M541 80L679.56 160M541.21 40L610.49 80M584 175L584 215M584 175L653.28 215M584 175L748.54 80M584 215L653.28 255M610.28 0L748.85 80M610.49 80L610.49 120M653.28 215L653.28 255M653.28 215L817.83 120M653.28 255L817.83 160M679.56 120L679.56 160M679.56 120L748.85 80M679.56 160L748.85 120M679.57 120L748.85 80M680.41 360L680.41 400M680.41 360L749.69 320M680.41 400L749.69 360M748.54 80L817.83 120M748.85 80L748.85 120M749.69 320L749.69 360M817.83 120L817.83 160"

// Keycap pressed wireframe stroke paths: BASE STAYS FIXED, TOP COMPRESSES DOWN by 24px (height = 16px)
const STROKE_PRESSED_D =
  "M0 369L0 385M0 369L69.28 329M0 369L346.41 569M0 385L346.41 585M68.64 329L68.64 345M68.64 329L137.92 369M68.64 329L207.21 249M68.64 345L137.92 385M69.28 329L415.69 529M137.92 369L137.92 385M137.92 369L276.49 289M137.92 385L276.49 305M207 249L207 265M207 249L276.28 209M207 249L345.56 329M207 249L345.57 329M207 265L345.56 345M207.21 249L276.49 289M250 384L250 400M250 384L319.28 424M250 384L414.55 289M250 400L319.28 440M276.28 209L414.85 289M276.49 289L276.49 305M319.28 424L319.28 440M319.28 424L483.83 329M319.28 440L483.83 345M334 184L334 200M334 184L403.28 144M334 184L680.41 384M334 200L680.41 400M345.56 329L345.56 345M345.56 329L414.85 289M345.56 345L414.85 305M345.57 329L414.85 289M346.41 569L346.41 585M346.41 569L415.69 529M346.41 585L415.69 545M402.64 144L402.64 160M402.64 144L471.92 184M402.64 144L541.21 64M402.64 160L471.92 200M403.28 144L749.69 344M414.55 289L483.83 329M414.85 289L414.85 305M415.69 529L415.69 545M471.92 184L471.92 200M471.92 184L610.49 104M471.92 200L610.49 120M483.83 329L483.83 345M541 64L541 80M541 64L610.28 24M541 64L679.56 144M541 64L679.57 144M541 80L679.56 160M541.21 64L610.49 104M584 199L584 215M584 199L653.28 239M584 199L748.54 104M584 215L653.28 255M610.28 24L748.85 104M610.49 104L610.49 120M653.28 239L653.28 255M653.28 239L817.83 144M653.28 255L817.83 160M679.56 144L679.56 160M679.56 144L748.85 104M679.56 160L748.85 120M679.57 144L748.85 104M680.41 384L680.41 400M680.41 384L749.69 344M680.41 400L749.69 360M748.54 104L817.83 144M748.85 104L748.85 120M749.69 344L749.69 360M817.83 144L817.83 160"

// Canonical unpressed solid 3D side faces (height = 40px)
const SIDE_NORMAL_D =
  "M541 40L679.56 120L679.56 160L541 80ZM679.56 120L748.85 80L748.85 120L679.56 160ZM402.64 120L471.92 160L471.92 200L402.64 160ZM471.92 160L610.49 80L610.49 120L471.92 200ZM334 160L680.41 360L680.41 400L334 200ZM680.41 360L749.69 320L749.69 360L680.41 400ZM584 175L653.28 215L653.28 255L584 215ZM653.28 215L817.83 120L817.83 160L653.28 255ZM207 225L345.56 305L345.56 345L207 265ZM345.56 305L414.85 265L414.85 305L345.56 345ZM68.64 305L137.92 345L137.92 385L68.64 345ZM137.92 345L276.49 265L276.49 305L137.92 385ZM0 345L346.41 545L346.41 585L0 385ZM346.41 545L415.69 505L415.69 545L346.41 585ZM250 360L319.28 400L319.28 440L250 400ZM319.28 400L483.83 305L483.83 345L319.28 440Z"

// Keycap pressed solid 3D side faces: BASE STAYS FIXED, TOP COMPRESSES DOWN by 24px (height = 16px)
const SIDE_PRESSED_D =
  "M541 64L679.56 144L679.56 160L541 80ZM679.56 144L748.85 104L748.85 120L679.56 160ZM402.64 144L471.92 184L471.92 200L402.64 160ZM471.92 184L610.49 104L610.49 120L471.92 200ZM334 184L680.41 384L680.41 400L334 200ZM680.41 384L749.69 344L749.69 360L680.41 400ZM584 199L653.28 239L653.28 255L584 215ZM653.28 239L817.83 144L817.83 160L653.28 255ZM207 249L345.56 329L345.56 345L207 265ZM345.56 329L414.85 289L414.85 305L345.56 345ZM68.64 329L137.92 369L137.92 385L68.64 345ZM137.92 369L276.49 289L276.49 305L137.92 385ZM0 369L346.41 569L346.41 585L0 385ZM346.41 569L415.69 529L415.69 545L346.41 585ZM250 384L319.28 424L319.28 440L250 400ZM319.28 424L483.83 329L483.83 345L319.28 440Z"

// Canonical unpressed solid top faces (8 polygons)
const TOP_NORMAL_D =
  "M610.28 0L748.85 80L679.57 120L541 40ZM541.21 40L610.49 80L471.92 160L402.64 120ZM403.28 120L749.69 320L680.41 360L334 160ZM748.54 80L817.83 120L653.28 215L584 175ZM276.28 185L414.85 265L345.57 305L207 225ZM207.21 225L276.49 265L137.92 345L68.64 305ZM69.28 305L415.69 505L346.41 545L0 345ZM414.55 265L483.83 305L319.28 400L250 360Z"

// Keycap pressed solid top faces: TOP COMPRESSES DOWN by 24px (all Y coordinates +24)
const TOP_PRESSED_D =
  "M610.28 24L748.85 104L679.57 144L541 64ZM541.21 64L610.49 104L471.92 184L402.64 144ZM403.28 144L749.69 344L680.41 384L334 184ZM748.54 104L817.83 144L653.28 239L584 199ZM276.28 209L414.85 289L345.57 329L207 249ZM207.21 249L276.49 289L137.92 369L68.64 329ZM69.28 329L415.69 529L346.41 569L0 369ZM414.55 289L483.83 329L319.28 424L250 384Z"

export interface PPMarkIsometricProps {
  className?: string
  enableSound?: boolean
  IsometricBlueprint?: boolean
  onTap?: () => void
}

/**
 * Phong Phan (PP) Isometric Monogram Mark
 * Isometric 3D Voxel Interactive Blueprint Design with diagonal hatching,
 * sharp wireframe edges, mouse-following radial flashlight, and true 3D keycap press physics.
 */
export function PPMarkIsometric({
  className,
  enableSound = true,
  IsometricBlueprint = true,
  onTap,
}: PPMarkIsometricProps) {
  const id = useId()
  const ids = {
    facePattern: `pp-face-pattern-${id}`,
    radialGradient: `pp-radial-gradient-${id}`,
  }

  const ref = useRef<SVGSVGElement>(null)

  const shouldReduceMotion = useReducedMotion()
  const isInView = useInView(ref, { margin: "80px" })

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const cx = useSpring(useTransform(mouseX, [0, 1], [0, 818]), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  })

  const cy = useSpring(useTransform(mouseY, [0, 1], [0, 585]), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  })

  useEffect(() => {
    if (shouldReduceMotion || !isInView) return
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches
    )
      return

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      mouseX.set((e.clientX - rect.left) / rect.width)
      mouseY.set((e.clientY - rect.top) / rect.height)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [shouldReduceMotion, isInView, mouseX, mouseY])

  return (
    <motion.svg
      ref={ref}
      className={cn(
        "h-auto w-full cursor-pointer touch-manipulation overflow-visible select-none",
        "[--pattern:color-mix(in_oklab,var(--foreground)_25%,transparent)]",
        "[--stroke:color-mix(in_oklab,var(--foreground)_38%,transparent)]",
        className
      )}
      viewBox="0 0 818 585"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      aria-label="Phong Phan Isometric Mark"
      initial="normal"
      whileTap="pressed"
      onTap={() => {
        if (enableSound) playTapSound()
        onTap?.()
      }}
    >
      <defs>
        {/* Diagonal Hatching Pattern with enhanced sharpness */}
        <pattern
          id={ids.facePattern}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2"
            stroke="var(--pattern)"
            strokeWidth="1.25"
          />
        </pattern>

        {/* Cursor-following Radial Gradient Flashlight */}
        <motion.radialGradient
          id={ids.radialGradient}
          cx={cx}
          cy={cy}
          r="260"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            className="[stop-color:var(--primary,#ef4444)] dark:[stop-color:#ffffff]"
            stopColor="var(--primary, #ef4444)"
            stopOpacity="1"
          />
          <stop
            className="[stop-color:var(--primary,#ef4444)] dark:[stop-color:var(--foreground)]"
            offset="0.5"
            stopColor="var(--foreground)"
            stopOpacity="0.45"
          />
          <stop offset="1" stopColor="var(--foreground)" stopOpacity="0" />
        </motion.radialGradient>
      </defs>

      {/* Isometric Blueprint Construction Guide Lines (Full Extended Grid) */}
      {IsometricBlueprint ? (
        <g
          className="stroke-foreground/20 dark:stroke-white/15"
          strokeWidth="1"
          strokeDasharray="4 3"
        >
          {/* Axis 1 (Down-Right 30° Tracks) */}
          <path d="M-3000 -1387L4000 2655" />
          <path d="M-3000 -1467L4000 2575" />
          <path d="M-3000 -2005L4000 2037" />
          <path d="M-3000 -1765L4000 2277" />

          {/* Axis 2 (Up-Right 30° Tracks) */}
          <path d="M-3000 2085L4000 -1957" />
          <path d="M-3000 2245L4000 -1797" />
          <path d="M-3000 2325L4000 -1717" />
          <path d="M-3000 2478L4000 -1564" />
        </g>
      ) : null}

      {/* 1. Solid 3D Side faces: Base anchored, top walls compress from 40px down to 16px */}
      <g className="fill-background" fillRule="evenodd" clipRule="evenodd">
        <motion.path
          variants={{
            normal: {
              d: SIDE_NORMAL_D,
            },
            pressed: {
              d: SIDE_PRESSED_D,
            },
          }}
          transition={transition}
        />
      </g>

      {/* 2. Top faces: Solid background occluder (100% in sync with side walls) */}
      <motion.path
        variants={{
          normal: {
            d: TOP_NORMAL_D,
          },
          pressed: {
            d: TOP_PRESSED_D,
          },
        }}
        transition={transition}
        className="fill-background"
      />

      {/* 3. Top faces: Diagonal hatched pattern overlay (100% in sync with side walls) */}
      <motion.path
        variants={{
          normal: {
            d: TOP_NORMAL_D,
          },
          pressed: {
            d: TOP_PRESSED_D,
          },
        }}
        transition={transition}
        fill={`url(#${ids.facePattern})`}
      />

      {/* 4. Structural wireframe edges: Base subtle stroke (100% in sync with top and sides) */}
      <motion.path
        variants={{
          normal: {
            d: STROKE_NORMAL_D,
          },
          pressed: {
            d: STROKE_PRESSED_D,
          },
        }}
        transition={transition}
        stroke="var(--stroke)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 5. Structural wireframe edges: Cursor radial gradient flashlight */}
      <motion.path
        variants={{
          normal: {
            d: STROKE_NORMAL_D,
          },
          pressed: {
            d: STROKE_PRESSED_D,
          },
        }}
        transition={transition}
        stroke={`url(#${ids.radialGradient})`}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  )
}

export default PPMarkIsometric
