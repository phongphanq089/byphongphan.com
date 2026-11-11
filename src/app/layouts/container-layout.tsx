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
// CAD DIMENSION RULERS (Blueprint measurement annotations)
// ============================================================================

/** Zero-padded technical readout notation (e.g. 1280 -> "1280", 160 -> "0160") */
function padDimension(value: number) {
  return String(Math.max(0, Math.round(value))).padStart(4, "0")
}

/** Open triangular arrow (outline chevron, matching CAD drawing style) */
function OpenArrow({
  direction,
  className,
}: {
  direction: "up" | "down" | "left" | "right"
  className?: string
}) {
  const rotate = { up: 0, right: 90, down: 180, left: 270 }[direction]
  return (
    <svg
      viewBox="0 0 16 10"
      className={cn("size-3 shrink-0 text-sky-400", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 8L8 2L14 8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CadVerticalRuler({
  side,
  value,
  active,
}: {
  side: "left" | "right"
  /** Zero-padded readout shown in the lower-corner badge (container width) */
  value: number
  active: boolean
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-y-0 z-20 hidden w-px lg:block",
        side === "left" ? "-left-6" : "-right-6"
      )}
    >
      {/* Continuous technical dimension line */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-px transition-all duration-200",
          active
            ? "bg-sky-500/60 shadow-[0_0_8px_rgba(56,189,248,0.5)]"
            : "bg-border"
        )}
      />

      {/* Top cap: T-stop bar + open arrow */}
      <div className="absolute top-0 left-0 flex -translate-x-1/2 flex-col items-center gap-1">
        <span
          className={cn(
            "h-[2px] w-4 rounded-full transition-colors duration-200",
            active ? "bg-sky-500/70" : "bg-border"
          )}
        />
        <OpenArrow
          direction="up"
          className={cn(
            "transition-colors duration-200",
            active ? "text-sky-400" : "text-muted-foreground/50"
          )}
        />
      </div>

      {/* Bottom cap: open arrow + T-stop bar */}
      <div className="absolute bottom-0 left-0 flex -translate-x-1/2 flex-col items-center gap-1">
        <OpenArrow
          direction="down"
          className={cn(
            "transition-colors duration-200",
            active ? "text-sky-400" : "text-muted-foreground/50"
          )}
        />
        <span
          className={cn(
            "h-[2px] w-4 rounded-full transition-colors duration-200",
            active ? "bg-sky-500/70" : "bg-border"
          )}
        />
      </div>

      {/* Sticky viewport-following track: keeps the readout pinned at viewport center as you scroll */}
      <div className="pointer-events-none sticky top-1/2 flex -translate-y-1/2 flex-col items-center">
        {/* Lower-corner readout: placed strictly on the OUTSIDE of the ruler line and offset below center */}
        <div
          className={cn(
            "absolute top-7 font-mono text-[9px] tracking-[0.2em] whitespace-nowrap transition-all duration-200",
            // Strictly on the OUTSIDE of the vertical ruler line:
            side === "left" ? "right-full mr-3" : "left-full ml-3",
            active
              ? "border border-sky-400 bg-background/95 px-1.5 py-0.5 text-sky-400 opacity-100 shadow-[0_0_8px_rgba(56,189,248,0.3)] backdrop-blur-xs"
              : "border border-border/60 bg-background/95 px-1.5 py-0.5 text-muted-foreground/60 opacity-60 backdrop-blur-xs"
          )}
        >
          Ø {padDimension(value)}
        </div>
      </div>
    </div>
  )
}

function CadHorizontalRuler({
  marginPx,
  active,
}: {
  /** Distance from the nearest viewport edge to the container border */
  marginPx: number
  active: boolean
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none flex h-full w-full items-center gap-1"
    >
      <span
        className={cn(
          "h-3.5 w-[2px] shrink-0 rounded-full transition-colors duration-200",
          active ? "bg-sky-500/70" : "bg-border/70"
        )}
      />
      <OpenArrow
        direction="left"
        className={cn(
          "transition-colors duration-200",
          active ? "text-sky-400" : "text-muted-foreground/50"
        )}
      />
      <span
        className={cn(
          "h-px min-w-2 flex-1 transition-all duration-200",
          active
            ? "bg-sky-500/50 shadow-[0_0_6px_rgba(56,189,248,0.4)]"
            : "bg-border/60"
        )}
      />
      <span
        className={cn(
          "shrink-0 border bg-background/90 px-1 py-0.5 font-mono text-[9px] tracking-[0.15em] whitespace-nowrap backdrop-blur-xs transition-all duration-200",
          active
            ? "border-sky-400 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.35)]"
            : "border-border/60 text-muted-foreground/60"
        )}
      >
        Ø {padDimension(marginPx)}
      </span>
      <span
        className={cn(
          "h-px min-w-2 flex-1 transition-all duration-200",
          active
            ? "bg-sky-500/50 shadow-[0_0_6px_rgba(56,189,248,0.4)]"
            : "bg-border/60"
        )}
      />
      <OpenArrow
        direction="right"
        className={cn(
          "transition-colors duration-200",
          active ? "text-sky-400" : "text-muted-foreground/50"
        )}
      />
      <span
        className={cn(
          "h-3.5 w-[2px] shrink-0 rounded-full transition-colors duration-200",
          active ? "bg-sky-500/70" : "bg-border/70"
        )}
      />
    </div>
  )
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
        "group absolute inset-y-0 z-30 w-6 cursor-col-resize touch-none transition-all select-none",
        side === "left"
          ? "-left-3 hover:-left-3.5"
          : "-right-3 hover:-right-3.5"
      )}
    >
      {/* 1. Vertical Border Line:
          - Default (idle): Normal subtle site border (bg-border)
          - Hover / Dragging: Highlights into bright cyan/sky blue with glow
      */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 transition-all duration-200",
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

      {/* Sticky track: pins the handle group at the vertical center of the viewport while scrolling */}
      <div className="sticky top-1/2 flex -translate-y-1/2 items-center justify-center">
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
  /** Active line accent color on hover/drag (default: #0284c7) */
  activeColor?: string
  /** Optional interactive hint text for the top-left hint (default: "pull the cord!") */
  leftHintText?: string
  /** Optional interactive hint text for the bottom-right hint (default: "drag to resize!") */
  rightHintText?: string
  /** Whether to show the hints (default: true) */
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
  activeColor = "#0284c7",
  leftHintText = "pull the cord!",
  rightHintText = "drag to resize!",
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
  const [leftHintDismissed, setLeftHintDismissed] = useState(false)
  const [rightHintDismissed, setRightHintDismissed] = useState(false)
  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440
  )

  // Gate all resizing affordances: below defaultWidth the layout is fluid 100%
  const isScreenSmall = windowWidth <= defaultWidth
  const canResize = resizable && !isScreenSmall
  // Distance from viewport edge to container border (symmetric resizing)
  const margin = Math.max(0, Math.floor((windowWidth - width) / 2))
  // CAD rulers/handles share this highlight state; subtle when idle
  const rulerActive = isDragging || isHoveringHandle

  const containerRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{
    startX: number
    startWidth: number
    side: "left" | "right"
  } | null>(null)
  const lastPointerDownRef = useRef<{
    time: number
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
      if (!canResize) return
      e.preventDefault()

      // Timestamp-based double-click detection: onPointerDown calls preventDefault
      // (blocking native dblclick), so reset is detected within the handler itself.
      const now = Date.now()
      const prev = lastPointerDownRef.current

      if (prev && prev.side === side && now - prev.time < 350) {
        lastPointerDownRef.current = null
        resetWidth()
        return
      }

      lastPointerDownRef.current = { time: now, side }

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
    [canResize, width, resetWidth]
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
      setWindowWidth(window.innerWidth)
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
          style={canResize ? { width: `${width}px` } : undefined}
          className={cn(
            "@container relative mx-auto flex min-h-screen w-full max-w-full flex-col",
            isAnimateReset && "transition-[width] duration-300 ease-out",
            contentClassName
          )}
        >
          {/* CAD vertical dimension rulers (full-height, strictly outside the outer edges) */}
          {canResize && (
            <>
              <CadVerticalRuler
                side="left"
                value={width}
                active={rulerActive}
              />
              <CadVerticalRuler
                side="right"
                value={width}
                active={rulerActive}
              />
            </>
          )}

          {/* CAD horizontal margin rulers (sticky at viewport center) */}
          {canResize && margin >= 60 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-full z-20 hidden lg:block"
              style={{ width: `${margin}px` }}
            >
              <div className="sticky top-1/2 flex w-full -translate-y-1/2 items-center px-2">
                <CadHorizontalRuler marginPx={margin} active={rulerActive} />
              </div>
            </div>
          )}
          {canResize && margin >= 60 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-full z-20 hidden lg:block"
              style={{ width: `${margin}px` }}
            >
              <div className="sticky top-1/2 flex w-full -translate-y-1/2 items-center px-2">
                <CadHorizontalRuler marginPx={margin} active={rulerActive} />
              </div>
            </div>
          )}

          {/* Left Resize Handle */}
          {canResize && (
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
          {canResize && (
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

          {/* Top-left hint: points down-right toward the left handle */}
          {canResize && showHint && !leftHintDismissed && (
            <div className="pointer-events-none absolute inset-y-0 -left-52 z-40 hidden pt-20 xl:block">
              <div className="pointer-events-auto sticky top-1/3 -translate-y-1/2">
                <InteractiveHint
                  text={leftHintText}
                  arrowSide="right"
                  direction="down-right"
                  visible={!isDragging}
                  dismissOnClick={true}
                  onClick={() => setLeftHintDismissed(true)}
                />
              </div>
            </div>
          )}

          {/* Bottom-right hint: points up-left toward the right handle */}
          {canResize && showHint && !rightHintDismissed && (
            <div className="pointer-events-none absolute inset-y-0 -right-52 z-40 hidden pt-20 xl:block">
              <div className="pointer-events-auto sticky top-2/3 -translate-y-1/2">
                <InteractiveHint
                  text={rightHintText}
                  arrowSide="left"
                  direction="up-left"
                  visible={!isDragging}
                  dismissOnClick={true}
                  onClick={() => setRightHintDismissed(true)}
                />
              </div>
            </div>
          )}

          {/* Container Content */}
          <div className="flex w-full flex-1 flex-col">{children}</div>
        </div>

        {/* Fixed floating dimension badge: real-time width readout during resize/hover */}
        {canResize && (
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-200",
              isDragging || isHoveringHandle
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            )}
          >
            <div className="flex items-center gap-2 rounded-full border border-sky-500/40 bg-background/95 px-3.5 py-1.5 font-mono text-xs text-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.25)] backdrop-blur-md">
              <span className="font-semibold tracking-wider whitespace-nowrap">
                Width: {Math.round(width)}px
              </span>
              <span className="opacity-30">|</span>
              <span className="text-[11px] whitespace-nowrap text-muted-foreground">
                Double-click handle to reset
              </span>
            </div>
          </div>
        )}
      </div>
    </ContainerLayoutContext.Provider>
  )
}

export default ContainerLayout
