import type { Row } from "@tanstack/react-table"
import { format } from "date-fns"
import { FileText } from "lucide-react"

import { AdminMediaThumbnail } from "@/admin"
import { cn } from "@/shared/lib/utils"
import { Badge, BadgeDot, Checkbox, Switch } from "@/shared/ui"

import type { groupsTableFeatures } from "../table-config"
import type { AdminGroupWithPosts } from "../types"
import { GroupActionsMenu } from "./group-actions-menu"

interface GroupsGridProps {
  rows: Array<Row<typeof groupsTableFeatures, AdminGroupWithPosts>>
  onViewPosts: (group: AdminGroupWithPosts) => void
  onEdit: (group: AdminGroupWithPosts) => void
  onToggleCompleted: (groupId: string) => void
  onDelete: (group: AdminGroupWithPosts) => void
}

export function GroupsGrid({
  rows,
  onViewPosts,
  onEdit,
  onToggleCompleted,
  onDelete,
}: GroupsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map((row) => {
        const group = row.original
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
                src={group.coverImage ?? null}
                alt={group.title}
                title={group.title}
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
                    aria-label={`Select ${group.title}`}
                    className="inline-flex items-center justify-center"
                  />
                </div>
                {group.isCompleted ? (
                  <Badge variant="success" size="xs" shape="pill">
                    <BadgeDot />
                    <span>Completed</span>
                  </Badge>
                ) : (
                  <Badge variant="warning" size="xs" shape="pill">
                    <BadgeDot pulse />
                    <span>In Progress</span>
                  </Badge>
                )}
              </div>

              <div className="absolute top-2.5 right-2.5">
                <Badge variant="secondary" size="xs" shape="pill">
                  <FileText className="size-2.5" />
                  <span className="font-mono">
                    {group.posts.length}{" "}
                    {group.posts.length === 1 ? "post" : "posts"}
                  </span>
                </Badge>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onViewPosts(group)}
                    className="line-clamp-2 text-left text-sm leading-snug font-semibold text-foreground transition-colors hover:text-pp-secondary focus-visible:underline focus-visible:outline-none"
                  >
                    {group.title}
                  </button>
                  <GroupActionsMenu
                    group={group}
                    onViewPosts={onViewPosts}
                    onEdit={onEdit}
                    onToggleCompleted={onToggleCompleted}
                    onDelete={onDelete}
                  />
                </div>
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  /{group.slug}
                </p>
              </div>

              {group.description && (
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {group.description}
                </p>
              )}

              {/* Ordered Articles Preview */}
              {group.posts.length > 0 && (
                <div className="mt-auto space-y-1 rounded-lg border border-border/60 bg-muted/20 p-2.5">
                  {group.posts.slice(0, 2).map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center gap-2 text-[11px]"
                    >
                      <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                        #{String(post.groupOrder ?? 0).padStart(2, "0")}
                      </span>
                      <span className="truncate text-foreground/90">
                        {post.title}
                      </span>
                    </div>
                  ))}
                  {group.posts.length > 2 && (
                    <button
                      type="button"
                      onClick={() => onViewPosts(group)}
                      className="font-mono text-[10px] text-muted-foreground hover:text-foreground"
                    >
                      +{group.posts.length - 2} more articles...
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-4 py-2.5 text-[11px] text-muted-foreground">
              <span className="font-mono tabular-nums">
                Updated {format(new Date(group.updatedAt), "MMM dd, yyyy")}
              </span>

              <label className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <span>Completed</span>
                <Switch
                  size="sm"
                  checked={group.isCompleted}
                  onCheckedChange={() => onToggleCompleted(group.id)}
                  aria-label={`Toggle completed for ${group.title}`}
                />
              </label>
            </div>
          </article>
        )
      })}
    </div>
  )
}
