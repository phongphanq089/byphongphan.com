import { cn } from "cn"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import * as React from "react"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={cn(
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Track
        data-slot="progress-track"
        className="size-full overflow-hidden rounded-full"
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="size-full flex-1 bg-primary transition-all"
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
