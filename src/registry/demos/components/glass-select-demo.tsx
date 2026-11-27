import { useState } from "react"

import {
  GlassSelect,
  type GlassSelectOpening,
} from "@/registry/animated/glass-select"

const OPTIONS = [
  { value: "stretch", label: "Stretch (Spring Neck)" },
  { value: "morph", label: "Morph (Control to Surface)" },
  { value: "grow", label: "Grow (Anchor Expansion)" },
  { value: "disabled", label: "Disabled Option", disabled: true },
]

export function GlassSelectDemo() {
  const [opening, setOpening] = useState<GlassSelectOpening>("stretch")

  return (
    <div className="relative flex min-h-[340px] w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-xl p-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {(["stretch", "morph", "grow"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setOpening(mode)}
            className={`cursor-pointer rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
              opening === mode
                ? "border-foreground/30 bg-foreground text-background"
                : "border-border/60 bg-background/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <GlassSelect
        label="Opening Physics"
        placeholder="Pick an opening mode"
        value={opening}
        onValueChange={(next) => {
          if (next === "stretch" || next === "morph" || next === "grow") {
            setOpening(next)
          }
        }}
        options={OPTIONS}
        opening={opening}
      />
    </div>
  )
}
