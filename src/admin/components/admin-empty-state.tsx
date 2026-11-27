import type { ReactNode } from "react"

import { cn } from "@/shared/lib/utils"

interface AdminEmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  actions?: ReactNode
  className?: string
}

export function AdminEmptyState({
  icon,
  title,
  description,
  actions,
  className,
}: AdminEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/15 px-6 py-12 text-center",
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground/70">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {actions && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}
