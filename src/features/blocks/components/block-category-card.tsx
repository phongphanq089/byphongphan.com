import { Link } from "@tanstack/react-router"
import { ArrowUpRight } from "lucide-react"
import type { ReactNode } from "react"

import type { BlockCategoryId } from "@/shared/config"
import { cn } from "@/shared/lib/utils"
import { SpotlightCard } from "@/shared/ui/core"
import { SchematicWrapper } from "@/shared/ui/system"

export interface BlockCategoryCardProps {
  /** Block category id — resolves the route param for `/blocks/$category`. */
  id: BlockCategoryId
  /** Technical index label e.g. "01" */
  index: string
  /** Category title e.g. "Marketing" (rendered uppercase mono) */
  title: string
  /** Number of blocks in the category */
  count: number
  /** Bottom technical specs label for the blueprint frame */
  specsLabel: string
  /** 9-slice padding guideline distance in pixels (default: 16) */
  paddingPx?: number
  /** Category blueprint schematic mockup */
  children: ReactNode
}

export function BlockCategoryCard({
  id,
  index,
  title,
  count,
  specsLabel,
  paddingPx = 16,
  children,
}: BlockCategoryCardProps) {
  return (
    <SpotlightCard
      enableTilt
      spotlightSize={320}
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-xl p-0 transition-all duration-300",
        "border border-black/10 bg-muted/80 backdrop-blur-xl dark:border-white/10 dark:bg-muted/40",
        "hover:shadow-xl",
        "focus-within:ring-2 focus-within:ring-primary/50"
      )}
      contentClassName="h-full flex-col justify-between"
    >
      <Link
        to="/blocks/$category"
        params={{ category: id }}
        className="flex h-full w-full flex-col justify-between gap-3 p-4 focus:outline-none sm:p-5"
      >
        {/* Top row: index + title · count + arrow */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="font-mono text-[11px] font-medium text-muted-foreground/60 select-none">
              [{index}]
            </span>
            <h3 className="truncate font-mono text-xs font-bold tracking-widest text-foreground uppercase transition-colors group-hover:text-primary sm:text-sm">
              {title}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] font-medium text-muted-foreground transition-colors duration-200 group-hover:text-primary">
            <span>({count})</span>
            <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Center: blueprint schematic panel */}
        <div className="relative flex min-h-[228px] w-full flex-1 items-center justify-center overflow-hidden rounded-lg border border-black/5 bg-background transition-colors group-hover:border sm:min-h-[236px] dark:border-white/5 dark:group-hover:border-primary/20">
          <div className="pointer-events-none absolute inset-0 bg-radial from-white/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-white/[0.06]" />
          <div className="relative z-10 flex w-full items-center justify-center transition-transform duration-300 will-change-transform group-hover:scale-[1.02]">
            <SchematicWrapper specsLabel={specsLabel} paddingPx={paddingPx}>
              {children}
            </SchematicWrapper>
          </div>
        </div>
      </Link>
    </SpotlightCard>
  )
}
