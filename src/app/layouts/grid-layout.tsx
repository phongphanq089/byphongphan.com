import React, { createContext, useContext } from "react"

import { cn } from "@/shared/lib/utils"

export const Crosshair = ({ className }: { className?: string }) => (
  <svg
    className={cn("absolute z-10 h-3 w-3 text-muted-foreground/30", className)}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 1V11M1 6H11"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
)

export type GridContainerMaxWidth =
  "default" | "wide" | "5xl" | "6xl" | "7xl" | "full" | string

export interface GridLayoutContextValue {
  maxWidth?: GridContainerMaxWidth
}

export const GridLayoutContext = createContext<GridLayoutContextValue>({
  maxWidth: "default",
})

export const useGridLayout = () => useContext(GridLayoutContext)

export type GridContainerProps = {
  as?: React.ElementType
  children?: React.ReactNode
  className?: string
  showCrosshairs?: boolean
  columns?: 1 | 2 | 3
  borderBottom?: boolean
  borderTop?: boolean
  borderLeft?: boolean
  borderRight?: boolean
  itemBorders?: boolean
  id?: string
  maxWidth?: string
}

function flattenChildren(children: React.ReactNode): React.ReactNode[] {
  const result: React.ReactNode[] = []
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === React.Fragment) {
      result.push(
        ...flattenChildren(
          (child.props as { children?: React.ReactNode }).children
        )
      )
    } else if (child !== null && child !== undefined && child !== false) {
      result.push(child)
    }
  })
  return result
}

function getChildBorderClasses(
  index: number,
  total: number,
  columns: 1 | 2 | 3
): string {
  if (columns <= 1 || total <= 1) return ""

  const hasRowBelowMobile = index < total - 1

  if (columns === 2) {
    const totalRowsDesktop = Math.ceil(total / 2)
    const currentRowDesktop = Math.floor(index / 2)
    const hasRowBelowDesktop = currentRowDesktop < totalRowsDesktop - 1

    if (hasRowBelowMobile && hasRowBelowDesktop) {
      return "border-b border-border"
    }
    if (hasRowBelowMobile && !hasRowBelowDesktop) {
      return "border-b border-border md:border-b-0"
    }
    if (!hasRowBelowMobile && hasRowBelowDesktop) {
      return "md:border-b md:border-border"
    }
    return ""
  }

  if (columns === 3) {
    const totalRowsTablet = Math.ceil(total / 2)
    const currentRowTablet = Math.floor(index / 2)
    const hasRowBelowTablet = currentRowTablet < totalRowsTablet - 1

    const totalRowsDesktop = Math.ceil(total / 3)
    const currentRowDesktop = Math.floor(index / 3)
    const hasRowBelowDesktop = currentRowDesktop < totalRowsDesktop - 1

    if (hasRowBelowMobile && hasRowBelowTablet && hasRowBelowDesktop) {
      return "border-b border-border"
    }
    if (hasRowBelowMobile && hasRowBelowTablet && !hasRowBelowDesktop) {
      return "border-b border-border lg:border-b-0"
    }
    if (hasRowBelowMobile && !hasRowBelowTablet && !hasRowBelowDesktop) {
      return "border-b border-border md:border-b-0"
    }
    if (!hasRowBelowMobile && hasRowBelowTablet && hasRowBelowDesktop) {
      return "md:border-b md:border-border"
    }
    if (!hasRowBelowMobile && hasRowBelowTablet && !hasRowBelowDesktop) {
      return "md:border-b md:border-border lg:border-b-0"
    }
    if (!hasRowBelowMobile && !hasRowBelowTablet && hasRowBelowDesktop) {
      return "lg:border-b lg:border-border"
    }
    return ""
  }

  return ""
}

