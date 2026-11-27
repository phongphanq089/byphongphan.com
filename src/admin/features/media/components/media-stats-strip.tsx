import { Film, HardDrive, Image as ImageIcon, Music } from "lucide-react"

import { type AdminStatItem, AdminStatsStrip } from "@/admin"

import type { AdminMediaAsset } from "../types"
import { formatFileSize } from "../utils"

interface MediaStatsStripProps {
  assets: AdminMediaAsset[]
}

export function MediaStatsStrip({ assets }: MediaStatsStripProps) {
  const imageCount = assets.filter((a) => a.kind === "image").length
  const videoCount = assets.filter((a) => a.kind === "video").length
  const audioCount = assets.filter((a) => a.kind === "audio").length
  const totalBytes = assets.reduce((sum, item) => sum + item.sizeBytes, 0)

  const items: AdminStatItem[] = [
    {
      label: "Total Assets",
      value: assets.length,
      hint: `${formatFileSize(totalBytes)} used`,
      icon: HardDrive,
    },
    {
      label: "Images",
      value: imageCount,
      hint: "PNG, JPG, WebP",
      icon: ImageIcon,
      tone: "text-sky-600 dark:text-sky-400",
    },
    {
      label: "Videos",
      value: videoCount,
      hint: "MP4, WebM demos",
      icon: Film,
      tone: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Audio",
      value: audioCount,
      hint: "MP3, WAV tracks",
      icon: Music,
      tone: "text-emerald-600 dark:text-emerald-400",
    },
  ]

  return <AdminStatsStrip items={items} />
}
