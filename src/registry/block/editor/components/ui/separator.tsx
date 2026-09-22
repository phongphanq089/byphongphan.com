import { Separator as SeparatorPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/editor/utils/cn"

function Separator({
  className,
  orientation = "vertical",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border/40",
        orientation === "horizontal"
          ? "my-1 h-px w-full"
          : "mx-1.5 h-4 w-px self-center",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
