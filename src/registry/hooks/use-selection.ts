import { useCallback, useMemo, useState } from "react"
import type { Dispatch, SetStateAction } from "react"

export type SelectionKey = string | number

export interface UseSelectionOptions<T> {
  /**
   * Function to extract a unique key from each item.
   * Defaults to extracting `item.id`, `item.key`, or casting the item directly.
   */
  getKey?: (item: T) => SelectionKey

  /**
   * Initial selected keys on mount.
   */
  initialSelected?: SelectionKey[] | Set<SelectionKey>
}

export interface UseSelectionReturn<T> {
  /** Set containing all currently selected keys for O(1) lookups */
  selectedKeys: Set<SelectionKey>
  /** Array of actual items corresponding to the selected keys */
  selectedItems: T[]
  /** Total count of currently selected items */
  selectedCount: number
  /** Check if a specific key is selected */
  isSelected: (key: SelectionKey) => boolean
  /** Whether every item in the dataset is selected */
  isAllSelected: boolean
  /** Whether some items are selected, but not all (indeterminate state) */
  isPartiallySelected: boolean
  /** Select one or multiple keys */
  select: (keys: SelectionKey | SelectionKey[]) => void
  /** Deselect one or multiple keys */
  deselect: (keys: SelectionKey | SelectionKey[]) => void
  /** Toggle selection status of a single key */
  toggle: (key: SelectionKey) => void
  /** Select all items in the dataset */
  selectAll: () => void
  /** Deselect all items */
  clear: () => void
  /** Toggle between selecting all items and deselecting all */
  toggleAll: () => void
  /** Select a continuous range of items between two keys (useful for Shift + Click) */
  selectRange: (fromKey: SelectionKey, toKey: SelectionKey) => void
  /** Direct state setter for manual overrides */
  setSelectedKeys: Dispatch<SetStateAction<Set<SelectionKey>>>
}

/**
 * Custom hook to manage single, multi, and batch selection states of a dataset.
 *
 * @param items - The collection of items to select from.
 * @param options - Configuration options including custom key extractor and initial selection.
 */
export function useSelection<T>(
  items: readonly T[],
  options: UseSelectionOptions<T> = {}
): UseSelectionReturn<T> {
  const {
    getKey = (item: T): SelectionKey => {
      const record = item as Record<string, unknown>
      return (record?.id ?? record?.key ?? item) as SelectionKey
    },
    initialSelected,
  } = options

  const [selectedKeys, setSelectedKeys] = useState<Set<SelectionKey>>(() => {
    if (!initialSelected) return new Set()
    return initialSelected instanceof Set
      ? new Set(initialSelected)
      : new Set(initialSelected)
  })

  // Map each item to its unique key once per items reference update
  const itemKeys = useMemo(() => items.map(getKey), [items, getKey])

  // Derive selected items array matching the selected keys
  const selectedItems = useMemo(() => {
    return items.filter((item) => selectedKeys.has(getKey(item)))
  }, [items, selectedKeys, getKey])

  const selectedCount = selectedKeys.size
  const totalCount = items.length

  const isAllSelected = useMemo(() => {
    if (totalCount === 0) return false
    return itemKeys.every((key) => selectedKeys.has(key))
  }, [itemKeys, selectedKeys, totalCount])

  const isPartiallySelected = useMemo(() => {
    return selectedCount > 0 && !isAllSelected
  }, [selectedCount, isAllSelected])

  const isSelected = useCallback(
    (key: SelectionKey) => selectedKeys.has(key),
    [selectedKeys]
  )

  const select = useCallback((keys: SelectionKey | SelectionKey[]) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      const keysToAdd = Array.isArray(keys) ? keys : [keys]
      keysToAdd.forEach((k) => next.add(k))
      return next
    })
  }, [])

  const deselect = useCallback((keys: SelectionKey | SelectionKey[]) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      const keysToRemove = Array.isArray(keys) ? keys : [keys]
      keysToRemove.forEach((k) => next.delete(k))
      return next
    })
  }, [])

  const toggle = useCallback((key: SelectionKey) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelectedKeys(new Set(itemKeys))
  }, [itemKeys])

  const clear = useCallback(() => {
    setSelectedKeys(new Set())
  }, [])

  const toggleAll = useCallback(() => {
    if (isAllSelected) {
      clear()
    } else {
      selectAll()
    }
  }, [isAllSelected, clear, selectAll])

  const selectRange = useCallback(
    (fromKey: SelectionKey, toKey: SelectionKey) => {
      const fromIndex = itemKeys.indexOf(fromKey)
      const toIndex = itemKeys.indexOf(toKey)

      if (fromIndex === -1 || toIndex === -1) return

      const startIndex = Math.min(fromIndex, toIndex)
      const endIndex = Math.max(fromIndex, toIndex)

      setSelectedKeys((prev) => {
        const next = new Set(prev)
        for (let i = startIndex; i <= endIndex; i++) {
          next.add(itemKeys[i])
        }
        return next
      })
    },
    [itemKeys]
  )

  return {
    selectedKeys,
    selectedItems,
    selectedCount,
    isSelected,
    isAllSelected,
    isPartiallySelected,
    select,
    deselect,
    toggle,
    selectAll,
    clear,
    toggleAll,
    selectRange,
    setSelectedKeys,
  }
}
