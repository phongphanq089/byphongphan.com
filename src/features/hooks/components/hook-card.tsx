import { Link } from "@tanstack/react-router"
import { Check, Copy } from "lucide-react"
import { usePostHog } from "posthog-js/react"
import {
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
  useState,
} from "react"

import { RenderHookSchematic } from "@/registry/schematics"
import { cn } from "@/shared/lib/utils"
import {
  Badge,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/core"

import type { HookItem } from "../types"

interface HookCardProps {
  hook: HookItem
}

export interface CategoryTheme {
  accent: string
  label: string
}

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  state: {
    accent: "#a855f7",
    label: "State",
  },
  "ui-interaction": {
    accent: "#06b6d4",
    label: "UI & Interaction",
  },
  browser: {
    accent: "#3b82f6",
    label: "Browser",
  },
  performance: {
    accent: "#10b981",
    label: "Performance",
  },
  utilities: {
    accent: "#f43f5e",
    label: "Utilities",
  },
}

export const DEFAULT_THEME: CategoryTheme = {
  accent: "#8b5cf6",
  label: "Hook",
}

// Masks an element down to a 1px ring so its background becomes a gradient border.
const RING_MASK: CSSProperties = {
  padding: 1,
  WebkitMask:
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
}

function CategoryGelTile({ accent }: { accent: string }) {
  return (
    <span
      aria-hidden
      className="relative block size-[14px] shrink-0 rounded-[4px]"
      style={{
        background: `radial-gradient(130% 130% at 28% 22%, color-mix(in oklab, ${accent} 55%, white) 0%, color-mix(in oklab, ${accent} 70%, white) 36%, color-mix(in oklab, ${accent} 90%, white) 66%, color-mix(in oklab, ${accent} 95%, black) 100%)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 1px color-mix(in oklab, ${accent} 50%, black), 0 0 10px color-mix(in oklab, ${accent} 35%, transparent), 0 2px 6px rgba(0,0,0,0.35)`,
      }}
    />
  )
}

