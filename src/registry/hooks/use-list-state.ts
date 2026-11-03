import { useCallback, useState } from "react"
import type { Dispatch, SetStateAction } from "react"

export interface ReorderPayload {
  from: number
  to: number
}

export interface ListStateHandlers<T> {
  /** Replaces the entire list with a new array */
  setState: Dispatch<SetStateAction<T[]>>
  /** Appends one or more items to the end of the array */
  append: (...items: T[]) => void
  /** Prepends one or more items to the beginning of the array */
  prepend: (...items: T[]) => void
  /** Inserts one or more items at a specific index */
  insert: (index: number, ...items: T[]) => void
  /** Removes items at specified indices */
  remove: (...indices: number[]) => void
  /** Moves an item from one position to another */
  reorder: (payload: ReorderPayload) => void
  /** Swaps the positions of two items */
  swap: (payload: ReorderPayload) => void
  /** Sets the value of a specific item by its index */
  setItem: (index: number, item: T) => void
  /** Updates a single property of an item at a specific index */
  setItemProp: <K extends keyof T>(index: number, prop: K, value: T[K]) => void
  /** Maps through all items applying a transformer function */
  apply: (fn: (item: T, index: number) => T) => void
  /** Transforms only items matching a given predicate condition */
  applyWhere: (
    predicate: (item: T, index: number) => boolean,
    fn: (item: T, index: number) => T
  ) => void
  /** Filters the list according to a predicate */
  filter: (fn: (item: T, index: number) => boolean) => void
}

/**
 * Custom hook to manage list operations with expressive helper methods.
 *
 * @param initialValue - Initial array state or factory function.
 * @returns A tuple containing the list state and an object with memoized manipulation handlers.
 */
export function useListState<T>(
  initialValue: T[] | (() => T[]) = []
): [T[], ListStateHandlers<T>] {
  const [list, setList] = useState<T[]>(initialValue)

  const append = useCallback((...items: T[]) => {
    if (items.length === 0) return
    setList((current) => [...current, ...items])
  }, [])

  const prepend = useCallback((...items: T[]) => {
    if (items.length === 0) return
    setList((current) => [...items, ...current])
  }, [])

  const insert = useCallback((index: number, ...items: T[]) => {
    setList((current) => {
      const cloned = [...current]
      const targetIndex = Math.max(0, Math.min(index, cloned.length))
      cloned.splice(targetIndex, 0, ...items)
      return cloned
    })
  }, [])

  const remove = useCallback((...indices: number[]) => {
    const indicesSet = new Set(indices)
    setList((current) => current.filter((_, index) => !indicesSet.has(index)))
  }, [])

  const reorder = useCallback(({ from, to }: ReorderPayload) => {
    setList((current) => {
      const cloned = [...current]
      if (from < 0 || from >= cloned.length || to < 0 || to >= cloned.length) {
        return current
      }
      const [movedItem] = cloned.splice(from, 1)
      cloned.splice(to, 0, movedItem)
      return cloned
    })
  }, [])

  const swap = useCallback(({ from, to }: ReorderPayload) => {
    setList((current) => {
      if (
        from < 0 ||
        from >= current.length ||
        to < 0 ||
        to >= current.length
      ) {
        return current
      }
      const cloned = [...current]
      const temp = cloned[from]
      cloned[from] = cloned[to]
      cloned[to] = temp
      return cloned
    })
  }, [])

  const setItem = useCallback((index: number, item: T) => {
    setList((current) => {
      const cloned = [...current]
      cloned[index] = item
      return cloned
    })
  }, [])

  const setItemProp = useCallback(
    <K extends keyof T>(index: number, prop: K, value: T[K]) => {
      setList((current) => {
        const cloned = [...current]
        cloned[index] = { ...cloned[index], [prop]: value }
        return cloned
      })
    },
    []
  )

  const apply = useCallback((fn: (item: T, index: number) => T) => {
    setList((current) => current.map((item, index) => fn(item, index)))
  }, [])

  const applyWhere = useCallback(
    (
      predicate: (item: T, index: number) => boolean,
      fn: (item: T, index: number) => T
    ) => {
      setList((current) =>
        current.map((item, index) =>
          predicate(item, index) ? fn(item, index) : item
        )
      )
    },
    []
  )

  const filter = useCallback((fn: (item: T, index: number) => boolean) => {
    setList((current) => current.filter(fn))
  }, [])

  return [
    list,
    {
      setState: setList,
      append,
      prepend,
      insert,
      remove,
      reorder,
      swap,
      setItem,
      setItemProp,
      apply,
      applyWhere,
      filter,
    },
  ]
}
