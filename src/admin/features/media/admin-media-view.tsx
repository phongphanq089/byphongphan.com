import {
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useTable,
} from "@tanstack/react-table"
import { ExternalLink, Images, Trash2, Upload } from "lucide-react"
import { useCallback, useMemo, useState } from "react"

import {
  AdminContentCard,
  AdminDataTable,
  AdminEmptyState,
  AdminPageHeader,
  AdminTableBottomBar,
  useAdminConfirm,
} from "@/admin"
import { Button } from "@/shared/ui"

import { createMediaColumns } from "./columns"
import { MediaGrid } from "./components/media-grid"
import { MediaPreviewDialog } from "./components/media-preview-dialog"
import { MediaStatsStrip } from "./components/media-stats-strip"
import { MediaToolbar } from "./components/media-toolbar"
import { MediaUploadDialog } from "./components/media-upload-dialog"
import { MOCK_MEDIA_ASSETS } from "./mock-data"
import { mediaTableFeatures } from "./table-config"
import type {
  AdminMediaAsset,
  MediaFilterState,
  MediaTab,
  MediaViewMode,
} from "./types"

const INITIAL_FILTERS: MediaFilterState = {
  search: "",
  tab: "all",
  folder: "all",
}

export function AdminMediaView() {
  const [assets, setAssets] = useState<AdminMediaAsset[]>(MOCK_MEDIA_ASSETS)
  const [filters, setFilters] = useState<MediaFilterState>(INITIAL_FILTERS)
  const [viewMode, setViewMode] = useState<MediaViewMode>("grid")
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  })

  const [uploadOpen, setUploadOpen] = useState(false)
  const [inspectingAsset, setInspectingAsset] =
    useState<AdminMediaAsset | null>(null)

  const { confirm, ConfirmDialog } = useAdminConfirm()

  const tabCounts = useMemo<Record<MediaTab, number>>(
    () => ({
      all: assets.length,
      image: assets.filter((item) => item.kind === "image").length,
      video: assets.filter((item) => item.kind === "video").length,
      audio: assets.filter((item) => item.kind === "audio").length,
    }),
    [assets]
  )

  const filteredAssets = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return assets.filter((item) => {
      if (filters.tab !== "all" && item.kind !== filters.tab) return false
      if (filters.folder !== "all" && item.folder !== filters.folder) {
        return false
      }
      if (!q) return true

      return (
        item.name.toLowerCase().includes(q) ||
        item.fileName.toLowerCase().includes(q) ||
        item.mimeType.toLowerCase().includes(q) ||
        item.altText.toLowerCase().includes(q)
      )
    })
  }, [assets, filters])

  const handleFiltersChange = useCallback((next: MediaFilterState) => {
    setFilters(next)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
    setRowSelection({})
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
    setRowSelection({})
  }, [])

  const handleDeleteAsset = useCallback(
    async (asset: AdminMediaAsset) => {
      const ok = await confirm({
        title: `Delete "${asset.name}"?`,
        description:
          asset.usedInCount > 0
            ? `This asset is currently referenced in ${asset.usedInCount} item(s). Deleting it may leave broken media links.`
            : "This action will remove the file from the media library.",
        variant: "destructive",
        confirmText: "Delete Asset",
        cancelText: "Cancel",
      })
      if (!ok) return

      setAssets((prev) => prev.filter((item) => item.id !== asset.id))
      setRowSelection((prev) => {
        const next = { ...prev }
        delete next[asset.id]
        return next
      })
    },
    [confirm]
  )

  const handleSaveMetadata = useCallback(
    (
      id: string,
      updates: Pick<AdminMediaAsset, "name" | "altText" | "folder">
    ) => {
      setAssets((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      )
    },
    []
  )

  const handleUploadAssets = useCallback((uploaded: AdminMediaAsset[]) => {
    setAssets((prev) => [...uploaded, ...prev])
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [])

  const columns = useMemo(
    () =>
      createMediaColumns({
        onInspect: setInspectingAsset,
        onDelete: (asset) => void handleDeleteAsset(asset),
      }),
    [handleDeleteAsset]
  )

  const table = useTable({
    features: mediaTableFeatures,
    data: filteredAssets,
    columns,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    state: {
      sorting,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
  })

  const pageRows = table.getRowModel().rows
  const paginatedAssets = pageRows.map((row) => row.original)
  const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id])

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return

    const ok = await confirm({
      title: `Delete ${selectedIds.length} selected asset(s)?`,
      description:
        "Selected images, videos, or audio files will be permanently removed from the media library.",
      variant: "destructive",
      confirmText: `Delete (${selectedIds.length})`,
      cancelText: "Cancel",
    })
    if (!ok) return

    const idSet = new Set(selectedIds)
    setAssets((prev) => prev.filter((item) => !idSet.has(item.id)))
    setRowSelection({})
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <AdminPageHeader
        title="Media Library"
        description="Manage images, demo videos, and audio tracks used across your portfolio and blog."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "System & Media" },
          { label: "Media Library" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" asChild>
              <a
                href="https://imagekit.io/dashboard"
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="size-3.5" />
                <span>ImageKit</span>
              </a>
            </Button>

            <Button
              type="button"
              size="sm"
              className="gap-1.5"
              onClick={() => setUploadOpen(true)}
            >
              <Upload className="size-3.5" />
              <span>Upload Media</span>
            </Button>
          </div>
        }
      />

      <MediaStatsStrip assets={assets} />

      <AdminContentCard padding="none">
        <MediaToolbar
          filters={filters}
          viewMode={viewMode}
          counts={tabCounts}
          isAllPageSelected={table.getIsAllPageRowsSelected()}
          isSomePageSelected={table.getIsSomePageRowsSelected()}
          onToggleSelectAllPage={() =>
            table.toggleAllPageRowsSelected(!table.getIsAllPageRowsSelected())
          }
          onFiltersChange={handleFiltersChange}
          onViewModeChange={setViewMode}
          onReset={handleResetFilters}
        />

        <div className="flex flex-1 flex-col">
          {filteredAssets.length === 0 ? (
            <AdminEmptyState
              icon={<Images className="size-6" />}
              title="No media assets found"
              description="No images, videos, or audio files match your current filters."
              actions={
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setUploadOpen(true)}
                  >
                    Upload Media
                  </Button>
                </div>
              }
            />
          ) : viewMode === "grid" ? (
            <MediaGrid
              assets={paginatedAssets}
              isRowSelected={(id) => Boolean(rowSelection[id])}
              onToggleSelect={(id) =>
                setRowSelection((prev) => {
                  const next = { ...prev }
                  if (next[id]) {
                    delete next[id]
                  } else {
                    next[id] = true
                  }
                  return next
                })
              }
              onInspect={setInspectingAsset}
              onDelete={(asset) => void handleDeleteAsset(asset)}
            />
          ) : (
            <AdminDataTable table={table} />
          )}
        </div>

        {filteredAssets.length > 0 && (
          <AdminTableBottomBar
            table={table}
            selectedCount={selectedIds.length}
            totalRows={filteredAssets.length}
            singularLabel="asset"
            pluralLabel="assets"
            bulkActions={
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="h-7 gap-1.5 px-2.5 text-xs"
                onClick={() => void handleBulkDelete()}
              >
                <Trash2 className="size-3.5" />
                <span>Delete Selected</span>
              </Button>
            }
          />
        )}
      </AdminContentCard>

      <MediaUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={handleUploadAssets}
      />

      <MediaPreviewDialog
        asset={inspectingAsset}
        onOpenChange={(open) => {
          if (!open) setInspectingAsset(null)
        }}
        onSaveMetadata={handleSaveMetadata}
        onDelete={(asset) => void handleDeleteAsset(asset)}
      />

      <ConfirmDialog />
    </div>
  )
}
