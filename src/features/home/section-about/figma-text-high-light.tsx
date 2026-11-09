import { useNavigate } from "@tanstack/react-router"
import { Code2, Sparkles } from "lucide-react"
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

// ============================================================================
// CONTEXT FOR HIGHLIGHT STATE
// ============================================================================

interface FigmaHighlightContextType {
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

export function HandDrawnCurlyArrow({ className }: { className?: string }) {
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
// INLINE AVATAR & TECH BADGES
// ============================================================================

export function PhongAvatar({
  src = "/avatar-about.jpg",
  alt = "Phong Phan",
  scrollToId = "about",
  className,
}: {
  src?: string
  alt?: string
  scrollToId?: string
  className?: string
}) {
  const [imageError, setImageError] = useState(false)

  const handleClick = () => {
    if (scrollToId) {
      document
        .getElementById(scrollToId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleClick()
        }
      }}
      title="Scroll to About"
      className={cn(
        "relative mx-1.5 inline-flex size-7 shrink-0 -translate-y-0.5 cursor-pointer items-center justify-center overflow-hidden rounded-full align-middle shadow-sm ring-2 ring-primary/40 transition-transform select-none hover:scale-110 sm:size-8 md:size-9",
        className
      )}
    >
      {!imageError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="size-full object-cover"
        />
      ) : (
        <span className="flex size-full items-center justify-center bg-primary font-mono text-xs font-bold text-primary-foreground">
          PP
        </span>
      )}
    </span>
  )
}

export function CodeBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "mx-1.5 inline-flex size-6 shrink-0 -translate-y-0.5 items-center justify-center rounded-lg border border-border/60 bg-muted/60 align-middle shadow-xs select-none sm:size-7 md:size-8",
        className
      )}
    >
      <Code2 className="size-3.5 text-primary sm:size-4" />
    </span>
  )
}

export function DesignBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "mx-1.5 inline-flex size-6 shrink-0 -translate-y-0.5 items-center justify-center rounded-lg border border-border/60 bg-muted/60 align-middle shadow-xs select-none sm:size-7 md:size-8",
        className
      )}
    >
      <Sparkles className="size-3.5 text-amber-500 sm:size-4" />
    </span>
  )
}

// ============================================================================
// INDIVIDUAL INTERACTIVE HIGHLIGHT WORD WITH ACTIONS
// ============================================================================

export interface HighlightWordProps {
  id: string
  text: string
  suffix?: string
  className?: string
  href?: string
  scrollToId?: string
  onClick?: (e: React.MouseEvent) => void
}

export function HighlightWord({
  id,
  text,
  suffix = "",
  className,
  href,
  scrollToId,
  onClick,
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

  // Measure once on mount and on window resize
  useEffect(() => {
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [measure])

  // When this word becomes selected, measure again to ensure exact dimensions
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

  return (
    <span
      ref={spanRef}
      role={href ? "link" : "button"}
      tabIndex={0}
      onMouseEnter={handleActivate}
      onMouseLeave={() => {
        if (!pinnedKey) setActiveKey(null)
      }}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleClick(e as unknown as React.MouseEvent)
        }
      }}
      title={
        scrollToId
          ? `Scroll to #${scrollToId}`
          : href
            ? `Navigate to ${href}`
            : undefined
      }
      className={cn(
        "group relative -mx-0.5 inline-block cursor-pointer px-1.5 py-0.5 font-medium transition-colors select-none focus:outline-hidden",
        className
      )}
    >
      <span className="relative z-10 text-foreground transition-colors group-hover:text-primary">
        {text}
      </span>
      {suffix && (
        <span className="font-normal text-muted-foreground/80">{suffix}</span>
      )}

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
          {/* 4 Figma Corner Handles */}
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
  showHint?: boolean
  hintText?: string
  children?: React.ReactNode
}

export function FigmaTextHighlight({
  className,
  color = "#0D99FF",
  showDimensions = true,
  showHint = true,
  hintText = "hover here",
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
          "relative flex w-full flex-col items-center justify-center bg-transparent text-center select-none",
          className
        )}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&display=swap');
          .font-handwriting {
            font-family: 'Caveat', cursive, sans-serif;
          }
        `}</style>

        {children ? (
          children
        ) : (
          <div className="relative mx-auto w-full max-w-4xl px-2">
            <h2 className="font-sans text-base leading-relaxed font-medium tracking-tight text-balance text-muted-foreground/90 sm:text-lg md:text-xl lg:text-[23px] lg:leading-[1.6]">
              <span>Hi, I&apos;m </span>
              <PhongAvatar />
              <span className="relative inline-block">
                {/* Hand-drawn Annotation pointing to the name */}
                <AnimatePresence>
                  {!activeKey && showHint && (
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: 3,
                        transition: { duration: 0.15 },
                      }}
                      transition={{ duration: 0.25 }}
                      className="pointer-events-none absolute -top-10 left-1/2 z-30 flex -translate-x-3/4 items-end select-none sm:-top-11 sm:-translate-x-2/3"
                    >
                      <HandDrawnCurlyArrow className="h-6 w-11 text-muted-foreground/75 sm:h-7 sm:w-12" />
                      <span className="font-handwriting -mb-1 ml-1 -rotate-6 text-base font-medium tracking-wide whitespace-nowrap text-muted-foreground sm:text-lg">
                        {hintText}
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
                <HighlightWord id="first" text="Phong" scrollToId="about" />
              </span>
              <span> </span>
              <HighlightWord id="last" text="Phan" scrollToId="about" />
              <span>. Reimagining how </span>
              <CodeBadge />
              <HighlightWord
                id="primitives"
                text="UI Primitives"
                href="/component-ui"
              />
              <span> ship — clean components, smooth motion, and </span>
              <DesignBadge />
              <HighlightWord id="interfaces" text="Interfaces" href="/blocks" />
              <span> that feel built, not assembled. 100% free &amp; </span>
              <HighlightWord
                id="opensource"
                text="Open Source"
                href="/component-ui"
              />
              <span>.</span>
            </h2>
          </div>
        )}
      </div>
    </FigmaHighlightContext.Provider>
  )
}

export default FigmaTextHighlight
