import { Link } from "@tanstack/react-router"

import { cn } from "@/shared/lib/utils"
import { StripedPattern } from "@/shared/ui/system"

import { HOOK_CATEGORIES } from "../hooks-data"
import type { HookCategoryIdWithAll } from "../types"

interface HookFilterBarProps {
  activeCategory?: HookCategoryIdWithAll
}

export function HookFilterBar({ activeCategory = "all" }: HookFilterBarProps) {
  return (
    <div className="no-scrollbar flex w-full items-stretch overflow-x-auto select-none">
      {HOOK_CATEGORIES.map((cat) => {
        const isSelected = activeCategory === cat.id
        const to = cat.id === "all" ? "/hooks" : `/hooks/${cat.id}`

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
