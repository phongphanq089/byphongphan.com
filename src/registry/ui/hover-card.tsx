import { PreviewCard as HoverCardPrimitive } from "@base-ui/react/preview-card"
import * as React from "react"
import { cn } from "cn"

const HoverCardContext = React.createContext<{
  delay?: number
  closeDelay?: number
}>({})

function HoverCard({
  openDelay,
  closeDelay,
  delay,
  children,
  ...props
}: HoverCardPrimitive.Root.Props & {
  openDelay?: number
  closeDelay?: number
  delay?: number
}) {
  return (
    <HoverCardContext.Provider
      value={{
        delay: delay ?? openDelay,
        closeDelay,
      }}
    >
      <HoverCardPrimitive.Root data-slot="hover-card" {...props}>
        {children}
      </HoverCardPrimitive.Root>
    </HoverCardContext.Provider>
  )
}

function HoverCardTrigger({
  children,
  asChild,
  delay,
  closeDelay,
  ...props
}: HoverCardPrimitive.Trigger.Props & {
  asChild?: boolean
}) {
  const context = React.useContext(HoverCardContext)
  const resolvedDelay = delay ?? context.delay
  const resolvedCloseDelay = closeDelay ?? context.closeDelay

  if (asChild && React.isValidElement(children)) {
    return (
      <HoverCardPrimitive.Trigger
        data-slot="hover-card-trigger"
        render={children}
        delay={resolvedDelay}
        closeDelay={resolvedCloseDelay}
        {...props}
      />
    )
  }

  return (
    <HoverCardPrimitive.Trigger
      data-slot="hover-card-trigger"
      delay={resolvedDelay}
      closeDelay={resolvedCloseDelay}
      {...props}
    >
      {children}
    </HoverCardPrimitive.Trigger>
  )
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  side = "bottom",
  alignOffset = 0,
  onPointerDownOutside,
  onInteractOutside,
  ...props
}: HoverCardPrimitive.Popup.Props &
  Pick<
    HoverCardPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & {
    onPointerDownOutside?: (e?: any) => void
    onInteractOutside?: (e?: any) => void
  }) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Positioner
        align={align}
        sideOffset={sideOffset}
        side={side}
        alignOffset={alignOffset}
        className="isolate z-50"
      >
        <HoverCardPrimitive.Popup
          data-slot="hover-card-content"
          className={cn(
            "z-50 w-64 origin-(--transform-origin) rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </HoverCardPrimitive.Positioner>
    </HoverCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardContent, HoverCardTrigger }
