import {
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useTable,
} from "@tanstack/react-table"
import {
  FolderTree,
  Hash,
  Plus,
  RotateCcw,
  SearchX,
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

import { createCategoryColumns, createTagColumns } from "./columns"
import { CategoryFormDialog } from "./components/category-form-dialog"
import { TagFormDialog } from "./components/tag-form-dialog"
import { TaxonomyStatsStrip } from "./components/taxonomy-stats-strip"
import { TaxonomyToolbar } from "./components/taxonomy-toolbar"
import { MOCK_CATEGORIES_WITH_COUNT, MOCK_TAGS_WITH_COUNT } from "./mock-data"
import { taxonomyTableFeatures } from "./table-config"
import type {
  AdminCategoryWithCount,
  AdminTagWithCount,
  CategoryFormValues,
  TagFormValues,
  TaxonomyTab,
} from "./types"

export function AdminCategoriesView() {
  const [activeTab, setActiveTab] = useState<TaxonomyTab>("categories")
  const [search, setSearch] = useState("")

  const [categories, setCategories] = useState<AdminCategoryWithCount[]>(
    MOCK_CATEGORIES_WITH_COUNT
  )
  const [tags, setTags] = useState<AdminTagWithCount[]>(MOCK_TAGS_WITH_COUNT)

  // Category table state
  const [catSorting, setCatSorting] = useState<SortingState>([
    { id: "postsCount", desc: true },
  ])
  const [catPagination, setCatPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  })
  const [catSelection, setCatSelection] = useState<RowSelectionState>({})

  // Tag table state
  const [tagSorting, setTagSorting] = useState<SortingState>([
    { id: "postsCount", desc: true },
  ])
  const [tagPagination, setTagPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  })
  const [tagSelection, setTagSelection] = useState<RowSelectionState>({})

  // Dialog states
  const [catFormOpen, setCatFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] =
    useState<AdminCategoryWithCount | null>(null)
  const [tagFormOpen, setTagFormOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<AdminTagWithCount | null>(null)

  const { confirm, ConfirmDialog } = useAdminConfirm()

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return categories
    return categories.filter((c) =>
      [c.title, c.slug, c.description ?? ""].join(" ").toLowerCase().includes(q)
    )
  }, [categories, search])

  const filteredTags = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return tags
    return tags.filter((t) =>
      [`#${t.title}`, t.slug, t.description ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q)
    )
  }, [tags, search])

  const handleOpenCreate = () => {
    if (activeTab === "categories") {
      setEditingCategory(null)
      setCatFormOpen(true)
    } else {
      setEditingTag(null)
      setTagFormOpen(true)
    }
  }

  const handleDeleteCategory = useCallback(
    async (category: AdminCategoryWithCount) => {
      const confirmed = await confirm({
        title: "Delete category?",
        description:
          category.postsCount > 0
            ? `"${category.title}" is currently linked to ${category.postsCount} articles. Deleting it will remove those associations.`
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

  const handleDeleteTag = useCallback(
    async (tag: AdminTagWithCount) => {
      const confirmed = await confirm({
        title: "Delete tag?",
        description:
          tag.postsCount > 0
            ? `"#${tag.title}" is currently used on ${tag.postsCount} articles. Deleting it will unlink it from those articles.`
            : `This will permanently remove "#${tag.title}".`,
        variant: "destructive",
        confirmText: "Delete Tag",
        cancelText: "Cancel",
      })
      if (!confirmed) return

      setTags((prev) => prev.filter((item) => item.id !== tag.id))
      setTagSelection((prev) => {
        if (!prev[tag.id]) return prev
        const next = { ...prev }
        delete next[tag.id]
        return next
      })
    },
    [confirm]
  )

  const categoryColumns = useMemo(
    () =>
      createCategoryColumns({
        onEdit: (cat) => {
          setEditingCategory(cat)
          setCatFormOpen(true)
        },
        onDelete: (cat) => void handleDeleteCategory(cat),
      }),
    [handleDeleteCategory]
  )

  const tagColumns = useMemo(
    () =>
      createTagColumns({
        onEdit: (tag) => {
          setEditingTag(tag)
          setTagFormOpen(true)
        },
        onDelete: (tag) => void handleDeleteTag(tag),
      }),
    [handleDeleteTag]
  )

  const categoryTable = useTable({
    features: taxonomyTableFeatures,
    columns: categoryColumns,
    data: filteredCategories,
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

  const tagTable = useTable({
    features: taxonomyTableFeatures,
    columns: tagColumns,
    data: filteredTags,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    state: {
      sorting: tagSorting,
      pagination: tagPagination,
      rowSelection: tagSelection,
    },
    onSortingChange: setTagSorting,
    onPaginationChange: setTagPagination,
    onRowSelectionChange: setTagSelection,
  })

  const handleSubmitCategory = (values: CategoryFormValues) => {
    const now = new Date().toISOString()
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                title: values.title,
                slug: values.slug,
                description: values.description || null,
                color: values.color,
                updatedAt: now,
              }
            : c
        )
      )
      return
    }

    const created: AdminCategoryWithCount = {
      id: `cat-${Date.now()}`,
      title: values.title,
      slug: values.slug,
      description: values.description || null,
      color: values.color,
      postsCount: 0,
      createdAt: now,
      updatedAt: now,
    }
    setCategories((prev) => [created, ...prev])
    setCatPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const handleSubmitTag = (values: TagFormValues) => {
    const now = new Date().toISOString()
    if (editingTag) {
      setTags((prev) =>
        prev.map((t) =>
          t.id === editingTag.id
            ? {
                ...t,
                title: values.title,
                slug: values.slug,
                description: values.description || null,
                updatedAt: now,
              }
            : t
        )
      )
      return
    }

    const created: AdminTagWithCount = {
      id: `tag-${Date.now()}`,
      title: values.title,
      slug: values.slug,
      description: values.description || null,
      postsCount: 0,
      createdAt: now,
      updatedAt: now,
    }
    setTags((prev) => [created, ...prev])
    setTagPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const selectedCatIds = categoryTable.getSelectedRowIds()
  const selectedTagIds = tagTable.getSelectedRowIds()

  const handleBulkDeleteCategories = async () => {
    const count = selectedCatIds.length
    if (count === 0) return
    const confirmed = await confirm({
      title: `Delete ${count} selected ${count === 1 ? "category" : "categories"}?`,
      description:
        "Selected categories will be removed and unlinked from existing articles.",
      variant: "destructive",
      confirmText: `Delete (${count})`,
      cancelText: "Cancel",
    })
    if (!confirmed) return

    const idSet = new Set(selectedCatIds)
    setCategories((prev) => prev.filter((c) => !idSet.has(c.id)))
    categoryTable.resetRowSelection()
  }

  const handleBulkDeleteTags = async () => {
    const count = selectedTagIds.length
    if (count === 0) return
    const confirmed = await confirm({
      title: `Delete ${count} selected ${count === 1 ? "tag" : "tags"}?`,
      description:
        "Selected tags will be removed and unlinked from existing articles.",
      variant: "destructive",
      confirmText: `Delete (${count})`,
      cancelText: "Cancel",
    })
    if (!confirmed) return

    const idSet = new Set(selectedTagIds)
    setTags((prev) => prev.filter((t) => !idSet.has(t.id)))
    tagTable.resetRowSelection()
  }

  return (
    <div className="flex min-h-[calc(100svh-8.5rem)] flex-1 flex-col gap-5">
      <AdminPageHeader
        title="Categories & Tags"
        description="Taxonomy management for blog articles, topic colors, and #tag filtering."
        badge={
          <Badge variant="outline" size="sm" shape="pill" className="font-mono">
            UI Preview · Mock Data
          </Badge>
        }
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Content & Blog" },
          { label: "Categories" },
        ]}
        actions={
          <Button type="button" className="gap-2" onClick={handleOpenCreate}>
            <Plus className="size-4" />
            <span>
              {activeTab === "categories" ? "New Category" : "New Tag"}
            </span>
          </Button>
        }
      />

      <TaxonomyStatsStrip categories={categories} tags={tags} />

      <AdminContentCard padding="none" minHeight="min-h-0" className="flex-1">
        <TaxonomyToolbar
          activeTab={activeTab}
          categoriesCount={categories.length}
          tagsCount={tags.length}
          search={search}
          onTabChange={(tab) => {
            setActiveTab(tab)
            setCatPagination((prev) => ({ ...prev, pageIndex: 0 }))
            setTagPagination((prev) => ({ ...prev, pageIndex: 0 }))
          }}
          onSearchChange={(nextSearch) => {
            setSearch(nextSearch)
            setCatPagination((prev) => ({ ...prev, pageIndex: 0 }))
            setTagPagination((prev) => ({ ...prev, pageIndex: 0 }))
          }}
        />

        <div className="flex flex-1 flex-col px-5 py-4">
          {activeTab === "categories" ? (
            categories.length === 0 ? (
              <AdminEmptyState
                icon={<FolderTree className="size-6" />}
                title="No categories created"
                description="Create categories with accent colors to organize articles by domain."
                actions={
                  <>
                    <Button
                      type="button"
                      className="gap-2"
                      onClick={handleOpenCreate}
                    >
                      <Plus className="size-4" />
                      <span>Add first category</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2"
                      onClick={() => setCategories(MOCK_CATEGORIES_WITH_COUNT)}
                    >
                      <RotateCcw className="size-4" />
                      <span>Restore sample data</span>
                    </Button>
                  </>
                }
              />
            ) : filteredCategories.length === 0 ? (
              <AdminEmptyState
                icon={<SearchX className="size-6" />}
                title="No matching categories"
                description="Try another search keyword or clear your search filter."
                actions={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSearch("")}
                    className="gap-1.5"
                  >
                    <RotateCcw className="size-3.5" />
                    <span>Reset search</span>
                  </Button>
                }
              />
            ) : (
              <AdminDataTable table={categoryTable} />
            )
          ) : tags.length === 0 ? (
            <AdminEmptyState
              icon={<Hash className="size-6" />}
              title="No tags created"
              description="Create #tags to help readers filter articles by technology or concept."
              actions={
                <>
                  <Button
                    type="button"
                    className="gap-2"
                    onClick={handleOpenCreate}
                  >
                    <Plus className="size-4" />
                    <span>Add first tag</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() => setTags(MOCK_TAGS_WITH_COUNT)}
                  >
                    <RotateCcw className="size-4" />
                    <span>Restore sample data</span>
                  </Button>
                </>
              }
            />
          ) : filteredTags.length === 0 ? (
            <AdminEmptyState
              icon={<SearchX className="size-6" />}
              title="No matching tags"
              description="Try another search keyword or clear your search filter."
              actions={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSearch("")}
                  className="gap-1.5"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset search</span>
                </Button>
              }
            />
          ) : (
            <AdminDataTable table={tagTable} />
          )}
        </div>

        {activeTab === "categories" && filteredCategories.length > 0 && (
          <AdminTableBottomBar
            table={categoryTable}
            selectedCount={selectedCatIds.length}
            totalRows={filteredCategories.length}
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

        {activeTab === "tags" && filteredTags.length > 0 && (
          <AdminTableBottomBar
            table={tagTable}
            selectedCount={selectedTagIds.length}
            totalRows={filteredTags.length}
            singularLabel="tag"
            pluralLabel="tags"
            bulkActions={
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => void handleBulkDeleteTags()}
                    aria-label="Delete selected tags"
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

      <CategoryFormDialog
        key={editingCategory?.id ?? (catFormOpen ? "new-cat" : "closed-cat")}
        open={catFormOpen}
        initialCategory={editingCategory}
        onOpenChange={setCatFormOpen}
        onSubmit={handleSubmitCategory}
      />

      <TagFormDialog
        key={editingTag?.id ?? (tagFormOpen ? "new-tag" : "closed-tag")}
        open={tagFormOpen}
        initialTag={editingTag}
        onOpenChange={setTagFormOpen}
        onSubmit={handleSubmitTag}
      />

      <ConfirmDialog />
    </div>
  )
}
