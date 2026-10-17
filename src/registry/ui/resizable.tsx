import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/shared/lib/utils"

interface ResizablePanelGroupProps extends Omit<
  ResizablePrimitive.GroupProps,
  "orientation"
> {
  direction?: "horizontal" | "vertical"
  orientation?: "horizontal" | "vertical"
}

function ResizablePanelGroup({
  className,
  direction,
  orientation = direction ?? "horizontal",
  ...props
}: ResizablePanelGroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      orientation={orientation}
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function normalizeSize(
  val: number | string | undefined
): number | string | undefined {
  if (typeof val === "number" && val <= 100) {
    return `${val}%`
  }
  return val
}

function ResizablePanel({
  defaultSize,
  minSize,
  maxSize,
  collapsedSize,
  ...props
}: ResizablePrimitive.PanelProps) {
  return (
    <ResizablePrimitive.Panel
      data-slot="resizable-panel"
      defaultSize={normalizeSize(defaultSize)}
      minSize={normalizeSize(minSize)}
      maxSize={normalizeSize(maxSize)}
      collapsedSize={normalizeSize(collapsedSize)}
      {...props}
    />
  )
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "group/handle relative flex w-px items-center justify-center bg-border/80 ring-offset-background transition-colors duration-200",
        "hover:bg-foreground/30 data-[resize-handle-state=drag]:bg-primary",
        "cursor-ew-resize aria-[orientation=horizontal]:cursor-ns-resize",

        "after:absolute after:inset-y-0 after:left-1/2 after:w-4 after:-translate-x-1/2",
        "focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden",

        "aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-4 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2",
        "[&[aria-orientation=horizontal]>div]:rotate-90",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div
          className={cn(
            "z-10 flex h-9 w-3.5 shrink-0 items-center justify-center rounded-full",
            "border border-zinc-900/15 bg-white shadow-xs backdrop-blur-xs transition-all duration-200",
            "dark:border-white/15 dark:bg-zinc-900",

            "group-hover/handle:scale-105 group-hover/handle:border-zinc-900/30 group-hover/handle:shadow-sm dark:group-hover/handle:border-white/30",
            "group-data-[resize-handle-state=drag]/handle:scale-95 group-data-[resize-handle-state=drag]/handle:border-primary/50"
          )}
        >
          <div className="h-3.5 w-1 rounded-full bg-zinc-900/35 transition-colors duration-200 group-hover/handle:bg-zinc-900/80 group-data-[resize-handle-state=drag]/handle:bg-primary dark:bg-white/35 dark:group-hover/handle:bg-white/90" />
        </div>
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
