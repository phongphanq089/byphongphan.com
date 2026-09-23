import { $createCodeNode, $isCodeNode } from "@lexical/code"
import {
  $createListItemNode,
  $createListNode,
  $isListNode,
} from "@lexical/list"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { DraggableBlockPlugin_EXPERIMENTAL } from "@lexical/react/LexicalDraggableBlockPlugin"
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
} from "@lexical/rich-text"
import type { ElementNode, LexicalEditor, LexicalNode } from "lexical"
import {
  $createParagraphNode,
  $getNearestNodeFromDOMNode,
  $getRoot,
  $isElementNode,
  $isParagraphNode,
  $parseSerializedNode,
} from "lexical"
import {
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Code2,
  Copy,
  GripVertical,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Plus,
  Quote,
  Trash2,
  Type,
} from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import { cn } from "../../utils/cn"

type TargetBlockType =
  | "paragraph"
  | "h1"
  | "h2"
  | "h3"
  | "quote"
  | "code"
  | "bullet"
  | "number"
  | "check"

function getTopLevelNode(node: LexicalNode): LexicalNode {
  let topNode = node
  while (topNode.getParent() && topNode.getParent() !== $getRoot()) {
    topNode = topNode.getParentOrThrow()
  }
  return topNode
}

function getBlockInfo(
  editor: LexicalEditor,
  element: HTMLElement | null
): { type: string; label: string } {
  if (!element) return { type: "paragraph", label: "Text" }
  let info = { type: "paragraph", label: "Text" }
  try {
    editor.read(() => {
      const node = $getNearestNodeFromDOMNode(element)
      if (!node) return
      const topNode = getTopLevelNode(node)
      if ($isHeadingNode(topNode)) {
        const tag = topNode.getTag()
        info = {
          type: tag,
          label:
            tag === "h1"
              ? "Heading 1"
              : tag === "h2"
                ? "Heading 2"
                : "Heading 3",
        }
      } else if ($isListNode(topNode)) {
        const listType = topNode.getListType()
        info = {
          type: listType,
          label:
            listType === "check"
              ? "Checklist"
              : listType === "number"
                ? "Numbered List"
                : "Bullet List",
        }
      } else if ($isQuoteNode(topNode)) {
        info = { type: "quote", label: "Quote" }
      } else if ($isCodeNode(topNode)) {
        info = { type: "code", label: "Code Block" }
      } else if ($isParagraphNode(topNode)) {
        info = { type: "paragraph", label: "Text" }
      }
    })
  } catch (err) {
    console.warn("[DraggableBlock] Error getting block info:", err)
  }
  return info
}

function transformBlock(
  editor: LexicalEditor,
  element: HTMLElement,
  targetType: TargetBlockType
) {
  editor.update(() => {
    const node = $getNearestNodeFromDOMNode(element)
    if (!node) return
    const topNode = getTopLevelNode(node)

    // Extract children safely
    const children: Array<LexicalNode> = []
    if ($isElementNode(topNode)) {
      if ($isListNode(topNode)) {
        for (const item of topNode.getChildren()) {
          if ($isElementNode(item)) {
            children.push(...item.getChildren())
          } else {
            children.push(item)
          }
        }
      } else {
        children.push(...topNode.getChildren())
      }
    }

    let newNode: ElementNode
    if (targetType === "h1" || targetType === "h2" || targetType === "h3") {
      newNode = $createHeadingNode(targetType)
      newNode.append(...children)
    } else if (targetType === "quote") {
      newNode = $createQuoteNode()
      newNode.append(...children)
    } else if (targetType === "code") {
      newNode = $createCodeNode()
      newNode.append(...children)
    } else if (
      targetType === "bullet" ||
      targetType === "number" ||
      targetType === "check"
    ) {
      const list = $createListNode(targetType)
      const item = $createListItemNode()
      item.append(...children)
      list.append(item)
      newNode = list
    } else {
      newNode = $createParagraphNode()
      newNode.append(...children)
    }

    topNode.replace(newNode)
    newNode.select()
  })
}

function duplicateBlock(editor: LexicalEditor, element: HTMLElement) {
  editor.update(() => {
    const node = $getNearestNodeFromDOMNode(element)
    if (!node) return
    const topNode = getTopLevelNode(node)
    const clone = $parseSerializedNode(topNode.exportJSON())
    topNode.insertAfter(clone)
    if ($isElementNode(clone)) {
      clone.select()
    }
  })
  toast.success("Block duplicated")
}

function deleteBlock(editor: LexicalEditor, element: HTMLElement) {
  editor.update(() => {
    const node = $getNearestNodeFromDOMNode(element)
    if (!node) return
    const topNode = getTopLevelNode(node)
    topNode.remove()
  })
  toast.success("Block deleted")
}