export function GridContainer({
  as: Component = "section",
  children,
  className,
  showCrosshairs = true,
  columns = 1,
  borderBottom = true,
  borderTop = false,
  borderLeft = true,
  borderRight = true,
  itemBorders = true,
  id,
  maxWidth: propMaxWidth,
}: GridContainerProps) {
  const context = useGridLayout()
  const effectiveMaxWidth = propMaxWidth ?? context.maxWidth ?? "default"

  const maxWidthClass =
    effectiveMaxWidth === "wide" || effectiveMaxWidth === "7xl"
      ? "max-w-7xl 2xl:max-w-[1400px]"
      : effectiveMaxWidth === "6xl"
        ? "max-w-6xl"
        : effectiveMaxWidth === "full"
          ? "max-w-full"
          : effectiveMaxWidth === "default" || effectiveMaxWidth === "5xl"
            ? "max-w-5xl"
            : effectiveMaxWidth

  const processedChildren = React.useMemo(() => {
    if (!itemBorders || !columns || columns <= 1) {
      return children
    }

    const flatChildren = flattenChildren(children)
    const total = flatChildren.length

    if (total <= 1) {
      return children
    }

    return flatChildren.map((child, index) => {
      if (!React.isValidElement(child)) {
        return child
      }

      const borderClass = getChildBorderClasses(index, total, columns)
      if (!borderClass) {
        return child
      }

      const existingClassName = (child.props as { className?: string })
        .className

      return React.cloneElement(child, {
        className: cn(existingClassName, borderClass),
      } as React.HTMLAttributes<HTMLElement>)
    })
  }, [children, columns, itemBorders])

  return (
    <Component
      id={id}
      className={cn(
        "relative z-1",
        borderBottom && "border-b border-border",
        borderTop && "border-t border-border"
      )}
    >
      <div
        className={cn(
          "relative mx-auto h-full duration-300 ease-in-out",
          borderLeft && "border-l border-border",
          borderRight && "border-r border-border",
          maxWidthClass,
          columns === 2 && "grid grid-cols-1 md:grid-cols-2",
          columns === 3 && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          className
        )}
      >
        {columns === 2 && (
          <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 bg-border md:block" />
        )}

        {columns === 3 && (
          <>
            <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 bg-border md:block lg:hidden" />
            <div className="pointer-events-none absolute top-0 bottom-0 left-1/3 hidden w-px -translate-x-1/2 bg-border lg:block" />
            <div className="pointer-events-none absolute top-0 bottom-0 left-2/3 hidden w-px -translate-x-1/2 bg-border lg:block" />
          </>
        )}

        {/* Bottom Crosshairs */}
        {showCrosshairs && borderBottom && (
          <>
            {borderLeft && <Crosshair className="bottom-[-6px] left-[-6px]" />}
            {borderRight && (
              <Crosshair className="right-[-6px] bottom-[-6px]" />
            )}
            {columns === 2 && (
              <Crosshair className="bottom-[-6px] left-1/2 hidden -translate-x-1/2 md:block" />
            )}
            {columns === 3 && (
              <>
                <Crosshair className="bottom-[-6px] left-1/2 hidden -translate-x-1/2 md:block lg:hidden" />
                <Crosshair className="bottom-[-6px] left-1/3 hidden -translate-x-1/2 lg:block" />
                <Crosshair className="bottom-[-6px] left-2/3 hidden -translate-x-1/2 lg:block" />
              </>
            )}
          </>
        )}

        {/* Top Crosshairs */}
        {showCrosshairs && borderTop && (
          <>
            {borderLeft && <Crosshair className="top-[-6px] left-[-6px]" />}
            {borderRight && <Crosshair className="top-[-6px] right-[-6px]" />}
            {columns === 2 && (
              <Crosshair className="top-[-6px] left-1/2 hidden -translate-x-1/2 md:block" />
            )}
            {columns === 3 && (
              <>
                <Crosshair className="top-[-6px] left-1/2 hidden -translate-x-1/2 md:block lg:hidden" />
                <Crosshair className="top-[-6px] left-1/3 hidden -translate-x-1/2 lg:block" />
                <Crosshair className="top-[-6px] left-2/3 hidden -translate-x-1/2 lg:block" />
              </>
            )}
          </>
        )}

        {processedChildren}
      </div>
    </Component>
  )
}
