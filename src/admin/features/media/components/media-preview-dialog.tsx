import { format } from "date-fns"
import { Check, Copy, Download, Music, Save, Trash2 } from "lucide-react"
import { useState } from "react"

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
} from "@/shared/ui"

import type { AdminMediaAsset, MediaFolder } from "../types"
import { formatDuration, formatFileSize, MEDIA_FOLDER_LABELS } from "../utils"
import { MediaKindBadge } from "./media-kind-badge"

interface MediaPreviewDialogProps {
  asset: AdminMediaAsset | null
  onOpenChange: (open: boolean) => void
  onSaveMetadata: (
    id: string,
    updates: Pick<AdminMediaAsset, "name" | "altText" | "folder">
  ) => void
  onDelete: (asset: AdminMediaAsset) => void
}

export function MediaPreviewDialog({
  asset,
  onOpenChange,
  onSaveMetadata,
  onDelete,
}: MediaPreviewDialogProps) {
  return (
    <Dialog open={Boolean(asset)} onOpenChange={onOpenChange}>
      {asset ? (
        <MediaPreviewDialogContent
          key={asset.id}
          asset={asset}
          onOpenChange={onOpenChange}
          onSaveMetadata={onSaveMetadata}
          onDelete={onDelete}
        />
      ) : null}
    </Dialog>
  )
}

function MediaPreviewDialogContent({
  asset,
  onOpenChange,
  onSaveMetadata,
  onDelete,
}: Omit<MediaPreviewDialogProps, "asset"> & { asset: AdminMediaAsset }) {
  const [name, setName] = useState(asset.name)
  const [altText, setAltText] = useState(asset.altText)
  const [folder, setFolder] = useState<MediaFolder>(asset.folder)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    void navigator.clipboard.writeText(asset.url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  const handleSave = () => {
    onSaveMetadata(asset.id, {
      name: name.trim() || asset.name,
      altText: altText.trim(),
      folder,
    })
    onOpenChange(false)
  }

  return (
    <DialogContent className="sm:max-w-4xl">
      <DialogHeader>
        <div className="flex flex-wrap items-center gap-2">
          <DialogTitle className="truncate">{asset.name}</DialogTitle>
          <MediaKindBadge kind={asset.kind} />
        </div>
        <DialogDescription className="font-mono text-xs">
          {asset.fileName} · {asset.mimeType}
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        {/* Media Stage */}
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 p-4">
          <div className="flex min-h-64 flex-1 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-background">
            {asset.kind === "image" ? (
              <img
                src={asset.url}
                alt={asset.altText || asset.name}
                className="max-h-96 w-full object-contain"
              />
            ) : asset.kind === "video" ? (
              <video
                src={asset.url}
                poster={asset.thumbnailUrl}
                controls
                playsInline
                className="max-h-96 w-full rounded-lg bg-black"
              />
            ) : (
              <div className="flex w-full flex-col items-center justify-center gap-5 p-6">
                <div className="flex size-16 items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Music className="size-7" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">
                    {asset.name}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {asset.durationSeconds
                      ? formatDuration(asset.durationSeconds)
                      : "Audio Track"}
                  </p>
                </div>
                <audio src={asset.url} controls className="w-full max-w-sm" />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <Copy className="size-3.5" />
              )}
              <span>{copied ? "Copied URL" : "Copy URL"}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              asChild
            >
              <a
                href={asset.url}
                download={asset.fileName}
                target="_blank"
                rel="noreferrer"
              >
                <Download className="size-3.5" />
                <span>Download</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Inspector Form */}
        <div className="flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="media-inspector-name" className="text-xs">
                Display Name
              </Label>
              <Input
                id="media-inspector-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Folder</Label>
              <Select
                value={folder}
                onValueChange={(val) => {
                  if (val) setFolder(val as MediaFolder)
                }}
              >
                <SelectTrigger className="h-9 w-full text-xs">
                  <SelectValue>{MEDIA_FOLDER_LABELS[folder]}</SelectValue>
                </SelectTrigger>
                <SelectPopup>
                  {(
                    Object.entries(MEDIA_FOLDER_LABELS) as [
                      MediaFolder,
                      string,
                    ][]
                  ).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="media-inspector-alt" className="text-xs">
                Alt Text / Caption
              </Label>
              <Textarea
                id="media-inspector-alt"
                rows={3}
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Accessible description or caption..."
                className="min-h-20 resize-y text-xs"
              />
            </div>

            <Separator />

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div>
                <dt className="text-[11px] text-muted-foreground">File Size</dt>
                <dd className="font-mono font-medium text-foreground">
                  {formatFileSize(asset.sizeBytes)}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-muted-foreground">
                  {asset.durationSeconds ? "Duration" : "Dimensions"}
                </dt>
                <dd className="font-mono font-medium text-foreground">
                  {asset.durationSeconds
                    ? formatDuration(asset.durationSeconds)
                    : asset.width && asset.height
                      ? `${asset.width} × ${asset.height}`
                      : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-muted-foreground">Uploaded</dt>
                <dd className="font-medium text-foreground">
                  {format(new Date(asset.createdAt), "MMM d, yyyy")}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-muted-foreground">
                  References
                </dt>
                <dd className="font-medium text-foreground">
                  {asset.usedInCount} item{asset.usedInCount === 1 ? "" : "s"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                onOpenChange(false)
                onDelete(asset)
              }}
            >
              <Trash2 className="size-3.5" />
              <span>Delete</span>
            </Button>

            <Button
              type="button"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={handleSave}
            >
              <Save className="size-3.5" />
              <span>Save Details</span>
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
