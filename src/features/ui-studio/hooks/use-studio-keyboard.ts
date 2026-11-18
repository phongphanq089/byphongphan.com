import { useKeyboardShortcuts } from "@/shared/hooks/use-keyboard-shortcuts"
import { openCommandMenu } from "@/widgets/command-menu"

import { useStudioStore } from "../store/studio-store"

interface UseStudioKeyboardOptions {
  /** Single Escape handler — shell decides: close drawer, close panel, else leave detail. */
  onEscape: () => void
  enabled?: boolean
}

/**
 * Studio keyboard map (interactive with the studio store directly):
 *   Ctrl/Cmd + B → toggle sidebar
 *   F            → toggle Docs tab (only when the staged item ships MDX)
 *   C            → toggle Code tab
 *   Escape       → close drawer/panel, else leave detail (shell-defined)
 *   Ctrl/Cmd + K → open command palette (registry-aware)
 *
 * Plain F/C/Escape only fire outside form fields (enableOnFormTags is false).
 */
export function useStudioKeyboard({
  onEscape,
  enabled = true,
}: UseStudioKeyboardOptions) {
  const toggleSidebar = useStudioStore((state) => state.toggleSidebar)
  const toggleDocs = useStudioStore((state) => state.toggleDocs)
  const toggleCode = useStudioStore((state) => state.toggleCode)

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
