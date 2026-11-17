import { useNavigate } from "@tanstack/react-router"
import { type ReactNode, useMemo } from "react"

import { BLOCKS_DATA } from "@/features/blocks"
import { BlockCard } from "@/features/blocks/components/block-card"
import { COMPONENTS_DATA } from "@/features/component-ui"
import { ComponentCard } from "@/features/component-ui/components/component-card"
import { HOOKS_DATA } from "@/features/hooks"
import { HookTile } from "@/features/hooks/components/hook-tile"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select"
import {
  BLOCK_CATEGORIES,
  COMPONENT_CATEGORIES,
  HOOK_CATEGORIES,
  VALID_BLOCK_CATEGORY_IDS,
  VALID_COMPONENT_CATEGORY_IDS,
  VALID_HOOK_CATEGORY_IDS,
} from "@/shared/config"

import { getStudioSegmentLabel } from "../model/unified-registry.adapter"

const ALL_CATEGORIES = "all"

interface StudioCatalogGridProps {
  /** Route segment: null → all items; "base"/"blocks"/"hooks" → collection; otherwise category id. */
  segment: string | null
}

function filterBySegment<T extends { category: string }>(
  items: T[],
  segment: string | null
): T[] {
  if (!segment) return items
  if (
    (VALID_COMPONENT_CATEGORY_IDS as readonly string[]).includes(segment) ||
    (VALID_BLOCK_CATEGORY_IDS as readonly string[]).includes(segment) ||
    (VALID_HOOK_CATEGORY_IDS as readonly string[]).includes(segment)
  ) {
    return items.filter((item) => item.category === segment)
  }
  return items
}

type CategoryOption = { id: string; label: string }

/**
 * Master catalog: `max-w-7xl` centered column. At most one section renders
 * per family (Components / Blocks / Hooks) — the section select navigates via
 * the router (URL is the source of truth), it does not filter in memory.
 */
