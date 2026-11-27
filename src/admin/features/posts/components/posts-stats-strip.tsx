import {
  CheckSquareOffsetIcon,
  FileMagnifyingGlassIcon,
  HighlighterIcon,
  MonitorArrowUpIcon,
} from "@phosphor-icons/react"

import type { AdminPost } from "../types"

interface PostsStatsStripProps {
  posts: AdminPost[]
}

export function PostsStatsStrip({ posts }: PostsStatsStripProps) {
  const totalCount = posts.length
  const publishedCount = posts.filter((p) => p.status === "published").length
  const draftCount = posts.filter((p) => p.status === "draft").length
  const archivedCount = posts.filter((p) => p.status === "archived").length
  const featuredCount = posts.filter((p) => p.isFeatured).length
  const inSeriesCount = posts.filter((p) => Boolean(p.groupId)).length

  const stats = [
    {
      label: "Total Articles",
      value: totalCount,
      hint: `${inSeriesCount} assigned to series`,
      icon: FileMagnifyingGlassIcon,
      tone: "text-foreground",
    },
    {
      label: "Published",
      value: publishedCount,
      hint:
        totalCount > 0
          ? `${Math.round((publishedCount / totalCount) * 100)}% live on site`
          : "0% live on site",
      icon: CheckSquareOffsetIcon,
      tone: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Drafts & Archive",
      value: draftCount + archivedCount,
      hint: `${draftCount} drafts · ${archivedCount} archived`,
      icon: HighlighterIcon,
      tone: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Featured Picks",
      value: featuredCount,
      hint: "Highlighted on blog & home",
      icon: MonitorArrowUpIcon,
      tone: "text-sky-600 dark:text-sky-400",
    },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.label}
            className="flex items-start justify-between rounded-xl border border-border/70 bg-card p-4 shadow-xs"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-1.5 font-mono text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {item.value}
              </p>
              <p className="mt-1 truncate text-xs text-muted-foreground/80">
                {item.hint}
              </p>
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40">
              <Icon className={`size-4 ${item.tone}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
