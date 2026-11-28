import { Link } from "@tanstack/react-router"
import React from "react"

import { cn } from "@/shared/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui"

export interface BreadcrumbItemType {
  label: string
  href?: string
}

export interface AdminPageHeaderProps {
  /**
   * Title of the page.
   */
  title: React.ReactNode
  /**
   * Subtitle or descriptive summary.
   */
  description?: React.ReactNode
  /**
   * Array of breadcrumb navigation items.
   */
  breadcrumbs?: BreadcrumbItemType[]
  /**
   * "mobile-only" (default): Hiện ở màn hình nhỏ (< lg), ẩn ở desktop (vì AdminHeader đã hiện).
   * true: Hiện ở mọi kích thước màn hình.
   * false: Ẩn hoàn toàn trong page body.
   */
  showBreadcrumb?: boolean | "mobile-only"
  /**
   * Optional badge displayed next to the title.
   */
  badge?: React.ReactNode
  /**
   * Action buttons displayed on the right.
   */
  actions?: React.ReactNode
  /**
   * Additional CSS classes.
   */
  className?: string
  /**
   * Optional bottom slot (e.g. filters or tabs).
   */
  children?: React.ReactNode
}

export function AdminPageHeader({
  title,
  description,
  breadcrumbs,
  showBreadcrumb = "mobile-only",
  badge,
  actions,
  className,
  children,
}: AdminPageHeaderProps) {
  const computedBreadcrumbs =
    breadcrumbs ??
    (typeof title === "string"
      ? [{ label: "Admin", href: "/admin" }, { label: title }]
      : [{ label: "Admin", href: "/admin" }])

  const shouldRenderBreadcrumb =
    showBreadcrumb !== false && computedBreadcrumbs.length > 0
  const responsiveClass = showBreadcrumb === "mobile-only" ? "lg:hidden" : ""

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {shouldRenderBreadcrumb && (
        <Breadcrumb className={cn("text-xs", responsiveClass)}>
          <BreadcrumbList>
            {computedBreadcrumbs.map((crumb, index) => {
              const isLast = index === computedBreadcrumbs.length - 1
              return (
                <React.Fragment key={`${crumb.label}-${index}`}>
                  <BreadcrumbItem>
                    {isLast || !crumb.href ? (
                      <BreadcrumbPage className="font-medium text-foreground">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink render={<Link to={crumb.href} />}>
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
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

      {children && <div className="pt-2">{children}</div>}
    </div>
  )
}

export default AdminPageHeader
