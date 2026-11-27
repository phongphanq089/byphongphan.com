import { Lock, RefreshCw, Type, Unlock } from "lucide-react"

import { AdminContentCard } from "@/admin"
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Label,
  Textarea,
} from "@/shared/ui"

import { type PostEditorFormValues, slugifyTitle } from "./post-editor.utils"
import { PostEditorCoverSection } from "./post-editor-cover-section"

interface PostEditorHeadlineCardProps {
  values: PostEditorFormValues
  isSlugLocked: boolean
  onToggleSlugLock: () => void
  onTitleChange: (title: string) => void
  onFieldChange: <K extends keyof PostEditorFormValues>(
    field: K,
    value: PostEditorFormValues[K]
  ) => void
}

export function PostEditorHeadlineCard({
  values,
  isSlugLocked,
  onToggleSlugLock,
  onTitleChange,
  onFieldChange,
}: PostEditorHeadlineCardProps) {
  return (
    <AdminContentCard
      title={
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <Type className="size-4 text-muted-foreground" />
          <span>Headline &amp; Summary</span>
        </span>
      }
      description="Article title, permalink slug, excerpt, and cover media"
      minHeight="min-h-0"
      padding="default"
      className="flex-none"
    >
      <div className="space-y-5">
        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="post-title" className="text-xs">
                Article Title
              </Label>
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {values.title.length}/255
              </span>
            </div>
            <Input
              id="post-title"
              maxLength={255}
              value={values.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Enter a clear, technical article headline..."
              className="h-10 text-base font-semibold"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="post-slug" className="text-xs">
                URL Slug
              </Label>
              <button
                type="button"
                onClick={() => {
                  const next = slugifyTitle(values.title)
                  if (next) onFieldChange("slug", next)
                }}
                className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <RefreshCw className="size-3" />
                <span>Regenerate from title</span>
              </button>
            </div>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <span className="font-mono text-xs text-muted-foreground">
                  /blog/
                </span>
              </InputGroupAddon>
              <InputGroupInput
                id="post-slug"
                value={values.slug}
                disabled={isSlugLocked}
                onChange={(e) => {
                  if (!isSlugLocked) {
                    onFieldChange("slug", e.target.value)
                  }
                }}
                placeholder="article-url-slug"
                className="font-mono text-xs"
              />
              <InputGroupAddon align="inline-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={onToggleSlugLock}
                  aria-label={
                    isSlugLocked
                      ? "Unlock slug editing"
                      : "Lock slug to auto-sync"
                  }
                >
                  {isSlugLocked ? (
                    <Lock className="size-3" />
                  ) : (
                    <Unlock className="size-3" />
                  )}
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="post-excerpt" className="text-xs">
                Excerpt
              </Label>
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {values.excerpt.length} chars
              </span>
            </div>
            <Textarea
              id="post-excerpt"
              value={values.excerpt}
              onChange={(e) => onFieldChange("excerpt", e.target.value)}
              placeholder="Concise summary displayed on blog cards and OpenGraph meta descriptions..."
              className="min-h-24 text-xs leading-relaxed"
            />
          </div>
        </div>

        <PostEditorCoverSection
          title={values.title}
          coverImage={values.coverImage}
          coverImageAlt={values.coverImageAlt}
          onCoverImageChange={(url) => onFieldChange("coverImage", url)}
          onCoverImageAltChange={(alt) => onFieldChange("coverImageAlt", alt)}
        />
      </div>
    </AdminContentCard>
  )
}
