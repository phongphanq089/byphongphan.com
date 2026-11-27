import { FolderTree, Hash, RotateCcw, Search, X } from "lucide-react"

import {
  Badge,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/shared/ui"

import type { TaxonomyTab } from "../types"

interface TaxonomyToolbarProps {
  activeTab: TaxonomyTab
  categoriesCount: number
  tagsCount: number
  search: string
  onTabChange: (tab: TaxonomyTab) => void
  onSearchChange: (search: string) => void
}

export function TaxonomyToolbar({
  activeTab,
  categoriesCount,
  tagsCount,
  search,
  onTabChange,
  onSearchChange,
}: TaxonomyToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border/70 px-5 pt-5 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <Tabs
        value={activeTab}
        onValueChange={(value) => onTabChange(value as TaxonomyTab)}
        className="w-full sm:w-auto"
      >
        <TabsList
          variant="line"
          className="h-auto w-full flex-wrap gap-1 sm:h-9 sm:w-auto sm:flex-nowrap sm:gap-2"
        >
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
          <TabsTrigger
            value="tags"
            className="flex-none px-2.5 py-1.5 text-xs sm:py-1 sm:text-sm"
          >
            <Hash className="size-3.5" />
            <span>Tags</span>
            <Badge
              variant="subtle"
              size="xs"
              shape="pill"
              className="font-mono tabular-nums"
            >
              {tagsCount}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2 sm:w-80 lg:w-96">
        <InputGroup className="h-8 flex-1">
          <InputGroupAddon align="inline-start">
            <Search className="size-3.5 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              activeTab === "categories"
                ? "Search categories by name, slug..."
                : "Search tags by #title, slug..."
            }
            aria-label="Search taxonomy"
            className="text-xs md:text-xs"
          />
          {search && (
            <InputGroupAddon align="inline-end">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
              >
                <X className="size-3" />
              </Button>
            </InputGroupAddon>
          )}
        </InputGroup>

        {search.trim() !== "" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onSearchChange("")}
            className="h-8 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}
