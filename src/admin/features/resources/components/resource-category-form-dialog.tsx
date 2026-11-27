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
} from "@/shared/ui"

import type {
  AdminResourceCategoryWithCount,
  ResourceCategoryFormValues,
} from "../types"

interface ResourceCategoryFormDialogProps {
  open: boolean
  initialCategory: AdminResourceCategoryWithCount | null
  onOpenChange: (open: boolean) => void
  onSubmit: (values: ResourceCategoryFormValues) => void
}

const PRESET_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#64748b",
]

function getInitialValues(
  category: AdminResourceCategoryWithCount | null
): ResourceCategoryFormValues {
  if (!category) {
    return {
      title: "",
      slug: "",
      icon: "Layers",
      color: "#3b82f6",
      order: 1,
    }
  }

  return {
    title: category.title,
    slug: category.slug,
    icon: category.icon ?? "",
    color: category.color ?? "#3b82f6",
    order: category.order,
  }
}

export function ResourceCategoryFormDialog({
  open,
  initialCategory,
  onOpenChange,
  onSubmit,
}: ResourceCategoryFormDialogProps) {
  const isEdit = Boolean(initialCategory)
  const [values, setValues] = useState<ResourceCategoryFormValues>(() =>
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
      icon: values.icon.trim(),
      color: values.color.trim() || "#3b82f6",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88svh] flex-col gap-0 overflow-hidden rounded-2xl border border-border/80 bg-background p-0 shadow-2xl sm:max-w-md">
        <DialogHeader className="shrink-0 border-b border-border/70 px-6 py-4 pr-12">
          <DialogTitle className="text-base font-semibold text-foreground">
            {isEdit ? "Edit Resource Category" : "New Resource Category"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Configure resource tab name, icon, accent color, and display order.
          </DialogDescription>
        </DialogHeader>

        <form
          id="resource-category-form"
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5"
        >
          <div className="space-y-1.5">
            <Label htmlFor="rcat-title" className="text-xs">
              Title
            </Label>
            <Input
              id="rcat-title"
              maxLength={150}
              required
              value={values.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. UI Libraries"
              className="text-sm font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="rcat-slug" className="text-xs">
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
                  /resources/
                </span>
              </InputGroupAddon>
              <InputGroupInput
                id="rcat-slug"
                maxLength={150}
                required
                disabled={isSlugLocked}
                value={values.slug}
                onChange={(e) => {
                  if (!isSlugLocked) {
                    setValues((prev) => ({ ...prev, slug: e.target.value }))
                  }
                }}
                placeholder="ui-libraries"
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

          <div className="grid grid-cols-[minmax(0,1fr)_96px] gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rcat-icon" className="text-xs">
                Lucide Icon / Emoji
              </Label>
              <Input
                id="rcat-icon"
                maxLength={100}
                value={values.icon}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, icon: e.target.value }))
                }
                placeholder="Layers"
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rcat-order" className="text-xs">
                Tab Order
              </Label>
              <Input
                id="rcat-order"
                type="number"
                min={0}
                value={values.order}
                onChange={(e) => {
                  const parsed = Number(e.target.value)
                  setValues((prev) => ({
                    ...prev,
                    order: Number.isNaN(parsed) ? 0 : parsed,
                  }))
                }}
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rcat-color" className="text-xs">
              Accent Color (HEX)
            </Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label="Pick resource category color"
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
                id="rcat-color"
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
            form="resource-category-form"
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
