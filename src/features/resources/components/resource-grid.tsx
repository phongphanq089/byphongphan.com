import { useQuery } from "@tanstack/react-query"
import { BookmarkX } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { GridContainer } from "@/app/layouts"
import { useApiInspector } from "@/shared/tools/api-inspector"
import { Button } from "@/shared/ui/core"
import { SectionEmptyState } from "@/shared/ui/system"

import {
  getResourceCategories,
  getResources,
  RESOURCE_CATEGORIES_QUERY,
  resourceCategoriesQueryOptions,
  RESOURCES_QUERY,
  resourcesQueryOptions,
} from "../api/resource"
import type {
  PricingBadge,
  Resource,
  ResourceCategory,
  ResourceSortOption,
} from "../types"
import { ResourceCard } from "./resource-card"
import { ResourceFilterBar } from "./resource-filter-bar"
import { ResourceHero } from "./resource-hero"

interface ResourceGridProps {
  initialResources?: Resource[]
  initialCategories?: ResourceCategory[]
}

export function ResourceGrid({
  initialResources,
  initialCategories,
}: ResourceGridProps = {}) {
  const { data: resources = initialResources ?? [] } = useQuery({
    ...resourcesQueryOptions(),
    initialData: initialResources,
  })

  const { data: categories = initialCategories ?? [] } = useQuery({
    ...resourceCategoriesQueryOptions(),
    initialData: initialCategories,
  })

  // Register with API Inspector so developers can inspect and live-refetch
  const { register } = useApiInspector()
  useEffect(() => {
    register({
      id: "sanity-resources",
      title: "Sanity Resources",
      endpoint: RESOURCES_QUERY,
      method: "GROQ",
      data: resources,
      fetcher: () => getResources(),
      description:
        "Curated developer tools, UI libraries, and design resources fetched via GROQ",
      autoExecute: false,
    })

    register({
      id: "sanity-resource-categories",
      title: "Sanity Resource Categories",
      endpoint: RESOURCE_CATEGORIES_QUERY,
      method: "GROQ",
      data: categories,
      fetcher: () => getResourceCategories(),
      description:
        "Developer resource categories and navigation filters fetched via GROQ",
      autoExecute: false,
    })
  }, [register, resources, categories])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPricing, setSelectedPricing] = useState<PricingBadge | "ALL">(
    "ALL"
  )
  const [sortOption, setSortOption] = useState<ResourceSortOption>("featured")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Filter resources based on category, pricing, and search query
  const filteredResources = useMemo(() => {
    const list = resources.filter((resource) => {
      // Category filter
      if (
        selectedCategory &&
        resource.category.slug.current !== selectedCategory
      ) {
        return false
      }

      // Pricing filter
      if (selectedPricing !== "ALL" && resource.pricing !== selectedPricing) {
        return false
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchTitle = resource.title.toLowerCase().includes(query)
        const matchDesc = resource.description.toLowerCase().includes(query)
        const matchCategory = resource.category.title
          .toLowerCase()
          .includes(query)
        const matchUrl = resource.url.toLowerCase().includes(query)

        if (!matchTitle && !matchDesc && !matchCategory && !matchUrl) {
          return false
        }
      }

      return true
    })

    // Apply Sorting
    return [...list].sort((a, b) => {
      if (sortOption === "featured") {
        if (a.isFeatured && !b.isFeatured) return -1
        if (!a.isFeatured && b.isFeatured) return 1
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        )
      }
      if (sortOption === "newest") {
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        )
      }
      if (sortOption === "title") {
        return a.title.localeCompare(b.title)
      }
      return 0
    })
  }, [resources, selectedCategory, selectedPricing, searchQuery, sortOption])

  // Group filtered resources in pairs of 2 for 2-column GridContainer rows
  const resourcePairs = useMemo(() => {
    const pairs: Resource[][] = []
    for (let i = 0; i < filteredResources.length; i += 2) {
      pairs.push(filteredResources.slice(i, i + 2))
    }
    return pairs
  }, [filteredResources])

  return (
    <div className="w-full">
      {/* 1. Resources Hero Section */}
      <ResourceHero totalCount={resources.length} />

      {/* 2. Interactive Filter Bar */}
      <GridContainer borderBottom showCrosshairs className="px-4 py-2 sm:px-8">
        <ResourceFilterBar
          categories={categories}
          resources={resources}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedPricing={selectedPricing}
          onSelectPricing={setSelectedPricing}
          sortOption={sortOption}
          onSortChange={setSortOption}
          filteredCount={filteredResources.length}
          totalCount={resources.length}
        />
      </GridContainer>

      {/* 3. 2-Column Grid Container Rows */}
      {resourcePairs.length > 0 ? (
        resourcePairs.map((pair, rowIndex) => (
          <GridContainer
            key={`resource-row-${rowIndex}`}
            columns={2}
            borderBottom
            showCrosshairs
            className="w-full"
          >
            {/* Column 1 (Left Cell) */}
            <div className="flex h-full w-full border-b border-border p-4 sm:p-5 md:border-b-0 md:p-6">
              <ResourceCard
                resource={pair[0]}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Column 2 (Right Cell) */}
            <div className="flex h-full w-full p-4 sm:p-5 md:p-6">
              {pair[1] ? (
                <ResourceCard
                  resource={pair[1]}
                  onSelectCategory={setSelectedCategory}
                />
              ) : (
                /* Empty placeholder cell for odd count of items */
                <div className="hidden h-full w-full md:flex">
                  <SectionEmptyState
                    variant="cell"
                    title="More Bookmarks Coming Soon"
                    description="Curating additional design & dev tools."
                  />
                </div>
              )}
            </div>
          </GridContainer>
        ))
      ) : (
        /* Empty State when 0 resources match filters */
        <GridContainer
          borderBottom
          showCrosshairs
          className="p-6 sm:p-10 md:p-12"
        >
          <SectionEmptyState
            icon={<BookmarkX className="size-6" />}
            badge="RESOURCES DIRECTORY"
            title="No resources found"
            description="We couldn't find any resources matching your search query or filters. Try resetting your criteria."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory(null)
                  setSelectedPricing("ALL")
                  setSortOption("featured")
                  setSearchQuery("")
                }}
                className="border-pp-primary/40 bg-pp-primary/10 text-pp-primary hover:bg-pp-primary hover:text-white"
              >
                Clear all filters
              </Button>
            }
          />
        </GridContainer>
      )}
    </div>
  )
}
