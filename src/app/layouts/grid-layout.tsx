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
  id?: string
  maxWidth?: string
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
                <Crosshair className="top-[-6px] left-1/3 hidden -translate-x-1/2 lg:block" />
                <Crosshair className="top-[-6px] left-2/3 hidden -translate-x-1/2 lg:block" />
              </>
            )}
          </>
        )}

        {children}
      </div>
    </Component>
  )
}