export function StudioCatalogGrid({ segment }: StudioCatalogGridProps) {
  const navigate = useNavigate()

  const isComponentCategory =
    segment !== null &&
    (VALID_COMPONENT_CATEGORY_IDS as readonly string[]).includes(segment)
  const isBlockCategory =
    segment !== null &&
    (VALID_BLOCK_CATEGORY_IDS as readonly string[]).includes(segment)
  const isHookCategory =
    segment !== null &&
    (VALID_HOOK_CATEGORY_IDS as readonly string[]).includes(segment)

  const showComponents = !segment || segment === "base" || isComponentCategory
  const showBlocks = !segment || segment === "blocks" || isBlockCategory
  const showHooks = !segment || segment === "hooks" || isHookCategory

  const componentItems = useMemo(
    () => (showComponents ? filterBySegment(COMPONENTS_DATA, segment) : []),
    [segment, showComponents]
  )
  const blockItems = useMemo(
    () => (showBlocks ? filterBySegment(BLOCKS_DATA, segment) : []),
    [segment, showBlocks]
  )
  const hookItems = useMemo(
    () => (showHooks ? filterBySegment(HOOKS_DATA, segment) : []),
    [segment, showHooks]
  )

  // Select value follows the URL: a category id, or "all" for the family root
  const componentFilter = isComponentCategory ? segment : ALL_CATEGORIES
  const blockFilter = isBlockCategory ? segment : ALL_CATEGORIES
  const hookFilter = isHookCategory ? segment : ALL_CATEGORIES

  const isCategorySegment =
    isComponentCategory || isBlockCategory || isHookCategory
  const sectionTitle = (fallback: string) =>
    isCategorySegment ? getStudioSegmentLabel(segment, fallback) : fallback

  const total = componentItems.length + blockItems.length + hookItems.length

  if (total === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="text-[10px] font-medium tracking-[0.25em] text-muted-foreground/60 uppercase">
          Nothing here yet
        </p>
        <p className="max-w-56 text-sm text-muted-foreground">
          This collection has no entries in the local registry.
        </p>
      </div>
    )
  }

  /** Route to the family root (`all`) or the picked category page. */
  const handleCategorySelect = (
    family: "base" | "blocks" | "hooks",
    value: string
  ) => {
    void navigate({
      to: "/ui/$collection",
      params: { collection: value === ALL_CATEGORIES ? family : value },
    })
  }

  return (
    <div className="h-full w-full overflow-y-auto overscroll-contain">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-8 sm:gap-16 sm:px-6 sm:py-10 lg:px-8">
        {showComponents ? (
          <CatalogSection
            title={sectionTitle("Components")}
            count={componentItems.length}
            filter={
              <CatalogFilterSelect
                label="Filter components by category"
                value={componentFilter}
                onChange={(value) => handleCategorySelect("base", value)}
                options={COMPONENT_CATEGORIES}
              />
            }
          >
            {componentItems.length === 0 ? (
              <CatalogEmptyState label="No components in this category yet." />
            ) : (
              componentItems.map((component) => (
                <ComponentCard key={component.id} component={component} />
              ))
            )}
          </CatalogSection>
        ) : null}

        {showBlocks ? (
          <CatalogSection
            title={sectionTitle("Blocks")}
            count={blockItems.length}
            filter={
              <CatalogFilterSelect
                label="Filter blocks by category"
                value={blockFilter}
                onChange={(value) => handleCategorySelect("blocks", value)}
                options={BLOCK_CATEGORIES}
              />
            }
          >
            {blockItems.length === 0 ? (
              <CatalogEmptyState label="No blocks in this category yet." />
            ) : (
              blockItems.map((block) => (
                <BlockCard key={block.id} block={block} />
              ))
            )}
          </CatalogSection>
        ) : null}

        {showHooks ? (
          <CatalogSection
            title={sectionTitle("React Hooks")}
            count={hookItems.length}
            wide
            filter={
              <CatalogFilterSelect
                label="Filter hooks by category"
                value={hookFilter}
                onChange={(value) => handleCategorySelect("hooks", value)}
                options={HOOK_CATEGORIES}
              />
            }
          >
            {hookItems.length === 0 ? (
              <CatalogEmptyState label="No hooks in this category yet." />
            ) : (
              hookItems.map((hook, index) => (
                <HookTile key={hook.id} hook={hook} index={index} />
              ))
            )}
          </CatalogSection>
        ) : null}
      </div>
    </div>
  )
}

function CatalogSection({
  title,
  count,
  wide = false,
  filter,
  children,
}: {
  title: string
  count: number
  wide?: boolean
  filter?: ReactNode
  children: ReactNode
}) {
  return (
    <section aria-label={title} className="flex flex-col gap-4 sm:gap-5">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border/60 pb-3">
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
        <div className="flex shrink-0 items-center gap-2.5">
          {filter ?? null}
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {String(count).padStart(2, "0")}
          </span>
        </div>
      </div>
      <div
        className={
          wide
            ? "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
            : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {children}
      </div>
    </section>
  )
}

function CatalogFilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: readonly CategoryOption[]
}) {
  // Declared so the trigger can resolve value → label without mounting items
  const items = useMemo(
    () => ({
      [ALL_CATEGORIES]: "All Categories",
      ...Object.fromEntries(options.map((option) => [option.id, option.label])),
    }),
    [options]
  )

  return (
    <Select
      value={value}
      items={items}
      onValueChange={(nextValue) => {
        if (typeof nextValue === "string") onChange(nextValue)
      }}
    >
      <SelectTrigger
        size="sm"
        aria-label={label}
        className="h-8 w-auto gap-1.5 border-border/60 bg-transparent px-2.5 text-[11px] font-medium text-muted-foreground shadow-none transition-colors hover:border-border hover:text-foreground"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_CATEGORIES}>All Categories</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function CatalogEmptyState({ label }: { label: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 px-6 py-12 text-center">
      <p className="text-[10px] font-medium tracking-[0.25em] text-muted-foreground/50 uppercase">
        Nothing here yet
      </p>
      <p className="max-w-56 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
