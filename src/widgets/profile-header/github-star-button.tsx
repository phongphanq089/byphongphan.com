import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

import { siteConfig } from "@/shared/config"
import {
  DEFAULT_GITHUB_REPO,
  formatStarCount,
  githubStarsQueryOptions,
} from "@/shared/lib/get-github-stars"
import { cn } from "@/shared/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/core"
import { GitHub } from "@/shared/ui/icons"

export interface GitHubStarButtonProps {
  className?: string
  repo?: string
}

export function GitHubStarButton({
  className,
  repo = DEFAULT_GITHUB_REPO,
}: GitHubStarButtonProps) {
  const { data: stars, isLoading } = useQuery(githubStarsQueryOptions(repo))

  const formattedStars = useMemo(() => {
    if (typeof stars === "number") {
      return formatStarCount(stars)
    }
    return null
  }, [stars])

  const tooltipLabel = useMemo(() => {
    if (typeof stars === "number") {
      return `${stars.toLocaleString()} ${stars === 1 ? "star" : "stars"}`
    }
    return "GitHub stars"
  }, [stars])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={siteConfig.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`GitHub repository (${tooltipLabel})`}
          className={cn(
            "group relative inline-flex h-full w-full items-center gap-1.5 bg-muted px-4 py-1.5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted active:scale-95 dark:border-white/10 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80",
            "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
            className
          )}
        >
          <GitHub
            size={16}
            className="shrink-0 transition-transform duration-200 group-hover:scale-105"
          />

          {isLoading ? (
            <span className="hidden h-3.5 w-5 animate-pulse rounded-xs bg-muted-foreground/30" />
          ) : (
            <span className="hidden font-medium tracking-tight tabular-nums">
              {formattedStars ?? "0"}
            </span>
          )}
        </a>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={6}>
        GIBHUB
      </TooltipContent>
    </Tooltip>
  )
}

export default GitHubStarButton
