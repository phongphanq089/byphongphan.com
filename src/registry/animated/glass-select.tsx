import { Select as SelectPrimitive } from "@base-ui/react/select"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import type React from "react"
import { createContext, useContext, useId } from "react"

import { cn } from "@/shared/lib/utils"

import {
  type GlassPopup,
  type GlassPopupFrom,
  type GlassPopupOpening,
  GlassPopupAnchor,
  GlassPopupSurface,
  OVER_EDGE,
  useGlassPopup,
} from "./liquid-glass/glass-popup"

export type { GlassPopupFrom, GlassPopupOpening }
export type GlassSelectOpening = GlassPopupOpening

export type GlassSelectOption = {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

interface GlassSelectContextValue {
  popup: GlassPopup
  opening: GlassPopupOpening
}

const GlassSelectContext = createContext<GlassSelectContextValue | null>(null)

function useGlassSelectContext() {
  const ctx = useContext(GlassSelectContext)
  if (!ctx) {
    throw new Error(
      "GlassSelect subcomponents must be rendered inside <GlassSelect> or <GlassSelectRoot>."
    )
  }
  return ctx
}

export interface GlassSelectRootProps {
  children: React.ReactNode
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  name?: string
  required?: boolean
  /** Opening physics preset: "stretch" (default), "morph", or "grow". */
  opening?: GlassPopupOpening
  /** With opening="morph", direction the surface arrives from. */
  from?: GlassPopupFrom
  /** Keep popup width aligned to the trigger width. @default true */
  matchWidth?: boolean
}

export function GlassSelectRoot({
  children,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  name,
  required,
  opening = "stretch",
  from = "top",
  matchWidth = true,
}: GlassSelectRootProps) {
  const popup = useGlassPopup({ matchWidth, opening, from })

  return (
    <GlassSelectContext.Provider value={{ popup, opening }}>
      <SelectPrimitive.Root<string>
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next) => onValueChange?.(next ?? null)}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        disabled={disabled}
        name={name}
        required={required}
      >
        {children}
      </SelectPrimitive.Root>
    </GlassSelectContext.Provider>
  )
}

export type GlassSelectTriggerProps = SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default" | "lg"
}

export function GlassSelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: GlassSelectTriggerProps) {
  const { popup } = useGlassSelectContext()

  return (
    <SelectPrimitive.Trigger
      data-slot="glass-select-trigger"
      data-glass-host=""
      data-size={size}
      className={cn(
        "relative flex w-full cursor-pointer items-center justify-between gap-2 rounded-full border border-black/10 bg-white/60 pr-4 pl-5 font-medium text-neutral-900 outline-none select-none",
        "focus-visible:ring-2 focus-visible:ring-[#3291FF] focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "data-[size=default]:h-11 data-[size=default]:text-[15px] data-[size=lg]:h-12 data-[size=lg]:text-[15px] data-[size=sm]:h-9 data-[size=sm]:text-sm",
        "dark:border-white/15 dark:bg-white/10 dark:text-white",
        "data-[glass-tone=dark]:text-white data-[glass-tone=light]:text-neutral-900",
        className
      )}
      {...props}
    >
      <GlassPopupAnchor popup={popup} />
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon
            aria-hidden="true"
            className="pointer-events-none size-4 shrink-0 opacity-60"
          />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

export function GlassSelectValue({
  className,
  ...props
}: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="glass-select-value"
      className={cn("line-clamp-1 flex flex-1 text-left", className)}
      {...props}
    />
  )
}

export type GlassSelectContentProps = SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >

export function GlassSelectContent({
  className,
  children,
  side = "bottom",
  sideOffset,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = false,
  ...props
}: GlassSelectContentProps) {
  const { popup, opening } = useGlassSelectContext()
  const resolvedSideOffset = sideOffset ?? (opening === "morph" ? 0 : 12)

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={resolvedSideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50 outline-none"
      >
        <SelectPrimitive.Popup
          data-slot="glass-select-content"
          data-glass-popup=""
          data-glass-skip=""
          className={cn(
            "relative rounded-3xl p-1.5 text-[15px] text-neutral-900 outline-none",
            "data-[glass-tone=dark]:text-white data-[glass-tone=light]:text-neutral-900",
            opening === "morph" && OVER_EDGE,
            className
          )}
          {...props}
        >
          <GlassPopupSurface popup={popup} />
          <SelectPrimitive.List className="max-h-[min(18rem,calc(var(--available-height)-1rem))] overflow-y-auto rounded-[18px] outline-none">
            {children}
          </SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

export function GlassSelectGroup({
  className,
  ...props
}: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="glass-select-group"
      className={cn("scroll-my-1 p-0.5", className)}
      {...props}
    />
  )
}

export function GlassSelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="glass-select-label"
      className={cn(
        "px-3.5 py-1.5 text-xs font-medium tracking-wide opacity-60",
        className
      )}
      {...props}
    />
  )
}

