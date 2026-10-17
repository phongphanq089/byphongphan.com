import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import * as React from "react"

import { cn } from "../../utils/cn"

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Popup> & {
    sideOffset?: number
    side?: "top" | "right" | "bottom" | "left"
  }
>(({ className, sideOffset = 4, side, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Positioner sideOffset={sideOffset} side={side}>
      <TooltipPrimitive.Popup
        ref={ref}
        className={cn(
          "z-50 animate-in overflow-hidden rounded-md bg-primary px-2.5 py-1 text-xs text-primary-foreground shadow-md fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Positioner>
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
