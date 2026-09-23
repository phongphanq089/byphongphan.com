import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $insertNodeToNearestRoot } from "@lexical/utils"
import { $createParagraphNode, COMMAND_PRIORITY_EDITOR } from "lexical"
import * as React from "react"

import {
  $createLayoutContainerNode,
  $createLayoutItemNode,
  $isLayoutContainerNode,
  $isLayoutItemNode,
  INSERT_LAYOUT_COMMAND,
  OPEN_LAYOUT_DIALOG_COMMAND,
  UPDATE_LAYOUT_COMMAND,
} from "../../nodes/layout-nodes"
import { InsertLayoutDialog } from "./insert-layout-dialog"
import { LayoutActionMenu } from "./layout-action-menu"

export function LayoutPlugin({
  anchorElem = typeof document !== "undefined" ? document.body : null,
}: {
  anchorElem?: HTMLElement | null
}): React.JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  React.useEffect(() => {
    // 1. Open Layout Dialog Command
    const unregisterOpenDialog = editor.registerCommand(
      OPEN_LAYOUT_DIALOG_COMMAND,
      () => {
        setIsDialogOpen(true)
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )

    // 2. Insert Layout Command
    const unregisterInsert = editor.registerCommand(
      INSERT_LAYOUT_COMMAND,
      (payload) => {
        const isString = typeof payload === "string"
        const templateColumns = isString ? payload : payload.templateColumns
        const gap = !isString ? payload.gap : "normal"
        const borderStyle = !isString ? payload.borderStyle : "dashed"

        editor.update(() => {
          const container = $createLayoutContainerNode(
            templateColumns,
            gap,
            borderStyle
          )
          const columnCount = templateColumns.trim().split(/\s+/).length

          for (let i = 0; i < columnCount; i++) {
            const item = $createLayoutItemNode()
            item.append($createParagraphNode())
            container.append(item)
          }

          $insertNodeToNearestRoot(container)
        })
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )

    // 3. Update Layout Command
    const unregisterUpdate = editor.registerCommand(
      UPDATE_LAYOUT_COMMAND,
      ({ containerKey, templateColumns, gap, borderStyle }) => {
        editor.update(() => {
          const node = editor.getEditorState()._nodeMap.get(containerKey)
          if ($isLayoutContainerNode(node)) {
            if (gap) node.setGap(gap)
            if (borderStyle) node.setBorderStyle(borderStyle)
            if (templateColumns) {
              node.setTemplateColumns(templateColumns)
              const targetCount = templateColumns.trim().split(/\s+/).length
              const currentCount = node.getChildrenSize()

              if (targetCount > currentCount) {
                for (let i = currentCount; i < targetCount; i++) {
                  const item = $createLayoutItemNode()
                  item.append($createParagraphNode())
                  node.append(item)
                }
              } else if (targetCount < currentCount) {
                const children = node.getChildren()
                const lastKeepItem = children[targetCount - 1]
                if ($isLayoutItemNode(lastKeepItem)) {
                  for (let i = targetCount; i < currentCount; i++) {
                    const discardItem = children[i]
                    if ($isLayoutItemNode(discardItem)) {
                      for (const sc of discardItem.getChildren()) {
                        lastKeepItem.append(sc)
                      }
                      discardItem.remove()
                    }
                  }
                }
              }
            }
          }
        })
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )

    return () => {
      unregisterOpenDialog()
      unregisterInsert()
      unregisterUpdate()
    }
  }, [editor])

  return (
    <>
      <InsertLayoutDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editor={editor}
      />
      <LayoutActionMenu anchorElem={anchorElem} />
    </>
  )
}
