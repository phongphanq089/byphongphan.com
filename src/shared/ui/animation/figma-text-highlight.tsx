import { useNavigate } from "@tanstack/react-router"
import { AnimatePresence, motion } from "motion/react"
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

import { cn } from "@/shared/lib/utils"
import {
  AnimatedTooltipBubble,
  type AnimatedTooltipVariant,
} from "@/shared/ui/animation/animated-tooltip"

// ============================================================================
// CONTEXT FOR HIGHLIGHT STATE
// ============================================================================

export interface FigmaHighlightContextType {
  activeKey: string | null
  setActiveKey: (key: string | null) => void
  pinnedKey: string | null
  setPinnedKey: React.Dispatch<React.SetStateAction<string | null>>
  color: string
  showDimensions: boolean
}

const FigmaHighlightContext = createContext<FigmaHighlightContextType | null>(
  null
)

export function useFigmaHighlight() {
  const ctx = useContext(FigmaHighlightContext)
  if (!ctx) {
    throw new Error(
      "useFigmaHighlight must be used within a FigmaTextHighlight provider"
    )
  }
  return ctx
}

// ============================================================================
// HAND-DRAWN CURLY ARROW (Playful Figma Annotation)
// ============================================================================

export interface HandDrawnCurlyArrowProps {
  className?: string
}

