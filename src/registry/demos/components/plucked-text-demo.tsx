import { useState } from "react"

import { PluckedText } from "@/registry/animated/plucked-text"

export function PluckedTextDemo() {
  const [tension, setTension] = useState(1)
  const [strum, setStrum] = useState(true)
  const [sampleIndex, setSampleIndex] = useState(0)

  const SAMPLES = ["HARMONICS", "PLUCK & STRUM", "ACOUSTIC STRING"]

  return (
    <div className="flex w-full max-w-full flex-col items-center justify-center gap-6 px-3 py-6 text-center sm:gap-10 sm:p-10 md:p-14">
      <div className="flex w-full max-w-full flex-col items-center gap-4">
        <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Real String Physics & Standing Waves
        </span>

        <div className="flex w-full max-w-full items-center justify-center py-6 sm:py-10">
          <PluckedText
            key={`${tension}-${strum}-${sampleIndex}`}
            text={SAMPLES[sampleIndex]}
            tension={tension}
            strum={strum}
            className="text-lg font-black tracking-tight text-foreground xs:text-xl sm:text-3xl md:text-5xl lg:text-6xl"
          />
        </div>

        <p className="max-w-md px-2 text-center text-xs text-balance text-muted-foreground">
          Click and drag the headline or string to pluck it, or sweep your mouse
          across it to strum. Letters oscillate and tilt according to exact
          harmonic wave equations.
        </p>
      </div>

      {/* Interactive Controls */}
      <div className="flex max-w-full flex-wrap items-center justify-center gap-3 rounded-xl border border-border/80 bg-background/80 p-3 text-xs shadow-xs backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span className="text-muted-foreground">Text:</span>
          {SAMPLES.map((sample, idx) => (
            <button
              key={sample}
              type="button"
              onClick={() => setSampleIndex(idx)}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                sampleIndex === idx
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {sample}
            </button>
          ))}
        </div>

        <span
          className="hidden h-4 w-px bg-border/60 sm:inline-block"
          aria-hidden="true"
        />

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-muted-foreground">Tension:</span>
          {[0.6, 1, 1.8].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setTension(val)}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                tension === val
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {val === 0.6 ? "0.6" : val === 1 ? "1.0" : "1.8"}
            </button>
          ))}
        </div>

        <span
          className="hidden h-4 w-px bg-border/60 sm:inline-block"
          aria-hidden="true"
        />

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-muted-foreground">Strum:</span>
          <button
            type="button"
            onClick={() => setStrum(!strum)}
            className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
              strum
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {strum ? "On" : "Off"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PluckedTextDemo
