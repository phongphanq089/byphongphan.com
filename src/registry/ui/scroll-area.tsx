import { cn } from "@/shared/lib/utils"
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
import type React from "react"

export function ScrollArea({
  className,
  classNameViewport,
  children,
  scrollFade = false,
  scrollbarGutter = false,
  fill = false,
  clampContentMinWidth = true,
  overscrollContain = false,
  ...props
}: ScrollAreaPrimitive.Root.Props & {
  classNameViewport?: string
  scrollFade?: boolean
  scrollbarGutter?: boolean
  fill?: boolean
  clampContentMinWidth?: boolean
  overscrollContain?: boolean
}): React.ReactElement {
  return (
    <ScrollAreaPrimitive.Root
      className={cn("relative min-h-0 min-w-0", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        className={cn(
          "h-full max-h-[inherit] rounded-[inherit] transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          classNameViewport,
          overscrollContain &&
            "data-has-overflow-x:overscroll-x-contain data-has-overflow-y:overscroll-y-contain",
          scrollFade && "scroll-fade-effect-x scroll-fade-effect-y",
          scrollbarGutter &&
            "data-has-overflow-x:pb-2.5 data-has-overflow-y:pe-2.5"
        )}
        data-slot="scroll-area-viewport"
      >
        <ScrollAreaPrimitive.Content
          className={cn(fill && "size-full")}
          data-slot="scroll-area-content"
          style={clampContentMinWidth ? { minWidth: 0 } : undefined}
        >
          {children}
        </ScrollAreaPrimitive.Content>
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar orientation="vertical" />
      <ScrollBar orientation="horizontal" />
      <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
    </ScrollAreaPrimitive.Root>
  )
}

export function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props): React.ReactElement {
  return (
    <ScrollAreaPrimitive.Scrollbar
      className={cn(
        "m-1 flex opacity-0 transition-opacity delay-300 data-hovering:opacity-100 data-hovering:delay-0 data-hovering:duration-100 data-scrolling:opacity-100 data-scrolling:delay-0 data-scrolling:duration-100 data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:w-1.5",
        className
      )}
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        className="relative flex-1 rounded-full bg-foreground/20"
        data-slot="scroll-area-thumb"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollAreaPrimitive }
