# usePagination

> Controls dataset pagination metrics, slice bounds, and UI navigation range with ellipsis handling.

## Installation

  

  
    ```bash
npx shadcn@latest add https://byphongphan.com/r/use-pagination.json
```
  

  
    
      - Copy and paste the hook into your project.
      ```tsx
// hooks/use-pagination.ts
import { useCallback, useMemo, useState, useEffect } from "react"

export const ELLIPSIS = "..." as const
export type PaginationItem = number | typeof ELLIPSIS

export interface UsePaginationOptions {
  /** Total count of items in the entire dataset */
  totalItems: number
  /** Initial page index (1-based, default: 1) */
  initialPage?: number
  /** Initial number of items per page (default: 10) */
  initialPageSize?: number
  /** Number of visible page buttons on each side of the active page (default: 1) */
  siblings?: number
  /** Number of visible page buttons at the extreme start and end (default: 1) */
  boundaries?: number
  /** Optional callback fired whenever the active page or pageSize changes */
  onChange?: (page: number, pageSize: number) => void
}

export interface UsePaginationReturn<T = unknown> {
  /** Current active page (1-based) */
  page: number
  /** Current number of items rendered per page */
  pageSize: number
  /** Total calculated pages based on totalItems and pageSize */
  totalPages: number
  /** Computed list of page numbers and ellipsis tokens for UI button rendering */
  range: PaginationItem[]
  /** Zero-based start index, ideal for `items.slice(startIndex, endIndex)` */
  startIndex: number
  /** Zero-based exclusive end index for array slicing */
  endIndex: number
  /** One-based display index of the first item on current page (e.g., "Showing 11 to 20") */
  itemStart: number
  /** One-based display index of the last item on current page */
  itemEnd: number
  /** Whether the current page is the first page */
  isFirstPage: boolean
  /** Whether the current page is the last page */
  isLastPage: boolean
  /** Whether navigation to a previous page is available */
  hasPrevPage: boolean
  /** Whether navigation to a next page is available */
  hasNextPage: boolean
  /** Navigate directly to a target page (clamped within [1, totalPages]) */
  setPage: (page: number) => void
  /** Change page size with optional reset to page 1 */
  setPageSize: (pageSize: number, resetToFirstPage?: boolean) => void
  /** Navigate forward by 1 page */
  next: () => void
  /** Navigate backward by 1 page */
  prev: () => void
  /** Jump directly to page 1 */
  first: () => void
  /** Jump directly to the final page */
  last: () => void
  /** Helper to slice an arbitrary in-memory array for current page items */
  slice: (data: readonly T[]) => T[]
}

/**
 * Generates an array of page numbers with ellipsis markers based on active page, siblings, and boundaries.
 */
function generatePaginationRange(
  totalPages: number,
  page: number,
  siblings: number,
  boundaries: number
): PaginationItem[] {
  // If total pages is small enough, display all pages without ellipsis
  const totalNumbers = boundaries * 2 + siblings * 2 + 3 // active page + 2 dots + boundaries + siblings
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const leftSiblingIndex = Math.max(page - siblings, 1)
  const rightSiblingIndex = Math.min(page + siblings, totalPages)

  const shouldShowLeftDots = leftSiblingIndex > boundaries + 2
  const shouldShowRightDots = rightSiblingIndex < totalPages - (boundaries + 1)

  const startBoundary = Array.from({ length: boundaries }, (_, i) => i + 1)
  const endBoundary = Array.from(
    { length: boundaries },
    (_, i) => totalPages - boundaries + i + 1
  )

  // Case 1: Show right dots only (near start)
  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = boundaries + siblings * 2 + 2
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
    return [...leftRange, ELLIPSIS, ...endBoundary]
  }

  // Case 2: Show left dots only (near end)
  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = boundaries + siblings * 2 + 2
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    )
    return [...startBoundary, ELLIPSIS, ...rightRange]
  }

  // Case 3: Show both left and right dots (in middle)
  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  )
  return [...startBoundary, ELLIPSIS, ...middleRange, ELLIPSIS, ...endBoundary]
}

/**
 * Custom hook to control dataset pagination metrics, slice bounds, and UI navigation controls.
 */
export function usePagination<T = unknown>(
  options: UsePaginationOptions
): UsePaginationReturn<T> {
  const {
    totalItems,
    initialPage = 1,
    initialPageSize = 10,
    siblings = 1,
    boundaries = 1,
    onChange,
  } = options

  const [pageSize, setPageSizeState] = useState(() =>
    Math.max(1, initialPageSize)
  )
  const totalPages = Math.max(1, Math.ceil(Math.max(0, totalItems) / pageSize))

  const [page, setPageState] = useState(() =>
    Math.min(Math.max(1, initialPage), totalPages)
  )

  // Automatically clamp active page when totalPages decreases (e.g., search/filter updates)
  useEffect(() => {
    if (page > totalPages) {
      setPageState(totalPages)
      onChange?.(totalPages, pageSize)
    }
  }, [totalPages, page, pageSize, onChange])

  const setPage = useCallback(
    (targetPage: number) => {
      const clampedPage = Math.min(Math.max(1, targetPage), totalPages)
      if (clampedPage !== page) {
        setPageState(clampedPage)
        onChange?.(clampedPage, pageSize)
      }
    },
    [page, totalPages, pageSize, onChange]
  )

  const setPageSize = useCallback(
    (newSize: number, resetToFirstPage = true) => {
      const validSize = Math.max(1, newSize)
      setPageSizeState(validSize)

      if (resetToFirstPage) {
        setPageState(1)
        onChange?.(1, validSize)
      } else {
        const nextTotalPages = Math.max(1, Math.ceil(totalItems / validSize))
        const nextClampedPage = Math.min(page, nextTotalPages)
        setPageState(nextClampedPage)
        onChange?.(nextClampedPage, validSize)
      }
    },
    [page, totalItems, onChange]
  )

  const next = useCallback(() => setPage(page + 1), [setPage, page])
  const prev = useCallback(() => setPage(page - 1), [setPage, page])
  const first = useCallback(() => setPage(1), [setPage])
  const last = useCallback(() => setPage(totalPages), [setPage, totalPages])

  // Compute zero-based and one-based boundary indices
  const startIndex = (page - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const itemStart = totalItems === 0 ? 0 : startIndex + 1
  const itemEnd = Math.min(page * pageSize, totalItems)

  const isFirstPage = page === 1
  const isLastPage = page === totalPages
  const hasPrevPage = page > 1
  const hasNextPage = page < totalPages

  const range = useMemo(
    () => generatePaginationRange(totalPages, page, siblings, boundaries),
    [totalPages, page, siblings, boundaries]
  )

  const slice = useCallback(
    (data: readonly T[]): T[] => {
      return data.slice(startIndex, endIndex)
    },
    [startIndex, endIndex]
  )

  return {
    page,
    pageSize,
    totalPages,
    range,
    startIndex,
    endIndex,
    itemStart,
    itemEnd,
    isFirstPage,
    isLastPage,
    hasPrevPage,
    hasNextPage,
    setPage,
    setPageSize,
    next,
    prev,
    first,
    last,
    slice,
  }
}

```
      - Update the import paths to match your project setup.
    
  

