# useMap

> A reactive Map instance synchronized with React state that triggers re-renders on mutation.

## Installation

  

  
    ```bash
npx shadcn@latest add https://byphongphan.com/r/use-map.json
```
  

  
    
      - Copy and paste the hook into your project.
      ```tsx
// hooks/use-map.ts
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

```
      - Update the import paths to match your project setup.
    
  

## Usage

### Managing Dynamic Configuration

```tsx
import { useMap } from "@/shared/hooks"

export function SettingsPanel() {
  const settings = useMap<string, string>([
    ["theme", "dark"],
    ["notifications", "enabled"],
  ])

  return (
    <div className="space-y-3">
      <p>Theme: {settings.get("theme")}</p>
      <p>Total Settings: {settings.size}</p>

      <div className="flex gap-2">
        <button onClick={() => settings.set("theme", "light")}>
          Set Light Theme
        </button>
        <button onClick={() => settings.delete("notifications")}>
          Disable Notifications
        </button>
        <button onClick={() => settings.reset()}>
          Reset Settings
        </button>
      </div>
    </div>
  )
}
```

### Complex Object Keys or Caching

```tsx
import { useMap } from "@/shared/hooks"

interface User {
  id: string
  name: string
}

export function ActiveUsersList() {
  const userRoles = useMap<User, string>()

  const assignRole = (user: User, role: string) => {
    userRoles.set(user, role)
  }

  return (
    <ul>
      {Array.from(userRoles.entries()).map(([user, role]) => (
        <li key={user.id}>
          {user.name} - Role: {role}
        </li>
      ))}
    </ul>
  )
}
```

## Features

- **Full Native Compatibility**: Retains all native `Map` prototype methods (`get`, `has`, `size`, `keys`, `values`, `entries`, and `for..of` iterators).
- **Reactive Mutations**: Invoking `.set()`, `.delete()`, or `.clear()` triggers React state updates automatically.
- **Convenience Utilities**: Adds `.reset()` to return to initial entries and `.setAll(entries)` for atomic bulk replacements.
- **Lazy Initial State**: Supports factory functions `() => entries` for expensive initial calculations.
- **Type-Safe Generics**: Preserves strong typing across both key (`K`) and value (`V`) types.

## Parameters

| Parameter        | Type                                                                       | Default | Description                                                     |
| :--------------- | :------------------------------------------------------------------------- | :------ | :-------------------------------------------------------------- |
| `initialEntries` | `Iterable<readonly [K, V]> \| (() => Iterable<readonly [K, V]>)` | `—`     | Optional initial key-value pairs or a lazy initializer function. |

## Returns

Returns an extended `ReactiveMap<K, V>` instance:

| Property / Method | Type                                                       | Description                                                       |
| :---------------- | :--------------------------------------------------------- | :---------------------------------------------------------------- |
| `size`            | `number`                                                   | Current number of entries in the map.                             |
| `get(key)`        | `(key: K) => V \| undefined`                              | Retrieves the value associated with `key`.                        |
| `has(key)`        | `(key: K) => boolean`                                      | Returns `true` if an entry with `key` exists.                     |
| `set(key, value)` | `(key: K, value: V) => this`                               | Inserts or updates an entry and triggers a React re-render.       |
| `delete(key)`     | `(key: K) => boolean`                                      | Removes the specified entry and triggers a React re-render.       |
| `clear()`         | `() => void`                                               | Removes all entries and triggers a React re-render.               |
| `reset()`         | `() => void`                                               | Restores the map back to its original initial entries.            |
| `setAll(entries)` | `(entries: Iterable<readonly [K, V]>) => void`            | Replaces all entries with a new set of entries in one tick.       |
| `entries()`       | `() => IterableIterator<[K, V]>`                           | Returns an iterator over `[key, value]` pairs.                    |
| `keys()`          | `() => IterableIterator<K>`                                | Returns an iterator over all keys.                                |
| `values()`        | `() => IterableIterator<V>`                                | Returns an iterator over all values.                              |