export function HookCard({ hook }: HookCardProps) {
  const [copied, setCopied] = useState(false)
  const posthog = usePostHog()
  const theme = CATEGORY_THEMES[hook.category] ?? DEFAULT_THEME

  const handleCopy = (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hook.name)
      posthog.capture("hook_name_copied", {
        hook_category: hook.category,
        hook_slug: hook.slug,
      })
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Cursor spotlight via CSS variables without React re-rendering on pointer move.
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty(
      "--spot-x",
      `${event.clientX - rect.left}px`
    )
    event.currentTarget.style.setProperty(
      "--spot-y",
      `${event.clientY - rect.top}px`
    )
  }

  // Specular top-corner light gradient for the 1px ring border
  const borderLight = `radial-gradient(65% 42% at 0% 0%, color-mix(in oklab, var(--accent) 70%, transparent) 0%, color-mix(in oklab, var(--accent) 30%, transparent) 45%, transparent 100%)`

  return (
    <article
      onPointerMove={onPointerMove}
      style={{ "--accent": theme.accent } as CSSProperties}
      className={cn(
        "group/card relative isolate flex h-full w-full flex-col overflow-hidden rounded-lg p-4 transition-all duration-300 sm:p-5",
        // Theme tokens for layered glow and hairlines
        "[--hook-dot:rgba(0,0,0,0.05)] [--hook-edge-bottom:rgba(0,0,0,0.06)] [--hook-edge-top:rgba(0,0,0,0.12)] [--hook-orb:rgba(0,0,0,0.035)]",
        "dark:[--hook-dot:rgba(255,255,255,0.04)] dark:[--hook-edge-bottom:rgba(255,255,255,0.02)] dark:[--hook-edge-top:rgba(255,255,255,0.09)] dark:[--hook-orb:rgba(255,255,255,0.03)]",
        // Card background and elevation
        "bg-white/90 text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.05),0_12px_28px_-12px_rgba(0,0,0,0.08)]",
        "dark:bg-[linear-gradient(180deg,#16161a_0%,#101014_100%)] dark:shadow-[0_0_0_1px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.03),0_20px_40px_-20px_rgba(0,0,0,0.8)]",
        "hover:-translate-y-1 hover:shadow-xl"
      )}
    >
      {/* 1. Accent wash across the top weighted to the left */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{
          background:
            "radial-gradient(85% 130px at 16% 0%, color-mix(in oklab, var(--accent) 26%, transparent) 0%, color-mix(in oklab, var(--accent) 8%, transparent) 50%, transparent 100%)",
        }}
      />

      {/* 2. Halftone micro-dots pattern inside the glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--hook-dot) 0.75px, transparent 1.1px)",
          backgroundSize: "3.5px 3.5px",
          WebkitMaskImage:
            "radial-gradient(60% 35% at 0% 0%, #000, transparent 80%)",
          maskImage: "radial-gradient(60% 35% at 0% 0%, #000, transparent 80%)",
        }}
      />

      {/* 3. Cursor spotlight following mouse coordinates without re-renders */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 0%), color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%)",
        }}
      />

      {/* 4. Half-lit geometric orb in the background */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-3 -right-3 -z-10 aspect-square w-24 rounded-full border border-[var(--hook-orb)] opacity-40 transition-transform duration-500 group-hover/card:scale-110"
        style={{
          background:
            "linear-gradient(90deg, var(--hook-orb), color-mix(in oklab, var(--hook-orb) 50%, transparent) 50%, transparent 50%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-80 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{
          ...RING_MASK,
          background: `${borderLight}, linear-gradient(180deg, var(--hook-edge-top), var(--hook-edge-bottom))`,
        }}
      />

      <Link
        to="/hooks/$category/$slug"
        params={{ category: hook.category, slug: hook.slug }}
        className="flex h-full w-full flex-col justify-between focus:outline-none"
      >
        {/* Top Header Bar: Gel Tile, Category, Badges, Quick Copy */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CategoryGelTile accent={theme.accent} />
              <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                {theme.label}
              </span>

              {hook.isNew ? (
                <Badge className="h-5 gap-1.5 rounded">New</Badge>
              ) : hook.isUpdated ? (
                <Badge variant="outline" className="h-5 gap-1.5 rounded">
                  updated
                </Badge>
              ) : null}
            </div>

            {/* Quick Copy Hook Name */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex size-7 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-muted-foreground transition-all duration-200 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/15 hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none active:scale-95"
                  aria-label="Copy hook name"
                >
                  {copied ? (
                    <Check className="size-3.5 text-[var(--accent)]" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={4} className="text-[10px]">
                {copied ? "Copied name!" : "Copy name"}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Hook Name & Concise Description */}
          <div className="flex flex-col gap-1">
            <h3 className="line-clamp-1 font-mono text-base font-semibold tracking-tight text-foreground transition-colors duration-200 group-hover/card:text-[var(--accent)]">
              {hook.name}
            </h3>
            <p className="line-clamp-2 min-h-[2.4rem] text-xs leading-relaxed text-muted-foreground">
              {hook.description}
            </p>
          </div>
        </div>

        {/* Center Stage: The Schematic Viewport Chamber */}
        <div className="relative my-3 flex h-44 w-full items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-background/80 p-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.03),inset_0_0_24px_rgba(0,0,0,0.5)] transition-all duration-300 sm:h-48 dark:border-white/[0.08] dark:bg-[linear-gradient(180deg,#0a0a0d_0%,#0e0e13_100%)]">
          {/* Viewport Technical Corner Ticks */}
          <span className="pointer-events-none absolute top-2 left-2 size-1.5 border-t border-l border-foreground/20 dark:border-white/20" />
          <span className="pointer-events-none absolute top-2 right-2 size-1.5 border-t border-r border-foreground/20 dark:border-white/20" />
          <span className="pointer-events-none absolute bottom-2 left-2 size-1.5 border-b border-l border-foreground/20 dark:border-white/20" />
          <span className="pointer-events-none absolute right-2 bottom-2 size-1.5 border-r border-b border-foreground/20 dark:border-white/20" />

          {/* Subtle Ambient Back-Glow behind Schematic on hover */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
            style={{
              background:
                "radial-gradient(circle at center, color-mix(in oklab, var(--accent) 12%, transparent) 0%, transparent 70%)",
            }}
          />

          {/* Interactive Schematic Component */}
          <div className="relative z-10 flex w-full items-center justify-center transition-transform duration-300 will-change-transform group-hover/card:scale-[1.03]">
            <RenderHookSchematic type={hook.schematicType} />
          </div>
        </div>
      </Link>
    </article>
  )
}

export default HookCard
