import {
  Calendar,
  Clock,
  Hash,
  Pause,
  Play,
  RotateCcw,
  Timer,
  Volume2,
  VolumeX,
} from "lucide-react"
import React, { useState } from "react"

import {
  FlipClock,
  type FlipClockMode,
  type FlipClockSize,
  type FlipClockVariant,
} from "@/registry/animated/flip-clock"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/core"

export function FlipClockDemo() {
  const [mode, setMode] = useState<FlipClockMode>("clock")
  const [size, setSize] = useState<FlipClockSize>("md")
  const [variant, setVariant] = useState<FlipClockVariant>("default")
  const [showSeconds, setShowSeconds] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [sound, setSound] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [stopwatchKey, setStopwatchKey] = useState(0)
  const [counterValue, setCounterValue] = useState(1348)

  // Target 24h from now for countdown demo
  const [targetTomorrow] = useState(
    () => new Date(Date.now() + 24 * 3600 * 1000 + 45 * 60 * 1000 + 30 * 1000)
  )

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 px-2 py-8 sm:px-6">
      {/* ── 1. Interactive Controls Toolbar ── */}
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-border/60 bg-card/60 p-2 shadow-xs backdrop-blur-md">
        {/* Mode Selector */}
        <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-muted/40 p-1">
          <Button
            type="button"
            variant={mode === "clock" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMode("clock")}
            className="h-7 gap-1.5 px-2.5 text-xs font-medium"
          >
            <Clock className="size-3.5" />
            <span className="hidden sm:inline">Clock</span>
          </Button>

          <Button
            type="button"
            variant={mode === "date-time" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMode("date-time")}
            className="h-7 gap-1.5 px-2.5 text-xs font-medium"
          >
            <Calendar className="size-3.5" />
            <span className="hidden sm:inline">Date & Time</span>
          </Button>

          <Button
            type="button"
            variant={mode === "countdown" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMode("countdown")}
            className="h-7 gap-1.5 px-2.5 text-xs font-medium"
          >
            <Timer className="size-3.5" />
            <span className="hidden sm:inline">Countdown</span>
          </Button>

          <Button
            type="button"
            variant={mode === "stopwatch" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMode("stopwatch")}
            className="h-7 gap-1.5 px-2.5 text-xs font-medium"
          >
            <span className="text-[11px] font-bold">00:00</span>
            <span className="hidden sm:inline">Stopwatch</span>
          </Button>

          <Button
            type="button"
            variant={mode === "counter" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMode("counter")}
            className="h-7 gap-1.5 px-2.5 text-xs font-medium"
          >
            <Hash className="size-3.5" />
            <span className="hidden sm:inline">Counter</span>
          </Button>
        </div>

        {/* Variant Selector */}
        <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-muted/40 p-1">
          {(["default", "outline", "blueprint", "amber"] as const).map((v) => (
            <Button
              key={v}
              type="button"
              variant={variant === v ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setVariant(v)}
              className="h-7 px-2.5 text-xs font-medium capitalize"
            >
              {v}
            </Button>
          ))}
        </div>

        {/* Size Selector */}
        <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-muted/40 p-1">
          {(["sm", "md", "lg", "xl", "full"] as const).map((s) => (
            <Button
              key={s}
              type="button"
              variant={size === s ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSize(s)}
              className="h-7 px-2.5 text-xs uppercase"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* ── 2. The Live Flip Clock Component Stage ── */}
      <div className="relative flex min-h-[220px] w-full items-center justify-center overflow-hidden rounded-xl border border-border/40 bg-card/20 p-2.5 shadow-inner backdrop-blur-xs sm:p-8 md:p-10">
        <FlipClock
          key={`${mode}-${stopwatchKey}`}
          mode={mode}
          size={size}
          variant={variant}
          showSeconds={showSeconds}
          showLabels={showLabels}
          sound={sound}
          isPaused={isPaused}
          targetDate={targetTomorrow}
          showDays={true}
          value={counterValue}
          label="VISITORS"
          className={size === "full" ? "w-full max-w-4xl" : undefined}
        />
      </div>

      {/* ── 3. Fine-tuning & Interaction Controls ── */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        {mode === "counter" ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCounterValue((v) => v + 1)}
              className="h-7 text-xs"
            >
              +1
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCounterValue((v) => v + 10)}
              className="h-7 text-xs"
            >
              +10
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCounterValue((v) => v + 100)}
              className="h-7 text-xs"
            >
              +100
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCounterValue((v) => Math.max(0, v - 50))}
              className="h-7 text-xs"
            >
              -50
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSeconds((v) => !v)}
              className={cn(
                "h-7 text-xs transition-colors",
                showSeconds
                  ? "border-primary/50 bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground"
              )}
            >
              Seconds: {showSeconds ? "ON" : "OFF"}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowLabels((v) => !v)}
              className={cn(
                "h-7 text-xs transition-colors",
                showLabels
                  ? "border-primary/50 bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground"
              )}
            >
              Labels: {showLabels ? "ON" : "OFF"}
            </Button>
          </>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setSound((v) => !v)}
          className={cn(
            "h-7 gap-1.5 text-xs transition-colors",
            sound
              ? "border-primary/50 bg-primary/10 font-medium text-primary"
              : "text-muted-foreground"
          )}
        >
          {sound ? (
            <Volume2 className="size-3.5 text-primary" />
          ) : (
            <VolumeX className="size-3.5" />
          )}
          Sound: {sound ? "ON" : "OFF"}
        </Button>

        {(mode === "countdown" || mode === "stopwatch") && (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPaused((p) => !p)}
              className="h-7 gap-1.5 text-xs"
            >
              {isPaused ? (
                <Play className="size-3.5" />
              ) : (
                <Pause className="size-3.5" />
              )}
              {isPaused ? "Resume" : "Pause"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setStopwatchKey((k) => k + 1)
                setIsPaused(false)
              }}
              className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
