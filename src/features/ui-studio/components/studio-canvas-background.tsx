import { forwardRef, type HTMLAttributes, type ReactNode } from "react"

import { cn } from "@/shared/lib/utils"

export interface StudioCanvasBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  /** Toggle the technical CAD blueprint dot-grid layer (defaults to true) */
  showGrid?: boolean
  /** Toggle the sunset aurora chromatic arc bands (defaults to true) */
  showArcBands?: boolean
}

/**
 * Technical studio canvas background inspired by ArcBandsBackground:
 * Combines warm/obsidian linear gradients, chromatic sunset aurora arc bands,
 * micro-dot tactile matrix, and the studio's signature CAD blueprint dot-grid.
 */
const StudioCanvasBackground = forwardRef<
  HTMLDivElement,
  StudioCanvasBackgroundProps
>(
  (
    { children, className, showGrid = true, showArcBands = true, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-slot="studio-canvas-background"
        className={cn(
          "relative isolate overflow-hidden bg-white dark:bg-background",
          className
        )}
        {...props}
      >
        {/* Base linear vertical gradient & Arc bands */}
        {showArcBands && (
          <>
            {/* Outer arc band - seated in lower half, dissolves smoothly before reaching top */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[6%] left-1/2 -z-10 h-[70%] w-[180%] -translate-x-1/2 rounded-t-[100%] blur-xl [background:radial-gradient(ellipse_120%_80%_at_50%_100%,rgba(56,189,248,0.50)_0%,rgba(45,212,191,0.40)_18%,rgba(245,158,11,0.32)_38%,rgba(244,63,94,0.24)_56%,rgba(255,252,247,0)_76%)] dark:[background:radial-gradient(ellipse_120%_80%_at_50%_100%,rgba(56,189,248,0.22)_0%,rgba(45,212,191,0.18)_18%,rgba(245,158,11,0.13)_38%,rgba(244,63,94,0.09)_56%,transparent_72%)]"
            />

            {/* Middle blurred arc band */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[4%] left-1/2 -z-10 h-[58%] w-[150%] -translate-x-1/2 rounded-t-[100%] blur-2xl [background:radial-gradient(ellipse_110%_75%_at_50%_100%,rgba(56,189,248,0.26)_0%,rgba(45,212,191,0.22)_20%,rgba(251,191,36,0.18)_42%,rgba(251,113,133,0.14)_60%,transparent_78%)] dark:[background:radial-gradient(ellipse_110%_75%_at_50%_100%,rgba(56,189,248,0.15)_0%,rgba(45,212,191,0.12)_20%,rgba(251,191,36,0.09)_42%,rgba(251,113,133,0.06)_60%,transparent_75%)]"
            />

            {/* Inner intense glow arc band */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[2%] left-1/2 -z-10 h-[46%] w-[120%] -translate-x-1/2 rounded-t-[100%] blur-3xl [background:radial-gradient(ellipse_100%_65%_at_50%_100%,rgba(255,255,255,0.50)_0%,rgba(255,252,247,0.15)_32%,transparent_64%)] dark:[background:radial-gradient(ellipse_100%_65%_at_50%_100%,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.01)_30%,transparent_60%)]"
            />
          </>
        )}

        {/* Top seamless transition fade into pure bg-background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-background via-background/70 to-transparent"
        />

        {/* Studio CAD dot-grid blueprint pattern */}
        {showGrid && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(circle_at_1px_1px,var(--color-border)_1px,transparent_0)] [background-size:18px_18px] opacity-60 dark:opacity-25"
          />
        )}

        {children}
      </div>
    )
  }
)

StudioCanvasBackground.displayName = "StudioCanvasBackground"

export { StudioCanvasBackground }
