import { $createCodeNode, $isCodeNode } from "@lexical/code"
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  type HeadingTagType,
} from "@lexical/rich-text"
import { $setBlocksType } from "@lexical/selection"
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils"
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical"
import {
  Bold,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import { Button, Separator } from "@/shared/ui"

type BlockType =
  "paragraph" | "h1" | "h2" | "h3" | "quote" | "code" | "bullet" | "number"

export function BasicToolbarPlugin() {
  const [editor] = useLexicalComposerContext()

  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [blockType, setBlockType] = useState<BlockType>("paragraph")
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isCode, setIsCode] = useState(false)

  const syncToolbarState = useCallback(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) return

    setIsBold(selection.hasFormat("bold"))
    setIsItalic(selection.hasFormat("italic"))
    setIsUnderline(selection.hasFormat("underline"))
    setIsStrikethrough(selection.hasFormat("strikethrough"))
    setIsCode(selection.hasFormat("code"))

    const anchorNode = selection.anchor.getNode()
    const element =
      anchorNode.getKey() === "root"
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow()

    if ($isListNode(element)) {
      const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode)
      const listType = parentList
        ? parentList.getListType()
        : element.getListType()
      setBlockType(listType === "number" ? "number" : "bullet")
      return
    }

    if ($isHeadingNode(element)) {
      const tag = element.getTag()
      if (tag === "h1" || tag === "h2" || tag === "h3") {
        setBlockType(tag)
        return
      }
    }

    if ($isCodeNode(element)) {
      setBlockType("code")
      return
    }

    const type = element.getType()
    if (type === "quote") {
      setBlockType("quote")
      return
    }

    setBlockType("paragraph")
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          syncToolbarState()
        })
      }),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor, syncToolbarState])

  const setParagraph = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode())
      }
    })
  }

  const setHeading = (tag: HeadingTagType) => {
    if (blockType === tag) {
      setParagraph()
      return
    }
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag))
      }
    })
  }

  const setQuote = () => {
    if (blockType === "quote") {
      setParagraph()
      return
    }
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode())
      }
    })
  }

  const setCodeBlock = () => {
    if (blockType === "code") {
      setParagraph()
      return
    }
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createCodeNode())
      }
    })
  }

  const toggleList = (kind: "bullet" | "number") => {
    if (blockType === kind) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
      return
    }
    editor.dispatchCommand(
      kind === "bullet"
        ? INSERT_UNORDERED_LIST_COMMAND
        : INSERT_ORDERED_LIST_COMMAND,
      undefined
    )
  }

  return (
    <div
      role="toolbar"
      aria-label="Text formatting"
      className="flex flex-wrap items-center gap-1 border-b border-border/70 bg-muted/30 px-3 py-2"
    >
      {/* History */}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        title="Undo (Ctrl+Z)"
        aria-label="Undo"
      >
        <Undo2 className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        title="Redo (Ctrl+Y)"
        aria-label="Redo"
      >
        <Redo2 className="size-3.5" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-4" />

      {/* Block Types */}
      <Button
        type="button"
        variant={blockType === "paragraph" ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={setParagraph}
        title="Paragraph"
        aria-label="Paragraph"
      >
        <Pilcrow className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant={blockType === "h1" ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => setHeading("h1")}
        title="Heading 1"
        aria-label="Heading 1"
      >
        <Heading1 className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant={blockType === "h2" ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => setHeading("h2")}
        title="Heading 2"
        aria-label="Heading 2"
      >
        <Heading2 className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant={blockType === "h3" ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => setHeading("h3")}
        title="Heading 3"
        aria-label="Heading 3"
      >
        <Heading3 className="size-3.5" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-4" />

      {/* Inline Text Formats */}
      <Button
        type="button"
        variant={isBold ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        title="Bold (Ctrl+B)"
        aria-label="Bold"
      >
        <Bold className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant={isItalic ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        title="Italic (Ctrl+I)"
        aria-label="Italic"
      >
        <Italic className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant={isUnderline ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        title="Underline (Ctrl+U)"
        aria-label="Underline"
      >
        <Underline className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant={isStrikethrough ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        }
        title="Strikethrough"
        aria-label="Strikethrough"
      >
        <Strikethrough className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant={isCode ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
        title="Inline Code"
        aria-label="Inline Code"
      >
        <Code className="size-3.5" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-4" />

      {/* Lists, Quote & Code Block */}
      <Button
        type="button"
        variant={blockType === "bullet" ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => toggleList("bullet")}
        title="Bullet List"
        aria-label="Bullet List"
      >
        <List className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant={blockType === "number" ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={() => toggleList("number")}
        title="Numbered List"
        aria-label="Numbered List"
      >
        <ListOrdered className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant={blockType === "quote" ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={setQuote}
        title="Blockquote"
        aria-label="Blockquote"
      >
        <Quote className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant={blockType === "code" ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={setCodeBlock}
        title="Code Block"
        aria-label="Code Block"
      >
        <Code2 className="size-3.5" />
      </Button>
    </div>
  )
}
