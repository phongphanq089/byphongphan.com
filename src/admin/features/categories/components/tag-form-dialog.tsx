import { Lock, RefreshCw, Save, Unlock } from "lucide-react"
import { useState } from "react"

import { slugifyTitle } from "@/admin/features/posts/components/editor/post-editor.utils"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Label,
  Textarea,
} from "@/shared/ui"

import type { AdminTagWithCount, TagFormValues } from "../types"

interface TagFormDialogProps {
  open: boolean
  initialTag: AdminTagWithCount | null
  onOpenChange: (open: boolean) => void
  onSubmit: (values: TagFormValues) => void
}

function getInitialValues(tag: AdminTagWithCount | null): TagFormValues {
  if (!tag) {
    return {
      title: "",
      slug: "",
      description: "",
    }
  }

  return {
    title: tag.title,
    slug: tag.slug,
    description: tag.description ?? "",
  }
}

export function TagFormDialog({
  open,
  initialTag,
  onOpenChange,
  onSubmit,
}: TagFormDialogProps) {
  const isEdit = Boolean(initialTag)
  const [values, setValues] = useState<TagFormValues>(() =>
    getInitialValues(initialTag)
  )
  const [isSlugLocked, setIsSlugLocked] = useState(isEdit)

  const handleTitleChange = (nextTitle: string) => {
    setValues((prev) => ({
      ...prev,
      title: nextTitle,
      slug: !isSlugLocked ? slugifyTitle(nextTitle) : prev.slug,
    }))
  }

  const canSubmit =
    values.title.trim().length > 0 && values.slug.trim().length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({
      ...values,
      title: values.title.trim().replace(/^#+/, ""),
      slug: values.slug.trim(),
      description: values.description.trim(),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88svh] flex-col gap-0 overflow-hidden rounded-2xl border border-border/80 bg-background p-0 shadow-2xl sm:max-w-md">
        <DialogHeader className="shrink-0 border-b border-border/70 px-6 py-4 pr-12">
          <DialogTitle className="text-base font-semibold text-foreground">
            {isEdit ? "Edit Tag" : "New Tag"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isEdit
              ? "Update tag label, slug, and optional description."
              : "Create a #tag for fine-grained filtering across articles."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="tag-form"
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5"
        >
          {/* Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="tag-title" className="text-xs">
                Tag Name
              </Label>
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {values.title.length}/100
              </span>
            </div>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <span className="font-mono text-xs text-muted-foreground">
                  #
                </span>
              </InputGroupAddon>
              <InputGroupInput
                id="tag-title"
                maxLength={100}
                required
                value={values.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="typescript"
                className="font-mono text-xs"
              />
            </InputGroup>
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="tag-slug" className="text-xs">
                Slug
              </Label>
              <button
                type="button"
                onClick={() => {
                  const next = slugifyTitle(values.title)
                  if (next) setValues((prev) => ({ ...prev, slug: next }))
                }}
                className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <RefreshCw className="size-3" />
                <span>Regenerate</span>
              </button>
            </div>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <span className="font-mono text-xs whitespace-nowrap text-muted-foreground">
                  /tag/
                </span>
              </InputGroupAddon>
              <InputGroupInput
                id="tag-slug"
                maxLength={100}
                required
                disabled={isSlugLocked}
                value={values.slug}
                onChange={(e) => {
                  if (!isSlugLocked) {
                    setValues((prev) => ({ ...prev, slug: e.target.value }))
                  }
                }}
                placeholder="typescript"
                className="font-mono text-xs"
              />
              <InputGroupAddon align="inline-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setIsSlugLocked((prev) => !prev)}
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

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="tag-description" className="text-xs">
              Description
            </Label>
            <Textarea
              id="tag-description"
              value={values.description}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Optional description for tag archive pages..."
              className="min-h-20 text-xs leading-relaxed"
            />
          </div>
        </form>

        <DialogFooter className="mx-0 mb-0 shrink-0 rounded-none border-t border-border/70 bg-muted/30 px-6 py-3.5">
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
            type="submit"
            form="tag-form"
            size="sm"
            disabled={!canSubmit}
            className="gap-1.5 text-xs"
          >
            <Save className="size-3.5" />
            <span>{isEdit ? "Save Changes" : "Create Tag"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
