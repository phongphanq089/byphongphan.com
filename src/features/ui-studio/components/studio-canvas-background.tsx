import { forwardRef, type HTMLAttributes, type ReactNode } from "react"

import { cn } from "@/shared/lib/utils"

export interface StudioCanvasBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  /** Toggle an optional subtle dot-grid layer (defaults to false for clean canvas focus) */
  showGrid?: boolean
  /** @deprecated Chromatic arc bands have been removed in favor of a clean flat `bg-muted` canvas */
  showArcBands?: boolean
}

/**
 * Clean flat studio stage surface using the neutral semantic `bg-muted` token
 * so rendered components stand out cleanly against the outer `bg-background` frame.
 */
const StudioCanvasBackground = forwardRef<
  HTMLDivElement,
  StudioCanvasBackgroundProps
>(({ children, className, showGrid = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="studio-canvas-background"
      className={cn(
        "relative isolate overflow-hidden bg-muted dark:bg-muted/65",
        className
      )}
      {...props}
    >
      {/* Optional ultra-subtle blueprint dot matrix */}
      {showGrid ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(circle_at_1px_1px,var(--color-border)_1px,transparent_0)] [background-size:18px_18px] opacity-35 dark:opacity-20"
        />
      ) : null}

      {children}
    </div>
  )
})

StudioCanvasBackground.displayName = "StudioCanvasBackground"

export { StudioCanvasBackground }
