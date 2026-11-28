import { format } from "date-fns"
import { FileText } from "lucide-react"

import { AdminSlugCopyButton } from "@/admin"
import { Badge, Checkbox } from "@/shared/ui"

import { TaxonomyActionsMenu } from "./components/taxonomy-actions-menu"
import { categoryColumnHelper, tagColumnHelper } from "./table-config"
import type { AdminCategoryWithCount, AdminTagWithCount } from "./types"

interface CategoryColumnsOptions {
  onEdit: (category: AdminCategoryWithCount) => void
  onDelete: (category: AdminCategoryWithCount) => void
}

interface TagColumnsOptions {
  onEdit: (tag: AdminTagWithCount) => void
  onDelete: (tag: AdminTagWithCount) => void
}

export function createCategoryColumns({
  onEdit,
  onDelete,
}: CategoryColumnsOptions) {
  return categoryColumnHelper.columns([
    categoryColumnHelper.display({
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
              aria-label="Select all categories on current page"
              className="inline-flex items-center justify-center"
            />
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center justify-center pt-0.5">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
            aria-label={`Select ${row.original.title}`}
            className="inline-flex items-center justify-center"
          />
        </div>
      ),
    }),

    categoryColumnHelper.accessor("title", {
      id: "title",
      header: () => "Category",
      sortFn: (rowA, rowB) =>
        rowA.original.title.localeCompare(rowB.original.title),
      meta: {
        headerClassName: "min-w-[260px]",
      },
      cell: ({ row }) => {
        const cat = row.original
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full ring-1 ring-border/70"
                style={{ backgroundColor: cat.color ?? "#64748b" }}
              />
              <button
                type="button"
                onClick={() => onEdit(cat)}
                className="text-left text-sm font-semibold text-foreground transition-colors hover:text-pp-secondary focus-visible:underline focus-visible:outline-none"
              >
                {cat.title}
              </button>
              <AdminSlugCopyButton slug={cat.slug} />
            </div>
            {cat.description && (
              <p className="line-clamp-1 text-xs text-muted-foreground/85">
                {cat.description}
              </p>
            )}
          </div>
        )
      },
    }),

    categoryColumnHelper.accessor((row) => row.color ?? "", {
      id: "color",
      header: () => "Color",
      sortFn: (rowA, rowB) =>
        (rowA.original.color ?? "").localeCompare(rowB.original.color ?? ""),
      meta: {
        headerClassName: "hidden w-32 sm:table-cell",
        cellClassName: "hidden sm:table-cell",
      },
      cell: ({ row }) => {
        const hex = row.original.color ?? "#64748b"
        return (
          <Badge
            variant="outline"
            size="sm"
            shape="rounded"
            className="gap-1.5 font-mono text-[11px]"
          >
            <span
              className="size-2.5 shrink-0 rounded-xs"
              style={{ backgroundColor: hex }}
            />
            <span>{hex}</span>
          </Badge>
        )
      },
    }),

    categoryColumnHelper.accessor("postsCount", {
      id: "postsCount",
      header: () => "Articles",
      sortFn: (rowA, rowB) =>
        rowA.original.postsCount - rowB.original.postsCount,
      meta: {
        headerClassName: "w-28",
      },
      cell: ({ row }) => {
        const count = row.original.postsCount
        return (
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground tabular-nums">
            <FileText className="size-3" />
            <span>
              {count} {count === 1 ? "post" : "posts"}
            </span>
          </span>
        )
      },
    }),

    categoryColumnHelper.accessor("updatedAt", {
      id: "updatedAt",
      header: () => "Updated",
      sortFn: (rowA, rowB) =>
        new Date(rowA.original.updatedAt).getTime() -
        new Date(rowB.original.updatedAt).getTime(),
      meta: {
        headerClassName: "hidden w-32 md:table-cell",
        cellClassName: "hidden md:table-cell",
      },
      cell: ({ row }) => (
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {format(new Date(row.original.updatedAt), "MMM dd, yyyy")}
        </span>
      ),
    }),

    categoryColumnHelper.display({
      id: "actions",
      enableSorting: false,
      header: () => <span className="sr-only">Actions</span>,
      meta: {
        headerClassName: "w-14 text-right",
        cellClassName: "w-14 text-right",
      },
      cell: ({ row }) => (
        <TaxonomyActionsMenu
          title={row.original.title}
          slug={row.original.slug}
          itemLabel="Category"
          onEdit={() => onEdit(row.original)}
          onDelete={() => onDelete(row.original)}
        />
      ),
    }),
  ])
}

export function createTagColumns({ onEdit, onDelete }: TagColumnsOptions) {
  return tagColumnHelper.columns([
    tagColumnHelper.display({
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
              aria-label="Select all tags on current page"
              className="inline-flex items-center justify-center"
            />
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center justify-center pt-0.5">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
            aria-label={`Select ${row.original.title}`}
            className="inline-flex items-center justify-center"
          />
        </div>
      ),
    }),

    tagColumnHelper.accessor("title", {
      id: "title",
      header: () => "Tag",
      sortFn: (rowA, rowB) =>
        rowA.original.title.localeCompare(rowB.original.title),
      meta: {
        headerClassName: "min-w-[260px]",
      },
      cell: ({ row }) => {
        const tag = row.original
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(tag)}
                className="inline-flex items-center rounded-md border border-border/70 bg-muted/50 px-2 py-0.5 font-mono text-xs font-medium text-foreground transition-colors hover:border-border hover:bg-muted"
              >
                #{tag.title}
              </button>
              <AdminSlugCopyButton slug={tag.slug} />
            </div>
            {tag.description && (
              <p className="line-clamp-1 text-xs text-muted-foreground/85">
                {tag.description}
              </p>
            )}
          </div>
        )
      },
    }),

    tagColumnHelper.accessor("postsCount", {
      id: "postsCount",
      header: () => "Articles",
      sortFn: (rowA, rowB) =>
        rowA.original.postsCount - rowB.original.postsCount,
      meta: {
        headerClassName: "w-28",
      },
      cell: ({ row }) => {
        const count = row.original.postsCount
        return (
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground tabular-nums">
            <FileText className="size-3" />
            <span>
              {count} {count === 1 ? "post" : "posts"}
            </span>
          </span>
        )
      },
    }),

    tagColumnHelper.accessor("updatedAt", {
      id: "updatedAt",
      header: () => "Updated",
      sortFn: (rowA, rowB) =>
        new Date(rowA.original.updatedAt).getTime() -
        new Date(rowB.original.updatedAt).getTime(),
      meta: {
        headerClassName: "hidden w-32 md:table-cell",
        cellClassName: "hidden md:table-cell",
      },
      cell: ({ row }) => (
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {format(new Date(row.original.updatedAt), "MMM dd, yyyy")}
        </span>
      ),
    }),

    tagColumnHelper.display({
      id: "actions",
      enableSorting: false,
      header: () => <span className="sr-only">Actions</span>,
      meta: {
        headerClassName: "w-14 text-right",
        cellClassName: "w-14 text-right",
      },
      cell: ({ row }) => (
        <TaxonomyActionsMenu
          title={row.original.title}
          slug={row.original.slug}
          itemLabel="Tag"
          onEdit={() => onEdit(row.original)}
          onDelete={() => onDelete(row.original)}
        />
      ),
    }),
  ])
}
