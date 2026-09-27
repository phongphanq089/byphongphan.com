import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/shared/lib"

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
        "group/handle relative flex w-px items-center justify-center bg-border ring-offset-background",
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
        <div className="z-10 flex h-8 w-1.5 shrink-0 rounded-full bg-muted-foreground/40 transition-colors group-hover/handle:bg-foreground/70" />
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
