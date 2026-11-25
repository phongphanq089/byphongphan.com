# useScrollPosition

> Tracks scroll coordinates and direction in real time for the window or a specific scrollable element.

## Installation

  

  
    ```bash
npx shadcn@latest add https://byphongphan.com/r/use-scroll-position.json
```
  

  
    
      - Copy and paste the hook into your project.
      ```tsx
// hooks/use-scroll-position.ts
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { RefObject } from "react"

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

export type ScrollDirection = "up" | "down" | null

export interface ScrollPosition {
  x: number
  y: number
  direction: ScrollDirection
}

export interface UseScrollPositionOptions {
  targetRef?: RefObject<HTMLElement | null>
  enabled?: boolean
}

export function useScrollPosition(
  options: UseScrollPositionOptions = {}
): ScrollPosition {
  const { targetRef, enabled = true } = options

  const [position, setPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    direction: null,
  })

  const prevPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const rafIdRef = useRef<number | null>(null)

  useIsomorphicLayoutEffect(() => {
    if (!enabled || typeof window === "undefined") return

    const targetElement = targetRef?.current

    const getScrollPosition = (): { x: number; y: number } => {
      if (targetElement) {
        return {
          x: targetElement.scrollLeft,
          y: targetElement.scrollTop,
        }
      }
      return {
        x: window.scrollX || document.documentElement.scrollLeft || 0,
        y: window.scrollY || document.documentElement.scrollTop || 0,
      }
    }

    // Read initial scroll position immediately upon mount
    const initialPos = getScrollPosition()
    prevPositionRef.current = initialPos
    setPosition({
      x: initialPos.x,
      y: initialPos.y,
      direction: null,
    })

    const handleScroll = () => {
      if (rafIdRef.current !== null) return

      rafIdRef.current = window.requestAnimationFrame(() => {
        const { x, y } = getScrollPosition()
        const prev = prevPositionRef.current

        if (x !== prev.x || y !== prev.y) {
          let direction: ScrollDirection = null
          if (y > prev.y) {
            direction = "down"
          } else if (y < prev.y) {
            direction = "up"
          }

          prevPositionRef.current = { x, y }

          setPosition({ x, y, direction })
        }

        rafIdRef.current = null
      })
    }

    const targetNode: EventTarget = targetElement ?? window

    targetNode.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      targetNode.removeEventListener("scroll", handleScroll)
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [targetRef, enabled])

  return position
}

```
      - Update the import paths to match your project setup.
    
  

## Usage

### Window Scroll (e.g. Auto-Hiding Navbar)

```tsx
import { useScrollPosition } from "@/shared/hooks"

export function Navbar() {
  const { y, direction } = useScrollPosition()

  const isHidden = direction === "down" && y > 80

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <nav className="border-b bg-background/80 backdrop-blur-md px-6 py-4">
        <span>Site Header (y: {Math.round(y)}px)</span>
      </nav>
    </header>
  )
}
```

### Custom Scrollable Container

```tsx
import { useRef } from "react"
import { useScrollPosition } from "@/shared/hooks"

export function ScrollableFeed() {
  const feedRef = useRef<HTMLDivElement>(null)
  const { y, direction } = useScrollPosition({ targetRef: feedRef })

  return (
    <div className="relative">
      <div className="text-xs text-muted-foreground mb-2">
        Feed Scroll Y: {Math.round(y)}px | Direction: {direction ?? "idle"}
      </div>

      <div ref={feedRef} className="h-64 overflow-y-auto border rounded-lg p-4">
        {/* Content list */}
      </div>
    </div>
  )
}
```

## Features

- **60/120 FPS Performance**: Throttled using native `requestAnimationFrame` to ensure zero main-thread blockage or frame drops during heavy scrolling.
- **Direction Detection**: Automatically identifies `"up"` vs `"down"` movement to power floating action buttons, auto-hiding navigation bars, and reading progress bars.
- **Target Agnostic**: Listens to the global `window` by default or any scrollable HTML element via `targetRef`.
- **Passive Listeners**: Employs `{ passive: true }` event listeners so mobile touch-scrolling remains butter-smooth.
- **SSR-Safe**: Safely initializes on the server and synchronizes state on client mount with `useIsomorphicLayoutEffect`.

## Parameters

| Parameter           | Type                                | Default | Description                                                        |
| :------------------ | :---------------------------------- | :------ | :----------------------------------------------------------------- |
| `options.targetRef` | `RefObject<HTMLElement \| null>`   | `—`     | Optional ref of a scrollable element to observe instead of window. |
| `options.enabled`   | `boolean`                           | `true`  | Pass `false` to pause event listeners and reduce overhead.         |

## Returns

| Property    | Type                      | Description                                                  |
| :---------- | :------------------------ | :----------------------------------------------------------- |
| `x`         | `number`                  | Horizontal scroll offset in pixels (`scrollLeft`).           |
| `y`         | `number`                  | Vertical scroll offset in pixels (`scrollTop`).             |
| `direction` | `"up" \| "down" \| null`  | Active scroll direction since previous frame (`"up"`, `"down"` or `null`). |
