import {
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useTable,
} from "@tanstack/react-table"
import {
  BookmarkCheck,
  FolderTree,
  Plus,
  RotateCcw,
  SearchX,
  Star,
  Trash2,
} from "lucide-react"
import { useCallback, useMemo, useState } from "react"

import {
  AdminContentCard,
  AdminDataTable,
  AdminEmptyState,
  AdminPageHeader,
  AdminTableBottomBar,
  useAdminConfirm,
} from "@/admin"
import {
  Badge,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui"

import { createResourceCategoryColumns, createResourceColumns } from "./columns"
import { ResourceCategoryFormDialog } from "./components/resource-category-form-dialog"
import { ResourceFormDialog } from "./components/resource-form-dialog"
import { ResourcesGrid } from "./components/resources-grid"
import { ResourcesStatsStrip } from "./components/resources-stats-strip"
import { ResourcesToolbar } from "./components/resources-toolbar"
import { MOCK_RESOURCE_CATEGORIES, MOCK_RESOURCES } from "./mock-data"
import { resourcesTableFeatures } from "./table-config"
import type {
  AdminResource,
  AdminResourceCategory,
  AdminResourceCategoryWithCount,
  ResourceCategoryFormValues,
  ResourceFormValues,
  ResourcesFilterState,
  ResourcesTab,
  ResourcesViewMode,
} from "./types"

const INITIAL_FILTERS: ResourcesFilterState = {
  search: "",
  categoryId: "all",
  pricing: "all",
  featuredOnly: false,
}

export function AdminResourcesView() {
  const [activeTab, setActiveTab] = useState<ResourcesTab>("resources")
  const [resources, setResources] = useState<AdminResource[]>(MOCK_RESOURCES)
  const [categories, setCategories] = useState<AdminResourceCategory[]>(
    MOCK_RESOURCE_CATEGORIES
  )
  const [filters, setFilters] = useState<ResourcesFilterState>(INITIAL_FILTERS)
  const [viewMode, setViewMode] = useState<ResourcesViewMode>("table")

  const [resSorting, setResSorting] = useState<SortingState>([
    { id: "publishedAt", desc: true },
  ])
  const [resPagination, setResPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  })
  const [resSelection, setResSelection] = useState<RowSelectionState>({})

  const [catSorting, setCatSorting] = useState<SortingState>([
    { id: "order", desc: false },
  ])
  const [catPagination, setCatPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  })
  const [catSelection, setCatSelection] = useState<RowSelectionState>({})

  const [resFormOpen, setResFormOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<AdminResource | null>(
    null
  )
  const [catFormOpen, setCatFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] =
    useState<AdminResourceCategoryWithCount | null>(null)

  const { confirm, ConfirmDialog } = useAdminConfirm()

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.categoryId !== "all" ||
    filters.pricing !== "all" ||
    filters.featuredOnly

  const filteredResources = useMemo(() => {
    const q = filters.search.trim().toLowerCase()

    return resources.filter((res) => {
      if (filters.featuredOnly && !res.isFeatured) return false
      if (filters.categoryId !== "all" && res.categoryId !== filters.categoryId)
        return false
      if (filters.pricing !== "all" && res.pricing !== filters.pricing)
        return false

      if (q) {
        const haystack = [
          res.title,
          res.slug,
          res.url,
          res.description ?? "",
          res.category.title,
        ]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }

      return true
    })
  }, [resources, filters])

  const categoriesWithCount = useMemo<AdminResourceCategoryWithCount[]>(() => {
    const q = filters.search.trim().toLowerCase()
    const mapped = categories.map((cat) => ({
      ...cat,
      resourcesCount: resources.filter((r) => r.categoryId === cat.id).length,
    }))

    if (!q || activeTab !== "categories") return mapped
    return mapped.filter((c) =>
      [c.title, c.slug, c.icon ?? ""].join(" ").toLowerCase().includes(q)
    )
  }, [categories, resources, filters.search, activeTab])

  const handleOpenCreate = () => {
    if (activeTab === "resources") {
      setEditingResource(null)
      setResFormOpen(true)
    } else {
      setEditingCategory(null)
      setCatFormOpen(true)
    }
  }

  const handleToggleFeatured = useCallback((resourceId: string) => {
    const now = new Date().toISOString()
    setResources((prev) =>
      prev.map((r) =>
        r.id === resourceId
          ? { ...r, isFeatured: !r.isFeatured, updatedAt: now }
          : r
      )
    )
  }, [])

  const handleDeleteResource = useCallback(
    async (resource: AdminResource) => {
      const confirmed = await confirm({
        title: "Delete resource?",
        description: `This will permanently remove "${resource.title}" from the curated resources list.`,
        variant: "destructive",
        confirmText: "Delete Resource",
        cancelText: "Cancel",
      })
      if (!confirmed) return

      setResources((prev) => prev.filter((item) => item.id !== resource.id))
      setResSelection((prev) => {
        if (!prev[resource.id]) return prev
        const next = { ...prev }
        delete next[resource.id]
        return next
      })
    },
    [confirm]
  )

  const handleDeleteCategory = useCallback(
    async (category: AdminResourceCategoryWithCount) => {
      const confirmed = await confirm({
        title: "Delete resource category?",
        description:
          category.resourcesCount > 0
            ? `"${category.title}" has ${category.resourcesCount} resources. Reassign or delete them before removing this category in production (onDelete: "restrict").`
            : `This will permanently remove "${category.title}".`,
        variant: "destructive",
        confirmText: "Delete Category",
        cancelText: "Cancel",
      })
      if (!confirmed) return

      setCategories((prev) => prev.filter((item) => item.id !== category.id))
      setCatSelection((prev) => {
        if (!prev[category.id]) return prev
        const next = { ...prev }
        delete next[category.id]
        return next
      })
    },
    [confirm]
  )

  const resourceColumns = useMemo(
    () =>
      createResourceColumns({
        onEdit: (res) => {
          setEditingResource(res)
          setResFormOpen(true)
        },
        onToggleFeatured: handleToggleFeatured,
        onDelete: (res) => void handleDeleteResource(res),
      }),
    [handleDeleteResource, handleToggleFeatured]
  )

  const categoryColumns = useMemo(
    () =>
      createResourceCategoryColumns({
        onEdit: (cat) => {
          setEditingCategory(cat)
          setCatFormOpen(true)
        },
        onDelete: (cat) => void handleDeleteCategory(cat),
      }),
    [handleDeleteCategory]
  )

  const resourceTable = useTable({
    features: resourcesTableFeatures,
    columns: resourceColumns,
    data: filteredResources,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    state: {
      sorting: resSorting,
      pagination: resPagination,
      rowSelection: resSelection,
    },
    onSortingChange: setResSorting,
    onPaginationChange: setResPagination,
    onRowSelectionChange: setResSelection,
  })

  const categoryTable = useTable({
    features: resourcesTableFeatures,
    columns: categoryColumns,
    data: categoriesWithCount,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    state: {
      sorting: catSorting,
      pagination: catPagination,
      rowSelection: catSelection,
    },
    onSortingChange: setCatSorting,
    onPaginationChange: setCatPagination,
    onRowSelectionChange: setCatSelection,
  })

  const handleSubmitResource = (values: ResourceFormValues) => {
    const now = new Date().toISOString()
    const category =
      categories.find((c) => c.id === values.categoryId) ?? categories[0]
    if (!category) return

    if (editingResource) {
      setResources((prev) =>
        prev.map((r) =>
          r.id === editingResource.id
            ? {
                ...r,
                title: values.title,
                slug: values.slug,
                url: values.url,
                description: values.description || null,
                coverImage: values.coverImage,
                coverImageAlt: values.coverImageAlt || null,
                logo: values.logo || null,
                categoryId: category.id,
                category,
                pricing: values.pricing,
                isFeatured: values.isFeatured,
                publishedAt: new Date(values.publishedAt || now).toISOString(),
                updatedAt: now,
              }
            : r
        )
      )
      return
    }

    const created: AdminResource = {
      id: `res-${Date.now()}`,
      title: values.title,
      slug: values.slug,
      url: values.url,
      description: values.description || null,
      coverImage: values.coverImage,
      coverImageAlt: values.coverImageAlt || null,
      logo: values.logo || null,
      categoryId: category.id,
      category,
      pricing: values.pricing,
      isFeatured: values.isFeatured,
      publishedAt: new Date(values.publishedAt || now).toISOString(),
      createdAt: now,
      updatedAt: now,
    }
    setResources((prev) => [created, ...prev])
    setResPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const handleSubmitCategory = (values: ResourceCategoryFormValues) => {
    const now = new Date().toISOString()
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                title: values.title,
                slug: values.slug,
                icon: values.icon || null,
                color: values.color,
                order: values.order,
                updatedAt: now,
              }
            : c
        )
      )
      return
    }

    const created: AdminResourceCategory = {
      id: `rcat-${Date.now()}`,
      title: values.title,
      slug: values.slug,
      icon: values.icon || null,
      color: values.color,
      order: values.order,
      createdAt: now,
      updatedAt: now,
    }
    setCategories((prev) => [...prev, created])
  }

  const selectedResIds = resourceTable.getSelectedRowIds()
  const selectedCatIds = categoryTable.getSelectedRowIds()

  const handleBulkFeatured = (isFeatured: boolean) => {
    if (selectedResIds.length === 0) return
    const idSet = new Set(selectedResIds)
    const now = new Date().toISOString()
    setResources((prev) =>
      prev.map((r) =>
        idSet.has(r.id) ? { ...r, isFeatured, updatedAt: now } : r
      )
    )
    resourceTable.resetRowSelection()
  }

  const handleBulkDeleteResources = async () => {
    const count = selectedResIds.length
    if (count === 0) return
    const confirmed = await confirm({
      title: `Delete ${count} selected ${count === 1 ? "resource" : "resources"}?`,
      description:
        "Selected resources will be permanently removed from this list.",
      variant: "destructive",
      confirmText: `Delete (${count})`,
      cancelText: "Cancel",
    })
    if (!confirmed) return

    const idSet = new Set(selectedResIds)
    setResources((prev) => prev.filter((r) => !idSet.has(r.id)))
    resourceTable.resetRowSelection()
  }

  const handleBulkDeleteCategories = async () => {
    const count = selectedCatIds.length
    if (count === 0) return
    const confirmed = await confirm({
      title: `Delete ${count} selected ${count === 1 ? "category" : "categories"}?`,
      description: "Selected resource categories will be removed.",
      variant: "destructive",
      confirmText: `Delete (${count})`,
      cancelText: "Cancel",
    })
    if (!confirmed) return

    const idSet = new Set(selectedCatIds)
    setCategories((prev) => prev.filter((c) => !idSet.has(c.id)))
    categoryTable.resetRowSelection()
  }

  const pageResourceRows = resourceTable.getRowModel().rows

  return (
    <div className="flex min-h-[calc(100svh-8.5rem)] flex-1 flex-col gap-5">
      <AdminPageHeader
        title="Resources & Tools"
        description="Curate design tools, repositories, icons, and inspiration links."
        badge={
          <Badge variant="outline" size="sm" shape="pill" className="font-mono">
            UI Preview · Mock Data
          </Badge>
        }
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Showcase & Registry" },
          { label: "Resources" },
        ]}
        actions={
          <Button type="button" className="gap-2" onClick={handleOpenCreate}>
            <Plus className="size-4" />
            <span>
              {activeTab === "resources" ? "Add Resource" : "New Category"}
            </span>
          </Button>
        }
      />

      <ResourcesStatsStrip resources={resources} categories={categories} />

      <AdminContentCard padding="none" minHeight="min-h-0" className="flex-1">
        <ResourcesToolbar
          activeTab={activeTab}
          resourcesCount={resources.length}
          categoriesCount={categories.length}
          categories={categories}
          filters={filters}
          viewMode={viewMode}
          hasActiveFilters={hasActiveFilters}
          isAllPageSelected={resourceTable.getIsAllPageRowsSelected()}
          isSomePageSelected={resourceTable.getIsSomePageRowsSelected()}
          onTabChange={(tab) => {
            setActiveTab(tab)
            setResPagination((prev) => ({ ...prev, pageIndex: 0 }))
            setCatPagination((prev) => ({ ...prev, pageIndex: 0 }))
          }}
          onToggleSelectAllPage={() =>
            resourceTable.toggleAllPageRowsSelected()
          }
          onFiltersChange={(next) => {
            setFilters((prev) => ({ ...prev, ...next }))
            setResPagination((prev) => ({ ...prev, pageIndex: 0 }))
          }}
          onViewModeChange={setViewMode}
          onResetFilters={() => {
            setFilters(INITIAL_FILTERS)
            setResPagination((prev) => ({ ...prev, pageIndex: 0 }))
          }}
        />

        <div className="flex flex-1 flex-col px-5 py-4">
          {activeTab === "resources" ? (
            resources.length === 0 ? (
              <AdminEmptyState
                icon={<BookmarkCheck className="size-6" />}
                title="No curated resources yet"
                description="Add external tools, design systems, and utilities to feature on your site."
                actions={
                  <>
                    <Button
                      type="button"
                      className="gap-2"
                      onClick={handleOpenCreate}
                    >
                      <Plus className="size-4" />
                      <span>Add first resource</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2"
                      onClick={() => setResources(MOCK_RESOURCES)}
                    >
                      <RotateCcw className="size-4" />
                      <span>Restore sample data</span>
                    </Button>
                  </>
                }
              />
            ) : filteredResources.length === 0 ? (
              <AdminEmptyState
                icon={<SearchX className="size-6" />}
                title="No matching resources"
                description="Try adjusting your search query, category, pricing, or featured filter."
                actions={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters(INITIAL_FILTERS)}
                    className="gap-1.5"
                  >
                    <RotateCcw className="size-3.5" />
                    <span>Reset filters</span>
                  </Button>
                }
              />
            ) : viewMode === "table" ? (
              <AdminDataTable table={resourceTable} />
            ) : (
              <ResourcesGrid
                rows={pageResourceRows}
                onEdit={(res) => {
                  setEditingResource(res)
                  setResFormOpen(true)
                }}
                onToggleFeatured={handleToggleFeatured}
                onDelete={(res) => void handleDeleteResource(res)}
              />
            )
          ) : categories.length === 0 ? (
            <AdminEmptyState
              icon={<FolderTree className="size-6" />}
              title="No resource categories"
              description="Create ordered categories to organize resource tabs."
              actions={
                <Button
                  type="button"
                  className="gap-2"
                  onClick={handleOpenCreate}
                >
                  <Plus className="size-4" />
                  <span>Add first category</span>
                </Button>
              }
            />
          ) : (
            <AdminDataTable table={categoryTable} />
          )}
        </div>

        {activeTab === "resources" && filteredResources.length > 0 && (
          <AdminTableBottomBar
            table={resourceTable}
            selectedCount={selectedResIds.length}
            totalRows={filteredResources.length}
            singularLabel="resource"
            pluralLabel="resources"
            bulkActions={
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleBulkFeatured(true)}
                      aria-label="Mark selected as featured"
                      className="size-7 rounded-lg"
                    >
                      <Star className="size-3.5 text-amber-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Mark featured</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => void handleBulkDeleteResources()}
                      aria-label="Delete selected resources"
                      className="size-7 rounded-lg"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Delete selected</TooltipContent>
                </Tooltip>
              </>
            }
          />
        )}

        {activeTab === "categories" && categoriesWithCount.length > 0 && (
          <AdminTableBottomBar
            table={categoryTable}
            selectedCount={selectedCatIds.length}
            totalRows={categoriesWithCount.length}
            singularLabel="category"
            pluralLabel="categories"
            bulkActions={
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => void handleBulkDeleteCategories()}
                    aria-label="Delete selected categories"
                    className="size-7 rounded-lg"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Delete selected</TooltipContent>
              </Tooltip>
            }
          />
        )}
      </AdminContentCard>

      <ResourceFormDialog
        key={editingResource?.id ?? (resFormOpen ? "new-res" : "closed-res")}
        open={resFormOpen}
        initialResource={editingResource}
        categories={categories}
        onOpenChange={setResFormOpen}
        onSubmit={handleSubmitResource}
      />

      <ResourceCategoryFormDialog
        key={editingCategory?.id ?? (catFormOpen ? "new-rcat" : "closed-rcat")}
        open={catFormOpen}
        initialCategory={editingCategory}
        onOpenChange={setCatFormOpen}
        onSubmit={handleSubmitCategory}
      />

      <ConfirmDialog />
    </div>
  )
}
