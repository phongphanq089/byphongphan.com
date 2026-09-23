"use client"

import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react"

import { cn } from "@/shared/lib"

export interface MaskProps {
  cursor?: boolean
  x?: number
  y?: number
  radius?: number | string
  color?: string
  gradient?: string
}

export interface GradientProps {
  display?: boolean
  opacity?: number
  x?: number
  y?: number
  width?: number
  height?: number
  tilt?: number
  colorStart?: string
  colorEnd?: string
}

export interface DotsProps {
  display?: boolean
  opacity?: number
  color?: string
  size?: number
}

export interface GridProps {
  display?: boolean
  opacity?: number
  color?: string
  width?: string
  height?: string
}

export interface LinesProps {
  display?: boolean
  opacity?: number
  size?: number
  color?: string
}

export interface BackgroundGradientCursorProps extends HTMLAttributes<HTMLDivElement> {
  position?: CSSProperties["position"]
  gradient?: GradientProps
  dots?: DotsProps
  grid?: GridProps
  lines?: LinesProps
  mask?: MaskProps
  className?: string
  style?: CSSProperties
  children?: ReactNode
  ref?: Ref<HTMLDivElement>
}

/**
 * Safely resolves raw color strings, hex, oklch, rgb, or CSS token variable names.
 */
function resolveCssColor(color?: string, fallback = "currentColor"): string {
  if (!color) return fallback
  if (
    color.startsWith("#") ||
    color.startsWith("rgb") ||
    color.startsWith("hsl") ||
    color.startsWith("oklch")
  ) {
    return color
  }
  if (color.startsWith("var(")) {
    return color
  }
  if (color.startsWith("--")) {
    return `var(${color})`
  }
  return `var(--${color})`
}

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value)
  } else if (ref && "current" in ref) {
    ;(ref as RefObject<T | null>).current = value
  }
}

export function BackgroundGradientCursor({
  position = "absolute",
  gradient = {},
  dots = {},
  grid = {},
  lines = {},
  mask = {},
  children,
  className,
  style,
  ref: forwardedRef,
  ...rest
}: BackgroundGradientCursorProps) {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setRef(forwardedRef, backgroundRef.current)
  }, [forwardedRef])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (backgroundRef.current) {
        const rect = backgroundRef.current.getBoundingClientRect()
        const isInside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom

        if (position === "fixed" || isInside) {
          setIsVisible(true)
          setCursorPosition({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          })
        } else {
          setIsVisible(false)
        }
      }
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [position])

  useEffect(() => {
    let animationFrameId: number
    const updateSmoothPosition = () => {
      setSmoothPosition((prev) => {
        const dx = cursorPosition.x - prev.x
        const dy = cursorPosition.y - prev.y
        const easingFactor = 0.1
        return {
          x: Math.round(prev.x + dx * easingFactor),
          y: Math.round(prev.y + dy * easingFactor),
        }
      })
      animationFrameId = requestAnimationFrame(updateSmoothPosition)
    }

    if (mask?.cursor) {
      animationFrameId = requestAnimationFrame(updateSmoothPosition)
    }
    return () => cancelAnimationFrame(animationFrameId)
  }, [cursorPosition.x, cursorPosition.y, mask?.cursor])

  const maskStyle = (): CSSProperties => {
    if (!mask) return {}

    const maskRadialGradient =
      mask.gradient ||
      (mask.color
        ? `radial-gradient(
            circle at var(--mask-position-x) var(--mask-position-y),
            ${resolveCssColor(mask.color)} 0%,
            transparent 70%
          )`
        : `radial-gradient(
            circle at var(--mask-position-x) var(--mask-position-y),
            rgba(14, 164, 52, 0.5) 0%,
            rgba(14, 164, 52, 0.05) 30%,
            rgba(14, 164, 52, 0.02) 50%,
            rgba(255, 60, 0, 0) 70%
          )`)

    const radiusUnit =
      typeof mask.radius === "number"
        ? `${mask.radius}px`
        : mask.radius || (position === "fixed" ? "50vh" : "150px")

    if (mask.cursor) {
      return {
        "--mask-position-x": `${smoothPosition.x}px`,
        "--mask-position-y": `${smoothPosition.y}px`,
        "--mask-radius": radiusUnit,
        "--mask-gradient": maskRadialGradient,
      } as CSSProperties
    }

    if (mask.x != null && mask.y != null) {
      return {
        "--mask-position-x": `${mask.x}%`,
        "--mask-position-y": `${mask.y}%`,
        "--mask-radius": radiusUnit,
        "--mask-gradient": maskRadialGradient,
      } as CSSProperties
    }

    return {}
  }

  return (
    <div
      ref={backgroundRef}
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className
      )}
      style={{ position, ...style }}
      {...rest}
    >
      {gradient.display && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: gradient.opacity ? gradient.opacity / 100 : 0.5,
            background: `linear-gradient(${gradient.tilt || 0}deg, ${resolveCssColor(gradient.colorStart, "transparent")} 0%, ${resolveCssColor(gradient.colorEnd, "transparent")} 100%)`,
          }}
        />
      )}

      {lines.display && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: lines.opacity ? lines.opacity / 100 : 1,
            backgroundImage: `repeating-linear-gradient(45deg, ${resolveCssColor(lines.color, "var(--brand-on-background-weak, var(--border))")} 0px, ${resolveCssColor(lines.color, "var(--brand-on-background-weak, var(--border))")} 0.5px, transparent 0.5px, transparent ${lines.size || 16}px)`,
          }}
        />
      )}

      {grid.display && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: grid.opacity ? grid.opacity / 100 : 1,
            backgroundSize: `${grid.width || "32px"} ${grid.height || "32px"}`,
            backgroundImage: `
              linear-gradient(to right, ${resolveCssColor(grid.color, "var(--border)")} 1px, transparent 1px),
              linear-gradient(to bottom, ${resolveCssColor(grid.color, "var(--border)")} 1px, transparent 1px)
            `,
          }}
        />
      )}

      {dots.display && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: dots.opacity ? dots.opacity / 100 : 0.3,
            backgroundSize: "20px 20px",
            backgroundImage: `radial-gradient(${resolveCssColor(dots.color, "foreground")} ${dots.size || 1}px, transparent ${dots.size || 1}px)`,
          }}
        />
      )}

      {mask.cursor && (
        <div
          className="absolute top-0 left-0 z-0 h-full w-full overflow-hidden"
          style={{
            ...maskStyle(),
            background: "var(--mask-gradient)",
            pointerEvents: "none",
            filter: "blur(40px)",
            mixBlendMode: "lighten",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.4s ease-out",
          }}
        />
      )}

      {children}
    </div>
  )
}

export default BackgroundGradientCursor
