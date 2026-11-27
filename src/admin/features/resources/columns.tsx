import { format } from "date-fns"
import {
  ExternalLink,
  FileText,
  MoreHorizontal,
  Pencil,
  Star,
  Trash2,
} from "lucide-react"

import { AdminMediaThumbnail, AdminSlugCopyButton } from "@/admin"
import {
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Switch,
} from "@/shared/ui"

import { ResourceActionsMenu } from "./components/resource-actions-menu"
import { ResourcePricingBadge } from "./components/resource-pricing-badge"
import {
  resourceCategoryColumnHelper,
  resourceColumnHelper,
} from "./table-config"
import type { AdminResource, AdminResourceCategoryWithCount } from "./types"

interface CreateResourceColumnsOptions {
  onEdit: (resource: AdminResource) => void
  onToggleFeatured: (resourceId: string) => void
  onDelete: (resource: AdminResource) => void
}

interface CreateResourceCategoryColumnsOptions {
  onEdit: (category: AdminResourceCategoryWithCount) => void
  onDelete: (category: AdminResourceCategoryWithCount) => void
}

export function createResourceColumns({
  onEdit,
  onToggleFeatured,
  onDelete,
}: CreateResourceColumnsOptions) {
  return resourceColumnHelper.columns([
    resourceColumnHelper.display({
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
              aria-label="Select all resources on current page"
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

    resourceColumnHelper.accessor("title", {
      id: "title",
      header: () => "Resource",
      sortFn: (rowA, rowB) =>
        rowA.original.title.localeCompare(rowB.original.title),
      meta: {
        headerClassName: "min-w-[280px]",
      },
      cell: ({ row }) => {
        const res = row.original

        return (
          <div className="flex items-start gap-3">
            <AdminMediaThumbnail
              src={res.coverImage}
              alt={res.coverImageAlt}
              title={res.title}
              className="mt-0.5 h-11 w-16"
            />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-1.5">
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
                  className="inline-flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ExternalLink className="size-3" />
                </a>
                {res.isFeatured && (
                  <Star
                    className="size-3.5 shrink-0 text-amber-500 lg:hidden"
                    aria-label="Featured resource"
                  />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <AdminSlugCopyButton slug={res.slug} />
              </div>

              {res.description && (
                <p className="line-clamp-1 text-xs text-muted-foreground/80">
                  {res.description}
                </p>
              )}
            </div>
          </div>
        )
      },
    }),

    resourceColumnHelper.accessor((row) => row.category.title, {
      id: "category",
      header: () => "Category",
      sortFn: (rowA, rowB) =>
        rowA.original.category.title.localeCompare(
          rowB.original.category.title
        ),
      meta: {
        headerClassName: "hidden min-w-[150px] md:table-cell",
        cellClassName: "hidden md:table-cell",
      },
      cell: ({ row }) => {
        const cat = row.original.category
        return (
          <Badge
            variant="outline"
            size="sm"
            shape="rounded"
            className="gap-1.5"
          >
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: cat.color ?? "#64748b" }}
            />
            <span>{cat.title}</span>
          </Badge>
        )
      },
    }),

    resourceColumnHelper.accessor("pricing", {
      id: "pricing",
      header: () => "Pricing",
      sortFn: (rowA, rowB) =>
        rowA.original.pricing.localeCompare(rowB.original.pricing),
      meta: {
        headerClassName: "w-28",
      },
      cell: ({ row }) => (
        <div className="pt-0.5">
          <ResourcePricingBadge pricing={row.original.pricing} />
        </div>
      ),
    }),

    resourceColumnHelper.accessor("publishedAt", {
      id: "publishedAt",
      header: () => "Added",
      sortFn: (rowA, rowB) =>
        new Date(rowA.original.publishedAt).getTime() -
        new Date(rowB.original.publishedAt).getTime(),
      meta: {
        headerClassName: "hidden w-32 sm:table-cell",
        cellClassName: "hidden sm:table-cell",
      },
      cell: ({ row }) => (
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {format(new Date(row.original.publishedAt), "MMM dd, yyyy")}
        </span>
      ),
    }),

    resourceColumnHelper.accessor("isFeatured", {
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
        const res = row.original
        return (
          <div className="flex justify-center pt-1">
            <Switch
              size="sm"
              checked={res.isFeatured}
              onCheckedChange={() => onToggleFeatured(res.id)}
              aria-label={`Toggle featured for ${res.title}`}
            />
          </div>
        )
      },
    }),

    resourceColumnHelper.display({
      id: "actions",
      enableSorting: false,
      header: () => <span className="sr-only">Actions</span>,
      meta: {
        headerClassName: "w-14 text-right",
        cellClassName: "w-14 text-right",
      },
      cell: ({ row }) => (
        <ResourceActionsMenu
          resource={row.original}
          onEdit={onEdit}
          onToggleFeatured={onToggleFeatured}
          onDelete={onDelete}
        />
      ),
    }),
  ])
}

export function createResourceCategoryColumns({
  onEdit,
  onDelete,
}: CreateResourceCategoryColumnsOptions) {
  return resourceCategoryColumnHelper.columns([
    resourceCategoryColumnHelper.display({
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
              aria-label="Select all resource categories on current page"
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

    resourceCategoryColumnHelper.accessor("order", {
      id: "order",
      header: () => "Order",
      sortFn: (rowA, rowB) => rowA.original.order - rowB.original.order,
      meta: {
        headerClassName: "w-20",
      },
      cell: ({ row }) => (
        <span className="inline-flex h-6 min-w-8 items-center justify-center rounded bg-muted/60 px-1.5 font-mono text-xs font-semibold text-foreground tabular-nums">
          #{String(row.original.order).padStart(2, "0")}
        </span>
      ),
    }),

    resourceCategoryColumnHelper.accessor("title", {
      id: "title",
      header: () => "Category",
      sortFn: (rowA, rowB) =>
        rowA.original.title.localeCompare(rowB.original.title),
      meta: {
        headerClassName: "min-w-[240px]",
      },
      cell: ({ row }) => {
        const cat = row.original
        return (
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
        )
      },
    }),

    resourceCategoryColumnHelper.accessor((row) => row.icon ?? "", {
      id: "icon",
      header: () => "Icon",
      meta: {
        headerClassName: "hidden w-32 sm:table-cell",
        cellClassName: "hidden sm:table-cell",
      },
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.icon || "—"}
        </span>
      ),
    }),

    resourceCategoryColumnHelper.accessor("resourcesCount", {
      id: "resourcesCount",
      header: () => "Resources",
      sortFn: (rowA, rowB) =>
        rowA.original.resourcesCount - rowB.original.resourcesCount,
      meta: {
        headerClassName: "w-28",
      },
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground tabular-nums">
          <FileText className="size-3" />
          <span>{row.original.resourcesCount}</span>
        </span>
      ),
    }),

    resourceCategoryColumnHelper.display({
      id: "actions",
      enableSorting: false,
      header: () => <span className="sr-only">Actions</span>,
      meta: {
        headerClassName: "w-14 text-right",
        cellClassName: "w-14 text-right",
      },
      cell: ({ row }) => {
        const cat = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Actions for ${cat.title}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-44 text-xs">
              <DropdownMenuItem
                className="cursor-pointer text-xs"
                onClick={() => onEdit(cat)}
              >
                <Pencil className="size-3.5 text-muted-foreground" />
                <span>Edit Category</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer text-xs"
                onClick={() => onDelete(cat)}
              >
                <Trash2 className="size-3.5" />
                <span>Delete Category</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    }),
  ])
}
