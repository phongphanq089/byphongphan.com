import { useHotkeys } from "react-hotkeys-hook"

export function useKeyboardShortcuts(
  hotkey: string,
  callback: (event: KeyboardEvent) => void,
  options: {
    enabled?: boolean
    enableOnFormTags?: boolean
    preventDefault?: boolean
  } = {}
) {
  const {
    enabled = true,
    enableOnFormTags = false,
    preventDefault = false,
  } = options

  useHotkeys(
    hotkey,
    (event) => callback(event),
    {
      enabled,
      enableOnFormTags,
      preventDefault,
      enableOnContentEditable: false,
    },
    [callback]
  )
}
