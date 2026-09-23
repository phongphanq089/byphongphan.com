import type { LexicalEditor } from "lexical"
import {
  Check,
  Columns2,
  Columns3,
  Columns4,
  Layers,
  Layout,
  Maximize2,
  Sliders,
  Sparkles,
} from "lucide-react"
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
import type { LayoutBorder, LayoutGap } from "../../nodes/layout-nodes"
import { INSERT_LAYOUT_COMMAND } from "../../nodes/layout-nodes"
import { cn } from "../../utils/cn"

export interface LayoutPreset {
  id: string
  title: string
  subtitle: string
  cols: number
  templateColumns: string
  fractions: number[]
  percentages: string[]
}

export const LAYOUT_PRESETS: LayoutPreset[] = [
  // 2 Columns
  {
    id: "2-equal",
    title: "2 Columns Equal",
    subtitle: "50% / 50% split for side-by-side balanced content",
    cols: 2,
    templateColumns: "1fr 1fr",
    fractions: [1, 1],
    percentages: ["50%", "50%"],
  },
  {
    id: "2-sidebar-left",
    title: "Sidebar Left (25% / 75%)",
    subtitle: "Narrow left column for notes/metadata, wide main right",
    cols: 2,
    templateColumns: "1fr 3fr",
    fractions: [1, 3],
    percentages: ["25%", "75%"],
  },
  {
    id: "2-sidebar-right",
    title: "Sidebar Right (75% / 25%)",
    subtitle: "Wide main left content, narrow right column for aside info",
    cols: 2,
    templateColumns: "3fr 1fr",
    fractions: [3, 1],
    percentages: ["75%", "25%"],
  },
  {
    id: "2-thirds-left",
    title: "Thirds Left (33% / 67%)",
    subtitle: "One-third left column, two-thirds right column",
    cols: 2,
    templateColumns: "1fr 2fr",
    fractions: [1, 2],
    percentages: ["33%", "67%"],
  },
  {
    id: "2-thirds-right",
    title: "Thirds Right (67% / 33%)",
    subtitle: "Two-thirds left column, one-third right column",
    cols: 2,
    templateColumns: "2fr 1fr",
    fractions: [2, 1],
    percentages: ["67%", "33%"],
  },

  // 3 Columns
  {
    id: "3-equal",
    title: "3 Columns Equal",
    subtitle: "33% each column for tri-fold cards or dashboards",
    cols: 3,
    templateColumns: "1fr 1fr 1fr",
    fractions: [1, 1, 1],
    percentages: ["33%", "33%", "33%"],
  },
  {
    id: "3-center-hero",
    title: "Center Hero (25% / 50% / 25%)",
    subtitle: "Dominant center column flanked by two equal sidebars",
    cols: 3,
    templateColumns: "1fr 2fr 1fr",
    fractions: [1, 2, 1],
    percentages: ["25%", "50%", "25%"],
  },
  {
    id: "3-lead-left",
    title: "Lead Story Left (50% / 25% / 25%)",
    subtitle: "Half-width primary focus column with two secondary side columns",
    cols: 3,
    templateColumns: "2fr 1fr 1fr",
    fractions: [2, 1, 1],
    percentages: ["50%", "25%", "25%"],
  },
  {
    id: "3-lead-right",
    title: "Lead Story Right (25% / 25% / 50%)",
    subtitle: "Two secondary columns leading into wide right feature",
    cols: 3,
    templateColumns: "1fr 1fr 2fr",
    fractions: [1, 1, 2],
    percentages: ["25%", "25%", "50%"],
  },

  // 4 Columns
  {
    id: "4-equal",
    title: "4 Columns Equal",
    subtitle: "25% each column for statistics, metric cards or photo rows",
    cols: 4,
    templateColumns: "1fr 1fr 1fr 1fr",
    fractions: [1, 1, 1, 1],
    percentages: ["25%", "25%", "25%", "25%"],
  },
]

