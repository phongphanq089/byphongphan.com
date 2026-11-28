import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import type { EditorState } from "lexical"
import { useEffect, useRef } from "react"

import type { EditorChangeData } from "../type"
import { extractEditorChangeData } from "../utils/serialize"

interface EditorBridgePluginProps {
  readOnly?: boolean
  onChange?: (data: EditorChangeData) => void
  onReady?: (data: EditorChangeData) => void
  onStatsChange?: (data: EditorChangeData) => void
}

/**
 * Connects Lexical's internal EditorState updates to React props (`onChange`, `onReady`, `readOnly`).
 */
export function EditorBridgePlugin({
  readOnly = false,
  onChange,
  onReady,
  onStatsChange,
}: EditorBridgePluginProps) {
  const [editor] = useLexicalComposerContext()
  const didEmitReady = useRef(false)

  useEffect(() => {
    editor.setEditable(!readOnly)
  }, [editor, readOnly])

  useEffect(() => {
    if (didEmitReady.current) return
    didEmitReady.current = true

    const initialData = extractEditorChangeData(editor, editor.getEditorState())
    onStatsChange?.(initialData)
    onReady?.(initialData)
  }, [editor, onReady, onStatsChange])

  const handleChange = (editorState: EditorState) => {
    const data = extractEditorChangeData(editor, editorState)
    onStatsChange?.(data)
    onChange?.(data)
  }

  return <OnChangePlugin ignoreSelectionChange onChange={handleChange} />
}
