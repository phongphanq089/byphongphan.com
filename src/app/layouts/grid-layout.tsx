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
  mobileColumns?: 1 | 2
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
  columns: 1 | 2 | 3,
  mobileColumns: 1 | 2 = 1
): string {
  if (columns <= 1 || total <= 1) return ""

  const classes: string[] = []

  // 1. Bottom Border (border-b)
  if (columns === 2) {
    if (mobileColumns === 2) {
      const totalRows = Math.ceil(total / 2)
      const currentRow = Math.floor(index / 2)
      if (currentRow < totalRows - 1) {
        classes.push("border-b border-border")
      }
    } else {
      const hasRowBelowMobile = index < total - 1
      const totalRowsDesktop = Math.ceil(total / 2)
      const currentRowDesktop = Math.floor(index / 2)
      const hasRowBelowDesktop = currentRowDesktop < totalRowsDesktop - 1

      if (hasRowBelowMobile && hasRowBelowDesktop) {
        classes.push("border-b border-border")
      } else if (hasRowBelowMobile && !hasRowBelowDesktop) {
        classes.push("border-b border-border md:border-b-0")
      } else if (!hasRowBelowMobile && hasRowBelowDesktop) {
        classes.push("md:border-b md:border-border")
      }
    }
  } else if (columns === 3) {
    if (mobileColumns === 2) {
      // 2 columns on mobile & tablet (< lg), 3 columns on desktop (>= lg)
      const totalRows2Col = Math.ceil(total / 2)
      const currentRow2Col = Math.floor(index / 2)
      const hasRowBelow2Col = currentRow2Col < totalRows2Col - 1

      const totalRows3Col = Math.ceil(total / 3)
      const currentRow3Col = Math.floor(index / 3)
      const hasRowBelow3Col = currentRow3Col < totalRows3Col - 1

      if (hasRowBelow2Col && hasRowBelow3Col) {
        classes.push("border-b border-border")
      } else if (hasRowBelow2Col && !hasRowBelow3Col) {
        classes.push("border-b border-border lg:border-b-0")
      } else if (!hasRowBelow2Col && hasRowBelow3Col) {
        classes.push("lg:border-b lg:border-border")
      }
    } else {
      const hasRowBelowMobile = index < total - 1
      const totalRowsTablet = Math.ceil(total / 2)
      const currentRowTablet = Math.floor(index / 2)
      const hasRowBelowTablet = currentRowTablet < totalRowsTablet - 1

      const totalRowsDesktop = Math.ceil(total / 3)
      const currentRowDesktop = Math.floor(index / 3)
      const hasRowBelowDesktop = currentRowDesktop < totalRowsDesktop - 1

      if (hasRowBelowMobile && hasRowBelowTablet && hasRowBelowDesktop) {
        classes.push("border-b border-border")
      } else if (
        hasRowBelowMobile &&
        hasRowBelowTablet &&
        !hasRowBelowDesktop
      ) {
        classes.push("border-b border-border lg:border-b-0")
      } else if (
        !hasRowBelowMobile &&
        !hasRowBelowTablet &&
        !hasRowBelowDesktop
      ) {
        classes.push("border-b border-border md:border-b-0")
      } else if (
        !hasRowBelowMobile &&
        hasRowBelowTablet &&
        hasRowBelowDesktop
      ) {
        classes.push("md:border-b md:border-border")
      } else if (
        !hasRowBelowMobile &&
        hasRowBelowTablet &&
        !hasRowBelowDesktop
      ) {
        classes.push("md:border-b md:border-border lg:border-b-0")
      } else if (
        !hasRowBelowMobile &&
        !hasRowBelowTablet &&
        hasRowBelowDesktop
      ) {
        classes.push("lg:border-b lg:border-border")
      }
    }
  }

  // 2. Left Border (border-l) between items/cards
  if (columns === 2) {
    const isCol1 = index % 2 === 1
    if (mobileColumns === 2) {
      if (isCol1) {
        classes.push("border-l border-border")
      }
    } else {
      if (isCol1) {
        classes.push("md:border-l md:border-border")
      }
    }
  } else if (columns === 3) {
    const isCol1In2Col = index % 2 === 1
    const isCol1Or2In3Col = index % 3 !== 0

    if (mobileColumns === 2) {
      if (isCol1In2Col && isCol1Or2In3Col) {
        classes.push("border-l border-border")
      } else if (isCol1In2Col && !isCol1Or2In3Col) {
        classes.push("border-l border-border lg:border-l-0")
      } else if (!isCol1In2Col && isCol1Or2In3Col) {
        classes.push("border-l-0 lg:border-l lg:border-border")
      }
    } else {
      if (isCol1In2Col && isCol1Or2In3Col) {
        classes.push("md:border-l md:border-border")
      } else if (isCol1In2Col && !isCol1Or2In3Col) {
        classes.push("md:border-l md:border-border lg:border-l-0")
      } else if (!isCol1In2Col && isCol1Or2In3Col) {
        classes.push("md:border-l-0 lg:border-l lg:border-border")
      }
    }
  }

  return classes.join(" ")
}

export function GridContainer({
  as: Component = "section",
  children,
  className,
  showCrosshairs = true,
  columns = 1,
  mobileColumns = 1,
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

      const borderClass = getChildBorderClasses(
        index,
        total,
        columns,
        mobileColumns
      )
      const existingClassName = (child.props as { className?: string })
        .className
      const key = child.key != null ? child.key : `grid-item-${index}`

      return React.cloneElement(child, {
        key,
        className: borderClass
          ? cn(existingClassName, borderClass)
          : existingClassName,
      } as React.HTMLAttributes<HTMLElement>)
    })
  }, [children, columns, mobileColumns, itemBorders])

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
          "relative mx-auto h-full transition-[max-width]",
          borderLeft && "border-l border-border",
          borderRight && "border-r border-border",
          maxWidthClass,
          columns === 2 &&
            (mobileColumns === 2
              ? "grid grid-cols-2"
              : "grid grid-cols-1 md:grid-cols-2"),
          columns === 3 &&
            (mobileColumns === 2
              ? "grid grid-cols-2 lg:grid-cols-3"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"),
          className
        )}
      >
        {columns === 2 && (
          <div
            className={cn(
              "pointer-events-none absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-border",
              mobileColumns === 2 ? "block" : "hidden md:block"
            )}
          />
        )}

        {columns === 3 && (
          <>
            <div
              className={cn(
                "pointer-events-none absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-border",
                mobileColumns === 2
                  ? "block lg:hidden"
                  : "hidden md:block lg:hidden"
              )}
            />
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
              <Crosshair
                className={cn(
                  "bottom-[-6px] left-1/2 -translate-x-1/2",
                  mobileColumns === 2 ? "block" : "hidden md:block"
                )}
              />
            )}
            {columns === 3 && (
              <>
                <Crosshair
                  className={cn(
                    "bottom-[-6px] left-1/2 -translate-x-1/2",
                    mobileColumns === 2
                      ? "block lg:hidden"
                      : "hidden md:block lg:hidden"
                  )}
                />
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
              <Crosshair
                className={cn(
                  "top-[-6px] left-1/2 -translate-x-1/2",
                  mobileColumns === 2 ? "block" : "hidden md:block"
                )}
              />
            )}
            {columns === 3 && (
              <>
                <Crosshair
                  className={cn(
                    "top-[-6px] left-1/2 -translate-x-1/2",
                    mobileColumns === 2
                      ? "block lg:hidden"
                      : "hidden md:block lg:hidden"
                  )}
                />
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
