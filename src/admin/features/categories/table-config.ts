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

import type { AdminCategoryWithCount, AdminTagWithCount } from "./types"

export const taxonomyTableFeatures = tableFeatures({
  rowSelectionFeature,
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
})

export const categoryColumnHelper = createColumnHelper<
  typeof taxonomyTableFeatures,
  AdminCategoryWithCount
>()

export const tagColumnHelper = createColumnHelper<
  typeof taxonomyTableFeatures,
  AdminTagWithCount
>()
