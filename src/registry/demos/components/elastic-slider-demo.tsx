import { RotateCcw, Sliders, Sun, Volume2 } from "lucide-react"
import { useState } from "react"

import { ElasticSlider } from "@/registry/animated/elastic-slider"

export function ElasticSliderDemo() {
  const [volume, setVolume] = useState(65)
  const [brightness, setBrightness] = useState(80)
  const [bass, setBass] = useState(4.5)

  return (
    <div className="flex w-full max-w-xl flex-col items-center justify-center gap-8 p-4 sm:p-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Tactile Rubber-Band Physics
        </span>
        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Elastic Spring Slider
        </h3>
        <p className="max-w-md text-xs text-balance text-muted-foreground">
          Drag past boundaries to stretch like rubber. Release to snap back with
          magnetic decile damping and handle dodging.
        </p>
      </div>

      {/* Control Card */}
      <div className="flex w-full flex-col gap-5 rounded-2xl border border-border/80 bg-background/60 p-6 shadow-xs backdrop-blur-sm sm:p-8">
        {/* Slider 1: Volume */}
        <div className="flex flex-col gap-1.5">
          <ElasticSlider
            label="Master Volume"
            icon={<Volume2 />}
            value={volume}
            onValueChange={setVolume}
            min={0}
            max={100}
            step={1}
            formatValue={(v) => `${Math.round(v)}%`}
            variant="primary"
          />
        </div>

        {/* Slider 2: Brightness */}
        <div className="flex flex-col gap-1.5">
          <ElasticSlider
            label="Display Brightness"
            icon={<Sun />}
            value={brightness}
            onValueChange={setBrightness}
            min={0}
            max={100}
            step={1}
            formatValue={(v) => `${Math.round(v)}%`}
            variant="default"
          />
        </div>

        {/* Slider 3: Bass Boost (Discrete step slider) */}
        <div className="flex flex-col gap-1.5">
          <ElasticSlider
            label="Bass Resonance"
            icon={<Sliders />}
            value={bass}
            onValueChange={setBass}
            min={0}
            max={10}
            step={0.5}
            formatValue={(v) => `${v.toFixed(1)} dB`}
            variant="success"
            size="sm"
          />
        </div>

        {/* Quick presets footer */}
        <div className="flex items-center justify-between border-t border-border/40 pt-4 text-xs">
          <span className="text-muted-foreground">Quick Presets:</span>
          <div className="flex items-center gap-2">
            {[25, 50, 75, 100].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setVolume(preset)
                  setBrightness(preset)
                }}
                className="rounded-md border border-border/60 bg-muted/40 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {preset}%
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setVolume(50)
                setBrightness(50)
                setBass(0)
              }}
              title="Reset to 50%"
              className="inline-flex size-6 items-center justify-center rounded-md border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="size-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ElasticSliderDemo
