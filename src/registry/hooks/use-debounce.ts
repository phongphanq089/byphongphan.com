import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Debounces a fast-changing value, updating only after the specified delay.
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Debounces a function callback execution by a specified delay.
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay = 500
): ((...args: Parameters<T>) => void) & {
  cancel: () => void
  flush: () => void
} {
  const callbackRef = useRef<T>(callback)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastArgsRef = useRef<Parameters<T> | null>(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    lastArgsRef.current = null
  }, [])

  const flush = useCallback(() => {
    if (timerRef.current && lastArgsRef.current) {
      callbackRef.current(...lastArgsRef.current)
      cancel()
    }
  }, [cancel])

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      lastArgsRef.current = args
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        callbackRef.current(...args)
      }, delay)
    },
    [delay]
  )

  useEffect(() => {
    return () => cancel()
  }, [cancel])

  return Object.assign(debounced, { cancel, flush })
}
