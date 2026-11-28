import { Link } from "@tanstack/react-router"
import { ArrowUpRight, Clock, FileText, Pencil } from "lucide-react"

import { PostStatusBadge } from "@/admin/features/posts/components/post-status-badge"
import {
  Badge,
  BadgeDot,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui"

import type { AdminGroupWithPosts } from "../types"

interface GroupPostsDialogProps {
  group: AdminGroupWithPosts | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditGroup: (group: AdminGroupWithPosts) => void
}

export function GroupPostsDialog({
  group,
  open,
  onOpenChange,
  onEditGroup,
}: GroupPostsDialogProps) {
  if (!group) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88svh] flex-col gap-0 overflow-hidden rounded-2xl border border-border/80 bg-background p-0 shadow-2xl sm:max-w-xl">
        <DialogHeader className="shrink-0 gap-2 border-b border-border/70 px-6 py-4 pr-12">
          <div className="flex flex-wrap items-center gap-2">
            {group.isCompleted ? (
              <Badge variant="success" size="sm" shape="pill">
                <BadgeDot />
                <span>Completed</span>
              </Badge>
            ) : (
              <Badge variant="warning" size="sm" shape="pill">
                <BadgeDot pulse />
                <span>In Progress</span>
              </Badge>
            )}
            <Badge
              variant="outline"
              size="sm"
              shape="pill"
              className="font-mono"
            >
              {group.posts.length}{" "}
              {group.posts.length === 1 ? "article" : "articles"}
            </Badge>
          </div>

          <DialogTitle className="text-base font-semibold text-foreground">
            {group.title}
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">
            /series/{group.slug}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {group.description && (
            <p className="rounded-xl border border-border/70 bg-muted/25 p-3.5 text-xs leading-relaxed text-foreground/90">
              {group.description}
            </p>
          )}

          {group.posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/15 px-6 py-10 text-center">
              <FileText className="size-6 text-muted-foreground/70" />
              <p className="mt-2.5 text-sm font-medium text-foreground">
                No articles assigned yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Assign articles to this series from the Blog Posts editor.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {group.posts.map((post, idx) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-3 transition-colors hover:border-border"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 min-w-8 shrink-0 items-center justify-center rounded-md bg-muted px-1.5 font-mono text-[11px] font-semibold text-foreground">
                      #{String(post.groupOrder ?? idx + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 space-y-1">
                      <p className="line-clamp-1 text-xs font-semibold text-foreground">
                        {post.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <PostStatusBadge status={post.status} size="xs" />
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                          <Clock className="size-3" />
                          {post.readTime}m
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="xs"
                    asChild
                    className="shrink-0 gap-1 text-[11px]"
                  >
                    <Link
                      to="/admin/posts/$postId"
                      params={{ postId: post.id }}
                    >
                      <span>Edit</span>
                      <ArrowUpRight className="size-3" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="mx-0 mb-0 shrink-0 justify-between rounded-none border-t border-border/70 bg-muted/30 px-6 py-3.5 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onOpenChange(false)
              onEditGroup(group)
            }}
            className="gap-1.5 bg-background text-xs"
          >
            <Pencil className="size-3.5" />
            <span>Edit Series</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
