import { Music, Play } from "lucide-react"

import { AdminMediaThumbnail } from "@/admin"
import { Badge, Checkbox } from "@/shared/ui"

import type { AdminMediaAsset } from "../types"
import { formatDuration, formatFileSize, MEDIA_FOLDER_LABELS } from "../utils"
import { MediaActionsMenu } from "./media-actions-menu"
import { MediaKindBadge } from "./media-kind-badge"

interface MediaGridProps {
  assets: AdminMediaAsset[]
  isRowSelected: (id: string) => boolean
  onToggleSelect: (id: string) => void
  onInspect: (asset: AdminMediaAsset) => void
  onDelete: (asset: AdminMediaAsset) => void
}

const AUDIO_WAVEFORM_HEIGHTS = [
  28, 52, 76, 44, 88, 62, 34, 92, 58, 74, 40, 82, 50, 68, 36, 56,
]

export function MediaGrid({
  assets,
  isRowSelected,
  onToggleSelect,
  onInspect,
  onDelete,
}: MediaGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3 xl:grid-cols-4">
      {assets.map((asset) => {
        const selected = isRowSelected(asset.id)

        return (
          <div
            key={asset.id}
            onClick={() => onInspect(asset)}
            className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-card transition-all hover:border-border hover:shadow-sm ${
              selected
                ? "border-primary ring-1 ring-primary/40"
                : "border-border/70"
            }`}
          >
            {/* Preview Stage */}
            <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border/60 bg-muted/30">
              {asset.kind === "image" ? (
                <AdminMediaThumbnail
                  src={asset.thumbnailUrl || asset.url}
                  alt={asset.altText}
                  title={asset.name}
                  className="h-full w-full rounded-none border-0 transition-transform duration-300 group-hover:scale-[1.03]"
                  iconClassName="size-8"
                />
              ) : asset.kind === "video" ? (
                <div className="relative h-full w-full bg-zinc-950">
                  {asset.thumbnailUrl && (
                    <img
                      src={asset.thumbnailUrl}
                      alt={asset.name}
                      className="h-full w-full object-cover opacity-75 transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="flex size-10 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white backdrop-blur-xs transition-transform group-hover:scale-110">
                      <Play className="ml-0.5 size-4 fill-current" />
                    </span>
                  </div>
                  {asset.durationSeconds && (
                    <span className="absolute right-2 bottom-2 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white tabular-nums">
                      {formatDuration(asset.durationSeconds)}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2.5 bg-gradient-to-br from-emerald-500/10 via-muted/40 to-background px-4">
                  <div className="flex size-9 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <Music className="size-4" />
                  </div>
                  <div className="flex h-6 items-end gap-1" aria-hidden="true">
                    {AUDIO_WAVEFORM_HEIGHTS.map((height, index) => (
                      <span
                        key={index}
                        style={{ height: `${height}%` }}
                        className="w-1 rounded-full bg-emerald-500/45 transition-colors group-hover:bg-emerald-500/75"
                      />
                    ))}
                  </div>
                  {asset.durationSeconds && (
                    <span className="absolute right-2 bottom-2 rounded bg-background/85 px-1.5 py-0.5 font-mono text-[10px] font-medium text-foreground tabular-nums shadow-xs">
                      {formatDuration(asset.durationSeconds)}
                    </span>
                  )}
                </div>
              )}

              {/* Top-left selection checkbox */}
              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute top-2.5 left-2.5 rounded-md border border-border/70 bg-background/90 p-1 shadow-xs backdrop-blur-xs transition-opacity ${
                  selected
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100 focus-within:opacity-100"
                }`}
              >
                <span className="inline-flex items-center justify-center">
                  <Checkbox
                    checked={selected}
                    onCheckedChange={() => onToggleSelect(asset.id)}
                    aria-label={`Select ${asset.name}`}
                  />
                </span>
              </div>

              {/* Top-right kind badge */}
              <div className="absolute top-2.5 right-2.5">
                <MediaKindBadge kind={asset.kind} />
              </div>
            </div>

            {/* Card Body */}
            <div className="flex flex-1 flex-col justify-between gap-2.5 p-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-xs font-semibold text-foreground">
                    {asset.name}
                  </h3>
                  <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                    {asset.fileName}
                  </p>
                </div>

                <MediaActionsMenu
                  asset={asset}
                  onInspect={onInspect}
                  onDelete={onDelete}
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 text-[11px] text-muted-foreground">
                <Badge variant="outline" className="text-[10px] font-normal">
                  {MEDIA_FOLDER_LABELS[asset.folder]}
                </Badge>

                <span className="font-mono tabular-nums">
                  {asset.width && asset.height
                    ? `${asset.width}×${asset.height} · `
                    : ""}
                  {formatFileSize(asset.sizeBytes)}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
