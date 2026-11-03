import type { ComponentType } from "react"

import { lazyWithRetry } from "@/shared/lib/lazy-with-retry"

export const UseClickOutsideDemo = lazyWithRetry(() =>
  import("./use-click-outside-demo").then((m) => ({
    default: m.UseClickOutsideDemo,
  }))
)
export const UseMediaQueryDemo = lazyWithRetry(() =>
  import("./use-media-query-demo").then((m) => ({
    default: m.UseMediaQueryDemo,
  }))
)
export const UseCopyToClipboardDemo = lazyWithRetry(() =>
  import("./use-copy-to-clipboard-demo").then((m) => ({
    default: m.UseCopyToClipboardDemo,
  }))
)
export const UseIntersectionObserverDemo = lazyWithRetry(() =>
  import("./use-intersection-observer-demo").then((m) => ({
    default: m.UseIntersectionObserverDemo,
  }))
)
export const UseDebounceDemo = lazyWithRetry(() =>
  import("./use-debounce-demo").then((m) => ({
    default: m.UseDebounceDemo,
  }))
)
export const UseLocalStorageDemo = lazyWithRetry(() =>
  import("./use-local-storage-demo").then((m) => ({
    default: m.UseLocalStorageDemo,
  }))
)
export const UseToggleDemo = lazyWithRetry(() =>
  import("./use-toggle-demo").then((m) => ({
    default: m.UseToggleDemo,
  }))
)
export const UsePreviousDemo = lazyWithRetry(() =>
  import("./use-previous-demo").then((m) => ({
    default: m.UsePreviousDemo,
  }))
)
export const UseHoverDemo = lazyWithRetry(() =>
  import("./use-hover-demo").then((m) => ({
    default: m.UseHoverDemo,
  }))
)
export const UsePreventBodyScrollDemo = lazyWithRetry(() =>
  import("./use-prevent-body-scroll-demo").then((m) => ({
    default: m.UsePreventBodyScrollDemo,
  }))
)
export const UseScrollPositionDemo = lazyWithRetry(() =>
  import("./use-scroll-position-demo").then((m) => ({
    default: m.UseScrollPositionDemo,
  }))
)

export const UseNetworkDemo = lazyWithRetry(() =>
  import("./use-network-demo").then((m) => ({
    default: m.UseNetworkDemo,
  }))
)

export const UsePageLeaveDemo = lazyWithRetry(() =>
  import("./use-page-leave-demo").then((m) => ({
    default: m.UsePageLeaveDemo,
  }))
)

export const UseIsFirstRenderDemo = lazyWithRetry(() =>
  import("./use-is-first-render-demo").then((m) => ({
    default: m.UseIsFirstRenderDemo,
  }))
)

export const HOOK_DEMOS: Record<string, ComponentType> = {
  "use-click-outside": UseClickOutsideDemo,
  "use-click-outside-demo": UseClickOutsideDemo,
  "use-media-query": UseMediaQueryDemo,
  "use-media-query-demo": UseMediaQueryDemo,
  "use-copy-to-clipboard": UseCopyToClipboardDemo,
  "use-copy-to-clipboard-demo": UseCopyToClipboardDemo,
  "use-intersection-observer": UseIntersectionObserverDemo,
  "use-intersection-observer-demo": UseIntersectionObserverDemo,
  "use-debounce": UseDebounceDemo,
  "use-debounce-demo": UseDebounceDemo,
  "use-local-storage": UseLocalStorageDemo,
  "use-local-storage-demo": UseLocalStorageDemo,
  "use-toggle": UseToggleDemo,
  "use-toggle-demo": UseToggleDemo,
  "use-previous": UsePreviousDemo,
  "use-previous-demo": UsePreviousDemo,
  "use-hover": UseHoverDemo,
  "use-hover-demo": UseHoverDemo,
  "use-prevent-body-scroll": UsePreventBodyScrollDemo,
  "use-prevent-body-scroll-demo": UsePreventBodyScrollDemo,
  "use-scroll-position": UseScrollPositionDemo,
  "use-scroll-position-demo": UseScrollPositionDemo,
  "use-network": UseNetworkDemo,
  "use-network-demo": UseNetworkDemo,
  "use-page-leave": UsePageLeaveDemo,
  "use-page-leave-demo": UsePageLeaveDemo,
  "use-is-first-render": UseIsFirstRenderDemo,
  "use-is-first-render-demo": UseIsFirstRenderDemo,
}
