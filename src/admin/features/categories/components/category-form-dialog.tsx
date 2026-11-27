import { Lock, RefreshCw, Save, Unlock } from "lucide-react"
import { useState } from "react"

import { slugifyTitle } from "@/admin/features/posts/components/editor/post-editor.utils"
import { cn } from "@/shared/lib/utils"
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
  Textarea,
} from "@/shared/ui"

import type { AdminCategoryWithCount, CategoryFormValues } from "../types"

interface CategoryFormDialogProps {
  open: boolean
  initialCategory: AdminCategoryWithCount | null
  onOpenChange: (open: boolean) => void
  onSubmit: (values: CategoryFormValues) => void
}

const PRESET_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
  "#64748b",
]

function getInitialValues(
  category: AdminCategoryWithCount | null
): CategoryFormValues {
  if (!category) {
    return {
      title: "",
      slug: "",
      description: "",
      color: "#3b82f6",
    }
  }

  return {
    title: category.title,
    slug: category.slug,
    description: category.description ?? "",
    color: category.color ?? "#3b82f6",
  }
}

export function CategoryFormDialog({
  open,
  initialCategory,
  onOpenChange,
  onSubmit,
}: CategoryFormDialogProps) {
  const isEdit = Boolean(initialCategory)
  const [values, setValues] = useState<CategoryFormValues>(() =>
    getInitialValues(initialCategory)
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
      color: values.color.trim() || "#3b82f6",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88svh] flex-col gap-0 overflow-hidden rounded-2xl border border-border/80 bg-background p-0 shadow-2xl sm:max-w-md">
        <DialogHeader className="shrink-0 border-b border-border/70 px-6 py-4 pr-12">
          <DialogTitle className="text-base font-semibold text-foreground">
            {isEdit ? "Edit Category" : "New Category"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isEdit
              ? "Update category name, slug, accent color, and description."
              : "Create a primary topic category for organizing blog articles."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="category-form"
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5"
        >
          {/* Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="cat-title" className="text-xs">
                Category Title
              </Label>
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {values.title.length}/150
              </span>
            </div>
            <Input
              id="cat-title"
              maxLength={150}
              required
              value={values.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Frontend Engineering"
              className="text-sm font-medium"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="cat-slug" className="text-xs">
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
                  /category/
                </span>
              </InputGroupAddon>
              <InputGroupInput
                id="cat-slug"
                maxLength={150}
                required
                disabled={isSlugLocked}
                value={values.slug}
                onChange={(e) => {
                  if (!isSlugLocked) {
                    setValues((prev) => ({ ...prev, slug: e.target.value }))
                  }
                }}
                placeholder="frontend-engineering"
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

          {/* Color Picker */}
          <div className="space-y-2">
            <Label htmlFor="cat-color" className="text-xs">
              Accent Color (HEX)
            </Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label="Pick category color"
                value={
                  /^#[0-9a-fA-F]{6}$/.test(values.color)
                    ? values.color
                    : "#3b82f6"
                }
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, color: e.target.value }))
                }
                className="size-8 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-0.5"
              />
              <Input
                id="cat-color"
                maxLength={50}
                value={values.color}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, color: e.target.value }))
                }
                placeholder="#3b82f6"
                className="font-mono text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {PRESET_COLORS.map((hex) => {
                const isActive =
                  values.color.toLowerCase() === hex.toLowerCase()
                return (
                  <button
                    key={hex}
                    type="button"
                    onClick={() =>
                      setValues((prev) => ({ ...prev, color: hex }))
                    }
                    aria-label={`Select color ${hex}`}
                    className={cn(
                      "size-5 rounded-full transition-transform hover:scale-110",
                      isActive &&
                        "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                    )}
                    style={{ backgroundColor: hex }}
                  />
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="cat-description" className="text-xs">
              Description
            </Label>
            <Textarea
              id="cat-description"
              value={values.description}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Short summary of articles in this category..."
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
            form="category-form"
            size="sm"
            disabled={!canSubmit}
            className="gap-1.5 text-xs"
          >
            <Save className="size-3.5" />
            <span>{isEdit ? "Save Changes" : "Create Category"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
