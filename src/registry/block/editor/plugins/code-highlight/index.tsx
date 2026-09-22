// @ts-nocheck

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import * as React from "react"

export function CodeHighlightPlugin(): null {
  const [editor] = useLexicalComposerContext()

  React.useEffect(() => {
    return registerCodeHighlighting(editor)
  }, [editor])

  return null
}
