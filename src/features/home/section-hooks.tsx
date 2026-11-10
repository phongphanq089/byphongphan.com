import { Link } from "@tanstack/react-router"
import React from "react"

import { HOOKS_DATA } from "@/features/hooks/hooks-data"
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

      {/* Minimal Grid: 3 columns on desktop, 2 columns on mobile */}
      <div className="grid w-full grid-cols-2 border-b border-border md:grid-cols-3">
        {featuredHooks.map((hook, idx) => (
          <Link
            key={hook.id}
            to="/hooks/$category/$slug"
            params={{ category: hook.category, slug: hook.slug }}
            className={cn(
              "group relative flex min-h-[62px] w-full items-center border-b border-border bg-background px-4 py-4 transition-colors duration-150 hover:bg-muted/30 sm:min-h-[72px] sm:px-6 sm:py-5 md:min-h-[80px] md:px-8 md:py-6 dark:hover:bg-zinc-900/40",
              idx % 2 === 0 ? "border-r md:border-r-0" : "",
              idx % 3 !== 2 ? "md:border-r md:border-border" : ""
            )}
          >
            <span className="truncate text-xs font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-sm md:text-base">
              {hook.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default SectionHooks
