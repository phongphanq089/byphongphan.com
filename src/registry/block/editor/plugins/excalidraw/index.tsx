import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $insertNodeToNearestRoot } from "@lexical/utils"
import { COMMAND_PRIORITY_EDITOR } from "lexical"
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
          $insertNodeToNearestRoot(
            $createExcalidrawNode(typeof data === "string" ? data : "")
          )
        })
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}
