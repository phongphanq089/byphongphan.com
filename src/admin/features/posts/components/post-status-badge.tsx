import { Archive, CheckCircle2, FileEdit } from "lucide-react"

import { Badge, BadgeDot } from "@/shared/ui"

import type { PostStatus } from "../types"

interface PostStatusBadgeProps {
  status: PostStatus
  size?: "xs" | "sm" | "default"
}

const STATUS_META: Record<
  PostStatus,
  {
    label: string
    variant: "success" | "warning" | "subtle"
    icon: typeof CheckCircle2
  }
> = {
  published: {
    label: "Published",
    variant: "success",
    icon: CheckCircle2,
  },
  draft: {
    label: "Draft",
    variant: "warning",
    icon: FileEdit,
  },
  archived: {
    label: "Archived",
    variant: "subtle",
    icon: Archive,
  },
}

export function PostStatusBadge({ status, size = "sm" }: PostStatusBadgeProps) {
  const meta = STATUS_META[status]

  return (
    <Badge variant={meta.variant} size={size} shape="pill">
      <BadgeDot pulse={status === "published"} />
      <span>{meta.label}</span>
    </Badge>
  )
}
