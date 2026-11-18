# Elastic Slider

> A tactile spring-physics slider with boundary rubber-banding, magnetic decile damping, text-dodging handle, and full WAI-ARIA accessibility.

## Installation

  

  ```bash
npx shadcn@latest add https://byphongphan.com/r/elastic-slider.json
```

  
    
      - Install the following animation dependencies:
      ```bash
npm install motion
```

      - Copy and paste the component into your project:
      ```tsx
// animated/elastic-slider.tsx
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react"
import type React from "react"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

import { useControllableState } from "@/hooks/use-controllable-state"
import { cn } from "@/lib/utils"

// Safe layout effect for SSR
const useSafeLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

// Drag detection & rubber band parameters
const CLICK_THRESHOLD = 3
const DEAD_ZONE = 32
const MAX_CURSOR_RANGE = 200
const MAX_STRETCH = 8

// Layout offsets used by the "handle dodges label/value" calculation
const HANDLE_BUFFER = 8
const LABEL_OFFSET = 12 + 4
const VALUE_OFFSET = 12 - 8

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

function decimalsForStep(step: number): number {
  const s = step.toString()
  const dot = s.indexOf(".")
  return dot === -1 ? 0 : s.length - dot - 1
}

function roundValue(val: number, step: number): number {
  const raw = Math.round(val / step) * step
  return Number.parseFloat(raw.toFixed(decimalsForStep(step)))
}

// Magnetic snap to the nearest decile when within 3.125% of it.
function snapToDecile(rawValue: number, min: number, max: number): number {
  const normalized = (rawValue - min) / (max - min)
  const nearest = Math.round(normalized * 10) / 10
  if (Math.abs(normalized - nearest) <= 0.03125) {
    return min + nearest * (max - min)
  }
  return rawValue
}

export type ElasticSliderVariant =
  "default" | "primary" | "success" | "destructive"

export type ElasticSliderSize = "sm" | "default" | "lg"

export interface ElasticSliderProps {
  /** Label shown inside the track on the left */
  label: string

  /** Controlled value. Use together with `onValueChange` */
  value?: number
  /** Initial value for uncontrolled mode. Falls back to `min` */
  defaultValue?: number
  /** Called with the new value on drag, click, or key press */
  onValueChange?: (value: number) => void

  /** Minimum value. @default 0 */
  min?: number
  /** Maximum value. @default 100 */
  max?: number
  /** Smallest increment. @default 1 */
  step?: number
  /** Format the displayed value. Defaults to value formatted by step precision */
  formatValue?: (value: number) => string

  /** Visual color theme variant */
  variant?: ElasticSliderVariant
  /** Height and density size variant */
  size?: ElasticSliderSize

  /** Optional icon placed next to the label */
  icon?: React.ReactNode

  className?: string
  wrapperClassName?: string
  /** Accessible name. Falls back to `label` */
  "aria-label"?: string
  disabled?: boolean
}

export function ElasticSlider({
  label,
  value: valueProp,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  formatValue,
  variant = "default",
  size = "default",
  icon,
  className,
  wrapperClassName,
  "aria-label": ariaLabel,
  disabled = false,
}: ElasticSliderProps) {
  const [value = min, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue ?? min,
    onChange: onValueChange,
  })

  const shouldReduceMotion = useReducedMotion()

  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const valueRef = useRef<HTMLSpanElement>(null)

  const [isInteracting, setIsInteracting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  /** Ring only for Tab focus or keyboard value nudges, not pointer press/drag. */
  const [keyboardFocusRing, setKeyboardFocusRing] = useState(false)

  // Pointer session state — mutable, does not trigger re-renders.
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null)
  const pendingPointerFocusRef = useRef(false)
  const isClickRef = useRef(true)
  const animRef = useRef<ReturnType<typeof animate> | null>(null)
  const wrapperRectRef = useRef<DOMRect | null>(null)
  const scaleRef = useRef(1)

  const percentage = ((value - min) / (max - min)) * 100
  const isActive = (isInteracting || isHovered) && !disabled
  const displayValue = formatValue
    ? formatValue(value)
    : value.toFixed(decimalsForStep(step))

  // Fill + handle driven by a single motion value for imperative updates.
  const fillPercent = useMotionValue(percentage)
  const fillWidth = useTransform(fillPercent, (pct) => `${pct}%`)
  const handleLeft = useTransform(
    fillPercent,
    (pct) => `max(4px, calc(${pct}% - 8px))`
  )

  // Rubber band: widens the track and pulls it left when dragged past bounds.
  const rubberStretch = useMotionValue(0)
  const rubberWidth = useTransform(
    rubberStretch,
    (s) => `calc(100% + ${Math.abs(s)}px)`
  )
  const rubberX = useTransform(rubberStretch, (s) => (s < 0 ? s : 0))

  // Sync from props when not interacting and no spring is in flight.
  useEffect(() => {
    if (!isInteracting && !animRef.current) {
      fillPercent.jump(percentage)
    }
  }, [percentage, isInteracting, fillPercent])

  const positionToValue = useCallback(
    (clientX: number) => {
      const rect = wrapperRectRef.current
      if (!rect) return min

      const sceneX = (clientX - rect.left) / scaleRef.current
      const nativeWidth = wrapperRef.current?.offsetWidth ?? rect.width
      const percent = clamp(sceneX / nativeWidth, 0, 1)

      return clamp(min + percent * (max - min), min, max)
    },
    [min, max]
  )

  const percentFromValue = useCallback(
    (v: number) => ((v - min) / (max - min)) * 100,
    [min, max]
  )

  // Animate fill to a target percent, or jump instantly when reduced motion is preferred.
  const animateFillTo = useCallback(
    (targetPercent: number) => {
      animRef.current?.stop()

      if (shouldReduceMotion) {
        fillPercent.jump(targetPercent)
        animRef.current = null
        return
      }

      animRef.current = animate(fillPercent, targetPercent, {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        onComplete: () => {
          animRef.current = null
        },
      })
    },
    [fillPercent, shouldReduceMotion]
  )

  const computeRubberStretch = useCallback((clientX: number, sign: number) => {
    const rect = wrapperRectRef.current
    if (!rect) return 0

    const distancePast = sign < 0 ? rect.left - clientX : clientX - rect.right
    const overflow = Math.max(0, distancePast - DEAD_ZONE)

    return (
      sign * MAX_STRETCH * Math.sqrt(Math.min(overflow / MAX_CURSOR_RANGE, 1))
    )
  }, [])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)

      pointerDownPos.current = { x: e.clientX, y: e.clientY }
      isClickRef.current = true
      setIsInteracting(true)
      pendingPointerFocusRef.current = true
      setKeyboardFocusRing(false)

      trackRef.current?.focus({ preventScroll: true })
      requestAnimationFrame(() => {
        pendingPointerFocusRef.current = false
      })

      const wrapper = wrapperRef.current
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect()
        wrapperRectRef.current = rect
        scaleRef.current = rect.width / wrapper.offsetWidth
      }
    },
    [disabled]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isInteracting || !pointerDownPos.current || disabled) return

      const dx = e.clientX - pointerDownPos.current.x
      const dy = e.clientY - pointerDownPos.current.y

      if (isClickRef.current && Math.hypot(dx, dy) > CLICK_THRESHOLD) {
        isClickRef.current = false
        setIsDragging(true)
      }

      if (isClickRef.current) return

      const rect = wrapperRectRef.current
      if (rect && !shouldReduceMotion) {
        if (e.clientX < rect.left) {
          rubberStretch.jump(computeRubberStretch(e.clientX, -1))
        } else if (e.clientX > rect.right) {
          rubberStretch.jump(computeRubberStretch(e.clientX, 1))
        } else {
          rubberStretch.jump(0)
        }
      }

      const newValue = positionToValue(e.clientX)
      animRef.current?.stop()
      animRef.current = null
      fillPercent.jump(percentFromValue(newValue))
      setValue(roundValue(newValue, step))
    },
    [
      isInteracting,
      disabled,
      positionToValue,
      percentFromValue,
      setValue,
      step,
      fillPercent,
      rubberStretch,
      computeRubberStretch,
      shouldReduceMotion,
    ]
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isInteracting || disabled) return

      if (isClickRef.current) {
        const rawValue = positionToValue(e.clientX)
        const discreteSteps = (max - min) / step
        const snapped =
          discreteSteps <= 10
            ? clamp(min + Math.round((rawValue - min) / step) * step, min, max)
            : snapToDecile(rawValue, min, max)

        animateFillTo(percentFromValue(snapped))
        setValue(roundValue(snapped, step))
      }

      if (!shouldReduceMotion && rubberStretch.get() !== 0) {
        animate(rubberStretch, 0, {
          type: "spring",
          visualDuration: 0.35,
          bounce: 0.15,
        })
      }

      setIsInteracting(false)
      setIsDragging(false)
      pointerDownPos.current = null
    },
    [
      isInteracting,
      disabled,
      positionToValue,
      percentFromValue,
      setValue,
      min,
      max,
      step,
      animateFillTo,
      rubberStretch,
      shouldReduceMotion,
    ]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return
      const arrowStep = e.shiftKey ? step * 10 : step
      let next: number | null = null

      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          next = value + arrowStep
          break
        case "ArrowLeft":
        case "ArrowDown":
          next = value - arrowStep
          break
        case "Home":
          next = min
          break
        case "End":
          next = max
          break
        default:
          return
      }

      e.preventDefault()
      setKeyboardFocusRing(true)

      const snapped = roundValue(clamp(next, min, max), step)
      animateFillTo(percentFromValue(snapped))
      setValue(snapped)
    },
    [disabled, value, min, max, step, animateFillTo, percentFromValue, setValue]
  )

  const handleTrackFocus = useCallback(() => {
    if (!pendingPointerFocusRef.current && !disabled) {
      setKeyboardFocusRing(true)
    }
  }, [disabled])

  const handleTrackBlur = useCallback(() => {
    setKeyboardFocusRing(false)
  }, [])

  // Measure label + value to derive "dodge" thresholds so the handle fades
  // when it would overlap either text.
  const [dodge, setDodge] = useState({ left: 35, right: 75 })

  useSafeLayoutEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const measure = () => {
      const trackWidth = wrapper.offsetWidth
      if (trackWidth <= 0) return

      const labelEl = labelRef.current
      const valueEl = valueRef.current

      const left = labelEl
        ? ((LABEL_OFFSET + labelEl.offsetWidth + HANDLE_BUFFER) / trackWidth) *
          100
        : 35

      const right = valueEl
        ? ((trackWidth - VALUE_OFFSET - valueEl.offsetWidth - HANDLE_BUFFER) /
            trackWidth) *
          100
        : 75

      setDodge((prev) =>
        prev.left === left && prev.right === right ? prev : { left, right }
      )
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(wrapper)
    if (labelRef.current) observer.observe(labelRef.current)
    if (valueRef.current) observer.observe(valueRef.current)

    return () => observer.disconnect()
  }, [label, displayValue])

  const valueDodge = percentage < dodge.left || percentage > dodge.right
  const handleOpacity = !isActive
    ? 0
    : valueDodge
      ? 0.15
      : isDragging
        ? 0.9
        : 0.6

  const discreteSteps = (max - min) / step
  const hashMarkCount = discreteSteps <= 10 ? discreteSteps - 1 : 9

  const hashMarkPct = (i: number) => {
    return discreteSteps <= 10
      ? (((i + 1) * step) / (max - min)) * 100
      : (i + 1) * 10
  }

  // Variant fill styles
  const fillClasses = {
    default:
      "bg-muted-foreground/15 group-data-[active=true]/slider:bg-muted-foreground/25",
    primary: "bg-primary/20 group-data-[active=true]/slider:bg-primary/30",
    success:
      "bg-emerald-500/20 group-data-[active=true]/slider:bg-emerald-500/30",
    destructive:
      "bg-destructive/20 group-data-[active=true]/slider:bg-destructive/30",
  }

  // Size configurations
  const sizeClasses = {
    sm: "h-8 text-xs",
    default: "h-10 text-sm",
    lg: "h-12 text-base",
  }

  return (
    <div
      ref={wrapperRef}
      data-slot="elastic-slider"
      className={cn(
        "relative w-full max-w-full select-none",
        sizeClasses[size],
        disabled && "pointer-events-none opacity-50",
        wrapperClassName
      )}
    >
      <motion.div
        ref={trackRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        data-slot="elastic-slider-track"
        data-active={isActive}
        data-focus-visible={keyboardFocusRing}
        aria-label={ariaLabel ?? label}
        aria-orientation="horizontal"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={displayValue}
        className={cn(
          "group/slider absolute inset-0 cursor-pointer touch-none overflow-hidden rounded-xl border border-border/60 bg-muted/70 backdrop-blur-xs transition-colors outline-none select-none",
          "data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-ring data-[focus-visible=true]:ring-offset-1 data-[focus-visible=true]:ring-offset-background",
          className
        )}
        style={{ width: rubberWidth, x: rubberX }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onFocus={handleTrackFocus}
        onBlur={handleTrackBlur}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hash Marks (Increment Ticks) */}
        <div
          data-slot="elastic-slider-hash-marks"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          {Array.from({ length: hashMarkCount }, (_, i) => (
            <div
              key={i}
              className={cn(
                "absolute top-1/2 h-2 w-px -translate-y-1/2 rounded-full transition-colors duration-200",
                "bg-border/40 group-data-[active=true]/slider:bg-border/80"
              )}
              style={{ left: `${hashMarkPct(i)}%` }}
            />
          ))}
        </div>

        {/* Dynamic Progress Fill */}
        <motion.div
          data-slot="elastic-slider-fill"
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 transition-colors",
            fillClasses[variant]
          )}
          style={{ width: fillWidth }}
        />

        {/* Handle Indicator (fades / scales down when dodging text) */}
        <motion.div
          data-slot="elastic-slider-handle"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 h-5 w-1 rounded-full bg-foreground"
          style={{ left: handleLeft, y: "-50%" }}
          animate={{
            opacity: handleOpacity,
            scaleX: isActive ? 1 : 0.25,
            scaleY: isActive && valueDodge ? 0.75 : 1,
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  scaleX: {
                    type: "spring",
                    visualDuration: 0.25,
                    bounce: 0.15,
                  },
                  scaleY: { type: "spring", visualDuration: 0.2, bounce: 0.1 },
                  opacity: { duration: 0.15 },
                }
          }
        />

        {/* Left Label (+ Optional Icon) */}
        <span
          ref={labelRef}
          data-slot="elastic-slider-label"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 inline-flex -translate-y-1/2 items-center gap-2 leading-none font-medium text-muted-foreground transition-colors group-data-[active=true]/slider:text-foreground"
        >
          {icon && (
            <span className="size-4 shrink-0 [&>svg]:size-4">{icon}</span>
          )}
          <span>{label}</span>
        </span>

        {/* Right Value Display */}
        <span
          ref={valueRef}
          data-slot="elastic-slider-value"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono leading-none font-medium text-muted-foreground transition-colors group-data-[active=true]/slider:text-foreground"
        >
          {displayValue}
        </span>
      </motion.div>
    </div>
  )
}

export { ElasticSlider as Slider }

ElasticSlider.displayName = "ElasticSlider"

export default ElasticSlider

```

      - Copy the controllable state hook helper:
      ```tsx
// animated/elastic-slider.tsx
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react"
import type React from "react"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

import { useControllableState } from "@/hooks/use-controllable-state"
import { cn } from "@/lib/utils"

// Safe layout effect for SSR
const useSafeLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

// Drag detection & rubber band parameters
const CLICK_THRESHOLD = 3
const DEAD_ZONE = 32
const MAX_CURSOR_RANGE = 200
const MAX_STRETCH = 8

// Layout offsets used by the "handle dodges label/value" calculation
const HANDLE_BUFFER = 8
const LABEL_OFFSET = 12 + 4
const VALUE_OFFSET = 12 - 8

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

function decimalsForStep(step: number): number {
  const s = step.toString()
  const dot = s.indexOf(".")
  return dot === -1 ? 0 : s.length - dot - 1
}

function roundValue(val: number, step: number): number {
  const raw = Math.round(val / step) * step
  return Number.parseFloat(raw.toFixed(decimalsForStep(step)))
}

// Magnetic snap to the nearest decile when within 3.125% of it.
function snapToDecile(rawValue: number, min: number, max: number): number {
  const normalized = (rawValue - min) / (max - min)
  const nearest = Math.round(normalized * 10) / 10
  if (Math.abs(normalized - nearest) <= 0.03125) {
    return min + nearest * (max - min)
  }
  return rawValue
}

export type ElasticSliderVariant =
  "default" | "primary" | "success" | "destructive"

export type ElasticSliderSize = "sm" | "default" | "lg"

export interface ElasticSliderProps {
  /** Label shown inside the track on the left */
  label: string

  /** Controlled value. Use together with `onValueChange` */
  value?: number
  /** Initial value for uncontrolled mode. Falls back to `min` */
  defaultValue?: number
  /** Called with the new value on drag, click, or key press */
  onValueChange?: (value: number) => void

  /** Minimum value. @default 0 */
  min?: number
  /** Maximum value. @default 100 */
  max?: number
  /** Smallest increment. @default 1 */
  step?: number
  /** Format the displayed value. Defaults to value formatted by step precision */
  formatValue?: (value: number) => string

  /** Visual color theme variant */
  variant?: ElasticSliderVariant
  /** Height and density size variant */
  size?: ElasticSliderSize

  /** Optional icon placed next to the label */
  icon?: React.ReactNode

  className?: string
  wrapperClassName?: string
  /** Accessible name. Falls back to `label` */
  "aria-label"?: string
  disabled?: boolean
}

export function ElasticSlider({
  label,
  value: valueProp,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  formatValue,
  variant = "default",
  size = "default",
  icon,
  className,
  wrapperClassName,
  "aria-label": ariaLabel,
  disabled = false,
}: ElasticSliderProps) {
  const [value = min, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue ?? min,
    onChange: onValueChange,
  })

  const shouldReduceMotion = useReducedMotion()

  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const valueRef = useRef<HTMLSpanElement>(null)

  const [isInteracting, setIsInteracting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  /** Ring only for Tab focus or keyboard value nudges, not pointer press/drag. */
  const [keyboardFocusRing, setKeyboardFocusRing] = useState(false)

  // Pointer session state — mutable, does not trigger re-renders.
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null)
  const pendingPointerFocusRef = useRef(false)
  const isClickRef = useRef(true)
  const animRef = useRef<ReturnType<typeof animate> | null>(null)
  const wrapperRectRef = useRef<DOMRect | null>(null)
  const scaleRef = useRef(1)

  const percentage = ((value - min) / (max - min)) * 100
  const isActive = (isInteracting || isHovered) && !disabled
  const displayValue = formatValue
    ? formatValue(value)
    : value.toFixed(decimalsForStep(step))

  // Fill + handle driven by a single motion value for imperative updates.
  const fillPercent = useMotionValue(percentage)
  const fillWidth = useTransform(fillPercent, (pct) => `${pct}%`)
  const handleLeft = useTransform(
    fillPercent,
    (pct) => `max(4px, calc(${pct}% - 8px))`
  )

  // Rubber band: widens the track and pulls it left when dragged past bounds.
  const rubberStretch = useMotionValue(0)
  const rubberWidth = useTransform(
    rubberStretch,
    (s) => `calc(100% + ${Math.abs(s)}px)`
  )
  const rubberX = useTransform(rubberStretch, (s) => (s < 0 ? s : 0))

  // Sync from props when not interacting and no spring is in flight.
  useEffect(() => {
    if (!isInteracting && !animRef.current) {
      fillPercent.jump(percentage)
    }
  }, [percentage, isInteracting, fillPercent])

  const positionToValue = useCallback(
    (clientX: number) => {
      const rect = wrapperRectRef.current
      if (!rect) return min

      const sceneX = (clientX - rect.left) / scaleRef.current
      const nativeWidth = wrapperRef.current?.offsetWidth ?? rect.width
      const percent = clamp(sceneX / nativeWidth, 0, 1)

      return clamp(min + percent * (max - min), min, max)
    },
    [min, max]
  )

  const percentFromValue = useCallback(
    (v: number) => ((v - min) / (max - min)) * 100,
    [min, max]
  )

  // Animate fill to a target percent, or jump instantly when reduced motion is preferred.
  const animateFillTo = useCallback(
    (targetPercent: number) => {
      animRef.current?.stop()

      if (shouldReduceMotion) {
        fillPercent.jump(targetPercent)
        animRef.current = null
        return
      }

      animRef.current = animate(fillPercent, targetPercent, {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        onComplete: () => {
          animRef.current = null
        },
      })
    },
    [fillPercent, shouldReduceMotion]
  )

  const computeRubberStretch = useCallback((clientX: number, sign: number) => {
    const rect = wrapperRectRef.current
    if (!rect) return 0

    const distancePast = sign < 0 ? rect.left - clientX : clientX - rect.right
    const overflow = Math.max(0, distancePast - DEAD_ZONE)

    return (
      sign * MAX_STRETCH * Math.sqrt(Math.min(overflow / MAX_CURSOR_RANGE, 1))
    )
  }, [])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)

      pointerDownPos.current = { x: e.clientX, y: e.clientY }
      isClickRef.current = true
      setIsInteracting(true)
      pendingPointerFocusRef.current = true
      setKeyboardFocusRing(false)

      trackRef.current?.focus({ preventScroll: true })
      requestAnimationFrame(() => {
        pendingPointerFocusRef.current = false
      })

      const wrapper = wrapperRef.current
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect()
        wrapperRectRef.current = rect
        scaleRef.current = rect.width / wrapper.offsetWidth
      }
    },
    [disabled]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isInteracting || !pointerDownPos.current || disabled) return

      const dx = e.clientX - pointerDownPos.current.x
      const dy = e.clientY - pointerDownPos.current.y

      if (isClickRef.current && Math.hypot(dx, dy) > CLICK_THRESHOLD) {
        isClickRef.current = false
        setIsDragging(true)
      }

      if (isClickRef.current) return

      const rect = wrapperRectRef.current
      if (rect && !shouldReduceMotion) {
        if (e.clientX < rect.left) {
          rubberStretch.jump(computeRubberStretch(e.clientX, -1))
        } else if (e.clientX > rect.right) {
          rubberStretch.jump(computeRubberStretch(e.clientX, 1))
        } else {
          rubberStretch.jump(0)
        }
      }

      const newValue = positionToValue(e.clientX)
      animRef.current?.stop()
      animRef.current = null
      fillPercent.jump(percentFromValue(newValue))
      setValue(roundValue(newValue, step))
    },
    [
      isInteracting,
      disabled,
      positionToValue,
      percentFromValue,
      setValue,
      step,
      fillPercent,
      rubberStretch,
      computeRubberStretch,
      shouldReduceMotion,
    ]
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isInteracting || disabled) return

      if (isClickRef.current) {
        const rawValue = positionToValue(e.clientX)
        const discreteSteps = (max - min) / step
        const snapped =
          discreteSteps <= 10
            ? clamp(min + Math.round((rawValue - min) / step) * step, min, max)
            : snapToDecile(rawValue, min, max)

        animateFillTo(percentFromValue(snapped))
        setValue(roundValue(snapped, step))
      }

      if (!shouldReduceMotion && rubberStretch.get() !== 0) {
        animate(rubberStretch, 0, {
          type: "spring",
          visualDuration: 0.35,
          bounce: 0.15,
        })
      }

      setIsInteracting(false)
      setIsDragging(false)
      pointerDownPos.current = null
    },
    [
      isInteracting,
      disabled,
      positionToValue,
      percentFromValue,
      setValue,
      min,
      max,
      step,
      animateFillTo,
      rubberStretch,
      shouldReduceMotion,
    ]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return
      const arrowStep = e.shiftKey ? step * 10 : step
      let next: number | null = null

      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          next = value + arrowStep
          break
        case "ArrowLeft":
        case "ArrowDown":
          next = value - arrowStep
          break
        case "Home":
          next = min
          break
        case "End":
          next = max
          break
        default:
          return
      }

      e.preventDefault()
      setKeyboardFocusRing(true)

      const snapped = roundValue(clamp(next, min, max), step)
      animateFillTo(percentFromValue(snapped))
      setValue(snapped)
    },
    [disabled, value, min, max, step, animateFillTo, percentFromValue, setValue]
  )

  const handleTrackFocus = useCallback(() => {
    if (!pendingPointerFocusRef.current && !disabled) {
      setKeyboardFocusRing(true)
    }
  }, [disabled])

  const handleTrackBlur = useCallback(() => {
    setKeyboardFocusRing(false)
  }, [])

  // Measure label + value to derive "dodge" thresholds so the handle fades
  // when it would overlap either text.
  const [dodge, setDodge] = useState({ left: 35, right: 75 })

  useSafeLayoutEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const measure = () => {
      const trackWidth = wrapper.offsetWidth
      if (trackWidth <= 0) return

      const labelEl = labelRef.current
      const valueEl = valueRef.current

      const left = labelEl
        ? ((LABEL_OFFSET + labelEl.offsetWidth + HANDLE_BUFFER) / trackWidth) *
          100
        : 35

      const right = valueEl
        ? ((trackWidth - VALUE_OFFSET - valueEl.offsetWidth - HANDLE_BUFFER) /
            trackWidth) *
          100
        : 75

      setDodge((prev) =>
        prev.left === left && prev.right === right ? prev : { left, right }
      )
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(wrapper)
    if (labelRef.current) observer.observe(labelRef.current)
    if (valueRef.current) observer.observe(valueRef.current)

    return () => observer.disconnect()
  }, [label, displayValue])

  const valueDodge = percentage < dodge.left || percentage > dodge.right
  const handleOpacity = !isActive
    ? 0
    : valueDodge
      ? 0.15
      : isDragging
        ? 0.9
        : 0.6

  const discreteSteps = (max - min) / step
  const hashMarkCount = discreteSteps <= 10 ? discreteSteps - 1 : 9

  const hashMarkPct = (i: number) => {
    return discreteSteps <= 10
      ? (((i + 1) * step) / (max - min)) * 100
      : (i + 1) * 10
  }

  // Variant fill styles
  const fillClasses = {
    default:
      "bg-muted-foreground/15 group-data-[active=true]/slider:bg-muted-foreground/25",
    primary: "bg-primary/20 group-data-[active=true]/slider:bg-primary/30",
    success:
      "bg-emerald-500/20 group-data-[active=true]/slider:bg-emerald-500/30",
    destructive:
      "bg-destructive/20 group-data-[active=true]/slider:bg-destructive/30",
  }

  // Size configurations
  const sizeClasses = {
    sm: "h-8 text-xs",
    default: "h-10 text-sm",
    lg: "h-12 text-base",
  }

  return (
    <div
      ref={wrapperRef}
      data-slot="elastic-slider"
      className={cn(
        "relative w-full max-w-full select-none",
        sizeClasses[size],
        disabled && "pointer-events-none opacity-50",
        wrapperClassName
      )}
    >
      <motion.div
        ref={trackRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        data-slot="elastic-slider-track"
        data-active={isActive}
        data-focus-visible={keyboardFocusRing}
        aria-label={ariaLabel ?? label}
        aria-orientation="horizontal"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={displayValue}
        className={cn(
          "group/slider absolute inset-0 cursor-pointer touch-none overflow-hidden rounded-xl border border-border/60 bg-muted/70 backdrop-blur-xs transition-colors outline-none select-none",
          "data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-ring data-[focus-visible=true]:ring-offset-1 data-[focus-visible=true]:ring-offset-background",
          className
        )}
        style={{ width: rubberWidth, x: rubberX }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onFocus={handleTrackFocus}
        onBlur={handleTrackBlur}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hash Marks (Increment Ticks) */}
        <div
          data-slot="elastic-slider-hash-marks"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          {Array.from({ length: hashMarkCount }, (_, i) => (
            <div
              key={i}
              className={cn(
                "absolute top-1/2 h-2 w-px -translate-y-1/2 rounded-full transition-colors duration-200",
                "bg-border/40 group-data-[active=true]/slider:bg-border/80"
              )}
              style={{ left: `${hashMarkPct(i)}%` }}
            />
          ))}
        </div>

        {/* Dynamic Progress Fill */}
        <motion.div
          data-slot="elastic-slider-fill"
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 transition-colors",
            fillClasses[variant]
          )}
          style={{ width: fillWidth }}
        />

        {/* Handle Indicator (fades / scales down when dodging text) */}
        <motion.div
          data-slot="elastic-slider-handle"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 h-5 w-1 rounded-full bg-foreground"
          style={{ left: handleLeft, y: "-50%" }}
          animate={{
            opacity: handleOpacity,
            scaleX: isActive ? 1 : 0.25,
            scaleY: isActive && valueDodge ? 0.75 : 1,
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  scaleX: {
                    type: "spring",
                    visualDuration: 0.25,
                    bounce: 0.15,
                  },
                  scaleY: { type: "spring", visualDuration: 0.2, bounce: 0.1 },
                  opacity: { duration: 0.15 },
                }
          }
        />

        {/* Left Label (+ Optional Icon) */}
        <span
          ref={labelRef}
          data-slot="elastic-slider-label"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 inline-flex -translate-y-1/2 items-center gap-2 leading-none font-medium text-muted-foreground transition-colors group-data-[active=true]/slider:text-foreground"
        >
          {icon && (
            <span className="size-4 shrink-0 [&>svg]:size-4">{icon}</span>
          )}
          <span>{label}</span>
        </span>

        {/* Right Value Display */}
        <span
          ref={valueRef}
          data-slot="elastic-slider-value"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono leading-none font-medium text-muted-foreground transition-colors group-data-[active=true]/slider:text-foreground"
        >
          {displayValue}
        </span>
      </motion.div>
    </div>
  )
}

export { ElasticSlider as Slider }

ElasticSlider.displayName = "ElasticSlider"

export default ElasticSlider

```

      - Update the import paths to match your project directory structure.
    

  

