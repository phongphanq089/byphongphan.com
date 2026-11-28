import { CheckCircle2, Clock, FileText, Library } from "lucide-react"

import { type AdminStatItem, AdminStatsStrip } from "@/admin"

import type { AdminGroupWithPosts } from "../types"

interface GroupsStatsStripProps {
  groups: AdminGroupWithPosts[]
}

export function GroupsStatsStrip({ groups }: GroupsStatsStripProps) {
  const totalCount = groups.length
  const completedCount = groups.filter((g) => g.isCompleted).length
  const ongoingCount = totalCount - completedCount
  const totalArticles = groups.reduce((sum, g) => sum + g.posts.length, 0)

  const stats: AdminStatItem[] = [
    {
      label: "Total Series",
      value: totalCount,
      hint: "Curated article collections",
      icon: Library,
      tone: "text-foreground",
    },
    {
      label: "Completed",
      value: completedCount,
      hint:
        totalCount > 0
          ? `${Math.round((completedCount / totalCount) * 100)}% finished`
          : "0% finished",
      icon: CheckCircle2,
      tone: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "In Progress",
      value: ongoingCount,
      hint: "Active ongoing series",
      icon: Clock,
      tone: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Grouped Articles",
      value: totalArticles,
      hint: "Posts linked to series",
      icon: FileText,
      tone: "text-sky-600 dark:text-sky-400",
    },
  ]

  return <AdminStatsStrip items={stats} />
}
