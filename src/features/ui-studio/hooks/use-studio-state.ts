/* eslint-disable react-hooks/set-state-in-effect */
import * as React from "react"

const SIDEBAR_STORAGE_KEY = "ui-studio-sidebar-open"
const DESKTOP_SIDEBAR_QUERY = "(min-width: 1024px)"

function readStoredSidebarOpen(): boolean | null {
  try {
    const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)
    if (stored === "true") return true
    if (stored === "false") return false
    return null
  } catch {
    // localStorage may be unavailable (private mode, disabled storage)
    return null
  }
}

function persistSidebarOpen(open: boolean): void {
  try {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open))
  } catch {
    // Ignore write failures — in-memory state still works for the session
  }
}

export type StudioPanel = "docs" | "code"
export type StudioPanelState = "closed" | StudioPanel

export interface UseStudioStateOptions {
  /** Id of the currently selected item — state resets when it changes. */
  activeItemId: string | null
}

export interface UseStudioStateReturn {
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  panel: StudioPanelState
  setPanel: (panel: StudioPanelState) => void
  toggleDocs: () => void
  toggleCode: () => void
  variantId?: string
  setVariantId: (variantId: string | null) => void
  customizerValues: Record<string, string | number | boolean>
  setCustomizerValue: (key: string, value: string | number | boolean) => void
  resetCustomizer: () => void
}

/**
 * Pure local studio state: sidebar, right panel, variant and customizer.
 * URL purity rule — nothing here is mirrored into the address bar; the route
 * path itself is the shared state (/ui, /ui/$collection, /ui/$collection/$slug).
 */
export function useStudioState({
  activeItemId,
}: UseStudioStateOptions): UseStudioStateReturn {
  // Initial value must match the server render; the stored/preferred value
  // is resolved after mount to avoid hydration mismatch.
  const [isSidebarOpen, setSidebarOpenState] = React.useState(true)
  const [panel, setPanel] = React.useState<StudioPanelState>("closed")
  const [variantId, setVariantIdState] = React.useState<string | undefined>()
  const [customizerValues, setCustomizerValues] = React.useState<
    Record<string, string | number | boolean>
  >({})

  // Resolve the real sidebar state after mount: the stored preference wins;
  // otherwise default open on desktop (>= 1024px), closed on smaller screens.
  React.useEffect(() => {
    const stored = readStoredSidebarOpen()
    if (stored !== null) {
      setSidebarOpenState(stored)
      return
    }
    if (typeof window !== "undefined") {
      setSidebarOpenState(window.matchMedia(DESKTOP_SIDEBAR_QUERY).matches)
    }
  }, [])

  // Reset variant + customizer whenever the selected item changes
  React.useEffect(() => {
    setPanel("closed")
    setVariantIdState(undefined)
    setCustomizerValues({})
  }, [activeItemId])

  const setSidebarOpen = React.useCallback((open: boolean) => {
    setSidebarOpenState(open)
    persistSidebarOpen(open)
  }, [])

  const toggleSidebar = React.useCallback(() => {
    setSidebarOpenState((open) => {
      const next = !open
      persistSidebarOpen(next)
      return next
    })
  }, [])

  const toggleDocs = React.useCallback(() => {
    setPanel((current) => (current === "docs" ? "closed" : "docs"))
  }, [])

  const toggleCode = React.useCallback(() => {
    setPanel((current) => (current === "code" ? "closed" : "code"))
  }, [])

  const setVariantId = React.useCallback((variant: string | null) => {
    setVariantIdState(variant ?? undefined)
  }, [])

  const setCustomizerValue = React.useCallback(
    (key: string, value: string | number | boolean) => {
      setCustomizerValues((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const resetCustomizer = React.useCallback(() => {
    setCustomizerValues({})
  }, [])

  return {
    isSidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    panel,
    setPanel,
    toggleDocs,
    toggleCode,
    variantId,
    setVariantId,
    customizerValues,
    setCustomizerValue,
    resetCustomizer,
  }
}
