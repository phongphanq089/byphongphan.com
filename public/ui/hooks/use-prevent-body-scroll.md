# usePreventBodyScroll

> Prevents background scrolling with layout shift compensation and iOS Safari support.

## Installation

  

  
    ```bash
npx shadcn@latest add https://byphongphan.com/r/use-prevent-body-scroll.json
```
  

  
    
      - Copy and paste the hook into your project.
      ```tsx
// hooks/use-prevent-body-scroll.ts
import { useEffect, useLayoutEffect, useRef } from "react"

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

let lockCount = 0
let savedScrollY = 0
let originalStyles: {
  overflow: string
  position: string
  top: string
  left: string
  width: string
  paddingRight: string
} | null = null

export function usePreventBodyScroll(isOpen: boolean = true): void {
  // Tracks whether this instance has currently acquired a body lock
  const isLockedByThisInstance = useRef(false)

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return

    if (isOpen && !isLockedByThisInstance.current) {
      isLockedByThisInstance.current = true

      if (lockCount === 0) {
        savedScrollY = window.scrollY

        const body = document.body
        const computedStyle = window.getComputedStyle(body)
        const existingPaddingRight = parseFloat(computedStyle.paddingRight) || 0
        const scrollbarWidth =
          window.innerWidth - document.documentElement.clientWidth

        originalStyles = {
          overflow: body.style.overflow,
          position: body.style.position,
          top: body.style.top,
          left: body.style.left,
          width: body.style.width,
          paddingRight: body.style.paddingRight,
        }

        body.style.overflow = "hidden"
        body.style.position = "fixed"
        body.style.top = `-${savedScrollY}px`
        body.style.left = "0"
        body.style.width = "100%"

        if (scrollbarWidth > 0) {
          body.style.paddingRight = `${existingPaddingRight + scrollbarWidth}px`
        }
      }

      lockCount++
    }

    return () => {
      if (isLockedByThisInstance.current) {
        isLockedByThisInstance.current = false
        lockCount--

        if (lockCount === 0 && originalStyles) {
          const body = document.body
          const html = document.documentElement

          body.style.overflow = originalStyles.overflow
          body.style.position = originalStyles.position
          body.style.top = originalStyles.top
          body.style.left = originalStyles.left
          body.style.width = originalStyles.width
          body.style.paddingRight = originalStyles.paddingRight

          originalStyles = null

          const originalScrollBehavior = html.style.scrollBehavior
          html.style.scrollBehavior = "auto"

          window.scrollTo(0, savedScrollY)

          html.style.scrollBehavior = originalScrollBehavior
        }
      }
    }
  }, [isOpen])
}

```
      - Update the import paths to match your project setup.
    
  

## Usage

```tsx
import { useState } from "react"
import { usePreventBodyScroll } from "@/shared/hooks"

export function CustomModal() {
  const [isOpen, setIsOpen] = useState(false)

  // Locks body scroll when the modal is open
  usePreventBodyScroll(isOpen)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-card p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Modal Title</h3>
            <p className="text-sm text-muted-foreground">
              Background scroll is locked without page shifting.
            </p>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  )
}
```

## Features

- **Layout Shift Prevention**: Calculates the exact scrollbar width (`window.innerWidth - clientWidth`) and applies compensating `paddingRight` to `document.body` so content does not jump when the scrollbar disappears.
- **iOS Safari Support**: Applies `position: fixed` clamped to `-window.scrollY` to prevent iOS WebKit momentum rubber-banding and elastic bounce scroll.
- **Reference Counting**: Supports multiple nested modals, stacked drawers, or lightboxes. The body remains locked until the last open instance unmounts or sets `isOpen = false`.
- **Instant Position Restoration**: Disables smooth scroll behavior (`scrollBehavior: auto`) during restore so users return to their exact scroll position without awkward animated scrolling.
- **SSR-Safe**: Uses an isomorphic layout effect check to avoid hydration mismatch warnings in Next.js or other SSR environments.

## Parameters

| Parameter | Type      | Default | Description                                              |
| :-------- | :-------- | :------ | :------------------------------------------------------- |
| `isOpen`  | `boolean` | `true`  | Pass `true` to lock body scroll, or `false` to release. |

## Returns

`void` - The hook manages lifecycle and body cleanup side-effects automatically.
