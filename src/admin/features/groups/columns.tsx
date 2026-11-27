import { format } from "date-fns"
import { FileText } from "lucide-react"

import { AdminMediaThumbnail, AdminSlugCopyButton } from "@/admin"
import { Badge, BadgeDot, Checkbox, Switch } from "@/shared/ui"

import { GroupActionsMenu } from "./components/group-actions-menu"
import { groupsColumnHelper } from "./table-config"
import type { AdminGroupWithPosts } from "./types"

interface CreateGroupColumnsOptions {
  onViewPosts: (group: AdminGroupWithPosts) => void
  onEdit: (group: AdminGroupWithPosts) => void
  onToggleCompleted: (groupId: string) => void
  onDelete: (group: AdminGroupWithPosts) => void
}

export function createGroupColumns({
  onViewPosts,
  onEdit,
  onToggleCompleted,
  onDelete,
}: CreateGroupColumnsOptions) {
  return groupsColumnHelper.columns([
    groupsColumnHelper.display({
      id: "select",
      enableSorting: false,
      meta: {
        headerClassName: "w-11 align-middle",
        cellClassName: "w-11",
      },
      header: ({ table }) => {
        const allPageSelected = table.getIsAllPageRowsSelected()
        const somePageSelected = table.getIsSomePageRowsSelected()

        return (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={allPageSelected}
              indeterminate={!allPageSelected && somePageSelected}
              onCheckedChange={(checked) =>
                table.toggleAllPageRowsSelected(Boolean(checked))
              }
              aria-label="Select all series on current page"
              className="inline-flex items-center justify-center"
            />
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center justify-center pt-1">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
            aria-label={`Select ${row.original.title}`}
            className="inline-flex items-center justify-center"
          />
        </div>
      ),
    }),

    groupsColumnHelper.accessor("title", {
      id: "title",
      header: () => "Series",
      sortFn: (rowA, rowB) =>
        rowA.original.title.localeCompare(rowB.original.title),
      meta: {
        headerClassName: "min-w-[280px]",
      },
      cell: ({ row }) => {
        const group = row.original

        return (
          <div className="flex items-start gap-3">
            <AdminMediaThumbnail
              src={group.coverImage ?? null}
              alt={group.title}
              title={group.title}
              className="mt-0.5 h-11 w-16"
            />
            <div className="min-w-0 flex-1 space-y-1">
              <button
                type="button"
                onClick={() => onViewPosts(group)}
                className="line-clamp-1 text-left text-sm font-semibold text-foreground transition-colors hover:text-pp-secondary focus-visible:underline focus-visible:outline-none"
              >
                {group.title}
              </button>
              <div>
                <AdminSlugCopyButton slug={group.slug} />
              </div>
              {group.description && (
                <p className="line-clamp-1 text-xs text-muted-foreground/80">
                  {group.description}
                </p>
              )}
            </div>
          </div>
        )
      },
    }),

    groupsColumnHelper.accessor((row) => row.posts.length, {
      id: "postsCount",
      header: () => "Articles",
      sortFn: (rowA, rowB) =>
        rowA.original.posts.length - rowB.original.posts.length,
      meta: {
        headerClassName: "w-32",
      },
      cell: ({ row }) => {
        const group = row.original
        const count = group.posts.length

        return (
          <button
            type="button"
            onClick={() => onViewPosts(group)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-muted/30 px-2 py-1 font-mono text-xs text-foreground transition-colors hover:border-border hover:bg-muted/60"
          >
            <FileText className="size-3 text-muted-foreground" />
            <span>
              {count} {count === 1 ? "post" : "posts"}
            </span>
          </button>
        )
      },
    }),

    groupsColumnHelper.accessor("isCompleted", {
      id: "isCompleted",
      header: () => "Progress",
      sortFn: (rowA, rowB) =>
        Number(rowA.original.isCompleted) - Number(rowB.original.isCompleted),
      meta: {
        headerClassName: "w-32",
      },
      cell: ({ row }) => {
        const isCompleted = row.original.isCompleted

        return isCompleted ? (
          <Badge variant="success" size="sm" shape="pill">
            <BadgeDot />
            <span>Completed</span>
          </Badge>
        ) : (
          <Badge variant="warning" size="sm" shape="pill">
            <BadgeDot pulse />
            <span>In Progress</span>
          </Badge>
        )
      },
    }),

    groupsColumnHelper.display({
      id: "toggleCompleted",
      enableSorting: false,
      header: () => "Completed",
      meta: {
        headerClassName: "hidden w-24 text-center lg:table-cell",
        cellClassName: "hidden text-center lg:table-cell",
        align: "center",
      },
      cell: ({ row }) => {
        const group = row.original

        return (
          <div className="flex justify-center pt-1">
            <Switch
              size="sm"
              checked={group.isCompleted}
              onCheckedChange={() => onToggleCompleted(group.id)}
              aria-label={`Toggle completed for ${group.title}`}
            />
          </div>
        )
      },
    }),

    groupsColumnHelper.accessor("updatedAt", {
      id: "updatedAt",
      header: () => "Updated",
      sortFn: (rowA, rowB) =>
        new Date(rowA.original.updatedAt).getTime() -
        new Date(rowB.original.updatedAt).getTime(),
      meta: {
        headerClassName: "hidden w-32 sm:table-cell",
        cellClassName: "hidden sm:table-cell",
      },
      cell: ({ row }) => (
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {format(new Date(row.original.updatedAt), "MMM dd, yyyy")}
        </span>
      ),
    }),

    groupsColumnHelper.display({
      id: "actions",
      enableSorting: false,
      header: () => <span className="sr-only">Actions</span>,
      meta: {
        headerClassName: "w-14 text-right",
        cellClassName: "w-14 text-right",
      },
      cell: ({ row }) => (
        <GroupActionsMenu
          group={row.original}
          onViewPosts={onViewPosts}
          onEdit={onEdit}
          onToggleCompleted={onToggleCompleted}
          onDelete={onDelete}
        />
      ),
    }),
  ])
}
