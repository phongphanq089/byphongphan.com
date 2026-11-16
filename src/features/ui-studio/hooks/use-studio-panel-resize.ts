/* eslint-disable react-hooks/set-state-in-effect */
import * as React from "react"

const STORAGE_KEY = "byphongphan:studio-panel-width"
export const PANEL_DEFAULT_WIDTH = 460
export const PANEL_MIN_WIDTH = 360
export const PANEL_MAX_WIDTH = 840

function clampPanelWidth(width: number): number {
  const max =
    typeof window === "undefined"
      ? PANEL_MAX_WIDTH
      : Math.min(window.innerWidth * 0.65, PANEL_MAX_WIDTH)
  return Math.round(Math.min(Math.max(width, PANEL_MIN_WIDTH), max))
}

function readStoredWidth(): number | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = Number(raw)
    if (!Number.isFinite(parsed)) return null
    return clampPanelWidth(parsed)
  } catch {
    return null
  }
}

function persistWidth(width: number): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(width))
  } catch {
    // Storage unavailable (private mode); width still works for the session
  }
}

/**
 * Drag-to-resize state for the docked studio panel. Width is clamped to
 * [360, min(65vw, 840)] and persisted to localStorage under
 * `byphongphan:studio-panel-width`. SSR-safe: renders the 460px default
 * until mounted, then the stored preference is applied.
 */
export function useStudioPanelResize() {
  const [panelWidth, setPanelWidth] = React.useState(PANEL_DEFAULT_WIDTH)
  const [isDragging, setIsDragging] = React.useState(false)
  const dragStateRef = React.useRef<{
    startX: number
    startWidth: number
  } | null>(null)

  // Resolve the persisted width after mount to avoid hydration mismatch
  React.useEffect(() => {
    const stored = readStoredWidth()
    if (stored !== null) setPanelWidth(stored)
  }, [])

  // Disable text selection on the whole page while dragging
  React.useEffect(() => {
    if (!isDragging) return
    const previous = document.body.style.userSelect
    document.body.style.userSelect = "none"
    return () => {
      document.body.style.userSelect = previous
    }
  }, [isDragging])

  React.useEffect(() => {
    if (!isDragging) return

    const handlePointerMove = (event: PointerEvent) => {
      const state = dragStateRef.current
      if (!state) return
      const next = clampPanelWidth(
        state.startWidth + (state.startX - event.clientX)
      )
      setPanelWidth(next)
      persistWidth(next)
    }

    const handlePointerUp = () => {
      dragStateRef.current = null
      setIsDragging(false)
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)
    window.addEventListener("pointercancel", handlePointerUp)
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
      window.removeEventListener("pointercancel", handlePointerUp)
    }
  }, [isDragging])

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault()
      dragStateRef.current = {
        startX: event.clientX,
        startWidth: panelWidth,
      }
      setIsDragging(true)
    },
    [panelWidth]
  )

  const resetWidth = React.useCallback(() => {
    setPanelWidth(PANEL_DEFAULT_WIDTH)
    persistWidth(PANEL_DEFAULT_WIDTH)
  }, [])

  return { panelWidth, isDragging, handlePointerDown, resetWidth }
}
