import {
  Check,
  Copy,
  ExternalLink,
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

import type { AdminResource } from "../types"

interface ResourceActionsMenuProps {
  resource: AdminResource
  onEdit: (resource: AdminResource) => void
  onToggleFeatured: (resourceId: string) => void
  onDelete: (resource: AdminResource) => void
}

export function ResourceActionsMenu({
  resource,
  onEdit,
  onToggleFeatured,
  onDelete,
}: ResourceActionsMenuProps) {
  const [copiedSlug, setCopiedSlug] = useState(false)

  const handleCopySlug = async () => {
    try {
      await navigator.clipboard.writeText(resource.slug)
      setCopiedSlug(true)
      window.setTimeout(() => setCopiedSlug(false), 1500)
    } catch {
      // Clipboard may be unavailable
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
            aria-label={`Actions for ${resource.title}`}
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
            render={<a href={resource.url} target="_blank" rel="noreferrer" />}
          >
            <ExternalLink className="size-3.5 text-muted-foreground" />
            <span>Visit Website</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={() => onEdit(resource)}
          >
            <Pencil className="size-3.5 text-muted-foreground" />
            <span>Edit Resource</span>
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
          onClick={() => onToggleFeatured(resource.id)}
        >
          <Star
            className={
              resource.isFeatured
                ? "size-3.5 fill-amber-400 text-amber-400"
                : "size-3.5 text-muted-foreground"
            }
          />
          <span>
            {resource.isFeatured ? "Remove Featured" : "Mark as Featured"}
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer text-xs"
          onClick={() => onDelete(resource)}
        >
          <Trash2 className="size-3.5" />
          <span>Delete Resource</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
