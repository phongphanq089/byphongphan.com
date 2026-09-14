import { registerPlugin } from "filepond"
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size"
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import { FilePond } from "react-filepond"

import { cn } from "@/shared/lib/utils"

// Register plugins once
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType
)

export interface FileUploadProps {
  files?: unknown[]
  onupdatefiles?: (fileItems: unknown[]) => void
  allowMultiple?: boolean
  maxFiles?: number
  maxFileSize?: string
  acceptedFileTypes?: string[]
  variant?: "cover" | "avatar" | "gallery"
  labelIdle?: string
  disabled?: boolean
  className?: string
  imagePreviewHeight?: number
}

const DEFAULT_LABEL = `
  <div class="flex flex-col items-center gap-1.5 py-2 pointer-events-none">
    <div class="flex size-9 items-center justify-center rounded-lg border border-border/80 bg-muted/50 text-muted-foreground shadow-2xs">
      <svg class="size-4 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
        <path d="M12 12v9"/>
        <path d="m16 16-4-4-4 4"/>
      </svg>
    </div>
    <div class="text-xs font-medium text-foreground">
      <span class="filepond--label-action font-semibold text-primary">Click to upload</span> or drag and drop
    </div>
    <p class="text-[11px] text-muted-foreground">
      PNG, JPG, WebP or SVG (max 10MB)
    </p>
  </div>
`

const AVATAR_LABEL = `
  <div class="flex flex-col items-center justify-center p-2 text-center pointer-events-none">
    <svg class="size-5 text-primary mb-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" x2="12" y1="3" y2="15"/>
    </svg>
    <span class="text-[11px] font-medium text-foreground">Upload Avatar</span>
  </div>
`

export function FileUpload({
  files,
  onupdatefiles,
  allowMultiple = false,
  maxFiles = 1,
  maxFileSize = "10MB",
  acceptedFileTypes = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/svg+xml",
    "image/gif",
  ],
  variant = "cover",
  labelIdle,
  disabled = false,
  className,
  imagePreviewHeight,
}: FileUploadProps) {
  const isAvatar = variant === "avatar"

  return (
    <div
      className={cn(
        "file-upload-wrapper w-full",
        isAvatar && "filepond-avatar-mode mx-auto max-w-[140px]",
        className
      )}
    >
      <FilePond
        files={files}
        onupdatefiles={onupdatefiles}
        allowMultiple={allowMultiple}
        maxFiles={maxFiles}
        maxFileSize={maxFileSize}
        acceptedFileTypes={acceptedFileTypes}
        disabled={disabled}
        labelIdle={labelIdle || (isAvatar ? AVATAR_LABEL : DEFAULT_LABEL)}
        stylePanelLayout={isAvatar ? "compact circle" : "integrated"}
        imagePreviewHeight={imagePreviewHeight || (isAvatar ? 120 : 180)}
        credits={false}
      />
    </div>
  )
}
