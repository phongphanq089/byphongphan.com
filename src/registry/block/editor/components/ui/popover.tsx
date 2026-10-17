import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import * as React from "react"

import { cn } from "../../utils/cn"

const Popover = PopoverPrimitive.Root

function PopoverTrigger({
  children,
  asChild,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger> & {
  asChild?: boolean
}) {
  if (asChild && React.isValidElement(children)) {
    return <PopoverPrimitive.Trigger render={children} {...props} />
  }

  return (
    <PopoverPrimitive.Trigger {...props}>{children}</PopoverPrimitive.Trigger>
  )
}

function PopoverAnchor({ ...props }: React.ComponentProps<"div">) {
  return <div data-slot="popover-anchor" {...props} />
}

const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Popup> & {
    align?: "start" | "center" | "end"
    sideOffset?: number
  }
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Positioner align={align} sideOffset={sideOffset}>
      <PopoverPrimitive.Popup
        ref={ref}
        className={cn(
          "z-50 w-72 origin-(--transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Positioner>
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger }
