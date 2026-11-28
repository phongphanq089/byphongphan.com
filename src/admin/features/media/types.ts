import type { AdminViewMode } from "@/admin"

export type MediaKind = "image" | "video" | "audio"

export type MediaFolder = "blog" | "og-icons" | "projects" | "videos" | "audio"

export type MediaTab = "all" | MediaKind

export type MediaViewMode = AdminViewMode

export interface AdminMediaAsset {
  id: string
  name: string
  fileName: string
  kind: MediaKind
  mimeType: string
  folder: MediaFolder
  url: string
  thumbnailUrl?: string
  sizeBytes: number
  width?: number
  height?: number
  durationSeconds?: number
  altText: string
  usedInCount: number
  createdAt: string
}

export interface MediaFilterState {
  search: string
  tab: MediaTab
  folder: "all" | MediaFolder
}
