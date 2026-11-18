# Letter 3D Swap

> Isometric 3D typography swap micro-interaction where characters rotate on multi-directional axes on hover with configurable stagger delays.

## Installation

  

  ```bash
npx shadcn@latest add https://byphongphan.com/r/letter-3d-swap.json
```

  
    
      - Install the required motion dependency:
      ```bash
npm install motion
```

      - Copy and paste the component into your project:
      ```tsx
// animated/letter-3d-swap.tsx
import type { AnimationOptions, ValueAnimationTransition } from "motion/react"
import { useAnimate } from "motion/react"
import React, { isValidElement, useCallback, useMemo, useState } from "react"

import { cn } from "@/lib/utils"

// Helper function to split text into characters with support for unicode and emojis
const splitIntoCharacters = (text: string): string[] => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" })
    return Array.from(segmenter.segment(text), ({ segment }) => segment)
  }
  return Array.from(text)
}

// Helper function to extract text recursively from children
const extractTextFromChildren = (
  children: React.ReactNode
): string | undefined => {
  if (children == null) return ""
  if (typeof children === "string") return children
  if (typeof children === "number") return String(children)

  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("")
  }

  if (isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode }
    const childText = props.children
    if (childText != null) {
      return extractTextFromChildren(childText)
    }
    return ""
  }

  return ""
}

/**
 * Internal helper interface for representing a word in the text with its characters and spacing information
 */
interface WordObject {
  /**
   * Array of individual characters in the word
   */
  characters: string[]
  /**
   * Whether this word needs a space after it
   */
  needsSpace: boolean
}

export type Letter3DRotateDirection = "top" | "right" | "bottom" | "left"
export type Letter3DStaggerFrom =
  "first" | "last" | "center" | number | "random"

export interface Letter3DSwapProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "children"
> {
  /**
   * The content to be displayed and animated
   */
  children: React.ReactNode

  /**
   * HTML Tag to render the component as
   * @default "p"
   */
  as?: React.ElementType

  /**
   * Class name for the main container element.
   */
  mainClassName?: string

  /**
   * Class name for the front face element.
   */
  frontFaceClassName?: string

  /**
   * Class name for the secondary face element.
   */
  secondFaceClassName?: string

  /**
   * Duration of stagger delay between elements in seconds.
   * @default 0.05
   */
  staggerDuration?: number

  /**
   * Direction to stagger animations from.
   * @default "first"
   */
  staggerFrom?: Letter3DStaggerFrom

  /**
   * Animation transition configuration.
   * @default { type: "spring", damping: 30, stiffness: 300 }
   */
  transition?: ValueAnimationTransition | AnimationOptions

  /**
   * Direction of rotation
   * @default "right"
   */
  rotateDirection?: Letter3DRotateDirection
}

export function Letter3DSwap({
  children,
  as = "p",
  mainClassName,
  frontFaceClassName,
  secondFaceClassName,
  staggerDuration = 0.05,
  staggerFrom = "first",
  transition = { type: "spring", damping: 30, stiffness: 300 },
  rotateDirection = "right",
  className,
  ...props
}: Letter3DSwapProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [scope, animate] = useAnimate()

  // Determine rotation transform based on direction
  const rotationTransform = (() => {
    switch (rotateDirection) {
      case "top":
        return "rotateX(90deg)"
      case "right":
        return "rotateY(90deg)"
      case "bottom":
        return "rotateX(-90deg)"
      case "left":
        return "rotateY(90deg)"
      default:
        return "rotateY(-90deg)"
    }
  })()

  // Convert children to string for processing with error handling
  const text = useMemo(() => {
    try {
      return extractTextFromChildren(children)
    } catch {
      return ""
    }
  }, [children])

  // Splitting the text into animation segments
  const characters = useMemo(() => {
    const words = text?.split(" ") ?? []
    return words.map((word: string, i: number) => ({
      characters: splitIntoCharacters(word),
      needsSpace: i !== words.length - 1,
    }))
  }, [text])

  // Helper function to calculate stagger delay for each text segment
  const getStaggerDelay = useCallback(
    (index: number, totalChars: number) => {
      const total = totalChars
      if (staggerFrom === "first") return index * staggerDuration
      if (staggerFrom === "last") return (total - 1 - index) * staggerDuration
      if (staggerFrom === "center") {
        const center = Math.floor(total / 2)
        return Math.abs(center - index) * staggerDuration
      }
      if (staggerFrom === "random") {
        const randomIndex = Math.floor(Math.random() * total)
        return Math.abs(randomIndex - index) * staggerDuration
      }
      if (typeof staggerFrom === "number") {
        return Math.abs(staggerFrom - index) * staggerDuration
      }
      return index * staggerDuration
    },
    [staggerFrom, staggerDuration]
  )

  // Handle hover start - trigger the rotation
  const handleHoverStart = useCallback(async () => {
    if (isAnimating || isHovering) return

    setIsHovering(true)
    setIsAnimating(true)

    const totalChars = characters.reduce(
      (sum: number, word: WordObject) => sum + word.characters.length,
      0
    )

    // Create delays array based on staggerFrom
    const delays = Array.from({ length: totalChars }, (_, i) => {
      return getStaggerDelay(i, totalChars)
    })

    // Animate each character with its specific delay
    await animate(
      ".letter-3d-swap-char-box-item",
      { transform: rotationTransform },
      {
        ...transition,
        delay: (i: number) => delays[i],
      }
    )

    // Reset all boxes
    await animate(
      ".letter-3d-swap-char-box-item",
      { transform: "rotateX(0deg) rotateY(0deg)" },
      { duration: 0 }
    )

    setIsAnimating(false)
  }, [
    isAnimating,
    isHovering,
    characters,
    transition,
    getStaggerDelay,
    rotationTransform,
    animate,
  ])

  // Handle hover end
  const handleHoverEnd = useCallback(() => {
    setIsHovering(false)
  }, [])

  const ElementTag = as

  return (
    <ElementTag
      className={cn(
        "relative flex cursor-pointer flex-wrap select-none",
        mainClassName,
        className
      )}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{text}</span>

      {characters.map(
        (wordObj: WordObject, wordIndex: number, array: WordObject[]) => {
          const previousCharsCount = array
            .slice(0, wordIndex)
            .reduce(
              (sum: number, word: WordObject) => sum + word.characters.length,
              0
            )

          return (
            <span key={wordIndex} className="inline-flex">
              {wordObj.characters.map((char: string, charIndex: number) => {
                const totalIndex = previousCharsCount + charIndex

                return (
                  <CharBox
                    key={totalIndex}
                    char={char}
                    frontFaceClassName={frontFaceClassName}
                    secondFaceClassName={secondFaceClassName}
                    rotateDirection={rotateDirection}
                  />
                )
              })}
              {wordObj.needsSpace && <span className="whitespace-pre"> </span>}
            </span>
          )
        }
      )}
    </ElementTag>
  )
}

interface CharBoxProps {
  char: string
  frontFaceClassName?: string
  secondFaceClassName?: string
  rotateDirection: Letter3DRotateDirection
}

function CharBox({
  char,
  frontFaceClassName,
  secondFaceClassName,
  rotateDirection,
}: CharBoxProps) {
  // Get the transform for the second face based on rotation direction
  const getSecondFaceTransform = () => {
    switch (rotateDirection) {
      case "top":
        return `rotateX(-90deg) translateZ(0.5lh)`
      case "right":
        return `rotateY(90deg) translateX(50%) rotateY(-90deg) translateX(-50%) rotateY(-90deg) translateX(50%)`
      case "bottom":
        return `rotateX(90deg) translateZ(0.5lh)`
      case "left":
        return `rotateY(90deg) translateX(50%) rotateY(90deg) translateX(-50%) rotateY(90deg) translateX(50%)`
      default:
        return `rotateY(90deg) translateZ(1ch)`
    }
  }

  const secondFaceTransform = getSecondFaceTransform()

  return (
    <span
      className="letter-3d-swap-char-box-item inline-block [transform-style:preserve-3d] transform-3d"
      style={{
        transform:
          rotateDirection === "top" || rotateDirection === "bottom"
            ? "translateZ(-0.5lh)"
            : "rotateY(90deg) translateX(50%) rotateY(-90deg)",
      }}
    >
      {/* Front face */}
      <span
        className={cn(
          "relative h-[1lh] [backface-visibility:hidden] backface-hidden",
          frontFaceClassName
        )}
        style={{
          transform: `${
            rotateDirection === "top" || rotateDirection === "bottom"
              ? "translateZ(0.5lh)"
              : rotateDirection === "left"
                ? "rotateY(90deg) translateX(50%) rotateY(-90deg)"
                : "rotateY(-90deg) translateX(50%) rotateY(90deg)"
          }`,
        }}
      >
        {char}
      </span>

      {/* Second face - positioned based on rotation direction */}
      <span
        className={cn(
          "absolute top-0 left-0 h-[1lh] [backface-visibility:hidden] backface-hidden",
          secondFaceClassName
        )}
        style={{
          transform: secondFaceTransform,
        }}
      >
        {char}
      </span>
    </span>
  )
}

Letter3DSwap.displayName = "Letter3DSwap"

export default Letter3DSwap

```

      - Update the import paths to match your project directory structure.
    

  

