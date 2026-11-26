import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react"

import { cn } from "@/shared/lib/utils"
import { Switch } from "@/shared/ui/core"

import type { StudioControlSchema, StudioControlValue } from "../model/types"

interface StudioPropsCustomizerProps {
  controls: StudioControlSchema[]
  values: Record<string, StudioControlValue>
  onChange: (key: string, value: StudioControlValue) => void
  onReset: () => void
  className?: string
}

/**
 * "Universal engine": derives sliders, switches, selects and color inputs
 * from a control schema emitted alongside a component (none of the current
 * registry entries ship one yet — the panel stays hidden until they do).
 */
export function StudioPropsCustomizer({
  controls,
  values,
  onChange,
  onReset,
  className,
}: StudioPropsCustomizerProps) {
  if (controls.length === 0) return null

  return (
    <div
      className={cn(
        "pointer-events-auto absolute bottom-3 left-3 z-10 w-56 rounded-xl border border-border/70 bg-background/90 p-3 shadow-lg backdrop-blur-md",
        className
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground/70 uppercase">
          Props
        </p>
        <button
          type="button"
          onClick={onReset}
          aria-label="Reset props"
          className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          <ArrowCounterClockwiseIcon size={13} aria-hidden="true" />
        </button>
      </div>

      <div className="flex max-h-56 flex-col gap-2.5 overflow-y-auto">
        {controls.map((control) => (
          <label
            key={control.key}
            className="flex flex-col gap-1 text-[11px] text-muted-foreground"
          >
            <span className="flex items-center justify-between gap-2">
              <span className="truncate">{control.label}</span>
              <span className="font-mono text-[9px] text-muted-foreground/70 tabular-nums">
                {String(values[control.key] ?? control.default)}
                {control.unit ?? ""}
              </span>
            </span>
            {renderControl(control, values, onChange)}
          </label>
        ))}
      </div>
    </div>
  )
}

function renderControl(
  control: StudioControlSchema,
  values: Record<string, StudioControlValue>,
  onChange: (key: string, value: StudioControlValue) => void
) {
  const value = values[control.key] ?? control.default

  switch (control.type) {
    case "slider":
      return (
        <input
          type="range"
          min={control.min ?? 0}
          max={control.max ?? 100}
          step={control.step ?? 1}
          value={Number(value)}
          onChange={(event) =>
            onChange(control.key, event.target.valueAsNumber)
          }
          className="h-1.5 w-full cursor-pointer accent-primary"
        />
      )
    case "boolean":
      return (
        <Switch
          checked={Boolean(value)}
          onCheckedChange={(checked) => onChange(control.key, checked)}
          aria-label={control.label}
        />
      )
    case "select":
      return (
        <select
          value={String(value)}
          onChange={(event) => onChange(control.key, event.target.value)}
          className={cn(
            "h-7 rounded-md border border-border/70 bg-background px-1.5 text-[11px] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
          )}
        >
          {(control.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )
    case "color":
      return (
        <input
          type="color"
          value={String(value)}
          onChange={(event) => onChange(control.key, event.target.value)}
          className="h-7 w-full cursor-pointer rounded-md border border-border/70 bg-transparent"
        />
      )
    case "color-palette":
      return (
        <div className="flex flex-wrap gap-1.5">
          {(control.options ?? []).map((option) => {
            const isActive = value === option
            return (
              <button
                key={option}
                type="button"
                onClick={() => onChange(control.key, option)}
                aria-pressed={isActive}
                aria-label={option}
                className={cn(
                  "size-5 rounded-full border border-border/60 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                  isActive && "ring-2 ring-pp-primary ring-offset-1"
                )}
                style={{ backgroundColor: option }}
              />
            )
          })}
        </div>
      )
    case "text":
      return (
        <input
          type="text"
          value={String(value)}
          onChange={(event) => onChange(control.key, event.target.value)}
          className="h-7 rounded-md border border-border/70 bg-background px-1.5 text-[11px] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      )
    default:
      return null
  }
}
