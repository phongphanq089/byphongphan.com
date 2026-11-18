# Plucked Text

> A headline sitting on an acoustic string you can pluck, strum and let ring, simulated with real harmonic standing wave physics.

## Installation

  

  ```bash
npx shadcn@latest add https://byphongphan.com/r/plucked-text.json
```

  
    
      - Copy and paste the component into your project (zero external animation dependencies required):
      ```tsx
// animated/plucked-text.tsx
import type React from "react"
import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export interface PluckedTextProps {
  /** The line of text that sits on the string. Keep it to one line. */
  text?: string
  /** Optional text content passed as children */
  children?: React.ReactNode
  /** Classes applied directly to the typography / stage container */
  className?: string
  /** Classes applied to the outer wrapper */
  wrapperClassName?: string
  /** How taut the string is. Higher rings faster and settles sooner. @default 1 */
  tension?: number
  /** Strum the string when the cursor sweeps across it, not only on drag. @default true */
  strum?: boolean
}

// The string is simulated as a sum of its standing waves (modes), each one a
// damped oscillator solved exactly, so it can't blow up at any frame rate.
const MAX_MODES = 24
// No mode may vibrate faster than this many times a second; above it, a
// 60 Hz screen would alias it into jitter.
const MAX_MODE_HZ = 22
// Wave speed along the string, in px per second, at tension 1. A real
// string keeps its wave speed, so a longer one rings lower.
const WAVE_SPEED = 1500
// Damping: every mode loses some energy, high ones much faster, so a pluck
// starts sharp and rounds off into a slow sway, as a real string does.
const DAMP_BASE = 0.9
const DAMP_HIGH = 0.012
// Sample spacing along the string for the drawn path, in px.
const STEP = 6
// Displacements flatten out past this fraction of the font size, so a
// hard pull bends the line without throwing letters off it.
const MAX_SWING = 0.6
// How much of a sweep's vertical speed reaches the string.
const STRUM_GAIN = 0.55
const MAX_STRUM_SPEED = 2400
// Below this energy the string is at rest and the loop stops.
const REST_ENERGY = 0.02
// Letters tilt with the string, a little less than its full slope.
const TILT = 0.85

interface Mode {
  q: number
  v: number
  omega: number
  gamma: number
  damped: number
}

/** Advance one damped oscillator by `dt` seconds, exactly. */
function stepMode(mode: Mode, dt: number) {
  const { q, v, omega, gamma, damped } = mode
  const decay = Math.exp(-gamma * dt)
  const c = Math.cos(damped * dt)
  const s = Math.sin(damped * dt)
  mode.q = decay * (q * c + ((v + gamma * q) / damped) * s)
  mode.v = decay * (v * c - ((omega * omega * q + gamma * v) / damped) * s)
}

/**
 * The string pulled into a V with its apex at `apex` and height `height`,
 * written as standing waves. Cutting the series short rounds the corner.
 */
function triangleModes(
  modes: Mode[],
  length: number,
  apex: number,
  height: number
) {
  const d = Math.min(Math.max(apex, 1), length - 1)
  modes.forEach((mode, index) => {
    const n = index + 1
    mode.q =
      ((2 * height * length * length) /
        (n * n * Math.PI * Math.PI * d * (length - d))) *
      Math.sin((n * Math.PI * d) / length)
    mode.v = 0
  })
}

/** Rubber band: grows like `x` near zero and never past `max`. */
function soften(x: number, max: number) {
  return max * Math.tanh(x / max)
}

export function PluckedText({
  text,
  children,
  className,
  wrapperClassName,
  tension = 1,
  strum = true,
}: PluckedTextProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<HTMLSpanElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const ghostRef = useRef<SVGPathElement>(null)

  const resolvedText =
    text ?? (typeof children === "string" ? children : "Good vibrations")

  useEffect(() => {
    const stage = stageRef.current
    const lettersEl = lettersRef.current
    const svg = svgRef.current
    const path = pathRef.current
    const ghost = ghostRef.current
    if (!(stage && lettersEl && svg && path && ghost)) {
      return
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const letters = Array.from(lettersEl.children).slice(0, -1) as HTMLElement[]

    let length = 0
    let swing = 0
    let modes: Mode[] = []
    // Precomputed sin and cos of every mode at every sample and letter.
    let pathBasis: Float64Array[] = []
    let letterBasis: { sin: Float64Array; cos: Float64Array }[] = []
    let raf = 0
    let last = 0
    let visible = true
    let lastPath = ""

    // Pointer state: a grab holds the string in a V; otherwise the last
    // position is kept to notice the cursor sweeping across the line.
    let grab: { id: number; x: number; y: number } | null = null
    let release: { from: Float64Array; start: number } | null = null
    let prev: { x: number; y: number; t: number } | null = null

    const measure = () => {
      // The string sits on the text's baseline, found with an empty
      // inline-block, whose bottom edge rests on it.
      const probe = lettersEl.lastElementChild as HTMLElement
      stage.style.setProperty(
        "--pluck-baseline",
        `${lettersEl.offsetTop + probe.offsetTop + probe.offsetHeight}px`
      )
      const svgBox = svg.getBoundingClientRect()
      const lettersLeft = lettersEl.getBoundingClientRect().left - svgBox.left
      length = svgBox.width
      swing = Number.parseFloat(getComputedStyle(stage).fontSize) * MAX_SWING
      const f0 = (WAVE_SPEED * tension) / (2 * length)
      const count = Math.max(
        4,
        Math.min(MAX_MODES, Math.floor(MAX_MODE_HZ / f0))
      )
      const old = modes
      modes = Array.from({ length: count }, (_, index) => {
        const n = index + 1
        const omega = 2 * Math.PI * f0 * n
        const gamma = (DAMP_BASE + DAMP_HIGH * n * n) * Math.sqrt(tension)
        return {
          q: old[index]?.q ?? 0,
          v: old[index]?.v ?? 0,
          omega,
          gamma,
          damped: Math.sqrt(Math.max(omega * omega - gamma * gamma, 1)),
        }
      })
      const samples = Math.ceil(length / STEP) + 1
      pathBasis = Array.from({ length: samples }, (_, i) => {
        const x = Math.min(i * STEP, length)
        return Float64Array.from(modes, (_m, index) =>
          Math.sin(((index + 1) * Math.PI * x) / length)
        )
      })
      letterBasis = letters.map((letter) => {
        // Offsets ignore the transform the loop applies.
        const x = lettersLeft + letter.offsetLeft + letter.offsetWidth / 2
        const k = (index: number) => ((index + 1) * Math.PI) / length
        return {
          sin: Float64Array.from(modes, (_m, index) => Math.sin(k(index) * x)),
          cos: Float64Array.from(
            modes,
            (_m, index) => k(index) * Math.cos(k(index) * x)
          ),
        }
      })
    }

    /** Displacement of the string where `basis` was sampled. */
    const sum = (basis: Float64Array) => {
      let y = 0
      for (let i = 0; i < modes.length; i++) {
        y += modes[i].q * basis[i]
      }
      return y
    }

    const draw = () => {
      let d = ""
      for (let i = 0; i < pathBasis.length; i++) {
        const x = Math.min(i * STEP, length)
        const y = soften(sum(pathBasis[i]), swing)
        d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(2)}`
      }
      // The previous frame stays behind faintly: a vibrating string blurs.
      ghost.setAttribute("d", lastPath || d)
      path.setAttribute("d", d)
      lastPath = d
      for (let i = 0; i < letters.length; i++) {
        const { sin, cos } = letterBasis[i]
        const raw = sum(sin)
        const y = soften(raw, swing)
        // Slope of the softened curve, so tilt eases off with the swing.
        const t = Math.tanh(raw / swing)
        const slope = sum(cos) * (1 - t * t)
        const angle = Math.atan(slope) * TILT
        letters[i].style.transform =
          `translate3d(0, ${y.toFixed(2)}px, 0) rotate(${angle.toFixed(4)}rad)`
      }
    }

    const energy = () =>
      modes.reduce((e, m) => e + m.v * m.v + m.omega * m.omega * m.q * m.q, 0)

    const settle = () => {
      for (const mode of modes) {
        mode.q = 0
        mode.v = 0
      }
    }

    /** Reduced motion: no ringing, the line just eases back flat. */
    const easeBack = (now: number) => {
      if (!release) {
        return
      }
      const t = Math.min((now - release.start) / 260, 1)
      const left = (1 - t) ** 3
      const from = release.from
      modes.forEach((mode, index) => {
        mode.q = from[index] * left
      })
      if (t >= 1) {
        release = null
        settle()
      }
    }

    const advance = (now: number, dt: number) => {
      if (release) {
        easeBack(now)
      } else if (!grab) {
        for (const mode of modes) {
          stepMode(mode, dt)
        }
      }
    }

    const frame = (now: number) => {
      raf = 0
      if (!visible) {
        return
      }
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60
      last = now
      advance(now, dt)
      draw()
      if (grab || release || energy() > REST_ENERGY) {
        raf = requestAnimationFrame(frame)
        return
      }
      settle()
      draw()
      ghost.setAttribute("d", path.getAttribute("d") ?? "")
    }

    const start = () => {
      if (!raf && visible) {
        last = 0
        raf = requestAnimationFrame(frame)
      }
    }

    /** Pointer position along the string and above or below it. */
    const local = (event: PointerEvent) => {
      const r = svg.getBoundingClientRect()
      return { x: event.clientX - r.left, y: event.clientY - r.top }
    }

    const lineAt = (x: number) => {
      let y = 0
      for (let i = 0; i < modes.length; i++) {
        y += modes[i].q * Math.sin(((i + 1) * Math.PI * x) / length)
      }
      return soften(y, swing)
    }

    const onDown = (event: PointerEvent) => {
      if (grab || event.button !== 0) {
        return
      }
      const point = local(event)
      if (point.x < 0 || point.x > length) {
        return
      }
      event.preventDefault()
      stage.setPointerCapture(event.pointerId)
      release = null
      grab = { id: event.pointerId, x: point.x, y: point.y }
      stage.dataset.grabbing = ""
      triangleModes(modes, length, point.x, lineAt(point.x))
      start()
    }

    const onMove = (event: PointerEvent) => {
      const point = local(event)
      if (grab && event.pointerId === grab.id) {
        grab.x = Math.min(Math.max(point.x, 0), length)
        grab.y = soften(point.y, swing * 1.6)
        triangleModes(modes, length, grab.x, grab.y)
        start()
        return
      }
      if (!(strum && event.pointerType === "mouse") || reduceMotion) {
        prev = null
        return
      }
      const now = event.timeStamp
      if (prev && point.x >= 0 && point.x <= length) {
        const before = prev.y - lineAt(prev.x)
        const after = point.y - lineAt(point.x)
        if (before * after < 0) {
          const dt = Math.max(now - prev.t, 8) / 1000
          const speed = Math.max(
            -MAX_STRUM_SPEED,
            Math.min(MAX_STRUM_SPEED, (point.y - prev.y) / dt)
          )
          const where =
            prev.x + (point.x - prev.x) * (before / (before - after))
          modes.forEach((mode, index) => {
            const n = index + 1
            mode.v +=
              ((STRUM_GAIN * speed * 80) / length) *
              Math.sin((n * Math.PI * where) / length) *
              Math.exp(-((n / 14) ** 2))
          })
          start()
        }
      }
      prev = { x: point.x, y: point.y, t: now }
    }

    const onUp = (event: PointerEvent) => {
      if (!grab || event.pointerId !== grab.id) {
        return
      }
      grab = null
      delete stage.dataset.grabbing
      if (reduceMotion) {
        release = {
          from: Float64Array.from(modes, (mode) => mode.q),
          start: performance.now(),
        }
      }
      start()
    }

    const onLeave = () => {
      prev = null
    }

    measure()
    draw()

    const resizeObserver = new ResizeObserver(() => {
      measure()
      draw()
    })
    resizeObserver.observe(stage)
    document.fonts?.ready.then(() => {
      measure()
      draw()
    })

    let greeted = reduceMotion
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && document.visibilityState === "visible"
        if (!visible) {
          return
        }
        if (!greeted && entry.intersectionRatio > 0.6) {
          greeted = true
          triangleModes(modes, length, length * 0.3, -swing * 0.5)
        }
        start()
      },
      { threshold: [0, 0.6] }
    )
    intersection.observe(stage)
    const onVisibility = () => {
      visible = document.visibilityState === "visible"
      if (visible) {
        start()
      }
    }
    document.addEventListener("visibilitychange", onVisibility)

    stage.addEventListener("pointerdown", onDown)
    stage.addEventListener("pointermove", onMove)
    stage.addEventListener("pointerup", onUp)
    stage.addEventListener("pointercancel", onUp)
    stage.addEventListener("pointerleave", onLeave)

    return () => {
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      intersection.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      stage.removeEventListener("pointerdown", onDown)
      stage.removeEventListener("pointermove", onMove)
      stage.removeEventListener("pointerup", onUp)
      stage.removeEventListener("pointercancel", onUp)
      stage.removeEventListener("pointerleave", onLeave)
    }
  }, [resolvedText, tension, strum])

  return (
    <div
      className={cn(
        "flex w-full max-w-full justify-center overflow-hidden",
        wrapperClassName
      )}
    >
      <div
        className={cn(
          "group/pluck relative max-w-full cursor-grab touch-none px-[0.5em] py-[0.7em] leading-none tracking-tight select-none data-[grabbing]:cursor-grabbing",
          "text-xl font-black text-foreground sm:text-3xl md:text-5xl",
          className
        )}
        ref={stageRef}
      >
        <span className="sr-only">{resolvedText}</span>
        <span
          aria-hidden="true"
          className="relative block whitespace-pre"
          ref={lettersRef}
        >
          {Array.from(resolvedText).map((char, index) => (
            <span
              className="inline-block origin-[50%_100%] will-change-transform"
              key={index}
            >
              {char}
            </span>
          ))}
          <span className="inline-block h-0 w-0" />
        </span>
        {/* The string runs along the baseline, pinned at both ends. */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-[0.25em] h-px w-[calc(100%-0.5em)] overflow-visible text-primary/70"
          ref={svgRef}
          style={{ top: "var(--pluck-baseline, 1.56em)" }}
        >
          <path
            className="opacity-30"
            fill="none"
            ref={ghostRef}
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth={1.5}
          />
          <path
            fill="none"
            ref={pathRef}
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth={1.5}
          />
        </svg>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[0.25em] size-[0.14em] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
          style={{ top: "var(--pluck-baseline, 1.56em)" }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[0.25em] size-[0.14em] translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
          style={{ top: "var(--pluck-baseline, 1.56em)" }}
        />
      </div>
    </div>
  )
}

PluckedText.displayName = "PluckedText"

export default PluckedText

```

      - Update the import paths to match your project directory structure.
    

  

---

## Anatomy

```text
PluckedText (Acoustic string container with harmonic wave physics loop)
├── <span className="sr-only"> (Full plain text string for screen readers)
├── <svg> (Vector string line & anchor pin markers)
│   ├── <path> (Harmonic curve computed from standing modes)
│   ├── <path> (Underlying ghost guideline)
│   ├── <circle> (Left anchor pin)
│   └── <circle> (Right anchor pin)
└── <span aria-hidden="true"> (Per-letter spans tilted and aligned to local string normal)
```

---

## Usage

```tsx
import { PluckedText } from "@/components/plucked-text"
```

```tsx
export function HeroHeading() {
  return (
    <PluckedText
      text="ACOUSTIC STRING"
      tension={1.0}
      strum={true}
      className="text-5xl sm:text-7xl font-black"
    />
  )
}
```

---

## Features

- **Harmonic Standing Wave Physics**: The string is simulated as a summation of up to 24 damped standing wave modes, each solved with exact analytical harmonic equations without frame-rate explosion.
- **Pluck & Drag Interaction**: Dragging the string or headline creates a triangular displacement that releases into authentic overtone vibrations.
- **Strum on Sweep**: Passing the mouse cursor briskly across the string transfers kinetic impulse, letting you strum headlines like guitar strings.
- **Letter Tilt & Normal Alignment**: Each individual glyph tracks the local displacement and tangents of the string, dynamically tilting with string curvature.
- **Zero Heavy Dependencies**: Pure TypeScript and SVG path calculation running at 60/120fps with automatic sleep when energy decays below threshold.
- **Accessibility & Reduced Motion**: Automatically renders static text when the user prefers reduced motion, and provides accessible screen-reader markup.

---

## API Reference

### PluckedText

Acoustic string simulation headline component.

| Prop        | Type              | Default     | Description                                                                     |
| :---------- | :---------------- | :---------- | :------------------------------------------------------------------------------ |
| `text`      | `string`          | `undefined` | The line of text sitting on the string. Keep to a single line.                  |
| `children`  | `React.ReactNode` | `undefined` | Text content passed as children.                                                |
| `tension`   | `number`          | `1`         | How taut the string is. Higher tension rings faster and settles sooner.         |
| `strum`     | `boolean`         | `true`      | Whether sweeping the cursor across the string strums and excites vibrations.   |
| `className` | `string`          | `undefined` | Additional CSS classes for typographic styling (font size, weight, tracking).   |
