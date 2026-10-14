import type React from "react"
import { useCallback, useEffect, useMemo, useRef } from "react"

import { cn } from "@/shared/lib/utils"

export interface BorderGlowProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
  contentClassName?: string
  edgeSensitivity?: number
  glowColor?: string
  backgroundColor?: string
  borderRadius?: number | string
  glowRadius?: number
  glowIntensity?: number
  coneSpread?: number
  animated?: boolean
  colors?: string[]
  fillOpacity?: number
}

function parseHSL(hslStr: string): { h: number; s: number; l: number } {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/)
  if (!match) return { h: 40, s: 80, l: 80 }
  return {
    h: Number.parseFloat(match[1]),
    s: Number.parseFloat(match[2]),
    l: Number.parseFloat(match[3]),
  }
}

function buildBoxShadow(glowColor: string, intensity: number): string {
  const { h, s, l } = parseHSL(glowColor)
  const base = `${h}deg ${s}% ${l}%`
  const layers: [number, number, number, number, number, boolean][] = [
    [0, 0, 0, 1, 100, true],
    [0, 0, 1, 0, 60, true],
    [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true],
    [0, 0, 15, 0, 30, true],
    [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],
    [0, 0, 1, 0, 60, false],
    [0, 0, 3, 0, 50, false],
    [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false],
    [0, 0, 25, 2, 20, false],
    [0, 0, 50, 2, 10, false],
  ]
  return layers
    .map(([x, y, blur, spread, alpha, inset]) => {
      const a = Math.min(alpha * intensity, 100)
      return `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`
    })
    .join(", ")
}

function easeOutCubic(x: number) {
  return 1 - (1 - x) ** 3
}

function easeInCubic(x: number) {
  return x * x * x
}

interface AnimateOpts {
  start?: number
  end?: number
  duration?: number
  delay?: number
  ease?: (t: number) => number
  onUpdate: (v: number) => void
  onEnd?: () => void
}

function animateValue({
  start = 0,
  end = 100,
  duration = 1000,
  delay = 0,
  ease = easeOutCubic,
  onUpdate,
  onEnd,
}: AnimateOpts) {
  let rafId: number
  let timerId: ReturnType<typeof setTimeout>

  const t0 = performance.now() + delay
  function tick() {
    const elapsed = performance.now() - t0
    const t = Math.min(elapsed / duration, 1)
    onUpdate(start + (end - start) * ease(t))
    if (t < 1) {
      rafId = requestAnimationFrame(tick)
    } else if (onEnd) {
      onEnd()
    }
  }

  timerId = setTimeout(() => {
    rafId = requestAnimationFrame(tick)
  }, delay)

  return () => {
    clearTimeout(timerId)
    cancelAnimationFrame(rafId)
  }
}

const GRADIENT_POSITIONS = [
  "80% 55%",
  "69% 34%",
  "8% 6%",
  "41% 38%",
  "86% 85%",
  "82% 18%",
  "51% 4%",
] as const

const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1] as const

function buildMeshGradients(colors: string[]): string[] {
  const gradients: string[] = []
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)]
    gradients.push(
      `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`
    )
  }
  gradients.push(`linear-gradient(${colors[0]} 0 100%)`)
  return gradients
}

function isLightColor(color?: string): boolean {
  if (!color) return false
  const value = color.trim().replace("#", "")
  if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(value)) return false
  const hex =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value
  const red = Number.parseInt(hex.slice(0, 2), 16)
  const green = Number.parseInt(hex.slice(2, 4), 16)
  const blue = Number.parseInt(hex.slice(4, 6), 16)
  return red * 0.2126 + green * 0.7152 + blue * 0.0722 > 180
}

const DEFAULT_COLORS = ["#c084fc", "#f472b6", "#38bdf8"]

