import { Link } from "@tanstack/react-router"
import { ArrowLeft, Check, Eye, Save, Send } from "lucide-react"

import { AdminPageHeader } from "@/admin"
import { Badge, Button } from "@/shared/ui"

import type { PostStatus } from "../../types"
import { PostStatusBadge } from "../post-status-badge"

interface PostEditorHeaderProps {
  isEdit: boolean
  status: PostStatus
  isDirty: boolean
  savedNotice: string | null
  onOpenPreview: () => void
  onSaveDraft: () => void
  onPublish: () => void
}

export function PostEditorHeader({
  isEdit,
  status,
  isDirty,
  savedNotice,
  onOpenPreview,
  onSaveDraft,
  onPublish,
}: PostEditorHeaderProps) {
  return (
    <AdminPageHeader
      title={isEdit ? "Edit Article" : "New Article"}
      description={
        isEdit
          ? "Update article metadata, taxonomy, cover media, and publishing settings."
          : "Compose a new blog post and configure its metadata."
      }
      badge={
        <div className="flex flex-wrap items-center gap-1.5">
          <PostStatusBadge status={status} />
          {isDirty && (
            <Badge
              variant="outline"
              size="sm"
              shape="pill"
              className="font-mono text-[11px]"
            >
              Unsaved
            </Badge>
          )}
          {savedNotice && (
            <Badge
              variant="success"
              size="sm"
              shape="pill"
              className="gap-1 font-mono text-[11px]"
            >
              <Check className="size-3" />
              <span>{savedNotice}</span>
            </Badge>
          )}
        </div>
      }
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Content & Blog" },
        { label: "Posts", href: "/admin/posts" },
        { label: isEdit ? "Edit" : "New" },
      ]}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-1.5 text-xs"
          >
            <Link to="/admin/posts">
              <ArrowLeft className="size-3.5" />
              <span>Back to Posts</span>
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenPreview}
            className="gap-1.5 text-xs"
          >
            <Eye className="size-3.5" />
            <span>Preview</span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onSaveDraft}
            className="gap-1.5 text-xs"
          >
            <Save className="size-3.5" />
            <span>Save Draft</span>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onPublish}
            className="gap-1.5 text-xs"
          >
            <Send className="size-3.5" />
            <span>{isEdit ? "Update" : "Publish"}</span>
          </Button>
        </div>
      }
    />
  )
}
