import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $insertNodeToNearestRoot } from "@lexical/utils"
import { COMMAND_PRIORITY_EDITOR } from "lexical"
import * as React from "react"

import type { StickyColor } from "../../nodes/sticky-node"
import {
  $createStickyNode,
  INSERT_STICKY_COMMAND,
} from "../../nodes/sticky-node"

export function StickyPlugin(): null {
  const [editor] = useLexicalComposerContext()

  React.useEffect(() => {
    return editor.registerCommand<{
      x?: number
      y?: number
      color?: StickyColor
    } | void>(
      INSERT_STICKY_COMMAND,
      (payload) => {
        editor.update(() => {
          const offsetX = payload?.x ?? 32 + Math.floor(Math.random() * 4) * 20
          const offsetY = payload?.y ?? 32 + Math.floor(Math.random() * 4) * 20
          const stickyNode = $createStickyNode(
            offsetX,
            offsetY,
            payload?.color ?? "yellow"
          )
          $insertNodeToNearestRoot(stickyNode)
        })
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}

export default StickyPlugin
