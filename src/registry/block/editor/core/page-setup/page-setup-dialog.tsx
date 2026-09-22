/* eslint-disable react-hooks/set-state-in-effect */
import { Check, FileText, Sliders } from "lucide-react"
import * as React from "react"

import { Button } from "../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { cn } from "../../utils/cn"
import { usePageSetup } from "./page-setup-context"
import type {
  CustomMarginValues,
  PageLayoutMode,
  PageMarginPreset,
  PageOrientation,
  PageSizePreset,
} from "./types"
import { MARGIN_PRESET_VALUES, PAGE_SIZE_DIMENSIONS } from "./types"

export interface PageSetupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PageSetupDialog({ open, onOpenChange }: PageSetupDialogProps) {
  const {
    pageSetup,
    setSize,
    setOrientation,
    setMargins,
    setLayoutMode,
    setScale,
    resetToDefault,
  } = usePageSetup()

  // Local state for draft adjustments
  const [selectedSize, setSelectedSize] = React.useState<PageSizePreset>(
    pageSetup.size
  )
  const [selectedOrientation, setSelectedOrientation] =
    React.useState<PageOrientation>(pageSetup.orientation)
  const [selectedMargins, setSelectedMargins] =
    React.useState<PageMarginPreset>(pageSetup.margins)
  const [customMargins, setCustomMargins] = React.useState<CustomMarginValues>({
    ...pageSetup.customMargins,
  })
  const [selectedLayoutMode, setSelectedLayoutMode] =
    React.useState<PageLayoutMode>(pageSetup.layoutMode)
  const [selectedScale, setSelectedScale] = React.useState<number>(
    pageSetup.scale
  )

  // Sync state when dialog opens
  React.useEffect(() => {
    if (open) {
      setSelectedSize(pageSetup.size)
      setSelectedOrientation(pageSetup.orientation)
      setSelectedMargins(pageSetup.margins)
      setCustomMargins({ ...pageSetup.customMargins })
      setSelectedLayoutMode(pageSetup.layoutMode)
      setSelectedScale(pageSetup.scale)
    }
  }, [open, pageSetup])

  const handleApply = () => {
    setSize(selectedSize)
    setOrientation(selectedOrientation)
    setMargins(selectedMargins, customMargins)
    setLayoutMode(selectedLayoutMode)
    setScale(selectedScale)
    onOpenChange(false)
  }

  // Active margins mm for preview calculation
  const activeMarginsMm =
    selectedMargins === "custom"
      ? customMargins
      : (MARGIN_PRESET_VALUES[selectedMargins] ?? MARGIN_PRESET_VALUES.normal)

