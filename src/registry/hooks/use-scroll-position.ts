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
