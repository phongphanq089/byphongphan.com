# useSelection

> Manages single, multi, and batch selection states with Set-based O(1) lookups and range selection.

## Installation

  

  ```bash
npx shadcn@latest add https://byphongphan.com/r/use-selection.json
```

  
    
      - Copy and paste the hook into your project.
      ```tsx
// hooks/use-selection.ts
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

```
      - Update the import paths to match your project setup.
    
  

## Usage

### Table Batch Selection

```tsx
import { useSelection } from "@/shared/hooks"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"
import { Checkbox } from "@/registry/ui/checkbox"

interface User {
  id: string
  name: string
  email: string
}

export function UserTable({ users }: { users: User[] }) {
  const {
    isSelected,
    isAllSelected,
    isPartiallySelected,
    toggle,
    toggleAll,
    selectedCount,
  } = useSelection(users, { getKey: (u) => u.id })

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">
        Selected: {selectedCount} of {users.length}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isPartiallySelected}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              data-state={isSelected(user.id) ? "selected" : undefined}
            >
              <TableCell className="w-10">
                <Checkbox
                  checked={isSelected(user.id)}
                  onCheckedChange={() => toggle(user.id)}
                  aria-label={`Select ${user.name}`}
                />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

### Shift + Click Range Selection

```tsx
import { useRef } from "react"
import { useSelection, SelectionKey } from "@/shared/hooks"

export function SelectableList({ items }: { items: { id: string; label: string }[] }) {
  const lastSelectedKeyRef = useRef<SelectionKey | null>(null)
  const { isSelected, toggle, selectRange } = useSelection(items)

  const handleItemClick = (key: string, e: React.MouseEvent) => {
    if (e.shiftKey && lastSelectedKeyRef.current) {
      selectRange(lastSelectedKeyRef.current, key)
    } else {
      toggle(key)
      lastSelectedKeyRef.current = key
    }
  }

  return (
    <ul className="divide-y border rounded-lg">
      {items.map((item) => (
        <li
          key={item.id}
          onClick={(e) => handleItemClick(item.id, e)}
          className={`p-3 cursor-pointer select-none ${
            isSelected(item.id) ? "bg-primary/10" : ""
          }`}
        >
          {item.label}
        </li>
      ))}
    </ul>
  )
}
```

## Features

- **O(1) Set Performance**: Uses native JavaScript `Set<SelectionKey>` internally for instant constant-time selection lookups.
- **Tri-State Header Checkbox**: Accurately computes `isAllSelected` and `isPartiallySelected` for indeterminate state handling in tables and list headers.
- **Continuous Range Selection**: Built-in `selectRange(fromKey, toKey)` allows implementing desktop-style Shift + Click multi-row selection in just one line.
- **Derived Selected Items**: Automatically returns `selectedItems` array synchronized with `selectedKeys`.
- **Flexible Key Resolution**: Defaults to `item.id ?? item.key ?? item`, or provide a custom `getKey` extractor for custom data models.

## Parameters

| Parameter                 | Type                                  | Default                                 | Description                                                      |
| :------------------------ | :------------------------------------ | :-------------------------------------- | :--------------------------------------------------------------- |
| `items`                   | `readonly T[]`                        | `—`                                     | The array of items available for selection.                      |
| `options.getKey`          | `(item: T) => SelectionKey`           | `(item) => item.id ?? item.key ?? item` | Custom function to extract a unique string or number identifier. |
| `options.initialSelected` | `SelectionKey[] \| Set<SelectionKey>` | `—`                                     | Initial keys selected on mount.                                  |

## Returns

Returns a `UseSelectionReturn<T>` object:

| Property              | Type                                                   | Description                                                               |
| :-------------------- | :----------------------------------------------------- | :------------------------------------------------------------------------ |
| `selectedKeys`        | `Set<SelectionKey>`                                    | Active Set containing all selected identifiers.                           |
| `selectedItems`       | `T[]`                                                  | Array of full item objects corresponding to the selected keys.            |
| `selectedCount`       | `number`                                               | Number of currently selected items (`selectedKeys.size`).                 |
| `isSelected`          | `(key: SelectionKey) => boolean`                       | Checks whether a specific item key is selected.                           |
| `isAllSelected`       | `boolean`                                              | Whether every item in the dataset is selected.                            |
| `isPartiallySelected` | `boolean`                                              | Whether at least one item is selected, but not all (indeterminate state). |
| `select`              | `(keys: SelectionKey \| SelectionKey[]) => void`       | Selects one or multiple keys.                                             |
| `deselect`            | `(keys: SelectionKey \| SelectionKey[]) => void`       | Deselects one or multiple keys.                                           |
| `toggle`              | `(key: SelectionKey) => void`                          | Inverts the selection status of a single key.                             |
| `selectAll`           | `() => void`                                           | Selects every item in the dataset.                                        |
| `clear`               | `() => void`                                           | Deselects all items.                                                      |
| `toggleAll`           | `() => void`                                           | Toggles between selecting all and deselecting all items.                  |
| `selectRange`         | `(fromKey: SelectionKey, toKey: SelectionKey) => void` | Selects all items between `fromKey` and `toKey` inclusive (Shift-Click).  |
| `setSelectedKeys`     | `Dispatch<SetStateAction<Set<SelectionKey>>>`          | Direct state setter for manual overrides.                                 |
