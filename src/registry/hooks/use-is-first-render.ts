import { useEffect, useRef } from "react"

/**
 * Custom hook that returns whether the current render cycle is the initial mount.
 * Complies with React Concurrent and Strict Mode guidelines by mutating the ref
 * inside an effect rather than during the render phase.
 *
 * @returns `true` during the initial render pass, and `false` on all subsequent re-renders.
 */
export function useIsFirstRender(): boolean {
  // Initialize ref as true for the initial render
  const isFirst = useRef(true)

  useEffect(() => {
    // Flip flag after the first commit phase completes
    isFirst.current = false
  }, [])

  return isFirst.current
}
