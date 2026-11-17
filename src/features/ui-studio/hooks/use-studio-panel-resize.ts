import * as React from "react"

import { useStudioStore } from "../store/studio-store"

export const PANEL_DEFAULT_WIDTH = 460
export const PANEL_MIN_WIDTH = 360
export const PANEL_MAX_WIDTH = 840

function clampPanelWidth(width: number): number {
  if (typeof window === "undefined") return width
  const max = Math.min(window.innerWidth * 0.65, PANEL_MAX_WIDTH)
  return Math.round(Math.min(Math.max(width, PANEL_MIN_WIDTH), max))
}

/**
 * Drag-to-resize state lives in the studio store; this hook only owns the
 * pointer plumbing. Width is clamped to [360, min(65vw, 840)] and persisted
 * through the store's `persist` middleware (`ui-studio-prefs`).
 */
export function useStudioPanelResize() {
  const panelWidth = useStudioStore((state) => state.panelWidth)
  const isDragging = useStudioStore((state) => state.isDragging)
  const setPanelWidth = useStudioStore((state) => state.setPanelWidth)
  const setIsDragging = useStudioStore((state) => state.setIsDragging)
  const resetWidth = useStudioStore((state) => state.resetPanelWidth)

  const [startX, setStartX] = React.useState<number | null>(null)
  const [startWidth, setStartWidth] = React.useState(0)

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
      if (startX === null) return
      const next = clampPanelWidth(startWidth + (startX - event.clientX))
      setPanelWidth(next)
    }

    const handlePointerUp = () => {
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
  }, [isDragging, startX, startWidth, setIsDragging, setPanelWidth])

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault()
      setStartX(event.clientX)
      setStartWidth(useStudioStore.getState().panelWidth)
      setIsDragging(true)
    },
    [setIsDragging]
  )

  return { panelWidth, isDragging, handlePointerDown, resetWidth }
}
