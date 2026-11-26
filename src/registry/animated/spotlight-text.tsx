import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

export interface SpotlightTextProps {
  /** The large typography string displayed (defaults to "byphongphan") */
  text?: string
  /** Color theme mode */
  theme?: "dark" | "light" | "paper"
  /** Radius in px of the radial spotlight mask */
  spotlightRadius?: number
  /** Background ambient visibility of the text outside the spotlight (0.0 to 1.0) */
  ambientOpacity?: number
  /** Peak brightness at the center of the spotlight (0.0 to 1.0) */
  centerIntensity?: number
  /** Percentage to shift text downward for subtle bottom cropping */
  bottomCropPercent?: number
  /** Grain stipple intensity */
  grainIntensity?: number
  /** Grain contrast adjustment */
  grainContrast?: number
  /** Density of noise pores */
  grainDensity?: number
  /** Scale in px of the repeating grain texture tile */
  grainScale?: number
  /** Tracking in em */
  letterSpacing?: number
  /** Always run the autonomous figure-8 drift animation even on mouse hover */
  autoAnimate?: boolean
  /** Additional container classes */
  className?: string
  /** Whether to render continuous vertical 4-column hairline divider lines */
  showColumnDividers?: boolean
}

interface GrainOptions {
  size?: number
  isLight?: boolean
  intensity?: number
  contrast?: number
  density?: number
  paperTint?: boolean
}

function createGrainDataUrl({
  size = 240,
  isLight = false,
  intensity = 0.72,
  contrast = 0.76,
  density = 0.82,
  paperTint = false,
}: GrainOptions): string {
  if (typeof document === "undefined") return ""

  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")
  if (!ctx) return ""

  const imgData = ctx.createImageData(size, size)
  const data = imgData.data

  let seed = 4099
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }

  const raw = new Float32Array(size * size)
  for (let i = 0; i < size * size; i++) {
    const r1 = rand()
    const r2 = rand()
    raw[i] = (r1 + r2 * 0.65) / 1.65
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = y * size + x
      const right = y * size + ((x + 1) % size)
      const down = ((y + 1) % size) * size + x
      const diag = ((y + 1) % size) * size + ((x + 1) % size)

      const blended =
        raw[idx] * 0.74 + (raw[right] + raw[down] + raw[diag]) * (0.26 / 3)

      let val = (blended - 0.5) * (1.25 + contrast * 2.3) + 0.5
      val = Math.max(0, Math.min(1, val))

      let r: number
      let g: number
      let b: number

      if (isLight) {
        const isInkPore = rand() > density
        if (isInkPore) {
          val = 0.72 + val * 0.28
        }
        const minInkLum = Math.round(16 + (1 - intensity) * 45)
        const maxHighlightLum = Math.round(175 + (1 - intensity) * 45)
        const lum = Math.round(minInkLum + val * (maxHighlightLum - minInkLum))

        if (paperTint) {
          r = Math.min(255, lum + 3)
          g = Math.min(255, lum + 1)
          b = Math.max(0, lum - 3)
        } else {
          r = lum
          g = lum
          b = lum
        }
      } else {
        if (rand() > density) {
          val *= 0.35
        }
        const minLum = 12
        const maxLum = Math.min(255, Math.round(45 + intensity * 175))
        const lum = Math.round(minLum + val * (maxLum - minLum))
        r = lum
        g = lum
        b = lum
      }

      const p = idx * 4
      data[p] = r
      data[p + 1] = g
      data[p + 2] = b
      data[p + 3] = 255
    }
  }

  ctx.putImageData(imgData, 0, 0)
  return canvas.toDataURL("image/png")
}

