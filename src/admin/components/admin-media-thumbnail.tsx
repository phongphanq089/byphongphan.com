import { FileText } from "lucide-react"
import { useState } from "react"

import { cn } from "@/shared/lib/utils"

interface AdminMediaThumbnailProps {
  src: string | null | undefined
  alt?: string | null
  title: string
  className?: string
  iconClassName?: string
}

export function AdminMediaThumbnail({
  src,
  alt,
  title,
  className,
  iconClassName,
}: AdminMediaThumbnailProps) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/70 bg-muted/40 text-muted-foreground/60",
          className
        )}
        aria-hidden="true"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--grid-dots)_1px,transparent_1px)] [background-size:8px_8px]" />
        <FileText className={cn("relative size-4", iconClassName)} />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-md border border-border/70 bg-muted/30",
        className
      )}
    >
      <img
        src={src}
        alt={alt ?? title}
        loading="lazy"
        onError={() => setHasError(true)}
        className="size-full object-cover transition-transform duration-300 group-hover/row:scale-105"
      />
    </div>
  )
}
