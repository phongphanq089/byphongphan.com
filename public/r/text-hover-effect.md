# Text Hover Effect

> Interactive typographic SVG reveal effect that traces strokes on mount and reveals a vibrant radial gradient mask following cursor movement.

## Installation

  

  ```bash
npx shadcn@latest add https://byphongphan.com/r/text-hover-effect.json
```

  
    
      - Install the required motion dependency:
      ```bash
npm install motion
```

      - Copy and paste the component into your project:
      ```tsx
// animated/text-hover-effect.tsx
import { motion } from "motion/react"
import { useEffect, useId, useRef, useState } from "react"

import { cn } from "@/lib/utils"

const estimateViewBox = (
  text: string,
  fontSize: number,
  pad: number,
  tx: number,
  ty: number
) => {
  const safeText = text || " "
  let charUnits = 0
  for (const ch of safeText) {
    if (ch === " ") charUnits += 0.35
    else if (ch === ch.toUpperCase() && ch !== ch.toLowerCase())
      charUnits += 0.78
    else charUnits += 0.64
  }

  const estW = Math.max(fontSize * charUnits, fontSize * 0.8)
  const estH = fontSize * 1.15

  return {
    x: tx - estW / 2 - pad,
    y: ty - estH / 2 - pad,
    w: estW + pad * 2,
    h: estH + pad * 2,
  }
}

const FONT_SIZE = 80
const FONT_FAMILY = "helvetica, sans-serif"
const FONT_WEIGHT = "bold"
const PAD = 4

const TX = 5000
const TY = 5000

const DEFAULT_COLORS = [
  "#eab308", // Yellow
  "#ef4444", // Red
  "#3b82f6", // Blue
  "#06b6d4", // Cyan
  "#8b5cf6", // Violet
]

export interface TextHoverEffectProps {
  /** The text string to render and animate */
  text: string
  /** Duration of cursor follow interpolation in seconds (default: 0) */
  duration?: number
  /** Whether to automatically oscillate gradient when not hovering */
  automatic?: boolean
  /** Initial stroke drawing animation duration in seconds (default: 4) */
  strokeDuration?: number
  /** Array of hex or CSS color stops for the hover reveal gradient */
  colors?: string[]
  /** Additional CSS classes for the SVG container */
  className?: string
}

export function TextHoverEffect({
  text,
  duration,
  automatic = false,
  strokeDuration = 4,
  colors = DEFAULT_COLORS,
  className,
}: TextHoverEffectProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const textRef = useRef<SVGTextElement>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [measured, setMeasured] = useState(false)

  const uniqueId = useId().replace(/:/g, "-")
  const gradientId = `text-gradient-${uniqueId}`
  const maskId = `text-mask-${uniqueId}`
  const revealMaskId = `reveal-mask-${uniqueId}`

  const [vb, setVb] = useState(() =>
    estimateViewBox(text, FONT_SIZE, PAD, TX, TY)
  )

  const [maskPos, setMaskPos] = useState({ cx: TX, cy: TY })

  useEffect(() => {
    setMeasured(false)
    setVb(estimateViewBox(text, FONT_SIZE, PAD, TX, TY))

    const measure = () => {
      if (!textRef.current) return
      try {
        const b = textRef.current.getBBox()
        if (b.width > 0 && b.height > 0) {
          setVb({
            x: b.x - PAD,
            y: b.y - PAD,
            w: b.width + PAD * 2,
            h: b.height + PAD * 2,
          })
          setMeasured(true)
        }
      } catch {
        /* element not in DOM yet */
      }
    }

    measure()
    document.fonts?.ready.then(measure)
  }, [text])

  useEffect(() => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    const fracX = (cursor.x - rect.left) / rect.width
    const fracY = (cursor.y - rect.top) / rect.height
    setMaskPos({
      cx: vb.x + fracX * vb.w,
      cy: vb.y + fracY * vb.h,
    })
  }, [cursor, vb])

  useEffect(() => {
    if (!automatic || hovered) return

    let forward = true
    const interval = setInterval(() => {
      setMaskPos({
        cx: forward ? vb.x + vb.w * 0.8 : vb.x + vb.w * 0.2,
        cy: TY,
      })
      forward = !forward
    }, 2200)

    return () => clearInterval(interval)
  }, [automatic, hovered, vb])

  const baseTextProps = {
    x: TX,
    y: TY,
    textAnchor: "middle" as const,
    dominantBaseline: "middle" as const,
    strokeWidth: "1.2",
    fontSize: String(FONT_SIZE),
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHT,
  }

  const visibleTextProps = {
    ...baseTextProps,
    ...(!measured
      ? {
          textLength: vb.w - PAD * 2,
          lengthAdjust: "spacingAndGlyphs" as const,
        }
      : {}),
  }

  const gradR = vb.w * 0.3
  const isRevealed = hovered || automatic

  return (
    <svg
      ref={svgRef}
      width="100%"
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn(
        "block h-auto w-full overflow-visible select-none",
        className
      )}
      style={{ display: "block" }}
      role="img"
    >
      <title>{text}</title>
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={vb.x}
          y1={TY}
          x2={vb.x + vb.w}
          y2={TY}
        >
          {isRevealed &&
            colors.map((color, idx) => {
              const offset =
                colors.length > 1
                  ? `${Math.round((idx / (colors.length - 1)) * 100)}%`
                  : "0%"
              return (
                <stop
                  key={`${color}-${offset}`}
                  offset={offset}
                  stopColor={color}
                />
              )
            })}
        </linearGradient>

        <motion.radialGradient
          id={revealMaskId}
          gradientUnits="userSpaceOnUse"
          r={gradR}
          initial={{ cx: TX, cy: TY }}
          animate={maskPos}
          transition={{
            duration: automatic && !hovered ? 2 : (duration ?? 0),
            ease: "easeOut",
          }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id={maskId}>
          <rect
            x={vb.x - 1000}
            y={vb.y - 1000}
            width={vb.w + 2000}
            height={vb.h + 2000}
            fill={`url(#${revealMaskId})`}
          />
        </mask>
      </defs>

      <text ref={textRef} {...baseTextProps} style={{ visibility: "hidden" }}>
        {text}
      </text>

      <text
        {...visibleTextProps}
        className="fill-transparent stroke-foreground/30 dark:stroke-white/20"
        style={{ opacity: isRevealed ? 0.8 : 0.45 }}
      >
        {text}
      </text>

      <motion.text
        {...visibleTextProps}
        className="fill-transparent stroke-foreground/40 dark:stroke-white/30"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
        transition={{ duration: strokeDuration, ease: "easeInOut" }}
      >
        {text}
      </motion.text>

      <text
        {...visibleTextProps}
        stroke={`url(#${gradientId})`}
        mask={`url(#${maskId})`}
        className="fill-transparent"
      >
        {text}
      </text>
    </svg>
  )
}