export function SpotlightText({
  text = "byphongphan",
  theme = "dark",
  spotlightRadius = 560,
  ambientOpacity = 0.06,
  centerIntensity = 1.0,
  bottomCropPercent = 18,
  grainIntensity = 0.75,
  grainContrast = 0.8,
  grainDensity = 0.82,
  grainScale = 160,
  letterSpacing = -0.055,
  autoAnimate = false,
  className = "",
  showColumnDividers = false,
}: SpotlightTextProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const measureRef = useRef<HTMLSpanElement | null>(null)
  const textLayerRef = useRef<HTMLDivElement | null>(null)

  const [fontSize, setFontSize] = useState<number>(220)

  const isLight = theme === "light"
  const isPaper = theme === "paper"

  const mouseState = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    isHovering: false,
    initialized: false,
  })

  const grainUrl = useMemo(() => {
    return createGrainDataUrl({
      size: 240,
      isLight,
      intensity: grainIntensity,
      contrast: grainContrast,
      density: grainDensity,
      paperTint: isPaper,
    })
  }, [isLight, isPaper, grainIntensity, grainContrast, grainDensity])

  const updateFontSize = useCallback(() => {
    if (!containerRef.current || !measureRef.current) return
    const containerWidth = containerRef.current.clientWidth
    const measuredWidth = measureRef.current.scrollWidth

    if (measuredWidth > 0 && containerWidth > 0) {
      const targetWidth = containerWidth * 0.985
      const calculatedSize = (targetWidth / measuredWidth) * 100
      setFontSize(Math.max(42, Math.min(840, calculatedSize)))
    }
  }, [])

  useEffect(() => {
    updateFontSize()
    const ro = new ResizeObserver(() => updateFontSize())
    if (containerRef.current) {
      ro.observe(containerRef.current)
    }
    window.addEventListener("resize", updateFontSize)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", updateFontSize)
    }
  }, [updateFontSize])

  useEffect(() => {
    const parentContainer =
      containerRef.current?.closest("footer") || containerRef.current
    if (!parentContainer) return

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const layer = textLayerRef.current
      if (!layer) return
      const rect = layer.getBoundingClientRect()
      const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX
      const clientY = "touches" in e ? (e.touches[0]?.clientY ?? 0) : e.clientY

      mouseState.current.isHovering = true
      mouseState.current.targetX = clientX - rect.left
      mouseState.current.targetY = clientY - rect.top
    }

    const handlePointerLeave = () => {
      mouseState.current.isHovering = false
    }

    parentContainer.addEventListener("mousemove", handlePointerMove)
    parentContainer.addEventListener("mouseleave", handlePointerLeave)
    parentContainer.addEventListener("touchmove", handlePointerMove, {
      passive: true,
    })
    parentContainer.addEventListener("touchend", handlePointerLeave)

    return () => {
      parentContainer.removeEventListener("mousemove", handlePointerMove)
      parentContainer.removeEventListener("mouseleave", handlePointerLeave)
      parentContainer.removeEventListener("touchmove", handlePointerMove)
      parentContainer.removeEventListener("touchend", handlePointerLeave)
    }
  }, [])

  useEffect(() => {
    let rafId: number
    const startTime = performance.now()

    const animate = (now: number) => {
      const layer = textLayerRef.current
      if (layer) {
        const rect = layer.getBoundingClientRect()
        const width = rect.width || window.innerWidth
        const height = rect.height || 300

        if (!mouseState.current.initialized) {
          mouseState.current.currentX = width * 0.45
          mouseState.current.currentY = height * 0.65
          mouseState.current.targetX = width * 0.45
          mouseState.current.targetY = height * 0.65
          mouseState.current.initialized = true
        }

        if (!mouseState.current.isHovering || autoAnimate) {
          const elapsed = (now - startTime) * 0.00065
          const waveX = width * (0.5 + 0.38 * Math.sin(elapsed))
          const waveY = height * (0.65 + 0.15 * Math.sin(elapsed * 2))
          mouseState.current.targetX = waveX
          mouseState.current.targetY = waveY
        }

        const lerpFactor =
          mouseState.current.isHovering && !autoAnimate ? 0.12 : 0.05
        mouseState.current.currentX +=
          (mouseState.current.targetX - mouseState.current.currentX) *
          lerpFactor
        mouseState.current.currentY +=
          (mouseState.current.targetY - mouseState.current.currentY) *
          lerpFactor

        const x = mouseState.current.currentX.toFixed(1)
        const y = mouseState.current.currentY.toFixed(1)

        const maskValue = `radial-gradient(circle ${spotlightRadius}px at ${x}px ${y}px, rgba(0,0,0,${centerIntensity}) 0%, rgba(0,0,0,${(
          centerIntensity * 0.55
        ).toFixed(2)}) 48%, rgba(0,0,0,${ambientOpacity}) 100%)`

        layer.style.webkitMaskImage = maskValue
        layer.style.maskImage = maskValue
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [spotlightRadius, ambientOpacity, centerIntensity, autoAnimate])

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none ${className}`}
    >
      {/* Hidden reference element for measuring target text width */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-[-9999px] left-[-9999px] font-bold whitespace-nowrap opacity-0"
        style={{
          fontSize: "100px",
          letterSpacing: `${letterSpacing}em`,
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {text || " "}
      </span>

      {/* Giant Cropped Grainy Typography Container */}
      <div
        ref={textLayerRef}
        className="pointer-events-none relative z-10 flex w-full items-end justify-center overflow-hidden"
        style={{
          WebkitMaskImage: `radial-gradient(circle ${spotlightRadius}px at 45% 65%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.55) 48%, rgba(0,0,0,${ambientOpacity}) 100%)`,
          maskImage: `radial-gradient(circle ${spotlightRadius}px at 45% 65%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.55) 48%, rgba(0,0,0,${ambientOpacity}) 100%)`,
        }}
      >
        <h2
          className="m-0 w-full p-0 text-center font-bold tracking-tighter whitespace-nowrap select-none"
          style={{
            fontSize: `${fontSize}px`,
            letterSpacing: `${letterSpacing}em`,
            lineHeight: 0.8,
            fontFamily:
              "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            backgroundImage: grainUrl ? `url(${grainUrl})` : "none",
            backgroundRepeat: "repeat",
            backgroundSize: `${grainScale}px ${grainScale}px`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
            transform: `translateY(${bottomCropPercent}%)`,
            willChange: "transform",
          }}
        >
          {text}
        </h2>
      </div>

      {/* Optional fallback vertical grid lines if rendered standalone */}
      {showColumnDividers && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
        >
          <div className="grid h-full w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div className="hidden h-full border-r border-border md:block" />
            <div className="hidden h-full border-r border-border lg:block" />
            <div className="hidden h-full border-r border-border lg:block" />
            <div className="h-full" />
          </div>
        </div>
      )}
    </div>
  )
}

export default SpotlightText
