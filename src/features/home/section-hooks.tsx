import { HOOKS_DATA, HookTile, HookViewAllTile } from "@/features/hooks"
import type { HookItem } from "@/features/hooks/types"
import { cn } from "@/shared/lib/utils"
import { SectionHeading } from "@/shared/ui/system/section-heading"

const FEATURED_HOOK_SLUGS = [
  "use-disclosure",
  "use-click-outside",
  "use-media-query",
  "use-copy-to-clipboard",
  "use-debounce",
  "use-debounced-callback",
  "use-local-storage",
  "use-toggle",
  "use-intersection-observer",
  "use-previous",
  "use-hover",
  "use-prevent-body-scroll",
  "use-scroll-position",
  "use-pagination",
]

/**
 * Blueprint grid borders for a responsive 1/2/3 column layout that changes
 * shape at container breakpoints, so per-cell borders must switch with them.
 */
function getCellBorderClasses(index: number) {
  const isViewAllSlot = index === FEATURED_HOOK_SLUGS.length

  // Slot 15 (View All) spans the full row in the 2-column layout
  if (isViewAllSlot) {
    return cn(
      "col-span-1 border-b border-border @[540px]:col-span-2 @[540px]:border-b-0 @[860px]:col-span-1"
    )
  }

  return cn(
    "border-b border-border",
    // Two-column (>=540px): right accent on the left column
    index % 2 === 0 && "@[540px]:border-r @[540px]:border-border",
    // Three-column (>=860px): right accent on non-trailing columns
    index % 3 === 2
      ? "@[860px]:border-r-0"
      : "@[860px]:border-r @[860px]:border-border",
    // Last row in the three-column layout: drop the bottom border
    index >= FEATURED_HOOK_SLUGS.length - 2 && "@[860px]:border-b-0"
  )
}

export const SectionHooks = () => {
  const featuredHooks = FEATURED_HOOK_SLUGS.map((slug) =>
    HOOKS_DATA.find((h) => h.slug === slug)
  ).filter((h): h is HookItem => Boolean(h))

  return (
    <section
      id="hooks"
      className="relative flex w-full flex-col bg-background text-foreground"
    >
      <div className="-mt-px border-y border-border">
        <SectionHeading
          id="hooks"
          heading="React Hooks"
          count={HOOKS_DATA.length}
          actionHref="/hooks"
          actionLabel="All hooks"
        />
      </div>

      {/* Technical Spec Grid: 1/2/3 columns driven by container width (not viewport) */}
      <div className="grid w-full auto-rows-fr grid-cols-1 border-b border-border @[540px]:grid-cols-2 @[860px]:grid-cols-3">
        {featuredHooks.map((hook, idx) => (
          <HookTile
            key={hook.id}
            hook={hook}
            index={idx}
            className={getCellBorderClasses(idx)}
          />
        ))}

        {/* Slot 15: View All Hooks */}
        <HookViewAllTile
          totalCount={HOOKS_DATA.length}
          className={getCellBorderClasses(FEATURED_HOOK_SLUGS.length)}
        />
      </div>
    </section>
  )
}

export default SectionHooks
