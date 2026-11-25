import { ArrowLeftIcon } from "@phosphor-icons/react"
import { Link, useNavigate } from "@tanstack/react-router"
import { motion } from "motion/react"
import { type ReactNode, useId, useMemo } from "react"

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
import TextBurnNeon from "@/shared/ui/animation/text-burn-neon"
import { ArchitecturalSpine } from "@/shared/ui/system/architectural-spine"

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

  const romanSections = useMemo(() => {
    const numerals = ["I", "II", "III"] as const
    const active: string[] = []
    if (showComponents) active.push("components")
    if (showBlocks) active.push("blocks")
    if (showHooks) active.push("hooks")
    return Object.fromEntries(
      active.map((key, idx) => [key, numerals[idx] ?? String(idx + 1)])
    ) as Record<string, string>
  }, [showComponents, showBlocks, showHooks])

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
    <div className="relative h-full w-full overflow-y-auto overscroll-contain">
      <div className="relative mx-auto min-h-full w-full max-w-[1360px]">
        {/* Continuous 6-hairline architectural spine matching Home, scaled wider for /ui */}
        <ArchitecturalSpine
          maxWidthClassName="max-w-[1360px]"
          leftRailWidth={224}
          gutterWidth={40}
          rightRailWidth={48}
          className="z-10"
        />

        <div className="relative z-20 flex flex-col gap-8 px-4 pt-18 pb-10 sm:gap-11 sm:px-6 sm:pt-20 sm:pb-12">
          {segment ? (
            <div className="relative flex w-full items-center">
              <div
                className="hidden w-[224px] shrink-0 lg:block"
                aria-hidden="true"
              />
              <div
                className="hidden w-[40px] shrink-0 lg:block"
                aria-hidden="true"
              />
              <div className="flex min-w-0 flex-1 items-center lg:px-5">
                <div className="flex w-full items-center justify-between gap-4 border-b border-border/60 pb-3">
                  <Link
                    to="/ui"
                    onClick={() => playClickSound()}
                    onMouseEnter={() => playHoverSound()}
                    className="group inline-flex items-center gap-2 font-mono text-xs tracking-wide text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  >
                    <ArrowLeftIcon
                      size={14}
                      className="transition-transform duration-200 group-hover:-translate-x-0.5"
                      aria-hidden="true"
                    />
                    <span>All items</span>
                  </Link>
                  <span className="font-mono text-[11px] tracking-wider text-muted-foreground/75 uppercase tabular-nums">
                    {getStudioSegmentLabel(segment, segment)} ·{" "}
                    {String(total).padStart(2, "0")}
                  </span>
                </div>
              </div>
              <div
                className="hidden w-[88px] shrink-0 lg:block"
                aria-hidden="true"
              />
            </div>
          ) : null}

          {showComponents ? (
            <CatalogSection
              romanIndex={romanSections.components ?? "I"}
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
              romanIndex={romanSections.blocks ?? "II"}
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
              romanIndex={romanSections.hooks ?? "III"}
              title={sectionTitle("React Hooks")}
              count={hookItems.length}
              variant="block"
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
                <div className="flex flex-col divide-y divide-border/50 border-y border-border/70 bg-transparent">
                  {hookItems.map((hook, index) => (
                    <HookTile key={hook.id} hook={hook} index={index} />
                  ))}
                </div>
              )}
            </CatalogSection>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function CatalogSection({
  romanIndex,
  title,
  count,
  wide = false,
  variant = "grid",
  filter,
  children,
}: {
  romanIndex: string
  title: string
  count: number
  wide?: boolean
  variant?: "grid" | "block"
  filter?: ReactNode
  children: ReactNode
}) {
  return (
    <section
      aria-label={title}
      className="relative flex w-full flex-col lg:flex-row lg:items-start"
    >
      {/* Track 1: Left rail column (224px) matching Home DraftingSectionRow */}
      <div className="mb-4 flex w-full flex-col items-start pr-0 lg:mb-0 lg:w-[224px] lg:shrink-0 lg:items-end lg:pr-6">
        <div className="hidden w-full items-center gap-2 pl-6 font-mono text-xs select-none lg:mt-2 lg:flex">
          <span className="font-serif text-lg font-medium text-pp-secondary italic">
            {romanIndex}
          </span>
          <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            <TextBurnNeon>{title}</TextBurnNeon>
          </span>
          <div className="ml-2 flex-1 border-b border-border" />
        </div>
      </div>

      {/* Track 2: Left 40px gutter channel spacer */}
      <div className="hidden w-[40px] shrink-0 lg:block" aria-hidden="true" />

      {/* Track 3: Expanded center content column */}
      <div className="flex min-w-0 flex-1 flex-col gap-5 sm:gap-6 lg:px-5">
        {/* Mobile Section Header (visible below lg) */}
        <div className="flex items-center gap-2 font-mono text-xs select-none lg:hidden">
          <span className="font-serif text-lg font-medium text-pp-secondary italic">
            {romanIndex}
          </span>
          <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            <TextBurnNeon>{title}</TextBurnNeon>
          </span>
          <div className="ml-2 flex-1 border-b border-border" />
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            ({String(count).padStart(2, "0")})
          </span>
        </div>

        {/* Architectural underline filter tabs + count */}
        <div className="flex items-end justify-between gap-4 border-b border-border/60">
          {filter ? (
            <div className="no-scrollbar min-w-0 flex-1 overflow-x-auto">
              {filter}
            </div>
          ) : null}
          <span className="hidden shrink-0 pb-2.5 font-mono text-[11px] tracking-wider text-muted-foreground/70 uppercase tabular-nums lg:inline">
            {String(count).padStart(2, "0")} items
          </span>
        </div>

        {variant === "block" ? (
          children
        ) : (
          <div
            className={
              wide
                ? "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
                : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6"
            }
          >
            {children}
          </div>
        )}
      </div>

      {/* Track 4 & 5: Right gutter (40px) + right rail (48px) spacer */}
      <div className="hidden w-[88px] shrink-0 lg:block" aria-hidden="true" />
    </section>
  )
}

/**
 * Architectural hairline category tabs aligned directly on the grid baseline.
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
  const indicatorId = useId()
  const allOptions = useMemo(
    () => [{ id: ALL_CATEGORIES, label: "All" }, ...options],
    [options]
  )

  return (
    <div
      role="tablist"
      aria-label="Category filters"
      className="flex items-center gap-1"
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
              "shrink-0 cursor-pointer px-2.5 text-[13px] tracking-tight whitespace-nowrap transition-colors outline-none select-none first:pl-0",
              "focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-primary",
              isActive
                ? "font-semibold text-foreground"
                : "font-medium text-muted-foreground/75 hover:text-foreground"
            )}
          >
            <span className="relative inline-block pt-1 pb-2.5">
              {option.label}
              {isActive ? (
                <motion.span
                  layoutId={indicatorId}
                  transition={{ type: "spring", stiffness: 450, damping: 36 }}
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-[2px] bg-pp-secondary"
                />
              ) : null}
            </span>
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
