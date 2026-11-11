import { Link } from "@tanstack/react-router"
import { ArrowUpRight } from "lucide-react"
import type { CSSProperties } from "react"

import { cn } from "@/shared/lib/utils"

import type { HookItem } from "../types"
import { CATEGORY_THEMES, DEFAULT_THEME } from "./hook-card"

export interface HookTileProps {
  hook: HookItem
  /** 0-based position in the featured grid (rendered as a zero-padded index) */
  index: number
  className?: string
}

/**
 * Compact "technical spec" micro-tile for the homepage hooks grid.
 * Blueprint aesthetic: index marker, category gel dot, mono title,
 * single-line description, and a left hairline accent that lights up on hover.
 */
export function HookTile({ hook, index, className }: HookTileProps) {
  const theme = CATEGORY_THEMES[hook.category] ?? DEFAULT_THEME
  const splitPrefix = /^use[A-Z]/.test(hook.name)

  return (
    <Link
      to="/hooks/$category/$slug"
      params={{ category: hook.category, slug: hook.slug }}
      style={{ "--accent": theme.accent } as CSSProperties}
      className={cn(
        "group relative flex h-full min-h-[96px] w-full flex-col justify-between gap-2 overflow-hidden p-4 transition-colors duration-200 outline-none sm:min-h-[104px] sm:p-5",
        "hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-inset dark:hover:bg-zinc-900/50",
        className
      )}
    >
      {/* Left accent hairline: hidden at idle, scales in with the category color on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[2px] origin-center scale-y-0 bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] transition-transform duration-300 ease-out group-hover:scale-y-100"
      />

      {/* Top header: index, category gel dot, status badge, action arrow */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="font-mono text-[10px] font-medium text-muted-foreground/60 select-none">
            [{String(index + 1).padStart(2, "0")}]
          </span>
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rounded-full"
            style={{
              backgroundColor: theme.accent,
              boxShadow: `0 0 6px color-mix(in oklab, ${theme.accent} 60%, transparent)`,
            }}
          />
          <span className="truncate font-mono text-[9px] font-medium tracking-[0.14em] text-muted-foreground/70 uppercase">
            {theme.label}
          </span>
          {hook.isNew ? (
            <span className="shrink-0 rounded border border-primary/40 bg-primary/10 px-1 py-0.5 font-mono text-[8px] font-semibold tracking-widest text-primary uppercase">
              New
            </span>
          ) : hook.isUpdated ? (
            <span className="shrink-0 rounded border border-border bg-muted/50 px-1 py-0.5 font-mono text-[8px] font-semibold tracking-widest text-muted-foreground uppercase">
              Upd
            </span>
          ) : null}
        </div>
        <ArrowUpRight
          aria-hidden="true"
          className="size-3.5 shrink-0 text-muted-foreground/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--accent)]"
        />
      </div>

      {/* Title: dimmed `use` prefix + bold remainder, syntax-highlight feel */}
      <h3 className="font-mono text-sm leading-tight font-semibold tracking-tight text-foreground transition-colors duration-200 group-hover:text-[var(--accent)]">
        {splitPrefix ? (
          <>
            <span className="text-muted-foreground/50">use</span>
            {hook.name.slice(3)}
          </>
        ) : (
          hook.name
        )}
      </h3>

      {/* Single-line description */}
      <p className="line-clamp-1 text-[11px] leading-snug text-muted-foreground">
        {hook.description}
      </p>

      {/* Bottom-right CAD crosshair marker */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-1.5 bottom-1 font-mono text-[10px] leading-none text-muted-foreground/30 transition-colors duration-200 select-none group-hover:text-[var(--accent)]"
      >
        +
      </span>
    </Link>
  )
}
