import { Plus, Search, Twitter, X } from "lucide-react"
import { type KeyboardEvent, useState } from "react"

import { AdminContentCard, AdminImageUploadField } from "@/admin"
import {
  Badge,
  Button,
  Input,
  Label,
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui"

import type { AdminSiteSettingsData, TwitterCardType } from "../types"

interface SettingsSeoSocialCardProps {
  values: AdminSiteSettingsData
  onFieldChange: <K extends keyof AdminSiteSettingsData>(
    field: K,
    value: AdminSiteSettingsData[K]
  ) => void
}

const TWITTER_CARD_OPTIONS: { value: TwitterCardType; label: string }[] = [
  { value: "summary_large_image", label: "Summary Large Image" },
  { value: "summary", label: "Compact Summary" },
]

export function SettingsSeoSocialCard({
  values,
  onFieldChange,
}: SettingsSeoSocialCardProps) {
  const [keywordInput, setKeywordInput] = useState("")

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim()
    if (!trimmed) return
    if (
      values.keywords.some(
        (item) => item.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      setKeywordInput("")
      return
    }
    onFieldChange("keywords", [...values.keywords, trimmed])
    setKeywordInput("")
  }

  const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddKeyword()
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    onFieldChange(
      "keywords",
      values.keywords.filter((item) => item !== keyword)
    )
  }

  return (
    <AdminContentCard
      title={
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <Search className="size-4 text-muted-foreground" />
          <span>OpenGraph, Twitter &amp; Keywords</span>
        </span>
      }
      description="Social sharing card image, Twitter metadata, and search keywords"
      minHeight="min-h-0"
      padding="default"
      className="flex-none"
    >
      <div className="space-y-5">
        <AdminImageUploadField
          id="settings-og-image"
          label="OpenGraph Image"
          value={values.ogImage}
          onChange={(val) => onFieldChange("ogImage", val)}
          variant="og"
          accept="image/png,image/jpeg,image/webp"
          hint="1200×630px · PNG, JPG or WebP"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="settings-twitter-handle" className="text-xs">
              X (Twitter) Handle
            </Label>
            <div className="relative">
              <Twitter className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="settings-twitter-handle"
                value={values.twitterHandle}
                onChange={(e) => onFieldChange("twitterHandle", e.target.value)}
                placeholder="@PhongPhanq089"
                className="h-9 pl-8 font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Twitter Card Format</Label>
            <Select
              value={values.twitterCard}
              onValueChange={(val) => {
                if (val) {
                  onFieldChange("twitterCard", val as TwitterCardType)
                }
              }}
            >
              <SelectTrigger className="h-9 w-full text-xs">
                <SelectValue>
                  {TWITTER_CARD_OPTIONS.find(
                    (opt) => opt.value === values.twitterCard
                  )?.label ?? values.twitterCard}
                </SelectValue>
              </SelectTrigger>
              <SelectPopup>
                {TWITTER_CARD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
          </div>
        </div>

        {/* Keywords */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <Label htmlFor="settings-keyword-input" className="text-xs">
              SEO Keywords
            </Label>
            <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
              {values.keywords.length} keywords
            </span>
          </div>

          <div className="flex gap-2">
            <Input
              id="settings-keyword-input"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeywordKeyDown}
              placeholder="Add keyword and press Enter..."
              className="h-9 flex-1 text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 px-3 text-xs"
              onClick={handleAddKeyword}
              disabled={!keywordInput.trim()}
            >
              <Plus className="size-3.5" />
              <span>Add</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5 rounded-lg border border-border/70 bg-muted/20 p-3">
            {values.keywords.length === 0 ? (
              <span className="text-xs text-muted-foreground">
                No keywords configured.
              </span>
            ) : (
              values.keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="gap-1 pr-1.5 pl-2.5 text-xs font-normal"
                >
                  <span>{keyword}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    aria-label={`Remove ${keyword}`}
                    className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                  >
                    <X className="size-2.5" />
                  </button>
                </Badge>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminContentCard>
  )
}
