import { Link } from "@tanstack/react-router"
import { LayoutGrid } from "lucide-react"
import { useMemo } from "react"

import { GridContainer } from "@/app/layouts"

import { HOOKS_DATA } from "../hooks-data"
import type { HookCategoryIdWithAll, HookItem } from "../types"
import { HookCard } from "./hook-card"
import { HookFilterBar } from "./hook-filter-bar"
import { HookHero } from "./hook-hero"

interface HookGridProps {
  category?: HookCategoryIdWithAll
}

export function HookGrid({ category = "all" }: HookGridProps) {
  // Filter hooks by category
  const filteredHooks = useMemo(() => {
    if (category === "all") return HOOKS_DATA
    return HOOKS_DATA.filter((h) => h.category === category)
  }, [category])

  // Chunk hooks into triplets for 3-column GridContainer rows
  const hookRows = useMemo(() => {
    const rows: HookItem[][] = []
    for (let i = 0; i < filteredHooks.length; i += 3) {
      rows.push(filteredHooks.slice(i, i + 3))
    }
    return rows
  }, [filteredHooks])

  return (
    <div className="w-full">
      <HookHero category={category} totalCount={filteredHooks.length} />

      <GridContainer borderBottom showCrosshairs className="p-0">
        <HookFilterBar activeCategory={category} />
      </GridContainer>

      {hookRows.length > 0 ? (
        hookRows.map((triplet, rowIndex) => (
          <GridContainer
            key={`hook-row-${rowIndex}`}
            columns={3}
            borderBottom
            showCrosshairs
            className="w-full"
          >
            <div className="flex h-full w-full border-b border-border p-4 sm:p-5 md:border-b-0 md:p-5 lg:p-6">
              <HookCard hook={triplet[0]} />
            </div>

            <div className="flex h-full w-full border-b border-border p-4 sm:p-5 md:border-b-0 md:p-5 lg:p-6">
              {triplet[1] ? (
                <HookCard hook={triplet[1]} />
              ) : (
                <div className="hidden h-full w-full items-center justify-center rounded-lg bg-muted p-8 text-center lg:flex">
                  <span className="text-xs tracking-wider text-muted-foreground uppercase">
                    More Coming Soon
                  </span>
                </div>
              )}
            </div>

            <div className="flex h-full w-full p-4 sm:p-5 md:p-5 lg:p-6">
              {triplet[2] ? (
                <HookCard hook={triplet[2]} />
              ) : (
                <div className="hidden h-full w-full items-center justify-center rounded-lg bg-muted p-8 text-center lg:flex">
                  <span className="text-xs tracking-wider text-muted-foreground uppercase">
                    More Coming Soon
                  </span>
                </div>
              )}
            </div>
          </GridContainer>
        ))
      ) : (
        <GridContainer
          borderBottom
          showCrosshairs
          className="flex flex-col items-center justify-center py-16 text-center sm:py-24"
        >
          <h3 className="text-lg font-bold text-foreground sm:text-xl">
            No hooks in this category
          </h3>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground sm:text-sm">
            We are actively crafting more reactive primitives and developer
            utilities for this category.
          </p>
          <Link
            to="/hooks"
            className="mt-5 flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white"
          >
            <LayoutGrid className="size-3.5" />
            <span>Show all hooks</span>
          </Link>
        </GridContainer>
      )}
    </div>
  )
}
