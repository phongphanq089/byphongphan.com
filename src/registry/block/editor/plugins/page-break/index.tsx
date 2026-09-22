import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $insertNodeToNearestRoot } from "@lexical/utils"
import { COMMAND_PRIORITY_EDITOR } from "lexical"
import * as React from "react"

import {
  $createPageBreakNode,
  INSERT_PAGE_BREAK_COMMAND,
} from "../../nodes/page-break-node"

export function PageBreakPlugin(): null {
  const [editor] = useLexicalComposerContext()

  React.useEffect(() => {
    return editor.registerCommand(
      INSERT_PAGE_BREAK_COMMAND,
      () => {
        editor.update(() => {
          $insertNodeToNearestRoot($createPageBreakNode())
        })
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}
