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
 * VS Code-style precision resize divider between the stage and the docked panel.
 * - At rest: A subtle 1px divider with 3 micro-dots in the center.
 * - On hover / drag: An illuminated 2px primary active line running the full height.
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
          className="group relative z-20 -mx-1 hidden h-full w-2 shrink-0 cursor-col-resize touch-none items-center justify-center select-none xl:flex"
        >
          {/* Full-height vertical line (1px resting, 2px active/hover with primary glow) */}
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 top-1/2 left-1/2 h-[95%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150",
              isDragging
                ? "w-[2px] bg-primary shadow-[0_0_8px_var(--primary)]"
                : "w-px bg-border/40 group-hover:w-[2px] group-hover:bg-primary group-hover:shadow-[0_0_8px_var(--primary)]"
            )}
          />

          {/* 3 micro-dots affordance at rest (VS Code style), hidden when hovered/active */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 transition-opacity duration-150",
              isDragging ? "opacity-0" : "group-hover:opacity-0"
            )}
          >
            <span className="size-[2.5px] rounded-full bg-muted-foreground/50" />
            <span className="size-[2.5px] rounded-full bg-muted-foreground/50" />
            <span className="size-[2.5px] rounded-full bg-muted-foreground/50" />
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="left" className="text-[10px]">
        Drag to resize · Double-click to reset
      </TooltipContent>
    </Tooltip>
  )
}
