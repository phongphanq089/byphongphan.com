# Underline to Background

> Fluid typographic micro-interaction where an underline smoothly expands into a full background fill on hover with inverted text contrast.

## Installation

  

  ```bash
npx shadcn@latest add https://byphongphan.com/r/underline-to-background.json
```

  
    
      - Install the required motion dependency:
      ```bash
npm install motion
```

      - Copy and paste the component into your project:
      ```tsx
// animated/underline-to-background.tsx
/* eslint-disable react-hooks/static-components */
import type { ValueAnimationTransition } from "motion/react"
import { motion } from "motion/react"
import type React from "react"
import { useEffect, useMemo, useRef } from "react"

import { cn } from "@/lib/utils"

export interface UnderlineToBackgroundProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "children"
> {
  /**
   * Optional URL if rendered as a link (`as="a"`)
   */
  href?: string

  /**
   * Target window/tab if rendered as a link
   */
  target?: string

  /**
   * Rel attribute if rendered as a link
   */
  rel?: string

  /**
   * The content to be displayed and animated
   */
  children: React.ReactNode

  /**
   * HTML Tag to render the component as
   * @default "span"
   */
  as?: React.ElementType

  /**
   * Optional class name for styling
   */
  className?: string

  /**
   * Animation transition configuration
   * @default { type: "spring", damping: 30, stiffness: 300 }
   */
  transition?: ValueAnimationTransition

  /**
   * The color that the text will animate to on hover
   * @default "var(--background, #000)"
   */
  targetTextColor?: string

  /**
   * Height of the underline as a ratio of font size
   * @default 0.1
   */
  underlineHeightRatio?: number

  /**
   * Padding of the underline as a ratio of font size
   * @default 0.01
   */
  underlinePaddingRatio?: number
}

export function UnderlineToBackground({
  children,
  as = "span",
  className,
  transition = { type: "spring", damping: 30, stiffness: 300 },
  underlineHeightRatio = 0.1, // Default to 10% of font size
  underlinePaddingRatio = 0.01, // Default to 1% of font size
  targetTextColor = "var(--background, #000)",
  ...props
}: UnderlineToBackgroundProps) {
  const textRef = useRef<HTMLSpanElement>(null)

  // Create custom motion component based on the 'as' prop
  const MotionComponent = useMemo(() => motion.create(as), [as])

  // Update CSS custom properties based on font size
  useEffect(() => {
    const updateUnderlineStyles = () => {
      if (textRef.current) {
        const fontSize = parseFloat(getComputedStyle(textRef.current).fontSize)
        const underlineHeight = fontSize * underlineHeightRatio
        const underlinePadding = fontSize * underlinePaddingRatio
        textRef.current.style.setProperty(
          "--underline-height",
          `${underlineHeight}px`
        )
        textRef.current.style.setProperty(
          "--underline-padding",
          `${underlinePadding}px`
        )
      }
    }

    updateUnderlineStyles()
    window.addEventListener("resize", updateUnderlineStyles)

    return () => window.removeEventListener("resize", updateUnderlineStyles)
  }, [underlineHeightRatio, underlinePaddingRatio])

  // Animation variants for the underline background
  const underlineVariants = {
    initial: {
      height: "var(--underline-height)",
    },
    target: {
      height: "100%",
      transition,
    },
  }

  return (
    <MotionComponent
      className={cn(
        "group/utb relative inline-block cursor-pointer",
        className
      )}
      whileHover="target"
      ref={textRef}
      {...props}
    >
      <motion.div
        className="absolute w-full bg-current"
        style={{
          height: "var(--underline-height)",
          bottom: "calc(-1 * var(--underline-padding))",
        }}
        variants={underlineVariants}
        aria-hidden="true"
      />
      <span
        className="relative text-current group-hover/utb:text-(--utb-target-color) group-hover/utb:transition-colors group-hover/utb:duration-200"
        style={
          {
            "--utb-target-color": targetTextColor,
          } as React.CSSProperties
        }
      >
        {children}
      </span>
    </MotionComponent>
  )
}

UnderlineToBackground.displayName = "UnderlineToBackground"

export default UnderlineToBackground

```

      - Update the import paths to match your project directory structure.
    

  

---

## Anatomy

```text
UnderlineToBackground (Motion container tracking computed font size)
├── <motion.div (underline background)> (Expands from initial underline height to 100% fill)
└── <motion.span (text label)> (Inverts text color to targetTextColor on hover)
```

---

## Usage

```tsx
import { UnderlineToBackground } from "@/components/underline-to-background"
```

```tsx
export function NavExample() {
  return (
    <UnderlineToBackground
      as="a"
      className="text-primary font-medium"
      targetTextColor="var(--primary-foreground, #fff)"
    >
      Explore Components
    </UnderlineToBackground>
  )
}
```

---

## Features

- **Font-Proportional Scaling**: Automatically tracks computed font size via `getComputedStyle` and window resize listeners, ensuring the underline height and padding scale seamlessly across all typography sizes.
- **Dynamic Element Polymorphism**: Render as `span`, `a`, `button`, `div`, or any custom element via the `as` prop with full motion support.
- **Inverted Contrast Transition**: The text color smoothly animates to `targetTextColor` (e.g. `var(--background)` or `var(--primary-foreground)`) as the underline expands into the background.
- **Custom Spring Kinematics**: Pass custom `transition` parameters to customize the spring stiffness, damping, or easing duration.

---

## API Reference

### UnderlineToBackground

Typographic micro-interaction component.

| Prop                    | Type                      | Default                                      | Description                                                                 |
| :---------------------- | :------------------------ | :------------------------------------------- | :-------------------------------------------------------------------------- |
| `children`              | `React.ReactNode`         | -                                            | The content to be displayed and animated (required).                        |
| `as`                    | `React.ElementType`       | `"span"`                                     | HTML tag or component to render as.                                         |
| `targetTextColor`       | `string`                  | `"var(--background, #000)"`                  | Color the text animates to on hover.                                        |
| `underlineHeightRatio`  | `number`                  | `0.1`                                        | Height of initial underline as a ratio of font size (10%).                  |
| `underlinePaddingRatio` | `number`                  | `0.01`                                       | Distance of underline below text baseline as a ratio of font size (1%).     |
| `transition`            | `ValueAnimationTransition`| `{ type: "spring", damping: 30, stiffness: 300 }` | Spring animation transition configuration.                             |
| `className`             | `string`                  | `undefined`                                  | Additional CSS classes for styling.                                         |