---

## Anatomy

```text
Letter3DSwap (Accessible container with hidden sr-only text string)
├── <span> (Inline word wrapper with whitespace awareness)
│   └── <span> (CharBox with 3D preservation [transform-style:preserve-3d])
│       ├── <span (front face)> (Front letter facing camera)
│       └── <span (second face)> (Back/rotated letter facing active rotation plane)
```

---

## Usage

```tsx
import { Letter3DSwap } from "@/components/letter-3d-swap"
```

```tsx
export function HeroHeading() {
  return (
    <Letter3DSwap
      as="h1"
      className="text-4xl font-extrabold"
      frontFaceClassName="text-foreground"
      secondFaceClassName="text-primary font-bold"
      rotateDirection="top"
      staggerFrom="center"
    >
      INTERACTIVE 3D TEXT
    </Letter3DSwap>
  )
}
```

---

## Features

- **True 3D Cube Transform**: Each character is wrapped in an isometric 3D box with front and second faces, rotating on X or Y axes with `backface-visibility: hidden`.
- **Unicode & Grapheme Segmenter**: Uses `Intl.Segmenter` to split complex unicode, diacritics, and multi-byte emojis accurately without breaking characters.
- **Configurable Stagger Physics**: Control the wave propagation order using `staggerFrom="first"`, `"last"`, `"center"`, or `"random"`, along with customizable `staggerDuration`.
- **Full 4-Axis Rotations**: Easily switch rotation direction between `"top"`, `"right"`, `"bottom"`, and `"left"` to fit your navigation or headline layout.
- **Accessible Out of the Box**: Includes `<span className="sr-only">` so screen readers parse the full, natural text phrase rather than fragmented individual letters.

