# useIntersectionObserver

> Triggers when an element enters or leaves the viewport.

## Installation

  

  ```bash
npx shadcn@latest add https://byphongphan.com/r/use-intersection-observer.json
```

  
    
      - Copy and paste the hook into your project.
      ```tsx
// hooks/use-intersection-observer.ts
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

```
      - Update the import paths to match your project setup.
    
  

## Usage

```tsx
import { useIntersectionObserver } from "@/shared/hooks"

export function LazyCard() {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.5,
    freezeOnceVisible: true,
  })

  return (
    <div
      ref={ref}
      className={isIntersecting ? "animate-fade-in" : "opacity-0"}
    >
      <h3>Animated Element</h3>
      <p>Appears once 50% enters viewport.</p>
    </div>
  )
}
```

## Props & Parameters

| Param               | Type                          | Default | Description                                                                                     |
| :------------------ | :---------------------------- | :------ | :---------------------------------------------------------------------------------------------- |
| `threshold`         | `number \| number[]`          | `0`     | Either a single number or an array of numbers between 0.0 and 1.0 indicating visibility ratio.  |
| `root`              | `Element \| Document \| null` | `null`  | The element that is used as the viewport for checking visibility. Defaults to browser viewport. |
| `rootMargin`        | `string`                      | `"0%"`  | Margin around the root element, similar to CSS margin property.                                 |
| `freezeOnceVisible` | `boolean`                     | `false` | When `true`, automatically unobserves element after it first enters viewport.                   |
| `enabled`           | `boolean`                     | `true`  | Whether intersection observer is active.                                                        |

## Returns

| Return           | Type                                | Description                                                               |
| :--------------- | :---------------------------------- | :------------------------------------------------------------------------ |
| `ref`            | `RefObject<T \| null>`              | React Ref to attach to target DOM element container.                      |
| `isIntersecting` | `boolean`                           | `true` when target is currently intersecting viewport based on threshold. |
| `entry`          | `IntersectionObserverEntry \| null` | Raw native intersection observer entry record.                            |
