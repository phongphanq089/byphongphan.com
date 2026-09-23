import type { LexicalEditor } from "lexical"
import {
  AlertCircle,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Check,
  ImagePlus,
  Link2,
  Loader2,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react"
import * as React from "react"

import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog"
import { INSERT_IMAGE_COMMAND } from "../../nodes/image-node"
import { cn } from "../../utils/cn"
import { sanitizeUrl } from "../../utils/url"

export interface GalleryItem {
  id: string
  title: string
  category: "minimal" | "nature" | "workspace" | "texture"
  src: string
  thumbnail: string
  alt: string
  caption: string
  resolution: string
}

export const CURATED_GALLERY: GalleryItem[] = [
  {
    id: "abstract-fluid",
    title: "Chromatic Waves",
    category: "minimal",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
    alt: "Abstract chromatic 3D fluid art",
    caption: "Chromatic 3D fluid gradient surface",
    resolution: "1600 × 1067",
  },
  {
    id: "minimal-sphere",
    title: "Monochrome Sphere",
    category: "minimal",
    src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=400&q=80",
    alt: "Minimalist glass geometric render",
    caption: "Minimalist studio render with frosted glass",
    resolution: "1600 × 1200",
  },
  {
    id: "glass-prism",
    title: "Prism Refraction",
    category: "minimal",
    src: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80",
    alt: "Prismatic light reflection and dispersion",
    caption: "Optical glass prism with spectral caustic reflections",
    resolution: "1600 × 1067",
  },
  {
    id: "mountain-mist",
    title: "Alpine Mist",
    category: "nature",
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
    alt: "Dramatic misty alpine mountain ridge",
    caption: "Alpine mountain peak enveloped in morning mist",
    resolution: "1600 × 1067",
  },
  {
    id: "ocean-waves",
    title: "Deep Tide",
    category: "nature",
    src: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=400&q=80",
    alt: "Deep blue ocean aerial view",
    caption: "Aerial perspective of rolling ocean swell",
    resolution: "1600 × 1067",
  },
  {
    id: "forest-canopy",
    title: "Emerald Canopy",
    category: "nature",
    src: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80",
    alt: "Sunlight filtering through evergreen forest canopy",
    caption: "Primeval forest canopy illuminated by morning sunlight",
    resolution: "1600 × 1067",
  },
  {
    id: "workspace-minimal",
    title: "Architectural Desk",
    category: "workspace",
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
    alt: "Clean minimalist design office workspace",
    caption: "Contemporary architectural work environment",
    resolution: "1600 × 1067",
  },
  {
    id: "workspace-stationery",
    title: "Studio Notebooks",
    category: "workspace",
    src: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=400&q=80",
    alt: "High craft stationery and writing accessories",
    caption: "Artisanal notebooks and fountain pen curation",
    resolution: "1600 × 1067",
  },
  {
    id: "workspace-coding",
    title: "Engineer Setup",
    category: "workspace",
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80",
    alt: "Code editor on screen in dark environment",
    caption: "Focused engineering workstation in dark mode",
    resolution: "1600 × 1067",
  },
  {
    id: "texture-paper",
    title: "Handmade Parchment",
    category: "texture",
    src: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=400&q=80",
    alt: "Textured handmade deckle edge paper",
    caption: "Raw deckled paper texture with fiber details",
    resolution: "1600 × 1067",
  },
  {
    id: "texture-concrete",
    title: "Brutalist Concrete",
    category: "texture",
    src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
    alt: "Minimalist raw concrete wall surface",
    caption: "Architectural cast concrete with fine pores",
    resolution: "1600 × 1067",
  },
  {
    id: "texture-marble",
    title: "Carrara Marble",
    category: "texture",
    src: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=400&q=80",
    alt: "Smooth marble surface with organic veins",
    caption: "Fine Carrara marble veining pattern",
    resolution: "1600 × 1067",
  },
]

export interface InsertImageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editor: LexicalEditor
  onUploadImage?: (file: File) => Promise<string>
}

type TabMode = "upload" | "url" | "gallery"

