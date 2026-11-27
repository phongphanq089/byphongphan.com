import { Lock, RefreshCw, Save, Unlock, X } from "lucide-react"
import { useState } from "react"

import { AdminMediaThumbnail } from "@/admin"
import { slugifyTitle } from "@/admin/features/posts/components/editor/post-editor.utils"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Label,
  Switch,
  Textarea,
} from "@/shared/ui"

import type { AdminGroupWithPosts, GroupFormValues } from "../types"

interface GroupFormDialogProps {
  open: boolean
  initialGroup: AdminGroupWithPosts | null
  onOpenChange: (open: boolean) => void
  onSubmit: (values: GroupFormValues) => void
}

function getInitialValues(group: AdminGroupWithPosts | null): GroupFormValues {
  if (!group) {
    return {
      title: "",
      slug: "",
      description: "",
      coverImage: "",
      isCompleted: false,
    }
  }

  return {
    title: group.title,
    slug: group.slug,
    description: group.description ?? "",
    coverImage: group.coverImage ?? "",
    isCompleted: group.isCompleted,
  }
}

export function GroupFormDialog({
  open,
  initialGroup,
  onOpenChange,
  onSubmit,
}: GroupFormDialogProps) {
  const isEdit = Boolean(initialGroup)
  const [values, setValues] = useState<GroupFormValues>(() =>
    getInitialValues(initialGroup)
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
      title: values.title.trim(),
      slug: values.slug.trim(),
      description: values.description.trim(),
      coverImage: values.coverImage.trim(),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88svh] flex-col gap-0 overflow-hidden rounded-2xl border border-border/80 bg-background p-0 shadow-2xl sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b border-border/70 px-6 py-4 pr-12">
          <DialogTitle className="text-base font-semibold text-foreground">
            {isEdit ? "Edit Series" : "New Series"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isEdit
              ? "Update series title, slug, cover artwork, and completion status."
              : "Create a curated series collection to group sequential articles."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="group-form"
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5"
        >
          {/* Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="group-title" className="text-xs">
                Series Title
              </Label>
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {values.title.length}/200
              </span>
            </div>
            <Input
              id="group-title"
              maxLength={200}
              required
              value={values.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. WebGL2 Liquid Glass UI"
              className="text-sm font-medium"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="group-slug" className="text-xs">
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
              <InputGroupInput
                id="group-slug"
                maxLength={200}
                required
                disabled={isSlugLocked}
                value={values.slug}
                onChange={(e) => {
                  if (!isSlugLocked) {
                    setValues((prev) => ({ ...prev, slug: e.target.value }))
                  }
                }}
                placeholder="webgl2-liquid-glass-ui"
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
            <Label htmlFor="group-description" className="text-xs">
              Description
            </Label>
            <Textarea
              id="group-description"
              value={values.description}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Short overview of what this learning series covers..."
              className="min-h-20 text-xs leading-relaxed"
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2.5 rounded-xl border border-border/70 bg-muted/20 p-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Cover Image</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                16:9 · post_groups.coverImage
              </span>
            </div>

            <AdminMediaThumbnail
              src={values.coverImage || null}
              alt={values.title || "Series cover preview"}
              title={values.title || "Series cover"}
              className="aspect-[16/9] w-full rounded-lg"
              iconClassName="size-7"
            />

            <div className="flex items-center gap-1.5">
              <Input
                value={values.coverImage}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, coverImage: e.target.value }))
                }
                placeholder="https://ik.imagekit.io/... or /og-image.png"
                aria-label="Cover image URL"
                className="font-mono text-xs"
              />
              {values.coverImage && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() =>
                    setValues((prev) => ({ ...prev, coverImage: "" }))
                  }
                  aria-label="Clear cover image"
                  className="shrink-0"
                >
                  <X className="size-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Completion Switch */}
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/25 px-3 py-2.5">
            <div className="space-y-0.5">
              <Label
                htmlFor="group-completed"
                className="cursor-pointer text-xs font-medium"
              >
                Series Completed
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Mark when all planned parts are published
              </p>
            </div>
            <Switch
              id="group-completed"
              checked={values.isCompleted}
              onCheckedChange={(checked) =>
                setValues((prev) => ({
                  ...prev,
                  isCompleted: Boolean(checked),
                }))
              }
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
            form="group-form"
            size="sm"
            disabled={!canSubmit}
            className="gap-1.5 text-xs"
          >
            <Save className="size-3.5" />
            <span>{isEdit ? "Save Changes" : "Create Series"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
