# Badge

> A versatile, subtle badge component with calibrated proportions, translucent status tints, micro dots, and geometric contour variants.

## Installation

  

  ```bash
npx shadcn@latest add https://byphongphan.com/r/badge.json
```

  
    
      - Install the following dependencies:
      ```bash
npm install @base-ui/react class-variance-authority
```

      - Copy and paste the component into your project:
      ```tsx
// ui/badge.tsx
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center border font-medium whitespace-nowrap transition-colors duration-150 select-none outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 [&>svg]:pointer-events-none [&>svg]:shrink-0",
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
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15",
        warning:
          "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15",
        destructive:
          "border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/15",
        info:
          "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/15",
        ghost:
          "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground",
        link:
          "border-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-6 px-2.5 text-xs gap-1.5 [&>svg]:size-3",
        xs: "h-4.5 px-1.5 text-[10px] gap-1 tracking-tight [&>svg]:size-2.5",
        sm: "h-5 px-2 text-[11px] gap-1 tracking-tight [&>svg]:size-3",
        lg: "h-7 px-3 text-xs gap-2 tracking-normal [&>svg]:size-3.5",
      },
      shape: {
        pill: "rounded-full",
        rounded: "rounded-md",
        square: "rounded-xs",
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
  extends useRender.ComponentProps<"span">,
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
        "relative flex size-1.5 shrink-0 items-center justify-center",
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-75 motion-reduce:hidden" />
      )}
      <span className="relative inline-flex size-1.5 rounded-full bg-current" />
    </span>
  )
}

export { Badge, BadgeDot, badgeVariants }

```

      - Update the import paths to match your project directory structure.
    

  

---

## Anatomy

```text
Badge (Base UI useRender span with micro-proportions)
├── <BadgeDot pulse? /> (Optional status indicator with ping animation)
├── <Icon /> (Optional inline SVG icon auto-scaled to 12px/14px)
└── {children} (Text label with tracking and crisp contrast)
```

---

## Usage

```tsx
import { Badge, BadgeDot } from "@/components/ui/badge"
```

```tsx
export function StatusShowcase() {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="success">
        <BadgeDot pulse />
        Live System
      </Badge>

      <Badge variant="secondary" shape="rounded">
        v3.2.0
      </Badge>

      <Badge variant="outline">
        Preview
      </Badge>
    </div>
  )
}
```

---

## Features

- **Translucent Micro Tints**: Subtle opacity backgrounds (`bg-emerald-500/10`, `bg-secondary/60`, `bg-muted/40`) that look clean and sophisticated instead of visually aggressive solid blocks.
- **Pulsing Dot Indicators**: Built-in `<BadgeDot pulse />` component that automatically inherits the parent badge's semantic color.
- **Geometric Contours**: Three shapes tailored for distinct UI contexts:
  - `pill`: Classic smooth pill (`rounded-full`).
  - `rounded`: Linear / Raycast modern developer rectangular tag (`rounded-md`).
  - `square`: Technical specification micro stamp (`rounded-xs`).
- **Flexible Sizes**: Micro tags `xs` (18px) for compact data tables, `sm` (20px), standard `default` (24px), up to prominent `lg` (28px).
- **Polymorphic Rendering**: Built on `@base-ui/react/use-render`, easily render as links (`render={<a href="..." />}`) without invalid HTML nesting.

---

## API Reference

### Badge

| Prop        | Type                                                                                                        | Default     | Description                                                          |
| :---------- | :---------------------------------------------------------------------------------------------------------- | :---------- | :------------------------------------------------------------------- |
| `variant`   | `"default" \| "secondary" \| "outline" \| "subtle" \| "success" \| "warning" \| "destructive" \| "info" \| "ghost" \| "link"` | `"default"` | Visual style and semantic color mood.                                |
| `size`      | `"xs" \| "sm" \| "default" \| "lg"`                                                                         | `"default"` | Height and padding scale (18px, 20px, 24px, 28px).                   |
| `shape`     | `"pill" \| "rounded" \| "square"`                                                                           | `"pill"`    | Geometric border radius profile.                                     |
| `render`    | `React.ReactElement`                                                                                        | `undefined` | Polymorphic element to render (e.g. `<a />`, `<button />`).         |
| `className` | `string`                                                                                                    | `undefined` | Additional CSS classes for styling.                                  |

### BadgeDot

| Prop        | Type      | Default | Description                                                          |
| :---------- | :-------- | :------ | :------------------------------------------------------------------- |
| `pulse`     | `boolean` | `false` | When true, renders an animated ping beacon radiating from the dot.   |
| `className` | `string`  | `undefined` | Additional CSS classes for styling.                              |
