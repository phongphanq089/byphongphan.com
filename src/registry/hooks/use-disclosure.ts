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
