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
