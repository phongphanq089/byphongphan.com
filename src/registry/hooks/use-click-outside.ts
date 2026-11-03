import { useEffect, useRef } from "react"

export type ClickOutsideHandler = (event: MouseEvent | TouchEvent) => void

export interface UseClickOutsideOptions {
  /** Whether the listener is active. Defaults to true. */
  enabled?: boolean
  /** Event types to listen for. Defaults to ["mousedown", "touchstart"]. */
  events?: Array<"mousedown" | "mouseup" | "click" | "touchstart" | "touchend">
  /** Optional array of other element refs to ignore clicks inside. */
  ignoreRefs?: Array<React.RefObject<HTMLElement | null>>
}

/**
 * React hook that triggers a callback when a click or touch event occurs
 * outside of the referenced element (and any optional ignored elements).
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: ClickOutsideHandler,
  options: UseClickOutsideOptions = {}
): React.RefObject<T | null> {
  const {
    enabled = true,
    events = ["mousedown", "touchstart"],
    ignoreRefs = [],
  } = options

  const ref = useRef<T | null>(null)
  const savedHandler = useRef<ClickOutsideHandler>(handler)

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    if (!enabled) return

    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null
      const el = ref.current

      // Do nothing if clicking target element or descendent
      if (!el || !target || el.contains(target)) {
        return
      }

      // Do nothing if clicking any of the ignored element refs
      for (const ignoreRef of ignoreRefs) {
        if (ignoreRef.current?.contains(target)) {
          return
        }
      }

      savedHandler.current(event)
    }

    events.forEach((eventName) => {
      document.addEventListener(eventName, listener, { passive: true })
    })

    return () => {
      events.forEach((eventName) => {
        document.removeEventListener(eventName, listener)
      })
    }
  }, [enabled, events, ignoreRefs])

  return ref
}
