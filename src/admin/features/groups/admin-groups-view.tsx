import {
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useTable,
} from "@tanstack/react-table"
import {
  CheckCircle2,
  Clock,
  Library,
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

import { createGroupColumns } from "./columns"
import { GroupFormDialog } from "./components/group-form-dialog"
import { GroupPostsDialog } from "./components/group-posts-dialog"
import { GroupsGrid } from "./components/groups-grid"
import { GroupsStatsStrip } from "./components/groups-stats-strip"
import { GroupsToolbar } from "./components/groups-toolbar"
import { MOCK_GROUPS_WITH_POSTS } from "./mock-data"
import { groupsTableFeatures } from "./table-config"
import type {
  AdminGroupWithPosts,
  GroupFormValues,
  GroupsFilterState,
  GroupsViewMode,
} from "./types"

const INITIAL_FILTERS: GroupsFilterState = {
  search: "",
  completion: "all",
}

const INITIAL_SORTING: SortingState = [{ id: "updatedAt", desc: true }]

export function AdminGroupsView() {
  const [groups, setGroups] = useState<AdminGroupWithPosts[]>(
    MOCK_GROUPS_WITH_POSTS
  )
  const [filters, setFilters] = useState<GroupsFilterState>(INITIAL_FILTERS)
  const [viewMode, setViewMode] = useState<GroupsViewMode>("table")
  const [sorting, setSorting] = useState<SortingState>(INITIAL_SORTING)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const [formOpen, setFormOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<AdminGroupWithPosts | null>(
    null
  )
  const [viewingGroupId, setViewingGroupId] = useState<string | null>(null)

  const { confirm, ConfirmDialog } = useAdminConfirm()

  const hasActiveFilters =
    filters.search.trim() !== "" || filters.completion !== "all"

  const filteredGroups = useMemo(() => {
    const query = filters.search.trim().toLowerCase()

    return groups.filter((group) => {
      if (filters.completion === "completed" && !group.isCompleted) {
        return false
      }
      if (filters.completion === "ongoing" && group.isCompleted) {
        return false
      }

      if (query) {
        const haystack = [group.title, group.slug, group.description ?? ""]
          .join(" ")
          .toLowerCase()

        if (!haystack.includes(query)) {
          return false
        }
      }

      return true
    })
  }, [groups, filters])

  const handleOpenCreate = () => {
    setEditingGroup(null)
    setFormOpen(true)
  }

  const handleOpenEdit = useCallback((group: AdminGroupWithPosts) => {
    setEditingGroup(group)
    setFormOpen(true)
  }, [])

  const handleToggleCompleted = useCallback((groupId: string) => {
    const now = new Date().toISOString()
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, isCompleted: !group.isCompleted, updatedAt: now }
          : group
      )
    )
  }, [])

  const handleDeleteGroup = useCallback(
    async (group: AdminGroupWithPosts) => {
      const confirmed = await confirm({
        title: "Delete series?",
        description:
          group.posts.length > 0
            ? `"${group.title}" currently has ${group.posts.length} linked articles. Deleting this series will unlink those articles (groupId = null).`
            : `This will permanently remove "${group.title}" from the series list.`,
        variant: "destructive",
        confirmText: "Delete Series",
        cancelText: "Cancel",
      })

      if (!confirmed) return

      setGroups((prev) => prev.filter((item) => item.id !== group.id))
      setRowSelection((prev) => {
        if (!prev[group.id]) return prev
        const next = { ...prev }
        delete next[group.id]
        return next
      })
      setViewingGroupId((prev) => (prev === group.id ? null : prev))
    },
    [confirm]
  )

  const handleSubmitForm = (values: GroupFormValues) => {
    const now = new Date().toISOString()

    if (editingGroup) {
      setGroups((prev) =>
        prev.map((group) =>
          group.id === editingGroup.id
            ? {
                ...group,
                title: values.title,
                slug: values.slug,
                description: values.description || null,
                coverImage: values.coverImage || null,
                isCompleted: values.isCompleted,
                updatedAt: now,
              }
            : group
        )
      )
      return
    }

    const created: AdminGroupWithPosts = {
      id: `grp-${Date.now()}`,
      title: values.title,
      slug: values.slug,
      description: values.description || null,
      coverImage: values.coverImage || null,
      isCompleted: values.isCompleted,
      posts: [],
      createdAt: now,
      updatedAt: now,
    }
    setGroups((prev) => [created, ...prev])
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const columns = useMemo(
    () =>
      createGroupColumns({
        onViewPosts: (group) => setViewingGroupId(group.id),
        onEdit: handleOpenEdit,
        onToggleCompleted: handleToggleCompleted,
        onDelete: (group) => void handleDeleteGroup(group),
      }),
    [handleDeleteGroup, handleOpenEdit, handleToggleCompleted]
  )

  const table = useTable({
    features: groupsTableFeatures,
    columns,
    data: filteredGroups,
    getRowId: (row) => row.id,
    enableRowSelection: true,
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

  const viewingGroup = useMemo(
    () => groups.find((g) => g.id === viewingGroupId) ?? null,
    [groups, viewingGroupId]
  )

  const handleFiltersChange = (next: Partial<GroupsFilterState>) => {
    setFilters((prev) => ({ ...prev, ...next }))
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS)
    setSorting(INITIAL_SORTING)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const handleBulkCompletionChange = (isCompleted: boolean) => {
    if (selectedIdSet.size === 0) return
    const now = new Date().toISOString()
    setGroups((prev) =>
      prev.map((group) =>
        selectedIdSet.has(group.id)
          ? { ...group, isCompleted, updatedAt: now }
          : group
      )
    )
    table.resetRowSelection()
  }

  const handleBulkDelete = async () => {
    const count = selectedIdSet.size
    if (count === 0) return

    const confirmed = await confirm({
      title: `Delete ${count} selected series?`,
      description:
        "Selected series will be removed. Linked articles will remain intact with their series reference cleared.",
      variant: "destructive",
      confirmText: `Delete (${count})`,
      cancelText: "Cancel",
    })

    if (!confirmed) return

    setGroups((prev) => prev.filter((group) => !selectedIdSet.has(group.id)))
    table.resetRowSelection()
  }

  const pageRows = table.getRowModel().rows

  return (
    <div className="flex min-h-[calc(100svh-8.5rem)] flex-1 flex-col gap-5">
      <AdminPageHeader
        title="Series & Groups"
        description="Organize articles into curated collections and sequential learning series."
        badge={
          <Badge variant="outline" size="sm" shape="pill" className="font-mono">
            UI Preview · Mock Data
          </Badge>
        }
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Content & Blog" },
          { label: "Series & Groups" },
        ]}
        actions={
          <Button type="button" className="gap-2" onClick={handleOpenCreate}>
            <Plus className="size-4" />
            <span>New Series</span>
          </Button>
        }
      />

      <GroupsStatsStrip groups={groups} />

      <AdminContentCard padding="none" minHeight="min-h-0" className="flex-1">
        <GroupsToolbar
          groups={groups}
          filters={filters}
          viewMode={viewMode}
          hasActiveFilters={hasActiveFilters}
          isAllPageSelected={table.getIsAllPageRowsSelected()}
          isSomePageSelected={table.getIsSomePageRowsSelected()}
          onToggleSelectAllPage={() => table.toggleAllPageRowsSelected()}
          onFiltersChange={handleFiltersChange}
          onViewModeChange={setViewMode}
          onResetFilters={handleResetFilters}
        />

        <div className="flex flex-1 flex-col px-5 py-4">
          {groups.length === 0 ? (
            <AdminEmptyState
              icon={<Library className="size-6" />}
              title="No series or groups created"
              description="Create serialized collections to bundle multi-part engineering deep dives together."
              actions={
                <>
                  <Button
                    type="button"
                    className="gap-2"
                    onClick={handleOpenCreate}
                  >
                    <Plus className="size-4" />
                    <span>Create new series</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() => {
                      setGroups(MOCK_GROUPS_WITH_POSTS)
                      handleResetFilters()
                    }}
                  >
                    <RotateCcw className="size-4" />
                    <span>Restore sample data</span>
                  </Button>
                </>
              }
            />
          ) : filteredGroups.length === 0 ? (
            <AdminEmptyState
              icon={<SearchX className="size-6" />}
              title="No matching series"
              description="Try adjusting your search query or completion tab filter."
              actions={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="gap-1.5"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset filters</span>
                </Button>
              }
            />
          ) : viewMode === "table" ? (
            <AdminDataTable table={table} />
          ) : (
            <GroupsGrid
              rows={pageRows}
              onViewPosts={(group) => setViewingGroupId(group.id)}
              onEdit={handleOpenEdit}
              onToggleCompleted={handleToggleCompleted}
              onDelete={(group) => void handleDeleteGroup(group)}
            />
          )}
        </div>

        {filteredGroups.length > 0 && (
          <AdminTableBottomBar
            table={table}
            selectedCount={selectedIds.length}
            totalRows={filteredGroups.length}
            singularLabel="series"
            pluralLabel="series"
            bulkActions={
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleBulkCompletionChange(true)}
                      aria-label="Mark selected series as completed"
                      className="size-7 rounded-lg"
                    >
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Mark completed</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleBulkCompletionChange(false)}
                      aria-label="Mark selected series as in progress"
                      className="size-7 rounded-lg"
                    >
                      <Clock className="size-3.5 text-amber-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Mark in progress</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => void handleBulkDelete()}
                      aria-label="Delete selected series"
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

      <GroupFormDialog
        key={editingGroup?.id ?? (formOpen ? "new-series" : "closed")}
        open={formOpen}
        initialGroup={editingGroup}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmitForm}
      />

      <GroupPostsDialog
        group={viewingGroup}
        open={Boolean(viewingGroup)}
        onOpenChange={(open) => {
          if (!open) setViewingGroupId(null)
        }}
        onEditGroup={handleOpenEdit}
      />

      <ConfirmDialog />
    </div>
  )
}
