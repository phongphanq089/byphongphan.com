import type { Row } from "@tanstack/react-table"
import { format } from "date-fns"
import { Clock, Layers, Sparkles } from "lucide-react"

import { cn } from "@/shared/lib/utils"
import { Badge, Checkbox, Switch } from "@/shared/ui"

import type { postsTableFeatures } from "../table-config"
import type { AdminPost, PostStatus } from "../types"
import { PostActionsMenu } from "./post-actions-menu"
import { PostCoverThumbnail } from "./post-cover-thumbnail"
import { PostStatusBadge } from "./post-status-badge"
import { PostTaxonomyPills } from "./post-taxonomy-pills"

interface PostsGridProps {
  rows: Array<Row<typeof postsTableFeatures, AdminPost>>
  onPreview: (post: AdminPost) => void
  onEdit: (post: AdminPost) => void
  onChangeStatus: (postId: string, status: PostStatus) => void
  onToggleFeatured: (postId: string) => void
  onDuplicate: (post: AdminPost) => void
  onDelete: (post: AdminPost) => void
}

export function PostsGrid({
  rows,
  onPreview,
  onEdit,
  onChangeStatus,
  onToggleFeatured,
  onDuplicate,
  onDelete,
}: PostsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map((row) => {
        const post = row.original
        const isSelected = row.getIsSelected()

        return (
          <article
            key={row.id}
            data-selected={isSelected || undefined}
            className={cn(
              "group/row flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card transition-colors hover:border-border",
              isSelected && "border-primary/50 bg-primary/[0.03]"
            )}
          >
            {/* Cover Header */}
            <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border/60 bg-muted/30">
              <PostCoverThumbnail
                src={post.coverImage}
                alt={post.coverImageAlt}
                title={post.title}
                className="size-full rounded-none border-0"
                iconClassName="size-8"
              />

              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <div className="flex size-6 items-center justify-center rounded-md border border-border/70 bg-background/90 backdrop-blur-xs">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      row.toggleSelected(Boolean(checked))
                    }
                    aria-label={`Select ${post.title}`}
                    className="inline-flex items-center justify-center"
                  />
                </div>
                <PostStatusBadge status={post.status} size="xs" />
              </div>

              {post.isFeatured && (
                <div className="absolute top-2.5 right-2.5">
                  <Badge variant="warning" size="xs" shape="pill">
                    <Sparkles className="size-2.5" />
                    <span>Featured</span>
                  </Badge>
                </div>
              )}

              {post.group && (
                <div className="absolute right-2.5 bottom-2.5 left-2.5 flex items-center justify-between gap-2 rounded-md border border-border/70 bg-background/85 px-2 py-1 text-[11px] backdrop-blur-xs">
                  <span className="flex min-w-0 items-center gap-1.5 font-medium text-foreground">
                    <Layers className="size-3 shrink-0 text-muted-foreground" />
                    <span className="truncate">{post.group.title}</span>
                  </span>
                  {post.groupOrder !== null && (
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                      #{String(post.groupOrder).padStart(2, "0")}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onPreview(post)}
                    className="line-clamp-2 text-left text-sm leading-snug font-semibold text-foreground transition-colors hover:text-pp-secondary focus-visible:underline focus-visible:outline-none"
                  >
                    {post.title}
                  </button>
                  <PostActionsMenu
                    post={post}
                    onPreview={onPreview}
                    onEdit={onEdit}
                    onChangeStatus={onChangeStatus}
                    onToggleFeatured={onToggleFeatured}
                    onDuplicate={onDuplicate}
                    onDelete={onDelete}
                  />
                </div>

                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  /{post.slug}
                </p>
              </div>

              {post.excerpt && (
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
              )}

              <div className="mt-auto pt-1">
                <PostTaxonomyPills
                  categories={post.categories}
                  tags={post.tags}
                  maxTags={3}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-4 py-2.5 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3 font-mono tabular-nums">
                <span>
                  {format(new Date(post.publishedAt), "MMM dd, yyyy")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" />
                  {post.readTime}m
                </span>
              </div>

              <label className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <span>Featured</span>
                <Switch
                  size="sm"
                  checked={post.isFeatured}
                  onCheckedChange={() => onToggleFeatured(post.id)}
                  aria-label={`Toggle featured for ${post.title}`}
                />
              </label>
            </div>
          </article>
        )
      })}
    </div>
  )
}
