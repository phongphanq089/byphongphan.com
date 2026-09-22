import { $isCodeNode, CodeNode } from "@lexical/code"
import { $isListNode } from "@lexical/list"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $isHeadingNode } from "@lexical/rich-text"
import { $getSelectionStyleValueForProperty } from "@lexical/selection"
import { $getNearestNodeOfType } from "@lexical/utils"
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  ElementNode,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical"
import {
  Bold,
  Code,
  Eraser,
  Indent,
  Italic,
  Keyboard,
  Outdent,
  Redo2,
  Smile,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react"
import * as React from "react"

import { Button } from "@/editor/components/ui/button"
import { Separator } from "@/editor/components/ui/separator"

import {
  blockTypeToBlockName,
  useToolbarState,
} from "../../core/context/toolbar-context"
import { cn } from "../../utils/cn"
import { getSelectedNode } from "../../utils/get-selected-node"
import { OPEN_EMOJI_PICKER_COMMAND } from "../emojis"
import { OPEN_SHORTCUTS_DIALOG_COMMAND } from "../shortcuts"
import { AlignDropdown } from "./components/align-dropdown"
import { BlockFormatDropdown } from "./components/block-format-dropdown"
import { CodeLanguageDropdown } from "./components/code-language-dropdown"
import { ColorPickerPopover } from "./components/color-picker"
import { FontSizeControl } from "./components/font-size-control"
import { InsertDropdown } from "./components/insert-dropdown"
import { PageSetupDropdown } from "./components/page-setup-dropdown"
import { clearFormatting } from "./utils"

export function ToolbarPlugin({
  onUploadImage,
  className,
}: {
  onUploadImage?: (file: File) => Promise<string>
  className?: string
}) {
  const [editor] = useLexicalComposerContext()
  const { toolbarState, updateToolbarState } = useToolbarState()
  const [isEditable, setIsEditable] = React.useState(() => editor.isEditable())

  const $updateToolbar = React.useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const parent = node.getParent()

      // Update text format flags
      updateToolbarState("isBold", selection.hasFormat("bold"))
      updateToolbarState("isItalic", selection.hasFormat("italic"))
      updateToolbarState("isUnderline", selection.hasFormat("underline"))
      updateToolbarState(
        "isStrikethrough",
        selection.hasFormat("strikethrough")
      )
      updateToolbarState("isCode", selection.hasFormat("code"))
      updateToolbarState("isSubscript", selection.hasFormat("subscript"))
      updateToolbarState("isSuperscript", selection.hasFormat("superscript"))

      // Update font size and colors
      const fontSize = $getSelectionStyleValueForProperty(
        selection,
        "font-size",
        "16px"
      )
      updateToolbarState("fontSize", fontSize)

      const fontColor = $getSelectionStyleValueForProperty(
        selection,
        "color",
        "#000000"
      )
      updateToolbarState("fontColor", fontColor)

      const bgColor = $getSelectionStyleValueForProperty(
        selection,
        "background-color",
        ""
      )
      updateToolbarState("bgColor", bgColor)

      // Check for code node
      const codeNode = $isCodeNode(node)
        ? node
        : $getNearestNodeOfType(node, CodeNode) ||
          ($isCodeNode(parent) ? parent : null)

      if (codeNode && $isCodeNode(codeNode)) {
        updateToolbarState("blockType", "code")
        updateToolbarState("codeLanguage", codeNode.getLanguage() || "")
        updateToolbarState("codeNodeKey", codeNode.getKey())
      } else {
        updateToolbarState("codeNodeKey", null)
        updateToolbarState("codeLanguage", "")

        // Update block type
        if ($isListNode(parent)) {
          const listType = parent.getListType()
          updateToolbarState(
            "blockType",
            listType as keyof typeof blockTypeToBlockName
          )
        } else if ($isHeadingNode(parent)) {
          const tag = parent.getTag()
          updateToolbarState(
            "blockType",
            tag as keyof typeof blockTypeToBlockName
          )
        } else if ($isHeadingNode(node)) {
          const tag = node.getTag()
          updateToolbarState(
            "blockType",
            tag as keyof typeof blockTypeToBlockName
          )
        } else {
          const type = $isElementNode(node) ? node.getType() : parent?.getType()
          if (type && type in blockTypeToBlockName) {
            updateToolbarState(
              "blockType",
              type as keyof typeof blockTypeToBlockName
            )
          } else {
            updateToolbarState("blockType", "paragraph")
          }
        }
      }

      // Update element format / text alignment
      const matchingParent = $isRootOrShadowRoot(parent)
        ? node
        : $getNearestNodeOfType(node, ElementNode)

      if (matchingParent && $isElementNode(matchingParent)) {
        updateToolbarState("elementFormat", matchingParent.getFormatType())
      }
    }
  }, [updateToolbarState])

  React.useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        $updateToolbar()
        return false
      },
      COMMAND_PRIORITY_CRITICAL
    )
  }, [editor, $updateToolbar])

  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        $updateToolbar()
      })
    })
  }, [editor, $updateToolbar])

  React.useEffect(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload: boolean) => {
        updateToolbarState("canUndo", payload)
        return false
      },
      COMMAND_PRIORITY_CRITICAL
    )
  }, [editor, updateToolbarState])

  React.useEffect(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload: boolean) => {
        updateToolbarState("canRedo", payload)
        return false
      },
      COMMAND_PRIORITY_CRITICAL
    )
  }, [editor, updateToolbarState])

  React.useEffect(() => {
    return editor.registerEditableListener((editable) => {
      setIsEditable(editable)
    })
  }, [editor])

  return (
    <div
      className={cn(
        "sticky top-0 z-20 flex scrollbar-thin flex-wrap items-center gap-0.5 overflow-x-auto border-b border-border/50 bg-card/80 px-2 py-1.5 backdrop-blur-md select-none dark:bg-card/60",
        className
      )}
    >
      {/* 1. History (Undo / Redo) */}
      <div className="flex items-center rounded-md bg-muted/40 p-0.5">
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={!toolbarState.canUndo || !isEditable}
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          className="h-7 w-7 rounded-sm hover:bg-background/80 hover:shadow-xs disabled:opacity-30"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          disabled={!toolbarState.canRedo || !isEditable}
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          className="h-7 w-7 rounded-sm hover:bg-background/80 hover:shadow-xs disabled:opacity-30"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Separator orientation="vertical" />

      {/* 2. Block Formatting */}
      <BlockFormatDropdown
        editor={editor}
        blockType={toolbarState.blockType}
        disabled={!isEditable}
      />

      {/* Code Language Dropdown (when Code Block is selected) */}
      {toolbarState.blockType === "code" && (
        <CodeLanguageDropdown
          editor={editor}
          codeLanguage={toolbarState.codeLanguage}
          codeNodeKey={toolbarState.codeNodeKey}
          disabled={!isEditable}
        />
      )}

      {toolbarState.blockType !== "code" && (
        <>
          {/* 3. Font Size Control */}
          <FontSizeControl
            editor={editor}
            fontSize={toolbarState.fontSize}
            disabled={!isEditable}
          />

          <Separator orientation="vertical" />

          {/* 4. Text Formats — pill group */}
          <div className="flex items-center rounded-md bg-muted/40 p-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={!isEditable}
              onClick={() =>
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
              }
              className={cn(
                "h-7 w-7 rounded-sm font-bold",
                toolbarState.isBold
                  ? "bg-primary/12 text-primary shadow-none"
                  : "hover:bg-background/80"
              )}
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              disabled={!isEditable}
              onClick={() =>
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
              }
              className={cn(
                "h-7 w-7 rounded-sm",
                toolbarState.isItalic
                  ? "bg-primary/12 text-primary"
                  : "hover:bg-background/80"
              )}
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              disabled={!isEditable}
              onClick={() =>
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
              }
              className={cn(
                "h-7 w-7 rounded-sm",
                toolbarState.isUnderline
                  ? "bg-primary/12 text-primary"
                  : "hover:bg-background/80"
              )}
              title="Underline (Ctrl+U)"
            >
              <Underline className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              disabled={!isEditable}
              onClick={() =>
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
              }
              className={cn(
                "h-7 w-7 rounded-sm",
                toolbarState.isStrikethrough
                  ? "bg-primary/12 text-primary"
                  : "hover:bg-background/80"
              )}
              title="Strikethrough"
            >
              <Strikethrough className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              disabled={!isEditable}
              onClick={() =>
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")
              }
              className={cn(
                "h-7 w-7 rounded-sm",
                toolbarState.isCode
                  ? "bg-primary/12 text-primary"
                  : "hover:bg-background/80"
              )}
              title="Inline code"
            >
              <Code className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Separator orientation="vertical" />

          {/* 5. Colors */}
          <div className="flex items-center gap-0.5">
            <ColorPickerPopover
              editor={editor}
              type="font"
              currentColor={toolbarState.fontColor}
              disabled={!isEditable}
            />
            <ColorPickerPopover
              editor={editor}
              type="background"
              currentColor={toolbarState.bgColor}
              disabled={!isEditable}
            />
          </div>
        </>
      )}

      <Separator orientation="vertical" />

      {/* 6. Alignment & Indent — pill group */}
      <div className="flex items-center rounded-md bg-muted/40 p-0.5">
        <AlignDropdown
          editor={editor}
          elementFormat={toolbarState.elementFormat}
          disabled={!isEditable}
        />

        <Button
          variant="ghost"
          size="icon-sm"
          disabled={!isEditable}
          onClick={() =>
            editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
          }
          className="h-7 w-7 rounded-sm hover:bg-background/80 disabled:opacity-30"
          title="Decrease indent"
        >
          <Outdent className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          disabled={!isEditable}
          onClick={() =>
            editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
          }
          className="h-7 w-7 rounded-sm hover:bg-background/80 disabled:opacity-30"
          title="Increase indent"
        >
          <Indent className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* 7. Insert Objects */}
      <div className="flex items-center gap-0.5">
        <InsertDropdown
          editor={editor}
          onUploadImage={onUploadImage}
          disabled={!isEditable}
        />
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={!isEditable}
          onClick={() =>
            editor.dispatchCommand(OPEN_EMOJI_PICKER_COMMAND, undefined)
          }
          className="h-7 w-7 rounded-md text-muted-foreground hover:bg-background/80 hover:text-foreground disabled:opacity-30"
          title="Insert Emoji"
        >
          <Smile className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Separator orientation="vertical" />

      {/* 8. Page Setup (Paper Size, Orientation, Margins, Paged View) */}
      <div className="flex items-center gap-0.5">
        <PageSetupDropdown disabled={!isEditable} />
      </div>

      <Separator orientation="vertical" />

      {/* 9. Keyboard Shortcuts Help */}
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={!isEditable}
        onClick={() =>
          editor.dispatchCommand(OPEN_SHORTCUTS_DIALOG_COMMAND, undefined)
        }
        className="h-7 w-7 rounded-md text-muted-foreground/60 hover:bg-muted hover:text-foreground"
        title="Keyboard shortcuts (Ctrl + /)"
      >
        <Keyboard className="h-3.5 w-3.5" />
      </Button>

      {/* 10. Clear Formatting — sits at the end, intentionally muted */}
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={!isEditable}
        onClick={() => clearFormatting(editor)}
        className="h-7 w-7 rounded-md text-muted-foreground/50 hover:bg-destructive/8 hover:text-destructive"
        title="Clear formatting"
      >
        <Eraser className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

export default ToolbarPlugin
