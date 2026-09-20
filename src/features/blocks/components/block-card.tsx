import { Link } from "@tanstack/react-router"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/shared/lib"

import type { BlockItem } from "../types"
import { RenderBlockSchematic } from "./schematics"

interface BlockCardProps {
  block: BlockItem
}

export const BlockCard = ({ block }: BlockCardProps) => {
  return (
    <Link
      to="/blocks/$category/$slug"
      params={{ category: block.category, slug: block.slug }}
      className={cn(
        "group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-lg p-4 transition-all duration-300 sm:p-5",
        "border border-black/10 bg-muted/40 dark:border-white/10 dark:bg-muted/20",
        "shadow-xs backdrop-blur-xl",
        "hover:border-black/20 hover:bg-muted/70 dark:hover:border-white/20 dark:hover:bg-muted/40",
        "translate-z-0 will-change-transform focus:outline-none"
      )}
    >
      {/* 1. Top Section Canvas / Preview Mockup Viewport */}
      <div className="relative flex aspect-[16/10] w-full flex-col justify-between overflow-hidden rounded-md border border-black/5 bg-black/40 p-3 transition-colors group-hover:border-black/15 sm:aspect-[16/9] sm:p-3.5 dark:border-white/5 dark:bg-black/60 dark:group-hover:border-white/15">
        {/* Subtle Ambient Radial Spotlight */}
        <div className="pointer-events-none absolute inset-0 bg-radial from-white/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Viewport Top Bar (Window controls + Category + Pro + Action) */}
        <div className="relative z-20 flex items-center justify-between gap-2">
          {/* Left: Window dots + Category chip */}
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 sm:flex">
              <span className="size-1.5 rounded-full bg-white/20" />
              <span className="size-1.5 rounded-full bg-white/20" />
              <span className="size-1.5 rounded-full bg-white/20" />
            </div>
            <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] font-medium tracking-wider text-white/70 uppercase">
              {block.category}
            </span>
          </div>

          {/* Right: Pro Badge & Arrow */}
          <div className="flex items-center gap-1.5">
            {block.isPro && (
              <span className="flex items-center rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-amber-300 uppercase">
                Pro
              </span>
            )}
            <div className="flex size-5.5 items-center justify-center rounded border border-white/10 bg-white/5 text-white/60 transition-all duration-200 group-hover:border-white/25 group-hover:bg-white/10 group-hover:text-white">
              <ArrowUpRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>

        {/* Center: Schematic Wireframe */}
        <div className="relative z-10 my-auto flex h-full w-full items-center justify-center py-2 transition-transform duration-300 will-change-transform group-hover:scale-[1.015]">
          <RenderBlockSchematic type={block.schematicType} />
        </div>

        {/* Bottom subtle grid line / device indicator */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-1.5 text-[8px] text-white/30">
          <span>{block.slug}</span>
          <span className="text-[7px] tracking-widest uppercase">
            Section Block
          </span>
        </div>
      </div>

      {/* 2. Bottom Meta / Title & Description */}
      <div className="flex flex-col gap-1.5 pt-3.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-pp-primary sm:text-base">
            {block.title}
          </h3>
          <span className="text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-pp-primary">
            Preview &rarr;
          </span>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {block.description}
        </p>
      </div>
    </Link>
  )
}
