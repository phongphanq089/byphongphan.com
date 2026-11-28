import { Upload, X } from "lucide-react"
import { type ChangeEvent, type DragEvent, useRef, useState } from "react"

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui"

import type { AdminMediaAsset, MediaFolder, MediaKind } from "../types"
import { formatFileSize, MEDIA_FOLDER_LABELS } from "../utils"
import { MediaKindBadge } from "./media-kind-badge"

interface MediaUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (assets: AdminMediaAsset[]) => void
}

interface StagedFile {
  id: string
  file: File
  kind: MediaKind
  previewUrl: string
}

function detectMediaKind(mimeType: string): MediaKind {
  if (mimeType.startsWith("video/")) return "video"
  if (mimeType.startsWith("audio/")) return "audio"
  return "image"
}

function formatAssetTitle(fileName: string): string {
  const withoutExt = fileName.replace(/\.[^/.]+$/, "")
  return withoutExt
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function MediaUploadDialog({
  open,
  onOpenChange,
  onUpload,
}: MediaUploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [folder, setFolder] = useState<MediaFolder>("blog")
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const addFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return

    const nextItems: StagedFile[] = Array.from(fileList).map((file, idx) => ({
      id: `${file.name}-${Date.now()}-${idx}`,
      file,
      kind: detectMediaKind(file.type),
      previewUrl: URL.createObjectURL(file),
    }))

    setStagedFiles((prev) => [...prev, ...nextItems])
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files)
    e.target.value = ""
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const handleRemoveStaged = (id: string) => {
    setStagedFiles((prev) => prev.filter((item) => item.id !== id))
  }

  const handleConfirmUpload = () => {
    if (stagedFiles.length === 0) return

    const now = new Date().toISOString()
    const createdAssets: AdminMediaAsset[] = stagedFiles.map((item) => ({
      id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: formatAssetTitle(item.file.name),
      fileName: item.file.name,
      kind: item.kind,
      mimeType: item.file.type || "application/octet-stream",
      folder,
      url: item.previewUrl,
      thumbnailUrl: item.kind === "image" ? item.previewUrl : undefined,
      sizeBytes: item.file.size,
      altText: formatAssetTitle(item.file.name),
      usedInCount: 0,
      createdAt: now,
    }))

    onUpload(createdAssets)
    setStagedFiles([])
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) setStagedFiles([])
        onOpenChange(nextOpen)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Media Assets</DialogTitle>
          <DialogDescription>
            Add images, videos, or audio files to your media library.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label className="text-xs">Destination Folder</Label>
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
                  Object.entries(MEDIA_FOLDER_LABELS) as [MediaFolder, string][]
                ).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*"
            onChange={handleInputChange}
            className="sr-only"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border/80 bg-muted/20 hover:bg-muted/40"
            }`}
          >
            <div className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-xs">
              <Upload className="size-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-foreground">
                Click to browse or drag &amp; drop files
              </p>
              <p className="text-[11px] text-muted-foreground">
                Supports Images (PNG, JPG, WebP, SVG), Videos (MP4, WebM), and
                Audio (MP3, WAV)
              </p>
            </div>
          </div>

          {stagedFiles.length > 0 && (
            <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
              {stagedFiles.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2.5 rounded-lg border border-border/70 bg-muted/20 px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-foreground">
                      {item.file.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <MediaKindBadge kind={item.kind} />
                      <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                        {formatFileSize(item.file.size)}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveStaged(item.id)}
                    aria-label={`Remove ${item.file.name}`}
                    className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={stagedFiles.length === 0}
            onClick={handleConfirmUpload}
            className="gap-1.5"
          >
            <Upload className="size-3.5" />
            <span>
              Upload{" "}
              {stagedFiles.length > 0 ? `(${stagedFiles.length})` : "Files"}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
