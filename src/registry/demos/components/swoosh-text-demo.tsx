import { useState } from "react"

import { SwooshText } from "@/registry/animated/swoosh-text"

export function SwooshTextDemo() {
  const [accent, setAccent] = useState<string | undefined>("var(--primary)")
  const [depth, setDepth] = useState(14)

  return (
    <div className="flex flex-col items-center justify-center gap-10 p-6 text-center sm:p-14">
      <div className="flex flex-col items-center gap-3">
        <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Dynamic Light & Keycap Physics
        </span>
        <div className="flex items-center justify-center py-6">
          <SwooshText
            text="SWOOSH"
            depth={depth}
            length={0.25}
            accent={accent}
            className="text-5xl font-black sm:text-7xl"
          />
        </div>
        <p className="max-w-md text-xs text-muted-foreground">
          Move your cursor around to cast dynamic extrusion light. Click or tap
          directly on any letter to press it like a mechanical keycap!
        </p>
      </div>

      {/* Interactive Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4 rounded-xl border border-border/80 bg-background/80 p-3 text-xs shadow-xs backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Accent Base:</span>
          <button
            type="button"
            onClick={() => setAccent("var(--primary)")}
            className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
              accent === "var(--primary)"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Primary Glow
          </button>
          <button
            type="button"
            onClick={() => setAccent(undefined)}
            className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
              accent === undefined
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Monochrome
          </button>
        </div>

        <span className="h-4 w-px bg-border/60" aria-hidden="true" />

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Depth Layers:</span>
          <button
            type="button"
            onClick={() => setDepth(8)}
            className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
              depth === 8
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            8 Layers
          </button>
          <button
            type="button"
            onClick={() => setDepth(14)}
            className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
              depth === 14
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            14 Layers
          </button>
        </div>
      </div>
    </div>
  )
}

export default SwooshTextDemo