  // Compute miniature preview aspect ratio
  const activeDim = PAGE_SIZE_DIMENSIONS[selectedSize]
  const isLandscape = selectedOrientation === "landscape"
  const previewWidth = isLandscape
    ? Math.max(activeDim.widthMm || 210, activeDim.heightMm || 297)
    : Math.min(activeDim.widthMm || 210, activeDim.heightMm || 297)
  const previewHeight = isLandscape
    ? Math.min(activeDim.widthMm || 210, activeDim.heightMm || 297)
    : Math.max(activeDim.widthMm || 210, activeDim.heightMm || 297)
  const aspectRatio =
    selectedSize === "fluid" ? 1.4 : previewWidth / previewHeight

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                Page Setup & Document Layout
              </DialogTitle>
              <DialogDescription className="text-xs">
                Configure paper size, orientation, print margins, and visual
                pagination.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 py-2 md:grid-cols-12">
          {/* Left / Center: Controls (8 cols) */}
          <div className="space-y-4 md:col-span-8">
            {/* 1. Paper Size Selector */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                Paper Size
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    "a4",
                    "letter",
                    "legal",
                    "a5",
                    "a3",
                    "fluid",
                  ] as PageSizePreset[]
                ).map((sizeKey) => {
                  const dim = PAGE_SIZE_DIMENSIONS[sizeKey]
                  const isSelected = selectedSize === sizeKey
                  return (
                    <button
                      key={sizeKey}
                      type="button"
                      onClick={() => setSelectedSize(sizeKey)}
                      className={cn(
                        "flex flex-col items-start rounded-lg border p-2 text-left transition-all",
                        isSelected
                          ? "border-primary bg-primary/5 text-foreground shadow-xs ring-1 ring-primary"
                          : "border-border bg-card text-muted-foreground hover:border-border/80 hover:bg-muted/40"
                      )}
                    >
                      <span className="flex w-full items-center justify-between text-xs font-semibold text-foreground">
                        {dim.name}
                        {isSelected && (
                          <Check className="size-3 text-primary" />
                        )}
                      </span>
                      <span className="mt-0.5 line-clamp-1 text-[10px] text-muted-foreground">
                        {dim.widthMm
                          ? `${dim.widthMm} × ${dim.heightMm} mm`
                          : "Auto"}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2. Orientation & Layout Mode */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  Orientation
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedOrientation("portrait")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-lg border py-1.5 text-xs font-medium transition-all",
                      selectedOrientation === "portrait"
                        ? "border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-muted/40"
                    )}
                  >
                    <span className="text-sm">↕</span> Portrait
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedOrientation("landscape")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-lg border py-1.5 text-xs font-medium transition-all",
                      selectedOrientation === "landscape"
                        ? "border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-muted/40"
                    )}
                  >
                    <span className="text-sm">↔</span> Landscape
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  View Mode
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedLayoutMode("paged")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-lg border py-1.5 text-xs font-medium transition-all",
                      selectedLayoutMode === "paged"
                        ? "border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-muted/40"
                    )}
                  >
                    <FileText className="size-3" /> Paged
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedLayoutMode("continuous")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-lg border py-1.5 text-xs font-medium transition-all",
                      selectedLayoutMode === "continuous"
                        ? "border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-muted/40"
                    )}
                  >
                    <Sliders className="size-3" /> Scroll
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Margins */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                Margins
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(
                  [
                    { id: "normal", name: "Normal", val: "25.4 mm" },
                    { id: "narrow", name: "Narrow", val: "12.7 mm" },
                    { id: "wide", name: "Wide", val: "38.1 mm" },
                    { id: "custom", name: "Custom", val: "Edit mm" },
                  ] as const
                ).map((m) => {
                  const isSelected = selectedMargins === m.id
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMargins(m.id)}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-lg border p-1.5 text-center transition-all",
                        isSelected
                          ? "border-primary bg-primary/5 text-foreground shadow-xs ring-1 ring-primary"
                          : "border-border bg-card text-muted-foreground hover:bg-muted/40"
                      )}
                    >
                      <span className="text-xs font-medium text-foreground">
                        {m.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {m.val}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Custom Margins Inputs */}
              {selectedMargins === "custom" && (
                <div className="mt-2.5 grid grid-cols-4 gap-2 rounded-lg border border-border/80 bg-muted/20 p-2.5">
                  {(["top", "bottom", "left", "right"] as const).map((side) => (
                    <div key={side}>
                      <label className="mb-0.5 block text-[10px] font-medium text-muted-foreground capitalize">
                        {side} (mm)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={customMargins[side]}
                        onChange={(e) => {
                          const val = Math.max(
                            0,
                            parseFloat(e.target.value) || 0
                          )
                          setCustomMargins((prev) => ({ ...prev, [side]: val }))
                        }}
                        className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Zoom Scale */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">
                  Display Zoom: {Math.round(selectedScale * 100)}%
                </label>
                <div className="flex items-center gap-1">
                  {[0.75, 1.0, 1.25].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedScale(s)}
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors",
                        selectedScale === s
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {Math.round(s * 100)}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Real-time Miniature Preview (4 cols) */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-muted/25 p-4 text-center md:col-span-4">
            <span className="mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Paper Preview
            </span>

            {/* Paper Sheet Preview Mock */}
            <div className="relative flex h-[180px] w-full items-center justify-center py-4">
              <div
                style={{
                  aspectRatio: `${aspectRatio}`,
                  maxHeight: "160px",
                  maxWidth: "130px",
                }}
                className={cn(
                  "relative flex flex-col justify-between rounded-xs border border-border/80 bg-background shadow-md transition-all duration-300",
                  selectedLayoutMode === "paged" &&
                    "shadow-lg ring-1 ring-primary/30"
                )}
              >
                {/* Visual Margin Guidelines */}
                <div
                  style={{
                    padding: `${Math.max(4, activeMarginsMm.top / 4)}px ${Math.max(4, activeMarginsMm.right / 4)}px ${Math.max(4, activeMarginsMm.bottom / 4)}px ${Math.max(4, activeMarginsMm.left / 4)}px`,
                  }}
                  className="flex h-full w-full flex-col justify-between"
                >
                  <div className="flex h-full w-full flex-col items-center justify-center rounded-xs border border-dashed border-primary/20 bg-primary/5 p-1">
                    <span className="text-[9px] font-bold text-primary/80">
                      {activeDim.name}
                    </span>
                    <span className="text-[7px] text-muted-foreground">
                      {isLandscape ? "Landscape" : "Portrait"}
                    </span>
                  </div>
                </div>

                {/* Bottom page number tag */}
                <span className="absolute right-2 bottom-1 font-mono text-[7px] text-muted-foreground/60">
                  1
                </span>
              </div>
            </div>

            <p className="mt-2 text-[10px] text-muted-foreground">
              {activeDim.description}
            </p>
            <span className="text-[10px] font-medium text-foreground">
              Margins: {activeMarginsMm.top} × {activeMarginsMm.left} mm
            </span>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between border-t border-border pt-3 sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetToDefault}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Reset Default (A4)
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleApply}>
              Apply Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
