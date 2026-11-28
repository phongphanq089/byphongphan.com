import {
  columnVisibilityFeature,
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from "@tanstack/react-table"

import type { AdminPost } from "./types"

/**
 * Stable TanStack Table v9 feature bundle at module scope so row models
 * are never invalidated across renders.
 */
export const postsTableFeatures = tableFeatures({
  columnVisibilityFeature,
  rowSelectionFeature,
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
})

export const postsColumnHelper = createColumnHelper<
  typeof postsTableFeatures,
  AdminPost
>()
