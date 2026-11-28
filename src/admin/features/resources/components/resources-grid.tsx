import type { Row } from "@tanstack/react-table"
import { format } from "date-fns"
import { ExternalLink } from "lucide-react"

import { AdminMediaThumbnail } from "@/admin"
import { cn } from "@/shared/lib/utils"
import { Badge, Checkbox, Switch } from "@/shared/ui"

import type { resourcesTableFeatures } from "../table-config"
import type { AdminResource } from "../types"
import { ResourceActionsMenu } from "./resource-actions-menu"
import { ResourcePricingBadge } from "./resource-pricing-badge"

interface ResourcesGridProps {
  rows: Array<Row<typeof resourcesTableFeatures, AdminResource>>
  onEdit: (resource: AdminResource) => void
  onToggleFeatured: (resourceId: string) => void
  onDelete: (resource: AdminResource) => void
}

export function ResourcesGrid({
  rows,
  onEdit,
  onToggleFeatured,
  onDelete,
}: ResourcesGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map((row) => {
        const res = row.original
        const isSelected = row.getIsSelected()

        return (
          <article
            key={row.id}
            data-selected={isSelected || undefined}
            className={cn(
              "group/row flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card transition-colors hover:border-border",
              isSelected && "border-primary/50 bg-primary/[0.03]"
            )}
          >
            {/* Cover Header */}
            <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border/60 bg-muted/30">
              <AdminMediaThumbnail
                src={res.coverImage}
                alt={res.coverImageAlt}
                title={res.title}
                className="size-full rounded-none border-0"
                iconClassName="size-8"
              />

              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <div className="flex size-6 items-center justify-center rounded-md border border-border/70 bg-background/90 backdrop-blur-xs">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      row.toggleSelected(Boolean(checked))
                    }
                    aria-label={`Select ${res.title}`}
                    className="inline-flex items-center justify-center"
                  />
                </div>
                <ResourcePricingBadge pricing={res.pricing} size="xs" />
              </div>

              <div className="absolute top-2.5 right-2.5">
                <Badge
                  variant="outline"
                  size="xs"
                  shape="pill"
                  className="gap-1.5 bg-background/85 backdrop-blur-xs"
                >
                  <span
                    className="size-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: res.category.color ?? "#64748b" }}
                  />
                  <span>{res.category.title}</span>
                </Badge>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-2.5 p-4">
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(res)}
                      className="line-clamp-1 text-left text-sm font-semibold text-foreground transition-colors hover:text-pp-secondary focus-visible:underline focus-visible:outline-none"
                    >
                      {res.title}
                    </button>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${res.title}`}
                      className="inline-flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                  <ResourceActionsMenu
                    resource={res}
                    onEdit={onEdit}
                    onToggleFeatured={onToggleFeatured}
                    onDelete={onDelete}
                  />
                </div>
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {res.url}
                </p>
              </div>

              {res.description && (
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {res.description}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-4 py-2.5 text-[11px] text-muted-foreground">
              <span className="font-mono tabular-nums">
                {format(new Date(res.publishedAt), "MMM dd, yyyy")}
              </span>

              <label className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <span>Featured</span>
                <Switch
                  size="sm"
                  checked={res.isFeatured}
                  onCheckedChange={() => onToggleFeatured(res.id)}
                  aria-label={`Toggle featured for ${res.title}`}
                />
              </label>
            </div>
          </article>
        )
      })}
    </div>
  )
}