## Usage

### In-Memory Client-Side List

```tsx
import { usePagination, ELLIPSIS } from "@/shared/hooks"

interface Post {
  id: number
  title: string
}

export function PostList({ posts }: { posts: Post[] }) {
  const {
    page,
    totalPages,
    range,
    next,
    prev,
    setPage,
    slice,
    hasPrevPage,
    hasNextPage,
    itemStart,
    itemEnd,
  } = usePagination<Post>({
    totalItems: posts.length,
    initialPageSize: 5,
    siblings: 1,
    boundaries: 1,
  })

  const currentPosts = slice(posts)

  return (
    <div className="space-y-4">
      <div className="text-xs text-muted-foreground">
        Showing {itemStart}–{itemEnd} of {posts.length}
      </div>

      <ul className="divide-y border rounded-lg">
        {currentPosts.map((post) => (
          <li key={post.id} className="p-3 text-sm">
            {post.title}
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1 justify-center">
        <button onClick={prev} disabled={!hasPrevPage}>Previous</button>

        {range.map((item, idx) =>
          item === ELLIPSIS ? (
            <span key={`dots-${idx}`} className="px-2">...</span>
          ) : (
            <button
              key={item}
              onClick={() => setPage(item)}
              className={item === page ? "font-bold text-primary" : ""}
            >
              {item}
            </button>
          )
        )}

        <button onClick={next} disabled={!hasNextPage}>Next</button>
      </div>
    </div>
  )
}
```

