import {
  CalendarClock,
  Check,
  FolderTree,
  Layers,
  Plus,
  Sparkles,
  X,
} from "lucide-react"
import { useState } from "react"

import { AdminContentCard } from "@/admin"
import { cn } from "@/shared/lib/utils"
import {
  Badge,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@/shared/ui"

import type {
  AdminCategory,
  AdminPostGroup,
  AdminTag,
  PostStatus,
} from "../../types"

export interface PostEditorFormValues {
  title: string
  slug: string
  excerpt: string
  coverImage: string
  coverImageAlt: string
  groupId: string | null
  groupOrder: number | null
  status: PostStatus
  publishedAt: string
  readTime: number
  isFeatured: boolean
  categoryIds: string[]
  tags: AdminTag[]
  content: Record<string, unknown>
}

interface PostEditorMetadataSidebarProps {
  values: PostEditorFormValues
  categories: AdminCategory[]
  availableTags: AdminTag[]
  groups: AdminPostGroup[]
  onChange: <K extends keyof PostEditorFormValues>(
    field: K,
    value: PostEditorFormValues[K]
  ) => void
}

const STATUS_OPTIONS: Array<{
  value: PostStatus
  label: string
  dotClass: string
}> = [
  { value: "draft", label: "Draft", dotClass: "bg-amber-500" },
  { value: "published", label: "Published", dotClass: "bg-emerald-500" },
  { value: "archived", label: "Archived", dotClass: "bg-muted-foreground" },
]

export function PostEditorMetadataSidebar({
  values,
  categories,
  availableTags,
  groups,
  onChange,
}: PostEditorMetadataSidebarProps) {
  const [tagInput, setTagInput] = useState("")

  const selectedStatus =
    STATUS_OPTIONS.find((item) => item.value === values.status) ??
    STATUS_OPTIONS[0]

  const selectedGroupLabel = values.groupId
    ? (groups.find((g) => g.id === values.groupId)?.title ?? "Select series")
    : "Standalone (No Series)"

  const toggleCategory = (categoryId: string) => {
    const exists = values.categoryIds.includes(categoryId)
    const next = exists
      ? values.categoryIds.filter((id) => id !== categoryId)
      : [...values.categoryIds, categoryId]
    onChange("categoryIds", next)
  }

  const addTagByTitle = (rawTitle: string) => {
    const normalized = rawTitle
      .trim()
      .toLowerCase()
      .replace(/^#+/, "")
      .replace(/\s+/g, "-")
    if (!normalized) return

    if (values.tags.some((t) => t.slug === normalized)) {
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

    onChange("tags", [...values.tags, nextTag])
    setTagInput("")
  }

  const removeTag = (tagId: string) => {
    onChange(
      "tags",
      values.tags.filter((t) => t.id !== tagId)
    )
  }

  const unselectedSuggestedTags = availableTags.filter(
    (tag) => !values.tags.some((selected) => selected.id === tag.id)
  )

  return (
    <aside className="flex flex-col gap-5 lg:sticky lg:top-0">
      {/* 1. Publishing */}
      <AdminContentCard
        title={
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <CalendarClock className="size-4 text-muted-foreground" />
            <span>Publishing</span>
          </span>
        }
        minHeight="min-h-0"
        padding="sm"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="post-status" className="text-xs">
              Status
            </Label>
            <Select
              value={values.status}
              onValueChange={(value) => {
                if (value) onChange("status", value as PostStatus)
              }}
            >
              <SelectTrigger id="post-status" className="w-full text-xs">
                <SelectValue>
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "size-2 shrink-0 rounded-full",
                        selectedStatus.dotClass
                      )}
                    />
                    <span>{selectedStatus.label}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="start">
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "size-2 shrink-0 rounded-full",
                          opt.dotClass
                        )}
                      />
                      <span>{opt.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="post-published-at" className="text-xs">
              Published At
            </Label>
            <Input
              id="post-published-at"
              type="datetime-local"
              value={values.publishedAt}
              onChange={(e) => onChange("publishedAt", e.target.value)}
              className="font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="post-read-time" className="text-xs">
              Estimated Read Time
            </Label>
            <InputGroup>
              <InputGroupInput
                id="post-read-time"
                type="number"
                min={1}
                max={120}
                value={values.readTime}
                onChange={(e) => {
                  const parsed = Number(e.target.value)
                  onChange(
                    "readTime",
                    Number.isNaN(parsed) || parsed < 1 ? 1 : parsed
                  )
                }}
                className="font-mono text-xs"
              />
              <InputGroupAddon align="inline-end">
                <span className="font-mono text-[11px] text-muted-foreground">
                  min read
                </span>
              </InputGroupAddon>
            </InputGroup>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/25 px-3 py-2.5">
            <div className="space-y-0.5">
              <Label
                htmlFor="post-featured"
                className="cursor-pointer text-xs font-medium"
              >
                <Sparkles className="size-3.5 text-amber-500" />
                <span>Featured Article</span>
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Pin to featured highlights
              </p>
            </div>
            <Switch
              id="post-featured"
              checked={values.isFeatured}
              onCheckedChange={(checked) =>
                onChange("isFeatured", Boolean(checked))
              }
            />
          </div>
        </div>
      </AdminContentCard>

      {/* 2. Taxonomy */}
      <AdminContentCard
        title={
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <FolderTree className="size-4 text-muted-foreground" />
            <span>Taxonomy</span>
          </span>
        }
        minHeight="min-h-0"
        padding="sm"
      >
        <div className="space-y-4">
          {/* Categories */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Categories</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {values.categoryIds.length} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const isSelected = values.categoryIds.includes(cat.id)
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

            {values.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {values.tags.map((tag) => (
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

      {/* 3. Series & Order */}
      <AdminContentCard
        title={
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <Layers className="size-4 text-muted-foreground" />
            <span>Series &amp; Order</span>
          </span>
        }
        minHeight="min-h-0"
        padding="sm"
      >
        <div className="grid grid-cols-[minmax(0,1fr)_88px] gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="post-group" className="text-xs">
              Series Group
            </Label>
            <Select
              value={values.groupId ?? "none"}
              onValueChange={(value) => {
                const nextGroupId = value && value !== "none" ? value : null
                onChange("groupId", nextGroupId)
                if (!nextGroupId) {
                  onChange("groupOrder", null)
                } else if (values.groupOrder === null) {
                  onChange("groupOrder", 1)
                }
              }}
            >
              <SelectTrigger id="post-group" className="w-full min-w-0 text-xs">
                <SelectValue>{selectedGroupLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent align="start">
                <SelectItem value="none" className="text-xs">
                  Standalone (No Series)
                </SelectItem>
                {groups.map((grp) => (
                  <SelectItem key={grp.id} value={grp.id} className="text-xs">
                    {grp.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="post-group-order" className="text-xs">
              Part #
            </Label>
            <Input
              id="post-group-order"
              type="number"
              min={1}
              disabled={!values.groupId}
              value={values.groupOrder ?? ""}
              onChange={(e) => {
                const parsed = Number(e.target.value)
                onChange(
                  "groupOrder",
                  !e.target.value || Number.isNaN(parsed) || parsed < 1
                    ? null
                    : parsed
                )
              }}
              placeholder="—"
              className="font-mono text-xs"
            />
          </div>
        </div>
      </AdminContentCard>
    </aside>
  )
}