function copyBlockContent(editor: LexicalEditor, element: HTMLElement) {
  let text = ""
  try {
    editor.read(() => {
      const node = $getNearestNodeFromDOMNode(element)
      if (!node) return
      const topNode = getTopLevelNode(node)
      text = topNode.getTextContent()
    })
  } catch (err) {
    console.warn("[DraggableBlock] Error copying block content:", err)
  }
  if (text) {
    navigator.clipboard.writeText(text)
    toast.success("Block text copied to clipboard")
  }
}

function moveBlockUp(editor: LexicalEditor, element: HTMLElement) {
  editor.update(() => {
    const node = $getNearestNodeFromDOMNode(element)
    if (!node) return
    const topNode = getTopLevelNode(node)
    const prev = topNode.getPreviousSibling()
    if (prev) {
      prev.insertBefore(topNode)
      if ($isElementNode(topNode)) {
        topNode.select()
      }
    }
  })
}

function moveBlockDown(editor: LexicalEditor, element: HTMLElement) {
  editor.update(() => {
    const node = $getNearestNodeFromDOMNode(element)
    if (!node) return
    const topNode = getTopLevelNode(node)
    const next = topNode.getNextSibling()
    if (next) {
      next.insertAfter(topNode)
      if ($isElementNode(topNode)) {
        topNode.select()
      }
    }
  })
}

function quickInsertBelow(
  editor: LexicalEditor,
  element: HTMLElement,
  insertBefore = false
) {
  editor.update(() => {
    const node = $getNearestNodeFromDOMNode(element)
    if (!node) return
    const topNode = getTopLevelNode(node)
    const p = $createParagraphNode()
    if (insertBefore) {
      topNode.insertBefore(p)
    } else {
      topNode.insertAfter(p)
    }
    p.select()
  })
}

