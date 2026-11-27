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

import type { AdminResource, AdminResourceCategoryWithCount } from "./types"

export const resourcesTableFeatures = tableFeatures({
  rowSelectionFeature,
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
})

export const resourceColumnHelper = createColumnHelper<
  typeof resourcesTableFeatures,
  AdminResource
>()

export const resourceCategoryColumnHelper = createColumnHelper<
  typeof resourcesTableFeatures,
  AdminResourceCategoryWithCount
>()
