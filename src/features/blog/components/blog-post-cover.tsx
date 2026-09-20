import { GridContainer } from "@/app/layouts"

import type { BlogPost } from "../types"

interface BlogPostCoverProps {
  coverImage: BlogPost["coverImage"]
  title: string
}

export function BlogPostCover({ coverImage, title }: BlogPostCoverProps) {
  if (!coverImage?.url) return null

  const imageAlt = coverImage.alt || title

  return (
    <GridContainer
      borderBottom
      showCrosshairs
      className="relative overflow-hidden p-4 sm:p-8"
    >
      <div className="relative">
        {/* Precision Blueprint Corner Brackets */}
        <span className="pointer-events-none absolute -top-1.5 -left-1.5 z-20 size-3.5 border-t-2 border-l-2 border-pp-primary" />
        <span className="pointer-events-none absolute -top-1.5 -right-1.5 z-20 size-3.5 border-t-2 border-r-2 border-pp-primary" />
        <span className="pointer-events-none absolute -bottom-1.5 -left-1.5 z-20 size-3.5 border-b-2 border-l-2 border-pp-primary" />
        <span className="pointer-events-none absolute -right-1.5 -bottom-1.5 z-20 size-3.5 border-r-2 border-b-2 border-pp-primary" />

        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl border border-border/80 bg-muted/40 shadow-2xl">
          <img
            src={coverImage.url}
            alt={imageAlt}
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
        </div>

        {/* Technical Caption Telemetry Bar */}
        <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] text-muted-foreground/75">
          <span className="flex items-center gap-2">
            <span className="font-bold text-pp-primary">FIG 01.0</span>
            <span>//</span>
            <span className="truncate">{imageAlt}</span>
          </span>
          <span className="hidden sm:inline">
            21:9 CINEMATIC • WEB OPTIMIZED
          </span>
        </div>
      </div>
    </GridContainer>
  )
}
