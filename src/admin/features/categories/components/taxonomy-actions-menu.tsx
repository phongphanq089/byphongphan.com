import { Check, Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
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

interface TaxonomyActionsMenuProps {
  title: string
  slug: string
  itemLabel: string
  onEdit: () => void
  onDelete: () => void
}

export function TaxonomyActionsMenu({
  title,
  slug,
  itemLabel,
  onEdit,
  onDelete,
}: TaxonomyActionsMenuProps) {
  const [copiedSlug, setCopiedSlug] = useState(false)

  const handleCopySlug = async () => {
    try {
      await navigator.clipboard.writeText(slug)
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
            aria-label={`Actions for ${title}`}
            className="text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-44 text-xs">
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer text-xs" onClick={onEdit}>
            <Pencil className="size-3.5 text-muted-foreground" />
            <span>Edit {itemLabel}</span>
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
          variant="destructive"
          className="cursor-pointer text-xs"
          onClick={onDelete}
        >
          <Trash2 className="size-3.5" />
          <span>Delete {itemLabel}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
