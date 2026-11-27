import { format } from "date-fns"
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileEdit,
  Layers,
  Pencil,
  Sparkles,
} from "lucide-react"

import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Separator,
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
  if (!post) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2 pr-8">
            <PostStatusBadge status={post.status} />
            {post.isFeatured && (
              <Badge variant="warning" size="sm" shape="pill">
                <Sparkles className="size-3" />
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
          <DialogTitle className="pt-1 text-lg leading-snug font-semibold text-foreground">
            {post.title}
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">
            /{post.slug}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cover Preview */}
          <div className="space-y-1.5">
            <PostCoverThumbnail
              src={post.coverImage}
              alt={post.coverImageAlt}
              title={post.title}
              className="aspect-[16/9] w-full rounded-lg"
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
            <div className="rounded-lg border border-border/70 bg-muted/30 p-3">
              <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                Excerpt
              </p>
              <p className="mt-1 text-xs leading-relaxed text-foreground/90">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Metadata Grid aligned to Drizzle Schema */}
          <div className="grid gap-3 rounded-lg border border-border/70 bg-card p-3 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">
                Taxonomy
              </p>
              <div className="mt-1.5">
                <PostTaxonomyPills
                  categories={post.categories}
                  tags={post.tags}
                  maxTags={8}
                />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Read Time</span>
                <span className="inline-flex items-center gap-1 font-mono font-medium text-foreground">
                  <Clock className="size-3 text-muted-foreground" />
                  {post.readTime} min
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Published At</span>
                <span className="inline-flex items-center gap-1 font-mono text-foreground">
                  <Calendar className="size-3 text-muted-foreground" />
                  {format(new Date(post.publishedAt), "yyyy-MM-dd HH:mm")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Updated At</span>
                <span className="font-mono text-muted-foreground">
                  {format(new Date(post.updatedAt), "yyyy-MM-dd HH:mm")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Post ID</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {post.id}
                </span>
              </div>
            </div>
          </div>

          {/* Content JSON AST Snapshot */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                Content JSON AST (`posts.content`)
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                jsonb
              </span>
            </div>
            <pre className="max-h-36 overflow-auto rounded-lg border border-border/70 bg-muted/40 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
              {JSON.stringify(post.content, null, 2)}
            </pre>
          </div>
        </div>

        <Separator />

        <DialogFooter className="mx-0 mb-0 justify-between rounded-none border-0 bg-transparent p-0 sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onToggleFeatured(post.id)}
              className="gap-1.5 text-xs"
            >
              <Sparkles
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
                className="gap-1.5 text-xs"
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
                className="gap-1.5 text-xs"
              >
                <FileEdit className="size-3.5 text-amber-500" />
                <span>Move to Draft</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
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
