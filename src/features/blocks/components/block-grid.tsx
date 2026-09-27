import { Link } from "@tanstack/react-router"
import { LayoutGrid } from "lucide-react"
import { useMemo } from "react"

import { GridContainer } from "@/app/layouts"

import { BLOCKS_DATA } from "../blocks-data"
import type { BlockCategoryId, BlockItem } from "../types"
import { BlockCard } from "./block-card"
import { BlockFilterBar } from "./block-filter-bar"
import { BlockHero } from "./block-hero"

interface BlockGridProps {
  category?: BlockCategoryId
}

export function BlockGrid({ category = "all" }: BlockGridProps) {
  // Filter blocks by category route
  const filteredBlocks = useMemo(() => {
    if (category === "all") return BLOCKS_DATA
    return BLOCKS_DATA.filter((b) => b.category === category)
  }, [category])

  // Chunk into pairs for 2-column GridContainer rows
  const blockRows = useMemo(() => {
    const rows: BlockItem[][] = []
    for (let i = 0; i < filteredBlocks.length; i += 2) {
      rows.push(filteredBlocks.slice(i, i + 2))
    }
    return rows
  }, [filteredBlocks])

  return (
    <div className="w-full">
      {/* 1. Blocks Hero */}
      <BlockHero />

      {/* 2. Route-based Segmented Category Nav Tabs (0 padding so borders touch GridContainer) */}
      <GridContainer borderBottom showCrosshairs className="p-0">
        <BlockFilterBar activeCategory={category} />
      </GridContainer>

      {/* 3. 2-Column Grid Container Rows */}
      {blockRows.length > 0 ? (
        blockRows.map((pair, rowIndex) => (
          <GridContainer
            key={`block-row-${rowIndex}`}
            columns={2}
            borderBottom
            showCrosshairs
            className="w-full"
          >
            {/* Column 1 */}
            <div
              key={`${pair[0].id}-col1`}
              className="flex h-full w-full border-b border-border p-4 sm:p-5 md:border-b-0 md:p-6"
            >
              <BlockCard block={pair[0]} />
            </div>

            {/* Column 2 */}
            <div
              key={pair[1] ? `${pair[1].id}-col2` : `empty-col2-${rowIndex}`}
              className="flex h-full w-full p-4 sm:p-5 md:p-6"
            >
              {pair[1] ? (
                <BlockCard block={pair[1]} />
              ) : (
                <div className="hidden h-full w-full items-center justify-center rounded-lg bg-accent p-8 text-center md:flex">
                  <span className="text-[10px] tracking-wider text-muted-foreground/30 uppercase">
                    More Blocks Coming Soon
                  </span>
                </div>
              )}
            </div>
          </GridContainer>
        ))
      ) : (
        /* Empty state */
        <GridContainer
          borderBottom
          showCrosshairs
          className="flex flex-col items-center justify-center py-16 text-center sm:py-24"
        >
          <h3 className="text-lg font-bold text-foreground sm:text-xl">
            No blocks in this category
          </h3>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground sm:text-sm">
            We are working on adding more blocks to this category.
          </p>
          <Link
            to="/blocks"
            className="mt-5 flex items-center gap-2 rounded-lg border border-pp-primary/40 bg-pp-primary/10 px-4 py-2 text-xs font-semibold text-pp-primary transition-all duration-200 hover:bg-pp-primary hover:text-white"
          >
            <LayoutGrid className="size-3.5" />
            <span>Show all blocks</span>
          </Link>
        </GridContainer>
      )}
    </div>
  )
}
