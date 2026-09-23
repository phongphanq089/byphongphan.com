import type { ReactNode } from "react"

import { cn } from "@/shared/lib"
import { Badge } from "@/shared/ui/core/badge"

export interface ShowcaseCardProps {
  title: string
  description?: string
  tag?: string
  className?: string
  children: ReactNode
  codeSnippet?: string
}

export function ShowcaseCard({
  title,
  description,
  tag,
  className,
  children,
}: ShowcaseCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {tag && (
          <Badge
            variant="outline"
            className="border-primary/30 text-[10px] text-primary uppercase"
          >
            {tag}
          </Badge>
        )}
      </div>
      <div className="relative flex min-h-[120px] flex-1 items-center justify-center overflow-hidden rounded-lg border border-border/40 bg-background/50 p-6">
        {children}
      </div>
    </div>
  )
}

export default ShowcaseCard
