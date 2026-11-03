import { useEffect, useRef, useState } from "react"

export interface UsePageLeaveOptions {
  /**
   * Whether to trigger only when the mouse leaves from the top boundary of the viewport.
   * Typically indicates an intent to close the tab, switch tabs, or interact with the address bar.
   * @default true
   */
  onlyTop?: boolean

  /**
   * Whether the leave callback should only be triggered once during the component lifecycle.
   * @default false
   */
  once?: boolean
}

/**
 * Custom hook to detect when the user's cursor leaves the page (Exit-Intent detection).
 * Commonly used for displaying retention modals, discounts, or auto-saving drafts.
 *
 * @param onLeave - Optional callback invoked when the cursor exits the viewport.
 * @param options - Configuration options for boundary filtering and trigger frequency.
 * @returns A boolean indicating whether the cursor is currently outside the viewport.
 */
export function usePageLeave(
  onLeave?: () => void,
  options: UsePageLeaveOptions = {}
): boolean {
  const { onlyTop = true, once = false } = options
  const [isLeft, setIsLeft] = useState(false)

  // Tracks if the callback has already been executed when `once: true`
  const hasFiredRef = useRef(false)

  // Store the latest callback in a ref to avoid re-attaching event listeners on state updates
  const onLeaveRef = useRef(onLeave)
  useEffect(() => {
    onLeaveRef.current = onLeave
  }, [onLeave])

  useEffect(() => {
    // Guard against Server-Side Rendering environments
    if (typeof document === "undefined") return

    const handleMouseLeave = (event: MouseEvent) => {
      if (once && hasFiredRef.current) return

      // clientY <= 0 indicates the cursor exited through the top edge of the viewport
      const isExitingTop = event.clientY <= 0
      const shouldTrigger = onlyTop ? isExitingTop : true

      if (shouldTrigger) {
        setIsLeft(true)
        hasFiredRef.current = true
        onLeaveRef.current?.()
      }
    }

    const handleMouseEnter = () => {
      setIsLeft(false)
    }

    // Attach to document.documentElement because 'mouseleave' does not bubble from descendants
    document.documentElement.addEventListener("mouseleave", handleMouseLeave)
    document.documentElement.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave
      )
      document.documentElement.removeEventListener(
        "mouseenter",
        handleMouseEnter
      )
    }
  }, [onlyTop, once])

  return isLeft
}
