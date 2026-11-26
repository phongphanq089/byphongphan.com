# usePageLeave

> Detects when the cursor leaves the viewport and provides exit-intent detection with configurable boundary filtering and trigger frequency.

## Installation

  

  
    ```bash
npx shadcn@latest add https://byphongphan.com/r/use-page-leave.json
```
  

  
    
      - Copy and paste the hook into your project.
      ```tsx
// hooks/use-page-leave.ts
import { useEffect, useRef, useState } from "react"

export interface UsePageLeaveOptions {
  /**
   * Whether to trigger only when the mouse leaves from the top boundary of the viewport.
   * Typically indicates an intent to close the tab, switch tabs, or interact with the address bar.
   * @default true
   */
  onlyTop?: boolean

  /**
   * Whether the leave callback should only be triggered once during the component lifecycle.
   * @default false
   */
  once?: boolean
}

/**
 * Custom hook to detect when the user's cursor leaves the page (Exit-Intent detection).
 * Commonly used for displaying retention modals, discounts, or auto-saving drafts.
 *
 * @param onLeave - Optional callback invoked when the cursor exits the viewport.
 * @param options - Configuration options for boundary filtering and trigger frequency.
 * @returns A boolean indicating whether the cursor is currently outside the viewport.
 */
export function usePageLeave(
  onLeave?: () => void,
  options: UsePageLeaveOptions = {}
): boolean {
  const { onlyTop = true, once = false } = options
  const [isLeft, setIsLeft] = useState(false)

  // Tracks if the callback has already been executed when `once: true`
  const hasFiredRef = useRef(false)

  // Store the latest callback in a ref to avoid re-attaching event listeners on state updates
  const onLeaveRef = useRef(onLeave)
  useEffect(() => {
    onLeaveRef.current = onLeave
  }, [onLeave])

  useEffect(() => {
    // Guard against Server-Side Rendering environments
    if (typeof document === "undefined") return

    const handleMouseLeave = (event: MouseEvent) => {
      if (once && hasFiredRef.current) return

      // clientY <= 0 indicates the cursor exited through the top edge of the viewport
      const isExitingTop = event.clientY <= 0
      const shouldTrigger = onlyTop ? isExitingTop : true

      if (shouldTrigger) {
        setIsLeft(true)
        hasFiredRef.current = true
        onLeaveRef.current?.()
      }
    }

    const handleMouseEnter = () => {
      setIsLeft(false)
    }

    // Attach to document.documentElement because 'mouseleave' does not bubble from descendants
    document.documentElement.addEventListener("mouseleave", handleMouseLeave)
    document.documentElement.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave
      )
      document.documentElement.removeEventListener(
        "mouseenter",
        handleMouseEnter
      )
    }
  }, [onlyTop, once])

  return isLeft
}

```
      - Update the import paths to match your project setup.
    
  

## Usage

### Exit-Intent Retention Dialog

```tsx
import { useState } from "react"
import { usePageLeave } from "@/shared/hooks"

export function ExitIntentOffer() {
  const [showOffer, setShowOffer] = useState(false)

  // Fires once when the user moves their cursor towards the browser tabs/address bar
  usePageLeave(() => setShowOffer(true), {
    onlyTop: true,
    once: true,
  })

  if (!showOffer) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="rounded-xl bg-card p-6 shadow-xl max-w-sm text-center">
        <h3 className="text-lg font-bold">Wait! Before you leave...</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Enjoy 15% off your first purchase with coupon code <code>STAY15</code>.
        </p>
        <button
          className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm font-medium"
          onClick={() => setShowOffer(false)}
        >
          Claim Discount
        </button>
      </div>
    </div>
  )
}
```

### Unsaved Draft Reminder

```tsx
import { usePageLeave } from "@/shared/hooks"

export function EditorAutoSave({ hasUnsavedChanges }: { hasUnsavedChanges: boolean }) {
  const isLeaving = usePageLeave(
    () => {
      if (hasUnsavedChanges) {
        // Trigger auto-save draft to local storage
        console.log("Draft auto-saved upon page leave")
      }
    },
    { onlyTop: false }
  )

  return (
    <div className="text-xs text-muted-foreground">
      {isLeaving ? "Saving draft..." : "All changes up to date"}
    </div>
  )
}
```

## Features

- **Exit-Intent Heuristic**: Measures `clientY <= 0` to accurately capture intent when visitors aim for the browser's tab strip, address bar, or close button.
- **Boundary Filtering**: Toggle between top-edge only (`onlyTop: true`) for exit-intent or any viewport edge (`onlyTop: false`) for general canvas applications.
- **Trigger Frequency Control**: Supports `once: true` to prevent repetitive dialogs or notifications during a user's session.
- **Ref-Stabilized Handlers**: Stores the `onLeave` callback in an internal ref so changes to the callback never trigger unnecessary event listener re-attachments.
- **Root Element Delegation**: Binds to `document.documentElement` to cleanly avoid event bubbling quirks from nested child elements.

## Parameters

| Parameter          | Type                  | Default | Description                                                                                  |
| :----------------- | :-------------------- | :------ | :------------------------------------------------------------------------------------------- |
| `onLeave`          | `(() => void)`        | `—`     | Optional callback invoked when the cursor exits the configured boundary.                     |
| `options.onlyTop`  | `boolean`             | `true`  | When `true`, triggers only when the mouse leaves through the top edge (`clientY <= 0`).       |
| `options.once`     | `boolean`             | `false` | When `true`, the `onLeave` callback will only be executed once during the component's life. |

## Returns

`boolean` — Returns `true` if the cursor is currently outside the configured viewport boundary, or `false` when inside.
