import { useCallback, useEffect, useState } from "react"

export interface UseLocalStorageOptions<T> {
  /** Serializer function. Defaults to JSON.stringify. */
  serializer?: (value: T) => string
  /** Deserializer function. Defaults to JSON.parse. */
  deserializer?: (value: string) => T
  /** Error logger or handler */
  onError?: (error: unknown) => void
}

const LOCAL_STORAGE_EVENT = "pp-local-storage-sync"

/**
 * React hook that synchronizes state with browser localStorage across sessions and tabs.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseLocalStorageOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    onError = console.error,
  } = options

  // Read initial stored value safely (SSR guard)
  const readValue = useCallback((): T => {
    const fallback =
      typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue

    if (typeof window === "undefined") {
      return fallback
    }

    try {
      const raw = window.localStorage.getItem(key)
      return raw ? deserializer(raw) : fallback
    } catch (error) {
      onError(error)
      return fallback
    }
  }, [key, initialValue, deserializer, onError])

  const [storedValue, setStoredValue] = useState<T>(readValue)

  // Setter function supporting direct values and functional updates
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      if (typeof window === "undefined") return

      try {
        const nextValue = value instanceof Function ? value(readValue()) : value

        window.localStorage.setItem(key, serializer(nextValue))
        setStoredValue(nextValue)

        // Dispatch synthetic event for same-tab reactive synchronization
        window.dispatchEvent(
          new CustomEvent(LOCAL_STORAGE_EVENT, {
            detail: { key, value: nextValue },
          })
        )
      } catch (error) {
        onError(error)
      }
    },
    [key, serializer, readValue, onError]
  )

  // Remove key from localStorage
  const removeValue = useCallback(() => {
    if (typeof window === "undefined") return

    try {
      window.localStorage.removeItem(key)
      const fallback =
        typeof initialValue === "function"
          ? (initialValue as () => T)()
          : initialValue
      setStoredValue(fallback)

      window.dispatchEvent(
        new CustomEvent(LOCAL_STORAGE_EVENT, {
          detail: { key, value: fallback },
        })
      )
    } catch (error) {
      onError(error)
    }
  }, [key, initialValue, onError])

  // Listen for changes from other tabs (window storage event) and same tab (custom event)
  useEffect(() => {
    setStoredValue(readValue())

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(deserializer(event.newValue))
        } catch (error) {
          onError(error)
        }
      } else if (event.key === key && event.newValue === null) {
        removeValue()
      }
    }

    const handleCustomSync = (event: Event) => {
      const customEvent = event as CustomEvent<{ key: string; value: T }>
      if (customEvent.detail.key === key) {
        setStoredValue(customEvent.detail.value)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener(LOCAL_STORAGE_EVENT, handleCustomSync)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener(LOCAL_STORAGE_EVENT, handleCustomSync)
    }
  }, [key, readValue, deserializer, removeValue, onError])

  return [storedValue, setValue, removeValue]
}
