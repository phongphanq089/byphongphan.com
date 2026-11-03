import { useEffect, useRef, useState } from "react"

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** If true, once the target element becomes visible, the observer is disconnected. Defaults to false. */
  freezeOnceVisible?: boolean
  /** Whether the observer is active. Defaults to true. */
  enabled?: boolean
  /** Callback triggered on every intersection state change */
  onChange?: (entry: IntersectionObserverEntry) => void
}

export interface UseIntersectionObserverReturn<
  T extends HTMLElement = HTMLElement,
> {
  ref: React.RefObject<T | null>
  entry: IntersectionObserverEntry | null
  isIntersecting: boolean
}

/**
 * React hook that triggers when an element enters or leaves the viewport.
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn<T> {
  const {
    threshold = 0,
    root = null,
    rootMargin = "0%",
    freezeOnceVisible = false,
    enabled = true,
    onChange,
  } = options

  const ref = useRef<T | null>(null)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)

  const frozen = entry?.isIntersecting && freezeOnceVisible

  useEffect(() => {
    const node = ref.current
    const hasIOSupport =
      typeof window !== "undefined" && "IntersectionObserver" in window

    if (!hasIOSupport || !enabled || frozen || !node) return

    const observer = new IntersectionObserver(
      ([firstEntry]) => {
        if (!firstEntry) return
        setEntry(firstEntry)
        onChange?.(firstEntry)
      },
      { threshold, root, rootMargin }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [threshold, root, rootMargin, frozen, enabled, onChange])

  return {
    ref,
    entry,
    isIntersecting: Boolean(entry?.isIntersecting),
  }
}
