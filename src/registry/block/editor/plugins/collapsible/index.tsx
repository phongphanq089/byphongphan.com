import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $insertNodeToNearestRoot, mergeRegister } from "@lexical/utils"
import {
  $createParagraphNode,
  $createTextNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from "lexical"
import * as React from "react"

import {
  $createCollapsibleContainerNode,
  $createCollapsibleContentNode,
  $createCollapsibleTitleNode,
  $isCollapsibleContainerNode,
  $isCollapsibleTitleNode,
  INSERT_COLLAPSIBLE_COMMAND,
  TOGGLE_COLLAPSIBLE_COMMAND,
} from "../../nodes/collapsible-nodes"

export function CollapsiblePlugin(): null {
  const [editor] = useLexicalComposerContext()

  React.useEffect(() => {
    if (
      !editor.hasNodes([
        // Check if nodes are registered
      ])
    ) {
      // safe registration
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_COLLAPSIBLE_COMMAND,
        () => {
          editor.update(() => {
            const title = $createCollapsibleTitleNode()
            title.append($createTextNode("Toggle Details"))
            const content = $createCollapsibleContentNode()
            content.append($createParagraphNode())
            const container = $createCollapsibleContainerNode(true)
            container.append(title, content)
            $insertNodeToNearestRoot(container)
            title.select()
          })
          return true
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        TOGGLE_COLLAPSIBLE_COMMAND,
        (key) => {
          editor.update(() => {
            const node = $getNodeByKey(key)
            if ($isCollapsibleContainerNode(node)) {
              node.toggleOpen()
            }
          })
          return true
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        () => {
          const selection = $getSelection()
          if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
            return false
          }
          const anchor = selection.anchor.getNode()
          const parent = anchor.getParent()
          if (
            $isCollapsibleTitleNode(parent) &&
            parent.getChildrenSize() === 0
          ) {
            const container = parent.getParent()
            if ($isCollapsibleContainerNode(container)) {
              container.remove()
              return true
            }
          }
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        () => {
          const selection = $getSelection()
          if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
            return false
          }
          const anchor = selection.anchor.getNode()
          const parent = anchor.getParent()
          if (
            $isCollapsibleTitleNode(parent) &&
            parent.getTextContent() === ""
          ) {
            const container = parent.getParent()
            if ($isCollapsibleContainerNode(container)) {
              container.remove()
              return true
            }
          }
          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor])

  return null
}