export function BorderGlow({
  children,
  className,
  contentClassName,
  edgeSensitivity = 30,
  glowColor = "40 80 80",
  backgroundColor,
  borderRadius = 20,
  glowRadius = 36,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = DEFAULT_COLORS,
  fillOpacity = 0.5,
  onPointerMove,
  onPointerEnter,
  onPointerLeave,
  style,
  ...props
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const getCenterOfElement = useCallback((el: HTMLElement) => {
    const { width, height } = el.getBoundingClientRect()
    return [width / 2, height / 2]
  }, [])

  const getEdgeProximity = useCallback(
    (el: HTMLElement, x: number, y: number) => {
      const [cx, cy] = getCenterOfElement(el)
      const dx = x - cx
      const dy = y - cy
      let kx = Number.POSITIVE_INFINITY
      let ky = Number.POSITIVE_INFINITY
      if (dx !== 0) kx = cx / Math.abs(dx)
      if (dy !== 0) ky = cy / Math.abs(dy)
      return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1)
    },
    [getCenterOfElement]
  )

  const getCursorAngle = useCallback(
    (el: HTMLElement, x: number, y: number) => {
      const [cx, cy] = getCenterOfElement(el)
      const dx = x - cx
      const dy = y - cy
      if (dx === 0 && dy === 0) return 0
      const radians = Math.atan2(dy, dx)
      let degrees = radians * (180 / Math.PI) + 90
      if (degrees < 0) degrees += 360
      return degrees
    },
    [getCenterOfElement]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(e)
      const card = cardRef.current
      if (!card) return
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const proximity = getEdgeProximity(card, x, y)
      const angle = getCursorAngle(card, x, y)

      const colorSensitivity = edgeSensitivity + 20
      const borderOpacity = Math.max(
        0,
        (proximity * 100 - colorSensitivity) / (100 - colorSensitivity)
      )
      const glowOpacity = Math.max(
        0,
        (proximity * 100 - edgeSensitivity) / (100 - edgeSensitivity)
      )

      card.style.setProperty("--bg-angle", `${angle.toFixed(2)}deg`)
      card.style.setProperty(
        "--bg-border-opacity",
        `${borderOpacity.toFixed(3)}`
      )
      card.style.setProperty("--bg-glow-opacity", `${glowOpacity.toFixed(3)}`)
    },
    [edgeSensitivity, getCursorAngle, getEdgeProximity, onPointerMove]
  )

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerEnter?.(e)
      const card = cardRef.current
      if (!card) return
      card.setAttribute("data-hovered", "true")
    },
    [onPointerEnter]
  )

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerLeave?.(e)
      const card = cardRef.current
      if (!card) return
      card.removeAttribute("data-hovered")
      card.style.setProperty("--bg-border-opacity", "0")
      card.style.setProperty("--bg-glow-opacity", "0")
    },
    [onPointerLeave]
  )

  useEffect(() => {
    if (!animated) return
    const card = cardRef.current
    if (!card) return

    const angleStart = 110
    const angleEnd = 465
    card.setAttribute("data-hovered", "true")
    card.style.setProperty("--bg-angle", `${angleStart}deg`)

    let currentProximity = 0
    let currentAngle = angleStart

    const updateGlow = () => {
      const colorSensitivity = edgeSensitivity + 20
      const borderOpacity = Math.max(
        0,
        (currentProximity * 100 - colorSensitivity) / (100 - colorSensitivity)
      )
      const glowOpacity = Math.max(
        0,
        (currentProximity * 100 - edgeSensitivity) / (100 - edgeSensitivity)
      )
      card.style.setProperty("--bg-angle", `${currentAngle.toFixed(2)}deg`)
      card.style.setProperty(
        "--bg-border-opacity",
        `${borderOpacity.toFixed(3)}`
      )
      card.style.setProperty("--bg-glow-opacity", `${glowOpacity.toFixed(3)}`)
    }

    const cancel1 = animateValue({
      duration: 500,
      onUpdate: (v) => {
        currentProximity = v / 100
        updateGlow()
      },
    })

    const cancel2 = animateValue({
      ease: easeInCubic,
      duration: 1500,
      end: 50,
      onUpdate: (v) => {
        currentAngle = (angleEnd - angleStart) * (v / 100) + angleStart
        updateGlow()
      },
    })

    const cancel3 = animateValue({
      ease: easeOutCubic,
      delay: 1500,
      duration: 2250,
      start: 50,
      end: 100,
      onUpdate: (v) => {
        currentAngle = (angleEnd - angleStart) * (v / 100) + angleStart
        updateGlow()
      },
    })

    const cancel4 = animateValue({
      ease: easeInCubic,
      delay: 2500,
      duration: 1500,
      start: 100,
      end: 0,
      onUpdate: (v) => {
        currentProximity = v / 100
        updateGlow()
      },
      onEnd: () => {
        card.removeAttribute("data-hovered")
      },
    })

    return () => {
      cancel1()
      cancel2()
      cancel3()
      cancel4()
    }
  }, [animated, edgeSensitivity])

  const meshGradients = useMemo(() => buildMeshGradients(colors), [colors])
  const borderBg = useMemo(
    () => meshGradients.map((g) => `${g} border-box`),
    [meshGradients]
  )
  const fillBg = useMemo(
    () => meshGradients.map((g) => `${g} padding-box`),
    [meshGradients]
  )
  const boxShadow = useMemo(
    () => buildBoxShadow(glowColor, glowIntensity),
    [glowColor, glowIntensity]
  )

  const lightSurface = isLightColor(backgroundColor)
  const radius =
    typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "relative isolate flex flex-col border transition-all duration-300",
        !backgroundColor &&
          "border-black/10 bg-muted/70 dark:border-white/10 dark:bg-card/90",
        className
      )}
      style={
        {
          "--bg-angle": "45deg",
          "--bg-border-opacity": "0",
          "--bg-glow-opacity": "0",
          "--bg-fill-opacity": fillOpacity,
          background: backgroundColor,
          borderColor: backgroundColor
            ? lightSurface
              ? "rgb(24 24 27 / 12%)"
              : "rgb(255 255 255 / 15%)"
            : undefined,
          borderRadius: radius,
          transform: "translate3d(0, 0, 0.01px)",
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* 1. Mesh gradient border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-1 rounded-[inherit] transition-opacity duration-300"
        style={{
          border: "1px solid transparent",
          background: [
            backgroundColor
              ? `linear-gradient(${backgroundColor} 0 100%) padding-box`
              : "linear-gradient(var(--color-background, transparent) 0 100%) padding-box",
            "linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box",
            ...borderBg,
          ].join(", "),
          opacity: "var(--bg-border-opacity, 0)",
          maskImage: `conic-gradient(from var(--bg-angle, 45deg) at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
          WebkitMaskImage: `conic-gradient(from var(--bg-angle, 45deg) at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`,
        }}
      />

      {/* 2. Mesh gradient fill near edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-1 rounded-[inherit] transition-opacity duration-300"
        style={
          {
            border: "1px solid transparent",
            background: fillBg.join(", "),
            maskImage: [
              "linear-gradient(to bottom, black, black)",
              "radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)",
              "radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)",
              "conic-gradient(from var(--bg-angle, 45deg) at center, transparent 5%, black 15%, black 85%, transparent 95%)",
            ].join(", "),
            WebkitMaskImage: [
              "linear-gradient(to bottom, black, black)",
              "radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)",
              "radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)",
              "radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)",
              "conic-gradient(from var(--bg-angle, 45deg) at center, transparent 5%, black 15%, black 85%, transparent 95%)",
            ].join(", "),
            maskComposite: "subtract, add, add, add, add, add",
            WebkitMaskComposite:
              "source-out, source-over, source-over, source-over, source-over, source-over",
            opacity:
              "calc(var(--bg-border-opacity, 0) * var(--bg-fill-opacity, 0.5))",
            mixBlendMode: lightSurface ? "normal" : "soft-light",
          } as React.CSSProperties
        }
      />

      {/* 3. Outer glow halo */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute z-1 rounded-[inherit] transition-opacity duration-300"
        style={
          {
            inset: `${-glowRadius}px`,
            maskImage:
              "conic-gradient(from var(--bg-angle, 45deg) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)",
            WebkitMaskImage:
              "conic-gradient(from var(--bg-angle, 45deg) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)",
            opacity: "var(--bg-glow-opacity, 0)",
            mixBlendMode: lightSurface ? "normal" : "plus-lighter",
          } as React.CSSProperties
        }
      >
        <span
          className="absolute rounded-[inherit]"
          style={{
            inset: `${glowRadius}px`,
            boxShadow,
          }}
        />
      </span>

      {/* 4. Inner content */}
      <div
        className={cn("relative z-2 flex flex-1 flex-col", contentClassName)}
      >
        {children}
      </div>
    </div>
  )
}

export default BorderGlow
