import { X } from "lucide-react"

import { AdminMediaThumbnail } from "@/admin"
import { Button, Input, Label } from "@/shared/ui"

interface PostEditorCoverSectionProps {
  title: string
  coverImage: string
  coverImageAlt: string
  onCoverImageChange: (url: string) => void
  onCoverImageAltChange: (alt: string) => void
}

export function PostEditorCoverSection({
  title,
  coverImage,
  coverImageAlt,
  onCoverImageChange,
  onCoverImageAltChange,
}: PostEditorCoverSectionProps) {
  return (
    <div className="space-y-3.5 rounded-xl border border-border/70 bg-muted/20 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">Cover Image</span>
        <span className="font-mono text-[10px] text-muted-foreground">
          16:9 · posts.coverImage
        </span>
      </div>

      <AdminMediaThumbnail
        src={coverImage || null}
        alt={coverImageAlt || null}
        title={title || "Article cover preview"}
        className="aspect-[16/9] w-full rounded-lg"
        iconClassName="size-8"
      />

      <div className="space-y-1.5">
        <Label htmlFor="post-cover-url" className="text-xs">
          ImageKit URL
        </Label>
        <div className="flex items-center gap-1.5">
          <Input
            id="post-cover-url"
            value={coverImage}
            onChange={(e) => onCoverImageChange(e.target.value)}
            placeholder="https://ik.imagekit.io/... or /og-image.png"
            className="font-mono text-xs"
          />
          {coverImage && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onCoverImageChange("")}
              aria-label="Clear cover image"
              className="shrink-0"
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="post-cover-alt" className="text-xs">
          Alt Text
        </Label>
        <Input
          id="post-cover-alt"
          value={coverImageAlt}
          onChange={(e) => onCoverImageAltChange(e.target.value)}
          placeholder="Accessible image description..."
          className="text-xs"
        />
      </div>
    </div>
  )
}
