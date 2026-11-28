# Glass Dropdown Menu

> WebGL2 SDF liquid glass dropdown menu built natively on @base-ui/react/menu: the menu swells out of its trigger on a stretching neck, morphs, or grows smoothly.

## Installation

  

  ```bash
npx shadcn@latest add https://byphongphan.com/r/glass-dropdown-menu.json
```

  
    
      - Install required dependencies:
      ```bash
npm install @base-ui/react lucide-react
```

      - Copy and paste the component into your project:
      ```tsx
// animated/glass-dropdown-menu.tsx
"use client"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { CheckIcon, ChevronRightIcon } from "lucide-react"
import type * as React from "react"
import { createContext, useContext } from "react"

import { cn } from "@/lib/utils"

import { GlassCard } from "./liquid-glass/glass-card"
import {
  type GlassPopupFrom,
  type GlassPopupOpening,
  GlassPopupAnchor,
  GlassPopupContext,
  GlassPopupSurface,
  OVER_EDGE,
  spellLabel,
  useGlassPopup,
} from "./liquid-glass/glass-popup"

export type { GlassPopupFrom, GlassPopupOpening }
export type GlassDropdownMenuOpening = GlassPopupOpening

export const GlassDropdownMenuCreateHandle: typeof MenuPrimitive.createHandle =
  MenuPrimitive.createHandle

const GlassDropdownMenuOpeningContext =
  createContext<GlassPopupOpening>("stretch")

const ROW_CLASS =
  "relative flex h-10 cursor-pointer items-center gap-2.5 rounded-2xl px-3.5 font-medium whitespace-nowrap outline-none select-none transition-colors duration-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 data-[highlighted]:bg-current/10 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&>svg:not([class*='opacity-'])]:opacity-80"

const SURFACE_CLASS =
  "min-w-48 rounded-3xl p-1.5 text-[15px] text-neutral-900 outline-none data-[glass-tone=dark]:text-white data-[glass-tone=light]:text-neutral-900"

export type GlassDropdownMenuProps = MenuPrimitive.Root.Props & {
  /** Opening physics preset: "stretch" (default), "morph", or "grow". */
  opening?: GlassPopupOpening
  /** With opening="morph", direction the surface arrives from. */
  from?: GlassPopupFrom
  /** Keep popup width aligned to the trigger width. @default false */
  matchWidth?: boolean
}

/**
 * Liquid Glass Dropdown Menu built natively on `@base-ui/react/menu` and the
 * shared WebGL2 SDF liquid-glass engine (`liquid-glass/glass-popup`).
 */
export function GlassDropdownMenu({
  opening = "stretch",
  from = "top",
  matchWidth = false,
  ...props
}: GlassDropdownMenuProps): React.ReactElement {
  const popup = useGlassPopup({ matchWidth, opening, from })

  return (
    <GlassDropdownMenuOpeningContext.Provider value={opening}>
      <GlassPopupContext.Provider value={popup}>
        <MenuPrimitive.Root data-slot="glass-dropdown-menu" {...props} />
      </GlassPopupContext.Provider>
    </GlassDropdownMenuOpeningContext.Provider>
  )
}

export const GlassDropdownMenuPortal: typeof MenuPrimitive.Portal =
  MenuPrimitive.Portal

export type GlassDropdownMenuTriggerProps = MenuPrimitive.Trigger.Props & {
  size?: "sm" | "default" | "lg"
  /** Use "morph" if the parent GlassDropdownMenu uses opening="morph" for letter-by-letter label reveal. */
  opening?: GlassPopupOpening
}

export function GlassDropdownMenuTrigger({
  className,
  size = "default",
  opening,
  children,
  ...props
}: GlassDropdownMenuTriggerProps): React.ReactElement {
  const popup = useContext(GlassPopupContext)
  const inheritedOpening = useContext(GlassDropdownMenuOpeningContext)
  const resolvedOpening = opening ?? inheritedOpening

  return (
    <MenuPrimitive.Trigger
      data-slot="glass-dropdown-menu-trigger"
      data-glass-host=""
      data-size={size}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-black/10 bg-white/60 px-5 font-medium whitespace-nowrap text-neutral-900 outline-none select-none",
        "focus-visible:ring-2 focus-visible:ring-[#3291FF] focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "data-[size=default]:h-11 data-[size=default]:text-[15px] data-[size=lg]:h-12 data-[size=lg]:text-[15px] data-[size=sm]:h-9 data-[size=sm]:px-4 data-[size=sm]:text-sm",
        "dark:border-white/15 dark:bg-white/10 dark:text-white",
        "data-[glass-tone=dark]:text-white data-[glass-tone=light]:text-neutral-900",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {popup && <GlassPopupAnchor popup={popup} />}
      <span className="inline-flex items-center gap-[inherit]">
        {resolvedOpening === "morph" ? spellLabel(children) : children}
      </span>
    </MenuPrimitive.Trigger>
  )
}

export type GlassDropdownMenuContentProps = MenuPrimitive.Popup.Props & {
  align?: MenuPrimitive.Positioner.Props["align"]
  sideOffset?: MenuPrimitive.Positioner.Props["sideOffset"]
  alignOffset?: MenuPrimitive.Positioner.Props["alignOffset"]
  side?: MenuPrimitive.Positioner.Props["side"]
  anchor?: MenuPrimitive.Positioner.Props["anchor"]
  portalProps?: MenuPrimitive.Portal.Props
  /** Override the opening mode inherited from GlassDropdownMenu. */
  opening?: GlassPopupOpening
}

export function GlassDropdownMenuContent({
  children,
  className,
  sideOffset,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  anchor,
  portalProps,
  opening,
  ...props
}: GlassDropdownMenuContentProps): React.ReactElement {
  const popup = useContext(GlassPopupContext)
  const inheritedOpening = useContext(GlassDropdownMenuOpeningContext)
  const resolvedOpening = opening ?? inheritedOpening
  const resolvedSideOffset =
    sideOffset ??
    (resolvedOpening === "morph" ? 0 : resolvedOpening === "grow" ? 8 : 12)

  return (
    <GlassDropdownMenuPortal {...portalProps}>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50 outline-none"
        data-slot="glass-dropdown-menu-positioner"
        side={side}
        sideOffset={resolvedSideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="glass-dropdown-menu-content"
          data-glass-popup=""
          data-glass-skip=""
          className={cn(
            "group/glass relative",
            SURFACE_CLASS,
            resolvedOpening === "morph" && OVER_EDGE,
            className
          )}
          {...props}
        >
          {popup && <GlassPopupSurface popup={popup} />}
          {/* Submenus use their own GlassCard surface, independent of the root popup context. */}
          <GlassPopupContext.Provider value={null}>
            <div data-glass-list="" className="flex flex-col">
              {children}
            </div>
          </GlassPopupContext.Provider>
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </GlassDropdownMenuPortal>
  )
}

export function GlassDropdownMenuGroup({
  className,
  ...props
}: MenuPrimitive.Group.Props): React.ReactElement {
  return (
    <MenuPrimitive.Group
      data-slot="glass-dropdown-menu-group"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

export function GlassDropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean
}): React.ReactElement {
  return (
    <MenuPrimitive.GroupLabel
      data-inset={inset}
      data-slot="glass-dropdown-menu-label"
      className={cn(
        "px-3.5 pt-2 pb-1 text-xs font-medium opacity-55 select-none data-inset:ps-9",
        className
      )}
      {...props}
    />
  )
}

export function GlassDropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props): React.ReactElement {
  return (
    <MenuPrimitive.Separator
      data-slot="glass-dropdown-menu-separator"
      className={cn("mx-3.5 my-1 h-px shrink-0 bg-current/15", className)}
      {...props}
    />
  )
}

export function GlassDropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"kbd">): React.ReactElement {
  return (
    <kbd
      data-slot="glass-dropdown-menu-shortcut"
      className={cn(
        "ms-auto pl-6 font-sans text-[13px] font-normal tracking-wide opacity-50",
        className
      )}
      {...props}
    />
  )
}

function resolveGlassItemStyle<TState>(
  index: number,
  style:
    | React.CSSProperties
    | ((state: TState) => React.CSSProperties | undefined)
    | undefined
): React.CSSProperties | ((state: TState) => React.CSSProperties) {
  const baseVars: React.CSSProperties & { "--glass-i"?: number } = {
    "--glass-i": index,
  }

  return typeof style === "function"
    ? (state: TState) => ({ ...baseVars, ...style(state) })
    : { ...baseVars, ...style }
}

export type GlassDropdownMenuItemProps = MenuPrimitive.Item.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
  /** Queue index for staggered item reveal inside GlassDropdownMenuContent. */
  index?: number
}

export function GlassDropdownMenuItem({
  className,
  inset,
  variant = "default",
  index = 0,
  style,
  ...props
}: GlassDropdownMenuItemProps): React.ReactElement {
  return (
    <MenuPrimitive.Item
      data-inset={inset}
      data-variant={variant}
      data-slot="glass-dropdown-menu-item"
      data-glass-item=""
      style={resolveGlassItemStyle(index, style)}
      className={cn(
        ROW_CLASS,
        "data-inset:ps-9",
        "data-[variant=destructive]:text-red-600 group-data-[glass-tone=dark]/glass:data-[variant=destructive]:text-red-400",
        "data-[variant=destructive]:data-[highlighted]:bg-red-500/12",
        className
      )}
      {...props}
    />
  )
}

export type GlassDropdownMenuLinkItemProps = MenuPrimitive.LinkItem.Props & {
  inset?: boolean
  variant?: "default" | "destructive"
  /** Queue index for staggered item reveal inside GlassDropdownMenuContent. */
  index?: number
}

export function GlassDropdownMenuLinkItem({
  className,
  inset,
  variant = "default",
  closeOnClick = true,
  index = 0,
  style,
  ...props
}: GlassDropdownMenuLinkItemProps): React.ReactElement {
  return (
    <MenuPrimitive.LinkItem
      closeOnClick={closeOnClick}
      data-inset={inset}
      data-variant={variant}
      data-slot="glass-dropdown-menu-link-item"
      data-glass-item=""
      style={resolveGlassItemStyle(index, style)}
      className={cn(
        ROW_CLASS,
        "data-inset:ps-9",
        "data-[variant=destructive]:text-red-600 group-data-[glass-tone=dark]/glass:data-[variant=destructive]:text-red-400",
        "data-[variant=destructive]:data-[highlighted]:bg-red-500/12",
        className
      )}
      {...props}
    />
  )
}

export type GlassDropdownMenuCheckboxItemProps =
  MenuPrimitive.CheckboxItem.Props & {
    variant?: "default" | "switch"
    /** Queue index for staggered item reveal inside GlassDropdownMenuContent. */
    index?: number
  }

export function GlassDropdownMenuCheckboxItem({
  className,
  children,
  checked,
  variant = "default",
  index = 0,
  style,
  ...props
}: GlassDropdownMenuCheckboxItemProps): React.ReactElement {
  return (
    <MenuPrimitive.CheckboxItem
      checked={checked}
      data-slot="glass-dropdown-menu-checkbox-item"
      data-glass-item=""
      style={resolveGlassItemStyle(index, style)}
      className={cn(
        ROW_CLASS,
        variant === "switch" && "justify-between gap-4 pe-2.5",
        className
      )}
      {...props}
    >
      {variant === "switch" ? (
        <>
          <span className="truncate">{children}</span>
          <MenuPrimitive.CheckboxItemIndicator
            className="inline-flex h-5 w-8.5 shrink-0 items-center rounded-full bg-current/20 p-0.5 transition-colors duration-200 outline-none data-checked:bg-current/85 data-disabled:opacity-60"
            keepMounted
          >
            <span className="pointer-events-none block size-4 rounded-full bg-white shadow-sm transition-transform duration-150 dark:bg-neutral-950 in-[[data-slot=glass-dropdown-menu-checkbox-item][data-checked]]:translate-x-3.5" />
          </MenuPrimitive.CheckboxItemIndicator>
        </>
      ) : (
        <>
          <span className="truncate">{children}</span>
          <MenuPrimitive.CheckboxItemIndicator className="ms-auto pl-4">
            <CheckIcon aria-hidden="true" className="size-3.5" />
          </MenuPrimitive.CheckboxItemIndicator>
        </>
      )}
    </MenuPrimitive.CheckboxItem>
  )
}

export function GlassDropdownMenuRadioGroup({
  className,
  ...props
}: MenuPrimitive.RadioGroup.Props): React.ReactElement {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="glass-dropdown-menu-radio-group"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

export type GlassDropdownMenuRadioItemProps = MenuPrimitive.RadioItem.Props & {
  /** Queue index for staggered item reveal inside GlassDropdownMenuContent. */
  index?: number
}

export function GlassDropdownMenuRadioItem({
  className,
  children,
  index = 0,
  style,
  ...props
}: GlassDropdownMenuRadioItemProps): React.ReactElement {
  return (
    <MenuPrimitive.RadioItem
      data-slot="glass-dropdown-menu-radio-item"
      data-glass-item=""
      style={resolveGlassItemStyle(index, style)}
      className={cn(ROW_CLASS, className)}
      {...props}
    >
      <span className="truncate">{children}</span>
      <MenuPrimitive.RadioItemIndicator className="ms-auto pl-4">
        <span aria-hidden className="block size-2 rounded-full bg-current" />
      </MenuPrimitive.RadioItemIndicator>
    </MenuPrimitive.RadioItem>
  )
}

export function GlassDropdownMenuSub(
  props: MenuPrimitive.SubmenuRoot.Props
): React.ReactElement {
  return (
    <MenuPrimitive.SubmenuRoot
      data-slot="glass-dropdown-menu-sub"
      {...props}
    />
  )
}

export type GlassDropdownMenuSubTriggerProps =
  MenuPrimitive.SubmenuTrigger.Props & {
    inset?: boolean
    /** Queue index for staggered item reveal inside GlassDropdownMenuContent. */
    index?: number
  }

export function GlassDropdownMenuSubTrigger({
  className,
  inset,
  index = 0,
  style,
  children,
  ...props
}: GlassDropdownMenuSubTriggerProps): React.ReactElement {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-inset={inset}
      data-slot="glass-dropdown-menu-sub-trigger"
      data-glass-item=""
      style={resolveGlassItemStyle(index, style)}
      className={cn(
        ROW_CLASS,
        "data-inset:ps-9 data-popup-open:bg-current/10",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon
        aria-hidden="true"
        className="ms-auto size-4 opacity-50 rtl:-scale-x-100"
      />
    </MenuPrimitive.SubmenuTrigger>
  )
}

export type GlassDropdownMenuSubContentProps = MenuPrimitive.Popup.Props & {
  align?: MenuPrimitive.Positioner.Props["align"]
  sideOffset?: MenuPrimitive.Positioner.Props["sideOffset"]
  alignOffset?: MenuPrimitive.Positioner.Props["alignOffset"]
  side?: MenuPrimitive.Positioner.Props["side"]
  portalProps?: MenuPrimitive.Portal.Props
}

export function GlassDropdownMenuSubContent({
  className,
  children,
  sideOffset = 14,
  alignOffset = -6,
  align = "start",
  side = "inline-end",
  portalProps,
  ...props
}: GlassDropdownMenuSubContentProps): React.ReactElement {
  return (
    <MenuPrimitive.Portal {...portalProps}>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50 outline-none"
        data-slot="glass-dropdown-menu-sub-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="glass-dropdown-menu-sub-content"
          data-glass-skip=""
          render={
            <GlassCard
              className={cn(
                "group/glass",
                SURFACE_CLASS,
                "overflow-visible! transition-[opacity,scale] duration-150 ease-out data-ending-style:scale-[0.97] data-ending-style:opacity-0 data-starting-style:scale-[0.97] data-starting-style:opacity-0 motion-reduce:scale-100!",
                className
              )}
            />
          }
          {...props}
        >
          <div className="flex flex-col">{children}</div>
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

export default GlassDropdownMenu

```

      - Update the import paths to match your project directory structure.
    

  

