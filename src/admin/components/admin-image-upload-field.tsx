import { ImageIcon, Upload, X } from "lucide-react"
import { type ChangeEvent, type DragEvent, useRef, useState } from "react"

import { cn } from "@/shared/lib/utils"
import { Button, Label } from "@/shared/ui"

export interface AdminImageUploadFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  accept?: string
  variant?: "og" | "compact"
  previewTheme?: "default" | "dark"
  className?: string
}

function getFileLabel(value: string): string {
  if (!value) return ""
  if (value.startsWith("blob:")) return "Local file (preview)"
  const clean = value.split("?")[0]
  const parts = clean.split("/")
  return parts[parts.length - 1] || value
}

export function AdminImageUploadField({
  id,
  label,
  value,
  onChange,
  hint = "PNG, JPG, WebP or SVG",
  accept = "image/*",
  variant = "compact",
  previewTheme = "default",
  className,
}: AdminImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [hasImageError, setHasImageError] = useState(false)

  const handleFile = (file: File | undefined) => {
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setFileName(file.name)
    setHasImageError(false)
    onChange(previewUrl)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0])
    e.target.value = ""
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const handleClear = () => {
    setFileName(null)
    setHasImageError(false)
    onChange("")
  }

  const displayName = fileName ?? getFileLabel(value)

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id} className="text-xs">
          {label}
        </Label>
        {hint && (
          <span className="text-[11px] text-muted-foreground">{hint}</span>
        )}
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="sr-only"
      />

      {variant === "og" ? (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "overflow-hidden rounded-xl border transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border/80 bg-muted/20"
          )}
        >
          {value ? (
            <div className="space-y-3 p-3">
              <div className="relative aspect-[1.91/1] w-full overflow-hidden rounded-lg border border-border/70 bg-muted/40">
                {!hasImageError ? (
                  <img
                    src={value}
                    alt={label}
                    onError={() => setHasImageError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
                    <ImageIcon className="size-7 opacity-50" />
                    <span className="font-mono text-[11px]">{value}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="min-w-0 truncate font-mono text-[11px] text-muted-foreground">
                  {displayName}
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1.5 px-2.5 text-xs"
                    onClick={() => inputRef.current?.click()}
                  >
                    <Upload className="size-3" />
                    <span>Replace File</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleClear}
                    aria-label={`Remove ${label}`}
                    className="size-7 text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 border-dashed px-4 py-8 text-center transition-colors hover:bg-muted/40"
            >
              <div className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-xs">
                <Upload className="size-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-foreground">
                  Click to upload or drag &amp; drop
                </p>
                <p className="text-[11px] text-muted-foreground">{hint}</p>
              </div>
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex items-center gap-3 rounded-xl border p-2.5 transition-colors",
            value
              ? "border-border/80 bg-muted/20"
              : "border-dashed border-border/80 bg-muted/10",
            isDragging && "border-primary bg-primary/5"
          )}
        >
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/70",
              previewTheme === "dark" ? "bg-zinc-950" : "bg-background"
            )}
          >
            {value && !hasImageError ? (
              <img
                src={value}
                alt={label}
                onError={() => setHasImageError(true)}
                className="size-7 object-contain"
              />
            ) : (
              <ImageIcon className="size-4 text-muted-foreground/60" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            {value ? (
              <>
                <p className="truncate font-mono text-xs font-medium text-foreground">
                  {displayName}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  Ready for upload
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-medium text-foreground">
                  No file selected
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  Drop file here or click Upload
                </p>
              </>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 px-2.5 text-xs"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="size-3" />
              <span>{value ? "Change" : "Upload"}</span>
            </Button>
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleClear}
                aria-label={`Remove ${label}`}
                className="size-8 text-muted-foreground hover:text-destructive"
              >
                <X className="size-3.5" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
