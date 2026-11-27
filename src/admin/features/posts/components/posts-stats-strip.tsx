import { CheckCircle2, FileEdit, FileText, Star } from "lucide-react"

import { type AdminStatItem, AdminStatsStrip } from "@/admin"

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

  const stats: AdminStatItem[] = [
    {
      label: "Total Articles",
      value: totalCount,
      hint: `${inSeriesCount} assigned to series`,
      icon: FileText,
      tone: "text-foreground",
    },
    {
      label: "Published",
      value: publishedCount,
      hint:
        totalCount > 0
          ? `${Math.round((publishedCount / totalCount) * 100)}% live on site`
          : "0% live on site",
      icon: CheckCircle2,
      tone: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Drafts & Archive",
      value: draftCount + archivedCount,
      hint: `${draftCount} drafts · ${archivedCount} archived`,
      icon: FileEdit,
      tone: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Featured Picks",
      value: featuredCount,
      hint: "Highlighted on blog & home",
      icon: Star,
      tone: "text-sky-600 dark:text-sky-400",
    },
  ]

  return <AdminStatsStrip items={stats} />
}