export function GlassSelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="glass-select-separator"
      className={cn(
        "pointer-events-none mx-2 my-1 h-px bg-black/8 dark:bg-white/12",
        className
      )}
      {...props}
    />
  )
}

export type GlassSelectItemProps = SelectPrimitive.Item.Props & {
  /** Queue index for staggered item reveal inside GlassSelectContent. */
  index?: number
}

export function GlassSelectItem({
  className,
  children,
  index = 0,
  style,
  ...props
}: GlassSelectItemProps) {
  const baseVars: React.CSSProperties & { "--glass-i"?: number } = {
    "--glass-i": index,
  }

  const resolvedStyle: SelectPrimitive.Item.Props["style"] =
    typeof style === "function"
      ? (state) => ({ ...baseVars, ...style(state) })
      : { ...baseVars, ...style }

  return (
    <SelectPrimitive.Item
      data-slot="glass-select-item"
      style={resolvedStyle}
      className={cn(
        "relative flex h-10 cursor-pointer items-center justify-between gap-2 rounded-2xl px-3.5 font-medium outline-none select-none",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40",
        "data-[highlighted]:bg-black/8 dark:data-[highlighted]:bg-white/12",
        "data-[selected]:font-semibold",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="line-clamp-1 flex flex-1 items-center gap-2">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none flex size-4 shrink-0 items-center justify-center">
            <CheckIcon aria-hidden="true" className="size-3.5" />
          </span>
        }
      />
    </SelectPrimitive.Item>
  )
}

export type GlassSelectProps = {
  label?: React.ReactNode
  options: GlassSelectOption[]
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  name?: string
  required?: boolean
  opening?: GlassPopupOpening
  from?: GlassPopupFrom
  matchWidth?: boolean
  size?: "sm" | "default" | "lg"
  className?: string
  triggerClassName?: string
  contentClassName?: string
}

/**
 * Liquid Glass Select built natively on `@base-ui/react/select` and the
 * shared WebGL2 SDF liquid-glass engine (`liquid-glass/glass-popup`).
 */
export function GlassSelect({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Pick an option",
  disabled,
  name,
  required,
  opening = "stretch",
  from = "top",
  matchWidth = true,
  size = "default",
  className,
  triggerClassName,
  contentClassName,
}: GlassSelectProps) {
  const triggerId = useId()

  return (
    <GlassSelectRoot
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
      required={required}
      opening={opening}
      from={from}
      matchWidth={matchWidth}
    >
      <div className={cn("flex w-64 flex-col gap-2", className)}>
        {label && (
          <label
            htmlFor={triggerId}
            className="text-sm font-medium text-neutral-900 select-none dark:text-white"
          >
            {label}
          </label>
        )}
        <GlassSelectTrigger
          id={triggerId}
          size={size}
          className={triggerClassName}
        >
          <GlassSelectValue placeholder={placeholder} />
        </GlassSelectTrigger>
      </div>

      <GlassSelectContent className={contentClassName}>
        {options.map((option, index) => (
          <GlassSelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            index={index}
          >
            {option.label}
          </GlassSelectItem>
        ))}
      </GlassSelectContent>
    </GlassSelectRoot>
  )
}

export default GlassSelect