export function DraggableBlockPlugin({
  anchorElem = typeof document !== "undefined" ? document.body : null,
}: {
  anchorElem?: HTMLElement | null
}): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  const menuRef = React.useRef<HTMLDivElement>(null)
  const targetLineRef = React.useRef<HTMLDivElement>(null)
  const [draggableElement, setDraggableElement] =
    React.useState<HTMLElement | null>(null)
  const [menuOpen, setMenuOpen] = React.useState(false)

  const blockInfo = React.useMemo(() => {
    if (!menuOpen || !draggableElement) {
      return { type: "paragraph", label: "Text" }
    }
    return getBlockInfo(editor, draggableElement)
  }, [editor, draggableElement, menuOpen])

  const isOnMenu = React.useCallback((element: HTMLElement) => {
    return (
      !!element.closest(".draggable-block-menu") ||
      !!element.closest("[data-draggable-popover]") ||
      !!element.closest("[data-draggable-menu]")
    )
  }, [])

  // Close popover on click outside or Escape
  React.useEffect(() => {
    if (!menuOpen) return

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target &&
        !target.closest(".draggable-block-menu") &&
        !target.closest("[data-draggable-popover]")
      ) {
        setMenuOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [menuOpen])

  if (!anchorElem) {
    return null
  }

  const handleQuickInsert = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!draggableElement) return
    quickInsertBelow(editor, draggableElement, e.altKey || e.ctrlKey)
  }

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen((prev) => !prev)
  }

  const handleDuplicate = () => {
    if (!draggableElement) return
    duplicateBlock(editor, draggableElement)
    setMenuOpen(false)
  }

  const handleDelete = () => {
    if (!draggableElement) return
    deleteBlock(editor, draggableElement)
    setMenuOpen(false)
  }

  const handleCopyText = () => {
    if (!draggableElement) return
    copyBlockContent(editor, draggableElement)
    setMenuOpen(false)
  }

  const handleMoveUp = () => {
    if (!draggableElement) return
    moveBlockUp(editor, draggableElement)
    setMenuOpen(false)
  }

  const handleMoveDown = () => {
    if (!draggableElement) return
    moveBlockDown(editor, draggableElement)
    setMenuOpen(false)
  }

  const handleTransform = (targetType: TargetBlockType) => {
    if (!draggableElement) return
    transformBlock(editor, draggableElement, targetType)
    setMenuOpen(false)
  }

  const turnIntoOptions: Array<{
    type: TargetBlockType
    label: string
    icon: React.ComponentType<{ className?: string }>
  }> = [
    { type: "paragraph", label: "Text", icon: Type },
    { type: "h1", label: "Heading 1", icon: Heading1 },
    { type: "h2", label: "Heading 2", icon: Heading2 },
    { type: "h3", label: "Heading 3", icon: Heading3 },
    { type: "bullet", label: "Bullet List", icon: List },
    { type: "number", label: "Numbered List", icon: ListOrdered },
    { type: "check", label: "Checklist", icon: CheckSquare },
    { type: "quote", label: "Quote", icon: Quote },
    { type: "code", label: "Code Block", icon: Code2 },
  ]

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={anchorElem}
      menuRef={menuRef}
      targetLineRef={targetLineRef}
      isOnMenu={isOnMenu}
      onElementChanged={setDraggableElement}
      menuComponent={
        <div
          ref={menuRef}
          data-draggable-menu
          data-menu-open={menuOpen ? "true" : "false"}
          className={cn(
            "draggable-block-menu group/drag flex items-center gap-0.5 rounded-md border border-border/50 bg-background/90 p-0.5 shadow-sm backdrop-blur-md transition-opacity duration-150",
            menuOpen && "opacity-100 ring-1 ring-primary/30"
          )}
        >
          {/* Quick Insert (+) Button */}
          <button
            type="button"
            title="Click to add block below (Alt+click to add above)"
            draggable={false}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleQuickInsert}
            className="flex size-5 cursor-pointer items-center justify-center rounded-xs text-muted-foreground/75 transition-colors hover:bg-muted hover:text-foreground active:scale-95"
          >
            <Plus className="size-3.5" />
          </button>

          {/* Draggable Handle (⠿) Button */}
          <button
            type="button"
            title="Drag to reorder · Click for block actions"
            draggable={false}
            onClick={handleToggleMenu}
            className="flex size-5 cursor-grab items-center justify-center rounded-xs text-muted-foreground/75 transition-colors hover:bg-muted hover:text-foreground active:scale-95 active:cursor-grabbing"
          >
            <GripVertical className="size-3.5" />
          </button>

          {/* Block Action Popover Menu */}
          {menuOpen && (
            <div
              data-draggable-popover
              className="draggable-block-popover absolute top-0 left-full z-50 ml-1.5 w-60 animate-in rounded-xl border border-border/80 bg-popover/95 p-1.5 shadow-2xl backdrop-blur-md fade-in-0 zoom-in-95"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with current block badge */}
              <div className="mb-1 flex items-center justify-between border-b border-border/40 px-2 py-1.5 text-xs text-muted-foreground">
                <span className="text-[10px] font-semibold tracking-wider uppercase">
                  Block Actions
                </span>
                <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                  {blockInfo.label}
                </span>
              </div>

              {/* Primary Actions */}
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={handleDuplicate}
                  className="flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1 text-xs text-foreground transition-colors hover:bg-muted"
                >
                  <span className="flex items-center gap-2">
                    <Copy className="size-3.5 text-muted-foreground" />
                    <span>Duplicate</span>
                  </span>
                  <kbd className="font-mono text-[10px] text-muted-foreground/60">
                    ⌘D
                  </kbd>
                </button>

                <button
                  type="button"
                  onClick={handleCopyText}
                  className="flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1 text-xs text-foreground transition-colors hover:bg-muted"
                >
                  <span className="flex items-center gap-2">
                    <Clipboard className="size-3.5 text-muted-foreground" />
                    <span>Copy text</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleMoveUp}
                  className="flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1 text-xs text-foreground transition-colors hover:bg-muted"
                >
                  <span className="flex items-center gap-2">
                    <ChevronUp className="size-3.5 text-muted-foreground" />
                    <span>Move up</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleMoveDown}
                  className="flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1 text-xs text-foreground transition-colors hover:bg-muted"
                >
                  <span className="flex items-center gap-2">
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                    <span>Move down</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1 text-xs text-destructive transition-colors hover:bg-destructive/10"
                >
                  <span className="flex items-center gap-2">
                    <Trash2 className="size-3.5" />
                    <span>Delete</span>
                  </span>
                  <kbd className="font-mono text-[10px] text-destructive/70">
                    Del
                  </kbd>
                </button>
              </div>

              {/* Turn Into Section */}
              <div className="my-1.5 h-px bg-border/40" />
              <div className="px-2 py-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                Turn into
              </div>
              <div className="mt-1 max-h-44 scrollbar-thin space-y-0.5 overflow-y-auto">
                {turnIntoOptions.map((opt) => {
                  const Icon = opt.icon
                  const isActive = opt.type === blockInfo.type
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => handleTransform(opt.type)}
                      className={cn(
                        "flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1 text-xs transition-colors hover:bg-muted",
                        isActive
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-foreground"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="size-3.5 text-muted-foreground" />
                        <span>{opt.label}</span>
                      </span>
                      {isActive && <span className="text-[10px]">●</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      }
      targetLineComponent={
        <div ref={targetLineRef} className="draggable-block-target-line" />
      }
    />
  )
}
