# useHover

> Tracks hover state of a target element with optional delay.

## Installation

  

  
    ```bash
npx shadcn@latest add https://byphongphan.com/r/use-hover.json
```
  

  
    
      - Copy and paste the hook into your project.
      ```tsx
// hooks/use-hover.ts
import { useEffect, useRef, useState } from "react"

export interface UseHoverOptions<T extends HTMLElement = HTMLElement> {
  /** Optional delay in milliseconds before setting hover state to true. Defaults to 0. */
  enterDelay?: number
  /** Optional delay in milliseconds before setting hover state to false. Defaults to 0. */
  leaveDelay?: number
  /** Callback triggered when mouse or pointer enters the element. */
  onEnter?: (event: PointerEvent) => void
  /** Callback triggered when mouse or pointer leaves the element. */
  onLeave?: (event: PointerEvent) => void
  /** Whether the hover listener is active. Defaults to true. */
  enabled?: boolean
  /** Optional external ref to bind to instead of the returned ref. */
  ref?: React.RefObject<T | null>
}

export type UseHoverReturn<T extends HTMLElement = HTMLElement> = [
  React.RefObject<T | null>,
  boolean,
]

/**
 * React hook that tracks whether a referenced DOM element is currently hovered.
 *
 * Supports enter/leave delays, callbacks, ignores touch gestures to prevent sticky hovers,
 * and is safe for SSR.
 */
export function useHover<T extends HTMLElement = HTMLElement>(
  options: UseHoverOptions<T> = {}
): UseHoverReturn<T> {
  const {
    enterDelay = 0,
    leaveDelay = 0,
    onEnter,
    onLeave,
    enabled = true,
    ref: externalRef,
  } = options

  const internalRef = useRef<T | null>(null)
  const targetRef = externalRef ?? internalRef
  const [isHovered, setIsHovered] = useState(false)

  const savedOnEnter = useRef(onEnter)
  const savedOnLeave = useRef(onLeave)

  useEffect(() => {
    savedOnEnter.current = onEnter
    savedOnLeave.current = onLeave
  }, [onEnter, onLeave])

  useEffect(() => {
    if (!enabled) {
      setIsHovered(false)
      return
    }

    const node = targetRef.current
    if (!node) return

    let enterTimer: ReturnType<typeof setTimeout> | null = null
    let leaveTimer: ReturnType<typeof setTimeout> | null = null

    const handlePointerEnter = (event: PointerEvent) => {
      // Ignore touch events to avoid sticky hover states on mobile
      if (event.pointerType === "touch") return

      if (leaveTimer) {
        clearTimeout(leaveTimer)
        leaveTimer = null
      }

      if (enterDelay > 0) {
        enterTimer = setTimeout(() => {
          setIsHovered(true)
          savedOnEnter.current?.(event)
        }, enterDelay)
      } else {
        setIsHovered(true)
        savedOnEnter.current?.(event)
      }
    }

    const handlePointerLeave = (event: PointerEvent) => {
      if (event.pointerType === "touch") return

      if (enterTimer) {
        clearTimeout(enterTimer)
        enterTimer = null
      }

      if (leaveDelay > 0) {
        leaveTimer = setTimeout(() => {
          setIsHovered(false)
          savedOnLeave.current?.(event)
        }, leaveDelay)
      } else {
        setIsHovered(false)
        savedOnLeave.current?.(event)
      }
    }

    node.addEventListener("pointerenter", handlePointerEnter)
    node.addEventListener("pointerleave", handlePointerLeave)

    return () => {
      if (enterTimer) clearTimeout(enterTimer)
      if (leaveTimer) clearTimeout(leaveTimer)
      node.removeEventListener("pointerenter", handlePointerEnter)
      node.removeEventListener("pointerleave", handlePointerLeave)
    }
  }, [enabled, enterDelay, leaveDelay, targetRef])

  return [targetRef, isHovered]
}

```
      - Update the import paths to match your project setup.
    
  

## Usage

```tsx
import { useHover } from "@/shared/hooks"

export function HoverCard() {
  const [hoverRef, isHovered] = useHover<HTMLDivElement>({
    enterDelay: 200,
    leaveDelay: 200,
  })

  return (
    <div
      ref={hoverRef}
      className={`p-6 rounded-xl border transition-colors ${
        isHovered ? "border-primary bg-primary/10" : "border-border bg-card"
      }`}
    >
      <p>{isHovered ? "Hovered!" : "Hover over me"}</p>
    </div>
  )
}
```

## Props & Parameters

| Param                | Type                            | Default | Description                                                          |
| :------------------- | :------------------------------ | :------ | :------------------------------------------------------------------- |
| `options.enterDelay` | `number`                        | `0`     | Delay in milliseconds before triggering hover on state (`true`).    |
| `options.leaveDelay` | `number`                        | `0`     | Delay in milliseconds before triggering hover off state (`false`).  |
| `options.onEnter`    | `(event: PointerEvent) => void` | `—`     | Callback invoked when the pointer enters the element.                |
| `options.onLeave`    | `(event: PointerEvent) => void` | `—`     | Callback invoked when the pointer leaves the element.                |
| `options.enabled`    | `boolean`                       | `true`  | Whether the hover event listener is active.                          |
| `options.ref`        | `RefObject<T \| null>`          | `—`     | Optional external ref to attach to instead of the returned ref.      |

## Returns

| Return Value      | Type                   | Description                                     |
| :---------------- | :--------------------- | :---------------------------------------------- |
| `[0]` (ref)       | `RefObject<T \| null>` | Ref object to attach to the target DOM element. |
| `[1]` (isHovered) | `boolean`              | Current hover status of the target element.     |
