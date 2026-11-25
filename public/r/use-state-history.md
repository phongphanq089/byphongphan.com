# useStateHistory

> Provides state management with undo, redo, and time-travel capabilities through a chronological history of state snapshots.

## Installation

  

  
    ```bash
npx shadcn@latest add https://byphongphan.com/r/use-state-history.json
```
  

  
    
      - Copy and paste the hook into your project.
      ```tsx
// hooks/use-state-history.ts
import { useCallback, useMemo, useReducer } from "react"

export interface UseStateHistoryOptions {
  /**
   * Maximum number of history snapshots to keep in memory.
   * If omitted, history is unbounded.
   */
  capacity?: number
}

export interface StateHistorySnapshot<T> {
  history: T[]
  pointer: number
}

type Action<T> =
  | { type: "SET"; payload: T | ((prev: T) => T); capacity?: number }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "JUMP"; payload: number }
  | { type: "RESET"; payload: T }

function historyReducer<T>(
  state: StateHistorySnapshot<T>,
  action: Action<T>
): StateHistorySnapshot<T> {
  const { history, pointer } = state

  switch (action.type) {
    case "SET": {
      const currentVal = history[pointer]
      const nextVal =
        typeof action.payload === "function"
          ? (action.payload as (prev: T) => T)(currentVal)
          : action.payload

      // Drop future timeline entries if setting new state from a past snapshot
      const prunedHistory = history.slice(0, pointer + 1)
      const newHistory = [...prunedHistory, nextVal]

      // Enforce buffer capacity constraint if specified
      if (action.capacity && newHistory.length > action.capacity) {
        const excess = newHistory.length - action.capacity
        return {
          history: newHistory.slice(excess),
          pointer: newHistory.length - excess - 1,
        }
      }

      return {
        history: newHistory,
        pointer: newHistory.length - 1,
      }
    }

    case "UNDO": {
      if (pointer <= 0) return state
      return {
        ...state,
        pointer: pointer - 1,
      }
    }

    case "REDO": {
      if (pointer >= history.length - 1) return state
      return {
        ...state,
        pointer: pointer + 1,
      }
    }

    case "JUMP": {
      const targetIndex = Math.max(
        0,
        Math.min(action.payload, history.length - 1)
      )
      if (targetIndex === pointer) return state
      return {
        ...state,
        pointer: targetIndex,
      }
    }

    case "RESET": {
      return {
        history: [action.payload],
        pointer: 0,
      }
    }

    default:
      return state
  }
}

export interface UseStateHistoryReturn<T> {
  /** The current active state */
  state: T
  /** Push a new state into the timeline */
  set: (value: T | ((prev: T) => T)) => void
  /** Revert to the preceding state */
  undo: () => void
  /** Advance to the next forward state */
  redo: () => void
  /** Whether backward navigation is possible */
  canUndo: boolean
  /** Whether forward navigation is possible */
  canRedo: boolean
  /** The chronological list of all saved snapshots */
  history: T[]
  /** Zero-based index of the active state in the history array */
  pointer: number
  /** Jump directly to a snapshot at a given index */
  jump: (index: number) => void
  /** Reset history completely with a given or original initial value */
  reset: (newInitialState?: T) => void
}

/**
 * Custom hook providing undo/redo state management with time-travel capabilities.
 *
 * @param initialState - The initial value or lazy initializer function.
 * @param options - Configuration options such as history capacity limit.
 */
export function useStateHistory<T>(
  initialState: T | (() => T),
  options: UseStateHistoryOptions = {}
): UseStateHistoryReturn<T> {
  const { capacity } = options

  const [snapshot, dispatch] = useReducer(
    historyReducer<T>,
    initialState,
    (init): StateHistorySnapshot<T> => {
      const resolved = typeof init === "function" ? (init as () => T)() : init
      return {
        history: [resolved],
        pointer: 0,
      }
    }
  )

  const set = useCallback(
    (value: T | ((prev: T) => T)) => {
      dispatch({ type: "SET", payload: value, capacity })
    },
    [capacity]
  )

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" })
  }, [])

  const redo = useCallback(() => {
    dispatch({ type: "REDO" })
  }, [])

  const jump = useCallback((index: number) => {
    dispatch({ type: "JUMP", payload: index })
  }, [])

  const reset = useCallback(
    (newInitialState?: T) => {
      const fallback =
        newInitialState !== undefined ? newInitialState : snapshot.history[0]
      dispatch({ type: "RESET", payload: fallback })
    },
    [snapshot.history]
  )

  const canUndo = snapshot.pointer > 0
  const canRedo = snapshot.pointer < snapshot.history.length - 1
  const currentState = snapshot.history[snapshot.pointer]

  return useMemo(
    () => ({
      state: currentState,
      set,
      undo,
      redo,
      canUndo,
      canRedo,
      history: snapshot.history,
      pointer: snapshot.pointer,
      jump,
      reset,
    }),
    [
      currentState,
      set,
      undo,
      redo,
      canUndo,
      canRedo,
      snapshot.history,
      snapshot.pointer,
      jump,
      reset,
    ]
  )
}

```
      - Update the import paths to match your project setup.
    
  

