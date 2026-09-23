import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import type { NodeKey } from "lexical"
import { $createParagraphNode, $getNearestNodeFromDOMNode } from "lexical"
import {
  ChevronDown,
  Columns2,
  Columns3,
  Columns4,
  Layers,
  Maximize2,
  Minus,
  Plus,
  Trash2,
} from "lucide-react"
import * as React from "react"
import { createPortal } from "react-dom"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import type { LayoutBorder, LayoutGap } from "../../nodes/layout-nodes"
import {
  $createLayoutItemNode,
  $isLayoutContainerNode,
  $isLayoutItemNode,
} from "../../nodes/layout-nodes"
import { cn } from "../../utils/cn"

interface ActiveContainerState {
  dom: HTMLElement
  key: NodeKey
  templateColumns: string
  gap: LayoutGap
  borderStyle: LayoutBorder
  columnCount: number
  rect: {
    top: number
    right: number
    width: number
    height: number
  }
}

export function LayoutActionMenu({
  anchorElem = typeof document !== "undefined" ? document.body : null,
}: {
  anchorElem?: HTMLElement | null
}): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  const [activeContainer, setActiveContainer] =
    React.useState<ActiveContainerState | null>(null)
  const [isMenuHovered, setIsMenuHovered] = React.useState(false)

  const updateActiveRect = React.useCallback(
    (dom: HTMLElement, key: NodeKey) => {
      const rect = dom.getBoundingClientRect()
      editor.getEditorState().read(() => {
        const node = editor.getEditorState()._nodeMap.get(key)
        if ($isLayoutContainerNode(node)) {
          const template = node.getTemplateColumns()
          const gap = node.getGap()
          const borderStyle = node.getBorderStyle()
          const columnCount = node.getChildrenSize()
          setActiveContainer({
            dom,
            key,
            templateColumns: template,
            gap,
            borderStyle,
            columnCount,
            rect: {
              top: rect.top,
              right: window.innerWidth - rect.right,
              width: rect.width,
              height: rect.height,
            },
          })
        }
      })
    },
    [editor]
  )

  React.useEffect(() => {
    const rootElement = editor.getRootElement()
    if (!rootElement) return

    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      const containerDom = target.closest<HTMLElement>(
        '[data-lexical-layout-container="true"], .layout-container'
      )

      if (containerDom && rootElement.contains(containerDom)) {
        if (timeoutId) clearTimeout(timeoutId)
        try {
          editor.read(() => {
            const node = $getNearestNodeFromDOMNode(containerDom)
            if ($isLayoutContainerNode(node)) {
              updateActiveRect(containerDom, node.getKey())
            }
          })
        } catch {
          // ignore if editor is not active
        }
      } else {
        if (!isMenuHovered) {
          timeoutId = setTimeout(() => {
            setActiveContainer(null)
          }, 350)
        }
      }
    }

    const handleScroll = () => {
      if (activeContainer) {
        updateActiveRect(activeContainer.dom, activeContainer.key)
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [editor, activeContainer, isMenuHovered, updateActiveRect])

  if (!anchorElem || !activeContainer) return null

  // Switch column template proportions
  const setTemplate = (newTemplate: string) => {
    editor.update(() => {
      const node = editor.getEditorState()._nodeMap.get(activeContainer.key)
      if ($isLayoutContainerNode(node)) {
        node.setTemplateColumns(newTemplate)

        const targetCount = newTemplate.trim().split(/\s+/).length
        const currentCount = node.getChildrenSize()

        if (targetCount > currentCount) {
          for (let i = currentCount; i < targetCount; i++) {
            const item = $createLayoutItemNode()
            item.append($createParagraphNode())
            node.append(item)
          }
        } else if (targetCount < currentCount) {
          // Merge overflow columns into the previous column without losing data
          const children = node.getChildren()
          const lastKeepItem = children[targetCount - 1]
          if ($isLayoutItemNode(lastKeepItem)) {
            for (let i = targetCount; i < currentCount; i++) {
              const discardItem = children[i]
              if ($isLayoutItemNode(discardItem)) {
                const subChildren = discardItem.getChildren()
                for (const sc of subChildren) {
                  lastKeepItem.append(sc)
                }
                discardItem.remove()
              }
            }
          }
        }
      }
    })
    updateActiveRect(activeContainer.dom, activeContainer.key)
  }

  // Add 1 Column
  const handleAddColumn = () => {
    if (activeContainer.columnCount >= 4) return
    const newCount = activeContainer.columnCount + 1
    const newTemplate = Array(newCount).fill("1fr").join(" ")
    setTemplate(newTemplate)
  }

  // Remove 1 Column
  const handleRemoveColumn = () => {
    if (activeContainer.columnCount <= 1) return
    const newCount = activeContainer.columnCount - 1
    const newTemplate = Array(newCount).fill("1fr").join(" ")
    setTemplate(newTemplate)
  }

  // Toggle Gap
  const handleCycleGap = () => {
    const nextGap: Record<LayoutGap, LayoutGap> = {
      compact: "normal",
      normal: "relaxed",
      relaxed: "compact",
    }
    const newGap = nextGap[activeContainer.gap] || "normal"

    editor.update(() => {
      const node = editor.getEditorState()._nodeMap.get(activeContainer.key)
      if ($isLayoutContainerNode(node)) {
        node.setGap(newGap)
      }
    })
    updateActiveRect(activeContainer.dom, activeContainer.key)
  }

  // Toggle Border Style
  const handleCycleBorder = () => {
    const nextBorder: Record<LayoutBorder, LayoutBorder> = {
      dashed: "card",
      card: "clean",
      clean: "dashed",
    }
    const newBorder = nextBorder[activeContainer.borderStyle] || "dashed"

    editor.update(() => {
      const node = editor.getEditorState()._nodeMap.get(activeContainer.key)
      if ($isLayoutContainerNode(node)) {
        node.setBorderStyle(newBorder)
      }
    })
    updateActiveRect(activeContainer.dom, activeContainer.key)
  }

  // Delete Entire Container
  const handleDeleteContainer = () => {
    editor.update(() => {
      const node = editor.getEditorState()._nodeMap.get(activeContainer.key)
      if ($isLayoutContainerNode(node)) {
        node.remove()
      }
    })
    setActiveContainer(null)
  }

  // Calculate coordinates (docked above container top-right)
  const isTooCloseToTop = activeContainer.rect.top < 45
  const topPos = isTooCloseToTop
    ? activeContainer.rect.top + 8
    : activeContainer.rect.top - 34
  const rightPos = Math.max(12, activeContainer.rect.right + 4)

  return createPortal(
    <div
      onMouseEnter={() => setIsMenuHovered(true)}
      onMouseLeave={() => {
        setIsMenuHovered(false)
        setActiveContainer(null)
      }}
      style={{
        position: "fixed",
        top: `${topPos}px`,
        right: `${rightPos}px`,
        zIndex: 50,
      }}
      className="flex animate-in items-center gap-1 rounded-lg border border-border/80 bg-background/95 p-1 shadow-lg backdrop-blur-md transition-all duration-150 fade-in-50 select-none zoom-in-95"
    >
      {/* Ratio Switcher Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            title="Change column proportions"
          >
            {activeContainer.columnCount === 2 && (
              <Columns2 className="size-3.5 text-primary" />
            )}
            {activeContainer.columnCount === 3 && (
              <Columns3 className="size-3.5 text-primary" />
            )}
            {activeContainer.columnCount >= 4 && (
              <Columns4 className="size-3.5 text-primary" />
            )}
            <span className="font-mono text-[11px]">
              {activeContainer.columnCount} Cols
            </span>
            <ChevronDown className="size-3 opacity-60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 text-xs">
          <DropdownMenuLabel className="text-[11px] tracking-wider text-muted-foreground uppercase">
            2 Columns Ratios
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setTemplate("1fr 1fr")}>
            <span className="font-mono font-medium">1 : 1</span>
            <span className="ml-auto text-muted-foreground">
              Equal (50% / 50%)
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTemplate("1fr 3fr")}>
            <span className="font-mono font-medium">1 : 3</span>
            <span className="ml-auto text-muted-foreground">
              Sidebar Left (25 / 75)
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTemplate("3fr 1fr")}>
            <span className="font-mono font-medium">3 : 1</span>
            <span className="ml-auto text-muted-foreground">
              Sidebar Right (75 / 25)
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTemplate("1fr 2fr")}>
            <span className="font-mono font-medium">1 : 2</span>
            <span className="ml-auto text-muted-foreground">
              Thirds Left (33 / 67)
            </span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-[11px] tracking-wider text-muted-foreground uppercase">
            3 Columns Ratios
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setTemplate("1fr 1fr 1fr")}>
            <span className="font-mono font-medium">1 : 1 : 1</span>
            <span className="ml-auto text-muted-foreground">
              Equal (33% each)
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTemplate("1fr 2fr 1fr")}>
            <span className="font-mono font-medium">1 : 2 : 1</span>
            <span className="ml-auto text-muted-foreground">
              Hero Center (25/50/25)
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTemplate("2fr 1fr 1fr")}>
            <span className="font-mono font-medium">2 : 1 : 1</span>
            <span className="ml-auto text-muted-foreground">
              Lead Left (50/25/25)
            </span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-[11px] tracking-wider text-muted-foreground uppercase">
            4 Columns
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setTemplate("1fr 1fr 1fr 1fr")}>
            <span className="font-mono font-medium">1 : 1 : 1 : 1</span>
            <span className="ml-auto text-muted-foreground">
              Equal (25% each)
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-4 w-px bg-border/80" />

      {/* Add Column */}
      <button
        type="button"
        disabled={activeContainer.columnCount >= 4}
        onClick={handleAddColumn}
        className={cn(
          "flex size-6 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          activeContainer.columnCount >= 4 && "cursor-not-allowed opacity-40"
        )}
        title="Add column to layout"
      >
        <Plus className="size-3.5" />
      </button>

      {/* Remove Column */}
      <button
        type="button"
        disabled={activeContainer.columnCount <= 1}
        onClick={handleRemoveColumn}
        className={cn(
          "flex size-6 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          activeContainer.columnCount <= 1 && "cursor-not-allowed opacity-40"
        )}
        title="Remove column (merges content into previous column)"
      >
        <Minus className="size-3.5" />
      </button>

      <div className="h-4 w-px bg-border/80" />

      {/* Cycle Gap */}
      <button
        type="button"
        onClick={handleCycleGap}
        className="flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title={`Column Gap: ${activeContainer.gap} (click to toggle)`}
      >
        <Maximize2 className="size-3" />
        <span className="font-mono text-[10px] uppercase">
          {activeContainer.gap}
        </span>
      </button>

      {/* Cycle Border */}
      <button
        type="button"
        onClick={handleCycleBorder}
        className="flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title={`Container Style: ${activeContainer.borderStyle} (click to toggle)`}
      >
        <Layers className="size-3" />
        <span className="font-mono text-[10px] uppercase">
          {activeContainer.borderStyle}
        </span>
      </button>

      <div className="h-4 w-px bg-border/80" />

      {/* Delete Container */}
      <button
        type="button"
        onClick={handleDeleteContainer}
        className="flex size-6 cursor-pointer items-center justify-center rounded-md text-destructive/80 transition-colors hover:bg-destructive/10 hover:text-destructive"
        title="Delete layout container"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>,
    anchorElem
  )
}
