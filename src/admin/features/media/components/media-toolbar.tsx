import { FolderOpen, RotateCcw, Search, X } from "lucide-react"

import { AdminViewModeToggle } from "@/admin"
import {
  Badge,
  Button,
  Checkbox,
  Input,
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui"

import type {
  MediaFilterState,
  MediaFolder,
  MediaTab,
  MediaViewMode,
} from "../types"
import { MEDIA_FOLDER_LABELS } from "../utils"

interface MediaToolbarProps {
  filters: MediaFilterState
  viewMode: MediaViewMode
  counts: Record<MediaTab, number>
  isAllPageSelected: boolean
  isSomePageSelected: boolean
  onToggleSelectAllPage: () => void
  onFiltersChange: (next: MediaFilterState) => void
  onViewModeChange: (mode: MediaViewMode) => void
  onReset: () => void
}

const TAB_ITEMS: { value: MediaTab; label: string }[] = [
  { value: "all", label: "All Media" },
  { value: "image", label: "Images" },
  { value: "video", label: "Videos" },
  { value: "audio", label: "Audio" },
]

export function MediaToolbar({
  filters,
  viewMode,
  counts,
  isAllPageSelected,
  isSomePageSelected,
  onToggleSelectAllPage,
  onFiltersChange,
  onViewModeChange,
  onReset,
}: MediaToolbarProps) {
  const hasActiveFilters =
    filters.search.trim().length > 0 || filters.folder !== "all"

  return (
    <div className="flex flex-col gap-3 border-b border-border/70 px-4 py-3.5 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {TAB_ITEMS.map((tab) => {
            const isActive = filters.tab === tab.value
            return (
              <Button
                key={tab.value}
                type="button"
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onFiltersChange({ ...filters, tab: tab.value })}
                className="h-8 gap-1.5 px-2.5 text-xs"
              >
                <span>{tab.label}</span>
                <Badge
                  variant={isActive ? "outline" : "secondary"}
                  className="h-4 min-w-4 px-1 text-[10px] tabular-nums"
                >
                  {counts[tab.value]}
                </Badge>
              </Button>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          {viewMode === "grid" && (
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border/70 bg-background px-2.5 py-1.5 text-xs text-muted-foreground select-none hover:text-foreground">
              <span className="inline-flex items-center justify-center">
                <Checkbox
                  checked={isAllPageSelected}
                  indeterminate={isSomePageSelected && !isAllPageSelected}
                  onCheckedChange={onToggleSelectAllPage}
                  aria-label="Select all media items on current page"
                />
              </span>
              <span>Select all</span>
            </label>
          )}
          <AdminViewModeToggle value={viewMode} onChange={onViewModeChange} />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            placeholder="Search by title, filename, MIME type, or alt text..."
            className="h-9 pr-8 pl-8 text-xs"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFiltersChange({ ...filters, search: "" })}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.folder}
            onValueChange={(val) => {
              if (val) {
                onFiltersChange({
                  ...filters,
                  folder: val as "all" | MediaFolder,
                })
              }
            }}
          >
            <SelectTrigger className="h-9 w-auto min-w-40 text-xs">
              <SelectValue>
                <span className="inline-flex items-center gap-1.5">
                  <FolderOpen className="size-3.5 text-muted-foreground" />
                  <span>
                    {filters.folder === "all"
                      ? "All Folders"
                      : MEDIA_FOLDER_LABELS[filters.folder]}
                  </span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectPopup>
              <SelectItem value="all">All Folders</SelectItem>
              {(
                Object.entries(MEDIA_FOLDER_LABELS) as [MediaFolder, string][]
              ).map(([folder, label]) => (
                <SelectItem key={folder} value={folder}>
                  {label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 gap-1.5 px-2.5 text-xs text-muted-foreground"
              onClick={onReset}
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
