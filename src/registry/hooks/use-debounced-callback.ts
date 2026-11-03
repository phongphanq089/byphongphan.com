import { useCallback, useEffect, useMemo, useRef } from "react"

export interface DebounceOptions {
  /**
   * Specify execution on the leading edge of the timeout.
   * @default false
   */
  leading?: boolean

  /**
   * Specify execution on the trailing edge of the timeout.
   * @default true
   */
  trailing?: boolean

  /**
   * The maximum time the callback is allowed to be delayed before it is invoked.
   */
  maxWait?: number
}

export interface DebouncedFunction<TArgs extends unknown[]> {
  /** Invokes the debounced function */
  (...args: TArgs): void
  /** Cancels the pending invocation */
  cancel: () => void
  /** Immediately invokes any pending invocation */
  flush: () => void
  /** Checks whether an invocation is currently pending */
  isPending: () => boolean
}

/**
 * Custom hook that creates a debounced version of the provided callback function.
 * Automatically avoids stale closure bugs and cleans up timers on unmount.
 *
 * @param callback - The function to debounce.
 * @param delay - The delay in milliseconds.
 * @param options - Options for leading/trailing execution and max wait time.
 * @returns A stable, memoized debounced function wrapper.
 */
export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay: number,
  options: DebounceOptions = {}
): DebouncedFunction<TArgs> {
  const { leading = false, trailing = true, maxWait } = options

  // Keep latest callback reference to eliminate stale closures
  const callbackRef = useRef(callback)
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Internal timer and call-state references
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastArgsRef = useRef<TArgs | null>(null)
  const isInvokedRef = useRef(false)

  // Clears active timers
  const clearTimers = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (maxTimerRef.current !== null) {
      clearTimeout(maxTimerRef.current)
      maxTimerRef.current = null
    }
  }, [])

  // Invokes the underlying callback with stored arguments
  const invoke = useCallback(() => {
    const args = lastArgsRef.current
    clearTimers()
    lastArgsRef.current = null
    isInvokedRef.current = false

    if (args) {
      callbackRef.current(...args)
    }
  }, [clearTimers])

  const cancel = useCallback(() => {
    clearTimers()
    lastArgsRef.current = null
    isInvokedRef.current = false
  }, [clearTimers])

  const flush = useCallback(() => {
    if (lastArgsRef.current !== null) {
      invoke()
    }
  }, [invoke])

  const isPending = useCallback(() => {
    return timerRef.current !== null
  }, [])

  // Main callable debounced trigger
  const debounced = useCallback(
    (...args: TArgs) => {
      lastArgsRef.current = args

      // Handle leading-edge invocation
      const shouldCallLeading = leading && timerRef.current === null

      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        if (trailing && !shouldCallLeading) {
          invoke()
        } else {
          clearTimers()
          lastArgsRef.current = null
        }
      }, delay)

      if (shouldCallLeading) {
        isInvokedRef.current = true
        callbackRef.current(...args)
      }

      // Handle optional maxWait timer
      if (maxWait !== undefined && maxTimerRef.current === null) {
        maxTimerRef.current = setTimeout(() => {
          if (lastArgsRef.current !== null) {
            invoke()
          }
        }, maxWait)
      }
    },
    [delay, leading, trailing, maxWait, invoke, clearTimers]
  )

  // Ensure timers are cancelled on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      clearTimers()
    }
  }, [clearTimers])

  return useMemo(
    () => Object.assign(debounced, { cancel, flush, isPending }),
    [debounced, cancel, flush, isPending]
  )
}
