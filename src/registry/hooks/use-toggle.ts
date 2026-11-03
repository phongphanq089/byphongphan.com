import { useCallback, useState } from "react"

export interface UseToggleActions {
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
  setValue: (value: boolean) => void
}

/**
 * React hook to manage boolean state with convenient memoized action helpers.
 */
export function useToggle(
  initialValue = false
): [boolean, (nextValue?: boolean) => void, UseToggleActions] {
  const [value, setValue] = useState<boolean>(initialValue)

  const toggle = useCallback((nextValue?: boolean) => {
    setValue((prev) => (typeof nextValue === "boolean" ? nextValue : !prev))
  }, [])

  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return [
    value,
    toggle,
    {
      setTrue,
      setFalse,
      toggle: () => toggle(),
      setValue,
    },
  ]
}