export function InsertLayoutDialog({
  open,
  onOpenChange,
  editor,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editor: LexicalEditor
}) {
  const [activeTab, setActiveTab] = React.useState<
    "all" | "2" | "3" | "4" | "custom"
  >("all")
  const [selectedPresetId, setSelectedPresetId] =
    React.useState<string>("2-equal")
  const [selectedGap, setSelectedGap] = React.useState<LayoutGap>("normal")
  const [selectedBorder, setSelectedBorder] =
    React.useState<LayoutBorder>("dashed")

  // Custom configuration states
  const [customCols, setCustomCols] = React.useState<2 | 3 | 4>(2)
  const [customRatio2, setCustomRatio2] = React.useState<number>(50) // Left column percentage
  const [customRatio3, setCustomRatio3] = React.useState<
    "equal" | "hero" | "lead-left"
  >("hero")
  const [customRatio4, setCustomRatio4] = React.useState<"equal" | "sides">(
    "equal"
  )

  const selectedPreset = React.useMemo(() => {
    return (
      LAYOUT_PRESETS.find((p) => p.id === selectedPresetId) || LAYOUT_PRESETS[0]
    )
  }, [selectedPresetId])

  // Computed templateColumns and fractions for preview & insertion
  const activeLayoutInfo = React.useMemo(() => {
    if (activeTab === "custom") {
      if (customCols === 2) {
        const left = customRatio2
        const right = 100 - customRatio2
        return {
          cols: 2,
          templateColumns: `${left}fr ${right}fr`,
          percentages: [`${left}%`, `${right}%`],
          fractions: [left, right],
          title: `Custom 2 Columns (${left}% / ${right}%)`,
        }
      }
      if (customCols === 3) {
        if (customRatio3 === "hero") {
          return {
            cols: 3,
            templateColumns: "1fr 2fr 1fr",
            percentages: ["25%", "50%", "25%"],
            fractions: [1, 2, 1],
            title: "Custom 3 Columns (Center Hero 25/50/25)",
          }
        }
        if (customRatio3 === "lead-left") {
          return {
            cols: 3,
            templateColumns: "2fr 1fr 1fr",
            percentages: ["50%", "25%", "25%"],
            fractions: [2, 1, 1],
            title: "Custom 3 Columns (Lead Left 50/25/25)",
          }
        }
        return {
          cols: 3,
          templateColumns: "1fr 1fr 1fr",
          percentages: ["33%", "33%", "33%"],
          fractions: [1, 1, 1],
          title: "Custom 3 Columns Equal (33% each)",
        }
      }
      // 4 cols
      if (customRatio4 === "sides") {
        return {
          cols: 4,
          templateColumns: "1fr 2fr 2fr 1fr",
          percentages: ["16%", "34%", "34%", "16%"],
          fractions: [1, 2, 2, 1],
          title: "Custom 4 Columns (Wide Center Duo)",
        }
      }
      return {
        cols: 4,
        templateColumns: "1fr 1fr 1fr 1fr",
        percentages: ["25%", "25%", "25%", "25%"],
        fractions: [1, 1, 1, 1],
        title: "Custom 4 Columns Equal (25% each)",
      }
    }

    return {
      cols: selectedPreset.cols,
      templateColumns: selectedPreset.templateColumns,
      percentages: selectedPreset.percentages,
      fractions: selectedPreset.fractions,
      title: selectedPreset.title,
    }
  }, [
    activeTab,
    selectedPreset,
    customCols,
    customRatio2,
    customRatio3,
    customRatio4,
  ])

  const filteredPresets = React.useMemo(() => {
    if (activeTab === "all") return LAYOUT_PRESETS
    const colNumber = parseInt(activeTab, 10)
    return LAYOUT_PRESETS.filter((p) => p.cols === colNumber)
  }, [activeTab])

  const handleInsert = () => {
    editor.dispatchCommand(INSERT_LAYOUT_COMMAND, {
      templateColumns: activeLayoutInfo.templateColumns,
      gap: selectedGap,
      borderStyle: selectedBorder,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden border border-border/70 bg-background/95 p-0 shadow-2xl backdrop-blur-xl sm:rounded-2xl">
        <DialogHeader className="border-b border-border/50 bg-muted/20 px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-xs">
              <Columns2 className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold tracking-tight">
                Insert Columns Layout
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-xs text-muted-foreground">
                Organize your text, media, and callouts into high-craft
                responsive grid columns
              </DialogDescription>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex scrollbar-none items-center gap-1.5 overflow-x-auto pt-3">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-medium transition-all duration-150",
                activeTab === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              All Presets
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("2")}
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium transition-all duration-150",
                activeTab === "2"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Columns2 className="size-3.5" />
              <span>2 Columns</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("3")}
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium transition-all duration-150",
                activeTab === "3"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Columns3 className="size-3.5" />
              <span>3 Columns</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("4")}
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium transition-all duration-150",
                activeTab === "4"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Columns4 className="size-3.5" />
              <span>4 Columns</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              className={cn(
                "ml-auto flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium transition-all duration-150",
                activeTab === "custom"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Sliders className="size-3.5" />
              <span>Custom Builder</span>
            </button>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="max-h-[65vh] space-y-5 overflow-y-auto px-6 py-4">
          {/* Live Architecture Visualizer */}
          <div className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-3.5 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <Sparkles className="size-3.5 text-primary" />
                Live Architectural Preview
              </span>
              <span className="rounded-md border border-border/60 bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                {activeLayoutInfo.templateColumns}
              </span>
            </div>

            {/* Visual simulation of columns */}
            <div
              className={cn(
                "grid w-full rounded-lg p-2.5 transition-all duration-300",
                selectedGap === "compact" && "gap-2",
                selectedGap === "normal" && "gap-3.5",
                selectedGap === "relaxed" && "gap-5",
                selectedBorder === "dashed" &&
                  "border border-dashed border-border/80 bg-background/50",
                selectedBorder === "card" &&
                  "border border-border bg-card shadow-xs",
                selectedBorder === "clean" &&
                  "border border-transparent bg-transparent"
              )}
              style={{ gridTemplateColumns: activeLayoutInfo.templateColumns }}
            >
              {activeLayoutInfo.percentages.map((pct, idx) => (
                <div
                  key={idx}
                  className="group relative flex min-h-[90px] flex-col justify-between rounded-lg border border-primary/20 bg-primary/5 p-3 transition-all hover:border-primary/40 hover:bg-primary/10"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold tracking-wider text-primary/80 uppercase">
                        Col {idx + 1}
                      </span>
                      <span className="py-0.2 rounded bg-primary/10 px-1.5 font-mono text-[10px] font-medium text-primary">
                        {pct}
                      </span>
                    </div>
                    {/* Mock text lines */}
                    <div className="h-1.5 w-4/5 rounded-full bg-primary/20" />
                    <div className="h-1.5 w-full rounded-full bg-primary/15" />
                    <div className="h-1.5 w-2/3 rounded-full bg-primary/10" />
                  </div>
                  <div className="pt-2 text-[9px] text-muted-foreground/80 italic">
                    Accepts paragraphs, images, tables & checklists
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tab 1: Presets Grid */}
          {activeTab !== "custom" ? (
            <div className="space-y-2.5">
              <label className="text-xs font-semibold tracking-wider text-foreground uppercase">
                Select Layout Architecture
              </label>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {filteredPresets.map((preset) => {
                  const isSelected = selectedPresetId === preset.id
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedPresetId(preset.id)}
                      className={cn(
                        "group relative flex cursor-pointer flex-col items-start rounded-xl border p-3 text-left transition-all duration-150",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/40"
                          : "border-border/60 bg-card hover:border-border hover:bg-muted/40"
                      )}
                    >
                      {/* Mini Wireframe Bar */}
                      <div className="mb-2.5 flex h-6 w-full items-center gap-1.5 rounded-md border border-border/40 bg-muted/40 p-1">
                        {preset.fractions.map((f, idx) => (
                          <div
                            key={idx}
                            style={{ flex: f }}
                            className={cn(
                              "flex h-full items-center justify-center rounded font-mono text-[9px] font-semibold transition-colors",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted-foreground/20 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                            )}
                          >
                            {preset.percentages[idx]}
                          </div>
                        ))}
                      </div>

                      <div className="flex w-full items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">
                          {preset.title}
                        </span>
                        {isSelected && (
                          <div className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="size-2.5" />
                          </div>
                        )}
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                        {preset.subtitle}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Tab 2: Custom Layout Builder */
            <div className="space-y-4 rounded-xl border border-border/60 bg-card p-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">
                  1. Number of Columns
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([2, 3, 4] as const).map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setCustomCols(count)}
                      className={cn(
                        "flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                        customCols === count
                          ? "border-primary bg-primary/10 font-semibold text-primary"
                          : "border-border/60 text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      {count === 2 && <Columns2 className="size-3.5" />}
                      {count === 3 && <Columns3 className="size-3.5" />}
                      {count === 4 && <Columns4 className="size-3.5" />}
                      <span>{count} Columns</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Proportional Split Controls for 2 Columns */}
              {customCols === 2 && (
                <div className="space-y-2.5 border-t border-border/40 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-foreground">
                      2. Split Ratio Proportion
                    </label>
                    <span className="font-mono text-[11px] font-bold text-primary">
                      {customRatio2}% — {100 - customRatio2}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    step="5"
                    value={customRatio2}
                    onChange={(e) =>
                      setCustomRatio2(parseInt(e.target.value, 10))
                    }
                    className="w-full cursor-pointer accent-primary"
                  />
                  <div className="flex items-center justify-between pt-0.5 text-[10px] text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => setCustomRatio2(25)}
                      className="cursor-pointer transition-colors hover:text-primary"
                    >
                      Sidebar Left (25/75)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomRatio2(33)}
                      className="cursor-pointer transition-colors hover:text-primary"
                    >
                      Thirds (33/67)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomRatio2(50)}
                      className="cursor-pointer font-semibold text-primary transition-colors hover:text-primary"
                    >
                      Equal (50/50)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomRatio2(67)}
                      className="cursor-pointer transition-colors hover:text-primary"
                    >
                      Thirds (67/33)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomRatio2(75)}
                      className="cursor-pointer transition-colors hover:text-primary"
                    >
                      Sidebar Right (75/25)
                    </button>
                  </div>
                </div>
              )}

              {/* Distribution for 3 Columns */}
              {customCols === 3 && (
                <div className="space-y-2 border-t border-border/40 pt-2">
                  <label className="text-xs font-semibold text-foreground">
                    2. Distribution Pattern
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomRatio3("hero")}
                      className={cn(
                        "rounded-lg border p-2 text-left text-xs transition-all",
                        customRatio3 === "hero"
                          ? "border-primary bg-primary/10 font-semibold text-primary"
                          : "border-border/60 text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      <div className="font-medium">Center Stage</div>
                      <div className="text-[10px] opacity-70">
                        25% - 50% - 25%
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomRatio3("lead-left")}
                      className={cn(
                        "rounded-lg border p-2 text-left text-xs transition-all",
                        customRatio3 === "lead-left"
                          ? "border-primary bg-primary/10 font-semibold text-primary"
                          : "border-border/60 text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      <div className="font-medium">Lead Story</div>
                      <div className="text-[10px] opacity-70">
                        50% - 25% - 25%
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomRatio3("equal")}
                      className={cn(
                        "rounded-lg border p-2 text-left text-xs transition-all",
                        customRatio3 === "equal"
                          ? "border-primary bg-primary/10 font-semibold text-primary"
                          : "border-border/60 text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      <div className="font-medium">Equal Triad</div>
                      <div className="text-[10px] opacity-70">
                        33% - 33% - 33%
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Distribution for 4 Columns */}
              {customCols === 4 && (
                <div className="space-y-2 border-t border-border/40 pt-2">
                  <label className="text-xs font-semibold text-foreground">
                    2. Distribution Pattern
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomRatio4("equal")}
                      className={cn(
                        "rounded-lg border p-2 text-left text-xs transition-all",
                        customRatio4 === "equal"
                          ? "border-primary bg-primary/10 font-semibold text-primary"
                          : "border-border/60 text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      <div className="font-medium">Equal Quads</div>
                      <div className="text-[10px] opacity-70">
                        25% - 25% - 25% - 25%
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomRatio4("sides")}
                      className={cn(
                        "rounded-lg border p-2 text-left text-xs transition-all",
                        customRatio4 === "sides"
                          ? "border-primary bg-primary/10 font-semibold text-primary"
                          : "border-border/60 text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      <div className="font-medium">Wide Center Duo</div>
                      <div className="text-[10px] opacity-70">
                        16% - 34% - 34% - 16%
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Styling & Spacing Controls */}
          <div className="grid grid-cols-1 gap-4 border-t border-border/40 pt-2 sm:grid-cols-2">
            {/* Gap Selector */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Maximize2 className="size-3.5 text-muted-foreground" />
                <span>Column Spacing (Gap)</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: "compact", label: "Compact", px: "8px" },
                    { id: "normal", label: "Standard", px: "16px" },
                    { id: "relaxed", label: "Relaxed", px: "24px" },
                  ] as const
                ).map((gap) => (
                  <button
                    key={gap.id}
                    type="button"
                    onClick={() => setSelectedGap(gap.id)}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-lg border px-2 py-1.5 text-xs transition-all",
                      selectedGap === gap.id
                        ? "border-primary bg-primary/10 font-semibold text-primary"
                        : "border-border/60 text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    <span>{gap.label}</span>
                    <span className="font-mono text-[10px] opacity-60">
                      {gap.px}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Border Style Selector */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Layers className="size-3.5 text-muted-foreground" />
                <span>Container Style</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: "dashed", label: "Guides", sub: "Dashed" },
                    { id: "card", label: "Surface", sub: "Card Box" },
                    { id: "clean", label: "Clean", sub: "Minimal" },
                  ] as const
                ).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBorder(b.id)}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-lg border px-2 py-1.5 text-xs transition-all",
                      selectedBorder === b.id
                        ? "border-primary bg-primary/10 font-semibold text-primary"
                        : "border-border/60 text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    <span>{b.label}</span>
                    <span className="text-[10px] opacity-60">{b.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="flex items-center justify-between border-t border-border/50 bg-muted/10 px-6 py-3.5 sm:justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Layout className="size-3.5 text-primary/70" />
            <span>Responsive: automatically stacks on mobile screens</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleInsert}
              className="gap-1.5 font-medium shadow-xs"
            >
              <Columns2 className="size-4" />
              <span>Insert Layout</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
