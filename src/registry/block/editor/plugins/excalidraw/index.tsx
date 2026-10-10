import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $insertNodeToNearestRoot } from "@lexical/utils"
import { $createParagraphNode, COMMAND_PRIORITY_EDITOR } from "lexical"
import * as React from "react"

import {
  $createExcalidrawNode,
  INSERT_EXCALIDRAW_COMMAND,
} from "../../nodes/excalidraw-node"

export function ExcalidrawPlugin(): null {
  const [editor] = useLexicalComposerContext()

  React.useEffect(() => {
    return editor.registerCommand(
      INSERT_EXCALIDRAW_COMMAND,
      (data) => {
        editor.update(() => {
          const excalidrawNode = $createExcalidrawNode(
            typeof data === "string" && data.trim().length > 0 ? data : "[]"
          )
          $insertNodeToNearestRoot(excalidrawNode)
          const paragraph = $createParagraphNode()
          excalidrawNode.insertAfter(paragraph)
        })
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}
