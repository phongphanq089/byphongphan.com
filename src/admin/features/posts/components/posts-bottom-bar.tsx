import type { ReactTable } from "@tanstack/react-table"
import {
  Archive,
  CheckCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileEdit,
  Trash2,
  X,
} from "lucide-react"

import { cn } from "@/shared/lib/utils"
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui"

import type { postsTableFeatures } from "../table-config"
import type { AdminPost, PostStatus } from "../types"

interface PostsBottomBarProps {
  table: ReactTable<typeof postsTableFeatures, AdminPost>
  selectedCount: number
  totalRows: number
  onBulkStatusChange: (status: PostStatus) => void
  onBulkDelete: () => void
}

const PAGE_SIZES = [5, 8, 10, 20, 50]

function getVisiblePages(
  currentPage: number,
  totalPages: number
): Array<number | "ellipsis-left" | "ellipsis-right"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages: Array<number | "ellipsis-left" | "ellipsis-right"> = [1]

  if (currentPage > 3) {
    pages.push("ellipsis-left")
  }

  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  for (let page = start; page <= end; page++) {
    pages.push(page)
  }

  if (currentPage < totalPages - 2) {
    pages.push("ellipsis-right")
  }

  pages.push(totalPages)

  return pages
}

export function PostsBottomBar({
  table,
  selectedCount,
  totalRows,
  onBulkStatusChange,
  onBulkDelete,
}: PostsBottomBarProps) {
  const { pageIndex, pageSize } = table.state.pagination
  const pageCount = Math.max(1, table.getPageCount())
  const currentPage = Math.min(pageIndex + 1, pageCount)
  const visiblePages = getVisiblePages(currentPage, pageCount)
  const isAllRowsSelected = table.getIsAllRowsSelected()

  return (
    <div className="sticky -bottom-4 z-20 mt-auto flex flex-wrap items-center justify-between gap-3 rounded-b-[11px] border-t border-border/70 bg-card/95 px-5 py-3 text-xs shadow-[0_-4px_16px_-8px_rgba(0,0,0,0.25)] backdrop-blur-md md:-bottom-6 lg:-bottom-8">
      {/* Left: Rows per page */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <Select
          value={String(pageSize)}
          onValueChange={(value) => {
            const nextSize = Number(value)
            if (!Number.isNaN(nextSize)) {
              table.setPageSize(nextSize)
            }
          }}
        >
          <SelectTrigger
            size="sm"
            className="h-7.5 w-[68px] min-w-0 font-mono text-xs text-foreground"
            aria-label="Rows per page"
          >
            <SelectValue>{pageSize}</SelectValue>
          </SelectTrigger>
          <SelectContent align="start">
            {PAGE_SIZES.map((size) => (
              <SelectItem
                key={size}
                value={String(size)}
                className="font-mono text-xs"
              >
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="whitespace-nowrap">Rows per page</span>
      </div>

      {/* Center: Compact Selection & Bulk Action Capsule */}
      {selectedCount > 0 && (
        <div
          role="region"
          aria-label="Selected articles actions"
          className="order-first flex w-full flex-wrap items-center justify-between gap-1.5 rounded-xl border border-border/80 bg-background/95 px-2.5 py-1.5 shadow-sm lg:order-none lg:w-auto lg:justify-center"
        >
          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => table.resetRowSelection()}
                  aria-label="Clear selection"
                  className="rounded-full text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Clear selection</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-4 bg-border/80" />

            <div className="flex items-center gap-1.5 px-1">
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-foreground px-1.5 font-mono text-[11px] font-semibold text-background tabular-nums">
                {selectedCount}
              </span>
              <span className="font-medium text-foreground">
                {selectedCount === 1 ? "post selected" : "posts selected"}
              </span>
            </div>

            {!isAllRowsSelected && totalRows > selectedCount && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => table.toggleAllRowsSelected(true)}
                    className="h-6 gap-1 rounded-md px-2 text-[11px]"
                  >
                    <CheckCheck className="size-3" />
                    <span>All ({totalRows})</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Select all {totalRows} matching posts
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          <Separator
            orientation="vertical"
            className="hidden h-4 bg-border/80 sm:block"
          />

          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => onBulkStatusChange("published")}
                  aria-label="Publish selected posts"
                  className="size-7 rounded-lg"
                >
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Publish selected</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => onBulkStatusChange("draft")}
                  aria-label="Move selected posts to draft"
                  className="size-7 rounded-lg"
                >
                  <FileEdit className="size-3.5 text-amber-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Move to draft</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => onBulkStatusChange("archived")}
                  aria-label="Archive selected posts"
                  className="size-7 rounded-lg"
                >
                  <Archive className="size-3.5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Archive selected</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  onClick={onBulkDelete}
                  aria-label="Delete selected posts"
                  className="size-7 rounded-lg"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Delete selected</TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Right: Page indicator + Numbered Pagination */}
      <div className="ml-auto flex flex-wrap items-center gap-3">
        <span className="font-medium text-muted-foreground tabular-nums">
          Page <span className="font-mono text-foreground">{currentPage}</span>{" "}
          of <span className="font-mono text-foreground">{pageCount}</span>
        </span>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="First page"
            className="size-7 rounded-md"
          >
            <ChevronsLeft className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
            className="size-7 rounded-md"
          >
            <ChevronLeft className="size-3.5" />
          </Button>

          <div className="hidden items-center gap-1 sm:flex">
            {visiblePages.map((item) => {
              if (item === "ellipsis-left" || item === "ellipsis-right") {
                return (
                  <span
                    key={item}
                    className="px-1 font-mono text-xs text-muted-foreground"
                  >
                    ...
                  </span>
                )
              }

              const isActive = item === currentPage
              return (
                <Button
                  key={item}
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  size="icon-sm"
                  onClick={() => table.setPageIndex(item - 1)}
                  aria-label={`Page ${item}`}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "size-7 rounded-md font-mono text-xs tabular-nums",
                    !isActive && "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item}
                </Button>
              )
            })}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
            className="size-7 rounded-md"
          >
            <ChevronRight className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Last page"
            className="size-7 rounded-md"
          >
            <ChevronsRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
