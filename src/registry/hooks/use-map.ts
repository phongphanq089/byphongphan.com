import { useCallback, useMemo, useRef, useState } from "react"

export type MapInitialEntries<K, V> =
  Iterable<readonly [K, V]> | (() => Iterable<readonly [K, V]>)

export interface ReactiveMap<K, V> extends Map<K, V> {
  /**
   * Sets a key-value pair and triggers a React state update.
   */
  set: (key: K, value: V) => this

  /**
   * Removes an entry by key and triggers a React state update if the key existed.
   */
  delete: (key: K) => boolean

  /**
   * Removes all entries and triggers a React state update if the map was not empty.
   */
  clear: () => void

  /**
   * Resets the map back to its original initial entries.
   */
  reset: () => void

  /**
   * Replaces the entire map contents with a new set of entries.
   */
  setAll: (entries: Iterable<readonly [K, V]>) => void
}

/**
 * Custom hook that returns a reactive Map instance synchronized with React state.
 * Mutating methods (`set`, `delete`, `clear`) automatically trigger component re-renders.
 *
 * @param initialEntries - Initial key-value pairs or a lazy initializer function.
 * @returns A reactive Map instance with full Map prototype support and extra utility methods.
 */
export function useMap<K, V>(
  initialEntries?: MapInitialEntries<K, V>
): ReactiveMap<K, V> {
  // Store initial input to support the reset() action across renders
  const initialRef = useRef(initialEntries)

  // Fix 1: Explicitly pass generic > to useState and constructor
  const [map, setMap] = useState<Map<K, V>>(() => {
    const raw =
      typeof initialRef.current === "function"
        ? initialRef.current()
        : initialRef.current
    return new Map<K, V>(raw)
  })

  const reset = useCallback(() => {
    const raw =
      typeof initialRef.current === "function"
        ? initialRef.current()
        : initialRef.current
    setMap(new Map<K, V>(raw))
  }, [])

  const setAll = useCallback((entries: Iterable<readonly [K, V]>) => {
    setMap(new Map<K, V>(entries))
  }, [])

  // Wrap the Map instance with reactive overrides whenever state updates
  return useMemo(() => {
    // Create an authentic clone so all native Map methods and internal slots work seamlessly
    const reactiveInstance = new Map(map) as ReactiveMap<K, V>

    // Fix 2: Explicitly annotate `prev: Map<K, V>` to prevent TS7006 (noImplicitAny)
    reactiveInstance.set = function (key: K, value: V): ReactiveMap<K, V> {
      setMap((prev: Map<K, V>) => {
        const next = new Map(prev)
        next.set(key, value)
        return next
      })

      // Synchronously update current clone so immediate reads within the same tick stay coherent
      Map.prototype.set.call(this, key, value)
      return this
    }

    // Fix 2: Explicitly annotate `prev: Map<K, V>` to prevent TS7006 (noImplicitAny)
    reactiveInstance.delete = function (key: K): boolean {
      const existed = this.has(key)
      if (existed) {
        setMap((prev: Map<K, V>) => {
          const next = new Map(prev)
          next.delete(key)
          return next
        })
        Map.prototype.delete.call(this, key)
      }
      return existed
    }

    // Override .clear() to empty state if elements exist
    reactiveInstance.clear = function (): void {
      if (this.size > 0) {
        setMap(new Map<K, V>())
        Map.prototype.clear.call(this)
      }
    }

    // Attach custom convenience actions
    reactiveInstance.reset = reset
    reactiveInstance.setAll = setAll

    return reactiveInstance
  }, [map, reset, setAll])
}
