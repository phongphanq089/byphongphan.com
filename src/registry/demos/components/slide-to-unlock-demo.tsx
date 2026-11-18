import { Power, RotateCcw, Smartphone } from "lucide-react"
import { useState } from "react"

import {
  SlideToUnlock,
  type SlideVariant,
} from "@/registry/animated/slide-to-unlock"

export function SlideToUnlockDemo() {
  const [variant, setVariant] = useState<SlideVariant>("unlock")
  const [resetKey, setResetKey] = useState(0)
  const [statusLog, setStatusLog] = useState<string>("Ready to slide")

  const handleConfirm = async () => {
    setStatusLog(
      variant === "power"
        ? "Powering down system…"
        : variant === "confirm"
          ? "Authorizing transaction…"
          : "Device unlocked!"
    )
    await new Promise((resolve) => setTimeout(resolve, 1100))
    setStatusLog(
      variant === "power"
        ? "Device is now off"
        : variant === "confirm"
          ? "Payment confirmed: $48.00"
          : "Welcome back!"
    )
  }

  const handleReset = () => {
    setResetKey((k) => k + 1)
    setStatusLog("Ready to slide")
  }

  return (
    <div className="flex w-full max-w-xl flex-col items-center justify-center gap-8 p-4 py-8 sm:p-10">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          <Smartphone className="size-3.5" />
          <span>iOS Tactile Lockscreen Slider</span>
        </div>
        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Slide to Unlock
        </h3>
        <p className="max-w-md text-xs text-balance text-muted-foreground">
          Faithful recreation of the iconic iOS slider with smooth spring
          recoil, velocity flick commit, squircle white thumb, and authentic
          text shimmer.
        </p>
      </div>

      {/* Simulated Device Stage */}
      <div className="relative flex min-h-[220px] w-full flex-col items-center justify-center rounded-2xl border border-border/80 bg-zinc-950 p-8 shadow-2xl backdrop-blur-md">
        {/* Ambient Subtle Glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-30"
          style={{
            background:
              variant === "power"
                ? "radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.25), transparent 70%)"
                : "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08), transparent 70%)",
          }}
        />

        <div className="relative z-10 w-full max-w-[340px]">
          <SlideToUnlock
            key={`${variant}-${resetKey}`}
            variant={variant}
            onConfirm={handleConfirm}
            resetAfter={2800}
          />
        </div>

        {/* Live Status Pill */}
        <div className="relative z-10 mt-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-zinc-400">
          <span
            className={`size-1.5 rounded-full ${
              statusLog.includes("off")
                ? "bg-red-400"
                : statusLog.includes("unlocked") ||
                    statusLog.includes("confirmed")
                  ? "bg-emerald-400"
                  : "bg-zinc-400"
            }`}
          />
          <span>{statusLog}</span>
        </div>
      </div>

      {/* Control Switcher */}
      <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Preset:
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => {
                setVariant("unlock")
                setStatusLog("Ready to slide")
              }}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                variant === "unlock"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              Slide to Unlock
            </button>

            <button
              type="button"
              onClick={() => {
                setVariant("power")
                setStatusLog("Ready to slide")
              }}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                variant === "power"
                  ? "bg-red-600 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              Slide to Power Off
            </button>

            <button
              type="button"
              onClick={() => {
                setVariant("confirm")
                setStatusLog("Ready to slide")
              }}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                variant === "confirm"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              Slide to Confirm
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-md border border-border/80 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Reset position"
        >
          <RotateCcw className="size-3" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  )
}

export default SlideToUnlockDemo
