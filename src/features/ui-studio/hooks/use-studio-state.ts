/* eslint-disable react-hooks/set-state-in-effect */
import * as React from "react"

import type {
  StudioCollectionId,
  StudioControlValue,
  StudioItem,
} from "../model/types"
import {
  getItemsByCollection,
  getRecordByItem,
  type StudioItemRecord,
} from "../model/unified-registry.adapter"
import { useStudioUrlSync } from "./use-studio-url-sync"

export interface UseStudioStateReturn {
  // URL-derived (shareable)
  collection: StudioCollectionId
  items: StudioItem[]
  record?: StudioItemRecord
  activeItem: StudioItem | null
  activeVariantId?: string
  panel: "closed" | "docs" | "code"
  isDetail: boolean
  // Local UI state (ephemeral)
  isSidebarOpen: boolean
  customizerValues: Record<string, StudioControlValue>
  // Actions
  selectCollection: (collection: StudioCollectionId) => void
  selectItem: (itemId: string | null) => void
  selectVariant: (variantId: string | null) => void
  setPanel: (panel: "closed" | "docs" | "code") => void
  toggleSidebar: () => void
  setCustomizerValue: (key: string, value: StudioControlValue) => void
  resetCustomizer: () => void
}

function resolveCustomizerDefaults(
  record: StudioItemRecord | undefined
): Record<string, StudioControlValue> {
  const values: Record<string, StudioControlValue> = {}
  for (const control of record?.item.controls ?? []) {
    values[control.key] = control.default
  }
  return values
}

/**
 * Studio state orchestrator: URL-derived selection (collection / item /
 * variant / panel) plus ephemeral UI state (sidebar, customizer).
 * Customizer values reset whenever the selected item changes.
 */
export function useStudioState(): UseStudioStateReturn {
  const url = useStudioUrlSync()
  const [isSidebarOpen, setSidebarOpen] = React.useState(true)

  const record = React.useMemo(() => getRecordByItem(url.itemId), [url.itemId])
  const activeItem = record?.item ?? null
  const items = React.useMemo(
    () => getItemsByCollection(url.collection),
    [url.collection]
  )

  const [customizerValues, setCustomizerValues] = React.useState<
    Record<string, StudioControlValue>
  >(() => resolveCustomizerDefaults(record))

  // Reset customizer values whenever the selected item changes
  React.useEffect(() => {
    setCustomizerValues(resolveCustomizerDefaults(record))
  }, [record])

  const toggleSidebar = React.useCallback(() => setSidebarOpen((v) => !v), [])

  const setCustomizerValue = React.useCallback(
    (key: string, value: StudioControlValue) => {
      setCustomizerValues((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const resetCustomizer = React.useCallback(() => {
    setCustomizerValues(resolveCustomizerDefaults(record))
  }, [record])

  const panel: "closed" | "docs" | "code" = url.panel ?? "closed"

  const setPanel = React.useCallback(
    (nextPanel: "closed" | "docs" | "code") => {
      url.setPanel(nextPanel === "closed" ? null : nextPanel)
    },
    [url]
  )

  return {
    collection: url.collection,
    items,
    record,
    activeItem,
    activeVariantId: url.variantId ?? activeItem?.variants?.[0]?.id,
    panel,
    isDetail: Boolean(activeItem),
    isSidebarOpen,
    customizerValues,
    selectCollection: url.selectCollection,
    selectItem: url.selectItem,
    selectVariant: url.selectVariant,
    setPanel,
    toggleSidebar,
    setCustomizerValue,
    resetCustomizer,
  }
}
