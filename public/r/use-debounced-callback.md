# useDebouncedCallback

> Creates a debounced version of a callback function with cancellation, flush, and max-wait controls.

## Installation

  

  
    ```bash
npx shadcn@latest add https://byphongphan.com/r/use-debounced-callback.json
```
  

  
    
      - Copy and paste the hook into your project.
      ```tsx
// hooks/use-debounced-callback.ts
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

```
      - Update the import paths to match your project setup.
    
  

## Usage

### Debounced Search Input

```tsx
import { useState } from "react"
import { useDebouncedCallback } from "@/shared/hooks"

export function SearchBox() {
  const [query, setQuery] = useState("")

  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    // Perform API call or expensive filter
    console.log("Searching for:", searchTerm)
  }, 500)

  return (
    <input
      type="text"
      placeholder="Type to search..."
      value={query}
      onChange={(e) => {
        setQuery(e.target.value)
        debouncedSearch(e.target.value)
      }}
    />
  )
}
```

### Auto-Save on Blur with `flush`

```tsx
import { useEffect, useState } from "react"
import { useDebouncedCallback } from "@/shared/hooks"

export function NoteEditor() {
  const [content, setContent] = useState("")

  const saveNote = useDebouncedCallback((text: string) => {
    saveToDatabase(text)
  }, 1000, { maxWait: 5000 })

  return (
    <textarea
      value={content}
      onChange={(e) => {
        setContent(e.target.value)
        saveNote(e.target.value)
      }}
      onBlur={() => {
        // Immediately save on blur instead of waiting for timer
        saveNote.flush()
      }}
    />
  )
}
```

## Features

- **No Stale Closures**: Uses an internal callback ref to access the latest component props and state without triggering re-attachments.
- **Leading & Trailing Triggers**: Configure execution at the beginning (`leading: true`) or end (`trailing: true`) of the timeout window.
- **Max Delay Cap (`maxWait`)**: Guarantees the callback runs at least once within `maxWait` milliseconds even under continuous user input.
- **Execution Controls**: Includes `.cancel()` to discard pending calls, `.flush()` to execute immediately, and `.isPending()` to check active status.
- **Unmount Safety**: Automatically cancels all pending timers when the component unmounts.

## Parameters

| Parameter          | Type                          | Default | Description                                                        |
| :----------------- | :---------------------------- | :------ | :----------------------------------------------------------------- |
| `callback`         | `(...args: TArgs) => void`    | `—`     | The target function to debounce.                                   |
| `delay`            | `number`                      | `—`     | The debounce delay in milliseconds.                                |
| `options.leading`  | `boolean`                     | `false` | Specify execution on the leading edge of the timeout.              |
| `options.trailing` | `boolean`                     | `true`  | Specify execution on the trailing edge of the timeout.             |
| `options.maxWait`  | `number`                      | `—`     | The maximum time the callback is allowed to wait before execution. |

## Returns

Returns a debounced function `DebouncedFunction<TArgs>` with control methods:

| Method / Property | Type                   | Description                                                |
| :---------------- | :--------------------- | :--------------------------------------------------------- |
| `(...args)`       | `(...args: TArgs) => void` | Invokes the debounced function with latest arguments.     |
| `cancel()`        | `() => void`           | Cancels the active timer and discards pending arguments.   |
| `flush()`         | `() => void`           | Immediately executes any pending invocation synchronously. |
| `isPending()`     | `() => boolean`        | Returns `true` if a timer is currently active.             |
