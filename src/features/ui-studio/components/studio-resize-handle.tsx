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
  /** Restore the default panel width (double-click on the pill). */
  onReset: () => void
}

/**
 * Tactile drag handle between the stage and the docked docs/code panel.
 * Wide invisible hit-area (16px) so the cursor never slips; a centered pill
 * with a notch affordance. Double-click resets to the default width.
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
          className="group relative z-20 -mx-1.5 hidden h-full w-3 shrink-0 cursor-col-resize touch-none items-center justify-center select-none sm:flex"
        >
          <div
            className={cn(
              "flex h-9 w-3.5 items-center justify-center rounded-full border bg-background shadow-xs transition-all duration-150 outline-none",
              "border-border/80 group-hover:shadow-md hover:scale-105 hover:border-primary/50",
              "focus-visible:ring-2 focus-visible:ring-primary",
              isDragging &&
                "scale-105 border-primary/60 shadow-[0_0_14px_var(--pp-primary-glow)]"
            )}
          >
            <div
              aria-hidden="true"
              className={cn(
                "h-3.5 w-1 rounded-full bg-muted-foreground/40 transition-colors duration-150",
                "group-hover:bg-primary",
                isDragging && "bg-primary"
              )}
            />
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="left" className="text-[10px]">
        Kéo để chỉnh kích thước · Nhấp đúp để đặt lại
      </TooltipContent>
    </Tooltip>
  )
}
