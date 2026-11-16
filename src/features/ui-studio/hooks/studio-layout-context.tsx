import * as React from "react"

import type { StudioControlValue, StudioItem } from "../model/types"
import type { StudioItemRecord } from "../model/unified-registry.adapter"
import type { StudioPanelState } from "./use-studio-state"

/**
 * Shared layout state for the studio shell: which item (if any) is staged,
 * plus the local UI state (sidebar / panel / variant / customizer).
 * Provided once per `/ui` render by the layout route — leaf components read
 * it through `useStudioLayout()` instead of threading props through pages.
 */
export interface StudioLayoutContextValue {
  /** Resolved route segment (e.g. "base", "interactive") — null on `/ui`. */
  segment: string | null
  /** Resolved detail record — null when no item is staged. */
  record: StudioItemRecord | null
  activeItem: StudioItem | null
  activeVariantId?: string
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  panel: StudioPanelState
  setPanel: (panel: StudioPanelState) => void
  toggleDocs: () => void
  toggleCode: () => void
  closePanel: () => void
  variantId?: string
  setVariantId: (variantId: string | null) => void
  customizerValues: Record<string, StudioControlValue>
  setCustomizerValue: (key: string, value: StudioControlValue) => void
  resetCustomizer: () => void
}

const StudioLayoutContext =
  React.createContext<StudioLayoutContextValue | null>(null)

export const StudioLayoutProvider = StudioLayoutContext.Provider

export function useStudioLayout(): StudioLayoutContextValue {
  const context = React.useContext(StudioLayoutContext)
  if (!context) {
    throw new Error("useStudioLayout must be used within <StudioShell />")
  }
  return context
}
