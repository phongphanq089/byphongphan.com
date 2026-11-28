import {
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from "@tanstack/react-table"

import type { AdminGroupWithPosts } from "./types"

/**
 * Stable TanStack Table v9 feature bundle at module scope so row models
 * are never invalidated across renders.
 */
export const groupsTableFeatures = tableFeatures({
  rowSelectionFeature,
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
})

export const groupsColumnHelper = createColumnHelper<
  typeof groupsTableFeatures,
  AdminGroupWithPosts
>()
