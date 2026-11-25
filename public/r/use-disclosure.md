# useDisclosure

> Manages boolean open/close state for modals, dialogs, drawers, and collapsibles with memoized handlers.

## Installation

  

  
    ```bash
npx shadcn@latest add https://byphongphan.com/r/use-disclosure.json
```
  

  
    
      - Copy and paste the hook into your project.
      ```tsx
// hooks/use-disclosure.ts
import { useCallback, useEffect, useRef, useState } from "react"

export interface UseDisclosureCallbacks {
  /** Callback fired immediately after opening */
  onOpen?: () => void
  /** Callback fired immediately after closing */
  onClose?: () => void
}

export interface UseDisclosureHandlers {
  open: () => void
  close: () => void
  toggle: () => void
  set: (value: boolean) => void
}

/**
 * Custom hook to manage boolean state for modals, drawers, and collapsibles.
 *
 * @param initialState - Initial open/closed status (default: false).
 * @param callbacks - Optional lifecycle callbacks for open and close events.
 * @returns A tuple of the current boolean state and memoized action handlers.
 */
export function useDisclosure(
  initialState = false,
  callbacks?: UseDisclosureCallbacks
): [boolean, UseDisclosureHandlers] {
  const [isOpen, setIsOpen] = useState(initialState)
  const callbacksRef = useRef(callbacks)

  useEffect(() => {
    callbacksRef.current = callbacks
  }, [callbacks])

  const open = useCallback(() => {
    setIsOpen((current) => {
      if (!current) {
        callbacksRef.current?.onOpen?.()
        return true
      }
      return current
    })
  }, [])

  const close = useCallback(() => {
    setIsOpen((current) => {
      if (current) {
        callbacksRef.current?.onClose?.()
        return false
      }
      return current
    })
  }, [])

  const toggle = useCallback(() => {
    setIsOpen((current) => {
      const next = !current
      if (next) {
        callbacksRef.current?.onOpen?.()
      } else {
        callbacksRef.current?.onClose?.()
      }
      return next
    })
  }, [])

  const set = useCallback(
    (value: boolean) => {
      if (value) {
        open()
      } else {
        close()
      }
    },
    [open, close]
  )

  return [isOpen, { open, close, toggle, set }]
}

```
      - Update the import paths to match your project setup.
    
  

## Usage

### Controlled Dialog Modal

`useDisclosure` integrates seamlessly with UI dialogs and modals by binding `isOpen` to `open` and `handlers.set` directly to `onOpenChange`:

```tsx
import { useDisclosure } from "@/shared/hooks"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Button } from "@/registry/ui/button"

export function DeploymentModal() {
  const [isOpen, handlers] = useDisclosure(false)

  return (
    <>
      <Button onClick={handlers.open}>Open Modal</Button>

      <Dialog open={isOpen} onOpenChange={handlers.set}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deployment</DialogTitle>
            <DialogDescription>
              Are you sure you want to deploy to production?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={handlers.close}>
              Cancel
            </Button>
            <Button onClick={handlers.close}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
```

### Lifecycle Callbacks

You can track opening and closing actions, initialize resources, or report telemetry using optional `onOpen` and `onClose` callbacks:

```tsx
import { useDisclosure } from "@/shared/hooks"

export function TrackedDrawer() {
  const [isOpen, { open, close, toggle }] = useDisclosure(false, {
    onOpen: () => {
      console.log("Analytics: Drawer opened")
    },
    onClose: () => {
      console.log("Analytics: Drawer closed")
    },
  })

  return (
    <div>
      <button onClick={toggle}>Toggle Drawer</button>
      {isOpen && <aside>Drawer Content</aside>}
    </div>
  )
}
```

## Props & Parameters

| Param          | Type                     | Default | Description                                                        |
| :------------- | :----------------------- | :------ | :----------------------------------------------------------------- |
| `initialState` | `boolean`                | `false` | Initial boolean open/close state.                                  |
| `callbacks`    | `UseDisclosureCallbacks` | —       | Optional object containing `onOpen` and `onClose` callback events. |

### UseDisclosureCallbacks

| Property  | Type         | Description                                        |
| :-------- | :----------- | :------------------------------------------------- |
| `onOpen`  | `() => void` | Optional callback triggered when state becomes `true`. |
| `onClose` | `() => void` | Optional callback triggered when state becomes `false`. |

## Returns

`useDisclosure` returns a tuple `[isOpen, handlers]`:

| Return     | Type                    | Description                                                            |
| :--------- | :---------------------- | :--------------------------------------------------------------------- |
| `isOpen`   | `boolean`               | Current boolean open status.                                           |
| `handlers` | `UseDisclosureHandlers` | Stable memoized object containing action helper functions.             |

### UseDisclosureHandlers

| Handler    | Type                      | Description                                                  |
| :--------- | :------------------------ | :----------------------------------------------------------- |
| `open`     | `() => void`              | Sets boolean state to `true` and triggers `onOpen`.          |
| `close`    | `() => void`              | Sets boolean state to `false` and triggers `onClose`.        |
| `toggle`   | `() => void`              | Toggles state and executes the corresponding callback.       |
| `set`      | `(value: boolean) => void`| Sets the boolean value directly (ideal for `onOpenChange`). |
