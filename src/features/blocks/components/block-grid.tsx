import { Riffle, Slow } from "@lucasmarkes/hairline/react"
import { Link } from "@tanstack/react-router"
import { LayoutGrid } from "lucide-react"
import { useMemo } from "react"

import { GridContainer } from "@/app/layouts"
import { PageHero } from "@/shared/ui"

import { BLOCKS_DATA } from "../blocks-data"
import type { BlockCategoryIdWithAll, BlockItem } from "../types"
import { BlockCard } from "./block-card"
import { BlockFilterBar } from "./block-filter-bar"

interface BlockGridProps {
  category?: BlockCategoryIdWithAll
}

const BLOCK_CATEGORY_HERO_CONFIG: Record<
  string,
  {
    badge: string
    title: string
    description?: string
  }
> = {
  "404-page": {
    badge: "404 Error Pages",
    title: "Playable games & gravity 404 pages.",
    description:
      "Interactive 404 error experiences featuring playable brick breaker games and 2D physics gravity blocks.",
  },
  editor: {
    badge: "Editor Surfaces",
    title: "Modern Lexical rich text editors.",
    description:
      "Production-grade extensible rich text editor with slash commands, markdown shortcuts, and floating bubble toolbar.",
  },
  auth: {
    badge: "Authentication",
    title: "Clean, accessible authentication screens.",
    description:
      "Production-ready sign-in, sign-up, password reset, and multi-factor authentication block layouts.",
  },
  marketing: {
    badge: "Marketing Sections",
    title: "High-converting marketing sections.",
    description:
      "Modern hero banners, feature grids, pricing tables, and social proof sections.",
  },
  ecommerce: {
    badge: "E-Commerce",
    title: "Modern commerce cards & checkout.",
    description:
      "Product showcase grids, interactive cart sheets, and frictionless checkout block flows.",
  },
  application: {
    badge: "Application",
    title: "Application layouts & functional blocks.",
    description:
      "Dashboard shells, activity streams, settings forms, and workspace containers.",
  },
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

  const heroConfig =
    category !== "all" ? BLOCK_CATEGORY_HERO_CONFIG[category] : undefined

  return (
    <div className="w-full">
      <PageHero
        badge={heroConfig?.badge ?? "Blocks ui"}
        count={`${filteredBlocks.length} ${filteredBlocks.length === 1 ? "block" : "blocks"}`}
        title={heroConfig?.title ?? "Beautifully designed, production-ready."}
        description={heroConfig?.description}
      />

      {/* 2. Route-based Segmented Category Nav Tabs (0 padding so borders touch GridContainer) */}
      <GridContainer borderBottom showCrosshairs className="p-0">
        <BlockFilterBar activeCategory={category} />
      </GridContainer>

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
                <div className="hidden h-full w-full items-center justify-center rounded-lg bg-background p-8 text-center md:flex">
                  <div className="-mt-10 flex flex-col items-center justify-center p-4 text-center sm:p-6 md:p-8">
                    <Riffle style={{ width: 400 }} label="Coming soon" />

                    <h3 className="text-lg font-medium text-foreground/60 sm:text-xl dark:text-white/30">
                      More block coming soon
                    </h3>
                  </div>
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
          <Slow style={{ width: 400 }} label="An empty sieve" />
          <h3 className="text-lg font-bold text-foreground sm:text-xl">
            No blocks in this category
          </h3>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground sm:text-sm">
            We are working on adding more blocks to this category.
          </p>
          <Link
            to="/blocks"
            className="mt-5 flex items-center gap-2 rounded-lg border border-pp-primary/40 bg-pp-primary/10 px-4 py-2 text-xs font-semibold text-pp-primary transition-all duration-200 hover:bg-pp-primary hover:text-pp-primary-foreground"
          >
            <LayoutGrid className="size-3.5" />
            <span>Show all blocks</span>
          </Link>
        </GridContainer>
      )}
    </div>
  )
}
