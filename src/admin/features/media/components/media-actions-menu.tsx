import {
  Check,
  Copy,
  Download,
  Eye,
  MoreHorizontal,
  Trash2,
} from "lucide-react"
import { useState } from "react"

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui"

import type { AdminMediaAsset } from "../types"

interface MediaActionsMenuProps {
  asset: AdminMediaAsset
  onInspect: (asset: AdminMediaAsset) => void
  onDelete: (asset: AdminMediaAsset) => void
}

export function MediaActionsMenu({
  asset,
  onInspect,
  onDelete,
}: MediaActionsMenuProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyUrl = () => {
    void navigator.clipboard.writeText(asset.url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${asset.name}`}
            onClick={(e) => e.stopPropagation()}
          />
        }
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 text-xs">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            onInspect(asset)
          }}
        >
          <Eye className="mr-2 size-3.5 text-muted-foreground" />
          <span>Preview &amp; Details</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            handleCopyUrl()
          }}
        >
          {copied ? (
            <Check className="mr-2 size-3.5 text-emerald-500" />
          ) : (
            <Copy className="mr-2 size-3.5 text-muted-foreground" />
          )}
          <span>{copied ? "Copied URL" : "Copy Asset URL"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          render={
            <a
              href={asset.url}
              download={asset.fileName}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            />
          }
        >
          <Download className="mr-2 size-3.5 text-muted-foreground" />
          <span>Download File</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(asset)
          }}
        >
          <Trash2 className="mr-2 size-3.5" />
          <span>Delete Asset</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
