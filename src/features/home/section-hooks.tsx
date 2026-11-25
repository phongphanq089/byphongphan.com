import { ArrowRightIcon } from "@phosphor-icons/react"
import { Link } from "@tanstack/react-router"
import React from "react"

import { DraftingSectionRow } from "@/app/layouts/drafting-section-row"
import { HOOKS_DATA } from "@/features/hooks"
import { playClickSound, playHoverSound } from "@/shared/lib/sound"
import UnderlineToBackground from "@/shared/ui/animation/underline-to-background"

export interface SectionHooksProps {
  className?: string
}

const CATEGORY_TAG_MAP: Record<string, string> = {
  "ui-interaction": "UI",
  browser: "BROWSER",
  utilities: "UTILITY",
  state: "STATE",
  performance: "PERF",
}

const FEATURED_HOOK_SLUGS = [
  "use-click-outside",
  "use-media-query",
  "use-copy-to-clipboard",
  "use-intersection-observer",
  "use-debounce",
  "use-debounced-callback",
  "use-local-storage",
  "use-toggle",
  "use-previous",
  "use-hover",
  "use-prevent-body-scroll",
  "use-scroll-position",
]

interface HookRowItem {
  id: string
  name: string
  slug: string
  categoryLabel: string
}

/**
 * Section V: Hooks
 *
 * Implements the minimal Swiss Drafting row layout matching Section II (Tech Stack) & home-preview:
 * - Roman Numeral: V
 * - Left rail header with hairline extending right
 * - 528px center column with 12 structured hook items
 * - Left text (index + title), horizontal dotted leader line, right category badge
 * - Simple "All hooks →" button at the end
 */
export function SectionHooks({ className }: SectionHooksProps) {
  const featuredHooks: HookRowItem[] = React.useMemo(() => {
    return FEATURED_HOOK_SLUGS.map((slug) => {
      const item = HOOKS_DATA.find((h) => h.slug === slug)
      if (!item) return null
      return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        categoryLabel:
          CATEGORY_TAG_MAP[item.category] || item.category.toUpperCase(),
      }
    }).filter((item): item is HookRowItem => Boolean(item))
  }, [])

  return (
    <DraftingSectionRow
      id="hooks"
      romanIndex="V"
      title="HOOKS"
      className={className}
    >
      {/* ─── 12-Item Minimal Hook List ─── */}
      <div className="space-y-3 pt-1 select-none">
        {featuredHooks.map((hook, idx) => (
          <Link
            key={hook.slug}
            to="/ui/$collection/$slug"
            params={{ collection: "hooks", slug: hook.slug }}
            onMouseEnter={() => playHoverSound()}
            onClick={() => playClickSound()}
            className="group flex items-center justify-between gap-2 text-xs"
          >
            {/* Left: Index + Hook Name */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="font-mono text-[11px] text-muted-foreground/50 transition-colors group-hover:text-pp-secondary">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-xs font-medium text-foreground/85 transition-colors group-hover:text-pp-secondary">
                {hook.name}
              </span>
            </div>

            {/* Middle: Horizontal Dotted Leader Line */}
            <div className="mx-2 flex-1 border-b border-dotted border-border/70 transition-colors group-hover:border-foreground/30" />

            {/* Right: Category Outline Pill */}
            <span className="rounded-xs border border-border/70 bg-card/40 px-2 py-0.5 font-mono text-[9px] tracking-wider text-muted-foreground transition-colors group-hover:border-foreground/30 group-hover:text-foreground">
              {hook.categoryLabel}
            </span>
          </Link>
        ))}

        {/* ─── Bottom View Button: [ All hooks ] → ─── */}
        <div className="flex justify-end pt-3">
          <Link
            to="/ui/$collection"
            params={{ collection: "hooks" }}
            onMouseEnter={() => playHoverSound()}
            onClick={() => playClickSound()}
          >
            <UnderlineToBackground
              targetTextColor="var(--background)"
              className="font-medium whitespace-nowrap text-foreground/80 transition-colors group-hover:text-foreground"
            >
              <span className="flex items-center gap-2">
                All hooks
                <ArrowRightIcon size={18} />
              </span>
            </UnderlineToBackground>
          </Link>
        </div>
      </div>
    </DraftingSectionRow>
  )
}

export default SectionHooks