## Usage

### Basic Undo and Redo

```tsx
import { useStateHistory } from "@/shared/hooks"

export function TextEditor() {
  const { state: text, set: setText, undo, redo, canUndo, canRedo } =
    useStateHistory("Hello world")

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <button onClick={undo} disabled={!canUndo}>Undo</button>
        <button onClick={redo} disabled={!canRedo}>Redo</button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
      />
    </div>
  )
}
```

### Bounded History with Capacity Limit

```tsx
import { useStateHistory } from "@/shared/hooks"

export function Counter() {
  // Keeps at most the latest 10 snapshots in memory
  const { state: count, set: setCount, undo, redo, history, pointer, jump } =
    useStateHistory(0, { capacity: 10 })

  return (
    <div>
      <p>Current Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>

      <div>
        <span>Snapshots: </span>
        {history.map((val, idx) => (
          <button
            key={idx}
            onClick={() => jump(idx)}
            className={idx === pointer ? "font-bold text-primary" : ""}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  )
}
```

## Features

- **Undo & Redo Operations**: Navigate backwards and forwards through previous state revisions with `undo()` and `redo()`.
- **Automatic Timeline Branching**: Setting a new state while viewing an older snapshot automatically prunes obsolete future history, preserving consistent timeline integrity.
- **Capacity Constraint**: Optional `capacity` option prevents memory consumption by dropping the oldest entries once the limit is reached.
- **Direct Time-Travel**: `jump(index)` allows jumping directly to any arbitrary snapshot with safe index boundary clamping.
- **Functional State Updates**: `set` accepts either raw values or updater functions `(prev) => nextVal`, matching standard React `setState` ergonomics.
- **Lazy Initial State**: Supports factory functions `() => initialState` for expensive initial state calculations.

## Parameters

| Parameter          | Type                  | Default | Description                                                        |
| :----------------- | :-------------------- | :------ | :----------------------------------------------------------------- |
| `initialState`     | `T \| (() => T)`      | `—`     | The initial value or lazy initializer function.                    |
| `options.capacity` | `number \| undefined` | `—`     | Maximum number of snapshots to retain. Oldest entries are purged. |

## Returns

Returns a `UseStateHistoryReturn<T>` object:

| Property   | Type                                 | Description                                                 |
| :--------- | :----------------------------------- | :---------------------------------------------------------- |
| `state`    | `T`                                  | The active state snapshot.                                  |
| `set`      | `(value: T \| ((prev: T) => T)) => void` | Pushes a new state snapshot into the timeline.           |
| `undo`     | `() => void`                         | Reverts to the previous snapshot.                           |
| `redo`     | `() => void`                         | Advances to the next snapshot.                              |
| `canUndo`  | `boolean`                            | Whether backward navigation is possible (`pointer > 0`).    |
| `canRedo`  | `boolean`                            | Whether forward navigation is possible.                     |
| `history`  | `T[]`                                | Chronological array of all retained state snapshots.        |
| `pointer`  | `number`                             | Current zero-based index within the `history` array.        |
| `jump`     | `(index: number) => void`            | Directly moves the active pointer to a specific snapshot.   |
| `reset`    | `(newInitialState?: T) => void`      | Resets the timeline with a new or initial baseline value.   |
