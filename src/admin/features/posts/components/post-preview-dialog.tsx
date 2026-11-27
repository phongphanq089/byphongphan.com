import { format } from "date-fns"
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  FileEdit,
  Layers,
  Pencil,
  Star,
} from "lucide-react"
import { useState } from "react"

import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui"

import type { AdminPost, PostStatus } from "../types"
import { PostCoverThumbnail } from "./post-cover-thumbnail"
import { PostStatusBadge } from "./post-status-badge"
import { PostTaxonomyPills } from "./post-taxonomy-pills"

interface PostPreviewDialogProps {
  post: AdminPost | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (post: AdminPost) => void
  onChangeStatus: (postId: string, status: PostStatus) => void
  onToggleFeatured: (postId: string) => void
}

export function PostPreviewDialog({
  post,
  open,
  onOpenChange,
  onEdit,
  onChangeStatus,
  onToggleFeatured,
}: PostPreviewDialogProps) {
  const [copiedSlug, setCopiedSlug] = useState(false)

  if (!post) return null

  const handleCopySlug = async () => {
    try {
      await navigator.clipboard.writeText(post.slug)
      setCopiedSlug(true)
      window.setTimeout(() => setCopiedSlug(false), 1500)
    } catch {
      // Clipboard may be unavailable in restricted contexts
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88svh] flex-col gap-0 overflow-hidden rounded-2xl border border-border/80 bg-background p-0 shadow-2xl sm:max-w-2xl">
        {/* Fixed Header */}
        <DialogHeader className="shrink-0 gap-2 border-b border-border/70 bg-background px-6 py-4 pr-12">
          <div className="flex flex-wrap items-center gap-2">
            <PostStatusBadge status={post.status} />
            {post.isFeatured && (
              <Badge variant="warning" size="sm" shape="pill">
                <Star className="size-3" />
                <span>Featured</span>
              </Badge>
            )}
            {post.group && (
              <Badge variant="outline" size="sm" shape="rounded">
                <Layers className="size-3" />
                <span>
                  {post.group.title}
                  {post.groupOrder !== null ? ` · Part ${post.groupOrder}` : ""}
                </span>
              </Badge>
            )}
          </div>

          <DialogTitle className="text-lg leading-snug font-semibold text-foreground">
            {post.title}
          </DialogTitle>

          <DialogDescription className="flex items-center gap-1.5 font-mono text-xs">
            <span className="truncate">/{post.slug}</span>
            <button
              type="button"
              onClick={() => void handleCopySlug()}
              aria-label="Copy article slug"
              className="inline-flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {copiedSlug ? (
                <Check className="size-3 text-emerald-500" />
              ) : (
                <Copy className="size-3" />
              )}
            </button>
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Cover Preview */}
          <div className="space-y-1.5">
            <PostCoverThumbnail
              src={post.coverImage}
              alt={post.coverImageAlt}
              title={post.title}
              className="aspect-[16/9] w-full rounded-xl"
              iconClassName="size-10"
            />
            {post.coverImageAlt && (
              <p className="text-[11px] text-muted-foreground">
                Alt: <span className="italic">{post.coverImageAlt}</span>
              </p>
            )}
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <div className="rounded-xl border border-border/70 bg-muted/25 p-3.5">
              <p className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Excerpt
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-foreground/90">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Metadata Grid aligned to Drizzle Schema */}
          <div className="grid gap-4 rounded-xl border border-border/70 bg-card p-4 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Taxonomy
              </p>
              <div className="mt-2">
                <PostTaxonomyPills
                  categories={post.categories}
                  tags={post.tags}
                  maxTags={8}
                />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Read Time</span>
                <span className="inline-flex items-center gap-1 font-mono font-medium text-foreground">
                  <Clock className="size-3 text-muted-foreground" />
                  {post.readTime} min
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Published At</span>
                <span className="inline-flex items-center gap-1 font-mono text-foreground">
                  <Calendar className="size-3 text-muted-foreground" />
                  {format(new Date(post.publishedAt), "yyyy-MM-dd HH:mm")}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Updated At</span>
                <span className="font-mono text-muted-foreground">
                  {format(new Date(post.updatedAt), "yyyy-MM-dd HH:mm")}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Post ID</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {post.id}
                </span>
              </div>
            </div>
          </div>

          {/* Content JSON AST Snapshot */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Content JSON AST (posts.content)
              </span>
              <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                jsonb
              </span>
            </div>
            <pre className="max-h-44 overflow-auto rounded-xl border border-border/70 bg-muted/35 p-3.5 font-mono text-[11px] leading-relaxed text-muted-foreground">
              {JSON.stringify(post.content, null, 2)}
            </pre>
          </div>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="mx-0 mb-0 shrink-0 flex-col-reverse gap-2 rounded-none border-t border-border/70 bg-muted/30 px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onToggleFeatured(post.id)}
              className="gap-1.5 bg-background text-xs"
            >
              <Star
                className={
                  post.isFeatured
                    ? "size-3.5 text-amber-500"
                    : "size-3.5 text-muted-foreground"
                }
              />
              <span>{post.isFeatured ? "Unfeature" : "Feature"}</span>
            </Button>
            {post.status !== "published" ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onChangeStatus(post.id, "published")}
                className="gap-1.5 bg-background text-xs"
              >
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span>Publish</span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onChangeStatus(post.id, "draft")}
                className="gap-1.5 bg-background text-xs"
              >
                <FileEdit className="size-3.5 text-amber-500" />
                <span>Move to Draft</span>
              </Button>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onEdit(post)
              }}
              className="gap-1.5 text-xs"
            >
              <Pencil className="size-3.5" />
              <span>Edit Article</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
