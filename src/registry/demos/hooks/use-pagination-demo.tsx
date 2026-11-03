import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Package,
} from "lucide-react"
import { useMemo, useState } from "react"

import { ELLIPSIS, usePagination } from "@/registry/hooks/use-pagination"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { cn } from "@/shared/lib/utils"

interface Product {
  id: number
  name: string
  category: string
  price: string
  stock: number
}

// Generate sample dataset of 45 products
const SAMPLE_PRODUCTS: Product[] = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  name: `Product ${String(i + 1).padStart(3, "0")}`,
  category: ["Electronics", "Design Tools", "Accessories", "Audio", "Hardware"][
    i % 5
  ],
  price: `$${(29 + ((i * 17) % 250)).toFixed(2)}`,
  stock: 12 + ((i * 7) % 85),
}))

export function UsePaginationDemo() {
  const [pageSizeChoice, setPageSizeChoice] = useState(5)
  const products = useMemo(() => SAMPLE_PRODUCTS, [])

  const {
    page,
    pageSize,
    totalPages,
    range,
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
  } = usePagination<Product>({
    totalItems: products.length,
    initialPage: 1,
    initialPageSize: 5,
    siblings: 1,
    boundaries: 1,
  })

  const currentItems = slice(products)

  const handlePageSizeChange = (newSize: number) => {
    setPageSizeChoice(newSize)
    setPageSize(newSize)
  }

  return (
    <div className="w-full min-w-0 p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        {/* Top Control Bar */}
        <div className="flex flex-col gap-3 border-b border-border/40 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Package className="size-4 text-primary" />
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Pagination Sandbox
            </span>
          </div>

          {/* Page size toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">Per page:</span>
            <div className="flex rounded-lg border border-border/60 bg-muted/30 p-0.5 text-xs">
              {[5, 10, 15].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handlePageSizeChange(size)}
                  className={cn(
                    "cursor-pointer rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
                    pageSize === size
                      ? "bg-background font-semibold text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Paginated Items List */}
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-border/40 px-1 pb-1 text-[11px] font-medium text-muted-foreground">
            <span>
              Showing {itemStart}–{itemEnd} of {products.length} products
            </span>
            <span className="font-mono">
              Page {page} of {totalPages}
            </span>
          </div>

          <div className="divide-y divide-border/40">
            {currentItems.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-md px-2 py-2.5 transition-colors hover:bg-muted/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-7 items-center justify-center rounded-md border border-border/60 bg-muted/30 font-mono text-xs text-muted-foreground">
                    #{product.id}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-foreground">
                      {product.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-[10px] font-normal">
                    {product.stock} in stock
                  </Badge>
                  <span className="w-16 text-right font-mono text-xs font-semibold text-foreground">
                    {product.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          {/* First page */}
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={first}
            disabled={isFirstPage}
            aria-label="First page"
          >
            <ChevronsLeft className="size-4" />
          </Button>

          {/* Prev page */}
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={prev}
            disabled={!hasPrevPage}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>

          {/* Page numbers with Ellipsis */}
          <div className="flex items-center gap-1">
            {range.map((item, index) => {
              if (item === ELLIPSIS) {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex size-8 items-center justify-center text-xs text-muted-foreground select-none"
                  >
                    •••
                  </span>
                )
              }

              const isActive = item === page
              return (
                <Button
                  key={item}
                  variant={isActive ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "size-8 font-mono text-xs",
                    isActive &&
                      "font-bold shadow-[0_0_10px_var(--pp-primary-glow)]"
                  )}
                  onClick={() => setPage(item)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item}
                </Button>
              )
            })}
          </div>

          {/* Next page */}
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={next}
            disabled={!hasNextPage}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>

          {/* Last page */}
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={last}
            disabled={isLastPage}
            aria-label="Last page"
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UsePaginationDemo
