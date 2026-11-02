import type { HookSchematicType } from "../../types"
import { ClickOutsidePreview } from "./click-outside-preview"
import { CopyToClipboardPreview } from "./copy-to-clipboard-preview"
import { DebouncePreview } from "./debounce-preview"
import { IntersectionObserverPreview } from "./intersection-observer-preview"
import { LocalStoragePreview } from "./local-storage-preview"
import { MediaQueryPreview } from "./media-query-preview"
import { PreviousPreview } from "./previous-preview"
import { TogglePreview } from "./toggle-preview"

export function RenderHookSchematic({ type }: { type: HookSchematicType }) {
  switch (type) {
    case "click-outside":
      return <ClickOutsidePreview />
    case "media-query":
      return <MediaQueryPreview />
    case "copy-to-clipboard":
      return <CopyToClipboardPreview />
    case "intersection-observer":
      return <IntersectionObserverPreview />
    case "debounce":
      return <DebouncePreview />
    case "local-storage":
      return <LocalStoragePreview />
    case "toggle":
      return <TogglePreview />
    case "previous":
      return <PreviousPreview />
    default:
      return null
  }
}

export * from "./click-outside-preview"
export * from "./copy-to-clipboard-preview"
export * from "./debounce-preview"
export * from "./intersection-observer-preview"
export * from "./local-storage-preview"
export * from "./media-query-preview"
export * from "./previous-preview"
export * from "./toggle-preview"