---

## Anatomy

```text
ElasticSlider (Outer bounded wrapper with overflow rubber stretch)
└── <motion.div role="slider"> (Interactive track with pointer capture & keyboard listeners)
    ├── <div data-slot="hash-marks"> (Subtle vertical increment ticks)
    ├── <motion.div data-slot="fill"> (Dynamic progress fill with spring animation)
    ├── <motion.div data-slot="handle"> (Thumb indicator dodging overlapping text)
    ├── <span data-slot="label"> (Left track label & optional icon)
    └── <span data-slot="value"> (Right monospace value readout)
```

---

## Usage

```tsx
import { ElasticSlider } from "@/components/elastic-slider"
import { Volume2 } from "lucide-react"
import { useState } from "react"
```

```tsx
export function VolumeControl() {
  const [volume, setVolume] = useState(60)

  return (
    <ElasticSlider
      label="Volume"
      icon={<Volume2 />}
      value={volume}
      onValueChange={setVolume}
      min={0}
      max={100}
      step={1}
      formatValue={(v) => `${v}%`}
      variant="primary"
    />
  )
}
```

---

## Features

- **Boundary Rubber-Banding**: Dragging past minimum or maximum bounds stretches the track like an elastic band (`MAX_STRETCH`) with smooth square-root spring decay, snapping back upon release.
- **Smart Text Dodging**: The slider handle dynamically measures internal label and value text boxes, fading and scaling down (`handleOpacity`, `scaleY`) when approaching text so they never clash awkwardly.
- **Magnetic Decile Snapping**: Snaps to clean 10% milestone deciles when dragged within a 3.125% threshold, while discrete sliders snap cleanly to exact steps.
- **Figma-Style Fast Nudging**: Pressing `Shift + ArrowRight / ArrowLeft` multiplies keyboard steps by 10x for ultra-fast, precise adjustments.
- **Dual State Control**: Supports both controlled (`value`, `onValueChange`) and uncontrolled (`defaultValue`) workflows via `useControllableState`.
- **WAI-ARIA Accessibility**: Standard slider semantics (`role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`) with keyboard focus ring and mouse suppression.
- **Reduced Motion**: Automatically skips elastic stretch and spring loops when `prefers-reduced-motion` is active.