---

## API Reference

### Letter3DSwap

Kinetic 3D typography swap component.

| Prop                  | Type                                                       | Default                                          | Description                                                                     |
| :-------------------- | :--------------------------------------------------------- | :----------------------------------------------- | :------------------------------------------------------------------------------ |
| `children`            | `React.ReactNode`                                          | -                                                | The text content to display and animate in 3D (required).                       |
| `as`                  | `React.ElementType`                                        | `"p"`                                            | HTML tag or component to render as.                                             |
| `rotateDirection`     | `"top" \| "right" \| "bottom" \| "left"`                   | `"right"`                                        | Rotation axis and direction when triggered on hover.                            |
| `staggerDuration`     | `number`                                                   | `0.05`                                           | Delay interval between consecutive character rotations in seconds.              |
| `staggerFrom`         | `"first" \| "last" \| "center" \| "random" \| number`      | `"first"`                                        | Starting point for the character stagger animation sequence.                    |
| `frontFaceClassName`  | `string`                                                   | `undefined`                                      | CSS class names applied to the resting front face character.                    |
| `secondFaceClassName` | `string`                                                   | `undefined`                                      | CSS class names applied to the rotated secondary face character.                |
| `mainClassName`       | `string`                                                   | `undefined`                                      | CSS class names for the outer container element.                                |
| `transition`          | `ValueAnimationTransition \| AnimationOptions`             | `{ type: "spring", damping: 30, stiffness: 300 }`| Motion spring physics or easing configuration.                                   |
| `className`           | `string`                                                   | `undefined`                                      | Additional CSS classes for the container.                                       |
