import { Link } from "@tanstack/react-router"
import { LayoutGrid } from "lucide-react"
import { useMemo } from "react"

import { GridContainer } from "@/app/layouts"

import { COMPONENTS_DATA } from "../components-data"
import type { ComponentCategoryIdWithAll, ComponentItem } from "../types"
import { ComponentCard } from "./component-card"
import { ComponentFilterBar } from "./component-filter-bar"
import { ComponentHero } from "./component-hero"
import { FoundationsView } from "./foundations-view"

interface ComponentGridProps {
  category?: ComponentCategoryIdWithAll
}

export function ComponentGrid({ category = "all" }: ComponentGridProps) {
  // Filter components by category
  const filteredComponents = useMemo(() => {
    if (category === "all") return COMPONENTS_DATA
    return COMPONENTS_DATA.filter((c) => c.category === category)
  }, [category])

  // Chunk components into triplets for 3-column GridContainer rows
  const componentRows = useMemo(() => {
    const rows: ComponentItem[][] = []
    for (let i = 0; i < filteredComponents.length; i += 3) {
      rows.push(filteredComponents.slice(i, i + 3))
    }
    return rows
  }, [filteredComponents])

  return (
    <div className="w-full">
      <ComponentHero
        category={category}
        totalCount={filteredComponents.length}
      />
      <GridContainer borderBottom showCrosshairs className="p-0">
        <ComponentFilterBar activeCategory={category} />
      </GridContainer>

      {category === "foundations" ? (
        <FoundationsView />
      ) : componentRows.length > 0 ? (
        componentRows.map((triplet, rowIndex) => (
          <GridContainer
            key={`component-row-${rowIndex}`}
            columns={3}
            borderBottom
            showCrosshairs
            className="w-full"
          >
            <div className="flex h-full w-full border-b border-border p-4 sm:p-5 md:border-b-0 md:p-5 lg:p-6">
              <ComponentCard component={triplet[0]} />
            </div>
            <div className="flex h-full w-full border-b border-border p-4 sm:p-5 md:border-b-0 md:p-5 lg:p-6">
              {triplet[1] ? (
                <ComponentCard component={triplet[1]} />
              ) : (
                <div className="hidden h-full w-full items-center justify-center rounded-lg bg-muted p-8 text-center lg:flex">
                  <span className="text-[10px] tracking-wider text-muted-foreground uppercase">
                    More Coming Soon
                  </span>
                </div>
              )}
            </div>

            <div className="flex h-full w-full p-4 sm:p-5 md:p-5 lg:p-6">
              {triplet[2] ? (
                <ComponentCard component={triplet[2]} />
              ) : (
                <div className="hidden h-full w-full items-center justify-center rounded-lg bg-muted p-8 text-center lg:flex">
                  <span className="text-[10px] tracking-wider text-muted-foreground uppercase">
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
            No components in this category
          </h3>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground sm:text-sm">
            We are working on adding more primitives and motion blocks to this
            category.
          </p>
          <Link
            to="/component-ui"
            className="mt-5 flex items-center gap-2 rounded-lg border border-pp-primary/40 bg-pp-primary/10 px-4 py-2 text-xs font-semibold text-pp-primary transition-all duration-200 hover:bg-pp-primary hover:text-white"
          >
            <LayoutGrid className="size-3.5" />
            <span>Show all components</span>
          </Link>
        </GridContainer>
      )}
    </div>
  )
}
