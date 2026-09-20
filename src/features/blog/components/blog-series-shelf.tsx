import { Layers } from "lucide-react"
import { useMemo } from "react"

import type { BlogGroup, BlogPost } from "../types"
import { BlogSeriesCard } from "./blog-series-card"

interface BlogSeriesShelfProps {
  groups: BlogGroup[]
  posts: BlogPost[]
  onSelectGroup: (groupSlug: string) => void
}

export const BlogSeriesShelf = ({
  groups,
  posts,
  onSelectGroup,
}: BlogSeriesShelfProps) => {
  const seriesWithCounts = useMemo(() => {
    return groups.map((group) => {
      const count = posts.filter(
        (p) => p.group?.slug.current === group.slug.current
      ).length
      return { group, count }
    })
  }, [groups, posts])

  if (groups.length === 0) {
    return null
  }

  return (
    <div className="flex w-full flex-col gap-4 py-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-pp-primary" />
          <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">
            Curated Learning Series
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Step-by-step technical roadmaps and in-depth multi-part engineering
          collections.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {seriesWithCounts.map(({ group, count }) => (
          <BlogSeriesCard
            key={group._id}
            group={group}
            postCount={count}
            onSelect={onSelectGroup}
          />
        ))}
      </div>
    </div>
  )
}
