import { Globe, SlidersHorizontal } from "lucide-react"

import { AdminContentCard } from "@/admin"
import {
  Input,
  Label,
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/shared/ui"

import type { AdminSiteSettingsData } from "../types"

interface SettingsGeneralCardProps {
  values: AdminSiteSettingsData
  onFieldChange: <K extends keyof AdminSiteSettingsData>(
    field: K,
    value: AdminSiteSettingsData[K]
  ) => void
}

const LOCALE_OPTIONS = [
  { value: "en_US", label: "English (en_US)" },
  { value: "vi_VN", label: "Vietnamese (vi_VN)" },
]

export function SettingsGeneralCard({
  values,
  onFieldChange,
}: SettingsGeneralCardProps) {
  const titleLength = values.siteTitle.length
  const descLength = values.siteDescription.length

  return (
    <AdminContentCard
      title={
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <span>General Site Metadata</span>
        </span>
      }
      description="Core site name, default document title, meta description, and canonical URL"
      minHeight="min-h-0"
      padding="default"
      className="flex-none"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="settings-site-name" className="text-xs">
              Site Name
            </Label>
            <Input
              id="settings-site-name"
              value={values.siteName}
              onChange={(e) => onFieldChange("siteName", e.target.value)}
              placeholder="Phong Phan"
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="settings-site-url" className="text-xs">
              Canonical Site URL
            </Label>
            <div className="relative">
              <Globe className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="settings-site-url"
                type="url"
                value={values.siteUrl}
                onChange={(e) => onFieldChange("siteUrl", e.target.value)}
                placeholder="https://byphongphan.com"
                className="h-9 pl-8 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <Label htmlFor="settings-site-title" className="text-xs">
              Default Meta Title
            </Label>
            <span
              className={`font-mono text-[11px] tabular-nums ${
                titleLength > 60
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground"
              }`}
            >
              {titleLength}/60
            </span>
          </div>
          <Input
            id="settings-site-title"
            value={values.siteTitle}
            onChange={(e) => onFieldChange("siteTitle", e.target.value)}
            placeholder="Phong Phan • Frontend Engineer"
            className="h-9 text-sm"
          />
          <p className="text-[11px] text-muted-foreground">
            Recommended 50–60 characters for optimal search engine display.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <Label htmlFor="settings-site-description" className="text-xs">
              Default Meta Description
            </Label>
            <span
              className={`font-mono text-[11px] tabular-nums ${
                descLength > 160
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground"
              }`}
            >
              {descLength}/160
            </span>
          </div>
          <Textarea
            id="settings-site-description"
            rows={3}
            value={values.siteDescription}
            onChange={(e) => onFieldChange("siteDescription", e.target.value)}
            placeholder="Describe your portfolio and engineering focus..."
            className="min-h-20 resize-y text-sm leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Default Locale</Label>
            <Select
              value={values.locale}
              onValueChange={(val) => {
                if (val) onFieldChange("locale", val)
              }}
            >
              <SelectTrigger className="h-9 w-full text-xs">
                <SelectValue>
                  {LOCALE_OPTIONS.find((opt) => opt.value === values.locale)
                    ?.label ?? values.locale}
                </SelectValue>
              </SelectTrigger>
              <SelectPopup>
                {LOCALE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="settings-theme-color" className="text-xs">
              Browser Theme Color
            </Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label="Pick browser theme color"
                value={values.themeColor}
                onChange={(e) => onFieldChange("themeColor", e.target.value)}
                className="h-9 w-11 cursor-pointer rounded-md border border-border bg-background p-1"
              />
              <Input
                id="settings-theme-color"
                value={values.themeColor}
                onChange={(e) => onFieldChange("themeColor", e.target.value)}
                placeholder="#09090b"
                className="h-9 flex-1 font-mono text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminContentCard>
  )
}
