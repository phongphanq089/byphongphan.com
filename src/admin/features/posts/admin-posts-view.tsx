import { Link, useNavigate } from "@tanstack/react-router"
import {
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useTable,
} from "@tanstack/react-table"
import {
  Archive,
  CheckCircle2,
  FileEdit,
  FileText,
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

import { createPostColumns } from "./columns"
import { PostPreviewDialog } from "./components/post-preview-dialog"
import { PostsGrid } from "./components/posts-grid"
import { PostsStatsStrip } from "./components/posts-stats-strip"
import { PostsToolbar } from "./components/posts-toolbar"
import { MOCK_CATEGORIES, MOCK_GROUPS, MOCK_POSTS } from "./mock-data"
import { postsTableFeatures } from "./table-config"
import type {
  AdminPost,
  PostsFilterState,
  PostsSortOption,
  PostStatus,
  PostsViewMode,
} from "./types"

const INITIAL_FILTERS: PostsFilterState = {
  search: "",
  status: "all",
  categoryId: "all",
  groupId: "all",
  featuredOnly: false,
}

const INITIAL_SORTING: SortingState = [{ id: "publishedAt", desc: true }]

const INITIAL_COLUMN_VISIBILITY = {
  updatedAt: false,
  readTime: false,
}

function getSortingFromPreset(preset: PostsSortOption): SortingState {
  switch (preset) {
    case "updatedAt_desc":
      return [{ id: "updatedAt", desc: true }]
    case "title_asc":
      return [{ id: "title", desc: false }]
    case "readTime_desc":
      return [{ id: "readTime", desc: true }]
    case "publishedAt_desc":
    default:
      return [{ id: "publishedAt", desc: true }]
  }
}

export function AdminPostsView() {
  const [posts, setPosts] = useState<AdminPost[]>(MOCK_POSTS)
  const [filters, setFilters] = useState<PostsFilterState>(INITIAL_FILTERS)
  const [viewMode, setViewMode] = useState<PostsViewMode>("table")
  const [sorting, setSorting] = useState<SortingState>(INITIAL_SORTING)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [previewPostId, setPreviewPostId] = useState<string | null>(null)

  const navigate = useNavigate()
  const { confirm, ConfirmDialog } = useAdminConfirm()

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.categoryId !== "all" ||
    filters.groupId !== "all" ||
    filters.featuredOnly

  const filteredPosts = useMemo(() => {
    const query = filters.search.trim().toLowerCase()

    return posts.filter((post) => {
      if (filters.status !== "all" && post.status !== filters.status) {
        return false
      }
      if (filters.featuredOnly && !post.isFeatured) {
        return false
      }
      if (
        filters.categoryId !== "all" &&
        !post.categories.some((cat) => cat.id === filters.categoryId)
      ) {
        return false
      }
      if (filters.groupId === "none" && post.groupId !== null) {
        return false
      }
      if (
        filters.groupId !== "all" &&
        filters.groupId !== "none" &&
        post.groupId !== filters.groupId
      ) {
        return false
      }

      if (query) {
        const haystack = [
          post.title,
          post.slug,
          post.excerpt ?? "",
          post.group?.title ?? "",
          ...post.categories.map((c) => c.title),
          ...post.tags.map((t) => `#${t.title}`),
        ]
          .join(" ")
          .toLowerCase()

        if (!haystack.includes(query)) {
          return false
        }
      }

      return true
    })
  }, [posts, filters])

  const handleChangeStatus = useCallback(
    (postId: string, status: PostStatus) => {
      const now = new Date().toISOString()
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                status,
                publishedAt: status === "published" ? now : post.publishedAt,
                updatedAt: now,
              }
            : post
        )
      )
    },
    []
  )

  const handleToggleFeatured = useCallback((postId: string) => {
    const now = new Date().toISOString()
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, isFeatured: !post.isFeatured, updatedAt: now }
          : post
      )
    )
  }, [])

  const handleDuplicate = useCallback((source: AdminPost) => {
    const now = new Date().toISOString()
    const suffix = Math.random().toString(36).slice(2, 6)
    const duplicated: AdminPost = {
      ...source,
      id: `post-${Date.now()}-${suffix}`,
      title: `${source.title} (Copy)`,
      slug: `${source.slug}-copy-${suffix}`,
      status: "draft",
      isFeatured: false,
      createdAt: now,
      updatedAt: now,
    }
    setPosts((prev) => [duplicated, ...prev])
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [])

  const handleDeletePost = useCallback(
    async (post: AdminPost) => {
      const confirmed = await confirm({
        title: "Delete article?",
        description: `This will permanently remove "${post.title}" from the local preview list.`,
        variant: "destructive",
        confirmText: "Delete Article",
        cancelText: "Cancel",
      })

      if (!confirmed) return

      setPosts((prev) => prev.filter((item) => item.id !== post.id))
      setRowSelection((prev) => {
        if (!prev[post.id]) return prev
        const next = { ...prev }
        delete next[post.id]
        return next
      })
      setPreviewPostId((prev) => (prev === post.id ? null : prev))
    },
    [confirm]
  )

  const handleEditPost = useCallback(
    (post: AdminPost) => {
      void navigate({
        to: "/admin/posts/$postId",
        params: { postId: post.id },
      })
    },
    [navigate]
  )

  const columns = useMemo(
    () =>
      createPostColumns({
        onPreview: (post) => setPreviewPostId(post.id),
        onEdit: handleEditPost,
        onChangeStatus: handleChangeStatus,
        onToggleFeatured: handleToggleFeatured,
        onDuplicate: handleDuplicate,
        onDelete: (post) => void handleDeletePost(post),
      }),
    [
      handleChangeStatus,
      handleDeletePost,
      handleDuplicate,
      handleEditPost,
      handleToggleFeatured,
    ]
  )

  const table = useTable({
    features: postsTableFeatures,
    columns,
    data: filteredPosts,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    initialState: {
      columnVisibility: INITIAL_COLUMN_VISIBILITY,
    },
    state: {
      sorting,
      pagination,
      rowSelection,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
  })

  const selectedIds = table.getSelectedRowIds()
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds])

  const previewPost = useMemo(
    () => posts.find((post) => post.id === previewPostId) ?? null,
    [posts, previewPostId]
  )

  const handleFiltersChange = (next: Partial<PostsFilterState>) => {
    setFilters((prev) => ({ ...prev, ...next }))
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS)
    setSorting(INITIAL_SORTING)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const handleBulkStatusChange = (status: PostStatus) => {
    if (selectedIdSet.size === 0) return
    const now = new Date().toISOString()
    setPosts((prev) =>
      prev.map((post) =>
        selectedIdSet.has(post.id)
          ? {
              ...post,
              status,
              publishedAt: status === "published" ? now : post.publishedAt,
              updatedAt: now,
            }
          : post
      )
    )
    table.resetRowSelection()
  }

  const handleBulkDelete = async () => {
    const count = selectedIdSet.size
    if (count === 0) return

    const confirmed = await confirm({
      title: `Delete ${count} selected ${count === 1 ? "article" : "articles"}?`,
      description:
        "Selected articles will be removed from this list. Once backend integration is enabled, this action will permanently delete them from Neon DB.",
      variant: "destructive",
      confirmText: `Delete (${count})`,
      cancelText: "Cancel",
    })

    if (!confirmed) return

    setPosts((prev) => prev.filter((post) => !selectedIdSet.has(post.id)))
    table.resetRowSelection()
  }

  const pageRows = table.getRowModel().rows

  return (
    <div className="flex min-h-[calc(100svh-8.5rem)] flex-1 flex-col gap-5">
      <AdminPageHeader
        title="Blog Posts"
        description="Manage, filter, and organize articles, series order, categories, and publication status."
        badge={
          <Badge variant="outline" size="sm" shape="pill" className="font-mono">
            UI Preview · Mock Data
          </Badge>
        }
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Content & Blog" },
          { label: "Posts" },
        ]}
        actions={
          <Button asChild className="gap-2">
            <Link to="/admin/posts/new">
              <Plus className="size-4" />
              <span>New Article</span>
            </Link>
          </Button>
        }
      />

      <PostsStatsStrip posts={posts} />

      <AdminContentCard padding="none" minHeight="min-h-0" className="flex-1">
        <PostsToolbar
          posts={posts}
          categories={MOCK_CATEGORIES}
          groups={MOCK_GROUPS}
          filters={filters}
          sorting={sorting}
          viewMode={viewMode}
          hasActiveFilters={hasActiveFilters}
          isAllPageSelected={table.getIsAllPageRowsSelected()}
          isSomePageSelected={table.getIsSomePageRowsSelected()}
          onToggleSelectAllPage={() => table.toggleAllPageRowsSelected()}
          onFiltersChange={handleFiltersChange}
          onSortPresetChange={(preset) => {
            setSorting(getSortingFromPreset(preset))
            setPagination((prev) => ({ ...prev, pageIndex: 0 }))
          }}
          onViewModeChange={setViewMode}
          onResetFilters={handleResetFilters}
        />

        <div className="flex flex-1 flex-col px-5 py-4">
          {posts.length === 0 ? (
            <AdminEmptyState
              icon={<FileText className="size-6" />}
              title="No articles in this workspace"
              description="Create your first article or restore the sample dataset to preview the management table."
              actions={
                <>
                  <Button asChild className="gap-2">
                    <Link to="/admin/posts/new">
                      <Plus className="size-4" />
                      <span>Create first article</span>
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() => {
                      setPosts(MOCK_POSTS)
                      handleResetFilters()
                    }}
                  >
                    <RotateCcw className="size-4" />
                    <span>Restore sample data</span>
                  </Button>
                </>
              }
            />
          ) : filteredPosts.length === 0 ? (
            <AdminEmptyState
              icon={<SearchX className="size-6" />}
              title="No matching articles"
              description="Try adjusting your search query, status tab, category, or series filter."
              actions={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="gap-1.5"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset all filters</span>
                </Button>
              }
            />
          ) : viewMode === "table" ? (
            <AdminDataTable table={table} />
          ) : (
            <PostsGrid
              rows={pageRows}
              onPreview={(post) => setPreviewPostId(post.id)}
              onEdit={handleEditPost}
              onChangeStatus={handleChangeStatus}
              onToggleFeatured={handleToggleFeatured}
              onDuplicate={handleDuplicate}
              onDelete={(post) => void handleDeletePost(post)}
            />
          )}
        </div>

        {filteredPosts.length > 0 && (
          <AdminTableBottomBar
            table={table}
            selectedCount={selectedIds.length}
            totalRows={filteredPosts.length}
            singularLabel="post"
            pluralLabel="posts"
            bulkActions={
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleBulkStatusChange("published")}
                      aria-label="Publish selected posts"
                      className="size-7 rounded-lg"
                    >
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Publish selected</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleBulkStatusChange("draft")}
                      aria-label="Move selected posts to draft"
                      className="size-7 rounded-lg"
                    >
                      <FileEdit className="size-3.5 text-amber-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Move to draft</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleBulkStatusChange("archived")}
                      aria-label="Archive selected posts"
                      className="size-7 rounded-lg"
                    >
                      <Archive className="size-3.5 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Archive selected</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => void handleBulkDelete()}
                      aria-label="Delete selected posts"
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
      </AdminContentCard>

      <PostPreviewDialog
        post={previewPost}
        open={Boolean(previewPost)}
        onOpenChange={(open) => {
          if (!open) setPreviewPostId(null)
        }}
        onEdit={handleEditPost}
        onChangeStatus={handleChangeStatus}
        onToggleFeatured={handleToggleFeatured}
      />

      <ConfirmDialog />
    </div>
  )
}
