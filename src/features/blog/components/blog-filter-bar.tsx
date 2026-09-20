import {
  Bookmark,
  Check,
  ChevronDown,
  Hash,
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

import type { BlogCategory, BlogGroup, BlogPost, BlogTag } from "../types"

interface BlogFilterBarProps {
  categories: BlogCategory[]
  posts: BlogPost[]
  selectedCategory: string | null
  onSelectCategory: (categorySlug: string | null) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedTag?: string | null
  onSelectTag?: (tagSlug: string | null) => void
  availableTags?: BlogTag[]
  groups?: BlogGroup[]
  selectedGroup?: string | null
  onSelectGroup?: (groupSlug: string | null) => void
  filteredCount: number
  totalCount: number
}

export const BlogFilterBar = ({
  categories,
  posts,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedTag,
  onSelectTag,
  availableTags = [],
  groups = [],
  selectedGroup = null,
  onSelectGroup,
}: BlogFilterBarProps) => {
  // Compute counts for categories
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    counts.all = posts.length

    for (const cat of categories) {
      counts[cat.slug.current] = posts.filter((p) =>
        p.categories.some((c) => c.slug.current === cat.slug.current)
      ).length
    }

    return counts
  }, [categories, posts])

  const selectedCategoryObj = useMemo(
    () => categories.find((c) => c.slug.current === selectedCategory),
    [categories, selectedCategory]
  )

  const selectedGroupObj = useMemo(
    () => groups.find((g) => g.slug.current === selectedGroup),
    [groups, selectedGroup]
  )

  const groupCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const grp of groups) {
      counts[grp.slug.current] = posts.filter(
        (p) => p.group?.slug.current === grp.slug.current
      ).length
    }
    return counts
  }, [groups, posts])

  const selectedTagObj = useMemo(
    () => availableTags.find((t) => t.slug.current === selectedTag),
    [availableTags, selectedTag]
  )

  const hasActiveFilters = Boolean(
    selectedCategory !== null ||
    (selectedTag !== null && selectedTag !== undefined) ||
    selectedGroup !== null ||
    searchQuery.trim() !== ""
  )

  return (
    <div className="flex w-full flex-col gap-3 py-3">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
          <div className="relative flex min-w-[200px] flex-1 items-center sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 size-3.5 text-muted-foreground/70" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search articles..."
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

          <div className="flex items-center gap-3">
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
              <DropdownMenuContent align="start" className="w-52 p-1">
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
                            style={{
                              backgroundColor: cat.color || "var(--pp-primary)",
                            }}
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

            {/* 3. Series Select Dropdown */}
            {groups.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    className={cn(
                      "flex h-8.5 items-center gap-1.5 rounded-sm border px-2.5 text-xs font-medium transition-colors hover:bg-accent focus:outline-none",
                      selectedGroup
                        ? "border-pp-primary/60 bg-pp-primary/10 text-pp-primary"
                        : "border-border/80 bg-background/60 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Bookmark className="size-3.5 shrink-0" />
                    <span className="max-w-[130px] truncate">
                      {selectedGroupObj
                        ? `Series: ${selectedGroupObj.title}`
                        : "Series: All"}
                    </span>
                    <ChevronDown className="size-3 shrink-0 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 p-1">
                  <DropdownMenuItem
                    onClick={() => onSelectGroup?.(null)}
                    className="flex items-center justify-between py-1.5 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {selectedGroup === null && (
                        <Check className="size-3.5 text-pp-primary" />
                      )}
                      <span
                        className={cn(
                          selectedGroup === null &&
                            "pl-0 font-semibold text-pp-primary",
                          selectedGroup !== null && "pl-5.5"
                        )}
                      >
                        All Series
                      </span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {groups.map((grp) => {
                    const count = groupCounts[grp.slug.current] || 0
                    const isSelected = selectedGroup === grp.slug.current

                    return (
                      <DropdownMenuItem
                        key={grp._id}
                        onClick={() => onSelectGroup?.(grp.slug.current)}
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
                            {grp.title}
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
            )}

            {/* 4. Tag Select Dropdown */}
            {availableTags.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    className={cn(
                      "flex h-8.5 items-center gap-1.5 rounded-sm border px-2.5 text-xs font-medium transition-colors hover:bg-accent focus:outline-none",
                      selectedTag
                        ? "border-pp-primary/60 bg-pp-primary/10 text-pp-primary"
                        : "border-border/80 bg-background/60 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Hash className="size-3.5 shrink-0" />
                    <span className="max-w-[120px] truncate">
                      {selectedTagObj ? `#${selectedTagObj.title}` : "Tag: All"}
                    </span>
                    <ChevronDown className="size-3 shrink-0 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 p-1">
                  <DropdownMenuItem
                    onClick={() => onSelectTag?.(null)}
                    className="flex items-center justify-between py-1.5 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {selectedTag === null && (
                        <Check className="size-3.5 text-pp-primary" />
                      )}
                      <span
                        className={cn(
                          selectedTag === null &&
                            "pl-0 font-semibold text-pp-primary",
                          selectedTag !== null && "pl-5.5"
                        )}
                      >
                        All Tags
                      </span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {availableTags.map((tag) => {
                    const isSelected = selectedTag === tag.slug.current
                    return (
                      <DropdownMenuItem
                        key={tag._id}
                        onClick={() => onSelectTag?.(tag.slug.current)}
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
                            #{tag.title}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* 5. Reset Filters Button */}
            {hasActiveFilters && (
              <Button
                type="button"
                onClick={() => {
                  onSelectCategory(null)
                  onSelectGroup?.(null)
                  onSelectTag?.(null)
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
    </div>
  )
}
