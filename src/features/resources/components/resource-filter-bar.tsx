import {
  ArrowDownAZ,
  ArrowUpZA,
  Check,
  ChevronDown,
  Clock,
  DollarSign,
  Layers,
  RotateCcw,
  Search,
  X,
} from "lucide-react"
import { useMemo } from "react"

import { cn } from "@/shared/lib"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
} from "@/shared/ui/core"

import type {
  PricingBadge,
  Resource,
  ResourceCategory,
  ResourceSortOption,
} from "../types"

interface ResourceFilterBarProps {
  categories: ResourceCategory[]
  resources: Resource[]
  selectedCategory: string | null
  onSelectCategory: (categorySlug: string | null) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedPricing: PricingBadge | "ALL"
  onSelectPricing: (pricing: PricingBadge | "ALL") => void
  sortOption: ResourceSortOption
  onSortChange: (sort: ResourceSortOption) => void
  filteredCount: number
  totalCount: number
}

const PRICING_OPTIONS: Array<{ value: PricingBadge | "ALL"; label: string }> = [
  { value: "ALL", label: "All Pricing" },
  { value: "Free", label: "Free (100%)" },
  { value: "MIT", label: "MIT (Open Source)" },
  { value: "Freemium", label: "Freemium" },
  { value: "Paid", label: "Paid" },
]

