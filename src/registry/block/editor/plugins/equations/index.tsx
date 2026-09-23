import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $insertNodeToNearestRoot } from "@lexical/utils"
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
} from "lexical"
import * as React from "react"

import {
  $createEquationNode,
  INSERT_EQUATION_COMMAND,
} from "../../nodes/equation-node"

export function EquationsPlugin(): null {
  const [editor] = useLexicalComposerContext()

  React.useEffect(() => {
    return editor.registerCommand(
      INSERT_EQUATION_COMMAND,
      (payload) => {
        const { equation, inline = false } = payload
        editor.update(() => {
          const selection = $getSelection()
          const equationNode = $createEquationNode(equation, inline)

          if (inline && $isRangeSelection(selection)) {
            selection.insertNodes([equationNode])
          } else {
            $insertNodeToNearestRoot(equationNode)
          }
        })
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}
