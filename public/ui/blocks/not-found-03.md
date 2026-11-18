# Not Found Pixel Trail

> Interactive 404 digital void experience featuring dynamic cursor pixel trails and terminal status diagnostics.

## Installation

```bash
npx shadcn@latest add https://byphongphan.com/r/not-found-03.json
```

## Source Code

### `block/not-found-03/app/not-found.tsx`

```tsx
import { ArrowLeft, Home, Moon, Sparkles, Sun, Terminal } from "lucide-react"

import { Button } from "@/components/ui/button"

import { PixelTrail } from "../components/pixel-trail"

export default function NotFound03() {
  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  return (
    <main className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-background text-foreground transition-colors select-none">
      {/* ── 1. Top Technical Header Bar ── */}
      <header className="relative z-30 flex shrink-0 items-center justify-between border-b border-border/80 bg-background/80 px-4 py-3.5 backdrop-blur-md sm:px-8">
        {/* Left: Terminal status indicator */}
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg border border-border bg-muted/60 text-muted-foreground">
            <Terminal className="size-4" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold tracking-widest text-primary uppercase">
                ERROR 404
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span className="font-mono text-xs text-muted-foreground">
                PIXEL_TRAIL_GRID
              </span>
            </div>
            <p className="hidden text-[11px] text-muted-foreground sm:inline-block">
              Coordinates unresolved • Digital void reached
            </p>
          </div>
        </div>

        {/* Right: Quick actions & theme switcher */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 gap-1.5 rounded-lg border-border/80 text-xs"
          >
            <a href="/">
              <Home className="size-3.5" />
              <span className="hidden sm:inline">Go to Home</span>
            </a>
          </Button>
        </div>
      </header>

      {/* ── 2. Full-Screen Interactive Pixel Trail Canvas ── */}
      <div className="absolute inset-0 z-10 pt-16">
        <PixelTrail
          pixelSize={24}
          fadeDuration={650}
          pixelClassName="bg-zinc-950 dark:bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_12px_#ffffff] rounded-[2px]"
        />
      </div>

      {/* ── 3. Foreground Message Overlay (Click-through to Trail) ── */}
      <section className="pointer-events-none relative z-20 my-auto flex flex-col items-center justify-center px-4 text-center">
        {/* Giant Monospace 404 */}
        <h1 className="font-mono text-7xl font-black tracking-tighter text-foreground sm:text-9xl lg:text-[11rem]">
          404
        </h1>

        {/* Title and Explanation */}
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Lost in the pixel void.
        </h2>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
          The page you requested does not exist or has dissolved into binary
          noise. Sweep your cursor across the grid to illuminate the path.
        </p>

        {/* Re-enable pointer events for buttons */}
        <div className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="default"
            asChild
            className="h-10 gap-2 rounded-xl bg-foreground px-5 text-sm font-medium text-background hover:opacity-90 dark:bg-white dark:text-zinc-950"
          >
            <a href="/">
              <Home className="size-4" />
              <span>Back to Home</span>
            </a>
          </Button>

          <Button
            variant="outline"
            size="default"
            onClick={handleBack}
            className="h-10 gap-2 rounded-xl border-border bg-background/80 px-5 text-sm backdrop-blur-sm hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            <span>Go Back</span>
          </Button>
        </div>
      </section>
    </main>
  )
}

```

### `block/not-found-03/components/pixel-trail.tsx`

```tsx
import { motion, useAnimationControls } from "motion/react"
import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"

import { cn } from "@/lib/utils"

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

```
