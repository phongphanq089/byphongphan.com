import { Check, FolderTree, Plus, X } from "lucide-react"
import { useState } from "react"

import { AdminContentCard } from "@/admin"
import { cn } from "@/shared/lib/utils"
import { Badge, Button, Input, Label } from "@/shared/ui"

import type { AdminCategory, AdminTag } from "../../types"

interface PostEditorTaxonomyCardProps {
  categoryIds: string[]
  tags: AdminTag[]
  categories: AdminCategory[]
  availableTags: AdminTag[]
  onCategoryIdsChange: (categoryIds: string[]) => void
  onTagsChange: (tags: AdminTag[]) => void
}

export function PostEditorTaxonomyCard({
  categoryIds,
  tags,
  categories,
  availableTags,
  onCategoryIdsChange,
  onTagsChange,
}: PostEditorTaxonomyCardProps) {
  const [tagInput, setTagInput] = useState("")

  const toggleCategory = (categoryId: string) => {
    const exists = categoryIds.includes(categoryId)
    const next = exists
      ? categoryIds.filter((id) => id !== categoryId)
      : [...categoryIds, categoryId]
    onCategoryIdsChange(next)
  }

  const addTagByTitle = (rawTitle: string) => {
    const normalized = rawTitle
      .trim()
      .toLowerCase()
      .replace(/^#+/, "")
      .replace(/\s+/g, "-")
    if (!normalized) return

    if (tags.some((t) => t.slug === normalized)) {
      setTagInput("")
      return
    }

    const existing = availableTags.find((t) => t.slug === normalized)
    const now = new Date().toISOString()
    const nextTag: AdminTag = existing ?? {
      id: `tag-${normalized}-${Date.now()}`,
      title: normalized,
      slug: normalized,
      description: null,
      createdAt: now,
      updatedAt: now,
    }

    onTagsChange([...tags, nextTag])
    setTagInput("")
  }

  const removeTag = (tagId: string) => {
    onTagsChange(tags.filter((t) => t.id !== tagId))
  }

  const unselectedSuggestedTags = availableTags.filter(
    (tag) => !tags.some((selected) => selected.id === tag.id)
  )

  return (
    <AdminContentCard
      title={
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <FolderTree className="size-4 text-muted-foreground" />
          <span>Taxonomy</span>
        </span>
      }
      minHeight="min-h-0"
      padding="sm"
      className="flex-none"
    >
      <div className="space-y-4">
        {/* Categories */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Categories</span>
            <span className="font-mono text-[11px] text-muted-foreground">
              {categoryIds.length} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const isSelected = categoryIds.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                    isSelected
                      ? "border-primary/40 bg-primary/10 text-foreground"
                      : "border-border/70 bg-background/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: cat.color ?? "#64748b" }}
                  />
                  <span>{cat.title}</span>
                  {isSelected && <Check className="size-3 text-primary" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="post-tag-input" className="text-xs">
            Tags
          </Label>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  size="sm"
                  shape="rounded"
                  className="gap-1 pr-1 font-mono text-[11px]"
                >
                  <span>#{tag.title}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag.id)}
                    aria-label={`Remove tag ${tag.title}`}
                    className="inline-flex size-4 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="size-2.5" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Input
              id="post-tag-input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addTagByTitle(tagInput)
                }
              }}
              placeholder="Type tag & press Enter..."
              className="font-mono text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => addTagByTitle(tagInput)}
              disabled={!tagInput.trim()}
              aria-label="Add tag"
              className="shrink-0"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>

          {unselectedSuggestedTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 pt-0.5">
              <span className="text-[10px] text-muted-foreground">
                Quick add:
              </span>
              {unselectedSuggestedTags.slice(0, 4).map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => addTagByTitle(tag.title)}
                  className="rounded border border-border/60 bg-muted/30 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                >
                  +{tag.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminContentCard>
  )
}
