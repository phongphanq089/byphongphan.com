import { useKeyboardShortcuts } from "@/shared/hooks/use-keyboard-shortcuts"
import { openCommandMenu } from "@/widgets/command-menu"

interface UseStudioKeyboardOptions {
  toggleSidebar: () => void
  toggleDocs: () => void
  toggleCode: () => void
  /** Single Escape handler — shell decides: close panel first, else leave detail. */
  onEscape: () => void
  enabled?: boolean
}

/**
 * Studio keyboard map.
 *   Ctrl/Cmd + B → toggle sidebar
 *   F            → toggle Docs tab
 *   C            → toggle Code tab
 *   Escape       → close panel, else close detail
 *   Ctrl/Cmd + K → open command palette (registry-aware)
 *
 * Plain F/C/Escape only fire outside form fields (enableOnFormTags is false).
 */
export function useStudioKeyboard({
  toggleSidebar,
  toggleDocs,
  toggleCode,
  onEscape,
  enabled = true,
}: UseStudioKeyboardOptions) {
  useKeyboardShortcuts(
    "mod+b",
    () => {
      toggleSidebar()
    },
    { enabled, preventDefault: true }
  )

  useKeyboardShortcuts(
    "f",
    () => {
      toggleDocs()
    },
    { enabled, preventDefault: true }
  )

  useKeyboardShortcuts(
    "c",
    () => {
      toggleCode()
    },
    { enabled, preventDefault: true }
  )

  useKeyboardShortcuts(
    "escape",
    () => {
      onEscape()
    },
    { enabled, preventDefault: false }
  )

  useKeyboardShortcuts(
    "mod+k",
    () => {
      openCommandMenu()
    },
    { enabled, preventDefault: true }
  )
}
