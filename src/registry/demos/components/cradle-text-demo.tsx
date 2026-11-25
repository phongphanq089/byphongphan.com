import { useState } from "react"

import { CradleText } from "@/registry/animated/cradle-text"

export function CradleTextDemo() {
  const [bounce, setBounce] = useState(0.97)
  const [introKey, setIntroKey] = useState(0)
  const [sampleIndex, setSampleIndex] = useState(0)

  const SAMPLES = ["MOMENTUM", "NEWTON", "KINETIC"]

  return (
    <div className="flex w-full max-w-full flex-col items-center justify-center gap-6 px-3 py-6 text-center sm:gap-10 sm:p-10 md:p-14">
      <div className="flex w-full max-w-full flex-col items-center gap-4">
        <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Newton&apos;s Cradle & Pendulum Dynamics
        </span>

        <div className="flex w-full max-w-full items-center justify-center py-6 sm:py-10">
          <CradleText
            key={`${bounce}-${sampleIndex}-${introKey}`}
            text={SAMPLES[sampleIndex]}
            bounce={bounce}
            intro={true}
            className="text-2xl font-black tracking-tight text-foreground xs:text-3xl sm:text-5xl md:text-6xl"
          />
        </div>

        <p className="max-w-md px-2 text-center text-xs text-balance text-muted-foreground">
          Click and pull any letter sideways to swing it, tap to give a impulse
          knock, or brush your cursor through the hanging letters.
        </p>
      </div>

      {/* Interactive Controls */}
      <div className="flex max-w-full flex-wrap items-center justify-center gap-3 rounded-xl border border-border/80 bg-background/80 p-3 text-xs shadow-xs backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span className="text-muted-foreground">Word:</span>
          {SAMPLES.map((sample, idx) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setSampleIndex(idx)
                setIntroKey((k) => k + 1)
              }}
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
          <span className="text-muted-foreground">Material Bounce:</span>
          {[
            { label: "Steel (0.97)", val: 0.97 },
            { label: "Wood (0.75)", val: 0.75 },
            { label: "Damped (0.4)", val: 0.4 },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setBounce(item.val)
                setIntroKey((k) => k + 1)
              }}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                bounce === item.val
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <span
          className="hidden h-4 w-px bg-border/60 sm:inline-block"
          aria-hidden="true"
        />

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIntroKey((k) => k + 1)}
            className="rounded-lg bg-muted px-2.5 py-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Replay Intro Knock
          </button>
        </div>
      </div>
    </div>
  )
}

export default CradleTextDemo
