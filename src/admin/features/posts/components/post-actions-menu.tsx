import {
  Archive,
  Check,
  CheckCircle2,
  Copy,
  CopyPlus,
  Eye,
  FileEdit,
  MoreHorizontal,
  Pencil,
  Star,
  Trash2,
} from "lucide-react"
import { useState } from "react"

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui"

import type { AdminPost, PostStatus } from "../types"

interface PostActionsMenuProps {
  post: AdminPost
  onPreview: (post: AdminPost) => void
  onEdit: (post: AdminPost) => void
  onChangeStatus: (postId: string, status: PostStatus) => void
  onToggleFeatured: (postId: string) => void
  onDuplicate: (post: AdminPost) => void
  onDelete: (post: AdminPost) => void
}

export function PostActionsMenu({
  post,
  onPreview,
  onEdit,
  onChangeStatus,
  onToggleFeatured,
  onDuplicate,
  onDelete,
}: PostActionsMenuProps) {
  const [copiedSlug, setCopiedSlug] = useState(false)

  const handleCopySlug = async () => {
    try {
      await navigator.clipboard.writeText(post.slug)
      setCopiedSlug(true)
      window.setTimeout(() => setCopiedSlug(false), 1500)
    } catch {
      // Clipboard may be unavailable in non-secure contexts
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${post.title}`}
            className="text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-48 text-xs">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={() => onEdit(post)}
          >
            <Pencil className="size-3.5 text-muted-foreground" />
            <span>Edit Article</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={() => onPreview(post)}
          >
            <Eye className="size-3.5 text-muted-foreground" />
            <span>Quick Preview</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={() => void handleCopySlug()}
          >
            {copiedSlug ? (
              <Check className="size-3.5 text-emerald-500" />
            ) : (
              <Copy className="size-3.5 text-muted-foreground" />
            )}
            <span>{copiedSlug ? "Slug Copied" : "Copy Slug"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={() => onDuplicate(post)}
          >
            <CopyPlus className="size-3.5 text-muted-foreground" />
            <span>Duplicate Draft</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={() => onToggleFeatured(post.id)}
          >
            <Star
              className={
                post.isFeatured
                  ? "size-3.5 fill-amber-400 text-amber-400"
                  : "size-3.5 text-muted-foreground"
              }
            />
            <span>
              {post.isFeatured ? "Remove Featured" : "Mark as Featured"}
            </span>
          </DropdownMenuItem>

          {post.status !== "published" && (
            <DropdownMenuItem
              className="cursor-pointer text-xs"
              onClick={() => onChangeStatus(post.id, "published")}
            >
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              <span>Publish Now</span>
            </DropdownMenuItem>
          )}
          {post.status !== "draft" && (
            <DropdownMenuItem
              className="cursor-pointer text-xs"
              onClick={() => onChangeStatus(post.id, "draft")}
            >
              <FileEdit className="size-3.5 text-amber-500" />
              <span>Move to Draft</span>
            </DropdownMenuItem>
          )}
          {post.status !== "archived" && (
            <DropdownMenuItem
              className="cursor-pointer text-xs"
              onClick={() => onChangeStatus(post.id, "archived")}
            >
              <Archive className="size-3.5 text-muted-foreground" />
              <span>Archive</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer text-xs"
          onClick={() => onDelete(post)}
        >
          <Trash2 className="size-3.5" />
          <span>Delete Article</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
