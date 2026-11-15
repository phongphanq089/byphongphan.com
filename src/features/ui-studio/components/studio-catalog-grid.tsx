import { useVirtualizer } from "@tanstack/react-virtual"
import * as React from "react"

import { useMediaQuery } from "@/shared/hooks/use-media-query"
import { cn } from "@/shared/lib/utils"

import type { StudioItem } from "../model/types"
import { getRecordByItem } from "../model/unified-registry.adapter"

interface StudioCatalogGridProps {
  items: StudioItem[]
  onSelectItem: (itemId: string) => void
}

const ROW_HEIGHT = 176
const OVERSCAN = 3

function chunk<T>(list: T[], size: number): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < list.length; i += size) {
    rows.push(list.slice(i, i + size))
  }
  return rows
}

/**
 * Master catalog: windowed row virtualization — at any moment only a couple
 * of rows (~8–16 cards) are mounted regardless of library size.
 */
export function StudioCatalogGrid({
  items,
  onSelectItem,
}: StudioCatalogGridProps) {
  const isSm = useMediaQuery("(min-width: 640px)")
  const isLg = useMediaQuery("(min-width: 1024px)")
  const isXl = useMediaQuery("(min-width: 1280px)")
  const columns = isXl ? 4 : isLg ? 3 : isSm ? 2 : 1

  const parentRef = React.useRef<HTMLDivElement>(null)
  const rows = React.useMemo(() => chunk(items, columns), [items, columns])

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
  })

  if (items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase">
          Nothing here yet
        </p>
        <p className="max-w-56 text-sm text-muted-foreground">
          This collection has no entries in the local registry.
        </p>
      </div>
    )
  }

  return (
    <div
      ref={parentRef}
      className="h-full w-full overflow-y-auto overscroll-contain p-3 sm:p-4"
      role="list"
      aria-label="Registry catalog"
    >
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index]
          return (
            <div
              key={virtualRow.key}
              role="listitem"
              className="absolute top-0 left-0 grid w-full gap-2 pb-2 sm:gap-3"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              }}
            >
              {row.map((item) => (
                <CatalogCard
                  key={item.id}
                  item={item}
                  onSelectItem={onSelectItem}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CatalogCard({
  item,
  onSelectItem,
}: {
  item: StudioItem
  onSelectItem: (itemId: string) => void
}) {
  const record = getRecordByItem(item.id)
  const Schematic = record?.schematic

  return (
    <button
      type="button"
      onClick={() => onSelectItem(item.id)}
      className={cn(
        "group flex h-40 flex-col overflow-hidden rounded-xl border border-border/60 bg-card/40 text-left transition-all duration-200 outline-none hover:border-foreground/20 hover:bg-card focus-visible:ring-2 focus-visible:ring-primary"
      )}
    >
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-muted/20 [background-image:radial-gradient(circle_at_1px_1px,var(--color-border)_1px,transparent_0)] [background-size:14px_14px]">
        {Schematic ? (
          <div className="pointer-events-none flex scale-[0.68] items-center justify-center transition-transform duration-300 group-hover:scale-[0.74]">
            <Schematic />
          </div>
        ) : (
          <span className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground/40 uppercase">
            {item.collection}
          </span>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          {item.isNew ? (
            <span className="rounded-full border border-pp-primary/40 bg-pp-primary/15 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.18em] text-pp-primary uppercase backdrop-blur-sm">
              New
            </span>
          ) : null}
          {item.isUpdated ? (
            <span className="rounded-full border border-amber-500/40 bg-amber-500/15 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.18em] text-amber-600 uppercase backdrop-blur-sm dark:text-amber-400">
              Updated
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border/60 px-3 py-2">
        <span className="truncate text-[12px] font-semibold text-foreground">
          {item.title}
        </span>
        <span className="shrink-0 font-mono text-[8px] tracking-[0.2em] text-muted-foreground/50 uppercase">
          {item.collection}
        </span>
      </div>
    </button>
  )
}
