import { FolderTree, Hash, Link2, Tags } from "lucide-react"

import { type AdminStatItem, AdminStatsStrip } from "@/admin"

import type { AdminCategoryWithCount, AdminTagWithCount } from "../types"

interface TaxonomyStatsStripProps {
  categories: AdminCategoryWithCount[]
  tags: AdminTagWithCount[]
}

export function TaxonomyStatsStrip({
  categories,
  tags,
}: TaxonomyStatsStripProps) {
  const categoryLinks = categories.reduce((sum, c) => sum + c.postsCount, 0)
  const tagLinks = tags.reduce((sum, t) => sum + t.postsCount, 0)

  const stats: AdminStatItem[] = [
    {
      label: "Categories",
      value: categories.length,
      hint: "Primary topic buckets",
      icon: FolderTree,
      tone: "text-foreground",
    },
    {
      label: "Tags",
      value: tags.length,
      hint: "Granular #hashtags",
      icon: Hash,
      tone: "text-sky-600 dark:text-sky-400",
    },
    {
      label: "Category Links",
      value: categoryLinks,
      hint: "Assigned across articles",
      icon: Link2,
      tone: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Tag Links",
      value: tagLinks,
      hint: "Total #tag references",
      icon: Tags,
      tone: "text-amber-600 dark:text-amber-400",
    },
  ]

  return <AdminStatsStrip items={stats} />
}
