import {
  BookmarkCheck,
  FolderTree,
  RotateCcw,
  Search,
  Star,
  X,
} from "lucide-react"

import { AdminViewModeToggle } from "@/admin"
import { cn } from "@/shared/lib/utils"
import {
  Badge,
  Button,
  Checkbox,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/shared/ui"

import type {
  AdminResourceCategory,
  ResourcePricing,
  ResourcesFilterState,
  ResourcesTab,
  ResourcesViewMode,
} from "../types"

interface ResourcesToolbarProps {
  activeTab: ResourcesTab
  resourcesCount: number
  categoriesCount: number
  categories: AdminResourceCategory[]
  filters: ResourcesFilterState
  viewMode: ResourcesViewMode
  hasActiveFilters: boolean
  isAllPageSelected: boolean
  isSomePageSelected: boolean
  onTabChange: (tab: ResourcesTab) => void
  onToggleSelectAllPage: () => void
  onFiltersChange: (next: Partial<ResourcesFilterState>) => void
  onViewModeChange: (mode: ResourcesViewMode) => void
  onResetFilters: () => void
}

const PRICING_OPTIONS: ResourcePricing[] = ["Free", "MIT", "Freemium", "Paid"]

export function ResourcesToolbar({
  activeTab,
  resourcesCount,
  categoriesCount,
  categories,
  filters,
  viewMode,
  hasActiveFilters,
  isAllPageSelected,
  isSomePageSelected,
  onTabChange,
  onToggleSelectAllPage,
  onFiltersChange,
  onViewModeChange,
  onResetFilters,
}: ResourcesToolbarProps) {
  const selectedCategory = categories.find((c) => c.id === filters.categoryId)

  return (
    <div className="flex flex-col gap-3 border-b border-border/70 px-5 pt-5 pb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={activeTab}
          onValueChange={(value) => onTabChange(value as ResourcesTab)}
          className="w-full sm:w-auto"
        >
          <TabsList
            variant="line"
            className="h-auto w-full flex-wrap gap-1 sm:h-9 sm:w-auto sm:flex-nowrap sm:gap-2"
          >
            <TabsTrigger
              value="resources"
              className="flex-none px-2.5 py-1.5 text-xs sm:py-1 sm:text-sm"
            >
              <BookmarkCheck className="size-3.5" />
              <span>Resources</span>
              <Badge
                variant="subtle"
                size="xs"
                shape="pill"
                className="font-mono tabular-nums"
              >
                {resourcesCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="flex-none px-2.5 py-1.5 text-xs sm:py-1 sm:text-sm"
            >
              <FolderTree className="size-3.5" />
              <span>Categories</span>
              <Badge
                variant="subtle"
                size="xs"
                shape="pill"
                className="font-mono tabular-nums"
              >
                {categoriesCount}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === "resources" && (
          <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
            {viewMode === "grid" && (
              <label className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-lg border border-border/80 bg-background/60 px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                <Checkbox
                  checked={isAllPageSelected}
                  indeterminate={!isAllPageSelected && isSomePageSelected}
                  onCheckedChange={onToggleSelectAllPage}
                  aria-label="Select all resources on current page"
                  className="inline-flex items-center justify-center"
                />
                <span>Select all</span>
              </label>
            )}

            <Button
              type="button"
              variant={filters.featuredOnly ? "secondary" : "outline"}
              size="sm"
              onClick={() =>
                onFiltersChange({ featuredOnly: !filters.featuredOnly })
              }
              aria-pressed={filters.featuredOnly}
              className={cn(
                "h-8 gap-1.5 text-xs",
                filters.featuredOnly &&
                  "border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/15 dark:text-amber-400"
              )}
            >
              <Star className="size-3.5" />
              <span>Featured</span>
            </Button>

            <AdminViewModeToggle value={viewMode} onChange={onViewModeChange} />
          </div>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <InputGroup className="h-8 flex-1">
          <InputGroupAddon align="inline-start">
            <Search className="size-3.5 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            placeholder={
              activeTab === "resources"
                ? "Search resources by title, URL, slug, or description..."
                : "Search resource categories..."
            }
            aria-label="Search resources"
            className="text-xs md:text-xs"
          />
          {filters.search && (
            <InputGroupAddon align="inline-end">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onFiltersChange({ search: "" })}
                aria-label="Clear search"
              >
                <X className="size-3" />
              </Button>
            </InputGroupAddon>
          )}
        </InputGroup>

        {activeTab === "resources" && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <Select
              value={filters.categoryId}
              onValueChange={(value) =>
                onFiltersChange({ categoryId: value ?? "all" })
              }
            >
              <SelectTrigger
                size="default"
                className="h-8 w-auto min-w-[152px] text-xs"
                aria-label="Filter by resource category"
              >
                <SelectValue>
                  {selectedCategory ? (
                    <span className="flex items-center gap-1.5">
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{
                          backgroundColor: selectedCategory.color ?? "#64748b",
                        }}
                      />
                      <span className="truncate">{selectedCategory.title}</span>
                    </span>
                  ) : (
                    "All Categories"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="start">
                <SelectItem value="all" className="text-xs">
                  All Categories
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className="text-xs">
                    <span className="flex items-center gap-2">
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: cat.color ?? "#64748b" }}
                      />
                      <span>{cat.title}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Pricing Filter */}
            <Select
              value={filters.pricing}
              onValueChange={(value) =>
                onFiltersChange({
                  pricing: (value as "all" | ResourcePricing) ?? "all",
                })
              }
            >
              <SelectTrigger
                size="default"
                className="h-8 w-auto min-w-[132px] text-xs"
                aria-label="Filter by pricing"
              >
                <SelectValue>
                  {filters.pricing === "all" ? "All Pricing" : filters.pricing}
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="all" className="text-xs">
                  All Pricing
                </SelectItem>
                {PRICING_OPTIONS.map((p) => (
                  <SelectItem key={p} value={p} className="text-xs">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onResetFilters}
                className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
