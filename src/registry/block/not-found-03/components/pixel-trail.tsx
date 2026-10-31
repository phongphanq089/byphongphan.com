import { motion, useAnimationControls } from "motion/react"
import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"

import { cn } from "@/shared/lib/utils"

export interface PixelTrailProps {
  pixelSize?: number // px
  fadeDuration?: number // ms
  delay?: number // ms
  className?: string
  pixelClassName?: string
}

/**
 * Hook to dynamically measure the container's width & height via ResizeObserver.
 */
function useDimensions(ref: React.RefObject<HTMLDivElement | null>) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!ref.current) return
    const updateDimensions = () => {
      if (ref.current) {
        setDimensions({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        })
      }
    }
    updateDimensions()
    const observer = new ResizeObserver(updateDimensions)
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])

  return dimensions
}

export function PixelTrail({
  pixelSize = 24,
  fadeDuration = 600,
  delay = 0,
  className,
  pixelClassName,
}: PixelTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dimensions = useDimensions(containerRef)
  const baseId = useId().replace(/:/g, "")

  const triggerPixelAt = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.floor((clientX - rect.left) / pixelSize)
      const y = Math.floor((clientY - rect.top) / pixelSize)

      const pixelElement = document.getElementById(`${baseId}-pixel-${x}-${y}`)
      if (pixelElement) {
        const animatePixel = (
          pixelElement as unknown as { __animatePixel?: () => void }
        ).__animatePixel
        if (animatePixel) animatePixel()
      }
    },
    [pixelSize, baseId]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      triggerPixelAt(e.clientX, e.clientY)
    },
    [triggerPixelAt]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0]
      if (touch) {
        triggerPixelAt(touch.clientX, touch.clientY)
      }
    },
    [triggerPixelAt]
  )

  const columns = useMemo(
    () => (dimensions.width > 0 ? Math.ceil(dimensions.width / pixelSize) : 0),
    [dimensions.width, pixelSize]
  )
  const rows = useMemo(
    () =>
      dimensions.height > 0 ? Math.ceil(dimensions.height / pixelSize) : 0,
    [dimensions.height, pixelSize]
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-auto absolute inset-0 h-full w-full overflow-hidden select-none",
        className
      )}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <PixelDot
              key={`${colIndex}-${rowIndex}`}
              id={`${baseId}-pixel-${colIndex}-${rowIndex}`}
              size={pixelSize}
              fadeDuration={fadeDuration}
              delay={delay}
              className={pixelClassName}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default PixelTrail

interface PixelDotProps {
  id: string
  size: number
  fadeDuration: number
  delay: number
  className?: string
}

const PixelDot = React.memo(function PixelDot({
  id,
  size,
  fadeDuration,
  delay,
  className,
}: PixelDotProps) {
  const controls = useAnimationControls()

  const animatePixel = useCallback(() => {
    controls.start({
      opacity: [1, 0],
      transition: {
        duration: fadeDuration / 1000,
        delay: delay / 1000,
        ease: "easeOut",
      },
    })
  }, [controls, fadeDuration, delay])

  // Attach the animatePixel function directly to the DOM element for instant O(1) triggering
  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        ;(node as unknown as { __animatePixel?: () => void }).__animatePixel =
          animatePixel
      }
    },
    [animatePixel]
  )

  return (
    <motion.div
      id={id}
      ref={ref}
      className={cn("pointer-events-none shrink-0", className)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      initial={{ opacity: 0 }}
      animate={controls}
    />
  )
})
