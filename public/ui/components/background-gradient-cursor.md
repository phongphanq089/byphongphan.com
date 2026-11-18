# Background Gradient Cursor

> Interactive ambient canvas surface featuring cursor-tracking radial mask, procedural dots, dynamic grid lines, and directional linear gradients.

## Installation

  

  ```bash
npx shadcn@latest add https://byphongphan.com/r/background-gradient-cursor.json
```

  
    
      - Copy and paste the component into your project:
      ```tsx
// animated/background-gradient-cursor.tsx
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

import { cn } from "@/lib/utils"

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

```

      - Update the import paths to match your project directory structure.
    

  

---

## Anatomy

```text
BackgroundGradientCursor (Relative/Absolute/Fixed canvas wrapper)
├── <div (gradient)> (Directional linear background gradient with tilt)
├── <div (lines)> (Repeating 45° angled architectural hatching lines)
├── <div (grid)> (Procedural coordinate grid layout with customizable size)
├── <div (dots)> (Radial dot matrix pattern with variable opacity)
├── <div (mask)> (High-performance cursor-following radial spotlight mask)
└── {children} (Optional overlaying content, badges, or interactive cards)
```

---

## Usage

```tsx
import { BackgroundGradientCursor } from "@/components/background-gradient-cursor"
```

```tsx
export function HeroBackground() {
  return (
    <div className="relative min-h-[400px] w-full overflow-hidden rounded-xl border border-border bg-neutral-950 p-6">
      <BackgroundGradientCursor
        position="absolute"
        gradient={{
          display: true,
          tilt: 135,
          colorStart: "emerald-500",
          colorEnd: "transparent",
          opacity: 25,
        }}
        grid={{
          display: true,
          width: "32px",
          height: "32px",
          color: "white/10",
        }}
        dots={{
          display: true,
          size: 1.5,
          color: "white",
        }}
        mask={{
          cursor: true,
          radius: 160,
          color: "rgba(16, 185, 129, 0.4)",
        }}
      />
      <div className="relative z-10">
        <h3>Interactive Canvas Content</h3>
      </div>
    </div>
  )
}
```

---

## Features

- **Hardware-Accelerated Cursor Tracking**: Leverages `requestAnimationFrame` with exponential smoothing (`easingFactor: 0.1`) to ensure buttery smooth, lag-free cursor tracking without layout thrashing.
- **Layered Visual Stacking**: Five independent, composable layers—linear gradient, diagonal lines, coordinate grid, dot matrix, and radial mask—can be toggled and configured individually.
- **Universal Color Token Support**: Accepts standard CSS variable names (e.g. `primary`, `emerald-500`), direct variables (`var(--...)`), hex codes (`#10b981`), and modern color formats (`oklch(...)`).
- **Zero Heavy Runtime Dependencies**: Pure React 19 implementation using native CSS gradients and transforms, requiring no external 3D or animation libraries.
- **Viewport & Element Boundary Awareness**: Automatically switches between fixed full-page tracking and scoped container boundary tracking, cleanly hiding the spotlight when the cursor exits the element.

---

## API Reference

### BackgroundGradientCursor

The primary background container and compositor component.

| Prop        | Type                        | Default      | Description                                                                      |
| :---------- | :-------------------------- | :----------- | :------------------------------------------------------------------------------- |
| `position`  | `CSSProperties["position"]` | `"absolute"` | CSS positioning mode (`"absolute"`, `"fixed"`, or `"relative"`).                 |
| `gradient`  | `GradientProps`             | `{}`         | Configuration for the underlying linear gradient wash.                           |
| `dots`      | `DotsProps`                 | `{}`         | Configuration for the procedural dot matrix pattern.                             |
| `grid`      | `GridProps`                 | `{}`         | Configuration for the perpendicular grid lines.                                  |
| `lines`     | `LinesProps`                | `{}`         | Configuration for the 45-degree repeating diagonal hatching lines.               |
| `mask`      | `MaskProps`                 | `{}`         | Configuration for the radial spotlight mask that follows cursor or fixed coords. |
| `className` | `string`                    | `undefined`  | Additional CSS classes for the container element.                                |
| `style`     | `CSSProperties`             | `undefined`  | Inline style overrides.                                                          |
| `children`  | `ReactNode`                 | `undefined`  | Child elements rendered above background layers (ensure `z-index` if needed).    |

### MaskProps

| Property   | Type               | Default          | Description                                                                   |
| :--------- | :----------------- | :--------------- | :---------------------------------------------------------------------------- |
| `cursor`   | `boolean`          | `false`          | Enables cursor tracking with smooth frame interpolation.                      |
| `x`        | `number`           | `undefined`      | Static X position percentage (used when `cursor` is `false`).                 |
| `y`        | `number`           | `undefined`      | Static Y position percentage (used when `cursor` is `false`).                 |
| `radius`   | `number \| string` | `150px` / `50vh` | Radial radius of the spotlight (pixel value or CSS length unit).              |
| `color`    | `string`           | `undefined`      | Center color of the radial glow (e.g. `primary`, `#38bdf8`, `rgba(...)`).     |
| `gradient` | `string`           | `undefined`      | Custom CSS `radial-gradient(...)` string to completely override mask styling. |

### GradientProps

| Property     | Type      | Default       | Description                                                    |
| :----------- | :-------- | :------------ | :------------------------------------------------------------- |
| `display`    | `boolean` | `false`       | Whether to render the linear gradient layer.                   |
| `opacity`    | `number`  | `50`          | Opacity percentage from `0` to `100`.                          |
| `tilt`       | `number`  | `0`           | Angle in degrees for the linear gradient direction.            |
| `colorStart` | `string`  | `transparent` | Color token, hex code, or CSS variable for the gradient start. |
| `colorEnd`   | `string`  | `transparent` | Color token, hex code, or CSS variable for the gradient end.   |

### GridProps

| Property  | Type      | Default    | Description                                                |
| :-------- | :-------- | :--------- | :--------------------------------------------------------- |
| `display` | `boolean` | `false`    | Whether to render the perpendicular grid lines.            |
| `opacity` | `number`  | `100`      | Opacity percentage from `0` to `100`.                      |
| `color`   | `string`  | `"border"` | Color token, hex code, or CSS variable for the grid lines. |
| `width`   | `string`  | `"32px"`   | Horizontal cell width of the grid pattern.                 |
| `height`  | `string`  | `"32px"`   | Vertical cell height of the grid pattern.                  |

### DotsProps

| Property  | Type      | Default        | Description                                          |
| :-------- | :-------- | :------------- | :--------------------------------------------------- |
| `display` | `boolean` | `false`        | Whether to render the dot matrix pattern.            |
| `opacity` | `number`  | `30`           | Opacity percentage from `0` to `100`.                |
| `color`   | `string`  | `"foreground"` | Color token, hex code, or CSS variable for the dots. |
| `size`    | `number`  | `1`            | Radius in pixels of each rendered dot.               |

### LinesProps

| Property  | Type      | Default    | Description                                                    |
| :-------- | :-------- | :--------- | :------------------------------------------------------------- |
| `display` | `boolean` | `false`    | Whether to render the 45-degree diagonal lines.                |
| `opacity` | `number`  | `100`      | Opacity percentage from `0` to `100`.                          |
| `size`    | `number`  | `16`       | Spacing interval in pixels between repeating lines.            |
| `color`   | `string`  | `"border"` | Color token, hex code, or CSS variable for the hatching lines. |
