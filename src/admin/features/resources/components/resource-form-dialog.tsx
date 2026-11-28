import { format } from "date-fns"
import { Lock, RefreshCw, Save, Unlock, X } from "lucide-react"
import { useState } from "react"

import { AdminMediaThumbnail } from "@/admin"
import {
  slugifyTitle,
  toLocalDateTimeInput,
} from "@/admin/features/posts/components/editor/post-editor.utils"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from "@/shared/ui"

import type {
  AdminResource,
  AdminResourceCategory,
  ResourceFormValues,
  ResourcePricing,
} from "../types"

interface ResourceFormDialogProps {
  open: boolean
  initialResource: AdminResource | null
  categories: AdminResourceCategory[]
  onOpenChange: (open: boolean) => void
  onSubmit: (values: ResourceFormValues) => void
}

const PRICING_OPTIONS: ResourcePricing[] = ["Free", "MIT", "Freemium", "Paid"]

function getInitialValues(
  resource: AdminResource | null,
  categories: AdminResourceCategory[]
): ResourceFormValues {
  if (!resource) {
    return {
      title: "",
      slug: "",
      url: "",
      description: "",
      coverImage: "",
      coverImageAlt: "Resource preview",
      logo: "",
      categoryId: categories[0]?.id ?? "",
      pricing: "Free",
      isFeatured: false,
      publishedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    }
  }

  return {
    title: resource.title,
    slug: resource.slug,
    url: resource.url,
    description: resource.description ?? "",
    coverImage: resource.coverImage,
    coverImageAlt: resource.coverImageAlt ?? "Resource preview",
    logo: resource.logo ?? "",
    categoryId: resource.categoryId,
    pricing: resource.pricing,
    isFeatured: resource.isFeatured,
    publishedAt: toLocalDateTimeInput(resource.publishedAt),
  }
}

export function ResourceFormDialog({
  open,
  initialResource,
  categories,
  onOpenChange,
  onSubmit,
}: ResourceFormDialogProps) {
  const isEdit = Boolean(initialResource)
  const [values, setValues] = useState<ResourceFormValues>(() =>
    getInitialValues(initialResource, categories)
  )
  const [isSlugLocked, setIsSlugLocked] = useState(isEdit)

  const selectedCategory = categories.find((c) => c.id === values.categoryId)

  const handleTitleChange = (nextTitle: string) => {
    setValues((prev) => ({
      ...prev,
      title: nextTitle,
      slug: !isSlugLocked ? slugifyTitle(nextTitle) : prev.slug,
    }))
  }

  const canSubmit =
    values.title.trim().length > 0 &&
    values.slug.trim().length > 0 &&
    values.url.trim().length > 0 &&
    values.categoryId.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({
      ...values,
      title: values.title.trim(),
      slug: values.slug.trim(),
      url: values.url.trim(),
      description: values.description.trim(),
      coverImage: values.coverImage.trim() || "/og-image.png",
      coverImageAlt: values.coverImageAlt.trim() || "Resource preview",
      logo: values.logo.trim(),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88svh] flex-col gap-0 overflow-hidden rounded-2xl border border-border/80 bg-background p-0 shadow-2xl sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b border-border/70 px-6 py-4 pr-12">
          <DialogTitle className="text-base font-semibold text-foreground">
            {isEdit ? "Edit Resource" : "Add Resource"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isEdit
              ? "Update curated tool URL, pricing tier, category, and preview image."
              : "Add a curated developer tool, library, or design inspiration."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="resource-form"
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5"
        >
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="res-title" className="text-xs">
              Title
            </Label>
            <Input
              id="res-title"
              maxLength={200}
              required
              value={values.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Base UI"
              className="text-sm font-medium"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="res-slug" className="text-xs">
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
                id="res-slug"
                maxLength={200}
                required
                disabled={isSlugLocked}
                value={values.slug}
                onChange={(e) => {
                  if (!isSlugLocked) {
                    setValues((prev) => ({ ...prev, slug: e.target.value }))
                  }
                }}
                placeholder="base-ui"
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

          {/* URL */}
          <div className="space-y-1.5">
            <Label htmlFor="res-url" className="text-xs">
              Website URL
            </Label>
            <Input
              id="res-url"
              type="url"
              required
              value={values.url}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, url: e.target.value }))
              }
              placeholder="https://base-ui.com"
              className="font-mono text-xs"
            />
          </div>

          {/* Category + Pricing */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="res-category" className="text-xs">
                Category
              </Label>
              <Select
                value={values.categoryId}
                onValueChange={(value) => {
                  if (value) {
                    setValues((prev) => ({ ...prev, categoryId: value }))
                  }
                }}
              >
                <SelectTrigger
                  id="res-category"
                  className="w-full min-w-0 text-xs"
                >
                  <SelectValue>
                    {selectedCategory
                      ? selectedCategory.title
                      : "Select category"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="start">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="text-xs">
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="res-pricing" className="text-xs">
                Pricing
              </Label>
              <Select
                value={values.pricing}
                onValueChange={(value) => {
                  if (value) {
                    setValues((prev) => ({
                      ...prev,
                      pricing: value as ResourcePricing,
                    }))
                  }
                }}
              >
                <SelectTrigger
                  id="res-pricing"
                  className="w-full min-w-0 text-xs"
                >
                  <SelectValue>{values.pricing}</SelectValue>
                </SelectTrigger>
                <SelectContent align="end">
                  {PRICING_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p} className="text-xs">
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="res-description" className="text-xs">
              Description
            </Label>
            <Textarea
              id="res-description"
              value={values.description}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Short summary of why this resource is useful..."
              className="min-h-20 text-xs leading-relaxed"
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2.5 rounded-xl border border-border/70 bg-muted/20 p-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">
                Screenshot Preview
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                16:9 · resources.coverImage
              </span>
            </div>

            <AdminMediaThumbnail
              src={values.coverImage || null}
              alt={values.coverImageAlt || null}
              title={values.title || "Resource preview"}
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

          {/* Featured */}
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/25 px-3 py-2.5">
            <div className="space-y-0.5">
              <Label
                htmlFor="res-featured"
                className="cursor-pointer text-xs font-medium"
              >
                Featured Resource
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Highlight on the public resources showcase
              </p>
            </div>
            <Switch
              id="res-featured"
              checked={values.isFeatured}
              onCheckedChange={(checked) =>
                setValues((prev) => ({ ...prev, isFeatured: Boolean(checked) }))
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
            form="resource-form"
            size="sm"
            disabled={!canSubmit}
            className="gap-1.5 text-xs"
          >
            <Save className="size-3.5" />
            <span>{isEdit ? "Save Changes" : "Add Resource"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
