import { Link } from "@tanstack/react-router"
import { ArrowUpRight } from "lucide-react"

import { playClickSound, playHoverSound } from "@/shared/lib/sound"
import { cn } from "@/shared/lib/utils"

import type { HookItem } from "../types"

const CATEGORY_TAG_MAP: Record<string, string> = {
  "ui-interaction": "UI",
  browser: "BROWSER",
  utilities: "UTILITY",
  state: "STATE",
  performance: "PERF",
}

export interface HookTileProps {
  hook: HookItem
  /** 0-based position in the hooks list (rendered as a zero-padded index) */
  index: number
  className?: string
}

/**
 * Refined single-column monochrome row item for the /ui hooks catalog,
 * matching Section V (Hooks) on the homepage with a subtle description line.
 */
export function HookTile({ hook, index, className }: HookTileProps) {
  const categoryLabel =
    CATEGORY_TAG_MAP[hook.category] ?? hook.category.toUpperCase()

  return (
    <Link
      to="/ui/$collection/$slug"
      params={{ collection: hook.category, slug: hook.slug }}
      onMouseEnter={() => playHoverSound()}
      onClick={() => playClickSound()}
      className={cn(
        "group flex w-full flex-col gap-1 px-1 py-3.5 text-xs transition-colors outline-none select-none sm:px-2 sm:py-4",
        "hover:bg-muted/30 focus-visible:ring-1 focus-visible:ring-border",
        className
      )}
    >
      {/* Primary line: index + hook name + dotted leader + category pill + arrow */}
      <div className="flex w-full items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <span className="w-5 shrink-0 font-mono text-[11px] text-muted-foreground/45 transition-colors group-hover:text-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="truncate font-mono text-xs font-medium text-foreground/90 transition-colors group-hover:text-foreground sm:text-[13px]">
            {hook.name}
          </span>
        </div>

        {/* Horizontal Dotted Leader Line */}
        <div className="mx-1 min-w-4 flex-1 border-b border-dotted border-border/60 transition-colors group-hover:border-foreground/30 sm:mx-2" />

        {/* Right: Monochrome Category Outline Pill + Arrow */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-xs border border-border/70 bg-transparent px-2 py-0.5 font-mono text-[9px] tracking-wider text-muted-foreground transition-colors group-hover:border-foreground/30 group-hover:text-foreground">
            {categoryLabel}
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-3.5 text-muted-foreground/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
          />
        </div>
      </div>

      {/* Secondary line: clean description aligned under hook name */}
      <p className="line-clamp-1 pl-8 text-[11px] leading-relaxed text-muted-foreground/75 transition-colors group-hover:text-muted-foreground sm:pl-9 sm:text-xs">
        {hook.description}
      </p>
    </Link>
  )
}
