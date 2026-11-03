import { useEffect, useRef } from "react"

/**
 * React hook that stores and returns the previous value of a state or prop across renders.
 */
export function usePrevious<T>(value: T): T | undefined {
  const currentRef = useRef<T>(value)
  const previousRef = useRef<T | undefined>(undefined)

  if (currentRef.current !== value) {
    previousRef.current = currentRef.current
    currentRef.current = value
  }

  useEffect(() => {
    currentRef.current = value
  }, [value])

  return previousRef.current
}
