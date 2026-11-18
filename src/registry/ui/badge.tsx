import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center border leading-none font-medium whitespace-nowrap transition-colors duration-150 outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 [&>svg]:pointer-events-none [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-foreground text-background shadow-2xs hover:bg-foreground/90",
        secondary:
          "border-border/50 bg-secondary/60 text-secondary-foreground backdrop-blur-xs hover:bg-secondary/90",
        outline:
          "border-border/80 bg-background/50 text-foreground/90 backdrop-blur-xs hover:bg-muted/50 hover:text-foreground",
        subtle:
          "border-border/30 bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground",
        success:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 dark:text-emerald-400",
        warning:
          "border-amber-500/20 bg-amber-500/10 text-amber-600 hover:bg-amber-500/15 dark:text-amber-400",
        destructive:
          "border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/15",
        info: "border-sky-500/20 bg-sky-500/10 text-sky-600 hover:bg-sky-500/15 dark:text-sky-400",
        ghost:
          "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-5.5 gap-1.5 px-2.5 text-[11px] [&>svg]:size-3",
        xs: "h-4.5 gap-1 px-1.5 text-[10px] [&>svg]:size-2.5",
        sm: "h-5 gap-1 px-2 text-[11px] [&>svg]:size-3",
        lg: "h-6.5 gap-2 px-3 text-xs [&>svg]:size-3.5",
      },
      shape: {
        pill: "rounded-full",
        rounded: "rounded-[5px]",
        square: "rounded-[3px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "pill",
    },
  }
)

export interface BadgeProps
  extends
    useRender.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {}

function Badge({
  className,
  variant = "default",
  size = "default",
  shape = "pill",
  render,
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, size, shape }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
      size,
      shape,
    },
  })
}

export interface BadgeDotProps extends React.ComponentProps<"span"> {
  pulse?: boolean
}

function BadgeDot({ className, pulse = false, ...props }: BadgeDotProps) {
  return (
    <span
      className={cn(
        "relative inline-flex size-1.5 shrink-0 items-center justify-center",
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-75 motion-reduce:hidden" />
      )}
      <span className="relative inline-flex size-full rounded-full bg-current" />
    </span>
  )
}

export { Badge, BadgeDot, badgeVariants }
