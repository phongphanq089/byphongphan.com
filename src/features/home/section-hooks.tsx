import React from "react"

import { GridContainer } from "@/app/layouts"
import { HookCard } from "@/features/hooks/components/hook-card"
import { HOOKS_DATA } from "@/features/hooks/hooks-data"
import type { HookItem } from "@/features/hooks/types"
import { SectionHeading } from "@/shared/ui/system/section-heading"

const FEATURED_HOOK_SLUGS = [
  "use-disclosure",
  "use-debounced-callback",
  "use-selection",
  "use-pagination",
  "use-list-state",
  "use-state-history",
]

export const SectionHooks = () => {
  const featuredHooks = React.useMemo(() => {
    const featured = FEATURED_HOOK_SLUGS.map((slug) =>
      HOOKS_DATA.find((h) => h.slug === slug)
    ).filter((h): h is HookItem => Boolean(h))

    return featured.length >= 6 ? featured.slice(0, 6) : HOOKS_DATA.slice(0, 6)
  }, [])

  const row1 = featuredHooks.slice(0, 3)
  const row2 = featuredHooks.slice(3, 6)

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

      {/* Row 1: 3-Column Grid */}
      <GridContainer
        columns={3}
        borderTop={false}
        borderBottom={true}
        showCrosshairs={true}
        className="w-full"
      >
        {row1.map((hook, idx) => (
          <div
            key={hook.id}
            className={`flex h-full w-full p-4 sm:p-5 md:p-5 lg:p-6 ${
              idx < 2 ? "border-b border-border md:border-b-0" : ""
            }`}
          >
            <HookCard hook={hook} />
          </div>
        ))}
      </GridContainer>

      {/* Row 2: 3-Column Grid */}
      {row2.length > 0 && (
        <GridContainer
          columns={3}
          borderTop={false}
          borderBottom={true}
          showCrosshairs={true}
          className="w-full"
        >
          {row2.map((hook, idx) => (
            <div
              key={hook.id}
              className={`flex h-full w-full p-4 sm:p-5 md:p-5 lg:p-6 ${
                idx < 2 ? "border-b border-border md:border-b-0" : ""
              }`}
            >
              <HookCard hook={hook} />
            </div>
          ))}
          {row2.length === 2 && (
            <div className="hidden h-full w-full items-center justify-center p-4 sm:p-5 md:p-5 lg:flex lg:p-6">
              <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 p-8 text-center">
                <span className="text-[10px] tracking-widest text-muted-foreground/40 uppercase">
                  More Hooks in Registry
                </span>
              </div>
            </div>
          )}
        </GridContainer>
      )}
    </>
  )
}

export default SectionHooks
