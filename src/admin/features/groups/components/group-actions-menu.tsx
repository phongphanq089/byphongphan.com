import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ListOrdered,
  MoreHorizontal,
  Pencil,
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

import type { AdminGroupWithPosts } from "../types"

interface GroupActionsMenuProps {
  group: AdminGroupWithPosts
  onViewPosts: (group: AdminGroupWithPosts) => void
  onEdit: (group: AdminGroupWithPosts) => void
  onToggleCompleted: (groupId: string) => void
  onDelete: (group: AdminGroupWithPosts) => void
}

export function GroupActionsMenu({
  group,
  onViewPosts,
  onEdit,
  onToggleCompleted,
  onDelete,
}: GroupActionsMenuProps) {
  const [copiedSlug, setCopiedSlug] = useState(false)

  const handleCopySlug = async () => {
    try {
      await navigator.clipboard.writeText(group.slug)
      setCopiedSlug(true)
      window.setTimeout(() => setCopiedSlug(false), 1500)
    } catch {
      // Clipboard may be unavailable in restricted contexts
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
            aria-label={`Actions for ${group.title}`}
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
            onClick={() => onViewPosts(group)}
          >
            <ListOrdered className="size-3.5 text-muted-foreground" />
            <span>View Articles ({group.posts.length})</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={() => onEdit(group)}
          >
            <Pencil className="size-3.5 text-muted-foreground" />
            <span>Edit Series</span>
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
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onClick={() => onToggleCompleted(group.id)}
        >
          {group.isCompleted ? (
            <>
              <Clock className="size-3.5 text-amber-500" />
              <span>Mark as In Progress</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              <span>Mark as Completed</span>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer text-xs"
          onClick={() => onDelete(group)}
        >
          <Trash2 className="size-3.5" />
          <span>Delete Series</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
