/* eslint-disable react-hooks/static-components */
import type { ValueAnimationTransition } from "motion/react"
import { motion } from "motion/react"
import type React from "react"
import { useEffect, useMemo, useRef } from "react"

import { cn } from "@/shared/lib/utils"

export type UnderlineDirection = "center" | "left" | "right"

export interface UnderlineAnimationProps extends Omit<
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
   * @default { duration: 0.25, ease: "easeInOut" }
   */
  transition?: ValueAnimationTransition

  /**
   * Origin direction of the underline expansion
   * @default "center"
   */
  direction?: UnderlineDirection

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

export function UnderlineAnimation({
  children,
  as = "span",
  className,
  transition = { duration: 0.25, ease: "easeInOut" },
  direction = "center",
  underlineHeightRatio = 0.1,
  underlinePaddingRatio = 0.01,
  ...props
}: UnderlineAnimationProps) {
  const textRef = useRef<HTMLSpanElement>(null)
  const MotionComponent = useMemo(() => motion.create(as), [as])

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

  const originX = direction === "left" ? 0 : direction === "right" ? 1 : 0.5

  const underlineVariants = {
    hidden: {
      width: 0,
      originX,
    },
    visible: {
      width: "100%",
      originX,
      transition,
    },
  }

  const positionClass =
    direction === "left"
      ? "left-0"
      : direction === "right"
        ? "right-0"
        : "left-1/2 -translate-x-1/2"

  return (
    <MotionComponent
      className={cn("relative inline-block cursor-pointer", className)}
      whileHover="visible"
      ref={textRef}
      {...props}
    >
      <span>{children}</span>
      <motion.div
        className={cn("absolute bg-current", positionClass)}
        style={{
          height: "var(--underline-height)",
          bottom: "calc(-1 * var(--underline-padding))",
        }}
        variants={underlineVariants}
        aria-hidden="true"
      />
    </MotionComponent>
  )
}

UnderlineAnimation.displayName = "UnderlineAnimation"

export { UnderlineAnimation as CenterUnderline }
export default UnderlineAnimation
