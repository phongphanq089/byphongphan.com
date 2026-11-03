import type React from "react"

import type { HookSchematicType } from "../../schema"
import { ClickOutsideSchematic } from "./click-outside-schematic"
import { CopyToClipboardSchematic } from "./copy-to-clipboard-schematic"
import { DebounceSchematic } from "./debounce-schematic"
import { HoverSchematic } from "./hover-schematic"
import { IntersectionObserverSchematic } from "./intersection-observer-schematic"
import { LocalStorageSchematic } from "./local-storage-schematic"
import { MediaQuerySchematic } from "./media-query-schematic"
import { PreventBodyScrollSchematic } from "./prevent-body-scroll-schematic"
import { PreviousSchematic } from "./previous-schematic"
import { ScrollPositionSchematic } from "./scroll-position-schematic"
import { ToggleSchematic } from "./toggle-schematic"
import { NetworkSchematic } from "./network-schematic"
import { PageLeaveSchematic } from "./page-leave-schematic"
import { IsFirstRenderSchematic } from "./is-first-render-schematic"
import { SelectionSchematic } from "./selection-schematic"
import { PaginationSchematic } from "./pagination-schematic"
import { StateHistorySchematic } from "./state-history-schematic"
import { MapHookSchematic, UseMapSchematic } from "./map-hook-schematic"
import { ListStateSchematic } from "./list-state-schematic"

export * from "./click-outside-schematic"
export * from "./media-query-schematic"
export * from "./copy-to-clipboard-schematic"
export * from "./intersection-observer-schematic"
export * from "./debounce-schematic"
export * from "./local-storage-schematic"
export * from "./toggle-schematic"
export * from "./previous-schematic"
export * from "./hover-schematic"
export * from "./prevent-body-scroll-schematic"
export * from "./scroll-position-schematic"
export * from "./network-schematic"
export * from "./page-leave-schematic"
export * from "./is-first-render-schematic"
export * from "./state-history-schematic"
export * from "./selection-schematic"
export * from "./pagination-schematic"
export * from "./map-hook-schematic"
export * from "./list-state-schematic"

export function DefaultHookSchematic() {
  return (
    <div className="flex h-20 w-32 flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-2 text-center font-sans select-none">
      <div className="size-4 rounded-full border border-white/20 bg-white/5" />
      <div className="h-1.5 w-12 rounded-full bg-white/20" />
    </div>
  )
}

export const HOOK_SCHEMATICS_MAP: Record<
  HookSchematicType,
  React.ComponentType
> = {
  "click-outside": ClickOutsideSchematic,
  "media-query": MediaQuerySchematic,
  "copy-to-clipboard": CopyToClipboardSchematic,
  "intersection-observer": IntersectionObserverSchematic,
  debounce: DebounceSchematic,
  "local-storage": LocalStorageSchematic,
  toggle: ToggleSchematic,
  previous: PreviousSchematic,
  hover: HoverSchematic,
  "prevent-body-scroll": PreventBodyScrollSchematic,
  "scroll-position": ScrollPositionSchematic,
  network: NetworkSchematic,
  "page-leave": PageLeaveSchematic,
  "is-first-render": IsFirstRenderSchematic,
  "state-history": StateHistorySchematic,
  selection: SelectionSchematic,
  pagination: PaginationSchematic,
  map: MapHookSchematic,
  "list-state": ListStateSchematic,
}

export function RenderHookSchematic({ type }: { type?: string }) {
  if (!type) return <DefaultHookSchematic />
  const Component = HOOK_SCHEMATICS_MAP[type as HookSchematicType]
  if (!Component) return <DefaultHookSchematic />
  return <Component />
}
