import { MonitorArrowUpIcon, XIcon } from "@phosphor-icons/react"
import type { SortingState } from "@tanstack/react-table"
import { ArrowUpDown, LayoutGrid, List, RotateCcw, Search } from "lucide-react"

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
  AdminCategory,
  AdminPost,
  AdminPostGroup,
  PostsFilterState,
  PostsSortOption,
  PostStatus,
  PostsViewMode,
} from "../types"

interface PostsToolbarProps {
  posts: AdminPost[]
  categories: AdminCategory[]
  groups: AdminPostGroup[]
  filters: PostsFilterState
  sorting: SortingState
  viewMode: PostsViewMode
  hasActiveFilters: boolean
  isAllPageSelected: boolean
  isSomePageSelected: boolean
  onToggleSelectAllPage: () => void
  onFiltersChange: (next: Partial<PostsFilterState>) => void
  onSortPresetChange: (preset: PostsSortOption) => void
  onViewModeChange: (mode: PostsViewMode) => void
  onResetFilters: () => void
}

const SORT_LABELS: Record<PostsSortOption, string> = {
  publishedAt_desc: "Newest Published",
  updatedAt_desc: "Recently Updated",
  title_asc: "Title (A-Z)",
  readTime_desc: "Longest Read",
}

function getSortPresetFromState(sorting: SortingState): PostsSortOption {
  const first = sorting[0]
  if (!first) return "publishedAt_desc"
  if (first.id === "updatedAt" && first.desc) return "updatedAt_desc"
  if (first.id === "title" && !first.desc) return "title_asc"
  if (first.id === "readTime" && first.desc) return "readTime_desc"
  return "publishedAt_desc"
}

export function PostsToolbar({
  posts,
  categories,
  groups,
  filters,
  sorting,
  viewMode,
  hasActiveFilters,
  isAllPageSelected,
  isSomePageSelected,
  onToggleSelectAllPage,
  onFiltersChange,
  onSortPresetChange,
  onViewModeChange,
  onResetFilters,
}: PostsToolbarProps) {
  const statusCounts: Record<"all" | PostStatus, number> = {
    all: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    draft: posts.filter((p) => p.status === "draft").length,
    archived: posts.filter((p) => p.status === "archived").length,
  }

  const selectedCategory = categories.find((c) => c.id === filters.categoryId)
  const selectedGroupLabel =
    filters.groupId === "all"
      ? "All Series"
      : filters.groupId === "none"
        ? "Standalone"
        : (groups.find((g) => g.id === filters.groupId)?.title ?? "All Series")

  const activeSortPreset = getSortPresetFromState(sorting)

  return (
    <div className="flex flex-col gap-3 border-b border-border/70 px-5 pt-5 pb-4">
      {/* Row 1: Status Tabs + Featured + View Mode Toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={filters.status}
          onValueChange={(value) =>
            onFiltersChange({ status: value as "all" | PostStatus })
          }
          className="w-full sm:w-auto"
        >
          <TabsList
            variant="line"
            className="h-auto w-full flex-wrap gap-1 sm:h-9 sm:w-auto sm:flex-nowrap sm:gap-2"
          >
            {(
              [
                { value: "all", label: "All" },
                { value: "published", label: "Published" },
                { value: "draft", label: "Draft" },
                { value: "archived", label: "Archived" },
              ] as const
            ).map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-none px-2.5 py-1.5 text-xs sm:py-1 sm:text-sm"
              >
                <span>{tab.label}</span>
                <Badge
                  variant="subtle"
                  size="xs"
                  shape="pill"
                  className="font-mono tabular-nums"
                >
                  {statusCounts[tab.value]}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
          {viewMode === "grid" && (
            <label className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-lg border border-border/80 bg-background/60 px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
              <Checkbox
                checked={isAllPageSelected}
                indeterminate={!isAllPageSelected && isSomePageSelected}
                onCheckedChange={onToggleSelectAllPage}
                aria-label="Select all articles on current page"
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
            <MonitorArrowUpIcon className="size-3.5" />
            <span>Featured</span>
          </Button>

          <div
            role="group"
            aria-label="View layout"
            className="inline-flex h-8 items-center rounded-lg border border-border/80 bg-muted/30 p-0.5"
          >
            <Button
              type="button"
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon-xs"
              onClick={() => onViewModeChange("table")}
              aria-label="Table view"
              aria-pressed={viewMode === "table"}
              className="h-6.5 w-7 rounded-md"
            >
              <List className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon-xs"
              onClick={() => onViewModeChange("grid")}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
              className="h-6.5 w-7 rounded-md"
            >
              <LayoutGrid className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Row 2: Search + Taxonomy + Series + Sort */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <InputGroup className="h-8 flex-1">
          <InputGroupAddon align="inline-start">
            <Search className="size-3.5 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            placeholder="Search by title, slug, excerpt, or #tag..."
            aria-label="Search blog posts"
            className="text-xs md:text-xs"
          />
          {filters.search && (
            <InputGroupAddon
              onClick={() => onFiltersChange({ search: "" })}
              className="cursor-pointer"
            >
              <XIcon aria-hidden="true" />
            </InputGroupAddon>
          )}
        </InputGroup>

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
              className="h-8 w-auto min-w-[148px] text-xs"
              aria-label="Filter by category"
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

          {/* Series / Group Filter */}
          <Select
            value={filters.groupId}
            onValueChange={(value) =>
              onFiltersChange({ groupId: value ?? "all" })
            }
          >
            <SelectTrigger
              size="default"
              className="h-8 w-auto min-w-[156px] text-xs"
              aria-label="Filter by series"
            >
              <SelectValue>{selectedGroupLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="all" className="text-xs">
                All Series
              </SelectItem>
              <SelectItem value="none" className="text-xs">
                Standalone (No Series)
              </SelectItem>
              {groups.map((grp) => (
                <SelectItem key={grp.id} value={grp.id} className="text-xs">
                  {grp.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Filter */}
          <Select
            value={activeSortPreset}
            onValueChange={(value) =>
              onSortPresetChange(
                (value as PostsSortOption) ?? "publishedAt_desc"
              )
            }
          >
            <SelectTrigger
              size="default"
              className="h-8 w-auto min-w-[154px] text-xs"
              aria-label="Sort articles"
            >
              <SelectValue>
                <span className="flex items-center gap-1.5">
                  <ArrowUpDown className="size-3 text-muted-foreground" />
                  <span>{SORT_LABELS[activeSortPreset]}</span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              {(Object.keys(SORT_LABELS) as PostsSortOption[]).map((key) => (
                <SelectItem key={key} value={key} className="text-xs">
                  {SORT_LABELS[key]}
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
      </div>
    </div>
  )
}