export const ResourceFilterBar = ({
  categories,
  resources,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedPricing,
  onSelectPricing,
  sortOption,
  onSortChange,
}: ResourceFilterBarProps) => {
  // Compute counts for categories
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: resources.length }
    for (const cat of categories) {
      counts[cat.slug.current] = resources.filter(
        (r) => r.category.slug.current === cat.slug.current
      ).length
    }
    return counts
  }, [categories, resources])

  const selectedCategoryObj = useMemo(
    () => categories.find((c) => c.slug.current === selectedCategory),
    [categories, selectedCategory]
  )

  const hasActiveFilters = Boolean(
    selectedCategory !== null ||
    selectedPricing !== "ALL" ||
    searchQuery.trim() !== "" ||
    sortOption !== "featured"
  )

  return (
    <div className="flex w-full flex-col gap-3 py-3">
      {/* Top Filter Controls: Search & Dropdowns */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
          {/* 1. Search Bar */}
          <div className="relative flex min-w-[200px] flex-1 items-center sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 size-3.5 text-muted-foreground/70" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search resources & tools..."
              className="h-8.5 w-full rounded-sm border border-border/80 bg-background/80 pr-8 pl-8.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-pp-primary focus:ring-1 focus:ring-pp-primary/40 focus:outline-none dark:bg-[#121214]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 flex size-4 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          {/* 2. Dropdown Group */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  className={cn(
                    "flex h-8.5 items-center gap-1.5 rounded-sm border px-2.5 text-xs font-medium transition-colors hover:bg-accent focus:outline-none",
                    selectedCategory
                      ? "border-pp-primary/60 bg-pp-primary/10 text-pp-primary"
                      : "border-border/80 bg-background/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Layers className="size-3.5 shrink-0" />
                  <span className="max-w-[130px] truncate">
                    {selectedCategoryObj
                      ? selectedCategoryObj.title
                      : "Category: All"}
                  </span>
                  <ChevronDown className="size-3 shrink-0 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-1">
                <DropdownMenuItem
                  onClick={() => onSelectCategory(null)}
                  className="flex items-center justify-between py-1.5 text-xs"
                >
                  <div className="flex items-center gap-2">
                    {selectedCategory === null && (
                      <Check className="size-3.5 text-pp-primary" />
                    )}
                    <span
                      className={cn(
                        selectedCategory === null &&
                          "pl-0 font-semibold text-pp-primary",
                        selectedCategory !== null && "pl-5.5"
                      )}
                    >
                      All Categories
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    ({categoryCounts.all || 0})
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {categories.map((cat) => {
                  const count = categoryCounts[cat.slug.current] || 0
                  const isSelected = selectedCategory === cat.slug.current
                  const colorHex =
                    typeof cat.color === "object"
                      ? cat.color?.hex
                      : (cat.color ?? "var(--pp-primary)")

                  return (
                    <DropdownMenuItem
                      key={cat._id}
                      onClick={() => onSelectCategory(cat.slug.current)}
                      className="flex items-center justify-between py-1.5 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <Check className="size-3.5 text-pp-primary" />
                        ) : (
                          <span
                            className="mr-1 ml-1 size-1.5 rounded-full"
                            style={{ backgroundColor: colorHex }}
                          />
                        )}
                        <span
                          className={cn(
                            isSelected && "font-semibold text-pp-primary"
                          )}
                        >
                          {cat.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        ({count})
                      </span>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Pricing Badge Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  className={cn(
                    "flex h-8.5 items-center gap-1.5 rounded-sm border px-2.5 text-xs font-medium transition-colors hover:bg-accent focus:outline-none",
                    selectedPricing !== "ALL"
                      ? "border-pp-primary/60 bg-pp-primary/10 text-pp-primary"
                      : "border-border/80 bg-background/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <DollarSign className="size-3.5 shrink-0" />
                  <span>
                    {selectedPricing === "ALL"
                      ? "Pricing: All"
                      : selectedPricing}
                  </span>
                  <ChevronDown className="size-3 shrink-0 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44 p-1">
                {PRICING_OPTIONS.map(({ value, label }) => {
                  const isSelected = selectedPricing === value
                  return (
                    <DropdownMenuItem
                      key={value}
                      onClick={() => onSelectPricing(value)}
                      className="flex items-center justify-between py-1.5 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <Check className="size-3.5 text-pp-primary" />
                        ) : (
                          <span className="pl-5.5" />
                        )}
                        <span
                          className={cn(
                            isSelected && "font-semibold text-pp-primary"
                          )}
                        >
                          {label}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sorting Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  className={cn(
                    "flex h-8.5 items-center gap-1.5 rounded-sm border border-border/80 bg-background/60 px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none",
                    sortOption !== "featured" && "text-foreground"
                  )}
                >
                  {sortOption === "featured" && (
                    <ArrowUpZA className="size-3.5" />
                  )}
                  {sortOption === "newest" && <Clock className="size-3.5" />}
                  {sortOption === "title" && (
                    <ArrowDownAZ className="size-3.5" />
                  )}
                  <span className="capitalize">
                    {sortOption === "featured"
                      ? "Featured"
                      : sortOption === "newest"
                        ? "Newest"
                        : "A-Z"}
                  </span>
                  <ChevronDown className="size-3 shrink-0 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 p-1">
                <DropdownMenuItem
                  onClick={() => onSortChange("featured")}
                  className="flex items-center gap-2 py-1.5 text-xs"
                >
                  {sortOption === "featured" ? (
                    <Check className="size-3.5 text-pp-primary" />
                  ) : (
                    <span className="pl-5.5" />
                  )}
                  <span
                    className={cn(
                      sortOption === "featured" &&
                        "font-semibold text-pp-primary"
                    )}
                  >
                    Featured First
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onSortChange("newest")}
                  className="flex items-center gap-2 py-1.5 text-xs"
                >
                  {sortOption === "newest" ? (
                    <Check className="size-3.5 text-pp-primary" />
                  ) : (
                    <span className="pl-5.5" />
                  )}
                  <span
                    className={cn(
                      sortOption === "newest" && "font-semibold text-pp-primary"
                    )}
                  >
                    Newest Added
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onSortChange("title")}
                  className="flex items-center gap-2 py-1.5 text-xs"
                >
                  {sortOption === "title" ? (
                    <Check className="size-3.5 text-pp-primary" />
                  ) : (
                    <span className="pl-5.5" />
                  )}
                  <span
                    className={cn(
                      sortOption === "title" && "font-semibold text-pp-primary"
                    )}
                  >
                    Title (A-Z)
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Reset Filters Button */}
            {hasActiveFilters && (
              <Button
                type="button"
                onClick={() => {
                  onSelectCategory(null)
                  onSelectPricing("ALL")
                  onSortChange("featured")
                  onSearchChange("")
                }}
                className="flex h-8.5 items-center gap-1.5 rounded-sm border border-border/80 bg-muted/40 px-2.5 text-xs text-muted-foreground transition-colors hover:border-pp-primary/50 hover:bg-pp-primary/10 hover:text-pp-primary"
              >
                <RotateCcw className="size-3" />
                <span className="max-sm:hidden">Reset</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Horizontal Quick-Filter Category Pills */}
      <div className="no-scrollbar flex w-full items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
        <Button
          type="button"
          onClick={() => onSelectCategory(null)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-sm border px-2.5 py-1 text-[11px] font-medium transition-all",
            selectedCategory === null
              ? "border-pp-primary/60 bg-pp-primary/10 text-pp-primary shadow-xs"
              : "border-border/60 bg-muted/30 text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground"
          )}
        >
          <span>All</span>
          <span className="text-[10px] opacity-70">
            ({categoryCounts.all || 0})
          </span>
        </Button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug.current
          const count = categoryCounts[cat.slug.current] || 0
          const colorHex =
            typeof cat.color === "object"
              ? cat.color?.hex
              : (cat.color ?? "var(--pp-primary)")

          return (
            <Button
              key={cat._id}
              type="button"
              onClick={() => onSelectCategory(cat.slug.current)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-sm border px-2.5 py-1 text-[11px] font-medium transition-all",
                isSelected
                  ? "border-pp-primary/60 bg-pp-primary/10 text-pp-primary shadow-xs"
                  : "border-border/60 bg-muted/30 text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: colorHex }}
              />
              <span>{cat.title}</span>
              <span className="text-[10px] opacity-70">({count})</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
