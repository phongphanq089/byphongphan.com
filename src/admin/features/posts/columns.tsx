import { format } from "date-fns"
import { Clock, Layers, Star } from "lucide-react"

import { AdminMediaThumbnail, AdminSlugCopyButton } from "@/admin"
import { Badge, Checkbox, Switch } from "@/shared/ui"

import { PostActionsMenu } from "./components/post-actions-menu"
import { PostStatusBadge } from "./components/post-status-badge"
import { PostTaxonomyPills } from "./components/post-taxonomy-pills"
import { postsColumnHelper } from "./table-config"
import type { AdminPost, PostStatus } from "./types"

interface CreatePostColumnsOptions {
  onPreview: (post: AdminPost) => void
  onEdit: (post: AdminPost) => void
  onChangeStatus: (postId: string, status: PostStatus) => void
  onToggleFeatured: (postId: string) => void
  onDuplicate: (post: AdminPost) => void
  onDelete: (post: AdminPost) => void
}

export function createPostColumns({
  onPreview,
  onEdit,
  onChangeStatus,
  onToggleFeatured,
  onDuplicate,
  onDelete,
}: CreatePostColumnsOptions) {
  return postsColumnHelper.columns([
    postsColumnHelper.display({
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
              aria-label="Select all articles on current page"
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

    postsColumnHelper.accessor("title", {
      id: "title",
      header: () => "Article",
      sortFn: (rowA, rowB) =>
        rowA.original.title.localeCompare(rowB.original.title),
      meta: {
        headerClassName: "min-w-[280px]",
      },
      cell: ({ row }) => {
        const post = row.original

        return (
          <div className="flex items-start gap-3">
            <AdminMediaThumbnail
              src={post.coverImage}
              alt={post.coverImageAlt}
              title={post.title}
              className="mt-0.5 h-11 w-16"
            />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onPreview(post)}
                  className="line-clamp-1 text-left text-sm font-semibold text-foreground transition-colors hover:text-pp-secondary focus-visible:underline focus-visible:outline-none"
                >
                  {post.title}
                </button>
                {post.isFeatured && (
                  <Star
                    className="size-3.5 shrink-0 text-amber-500 lg:hidden"
                    aria-label="Featured article"
                  />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <AdminSlugCopyButton slug={post.slug} />
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground/80 sm:hidden">
                  <Clock className="size-3" />
                  {post.readTime}m
                </span>
              </div>

              {post.excerpt && (
                <p className="line-clamp-1 text-xs text-muted-foreground/80">
                  {post.excerpt}
                </p>
              )}
            </div>
          </div>
        )
      },
    }),

    postsColumnHelper.display({
      id: "taxonomy",
      enableSorting: false,
      header: () => "Categories & Tags",
      meta: {
        headerClassName: "hidden min-w-[180px] md:table-cell",
        cellClassName: "hidden md:table-cell",
      },
      cell: ({ row }) => (
        <PostTaxonomyPills
          categories={row.original.categories}
          tags={row.original.tags}
          maxTags={2}
        />
      ),
    }),

    postsColumnHelper.display({
      id: "series",
      enableSorting: false,
      header: () => "Series",
      meta: {
        headerClassName: "hidden min-w-[170px] xl:table-cell",
        cellClassName: "hidden xl:table-cell",
      },
      cell: ({ row }) => {
        const post = row.original

        if (!post.group) {
          return (
            <span className="font-mono text-[11px] text-muted-foreground/60">
              — Standalone
            </span>
          )
        }

        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Layers className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="line-clamp-1 text-xs font-medium text-foreground">
                {post.group.title}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {post.groupOrder !== null && (
                <Badge
                  variant="subtle"
                  size="xs"
                  shape="square"
                  className="font-mono"
                >
                  Part {String(post.groupOrder).padStart(2, "0")}
                </Badge>
              )}
              {post.group.isCompleted && (
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                  Completed
                </span>
              )}
            </div>
          </div>
        )
      },
    }),

    postsColumnHelper.accessor("status", {
      id: "status",
      header: () => "Status",
      sortFn: (rowA, rowB) =>
        rowA.original.status.localeCompare(rowB.original.status),
      meta: {
        headerClassName: "w-28",
      },
      cell: ({ row }) => (
        <div className="pt-0.5">
          <PostStatusBadge status={row.original.status} />
        </div>
      ),
    }),

    postsColumnHelper.accessor("publishedAt", {
      id: "publishedAt",
      header: () => "Published",
      sortFn: (rowA, rowB) =>
        new Date(rowA.original.publishedAt).getTime() -
        new Date(rowB.original.publishedAt).getTime(),
      meta: {
        headerClassName: "hidden w-36 sm:table-cell",
        cellClassName: "hidden sm:table-cell",
      },
      cell: ({ row }) => {
        const post = row.original

        return (
          <div className="flex flex-col gap-0.5 font-mono text-[11px]">
            <span className="text-foreground/90 tabular-nums">
              {format(new Date(post.publishedAt), "MMM dd, yyyy")}
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground/80">
              <Clock className="size-3" />
              <span>{post.readTime} min read</span>
            </span>
          </div>
        )
      },
    }),

    // Hidden utility columns so toolbar sort presets use TanStack Table's sortedRowModel
    postsColumnHelper.accessor("updatedAt", {
      id: "updatedAt",
      sortFn: (rowA, rowB) =>
        new Date(rowA.original.updatedAt).getTime() -
        new Date(rowB.original.updatedAt).getTime(),
    }),
    postsColumnHelper.accessor("readTime", {
      id: "readTime",
      sortFn: (rowA, rowB) => rowA.original.readTime - rowB.original.readTime,
    }),

    postsColumnHelper.accessor("isFeatured", {
      id: "isFeatured",
      header: () => "Featured",
      sortFn: (rowA, rowB) =>
        Number(rowA.original.isFeatured) - Number(rowB.original.isFeatured),
      meta: {
        headerClassName: "hidden w-24 text-center lg:table-cell",
        cellClassName: "hidden text-center lg:table-cell",
        align: "center",
      },
      cell: ({ row }) => {
        const post = row.original

        return (
          <div className="flex justify-center pt-1">
            <Switch
              size="sm"
              checked={post.isFeatured}
              onCheckedChange={() => onToggleFeatured(post.id)}
              aria-label={`Toggle featured for ${post.title}`}
            />
          </div>
        )
      },
    }),

    postsColumnHelper.display({
      id: "actions",
      enableSorting: false,
      header: () => <span className="sr-only">Actions</span>,
      meta: {
        headerClassName: "w-14 text-right",
        cellClassName: "w-14 text-right",
      },
      cell: ({ row }) => (
        <PostActionsMenu
          post={row.original}
          onPreview={onPreview}
          onEdit={onEdit}
          onChangeStatus={onChangeStatus}
          onToggleFeatured={onToggleFeatured}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ),
    }),
  ])
}
