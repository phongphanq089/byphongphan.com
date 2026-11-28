import { Film, Image as ImageIcon, Music } from "lucide-react"

import { Badge } from "@/shared/ui"

import type { MediaKind } from "../types"

interface MediaKindBadgeProps {
  kind: MediaKind
}

const KIND_CONFIG: Record<
  MediaKind,
  {
    label: string
    className: string
    Icon: typeof ImageIcon
  }
> = {
  image: {
    label: "Image",
    className: "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-400",
    Icon: ImageIcon,
  },
  video: {
    label: "Video",
    className:
      "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    Icon: Film,
  },
  audio: {
    label: "Audio",
    className:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    Icon: Music,
  },
}

export function MediaKindBadge({ kind }: MediaKindBadgeProps) {
  const { label, className, Icon } = KIND_CONFIG[kind]

  return (
    <Badge
      variant="outline"
      className={`gap-1 px-1.5 py-0.5 text-[10px] font-medium ${className}`}
    >
      <Icon className="size-2.5" />
      <span>{label}</span>
    </Badge>
  )
}
