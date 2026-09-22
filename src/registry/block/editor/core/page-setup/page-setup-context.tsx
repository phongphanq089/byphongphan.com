import * as React from "react"

import type {
  CustomMarginValues,
  PageLayoutMode,
  PageMarginPreset,
  PageOrientation,
  PageSetupConfig,
  PageSizePreset,
} from "./types"
import {
  DEFAULT_PAGE_SETUP,
  MARGIN_PRESET_VALUES,
  PAGE_SIZE_DIMENSIONS,
} from "./types"

export interface PageSetupContextValue {
  pageSetup: PageSetupConfig
  setSize: (size: PageSizePreset) => void
  setOrientation: (orientation: PageOrientation) => void
  setMargins: (margins: PageMarginPreset, custom?: CustomMarginValues) => void
  setLayoutMode: (mode: PageLayoutMode) => void
  setScale: (scale: number) => void
  setShowPageNumbers: (show: boolean) => void
  resetToDefault: () => void
  // Computed values
  effectiveWidthPx: number
  effectiveHeightPx: number
  effectiveMarginsMm: CustomMarginValues
  effectivePaddingPx: {
    top: number
    right: number
    bottom: number
    left: number
  }
}

export const PageSetupContext =
  React.createContext<PageSetupContextValue | null>(null)

export function PageSetupProvider({
  initialConfig,
  onChange,
  children,
}: {
  initialConfig?: Partial<PageSetupConfig>
  onChange?: (config: PageSetupConfig) => void
  children: React.ReactNode
}) {
  const [config, setConfig] = React.useState<PageSetupConfig>(() => ({
    ...DEFAULT_PAGE_SETUP,
    ...initialConfig,
    customMargins: {
      ...DEFAULT_PAGE_SETUP.customMargins,
      ...initialConfig?.customMargins,
    },
  }))

  const updateConfig = React.useCallback(
    (updater: (prev: PageSetupConfig) => PageSetupConfig) => {
      setConfig((prev) => {
        const next = updater(prev)
        onChange?.(next)
        return next
      })
    },
    [onChange]
  )

  const setSize = React.useCallback(
    (size: PageSizePreset) => {
      updateConfig((prev) => ({ ...prev, size }))
    },
    [updateConfig]
  )

  const setOrientation = React.useCallback(
    (orientation: PageOrientation) => {
      updateConfig((prev) => ({ ...prev, orientation }))
    },
    [updateConfig]
  )

  const setMargins = React.useCallback(
    (margins: PageMarginPreset, custom?: CustomMarginValues) => {
      updateConfig((prev) => ({
        ...prev,
        margins,
        customMargins: custom ? { ...custom } : prev.customMargins,
      }))
    },
    [updateConfig]
  )

  const setLayoutMode = React.useCallback(
    (layoutMode: PageLayoutMode) => {
      updateConfig((prev) => ({ ...prev, layoutMode }))
    },
    [updateConfig]
  )

  const setScale = React.useCallback(
    (scale: number) => {
      updateConfig((prev) => ({
        ...prev,
        scale: Math.min(2.0, Math.max(0.4, scale)),
      }))
    },
    [updateConfig]
  )

  const setShowPageNumbers = React.useCallback(
    (showPageNumbers: boolean) => {
      updateConfig((prev) => ({ ...prev, showPageNumbers }))
    },
    [updateConfig]
  )

  const resetToDefault = React.useCallback(() => {
    updateConfig(() => DEFAULT_PAGE_SETUP)
  }, [updateConfig])

  // Compute effective margins in mm
  const effectiveMarginsMm = React.useMemo<CustomMarginValues>(() => {
    if (config.margins === "custom") {
      return config.customMargins
    }
    return MARGIN_PRESET_VALUES[config.margins] ?? MARGIN_PRESET_VALUES.normal
  }, [config.margins, config.customMargins])

  // Conversion: 1 mm ≈ 3.7795 px at 96 DPI
  const effectivePaddingPx = React.useMemo(() => {
    const MM_TO_PX = 3.7795
    return {
      top: Math.round(effectiveMarginsMm.top * MM_TO_PX),
      right: Math.round(effectiveMarginsMm.right * MM_TO_PX),
      bottom: Math.round(effectiveMarginsMm.bottom * MM_TO_PX),
      left: Math.round(effectiveMarginsMm.left * MM_TO_PX),
    }
  }, [effectiveMarginsMm])

  // Compute effective width & height in px
  const { effectiveWidthPx, effectiveHeightPx } = React.useMemo(() => {
    const dim = PAGE_SIZE_DIMENSIONS[config.size]
    if (!dim || dim.id === "fluid") {
      return { effectiveWidthPx: 0, effectiveHeightPx: 0 }
    }

    if (config.orientation === "landscape") {
      return {
        effectiveWidthPx: Math.max(dim.widthPx, dim.heightPx),
        effectiveHeightPx: Math.min(dim.widthPx, dim.heightPx),
      }
    }

    return {
      effectiveWidthPx: Math.min(dim.widthPx, dim.heightPx),
      effectiveHeightPx: Math.max(dim.widthPx, dim.heightPx),
    }
  }, [config.size, config.orientation])

  // Dynamic print CSS injection
  React.useEffect(() => {
    if (typeof document === "undefined") return

    let styleEl = document.getElementById(
      "editor-page-print-style"
    ) as HTMLStyleElement | null
    if (!styleEl) {
      styleEl = document.createElement("style")
      styleEl.id = "editor-page-print-style"
      document.head.appendChild(styleEl)
    }

    const sizeName =
      config.size === "fluid" ? "auto" : config.size.toUpperCase()
    const orientation = config.orientation
    const { top, right, bottom, left } = effectiveMarginsMm

    styleEl.textContent = `
      @media print {
        @page {
          size: ${sizeName} ${orientation};
          margin: ${top}mm ${right}mm ${bottom}mm ${left}mm;
        }
        body {
          background: #ffffff !important;
          color: #000000 !important;
        }
        .universal-editor-page-card {
          box-shadow: none !important;
          border: none !important;
          margin: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          min-height: auto !important;
          padding: 0 !important;
          border-radius: 0 !important;
          transform: none !important;
        }
        .editor-page-break {
          break-after: page !important;
          page-break-after: always !important;
          border: none !important;
          height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .editor-page-break span {
          display: none !important;
        }
        .universal-editor-toolbar,
        .universal-editor-footer,
        .universal-editor-sidebar-panel,
        .universal-editor-floating-dock {
          display: none !important;
        }
      }
    `

    return () => {
      // Optional cleanup if component unmounts completely
    }
  }, [config.size, config.orientation, effectiveMarginsMm])

  const value = React.useMemo<PageSetupContextValue>(
    () => ({
      pageSetup: config,
      setSize,
      setOrientation,
      setMargins,
      setLayoutMode,
      setScale,
      setShowPageNumbers,
      resetToDefault,
      effectiveWidthPx,
      effectiveHeightPx,
      effectiveMarginsMm,
      effectivePaddingPx,
    }),
    [
      config,
      setSize,
      setOrientation,
      setMargins,
      setLayoutMode,
      setScale,
      setShowPageNumbers,
      resetToDefault,
      effectiveWidthPx,
      effectiveHeightPx,
      effectiveMarginsMm,
      effectivePaddingPx,
    ]
  )

  return (
    <PageSetupContext.Provider value={value}>
      {children}
    </PageSetupContext.Provider>
  )
}

export function usePageSetup(): PageSetupContextValue {
  const context = React.useContext(PageSetupContext)
  if (!context) {
    throw new Error("usePageSetup must be used within a PageSetupProvider")
  }
  return context
}
