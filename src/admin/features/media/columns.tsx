import { format } from "date-fns"
import { Film, Music } from "lucide-react"

import { AdminMediaThumbnail } from "@/admin"
import { Badge, Checkbox } from "@/shared/ui"

import { MediaActionsMenu } from "./components/media-actions-menu"
import { MediaKindBadge } from "./components/media-kind-badge"
import { mediaColumnHelper } from "./table-config"
import type { AdminMediaAsset } from "./types"
import { formatDuration, formatFileSize, MEDIA_FOLDER_LABELS } from "./utils"

interface CreateMediaColumnsOptions {
  onInspect: (asset: AdminMediaAsset) => void
  onDelete: (asset: AdminMediaAsset) => void
}

export function createMediaColumns({
  onInspect,
  onDelete,
}: CreateMediaColumnsOptions) {
  return mediaColumnHelper.columns([
    mediaColumnHelper.display({
      id: "select",
      header: ({ table }) => (
        <span className="inline-flex items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={
              table.getIsSomePageRowsSelected() &&
              !table.getIsAllPageRowsSelected()
            }
            onCheckedChange={(checked) =>
              table.toggleAllPageRowsSelected(Boolean(checked))
            }
            aria-label="Select all rows on page"
          />
        </span>
      ),
      cell: ({ row }) => (
        <span
          className="inline-flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
            aria-label={`Select ${row.original.name}`}
          />
        </span>
      ),
    }),
    mediaColumnHelper.accessor("name", {
      header: "Asset",
      cell: ({ row }) => {
        const asset = row.original
        return (
          <div className="flex min-w-0 items-center gap-3 py-0.5">
            {asset.kind === "image" ? (
              <AdminMediaThumbnail
                src={asset.thumbnailUrl || asset.url}
                alt={asset.altText}
                title={asset.name}
                className="size-10 shrink-0 rounded-lg"
                iconClassName="size-4"
              />
            ) : asset.kind === "video" ? (
              <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/70 bg-zinc-900 text-white">
                {asset.thumbnailUrl ? (
                  <img
                    src={asset.thumbnailUrl}
                    alt={asset.name}
                    className="h-full w-full object-cover opacity-70"
                  />
                ) : null}
                <Film className="absolute size-4 drop-shadow" />
              </div>
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Music className="size-4" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => onInspect(asset)}
                className="block max-w-64 truncate text-left text-xs font-semibold text-foreground hover:underline"
              >
                {asset.name}
              </button>
              <p className="truncate font-mono text-[11px] text-muted-foreground">
                {asset.fileName} · {asset.mimeType}
              </p>
            </div>
          </div>
        )
      },
    }),
    mediaColumnHelper.accessor("kind", {
      header: "Type",
      cell: ({ row }) => <MediaKindBadge kind={row.original.kind} />,
    }),
    mediaColumnHelper.accessor("folder", {
      header: "Folder",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-[11px] font-normal">
          {MEDIA_FOLDER_LABELS[row.original.folder]}
        </Badge>
      ),
    }),
    mediaColumnHelper.display({
      id: "specs",
      header: "Dimensions / Duration",
      cell: ({ row }) => {
        const { width, height, durationSeconds } = row.original
        if (durationSeconds) {
          return (
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {formatDuration(durationSeconds)}
              {width && height ? ` · ${width}×${height}` : ""}
            </span>
          )
        }
        if (width && height) {
          return (
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {width} × {height}
            </span>
          )
        }
        return <span className="text-xs text-muted-foreground">—</span>
      },
    }),
    mediaColumnHelper.accessor("sizeBytes", {
      header: "Size",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {formatFileSize(row.original.sizeBytes)}
        </span>
      ),
    }),
    mediaColumnHelper.accessor("createdAt", {
      header: "Uploaded",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground tabular-nums">
          {format(new Date(row.original.createdAt), "MMM d, yyyy")}
        </span>
      ),
    }),
    mediaColumnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <MediaActionsMenu
            asset={row.original}
            onInspect={onInspect}
            onDelete={onDelete}
          />
        </div>
      ),
    }),
  ])
}
