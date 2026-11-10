import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

import { cn } from "@/shared/lib/utils"
import { InteractiveHint } from "@/shared/ui/system/interactive-hint"

// ============================================================================
// CONTEXT & TYPES
// ============================================================================

export interface ContainerLayoutContextValue {
  width: number
  isDragging: boolean
  activeSide: "left" | "right" | null
  resetWidth: () => void
  setWidth: (width: number) => void
  minWidth: number
  maxWidth: number
  defaultWidth: number
}

export const ContainerLayoutContext =
  createContext<ContainerLayoutContextValue | null>(null)

export function useContainerLayout() {
  const context = useContext(ContainerLayoutContext)
  if (!context) {
    throw new Error(
      "useContainerLayout must be used within a ContainerLayout component"
    )
  }
  return context
}

// ============================================================================
// RESIZE HANDLE ICON (Matching Reference Images 1 & 2: ← || →)
// ============================================================================

export function ResizeHandleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 14"
      className={cn("h-3.5 w-5 text-sky-400 drop-shadow-xs", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left Arrow */}
      <path
        d="M4.5 3.5L1.5 7L4.5 10.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right Arrow */}
      <path
        d="M19.5 3.5L22.5 7L19.5 10.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Two Center Divider Bars */}
      <line
        x1="10"
        y1="3"
        x2="10"
        y2="11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="3"
        x2="14"
        y2="11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ============================================================================
// RESIZE BORDER HANDLE COMPONENT (Left & Right Sides)
// ============================================================================

interface ResizeHandleProps {
  side: "left" | "right"
  onDragStart: (side: "left" | "right", e: React.PointerEvent) => void
  onDoubleClick: () => void
  isDragging: boolean
  activeSide: "left" | "right" | null
  activeColor?: string
}

function ResizeHandle({
  side,
  onDragStart,
  onDoubleClick,
  isDragging,
  activeSide,
  activeColor = "#0284c7",
}: ResizeHandleProps) {
  const isThisHandleActive = isDragging && activeSide === side

  return (
    <div
      role="separator"
      tabIndex={0}
      aria-orientation="vertical"
      aria-label={`Resize container from ${side} edge`}
      onPointerDown={(e) => onDragStart(side, e)}
      onDoubleClick={onDoubleClick}
      className={cn(
        "group absolute inset-y-0 z-30 flex cursor-col-resize items-center justify-center transition-all select-none",
        "w-6 touch-none",
        side === "left"
          ? "-left-3 hover:-left-3.5"
          : "-right-3 hover:-right-3.5"
      )}
      title="Drag to resize width (Double-click to reset)"
    >
      {/* 1. Vertical Border Line:
          - Default (idle): Normal subtle site border (bg-border)
          - Hover / Dragging: Highlights into bright cyan/sky blue with glow
      */}
      <div
        className={cn(
          "absolute inset-y-0 w-px transition-all duration-200",
          // Normal default border
          "bg-border",
          // Hover reveal
          "group-hover:bg-sky-500 group-hover:shadow-[0_0_8px_rgba(56,189,248,0.65)]",
          // Active dragging
          isThisHandleActive &&
            "bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]"
        )}
        style={
          isThisHandleActive
            ? { backgroundColor: activeColor || "#38bdf8" }
            : undefined
        }
      />

      {/* 2. Centered Handle Group: Resize Icon + Pill Capsule
          - Default (idle): Completely hidden (opacity-0, scale-90, pointer-events-none)
          - Hover / Dragging: Smoothly pops into view (opacity-100, scale-100)
      */}
      <div
        className={cn(
          "relative flex flex-col items-center gap-1.5 transition-all duration-200 ease-out",
          // Hidden by default:
          "pointer-events-none scale-90 opacity-0",
          // Revealed on hover or when dragging:
          "group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100",
          isThisHandleActive && "pointer-events-auto scale-105 opacity-100"
        )}
      >
        {/* Floating Arrow Cursor Badge (Image 1) */}
        <div
          className={cn(
            "flex items-center justify-center rounded-[5px] border border-sky-500/60 bg-background/95 px-1 py-0.5 shadow-md backdrop-blur-xs transition-all",
            isThisHandleActive
              ? "scale-110 border-sky-300 opacity-100 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
              : "opacity-85 group-hover:opacity-100"
          )}
        >
          <ResizeHandleIcon />
        </div>

        {/* Pill Capsule Handle (Image 1 & 2) */}
        <div
          className={cn(
            "relative flex h-9 w-2.5 items-center justify-center rounded-full border-2 bg-background shadow-sm transition-all",
            isThisHandleActive
              ? "scale-115 border-white shadow-[0_0_16px_rgba(56,189,248,0.9)]"
              : "border-sky-500 group-hover:scale-110 group-hover:border-sky-400 group-hover:shadow-[0_0_12px_rgba(56,189,248,0.6)]"
          )}
        >
          {/* Inner subtle core accent */}
          <span
            className={cn(
              "h-2.5 w-0.5 rounded-full transition-colors",
              isThisHandleActive ? "bg-white" : "bg-sky-400/80"
            )}
          />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN CONTAINER LAYOUT COMPONENT
// ============================================================================

export interface ContainerLayoutProps {
  children?: React.ReactNode
  className?: string
  contentClassName?: string
  /** Default width in pixels (e.g. 1280). If omitted, defaults to 1280. */
  defaultWidth?: number
  /** Minimum width in pixels before clamping (default: 380) */
  minWidth?: number
  /** Maximum width in pixels before clamping (default: 1680) */
  maxWidth?: number
  /** Enable/disable interactive bilateral resizing (default: true) */
  resizable?: boolean
  /** Whether resizing from one side symmetrically scales both sides (default: true) */
  symmetric?: boolean
  /** Show floating dimension badge during hover/drag (default: true) */
  showDimensions?: boolean
  /** Active line accent color on hover/drag (default: #0284c7) */
  activeColor?: string
  /** Optional interactive hint text pointing to handle (e.g. "drag to resize!" or "kéo tôi đi!") */
  hintText?: string
  /** Whether to show the hint (defaults to true if hintText is provided) */
  showHint?: boolean
  /** Optional localStorage key to remember resized width across refreshes */
  storageKey?: string
  /** Callback triggered when width changes */
  onWidthChange?: (width: number) => void
}

export function ContainerLayout({
  children,
  className,
  contentClassName,
  defaultWidth = 1280,
  minWidth = 380,
  maxWidth = 1680,
  resizable = true,
  symmetric = true,
  showDimensions = true,
  activeColor = "#0284c7",
  hintText,
  showHint = true,
  storageKey,
  onWidthChange,
}: ContainerLayoutProps) {
  // Initialize width from localStorage if key provided, otherwise defaultWidth
  const [width, setWidthState] = useState<number>(() => {
    if (typeof window !== "undefined" && storageKey) {
      try {
        const saved = localStorage.getItem(storageKey)
        if (saved) {
          const parsed = Number(saved)
          if (!isNaN(parsed) && parsed >= minWidth && parsed <= maxWidth) {
            return parsed
          }
        }
      } catch {
        // Ignore localStorage error
      }
    }
    return defaultWidth
  })

  const [isDragging, setIsDragging] = useState(false)
  const [activeSide, setActiveSide] = useState<"left" | "right" | null>(null)
  const [isAnimateReset, setIsAnimateReset] = useState(false)
  const [isHoveringHandle, setIsHoveringHandle] = useState(false)
  const [hintDismissed, setHintDismissed] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{
    startX: number
    startWidth: number
    side: "left" | "right"
  } | null>(null)

  // Clamp helper
  const clampWidth = useCallback(
    (val: number) => {
      const maxWindowWidth =
        typeof window !== "undefined"
          ? Math.max(minWidth, window.innerWidth - 32)
          : maxWidth
      const effectiveMax = Math.min(maxWidth, maxWindowWidth)
      return Math.min(effectiveMax, Math.max(minWidth, Math.round(val)))
    },
    [minWidth, maxWidth]
  )

  const updateWidth = useCallback(
    (newWidth: number) => {
      const clamped = clampWidth(newWidth)
      setWidthState(clamped)
      onWidthChange?.(clamped)

      if (typeof window !== "undefined" && storageKey) {
        try {
          localStorage.setItem(storageKey, String(clamped))
        } catch {
          // Ignore storage quota
        }
      }
    },
    [clampWidth, onWidthChange, storageKey]
  )

  // Reset to default width with smooth transition
  const resetWidth = useCallback(() => {
    setIsAnimateReset(true)
    updateWidth(defaultWidth)
    setTimeout(() => setIsAnimateReset(false), 350)
  }, [defaultWidth, updateWidth])

  // Drag interaction handler
  const handleDragStart = useCallback(
    (side: "left" | "right", e: React.PointerEvent) => {
      if (!resizable) return
      e.preventDefault()

      dragStartRef.current = {
        startX: e.clientX,
        startWidth: width,
        side,
      }

      setIsDragging(true)
      setActiveSide(side)

      if (containerRef.current) {
        containerRef.current.setPointerCapture(e.pointerId)
      }
    },
    [resizable, width]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !dragStartRef.current) return
      e.preventDefault()

      const { startX, startWidth, side } = dragStartRef.current
      const deltaX = e.clientX - startX

      let newWidth: number

      if (symmetric) {
        // Symmetrical: dragging either handle expands/contracts both sides equally
        const multiplier = side === "right" ? 2 : -2
        newWidth = startWidth + deltaX * multiplier
      } else {
        const multiplier = side === "right" ? 1 : -1
        newWidth = startWidth + deltaX * multiplier
      }

      updateWidth(newWidth)
    },
    [isDragging, symmetric, updateWidth]
  )

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (
      containerRef.current &&
      containerRef.current.hasPointerCapture(e.pointerId)
    ) {
      containerRef.current.releasePointerCapture(e.pointerId)
    }
    setIsDragging(false)
    setActiveSide(null)
    dragStartRef.current = null
  }, [])

  // Lock body cursor while dragging
  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    } else {
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
    return () => {
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isDragging])

  // Ensure width adapts gracefully if window shrinks below current width
  useEffect(() => {
    const handleWindowResize = () => {
      setWidthState((prev) => clampWidth(prev))
    }
    window.addEventListener("resize", handleWindowResize)
    return () => window.removeEventListener("resize", handleWindowResize)
  }, [clampWidth])

  return (
    <ContainerLayoutContext.Provider
      value={{
        width,
        isDragging,
        activeSide,
        resetWidth,
        setWidth: updateWidth,
        minWidth,
        maxWidth,
        defaultWidth,
      }}
    >
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn(
          "relative flex min-h-screen w-full flex-col items-center justify-start overflow-x-clip bg-background text-foreground",
          className
        )}
      >
        {/* Dynamic Centered Resizable Container */}
        <div
          style={{ width: `${width}px` }}
          className={cn(
            "relative mx-auto flex min-h-screen w-full max-w-full flex-col",
            isAnimateReset && "transition-[width] duration-300 ease-out",
            contentClassName
          )}
        >
          {/* Left Resize Handle */}
          {resizable && (
            <div
              onMouseEnter={() => setIsHoveringHandle(true)}
              onMouseLeave={() => setIsHoveringHandle(false)}
            >
              <ResizeHandle
                side="left"
                onDragStart={handleDragStart}
                onDoubleClick={resetWidth}
                isDragging={isDragging}
                activeSide={activeSide}
                activeColor={activeColor}
              />
            </div>
          )}

          {/* Right Resize Handle */}
          {resizable && (
            <div
              onMouseEnter={() => setIsHoveringHandle(true)}
              onMouseLeave={() => setIsHoveringHandle(false)}
            >
              <ResizeHandle
                side="right"
                onDragStart={handleDragStart}
                onDoubleClick={resetWidth}
                isDragging={isDragging}
                activeSide={activeSide}
                activeColor={activeColor}
              />
            </div>
          )}

          {/* Interactive Hint pointing to handle:
              - Automatically hides while dragging (visible={!isDragging})
              - Smoothly reappears as soon as drag is released!
          */}
          {resizable && hintText && showHint && !hintDismissed && (
            <div className="pointer-events-auto absolute top-1/2 -left-44 z-40 hidden -translate-y-8 lg:block">
              <InteractiveHint
                text={hintText}
                arrowSide="right"
                direction="up-right"
                visible={!isDragging}
                dismissOnClick={true}
                onClick={() => setHintDismissed(true)}
              />
            </div>
          )}

          {/* Floating Dimension & Reset Badge (Active during drag or hover) */}
          {resizable && showDimensions && (
            <div
              className={cn(
                "pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-200",
                isDragging || isHoveringHandle
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-3 opacity-0"
              )}
            >
              <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-primary/40 bg-background/90 px-3 py-1 font-mono text-xs text-primary shadow-lg backdrop-blur-md">
                <span className="font-semibold">{width} px</span>
              </div>
            </div>
          )}

          {/* Container Content */}
          <div className="flex w-full flex-1 flex-col">{children}</div>
        </div>
      </div>
    </ContainerLayoutContext.Provider>
  )
}

export default ContainerLayout