```

      - Update the import paths to match your project directory structure.
    

  

---

## Anatomy

```text
TextHoverEffect (SVG container with pure math SSR viewBox)
├── <defs>
│   ├── <linearGradient> (Multi-stop gradient for letter fill)
│   ├── <motion.radialGradient> (Spotlight circle tracking cursor coords)
│   └── <mask> (Applies radial spotlight as a stencil over text)
├── <text (hidden)> (Invisible DOM element for sub-pixel bbox measuring)
├── <text (outline)> (Faint stroke that fades in on hover)
├── <motion.text (stroke)> (Entrance animation drawing character contours)
└── <text (revealed)> (Gradient-colored fill clipped by radial mask)
```

---

## Usage

```tsx
import { TextHoverEffect } from "@/components/text-hover-effect"
```

```tsx
export function HeroSection() {
  return (
    <div className="mx-auto h-40 w-full max-w-2xl">
      <TextHoverEffect text="PORTFOLIO" />
    </div>
  )
}
```

---

## Features

- **SSR-Safe Pure-Math ViewBox**: Calculates an accurate initial SVG bounding box mathematically without requiring client DOM access, preventing layout shift and hydration mismatches.
- **Isolated Multi-Instance IDs**: Automatically scopes SVG gradient, filter, and mask IDs with `useId()`, allowing multiple independent instances on the same page without cursor conflict.
- **Dynamic Gradient Palettes**: Pass custom hex color arrays to match brand guidelines, dark cyberpunk themes, or warm sunset palettes.
- **Automatic Ambient Sweep**: Activate `automatic={true}` to continuously sweep the radial spotlight back and forth across the text during idle periods.
- **Responsive Vector Geometry**: Built entirely with scalable vector graphics that seamlessly fit any container width while preserving sharp typographic contours.

---

## API Reference

### TextHoverEffect

Interactive typographic SVG reveal component.

| Prop             | Type       | Default                                                   | Description                                                                          |
| :--------------- | :--------- | :-------------------------------------------------------- | :----------------------------------------------------------------------------------- |
| `text`           | `string`   | -                                                         | The text string to render and animate (required).                                    |
| `duration`       | `number`   | `0`                                                       | Cursor follow interpolation duration in seconds. Set higher for smoother lag effect. |
| `automatic`      | `boolean`  | `false`                                                   | When enabled, continuously sweeps the radial gradient across the text when idle.     |
| `strokeDuration` | `number`   | `4`                                                       | Duration in seconds of the initial outline drawing animation on mount.               |
| `colors`         | `string[]` | `["#eab308", "#ef4444", "#3b82f6", "#06b6d4", "#8b5cf6"]` | Custom hex or CSS color stops for the hover reveal gradient.                         |
| `className`      | `string`   | `undefined`                                               | Additional CSS classes for the SVG container.                                        |
