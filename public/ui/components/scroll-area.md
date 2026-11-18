# Scroll Area

> Augments native scroll functionality with auto, hover, and always visibility modes, custom variants, scrollbar gutter reserve, keyboard navigation, and high-contrast styling.

## Installation

  

  ```bash
npx shadcn@latest add https://byphongphan.com/r/scroll-area.json
```

  
    
      - Install the following dependencies:
      ```bash
npm install @base-ui/react class-variance-authority
```
      - Copy and paste the scroll-area component into your project.
      ```tsx
// ui/scroll-area.tsx
import * as React from "react"
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export type ScrollAreaVisibility = "auto" | "hover" | "always"
export type ScrollbarGutter = boolean | "auto" | "stable"

export const scrollBarVariants = cva(
  "flex touch-none transition-colors select-none",
  {
    variants: {
      variant: {
        default: "p-0.5",
        minimal: "p-0",
        bordered:
          "border-border/40 bg-muted/20 data-[orientation=horizontal]:border-t data-[orientation=vertical]:border-l",
        floating: "p-1",
      },
      size: {
        sm: "data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5",
        default:
          "data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5",
        lg: "data-[orientation=horizontal]:h-3.5 data-[orientation=vertical]:w-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export const scrollThumbVariants = cva(
  "relative flex-1 rounded-full transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-foreground/20 hover:bg-foreground/30 active:bg-foreground/40 dark:bg-foreground/25 dark:hover:bg-foreground/40 dark:active:bg-foreground/50",
        minimal:
          "rounded-none bg-foreground/25 hover:bg-foreground/45 active:bg-foreground/60 dark:bg-foreground/30 dark:hover:bg-foreground/50",
        bordered:
          "bg-foreground/25 hover:bg-foreground/35 active:bg-foreground/45 dark:bg-foreground/30",
        floating:
          "bg-foreground/30 shadow-xs shadow-black/25 hover:bg-foreground/45 active:bg-foreground/60 dark:bg-foreground/35 dark:shadow-black/60 dark:hover:bg-foreground/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface ScrollAreaContextValue {
  type: ScrollAreaVisibility
  variant?: VariantProps<typeof scrollBarVariants>["variant"]
  size?: VariantProps<typeof scrollBarVariants>["size"]
  scrollbarGutter?: ScrollbarGutter
  scrollFade?: boolean
}

const ScrollAreaContext = React.createContext<ScrollAreaContextValue>({
  type: "hover",
  variant: "default",
  size: "default",
  scrollbarGutter: false,
  scrollFade: false,
})

export interface ScrollAreaProps
  extends
    ScrollAreaPrimitive.Root.Props,
    VariantProps<typeof scrollBarVariants> {
  classNameViewport?: string
  scrollFade?: boolean
  scrollbarGutter?: ScrollbarGutter
  fill?: boolean
  clampContentMinWidth?: boolean
  overscrollContain?: boolean
  /**
   * Visibility mode for scrollbars:
   * - "hover": visible on hover or during scrolling (default)
   * - "auto": visible only while actively scrolling, hides when inactive
   * - "always": persistently visible whenever content overflows
   */
  type?: ScrollAreaVisibility
  /**
   * Orientation of the built-in scrollbars:
   * - "vertical": only vertical scrollbar
   * - "horizontal": only horizontal scrollbar
   * - "both": both vertical and horizontal scrollbars (default)
   * - "none": don't render built-in scrollbars (use custom <ScrollBar />)
   */
  orientation?: "vertical" | "horizontal" | "both" | "none"
}

export function ScrollArea({
  className,
  classNameViewport,
  children,
  scrollFade = false,
  scrollbarGutter = false,
  fill = false,
  clampContentMinWidth = true,
  overscrollContain = false,
  type = "hover",
  variant = "default",
  size = "default",
  orientation = "both",
  tabIndex = 0,
  role = "region",
  ...props
}: ScrollAreaProps): React.ReactElement {
  // Separate content children from custom ScrollBar elements passed in children
  const contentChildren: React.ReactNode[] = []
  const customScrollBars: React.ReactNode[] = []

  let hasCustomHorizontalScrollBar = false
  let hasCustomVerticalScrollBar = false

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const childProps = child.props as {
        orientation?: string
        "data-slot"?: string
      }
      if (
        child.type === ScrollBar ||
        child.type === ScrollAreaPrimitive.Scrollbar ||
        childProps?.["data-slot"] === "scroll-area-scrollbar"
      ) {
        if (childProps?.orientation === "horizontal") {
          hasCustomHorizontalScrollBar = true
        } else {
          hasCustomVerticalScrollBar = true
        }
        customScrollBars.push(child)
        return
      }
    }
    contentChildren.push(child)
  })

  return (
    <ScrollAreaContext.Provider
      value={{
        type,
        variant,
        size,
        scrollbarGutter,
        scrollFade,
      }}
    >
      <ScrollAreaPrimitive.Root
        className={cn("relative min-h-0 min-w-0 overflow-hidden", className)}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          tabIndex={tabIndex}
          role={role}
          className={cn(
            "h-full max-h-[inherit] w-full rounded-[inherit] transition-shadow outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
            "contrast-more:focus-visible:ring-4 contrast-more:focus-visible:ring-foreground",
            "forced-colors:focus-visible:outline forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-[Highlight]",
            classNameViewport,
            overscrollContain &&
              "data-has-overflow-x:overscroll-x-contain data-has-overflow-y:overscroll-y-contain",
            scrollFade && "scroll-fade-effect-x scroll-fade-effect-y",
            scrollbarGutter === "stable" && "pe-2.5 pb-2.5",
            (scrollbarGutter === true || scrollbarGutter === "auto") &&
              "data-has-overflow-x:pb-2.5 data-has-overflow-y:pe-2.5"
          )}
          data-slot="scroll-area-viewport"
        >
          <ScrollAreaPrimitive.Content
            className={cn(fill && "size-full")}
            data-slot="scroll-area-content"
            style={clampContentMinWidth ? { minWidth: 0 } : undefined}
          >
            {contentChildren}
          </ScrollAreaPrimitive.Content>
        </ScrollAreaPrimitive.Viewport>

        {customScrollBars}

        {!hasCustomVerticalScrollBar &&
          (orientation === "both" || orientation === "vertical") && (
            <ScrollBar orientation="vertical" />
          )}
        {!hasCustomHorizontalScrollBar &&
          (orientation === "both" || orientation === "horizontal") && (
            <ScrollBar orientation="horizontal" />
          )}
        {orientation !== "none" && (
          <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
        )}
      </ScrollAreaPrimitive.Root>
    </ScrollAreaContext.Provider>
  )
}

export interface ScrollBarProps
  extends
    ScrollAreaPrimitive.Scrollbar.Props,
    VariantProps<typeof scrollBarVariants> {
  /**
   * Visibility mode override for this scrollbar (defaults to parent ScrollArea mode).
   */
  type?: ScrollAreaVisibility
}

const VISIBILITY_CLASSES: Record<ScrollAreaVisibility, string> = {
  hover:
    "opacity-0 transition-opacity delay-300 duration-200 data-hovering:opacity-100 data-hovering:delay-0 data-hovering:duration-100 data-scrolling:opacity-100 data-scrolling:delay-0 data-scrolling:duration-100",
  auto: "opacity-0 transition-opacity delay-700 duration-300 data-scrolling:opacity-100 data-scrolling:delay-0 data-scrolling:duration-100",
  always: "opacity-100 transition-opacity duration-150",
}

export function ScrollBar({
  className,
  orientation = "vertical",
  type: typeProp,
  variant: variantProp,
  size: sizeProp,
  ...props
}: ScrollBarProps): React.ReactElement {
  const context = React.useContext(ScrollAreaContext)
  const visibilityType = typeProp ?? context.type ?? "hover"
  const variant = variantProp ?? context.variant ?? "default"
  const size = sizeProp ?? context.size ?? "default"

  return (
    <ScrollAreaPrimitive.Scrollbar
      className={cn(
        scrollBarVariants({ variant, size }),
        VISIBILITY_CLASSES[visibilityType],
        "forced-colors:border forced-colors:border-[CanvasText]/20 forced-colors:bg-[Canvas]",
        "contrast-more:border contrast-more:border-border contrast-more:bg-muted/40",
        className
      )}
      data-slot="scroll-area-scrollbar"
      data-visibility-type={visibilityType}
      orientation={orientation}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        className={cn(
          scrollThumbVariants({ variant }),
          "contrast-more:border contrast-more:border-background contrast-more:bg-foreground contrast-more:opacity-100",
          "forced-colors:border forced-colors:border-[ButtonBorder] forced-colors:bg-[ButtonText] forced-colors:hover:bg-[Highlight] forced-colors:active:bg-[Highlight]"
        )}
        data-slot="scroll-area-thumb"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollAreaPrimitive }

```
      - Update the import paths to match your project setup.
    
  

