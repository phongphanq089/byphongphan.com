import * as React from "react"
import { cn } from "cn"

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    if (React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ...props,
        ...(children as React.ReactElement<any>).props,
        ref: ref ?? (children as any).ref,
        className: cn(
          (props as any).className,
          (children as React.ReactElement<any>).props.className
        ),
      })
    }
    return <>{children}</>
  }
) as React.ForwardRefExoticComponent<
  SlotProps & React.RefAttributes<HTMLElement>
> & {
  Root: React.ForwardRefExoticComponent<
    SlotProps & React.RefAttributes<HTMLElement>
  >
}

Slot.displayName = "Slot"
Slot.Root = Slot

export { Slot }
