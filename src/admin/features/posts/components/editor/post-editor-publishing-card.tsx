import { CalendarClock, Star } from "lucide-react"

import { AdminContentCard } from "@/admin"
import { cn } from "@/shared/lib/utils"
import {
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
} from "@/shared/ui"

import type { PostStatus } from "../../types"
import type { PostEditorFormValues } from "./post-editor.utils"

interface PostEditorPublishingCardProps {
  values: PostEditorFormValues
  onChange: <K extends keyof PostEditorFormValues>(
    field: K,
    value: PostEditorFormValues[K]
  ) => void
}

const STATUS_OPTIONS: Array<{
  value: PostStatus
  label: string
  dotClass: string
}> = [
  { value: "draft", label: "Draft", dotClass: "bg-amber-500" },
  { value: "published", label: "Published", dotClass: "bg-emerald-500" },
  { value: "archived", label: "Archived", dotClass: "bg-muted-foreground" },
]

export function PostEditorPublishingCard({
  values,
  onChange,
}: PostEditorPublishingCardProps) {
  const selectedStatus =
    STATUS_OPTIONS.find((item) => item.value === values.status) ??
    STATUS_OPTIONS[0]

  return (
    <AdminContentCard
      title={
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <CalendarClock className="size-4 text-muted-foreground" />
          <span>Publishing</span>
        </span>
      }
      minHeight="min-h-0"
      padding="sm"
      className="flex-none"
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="post-status" className="text-xs">
            Status
          </Label>
          <Select
            value={values.status}
            onValueChange={(value) => {
              if (value) onChange("status", value as PostStatus)
            }}
          >
            <SelectTrigger id="post-status" className="w-full text-xs">
              <SelectValue>
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      selectedStatus.dotClass
                    )}
                  />
                  <span>{selectedStatus.label}</span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start">
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="text-xs"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "size-2 shrink-0 rounded-full",
                        opt.dotClass
                      )}
                    />
                    <span>{opt.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="post-published-at" className="text-xs">
            Published At
          </Label>
          <Input
            id="post-published-at"
            type="datetime-local"
            value={values.publishedAt}
            onChange={(e) => onChange("publishedAt", e.target.value)}
            className="font-mono text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="post-read-time" className="text-xs">
            Estimated Read Time
          </Label>
          <InputGroup>
            <InputGroupInput
              id="post-read-time"
              type="number"
              min={1}
              max={120}
              value={values.readTime}
              onChange={(e) => {
                const parsed = Number(e.target.value)
                onChange(
                  "readTime",
                  Number.isNaN(parsed) || parsed < 1 ? 1 : parsed
                )
              }}
              className="font-mono text-xs"
            />
            <InputGroupAddon align="inline-end">
              <span className="font-mono text-[11px] text-muted-foreground">
                min read
              </span>
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/25 px-3 py-2.5">
          <div className="space-y-0.5">
            <Label
              htmlFor="post-featured"
              className="cursor-pointer text-xs font-medium"
            >
              <Star className="size-3.5 text-amber-500" />
              <span>Featured Article</span>
            </Label>
            <p className="text-[11px] text-muted-foreground">
              Pin to featured highlights
            </p>
          </div>
          <Switch
            id="post-featured"
            checked={values.isFeatured}
            onCheckedChange={(checked) =>
              onChange("isFeatured", Boolean(checked))
            }
          />
        </div>
      </div>
    </AdminContentCard>
  )
}