## Usage

```tsx
import { ScrollArea } from "@/registry/ui/scroll-area"

export function ScrollAreaDemo() {
  return (
    <ScrollArea
      className="h-72 w-52 rounded-md border p-4"
      variant="default"
      size="default"
      type="hover"
      scrollbarGutter="auto"
    >
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Title</h4>
        <p className="text-xs text-muted-foreground">Long content...</p>
      </div>
    </ScrollArea>
  )
}
```

## Props

| Prop                   | Type                                                 | Default     | Description                                                          |
| :--------------------- | :--------------------------------------------------- | :---------- | :------------------------------------------------------------------- |
| `type`                 | `"hover" \| "auto" \| "always"`                      | `"hover"`   | Visibility behavior for the scrollbars.                              |
| `variant`              | `"default" \| "minimal" \| "bordered" \| "floating"` | `"default"` | Visual aesthetic variant for the scrollbar track and thumb.          |
| `size`                 | `"sm" \| "default" \| "lg"`                          | `"default"` | Thickness of the scrollbar track (4px, 6px, or 10px).                |
| `orientation`          | `"vertical" \| "horizontal" \| "both" \| "none"`     | `"both"`    | Orientation of the automatically managed built-in scrollbars.        |
| `scrollbarGutter`      | `boolean \| "auto" \| "stable"`                      | `false`     | Controls reserve gutter spacing to eliminate layout shifts.          |
| `scrollFade`           | `boolean`                                            | `false`     | Adds smooth mask fade gradient at the overflowing edges.             |
| `overscrollContain`    | `boolean`                                            | `false`     | Prevents scroll chaining to parent containers on boundary edges.     |
| `fill`                 | `boolean`                                            | `false`     | Stretches viewport content container to 100% width and height.       |
| `clampContentMinWidth` | `boolean`                                            | `true`      | Constrains content `min-width: 0` to enable responsive resizing.     |
| `classNameViewport`    | `string`                                             | `undefined` | Additional CSS class names applied directly to the Viewport element. |
| `tabIndex`             | `number`                                             | `0`         | Keyboard focus tab index for keyboard-navigable scrolling.           |
| `role`                 | `string`                                             | `"region"`  | Accessible ARIA role for screen-reader region identification.        |