export function InsertImageDialog({
  open,
  onOpenChange,
  editor,
  onUploadImage,
}: InsertImageDialogProps) {
  const [activeTab, setActiveTab] = React.useState<TabMode>("upload")

  // Selected or prepared image state
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [filePreviewUrl, setFilePreviewUrl] = React.useState<string>("")
  const [fileDimensions, setFileDimensions] = React.useState<{
    width: number
    height: number
  } | null>(null)

  // URL state
  const [inputUrl, setInputUrl] = React.useState("")
  const [urlPreviewStatus, setUrlPreviewStatus] = React.useState<
    "idle" | "loading" | "valid" | "error"
  >("idle")
  const [urlDimensions, setUrlDimensions] = React.useState<{
    width: number
    height: number
  } | null>(null)

  // Gallery state
  const [galleryCategory, setGalleryCategory] = React.useState<
    "all" | "minimal" | "nature" | "workspace" | "texture"
  >("all")
  const [selectedGalleryItem, setSelectedGalleryItem] =
    React.useState<GalleryItem | null>(null)

  // Common image options
  const [altText, setAltText] = React.useState("")
  const [caption, setCaption] = React.useState("")
  const [sizePreset, setSizePreset] = React.useState<
    "small" | "medium" | "large" | "full"
  >("medium")
  const [alignment, setAlignment] = React.useState<"left" | "center" | "right">(
    "center"
  )

  // Upload progress
  const [isUploading, setIsUploading] = React.useState(false)
  const [isDragOver, setIsDragOver] = React.useState(false)

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Clean state when modal opens/closes
  React.useEffect(() => {
    if (!open) {
      setSelectedFile(null)
      setFilePreviewUrl("")
      setFileDimensions(null)
      setInputUrl("")
      setUrlPreviewStatus("idle")
      setUrlDimensions(null)
      setSelectedGalleryItem(null)
      setAltText("")
      setCaption("")
      setIsUploading(false)
    }
  }, [open])

  // Handle URL changes with async image preloader
  React.useEffect(() => {
    if (!inputUrl.trim()) {
      setUrlPreviewStatus("idle")
      setUrlDimensions(null)
      return
    }

    const sanitized = sanitizeUrl(inputUrl.trim())
    if (!sanitized || sanitized === "about:blank") {
      setUrlPreviewStatus("error")
      return
    }

    setUrlPreviewStatus("loading")
    const img = new Image()
    img.src = sanitized

    img.onload = () => {
      setUrlPreviewStatus("valid")
      setUrlDimensions({ width: img.naturalWidth, height: img.naturalHeight })
      if (!altText) {
        setAltText("Web Image")
      }
    }

    img.onerror = () => {
      setUrlPreviewStatus("error")
      setUrlDimensions(null)
    }
  }, [inputUrl, altText])

  // Process selected file
  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return

    setSelectedFile(file)
    const objectUrl = URL.createObjectURL(file)
    setFilePreviewUrl(objectUrl)
    setAltText(file.name.replace(/\.[^/.]+$/, ""))

    const img = new Image()
    img.src = objectUrl
    img.onload = () => {
      setFileDimensions({ width: img.naturalWidth, height: img.naturalHeight })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const file = e.clipboardData.files?.[0]
    if (file && file.type.startsWith("image/")) {
      e.preventDefault()
      processFile(file)
    }
  }

  // Filter gallery
  const filteredGallery = React.useMemo(() => {
    if (galleryCategory === "all") return CURATED_GALLERY
    return CURATED_GALLERY.filter((item) => item.category === galleryCategory)
  }, [galleryCategory])

  // Compute final width
  const computedWidth = React.useMemo(() => {
    switch (sizePreset) {
      case "small":
        return 320
      case "medium":
        return 600
      case "large":
        return 900
      case "full":
      default:
        return "inherit"
    }
  }, [sizePreset])

  // Can submit check
  const canSubmit = React.useMemo(() => {
    if (activeTab === "upload") return Boolean(selectedFile || filePreviewUrl)
    if (activeTab === "url") return urlPreviewStatus === "valid"
    if (activeTab === "gallery") return Boolean(selectedGalleryItem)
    return false
  }, [
    activeTab,
    selectedFile,
    filePreviewUrl,
    urlPreviewStatus,
    selectedGalleryItem,
  ])

  const handleInsert = async () => {
    if (!canSubmit) return

    let finalSrc = ""
    let finalAlt = altText || "Image"
    let finalCaption = caption || undefined

    setIsUploading(true)

    try {
      if (activeTab === "upload") {
        if (selectedFile) {
          if (onUploadImage) {
            finalSrc = await onUploadImage(selectedFile)
          } else {
            // Data URL fallback
            finalSrc = await new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.readAsDataURL(selectedFile)
            })
          }
        } else if (filePreviewUrl) {
          finalSrc = filePreviewUrl
        }
      } else if (activeTab === "url") {
        finalSrc = sanitizeUrl(inputUrl.trim())
      } else if (activeTab === "gallery" && selectedGalleryItem) {
        finalSrc = selectedGalleryItem.src
        if (!finalAlt) finalAlt = selectedGalleryItem.alt
        if (!finalCaption) finalCaption = selectedGalleryItem.caption
      }

      if (finalSrc) {
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
          src: finalSrc,
          altText: finalAlt,
          caption: finalCaption,
          width: computedWidth,
          alignment,
        })
        onOpenChange(false)
      }
    } catch (err) {
      console.error("[InsertImageDialog] Failed to upload/insert image:", err)
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPaste={handlePaste}
        className="overflow-hidden rounded-2xl border-border/60 bg-card/95 p-0 shadow-2xl backdrop-blur-xl select-none sm:max-w-[560px]"
      >
        {/* Header with craft styling */}
        <div className="flex items-center justify-between border-b border-border/50 bg-muted/20 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
              <ImagePlus className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-semibold tracking-tight text-foreground">
                Insert Image
              </DialogTitle>
              <p className="text-[11px] text-muted-foreground">
                Upload local file, link web image, or choose from curated studio
                gallery
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="px-5 pt-3.5 pb-2">
          <div className="flex items-center rounded-lg bg-muted/40 p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={cn(
                "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all",
                activeTab === "upload"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <UploadCloud className="size-3.5" />
              <span>Upload File</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("url")}
              className={cn(
                "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all",
                activeTab === "url"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Link2 className="size-3.5" />
              <span>Web URL</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("gallery")}
              className={cn(
                "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all",
                activeTab === "gallery"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles className="size-3.5 text-amber-500" />
              <span>Curated Presets</span>
            </button>
          </div>
        </div>

        {/* Tab Body Content */}
        <div className="max-h-[62vh] scrollbar-thin space-y-4 overflow-y-auto px-5 py-2">
          {/* TAB 1: FILE UPLOAD */}
          {activeTab === "upload" && (
            <div className="space-y-3">
              {!filePreviewUrl ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragOver(true)
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-7 text-center transition-all",
                    isDragOver
                      ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                      : "border-border/70 bg-muted/10 hover:border-primary/50 hover:bg-muted/30"
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="mb-2.5 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-105">
                    <UploadCloud className="size-5" />
                  </div>
                  <p className="text-xs font-semibold text-foreground">
                    Drag & drop your image here, or{" "}
                    <span className="text-primary underline underline-offset-2">
                      browse files
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Supports PNG, JPG, WebP, GIF, SVG (up to 10MB) · Clipboard
                    paste enabled
                  </p>
                </div>
              ) : (
                <div className="relative flex items-center gap-3.5 rounded-xl border border-border/70 bg-card p-3 shadow-xs">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted/40">
                    <img
                      src={filePreviewUrl}
                      alt={selectedFile?.name || "Preview"}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="truncate text-xs font-semibold text-foreground">
                      {selectedFile?.name || "Uploaded image"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                      {selectedFile && (
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono">
                          {formatFileSize(selectedFile.size)}
                        </span>
                      )}
                      {fileDimensions && (
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono">
                          {fileDimensions.width} × {fileDimensions.height} px
                        </span>
                      )}
                      <span className="flex items-center gap-1 font-medium text-emerald-600">
                        <Check className="size-3" /> Ready
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null)
                      setFilePreviewUrl("")
                      setFileDimensions(null)
                    }}
                    className="size-7 cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="Remove file"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WEB URL */}
          {activeTab === "url" && (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground">
                  Image Web Link
                </label>
                <div className="relative flex items-center">
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full rounded-lg border border-input bg-background/80 px-3 py-2 pr-8 text-xs text-foreground transition-all outline-none placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    autoFocus
                  />
                  {inputUrl && (
                    <button
                      type="button"
                      onClick={() => setInputUrl("")}
                      className="absolute right-2 cursor-pointer text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* URL Preview State */}
              {urlPreviewStatus === "loading" && (
                <div className="flex items-center gap-2 px-1 py-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin text-primary" />
                  <span>Verifying image link...</span>
                </div>
              )}

              {urlPreviewStatus === "valid" && (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border/50 bg-background">
                    <img
                      src={inputUrl}
                      alt="URL preview"
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <Check className="size-3.5" /> Valid Image Loaded
                    </p>
                    {urlDimensions && (
                      <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                        Resolution: {urlDimensions.width} ×{" "}
                        {urlDimensions.height} px
                      </p>
                    )}
                  </div>
                </div>
              )}

              {urlPreviewStatus === "error" && (
                <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>
                    Unable to preview image. Please check that the URL points
                    directly to an image file.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CURATED GALLERY */}
          {activeTab === "gallery" && (
            <div className="space-y-3">
              {/* Category selector */}
              <div className="flex flex-wrap items-center gap-1">
                {(
                  [
                    ["all", "All Presets"],
                    ["minimal", "Minimal 3D"],
                    ["nature", "Nature"],
                    ["workspace", "Workspace"],
                    ["texture", "Textures"],
                  ] as const
                ).map(([cat, label]) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setGalleryCategory(cat)}
                    className={cn(
                      "cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                      galleryCategory === cat
                        ? "bg-primary font-semibold text-primary-foreground shadow-2xs"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {filteredGallery.map((item) => {
                  const isSelected = selectedGalleryItem?.id === item.id
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedGalleryItem(item)
                        if (!altText) setAltText(item.alt)
                        if (!caption) setCaption(item.caption)
                      }}
                      className={cn(
                        "group relative aspect-4/3 cursor-pointer overflow-hidden rounded-lg border bg-muted/40 transition-all",
                        isSelected
                          ? "border-primary shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background"
                          : "border-border/60 hover:border-border hover:shadow-xs"
                      )}
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.alt}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      {isSelected && (
                        <div className="backdrop-blur-2xs absolute inset-0 flex items-center justify-center bg-primary/20">
                          <div className="rounded-full bg-primary p-1 text-primary-foreground shadow-md">
                            <Check className="size-3.5 stroke-[3]" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 opacity-90 transition-opacity">
                        <p className="truncate text-[10px] font-medium text-white">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* UNIVERSAL SETTINGS: Alt, Caption, Size & Alignment */}
          <div className="space-y-3 border-t border-border/50 pt-3.5">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                  Alt Text (Accessibility)
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe image for screen readers..."
                  className="w-full rounded-md border border-input bg-background/80 px-2.5 py-1.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Caption under the image..."
                  className="w-full rounded-md border border-input bg-background/80 px-2.5 py-1.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Size & Alignment Pill Selectors */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-muted-foreground">
                  Size:
                </span>
                <div className="flex items-center rounded-md bg-muted/60 p-0.5 text-[11px]">
                  {(
                    [
                      ["small", "Small (320)"],
                      ["medium", "Medium (600)"],
                      ["large", "Large (900)"],
                      ["full", "Full Width"],
                    ] as const
                  ).map(([sz, label]) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSizePreset(sz)}
                      className={cn(
                        "cursor-pointer rounded px-2 py-0.5 font-medium transition-colors",
                        sizePreset === sz
                          ? "bg-background font-semibold text-foreground shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-muted-foreground">
                  Align:
                </span>
                <div className="flex items-center rounded-md bg-muted/60 p-0.5">
                  <button
                    type="button"
                    onClick={() => setAlignment("left")}
                    className={cn(
                      "cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:text-foreground",
                      alignment === "left" &&
                        "bg-background text-foreground shadow-2xs"
                    )}
                    title="Align Left"
                  >
                    <AlignLeft className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlignment("center")}
                    className={cn(
                      "cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:text-foreground",
                      alignment === "center" &&
                        "bg-background text-foreground shadow-2xs"
                    )}
                    title="Align Center"
                  >
                    <AlignCenter className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlignment("right")}
                    className={cn(
                      "cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:text-foreground",
                      alignment === "right" &&
                        "bg-background text-foreground shadow-2xs"
                    )}
                    title="Align Right"
                  >
                    <AlignRight className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border/50 bg-muted/20 px-5 py-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={!canSubmit || isUploading}
            onClick={handleInsert}
            className="gap-1.5 px-4 text-xs font-semibold"
          >
            {isUploading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <ImagePlus className="size-3.5" />
                <span>Insert Image</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
