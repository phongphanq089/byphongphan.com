import { Link } from "@tanstack/react-router"
import { ArrowUpRight } from "lucide-react"

import { RenderBlockSchematic } from "@/registry/schematics"
import { cn } from "@/shared/lib/utils"

import type { BlockItem } from "../types"

interface BlockCardProps {
  block: BlockItem
}

export function BlockCard({ block }: BlockCardProps) {
  return (
    <Link
      to="/blocks/$category/$slug"
      params={{ category: block.category, slug: block.slug }}
      className={cn(
        "group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl p-4 transition-all duration-300 sm:p-5",
        "border border-black/10 bg-muted dark:border-white/10",
        "shadow-xs backdrop-blur-xl",
        "hover:border hover:bg-muted/70 hover:shadow-lg dark:hover:border-primary/40 dark:hover:bg-muted/40",
        "translate-z-0 will-change-transform focus:outline-none"
      )}
    >
      <div className="relative flex aspect-[16/10] w-full flex-col justify-between overflow-hidden rounded-lg border border-black/5 bg-background p-3.5 transition-colors group-hover:border sm:aspect-[16/9] sm:p-4 dark:border-white/5 dark:bg-background dark:group-hover:border-primary/20">
        <div className="pointer-events-none absolute inset-0 bg-radial from-white/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-white/[0.06]" />
        <div className="relative z-20 flex items-center justify-between gap-2">
          {/* Left: Window dots + Category chip */}
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 sm:flex">
              <span className="size-1.5 rounded-full bg-accent-foreground dark:bg-white/20" />
              <span className="size-1.5 rounded-full bg-accent-foreground dark:bg-white/20" />
              <span className="size-1.5 rounded-full bg-accent-foreground dark:bg-white/20" />
            </div>
            <span className="rounded border border-white/10 bg-accent-foreground px-1.5 py-0.5 text-[9px] font-medium tracking-wider text-white uppercase dark:bg-white/5">
              {block.category}
            </span>
          </div>

          {/* Right: Pro Badge & Arrow */}
          <div className="flex items-center gap-1.5">
            {block.isPro && (
              <span className="flex items-center rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-white/90 uppercase">
                Pro
              </span>
            )}
            <div className="flex size-5.5 items-center justify-center rounded border border-white/10 bg-accent-foreground text-white transition-all duration-200 group-hover:border-primary/30 group-hover:bg-primary/70 dark:bg-white/5 dark:group-hover:bg-primary/10">
              <ArrowUpRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>

        {/* Center: Block Visual Preview Mockup */}
        <div className="relative z-10 my-auto flex h-full w-full flex-col items-center justify-center py-2 transition-transform duration-300 will-change-transform group-hover:scale-[1.02]">
          <RenderBlockSchematic
            type={block.schematicType || block.slug}
            title={block.title}
          />
        </div>
        <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-1.5 text-[8px] text-white/30">
          <span className="font-mono">{block.slug}</span>
          <span className="text-[7px] tracking-widest uppercase">
            Interactive Block
          </span>
        </div>
      </div>

      {/* 2. Bottom Meta / Title & Description */}
      <div className="flex flex-col gap-1.5 pt-3.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-base">
            {block.title}
          </h3>
          <span className="text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-primary">
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