export function HandDrawnCurlyArrow({ className }: HandDrawnCurlyArrowProps) {
  return (
    <svg
      width="68"
      height="38"
      viewBox="0 0 76 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("overflow-visible text-muted-foreground/75", className)}
      aria-hidden="true"
    >
      <path
        d="M72 8.5C58 4.5 41 7.5 38.5 17.5C36.8 24.2 44.5 27.5 46.5 22C48.5 16.5 39.5 12 28.5 17C19.5 21.1 11.5 28.5 5 35"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 24.5L4.2 35.8L15.8 34.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ============================================================================
// INDIVIDUAL INTERACTIVE HIGHLIGHT WORD
// ============================================================================

export interface HighlightWordProps {
  id: string
  text?: string
  children?: React.ReactNode
  suffix?: string
  className?: string
  href?: string
  scrollToId?: string
  onClick?: (e: React.MouseEvent) => void
  popover?: React.ReactNode
  /** Custom hint text displayed inside animated tooltip (e.g. "explore components ↗") */
  hint?: string | boolean
  /** Alias for custom hint text */
  hintText?: string
  /** Explicitly show/hide interactive hint (defaults to true when href or scrollToId or onClick is present and no popover) */
  showHint?: boolean
  /** Animated tooltip variant from VengeanceUI: "cora" | "smaug" | "dori" | "gram" | "indis" | "malva" | "sadoc" */
  tooltipVariant?: AnimatedTooltipVariant
  /** Bubble scale factor (defaults to 0.82) */
  tooltipScale?: number
  /** Explicit title attribute (defaults to omitted to avoid clunky browser tooltips) */
  title?: string
}

export function HighlightWord({
  id,
  text,
  children,
  suffix = "",
  className,
  href,
  scrollToId,
  onClick,
  popover,
  hint,
  hintText,
  showHint,
  tooltipVariant = "smaug",
  tooltipScale = 0.82,
  title,
}: HighlightWordProps) {
  const {
    activeKey,
    setActiveKey,
    pinnedKey,
    setPinnedKey,
    color,
    showDimensions,
  } = useFigmaHighlight()

  const navigate = useNavigate()
  const spanRef = useRef<HTMLSpanElement>(null)
  const [dim, setDim] = useState<{ width: number; height: number }>({
    width: 72,
    height: 38,
  })

  const isSelected = activeKey === id

  const measure = useCallback(() => {
    if (!spanRef.current) return
    const rect = spanRef.current.getBoundingClientRect()
    const w = Math.round(rect.width)
    const h = Math.round(rect.height)
    if (w > 0 && h > 0) {
      setDim((prev) => {
        if (prev.width === w && prev.height === h) return prev
        return { width: w, height: h }
      })
    }
  }, [])

  // Measure on mount and window resize
  useEffect(() => {
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [measure])

  // When selected, re-measure to guarantee exact dimensions
  useEffect(() => {
    if (isSelected) {
      measure()
    }
  }, [isSelected, measure])

  const handleActivate = () => {
    measure()
    setActiveKey(id)
  }

  const handleClick = (e: React.MouseEvent) => {
    measure()
    setPinnedKey((prev) => (prev === id ? null : id))
    setActiveKey(id)

    if (onClick) {
      onClick(e)
      return
    }

    if (scrollToId) {
      const target = document.getElementById(scrollToId)
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      return
    }

    if (href) {
      if (href.startsWith("http://") || href.startsWith("https://")) {
        window.open(href, "_blank", "noopener,noreferrer")
      } else {
        navigate({ to: href })
      }
    }
  }

  const content = children ?? text
  const isNavigable = Boolean(href || scrollToId || onClick)
  const shouldShowHint =
    (showHint ?? (isNavigable && hint !== false)) && !popover && isSelected

  const resolvedHintText =
    typeof hint === "string"
      ? hint
      : hintText ||
        (href
          ? href.startsWith("http")
            ? "open link ↗"
            : href.includes("component")
              ? "explore components ↗"
              : href.includes("block")
                ? "explore blocks ↗"
                : "click to explore ↗"
          : scrollToId
            ? "scroll down ↓"
            : "click to view")

  return (
    <span
      ref={spanRef}
      role={href ? "link" : isNavigable ? "button" : undefined}
      tabIndex={isNavigable ? 0 : undefined}
      onMouseEnter={handleActivate}
      onMouseLeave={() => {
        if (!pinnedKey) setActiveKey(null)
      }}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (isNavigable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          handleClick(e as unknown as React.MouseEvent)
        }
      }}
      title={title}
      className={cn(
        "group relative -mx-0.5 inline-block cursor-pointer px-1.5 py-0.5 font-medium transition-colors select-none focus:outline-hidden",
        className
      )}
    >
      <span className="relative z-10 text-foreground transition-colors group-hover:text-primary">
        {content}
      </span>
      {suffix && (
        <span className="font-normal text-muted-foreground/80">{suffix}</span>
      )}

      {/* Interactive Popover (e.g. Avatar Card) */}
      <AnimatePresence>
        {popover && isSelected && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="absolute bottom-full left-1/2 z-50 mb-3 -translate-x-1/2 cursor-default select-text"
            onClick={(e) => e.stopPropagation()}
          >
            {popover}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Tooltip Bubble (Bouncy playful SVG bubble from VengeanceUI) */}
      <AnimatedTooltipBubble
        open={Boolean(shouldShowHint)}
        content={resolvedHintText}
        variant={tooltipVariant}
        scale={tooltipScale}
      />

      {/* Figma Selection Box */}
      {isSelected && (
        <motion.span
          layoutId="figma-selection-box"
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 28,
            bounce: 0.25,
          }}
          style={{ borderColor: color }}
          className="pointer-events-none absolute inset-0 z-30 border-[1.5px]"
        >
          {/* 4 Corner Resize Handles */}
          <span
            style={{ borderColor: color }}
            className="absolute -top-[4px] -left-[4px] size-2 border-[1.5px] bg-background shadow-xs"
          />
          <span
            style={{ borderColor: color }}
            className="absolute -top-[4px] -right-[4px] size-2 border-[1.5px] bg-background shadow-xs"
          />
          <span
            style={{ borderColor: color }}
            className="absolute -bottom-[4px] -left-[4px] size-2 border-[1.5px] bg-background shadow-xs"
          />
          <span
            style={{ borderColor: color }}
            className="absolute -right-[4px] -bottom-[4px] size-2 border-[1.5px] bg-background shadow-xs"
          />

          {/* Dimension Pill Badge with Link Indicator */}
          {showDimensions && (
            <motion.span
              initial={{ opacity: 0, scale: 0.85, y: -2 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -2 }}
              transition={{ duration: 0.15 }}
              style={{ backgroundColor: color }}
              className="absolute -bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-[4px] px-1.5 py-0.5 font-mono text-[10px] leading-tight font-semibold tracking-tight whitespace-nowrap text-white shadow-md select-none sm:text-[11px]"
            >
              <span>
                {dim.width} × {dim.height}
              </span>
              {scrollToId && (
                <span className="opacity-80" aria-hidden="true">
                  ↓
                </span>
              )}
              {href && (
                <span className="opacity-80" aria-hidden="true">
                  ↗
                </span>
              )}
            </motion.span>
          )}
        </motion.span>
      )}
    </span>
  )
}

// ============================================================================
// MAIN FIGMA TEXT HIGHLIGHT COMPONENT
// ============================================================================

export interface FigmaTextHighlightProps {
  className?: string
  color?: string
  showDimensions?: boolean
  children: React.ReactNode
}

export function FigmaTextHighlight({
  className,
  color = "#0D99FF",
  showDimensions = true,
  children,
}: FigmaTextHighlightProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const [pinnedKey, setPinnedKey] = useState<string | null>(null)

  const activeKey = hoveredKey || pinnedKey

  return (
    <FigmaHighlightContext.Provider
      value={{
        activeKey,
        setActiveKey: setHoveredKey,
        pinnedKey,
        setPinnedKey,
        color,
        showDimensions,
      }}
    >
      <div
        className={cn(
          "relative flex w-full flex-col bg-transparent select-none",
          className
        )}
      >
        {children}
      </div>
    </FigmaHighlightContext.Provider>
  )
}

export default FigmaTextHighlight
