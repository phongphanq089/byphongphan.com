import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  COMMAND_PRIORITY_NORMAL,
  createCommand,
  KEY_DOWN_COMMAND,
} from "lexical"
import * as React from "react"

import {
  formatCode,
  formatHeading,
  formatParagraph,
  formatQuote,
  updateFontSize,
  UpdateFontSizeType,
} from "../toolbar/utils"
import { KeyboardShortcutsDialog } from "./shortcuts-dialog"

export const OPEN_SHORTCUTS_DIALOG_COMMAND = createCommand<void>(
  "OPEN_SHORTCUTS_DIALOG_COMMAND"
)

export function ShortcutsPlugin(): React.JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  React.useEffect(() => {
    // 1. Open Dialog Command
    const unregisterOpenCommand = editor.registerCommand(
      OPEN_SHORTCUTS_DIALOG_COMMAND,
      () => {
        setIsDialogOpen(true)
        return true
      },
      COMMAND_PRIORITY_NORMAL
    )

    // 2. Register Hotkeys inside Lexical
    const unregisterKeyDown = editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event: KeyboardEvent) => {
        const { key, altKey, ctrlKey, metaKey, shiftKey } = event
        const isModifier = ctrlKey || metaKey

        // Ctrl + / or Cmd + / -> Open Shortcuts Dialog
        if (isModifier && (key === "/" || key === "?")) {
          event.preventDefault()
          setIsDialogOpen(true)
          return true
        }

        // Ctrl + Alt + 0 -> Normal Paragraph
        if (isModifier && altKey && key === "0") {
          event.preventDefault()
          formatParagraph(editor)
          return true
        }

        // Ctrl + Alt + 1 -> Heading 1
        if (isModifier && altKey && key === "1") {
          event.preventDefault()
          formatHeading(editor, "", "h1")
          return true
        }

        // Ctrl + Alt + 2 -> Heading 2
        if (isModifier && altKey && key === "2") {
          event.preventDefault()
          formatHeading(editor, "", "h2")
          return true
        }

        // Ctrl + Alt + 3 -> Heading 3
        if (isModifier && altKey && key === "3") {
          event.preventDefault()
          formatHeading(editor, "", "h3")
          return true
        }

        // Ctrl + Shift + 7 -> Numbered List
        if (isModifier && shiftKey && key === "7") {
          event.preventDefault()
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
          return true
        }

        // Ctrl + Shift + 8 -> Bullet List
        if (isModifier && shiftKey && key === "8") {
          event.preventDefault()
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
          return true
        }

        // Ctrl + Shift + 9 -> Check List
        if (isModifier && shiftKey && key === "9") {
          event.preventDefault()
          editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
          return true
        }

        // Ctrl + Alt + C -> Code Block
        if (isModifier && altKey && (key === "c" || key === "C")) {
          event.preventDefault()
          formatCode(editor, "")
          return true
        }

        // Ctrl + Shift + Q -> Quote
        if (isModifier && shiftKey && (key === "q" || key === "Q")) {
          event.preventDefault()
          formatQuote(editor, "")
          return true
        }

        // Ctrl + Shift + . -> Increase Font Size
        if (isModifier && shiftKey && (key === "." || key === ">")) {
          event.preventDefault()
          updateFontSize(editor, UpdateFontSizeType.increment, 16)
          return true
        }

        // Ctrl + Shift + , -> Decrease Font Size
        if (isModifier && shiftKey && (key === "," || key === "<")) {
          event.preventDefault()
          updateFontSize(editor, UpdateFontSizeType.decrement, 16)
          return true
        }

        return false
      },
      COMMAND_PRIORITY_NORMAL
    )

    // 3. Window keydown fallback for Ctrl + /
    const handleWindowKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        (event.key === "/" || event.key === "?")
      ) {
        const rootElement = editor.getRootElement()
        if (
          rootElement &&
          (rootElement.contains(document.activeElement) ||
            document.activeElement === rootElement)
        ) {
          event.preventDefault()
          setIsDialogOpen(true)
        }
      }
    }
    window.addEventListener("keydown", handleWindowKeyDown)

    return () => {
      unregisterOpenCommand()
      unregisterKeyDown()
      window.removeEventListener("keydown", handleWindowKeyDown)
    }
  }, [editor])

  return (
    <KeyboardShortcutsDialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
    />
  )
}
