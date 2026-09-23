import { $createCodeNode } from "@lexical/code"
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/extension"
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list"
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text"
import { INSERT_TABLE_COMMAND } from "@lexical/table"
import type { ElementNode, LexicalEditor, LexicalNode } from "lexical"
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
} from "lexical"

import { INSERT_COLLAPSIBLE_COMMAND } from "../../nodes/collapsible-nodes"
import { INSERT_EQUATION_COMMAND } from "../../nodes/equation-node"
import { INSERT_EXCALIDRAW_COMMAND } from "../../nodes/excalidraw-node"
import { OPEN_IMAGE_DIALOG_COMMAND } from "../../nodes/image-node"
import { OPEN_LAYOUT_DIALOG_COMMAND } from "../../nodes/layout-nodes"
import { INSERT_PAGE_BREAK_COMMAND } from "../../nodes/page-break-node"
import { INSERT_POLL_COMMAND } from "../../nodes/poll-node"
import { INSERT_STICKY_COMMAND } from "../../nodes/sticky-node"
import {
  INSERT_FIGMA_COMMAND,
  INSERT_TWEET_COMMAND,
  INSERT_YOUTUBE_COMMAND,
} from "../auto-embed"
import type { SidebarInsertBlockType } from "./types"

export function insertBlockIntoEditor(
  editor: LexicalEditor,
  blockType: SidebarInsertBlockType,
  targetNode?: LexicalNode | null
) {
  editor.update(() => {
    let newNode: ElementNode | null = null

    switch (blockType) {
      case "text": {
        newNode = $createParagraphNode()
        newNode.append($createTextNode("New paragraph text..."))
        break
      }
      case "h1": {
        newNode = $createHeadingNode("h1")
        newNode.append($createTextNode("Heading 1"))
        break
      }
      case "h2": {
        newNode = $createHeadingNode("h2")
        newNode.append($createTextNode("Heading 2"))
        break
      }
      case "h3": {
        newNode = $createHeadingNode("h3")
        newNode.append($createTextNode("Heading 3"))
        break
      }
      case "card":
      case "page": {
        newNode = $createQuoteNode()
        newNode.append(
          $createTextNode("📌 Note Card / Callout block content...")
        )
        break
      }
      case "code": {
        newNode = $createCodeNode("javascript")
        newNode.append(
          $createTextNode(
            '// Write your code here\nconsole.log("Hello NoteFlow!");'
          )
        )
        break
      }
      case "mermaid": {
        newNode = $createCodeNode("mermaid")
        newNode.append(
          $createTextNode(
            "graph TD;\n  A[Start] --> B{Process};\n  B -->|Yes| C[Done];\n  B -->|No| D[Retry];"
          )
        )
        break
      }
      case "gallery":
      case "kanban":
      case "file": {
        newNode = $createQuoteNode()
        const label =
          blockType === "gallery"
            ? "🖼️ Media Gallery"
            : blockType === "kanban"
              ? "📋 Kanban Board"
              : "📎 File Attachment"
        newNode.append($createTextNode(`[${label}] - Click to configure`))
        break
      }
      default:
        break
    }

    if (newNode) {
      if (targetNode) {
        targetNode.insertAfter(newNode)
        newNode.select()
      } else {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const anchor = selection.anchor.getNode()
          const topElement = anchor.getTopLevelElement()
          if (topElement) {
            topElement.insertAfter(newNode)
          } else {
            $getRoot().append(newNode)
          }
          newNode.select()
        } else {
          $getRoot().append(newNode)
          newNode.select()
        }
      }
      return
    }

    // Commands based insertions
    switch (blockType) {
      case "table": {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
          columns: "3",
          rows: "3",
          includeHeaders: true,
        })
        break
      }
      case "line-solid":
      case "line-dashed":
      case "line-dotted": {
        editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
        break
      }
      case "page-break": {
        editor.dispatchCommand(INSERT_PAGE_BREAK_COMMAND, undefined)
        break
      }
      case "bullet-list": {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        break
      }
      case "numbered-list": {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        break
      }
      case "checklist": {
        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
        break
      }
      case "image":
      case "image-unsplash": {
        editor.dispatchCommand(OPEN_IMAGE_DIALOG_COMMAND, undefined)
        break
      }
      case "tex": {
        editor.dispatchCommand(INSERT_EQUATION_COMMAND, {
          equation:
            "f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi)\\,e^{2 \\pi i \\xi x} \\, d\\xi",
          inline: false,
        })
        break
      }
      case "whiteboard": {
        editor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined)
        break
      }
      case "poll": {
        editor.dispatchCommand(INSERT_POLL_COMMAND, {
          question: "What is your preferred note workflow?",
          options: [
            "Notion-style Docs",
            "Whiteboard & Mindmap",
            "Markdown & LaTeX",
          ],
        })
        break
      }
      case "collapsible": {
        editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined)
        break
      }
      case "columns": {
        editor.dispatchCommand(OPEN_LAYOUT_DIALOG_COMMAND, undefined)
        break
      }
      case "sticky": {
        editor.dispatchCommand(INSERT_STICKY_COMMAND, undefined)
        break
      }
      case "youtube": {
        editor.dispatchCommand(
          INSERT_YOUTUBE_COMMAND,
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        )
        break
      }
      case "figma": {
        editor.dispatchCommand(
          INSERT_FIGMA_COMMAND,
          "https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File"
        )
        break
      }
      case "tweet": {
        editor.dispatchCommand(
          INSERT_TWEET_COMMAND,
          "https://x.com/lexicaljs/status/1514339965042655234"
        )
        break
      }
      default:
        break
    }
  })
}
