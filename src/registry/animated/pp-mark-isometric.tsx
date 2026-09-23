"use client"

import type { Transition } from "framer-motion"
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"
import { useEffect, useId, useRef } from "react"

import { useSound } from "@/shared/hooks/use-sound"
import { uMiniMapOpenSound } from "@/shared/lib/u-mini-map-open"

const transition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 18,
  stiffness: 200,
}

export interface PPMarkIsometricProps {
  className?: string
  enableSound?: boolean
}

/**
 * Phong Phan (PP) Isometric Monogram Mark
 * Isometric 3D Voxel Interactive Blueprint Design with diagonal hatching,
 * wireframe edges, mouse-following radial flashlight, and spring physics.
 */
export function PPMarkIsometric({
  className,
  enableSound = true,
}: PPMarkIsometricProps) {
  const id = useId()
  const ids = {
    facePattern: `pp-face-pattern-${id}`,
    faceFill: `pp-face-fill-${id}`,
    stroke: `pp-stroke-${id}`,
    radialGradient: `pp-radial-gradient-${id}`,
  }

  const ref = useRef<SVGSVGElement>(null)
  const [play] = useSound(uMiniMapOpenSound, {
    volume: 0.3,
    soundEnabled: enableSound,
  })

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
      className={`h-auto w-full cursor-pointer touch-manipulation overflow-visible select-none [--pattern:color-mix(in_oklab,var(--foreground)_14%,transparent)] [--stroke:color-mix(in_oklab,var(--foreground)_18%,transparent)] ${className ?? ""}`}
      viewBox="0 0 818 585"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Phong Phan Isometric Mark"
      initial="normal"
      whileTap="pressed"
      onTap={() => {
        if (enableSound) play()
      }}
    >
      <defs>
        {/* Diagonal Hatching Pattern */}
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
            strokeWidth="1.2"
          />
        </pattern>

        {/* Top faces of both P letters with interactive press translation */}
        <motion.g
          id={ids.faceFill}
          variants={{
            normal: {
              transform: "translate(0px, 0px)",
            },
            pressed: {
              transform: "translate(0px, 16px)",
            },
          }}
          transition={transition}
        >
          <path d="M610.28 0.0L748.85 80.0L679.57 120.0L541.0 40.0Z" />
          <path d="M541.21 40.0L610.49 80.0L471.92 160.0L402.64 120.0Z" />
          <path d="M403.28 120.0L749.69 320.0L680.41 360.0L334.0 160.0Z" />
          <path d="M748.54 80.0L817.83 120.0L653.28 215.0L584.0 175.0Z" />
          <path d="M276.28 185.0L414.85 265.0L345.57 305.0L207.0 225.0Z" />
          <path d="M207.21 225.0L276.49 265.0L137.92 345.0L68.64 305.0Z" />
          <path d="M69.28 305.0L415.69 505.0L346.41 545.0L-0.0 345.0Z" />
          <path d="M414.55 265.0L483.83 305.0L319.28 400.0L250.0 360.0Z" />
        </motion.g>

        {/* Stroke outlines with normal and pressed wireframe edges */}
        <motion.path
          id={ids.stroke}
          variants={{
            normal: {
              d: [
                "M0.0 345.0L0.0 385.0",
                "M-0.0 345.0L69.28 305.0",
                "M-0.0 345.0L346.41 545.0",
                "M0.0 385.0L346.41 585.0",
                "M68.64 305.0L68.64 345.0",
                "M68.64 305.0L137.92 345.0",
                "M68.64 305.0L207.21 225.0",
                "M68.64 345.0L137.92 385.0",
                "M69.28 305.0L415.69 505.0",
                "M137.92 345.0L137.92 385.0",
                "M137.92 345.0L276.49 265.0",
                "M137.92 385.0L276.49 305.0",
                "M207.0 225.0L207.0 265.0",
                "M207.0 225.0L276.28 185.0",
                "M207.0 225.0L345.56 305.0",
                "M207.0 225.0L345.57 305.0",
                "M207.0 265.0L345.56 345.0",
                "M207.21 225.0L276.49 265.0",
                "M250.0 360.0L250.0 400.0",
                "M250.0 360.0L319.28 400.0",
                "M250.0 360.0L414.55 265.0",
                "M250.0 400.0L319.28 440.0",
                "M276.28 185.0L414.85 265.0",
                "M276.49 265.0L276.49 305.0",
                "M319.28 400.0L319.28 440.0",
                "M319.28 400.0L483.83 305.0",
                "M319.28 440.0L483.83 345.0",
                "M334.0 160.0L334.0 200.0",
                "M334.0 160.0L403.28 120.0",
                "M334.0 160.0L680.41 360.0",
                "M334.0 200.0L680.41 400.0",
                "M345.56 305.0L345.56 345.0",
                "M345.56 305.0L414.85 265.0",
                "M345.56 345.0L414.85 305.0",
                "M345.57 305.0L414.85 265.0",
                "M346.41 545.0L346.41 585.0",
                "M346.41 545.0L415.69 505.0",
                "M346.41 585.0L415.69 545.0",
                "M402.64 120.0L402.64 160.0",
                "M402.64 120.0L471.92 160.0",
                "M402.64 120.0L541.21 40.0",
                "M402.64 160.0L471.92 200.0",
                "M403.28 120.0L749.69 320.0",
                "M414.55 265.0L483.83 305.0",
                "M414.85 265.0L414.85 305.0",
                "M415.69 505.0L415.69 545.0",
                "M471.92 160.0L471.92 200.0",
                "M471.92 160.0L610.49 80.0",
                "M471.92 200.0L610.49 120.0",
                "M483.83 305.0L483.83 345.0",
                "M541.0 40.0L541.0 80.0",
                "M541.0 40.0L610.28 0.0",
                "M541.0 40.0L679.56 120.0",
                "M541.0 40.0L679.57 120.0",
                "M541.0 80.0L679.56 160.0",
                "M541.21 40.0L610.49 80.0",
                "M584.0 175.0L584.0 215.0",
                "M584.0 175.0L653.28 215.0",
                "M584.0 175.0L748.54 80.0",
                "M584.0 215.0L653.28 255.0",
                "M610.28 0.0L748.85 80.0",
                "M610.49 80.0L610.49 120.0",
                "M653.28 215.0L653.28 255.0",
                "M653.28 215.0L817.83 120.0",
                "M653.28 255.0L817.83 160.0",
                "M679.56 120.0L679.56 160.0",
                "M679.56 120.0L748.85 80.0",
                "M679.56 160.0L748.85 120.0",
                "M679.57 120.0L748.85 80.0",
                "M680.41 360.0L680.41 400.0",
                "M680.41 360.0L749.69 320.0",
                "M680.41 400.0L749.69 360.0",
                "M748.54 80.0L817.83 120.0",
                "M748.85 80.0L748.85 120.0",
                "M749.69 320.0L749.69 360.0",
                "M817.83 120.0L817.83 160.0",
              ].join(""),
            },
            pressed: {
              d: [
                "M0.00 361.00L0.00 401.00",
                "M-0.00 361.00L69.28 321.00",
                "M-0.00 361.00L346.41 561.00",
                "M0.00 401.00L346.41 601.00",
                "M68.64 321.00L68.64 361.00",
                "M68.64 321.00L137.92 361.00",
                "M68.64 321.00L207.21 241.00",
                "M68.64 361.00L137.92 401.00",
                "M69.28 321.00L415.69 521.00",
                "M137.92 361.00L137.92 401.00",
                "M137.92 361.00L276.49 281.00",
                "M137.92 401.00L276.49 321.00",
                "M207.00 241.00L207.00 281.00",
                "M207.00 241.00L276.28 201.00",
                "M207.00 241.00L345.56 321.00",
                "M207.00 241.00L345.57 321.00",
                "M207.00 281.00L345.56 361.00",
                "M207.21 241.00L276.49 281.00",
                "M250.00 376.00L250.00 416.00",
                "M250.00 376.00L319.28 416.00",
                "M250.00 376.00L414.55 281.00",
                "M250.00 416.00L319.28 456.00",
                "M276.28 201.00L414.85 281.00",
                "M276.49 281.00L276.49 321.00",
                "M319.28 416.00L319.28 456.00",
                "M319.28 416.00L483.83 321.00",
                "M319.28 456.00L483.83 361.00",
                "M334.00 176.00L334.00 216.00",
                "M334.00 176.00L403.28 136.00",
                "M334.00 176.00L680.41 376.00",
                "M334.00 216.00L680.41 416.00",
                "M345.56 321.00L345.56 361.00",
                "M345.56 321.00L414.85 281.00",
                "M345.56 361.00L414.85 321.00",
                "M345.57 321.00L414.85 281.00",
                "M346.41 561.00L346.41 601.00",
                "M346.41 561.00L415.69 521.00",
                "M346.41 601.00L415.69 561.00",
                "M402.64 136.00L402.64 176.00",
                "M402.64 136.00L471.92 176.00",
                "M402.64 136.00L541.21 56.00",
                "M402.64 176.00L471.92 216.00",
                "M403.28 136.00L749.69 336.00",
                "M414.55 281.00L483.83 321.00",
                "M414.85 281.00L414.85 321.00",
                "M415.69 521.00L415.69 561.00",
                "M471.92 176.00L471.92 216.00",
                "M471.92 176.00L610.49 96.00",
                "M471.92 216.00L610.49 136.00",
                "M483.83 321.00L483.83 361.00",
                "M541.00 56.00L541.00 96.00",
                "M541.00 56.00L610.28 16.00",
                "M541.00 56.00L679.56 136.00",
                "M541.00 56.00L679.57 136.00",
                "M541.00 96.00L679.56 176.00",
                "M541.21 56.00L610.49 96.00",
                "M584.00 191.00L584.00 231.00",
                "M584.00 191.00L653.28 231.00",
                "M584.00 191.00L748.54 96.00",
                "M584.00 231.00L653.28 271.00",
                "M610.28 16.00L748.85 96.00",
                "M610.49 96.00L610.49 136.00",
                "M653.28 231.00L653.28 271.00",
                "M653.28 231.00L817.83 136.00",
                "M653.28 271.00L817.83 176.00",
                "M679.56 136.00L679.56 176.00",
                "M679.56 136.00L748.85 96.00",
                "M679.56 176.00L748.85 136.00",
                "M679.57 136.00L748.85 96.00",
                "M680.41 376.00L680.41 416.00",
                "M680.41 376.00L749.69 336.00",
                "M680.41 416.00L749.69 376.00",
                "M748.54 96.00L817.83 136.00",
                "M748.85 96.00L748.85 136.00",
                "M749.69 336.00L749.69 376.00",
                "M817.83 136.00L817.83 176.00",
              ].join(""),
            },
          }}
          transition={transition}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

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
            stopOpacity="0.4"
          />
          <stop offset="1" stopColor="var(--foreground)" stopOpacity="0" />
        </motion.radialGradient>
      </defs>

      {/* Isometric Blueprint Construction Guide Lines (Full Extended Grid) */}
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

      {/* Solid 3D Side faces (occludes back lines and gives 3D depth) */}
      <g className="fill-background" fillRule="evenodd" clipRule="evenodd">
        <motion.path
          variants={{
            normal: {
              d: "M541.0 40.0L679.56 120.0L679.56 160.0L541.0 80.0ZM679.56 120.0L748.85 80.0L748.85 120.0L679.56 160.0ZM402.64 120.0L471.92 160.0L471.92 200.0L402.64 160.0ZM471.92 160.0L610.49 80.0L610.49 120.0L471.92 200.0ZM334.0 160.0L680.41 360.0L680.41 400.0L334.0 200.0ZM680.41 360.0L749.69 320.0L749.69 360.0L680.41 400.0ZM584.0 175.0L653.28 215.0L653.28 255.0L584.0 215.0ZM653.28 215.0L817.83 120.0L817.83 160.0L653.28 255.0ZM207.0 225.0L345.56 305.0L345.56 345.0L207.0 265.0ZM345.56 305.0L414.85 265.0L414.85 305.0L345.56 345.0ZM68.64 305.0L137.92 345.0L137.92 385.0L68.64 345.0ZM137.92 345.0L276.49 265.0L276.49 305.0L137.92 385.0ZM0.0 345.0L346.41 545.0L346.41 585.0L0.0 385.0ZM346.41 545.0L415.69 505.0L415.69 545.0L346.41 585.0ZM250.0 360.0L319.28 400.0L319.28 440.0L250.0 400.0ZM319.28 400.0L483.83 305.0L483.83 345.0L319.28 440.0Z",
            },
            pressed: {
              d: "M541.00 56.00L679.56 136.00L679.56 176.00L541.00 96.00ZM679.56 136.00L748.85 96.00L748.85 136.00L679.56 176.00ZM402.64 136.00L471.92 176.00L471.92 216.00L402.64 176.00ZM471.92 176.00L610.49 96.00L610.49 136.00L471.92 216.00ZM334.00 176.00L680.41 376.00L680.41 416.00L334.00 216.00ZM680.41 376.00L749.69 336.00L749.69 376.00L680.41 416.00ZM584.00 191.00L653.28 231.00L653.28 271.00L584.00 231.00ZM653.28 231.00L817.83 136.00L817.83 176.00L653.28 271.00ZM207.00 241.00L345.56 321.00L345.56 361.00L207.00 281.00ZM345.56 321.00L414.85 281.00L414.85 321.00L345.56 361.00ZM68.64 321.00L137.92 361.00L137.92 401.00L68.64 361.00ZM137.92 361.00L276.49 281.00L276.49 321.00L137.92 401.00ZM0.00 361.00L346.41 561.00L346.41 601.00L0.00 401.00ZM346.41 561.00L415.69 521.00L415.69 561.00L346.41 601.00ZM250.00 376.00L319.28 416.00L319.28 456.00L250.00 416.00ZM319.28 416.00L483.83 321.00L483.83 361.00L319.28 456.00Z",
            },
          }}
          transition={transition}
        />
      </g>

      {/* Top faces: Solid background + Diagonal hatched pattern overlay */}
      <use href={`#${ids.faceFill}`} className="fill-background" />
      <use href={`#${ids.faceFill}`} fill={`url(#${ids.facePattern})`} />

      {/* Wireframe edge strokes: Base subtle stroke + Radial cursor flashlight */}
      <use href={`#${ids.stroke}`} stroke="var(--stroke)" />
      <use href={`#${ids.stroke}`} stroke={`url(#${ids.radialGradient})`} />
    </motion.svg>
  )
}

export default PPMarkIsometric
