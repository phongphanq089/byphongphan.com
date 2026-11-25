import {
  ArrowRight,
  Check,
  Compass,
  Flame,
  PenTool,
  Rocket,
  Sparkles,
} from "lucide-react"
import { useState } from "react"

import { CornerButton } from "@/registry/animated/corner-button"

const PALETTES = [
  { id: "primary", name: "System Primary", color: "var(--primary)" },
  { id: "amber", name: "Amber Gold", color: "#f59e0b" },
  { id: "emerald", name: "Neon Emerald", color: "#10b981" },
  { id: "violet", name: "Cyber Violet", color: "#8b5cf6" },
  { id: "rose", name: "Crimson Rose", color: "#f43f5e" },
]

const ACTIONS = [
  {
    id: "design",
    label: "Start designing",
    icon: <PenTool className="corner-btn-svg" />,
  },
  {
    id: "deploy",
    label: "Deploy to Prod",
    icon: <Rocket className="corner-btn-svg" />,
  },
  {
    id: "explore",
    label: "Explore Studio",
    icon: <Compass className="corner-btn-svg" />,
  },
  {
    id: "magic",
    label: "Generate Flow",
    icon: <Sparkles className="corner-btn-svg" />,
  },
]

export function CornerButtonDemo() {
  const [selectedPalette, setSelectedPalette] = useState(PALETTES[0])
  const [selectedAction, setSelectedAction] = useState(ACTIONS[0])
  const [clickCount, setClickCount] = useState(0)

  return (
    <div className="flex w-full max-w-xl flex-col items-center justify-center gap-8 p-4 py-8 sm:p-10">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Dynamic CAD Crosshairs & Glow
        </span>
        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Corner Button
        </h3>
        <p className="max-w-md text-xs text-balance text-muted-foreground">
          Hover over the button to trigger sequential orbiting corner dots,
          expanding dashed crosshairs, and smooth ambient backdrop glow.
        </p>
      </div>

      {/* Button Stage */}
      <div className="relative flex min-h-[160px] w-full items-center justify-center rounded-2xl border border-border/80 bg-background/50 p-8 shadow-xs backdrop-blur-sm">
        <CornerButton
          accentColor={selectedPalette.color}
          icon={selectedAction.icon}
          onClick={() => setClickCount((c) => c + 1)}
        >
          {selectedAction.label}
        </CornerButton>

        {clickCount > 0 && (
          <div className="absolute right-4 bottom-3 font-mono text-[11px] text-muted-foreground">
            Triggered:{" "}
            <span className="font-semibold text-foreground">{clickCount}</span>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="flex w-full flex-col gap-4 rounded-xl border border-border/60 bg-muted/20 p-4">
        {/* Color Palette Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Accent Palette
          </span>
          <div className="flex items-center gap-1.5">
            {PALETTES.map((palette) => {
              const isSelected = selectedPalette.id === palette.id
              return (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => setSelectedPalette(palette)}
                  className={`relative flex size-6 items-center justify-center rounded-full border transition-transform ${
                    isSelected
                      ? "scale-110 border-foreground ring-2 ring-primary/30"
                      : "border-border/60 opacity-80 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor:
                      palette.id === "primary"
                        ? "var(--primary)"
                        : palette.color,
                  }}
                  title={palette.name}
                  aria-label={palette.name}
                >
                  {isSelected && (
                    <Check className="size-3 text-white drop-shadow-xs dark:text-black" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Action Preset Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-3">
          <span className="text-xs font-medium text-muted-foreground">
            Action Preset
          </span>
          <div className="flex flex-wrap gap-1.5">
            {ACTIONS.map((action) => {
              const isSelected = selectedAction.id === action.id
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => setSelectedAction(action)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  {action.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CornerButtonDemo
