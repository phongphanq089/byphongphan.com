import { Link } from "@tanstack/react-router"
import React from "react"

import { GridContainer } from "@/app/layouts"
import { HOOKS_DATA } from "@/features/hooks/hooks-data"
import type { HookItem } from "@/features/hooks/types"
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
  "use-selection",
]

export const SectionHooks = () => {
  const featuredHooks = React.useMemo(() => {
    const featured = FEATURED_HOOK_SLUGS.map((slug) =>
      HOOKS_DATA.find((h) => h.slug === slug)
    ).filter((h): h is HookItem => Boolean(h))

    return featured.length >= 15
      ? featured.slice(0, 15)
      : HOOKS_DATA.slice(0, 15)
  }, [])

  return (
    <>
      <GridContainer className="p-0" showCrosshairs={false}>
        <SectionHeading
          id="hooks"
          heading="React Hooks"
          count={HOOKS_DATA.length}
          actionHref="/hooks"
          actionLabel="All hooks"
        />
      </GridContainer>

      {/* Minimal Grid: 3 columns on desktop, 2 columns on mobile */}
      <GridContainer
        columns={3}
        mobileColumns={2}
        borderTop={false}
        borderBottom={false}
        showCrosshairs={true}
        className="w-full"
      >
        {featuredHooks.map((hook) => (
          <Link
            key={hook.id}
            to="/hooks/$category/$slug"
            params={{ category: hook.category, slug: hook.slug }}
            className="group relative flex min-h-[62px] w-full items-center bg-background px-4 py-4 transition-colors duration-150 hover:bg-muted/30 sm:min-h-[72px] sm:px-6 sm:py-5 md:min-h-[80px] md:px-8 md:py-6 dark:hover:bg-zinc-900/40"
          >
            <span className="truncate text-xs font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-sm md:text-base">
              {hook.name}
            </span>
          </Link>
        ))}
      </GridContainer>
    </>
  )
}

export default SectionHooks