### Server-Side Data Fetching

```tsx
import { useEffect, useState } from "react"
import { usePagination } from "@/shared/hooks"

export function ServerSideTable() {
  const [data, setData] = useState([])
  const [totalCount, setTotalCount] = useState(0)

  const pagination = usePagination({
    totalItems: totalCount,
    initialPageSize: 20,
    onChange: (newPage, newPageSize) => {
      // Re-fetch data on page change
      fetchUsers({ page: newPage, limit: newPageSize })
    },
  })

  return (
    <div>
      {/* Table displaying server-side data */}
      <span>Page {pagination.page} of {pagination.totalPages}</span>
    </div>
  )
}
```

## Features

- **Ellipsis Generation**: Computes compact numeric navigation ranges with `"..."` tokens based on customizable `siblings` and `boundaries`.
- **Built-in Slicing (`slice`)**: Provides a memory-efficient `slice(array)` helper that calculates zero-based index boundaries automatically.
- **Display Indices Ready**: Returns `itemStart` and `itemEnd` (1-based human display numbers) to easily render "Showing 11 to 20 of 100".
- **Dynamic Auto-Clamping**: Automatically clamps the active page to `totalPages` whenever `totalItems` decreases (e.g. after searching or applying filters).
- **Navigation Shortcuts**: Built-in `first()`, `last()`, `prev()`, and `next()` helpers alongside direct `setPage(n)`.

## Parameters

| Parameter                 | Type                                            | Default | Description                                                                |
| :------------------------ | :---------------------------------------------- | :------ | :------------------------------------------------------------------------- |
| `options.totalItems`      | `number`                                        | `—`     | Total count of items in the entire dataset.                                |
| `options.initialPage`     | `number`                                        | `1`     | Initial page number (1-based).                                             |
| `options.initialPageSize` | `number`                                        | `10`    | Initial number of items per page.                                          |
| `options.siblings`        | `number`                                        | `1`     | Number of visible page buttons on each side of the active page.            |
| `options.boundaries`      | `number`                                        | `1`     | Number of visible page buttons at the extreme start and end.               |
| `options.onChange`        | `(page: number, pageSize: number) => void`      | `—`     | Optional callback fired whenever the active page or page size is modified. |

## Returns

Returns a `UsePaginationReturn<T>` object:

| Property       | Type                                                       | Description                                                                     |
| :------------- | :--------------------------------------------------------- | :------------------------------------------------------------------------------ |
| `page`         | `number`                                                   | Current active page (1-based index).                                            |
| `pageSize`     | `number`                                                   | Current number of items rendered per page.                                      |
| `totalPages`   | `number`                                                   | Total calculated pages based on `totalItems` and `pageSize`.                    |
| `range`        | `(number \| "...")[]`                                      | Computed list of page numbers and ellipsis tokens for UI button rendering.      |
| `startIndex`   | `number`                                                   | Zero-based start index, ideal for `items.slice(startIndex, endIndex)`.          |
| `endIndex`     | `number`                                                   | Zero-based exclusive end index for array slicing.                               |
| `itemStart`    | `number`                                                   | One-based display index of the first item on current page (e.g. "Showing 11").  |
| `itemEnd`      | `number`                                                   | One-based display index of the last item on current page.                       |
| `isFirstPage`  | `boolean`                                                  | Whether currently on page 1.                                                    |
| `isLastPage`   | `boolean`                                                  | Whether currently on the last page.                                             |
| `hasPrevPage`  | `boolean`                                                  | Whether backward navigation is possible (`page > 1`).                           |
| `hasNextPage`  | `boolean`                                                  | Whether forward navigation is possible (`page < totalPages`).                   |
| `setPage`      | `(page: number) => void`                                   | Navigates directly to a target page with clamping.                              |
| `setPageSize`  | `(pageSize: number, resetToFirstPage?: boolean) => void`   | Updates page size with optional reset to page 1.                                |
| `next`         | `() => void`                                               | Moves forward by 1 page.                                                        |
| `prev`         | `() => void`                                               | Moves backward by 1 page.                                                       |
| `first`        | `() => void`                                               | Jumps directly to page 1.                                                       |
| `last`         | `() => void`                                               | Jumps directly to the final page.                                               |
| `slice`        | `(data: readonly T[]) => T[]`                              | Slices an arbitrary in-memory array for current page items.                     |
