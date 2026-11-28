import { $generateHtmlFromNodes } from "@lexical/html"
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown"
import { $getRoot, type EditorState, type LexicalEditor } from "lexical"

import type { EditorChangeData } from "../type"

/**
 * Converts the current Lexical EditorState into JSON, HTML, Markdown, and plain text.
 * Must be called inside `editorState.read(...)`.
 */
export function extractEditorChangeData(
  editor: LexicalEditor,
  editorState: EditorState
): EditorChangeData {
  const parsedState = editorState.toJSON() as unknown as Record<string, unknown>
  const json = JSON.stringify(parsedState)

  let html = ""
  let markdown = ""
  let text = ""

  editorState.read(() => {
    html = $generateHtmlFromNodes(editor)
    markdown = $convertToMarkdownString(TRANSFORMERS)
    text = $getRoot().getTextContent()
  })

  return {
    json,
    state: parsedState,
    html,
    markdown,
    text,
    isEmpty: text.trim().length === 0,
  }
}

/**
 * Checks whether a JSON string is a valid serialized Lexical EditorState (`{ root: ... }`).
 * Returns the JSON string if valid, otherwise `undefined` so Lexical starts cleanly.
 */
export function resolveInitialLexicalState(
  rawValue?: string
): string | undefined {
  if (!rawValue || rawValue.trim().length === 0) return undefined

  try {
    const parsed: unknown = JSON.parse(rawValue)
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "root" in parsed &&
      typeof (parsed as { root?: unknown }).root === "object"
    ) {
      return rawValue
    }
    return undefined
  } catch {
    return undefined
  }
}
