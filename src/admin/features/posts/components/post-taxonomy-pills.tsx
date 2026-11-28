import { Badge } from "@/shared/ui"

import type { AdminCategory, AdminTag } from "../types"

interface PostTaxonomyPillsProps {
  categories: AdminCategory[]
  tags: AdminTag[]
  maxTags?: number
}

export function PostTaxonomyPills({
  categories,
  tags,
  maxTags = 2,
}: PostTaxonomyPillsProps) {
  const visibleTags = tags.slice(0, maxTags)
  const hiddenTagCount = Math.max(0, tags.length - maxTags)

  return (
    <div className="flex flex-col gap-1.5">
      {categories.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1">
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              variant="outline"
              size="xs"
              shape="rounded"
              className="gap-1.5 bg-background/60 font-medium"
            >
              <span
                className="size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: cat.color ?? "#64748b" }}
              />
              <span>{cat.title}</span>
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-[11px] text-muted-foreground/60">
          Uncategorized
        </span>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          {visibleTags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
            >
              #{tag.title}
            </span>
          ))}
          {hiddenTagCount > 0 && (
            <span className="inline-flex items-center rounded bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/80">
              +{hiddenTagCount}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
