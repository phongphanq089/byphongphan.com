import React from "react"

import { cn } from "@/shared/lib/utils"

export type AdminContentCardVariant = "default" | "dashed" | "subtle" | "ghost"
export type AdminContentCardPadding = "none" | "sm" | "default" | "lg"

export interface AdminContentCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  /**
   * Title displayed in the card header.
   */
  title?: React.ReactNode
  /**
   * Description / subtitle displayed below the title.
   */
  description?: React.ReactNode
  /**
   * Action buttons / controls placed at the top-right of the card.
   */
  actions?: React.ReactNode
  /**
   * Visual frame style:
   * - "default": standard solid border + card background (production ready)
   * - "dashed": dashed border (ideal for empty states, dropzones, placeholders)
   * - "subtle": subtle low-contrast border and background
   * - "ghost": no border or background
   */
  variant?: AdminContentCardVariant
  /**
   * Padding scale inside the card.
   */
  padding?: AdminContentCardPadding
  /**
   * When true, centers the inner content both vertically and horizontally.
   * Perfect for empty states, loaders, error screens, and focus widgets.
   */
  centered?: boolean
  /**
   * Custom min-height. Defaults to full viewport fit `min-h-[calc(100svh-14rem)]`.
   */
  minHeight?: string
}

export function AdminContentCard({
  title,
  description,
  actions,
  variant = "default",
  padding = "default",
  centered = false,
  minHeight = "min-h-[calc(100svh-14rem)]",
  className,
  children,
  ...props
}: AdminContentCardProps) {
  const variantStyles: Record<AdminContentCardVariant, string> = {
    default: "border border-border/70 bg-card text-card-foreground shadow-xs",
    dashed:
      "border border-dashed border-border/80 bg-card/40 text-card-foreground",
    subtle: "border border-border/40 bg-muted/20 text-card-foreground",
    ghost: "border-none bg-transparent shadow-none",
  }

  const paddingStyles: Record<AdminContentCardPadding, string> = {
    none: "p-0",
    sm: "p-4",
    default: "p-6",
    lg: "p-6 md:p-8 lg:p-10",
  }

  const hasHeader = Boolean(title || description || actions)

  return (
    <div
      data-slot="admin-content-card"
      className={cn(
        // Flexbox & Responsive Min-Height to naturally stretch and fill remaining viewport height
        "flex w-full flex-1 flex-col rounded-xl transition-colors",
        minHeight,
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {/* ─── Optional Card Top Header ─── */}
      {hasHeader && (
        <div className="mb-6 flex flex-col gap-2 border-b border-border/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            {title && (
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* ─── Card Body ─── */}
      <div
        className={cn(
          "flex flex-1 flex-col",
          centered && "items-center justify-center text-center"
        )}
      >
        {children}
      </div>
    </div>
  )
}

export { AdminContentCard as AdminContentBox }
export default AdminContentCard