---

## API Reference

### ElasticSlider

| Prop               | Type                                                    | Default     | Description                                                                     |
| :----------------- | :------------------------------------------------------ | :---------- | :------------------------------------------------------------------------------ |
| `label`            | `string`                                                | *Required*  | Text label displayed on the left inside the slider track.                      |
| `value`            | `number`                                                | `undefined` | Controlled numeric value. Use with `onValueChange`.                             |
| `defaultValue`     | `number`                                                | `min`       | Initial value for uncontrolled usage.                                           |
| `onValueChange`    | `(value: number) => void`                               | `undefined` | Callback fired when value changes during drag, click, or keyboard navigation.   |
| `min`              | `number`                                                | `0`         | Minimum permissible value.                                                      |
| `max`              | `number`                                                | `100`       | Maximum permissible value.                                                      |
| `step`             | `number`                                                | `1`         | Granularity increment step.                                                     |
| `formatValue`      | `(value: number) => string`                             | `undefined` | Function to format the displayed value text on the right.                      |
| `variant`          | `"default" \| "primary" \| "success" \| "destructive"`  | `"default"` | Visual color palette of the progress fill.                                      |
| `size`             | `"sm" \| "default" \| "lg"`                             | `"default"` | Height and density scale (`h-8`, `h-10`, `h-12`).                               |
| `icon`             | `React.ReactNode`                                       | `undefined` | Optional icon rendered next to the left label.                                  |
| `disabled`         | `boolean`                                               | `false`     | Whether the slider is disabled.                                                 |
| `className`        | `string`                                                | `undefined` | Custom classes applied to the slider track.                                     |
| `wrapperClassName` | `string`                                                | `undefined` | Custom classes applied to the outer container.                                  |
