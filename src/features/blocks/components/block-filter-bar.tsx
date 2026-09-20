import { Link } from "@tanstack/react-router"

import { cn } from "@/shared/lib"
import { StripedPattern } from "@/shared/ui/system"

import { BLOCK_CATEGORIES } from "../blocks-data"
import type { BlockCategoryId } from "../types"

interface BlockFilterBarProps {
  activeCategory?: BlockCategoryId
}

export const BlockFilterBar = ({
  activeCategory = "all",
}: BlockFilterBarProps) => {
  return (
    <div className="no-scrollbar flex w-full items-stretch overflow-x-auto">
      {BLOCK_CATEGORIES.map((cat) => {
        const isSelected = activeCategory === cat.id
        const to = cat.id === "all" ? "/blocks" : `/blocks/${cat.id}`

        return (
          <Link
            key={cat.id}
            to={to}
            className={cn(
              "flex shrink-0 items-center justify-center border-r border-border px-5 py-3 text-xs font-bold tracking-wider uppercase transition-colors sm:px-6",
              isSelected
                ? "bg-muted font-extrabold dark:bg-white/10 dark:text-white"
                : "text-muted-foreground/70 hover:bg-white/[0.04] hover:text-foreground"
            )}
          >
            <span>{cat.label}</span>
          </Link>
        )
      })}

      {/* Remaining Technical Blueprint Striped Space */}
      <StripedPattern />
    </div>
  )
}