---

## Usage

```tsx
import {
  GlassDropdownMenu,
  GlassDropdownMenuContent,
  GlassDropdownMenuItem,
  GlassDropdownMenuSeparator,
  GlassDropdownMenuTrigger,
} from "@/components/glass-dropdown-menu"
```

```tsx
export function ActionsMenu() {
  return (
    <GlassDropdownMenu opening="stretch">
      <GlassDropdownMenuTrigger>Actions</GlassDropdownMenuTrigger>
      <GlassDropdownMenuContent>
        <GlassDropdownMenuItem index={0}>Profile</GlassDropdownMenuItem>
        <GlassDropdownMenuItem index={1}>Settings</GlassDropdownMenuItem>
        <GlassDropdownMenuSeparator />
        <GlassDropdownMenuItem index={2} variant="destructive">
          Delete
        </GlassDropdownMenuItem>
      </GlassDropdownMenuContent>
    </GlassDropdownMenu>
  )
}
```

---

## Features

- **Native `@base-ui/react/menu` Accessibility**: Full keyboard navigation, typeahead, checkbox/switch items, radio groups, link items, and nested submenus.
- **Three Opening Modes**: Choose between `stretch` (spring emergence from the anchor edge), `morph` (pill-to-card morph over the trigger with letter-by-letter label return), and `grow` (smooth anchor expansion).
- **WebGL2 SDF Liquid Glass (Menu & Submenu)**: Root menus use `liquid-glass/glass-popup` and nested submenus render on `GlassCard` for consistent real-time refraction, pointer-driven surface light, and graceful CSS fallback when WebGL2 is unavailable.
- **Staggered Item Reveal**: Menu items cascade smoothly on open via `--glass-i` and exit cleanly with Base UI `data-ending-style`.

---

## API Reference

### GlassDropdownMenu

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `opening` | `"stretch" \| "morph" \| "grow"` | `"stretch"` | Opening transition preset. |
| `from` | `"top" \| "bottom"` | `"top"` | Direction the surface arrives from when `opening="morph"`. |
| `matchWidth` | `boolean` | `false` | Match popup width to the trigger width. |
| `open` | `boolean` | `undefined` | Controlled open state. |
| `defaultOpen` | `boolean` | `false` | Initial uncontrolled open state. |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback fired when the open state changes. |
