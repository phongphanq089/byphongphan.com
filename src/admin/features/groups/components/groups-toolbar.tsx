import { RotateCcw, Search, X } from "lucide-react"

import { AdminViewModeToggle } from "@/admin"
import {
  Badge,
  Button,
  Checkbox,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/shared/ui"

import type {
  AdminGroupWithPosts,
  GroupCompletionFilter,
  GroupsFilterState,
  GroupsViewMode,
} from "../types"

interface GroupsToolbarProps {
  groups: AdminGroupWithPosts[]
  filters: GroupsFilterState
  viewMode: GroupsViewMode
  hasActiveFilters: boolean
  isAllPageSelected: boolean
  isSomePageSelected: boolean
  onToggleSelectAllPage: () => void
  onFiltersChange: (next: Partial<GroupsFilterState>) => void
  onViewModeChange: (mode: GroupsViewMode) => void
  onResetFilters: () => void
}

export function GroupsToolbar({
  groups,
  filters,
  viewMode,
  hasActiveFilters,
  isAllPageSelected,
  isSomePageSelected,
  onToggleSelectAllPage,
  onFiltersChange,
  onViewModeChange,
  onResetFilters,
}: GroupsToolbarProps) {
  const counts: Record<GroupCompletionFilter, number> = {
    all: groups.length,
    ongoing: groups.filter((g) => !g.isCompleted).length,
    completed: groups.filter((g) => g.isCompleted).length,
  }

  return (
    <div className="flex flex-col gap-3 border-b border-border/70 px-5 pt-5 pb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={filters.completion}
          onValueChange={(value) =>
            onFiltersChange({
              completion: value as GroupCompletionFilter,
            })
          }
          className="w-full sm:w-auto"
        >
          <TabsList
            variant="line"
            className="h-auto w-full flex-wrap gap-1 sm:h-9 sm:w-auto sm:flex-nowrap sm:gap-2"
          >
            {(
              [
                { value: "all", label: "All Series" },
                { value: "ongoing", label: "In Progress" },
                { value: "completed", label: "Completed" },
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
                  {counts[tab.value]}
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
                aria-label="Select all series on current page"
                className="inline-flex items-center justify-center"
              />
              <span>Select all</span>
            </label>
          )}

          <AdminViewModeToggle value={viewMode} onChange={onViewModeChange} />
        </div>
      </div>

      {/* Search Row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <InputGroup className="h-8 flex-1">
          <InputGroupAddon align="inline-start">
            <Search className="size-3.5 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            placeholder="Search series by title, slug, or description..."
            aria-label="Search series"
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
  )
}
