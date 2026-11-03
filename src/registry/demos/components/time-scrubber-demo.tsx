import {
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Gauge,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
} from "lucide-react"
import React, { useState } from "react"

import {
  TimeScrubber,
  type TimeScrubberVariant,
  getMinutesFromMidnight,
  getSecondsFromMidnight,
} from "@/registry/animated/time-scrubber"
import { Button } from "@/registry/ui/button"
import { cn } from "@/shared/lib/utils"

export function TimeScrubberDemo() {
  const [showSeconds, setShowSeconds] = useState<boolean>(true)
  const [fullWidth, setFullWidth] = useState<boolean>(false)
  const [step, setStep] = useState<number>(5)
  const [format, setFormat] = useState<"12h" | "24h">("12h")
  const [sound, setSound] = useState<boolean>(false)
  const [live, setLive] = useState<boolean>(true)
  const [tickMode, setTickMode] = useState<"smooth" | "step">("smooth")
  const [momentum, setMomentum] = useState<number>(50)
  const [variant, setVariant] = useState<TimeScrubberVariant>("default")
  const [scrubberKey, setScrubberKey] = useState<number>(0)
  const [startTime, setStartTime] = useState<number | undefined>(undefined)
  const [readout, setReadout] = useState<{
    time: string
    mer: string
    hours: number
    mins: number
    secs: number
  }>({
    time: "09:30:00",
    mer: "AM",
    hours: 9,
    mins: 30,
    secs: 0,
  })

  const jumpTo = (secsOrMins: number) => {
    setStartTime(secsOrMins)
    setScrubberKey((k) => k + 1)
  }

  const jumpToNow = () => {
    setStartTime(undefined)
    setScrubberKey((k) => k + 1)
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 px-2 py-8 sm:px-6">
      {/* ── 1. Interactive Controls Toolbar ── */}
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-border/60 bg-card/60 p-2 shadow-xs backdrop-blur-md">
        {/* Seconds Toggle */}
        <Button
          type="button"
          variant={showSeconds ? "secondary" : "ghost"}
          size="sm"
          onClick={() => {
            const next = !showSeconds
            setShowSeconds(next)
            setStep(next ? 5 : 15)
            setScrubberKey((k) => k + 1)
          }}
          className="h-7 gap-1 px-2.5 text-xs font-medium"
        >
          <Clock className="size-3.5 text-red-500" />
          <span>Seconds</span>
        </Button>

        {/* Full-width Toggle */}
        <Button
          type="button"
          variant={fullWidth ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setFullWidth(!fullWidth)}
          className="h-7 gap-1 px-2.5 text-xs font-medium"
        >
          {fullWidth ? (
            <Minimize2 className="size-3.5" />
          ) : (
            <Maximize2 className="size-3.5" />
          )}
          <span className="hidden sm:inline">
            {fullWidth ? "Compact" : "Full Width"}
          </span>
        </Button>

        {/* Step Selector */}
        <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-muted/40 p-1">
          <span className="px-1.5 font-mono text-[10px] font-semibold text-muted-foreground uppercase">
            Step
          </span>
          {(showSeconds ? [1, 5, 15, 30, 60] : [1, 5, 15, 30, 60]).map((s) => (
            <Button
              key={s}
              type="button"
              variant={step === s ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setStep(s)}
              className="h-7 px-2 font-mono text-xs"
            >
              {s}
              {showSeconds ? "s" : "m"}
            </Button>
          ))}
        </div>

        {/* Motion Style Toggle (when seconds enabled) */}
        {showSeconds && (
          <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-muted/40 p-1">
            <Button
              type="button"
              variant={tickMode === "smooth" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTickMode("smooth")}
              className="h-7 px-2 text-xs font-medium"
              title="Continuous 60fps sweep"
            >
              Smooth
            </Button>
            <Button
              type="button"
              variant={tickMode === "step" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTickMode("step")}
              className="h-7 px-2 text-xs font-medium"
              title="Step hop per second"
            >
              Step
            </Button>
          </div>
        )}

        {/* Format Selector */}
        <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-muted/40 p-1">
          <Button
            type="button"
            variant={format === "12h" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFormat("12h")}
            className="h-7 px-2.5 text-xs font-medium"
          >
            12H
          </Button>
          <Button
            type="button"
            variant={format === "24h" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFormat("24h")}
            className="h-7 px-2.5 text-xs font-medium"
          >
            24H
          </Button>
        </div>

        {/* Sound Toggle */}
        <Button
          type="button"
          variant={sound ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setSound(!sound)}
          className="h-7 gap-1 px-2.5 text-xs font-medium"
          title={sound ? "Mute audio clicks" : "Enable mechanical audio clicks"}
        >
          {sound ? (
            <Volume2 className="size-3.5 text-emerald-500" />
          ) : (
            <VolumeX className="size-3.5 text-muted-foreground" />
          )}
          <span className="hidden sm:inline">Sound</span>
        </Button>

        {/* Live Auto-tick Toggle */}
        <Button
          type="button"
          variant={live ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setLive(!live)}
          className="h-7 gap-1.5 px-2.5 text-xs font-medium"
        >
          <span
            className={cn(
              "size-1.5 rounded-full transition",
              live ? "animate-pulse bg-emerald-500" : "bg-muted-foreground"
            )}
          />
          <span className="hidden sm:inline">Live</span>
        </Button>
      </div>

      {/* ── 2. Time Jump Presets Bar ── */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <span className="mr-1 font-mono text-[11px] text-muted-foreground">
          Quick Jump:
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={jumpToNow}
          className="h-6 gap-1 px-2 font-mono text-[11px]"
        >
          <RotateCcw className="size-3" />
          Now
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => jumpTo(showSeconds ? 9 * 3600 : 540)}
          className="h-6 px-2 font-mono text-[11px]"
        >
          09:00 AM
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => jumpTo(showSeconds ? 12 * 3600 : 720)}
          className="h-6 px-2 font-mono text-[11px]"
        >
          12:00 PM
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => jumpTo(showSeconds ? 18 * 3600 + 30 * 60 : 1110)}
          className="h-6 px-2 font-mono text-[11px]"
        >
          06:30 PM
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => jumpTo(0)}
          className="h-6 px-2 font-mono text-[11px]"
        >
          12:00 AM
        </Button>
      </div>

      {/* ── 3. The Live Component Stage ── */}
      <div
        className={cn(
          "flex flex-col items-center justify-center p-4",
          fullWidth ? "w-full max-w-5xl" : "w-auto"
        )}
      >
        <TimeScrubber
          key={scrubberKey}
          start={startTime}
          showSeconds={showSeconds}
          fullWidth={fullWidth}
          tickMode={tickMode}
          step={step}
          format={format}
          momentum={momentum}
          sound={sound}
          live={live}
          variant={variant}
          showReset={true}
          onChange={(val, res) => setReadout(res)}
          className={cn("shadow-xl", fullWidth && "w-full")}
        />

        <div className="mt-4 flex flex-col items-center gap-1">
          <p className="text-center font-mono text-xs text-muted-foreground">
            {showSeconds
              ? "Live continuous ruler advancing with each second · Drag to scrub"
              : "Scrub horizontally or swipe trackpad · Fling to throw and coast"}
          </p>
          <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground/80">
            <span>
              Time: {readout.time} {readout.mer}
            </span>
            <span>·</span>
            <span>
              Step: {step}
              {showSeconds ? "s" : "m"}
            </span>
            <span>·</span>
            <span>Fling: {momentum}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
