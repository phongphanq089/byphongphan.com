import { cn } from "@/shared/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/core"

import {
  PANEL_MAX_WIDTH,
  PANEL_MIN_WIDTH,
} from "../hooks/use-studio-panel-resize"

interface StudioResizeHandleProps {
  panelWidth: number
  isDragging: boolean
  onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void
  /** Restore the default panel width (double-click on the handle). */
  onReset: () => void
}

/**
 * Minimal hairline resize divider between the stage island and docked right panel.
 * - At rest: ultra-subtle inset hairline with a quiet centered `pp-secondary` tick.
 * - On hover / drag: extends cleanly into a sharp 1px solid `pp-secondary` line (no gradient/glow).
 * - Double-click resets to default width (580px).
 */
export function StudioResizeHandle({
  panelWidth,
  isDragging,
  onPointerDown,
  onReset,
}: StudioResizeHandleProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panel"
          aria-valuemin={PANEL_MIN_WIDTH}
          aria-valuemax={PANEL_MAX_WIDTH}
          aria-valuenow={panelWidth}
          onPointerDown={onPointerDown}
          onDoubleClick={onReset}
          className="group relative z-20 -mx-1.5 hidden h-full w-3 shrink-0 cursor-col-resize touch-none items-center justify-center select-none xl:flex"
        >
          {/* Quiet inset track hairline aligned to the stage island's straight vertical edge */}
          <span
            aria-hidden="true"
            className="pointer-events-none h-[calc(100%-2rem)] w-px bg-border/35"
          />

          {/* Sharp 1px flat pp-secondary line: concise centered cue at rest, full straight-edge hairline on hover/drag */}
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute top-1/2 left-1/2 w-px -translate-x-1/2 -translate-y-1/2 transition-[height,background-color] duration-200 ease-out",
              isDragging
                ? "h-[calc(100%-2rem)] bg-pp-secondary"
                : "h-7 bg-pp-secondary/65 group-hover:h-[calc(100%-2rem)] group-hover:bg-pp-secondary"
            )}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent side="left" className="text-[10px]">
        Drag to resize · Double-click to reset
      </TooltipContent>
    </Tooltip>
  )
}
