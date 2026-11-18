import { Link, useNavigate } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { type ReactNode, useMemo } from "react"

import { BLOCKS_DATA } from "@/features/blocks"
import { BlockCard } from "@/features/blocks/components/block-card"
import { COMPONENTS_DATA } from "@/features/component-ui"
import { ComponentCard } from "@/features/component-ui/components/component-card"
import { HOOKS_DATA } from "@/features/hooks"
import { HookTile } from "@/features/hooks/components/hook-tile"
import {
  BLOCK_CATEGORIES,
  COMPONENT_CATEGORIES,
  HOOK_CATEGORIES,
  VALID_BLOCK_CATEGORY_IDS,
  VALID_COMPONENT_CATEGORY_IDS,
  VALID_HOOK_CATEGORY_IDS,
} from "@/shared/config"
import { playClickSound, playHoverSound } from "@/shared/lib/sound"
import { cn } from "@/shared/lib/utils"

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
 * Master catalog: `max-w-7xl` centered column.
 * Uses horizontal pill filter chips for tactile, modern category switching.
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

  // Filter value follows the URL: a category id, or "all" for the family root
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
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:gap-14 sm:px-6 sm:py-10 lg:px-8">
        {segment ? (
          <div className="-mb-4 flex items-center justify-between border-b border-border/40 pb-3.5">
            <Link
              to="/ui"
              onClick={() => playClickSound()}
              onMouseEnter={() => playHoverSound()}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-95"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              <span>Back to all items</span>
            </Link>
            <span className="font-mono text-xs text-muted-foreground">
              {total} item{total !== 1 ? "s" : ""}
            </span>
          </div>
        ) : null}

        {showComponents ? (
          <CatalogSection
            title={sectionTitle("Components")}
            count={componentItems.length}
            filter={
              <CatalogFilterPills
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
              <CatalogFilterPills
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
              <CatalogFilterPills
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
    <section aria-label={title} className="flex flex-col gap-5 sm:gap-6">
      <div className="flex flex-col gap-3.5 border-b border-border/60 pb-3.5 sm:gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h2>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {String(count).padStart(2, "0")}
          </span>
        </div>
        {filter ? (
          <div className="no-scrollbar w-full overflow-x-auto py-0.5">
            {filter}
          </div>
        ) : null}
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

/**
 * Tactile, horizontal pill chips for category navigation (matching modern UI spec).
 */
function CatalogFilterPills({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (value: string) => void
  options: readonly CategoryOption[]
}) {
  const allOptions = useMemo(
    () => [{ id: ALL_CATEGORIES, label: "All" }, ...options],
    [options]
  )

  return (
    <div
      role="tablist"
      aria-label="Category filters"
      className="-my-1 no-scrollbar flex items-center gap-1.5 overflow-x-auto scroll-smooth py-1 sm:gap-2"
    >
      {allOptions.map((option) => {
        const isActive = value === option.id
        return (
          <button
            key={option.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onMouseEnter={() => playHoverSound()}
            onClick={() => {
              playClickSound()
              onChange(option.id)
            }}
            className={cn(
              "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full px-3.5 py-1.5 text-xs font-medium tracking-normal transition-all duration-150 active:scale-95",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
              isActive
                ? "bg-foreground font-semibold text-background shadow-xs"
                : "border border-border/50 bg-muted/70 text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
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
