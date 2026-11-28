import { BookmarkCheck, FolderTree, Gift, Star } from "lucide-react"

import { type AdminStatItem, AdminStatsStrip } from "@/admin"

import type { AdminResource, AdminResourceCategory } from "../types"

interface ResourcesStatsStripProps {
  resources: AdminResource[]
  categories: AdminResourceCategory[]
}

export function ResourcesStatsStrip({
  resources,
  categories,
}: ResourcesStatsStripProps) {
  const totalCount = resources.length
  const freeOrMitCount = resources.filter(
    (r) => r.pricing === "Free" || r.pricing === "MIT"
  ).length
  const featuredCount = resources.filter((r) => r.isFeatured).length

  const stats: AdminStatItem[] = [
    {
      label: "Total Resources",
      value: totalCount,
      hint: "Curated tools & libraries",
      icon: BookmarkCheck,
      tone: "text-foreground",
    },
    {
      label: "Categories",
      value: categories.length,
      hint: "Ordered resource tabs",
      icon: FolderTree,
      tone: "text-sky-600 dark:text-sky-400",
    },
    {
      label: "Free & MIT",
      value: freeOrMitCount,
      hint:
        totalCount > 0
          ? `${Math.round((freeOrMitCount / totalCount) * 100)}% open / free`
          : "0% open / free",
      icon: Gift,
      tone: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Featured Tools",
      value: featuredCount,
      hint: "Highlighted on showcase",
      icon: Star,
      tone: "text-amber-600 dark:text-amber-400",
    },
  ]

  return <AdminStatsStrip items={stats} />
}
