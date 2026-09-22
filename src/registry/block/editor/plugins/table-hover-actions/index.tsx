import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $deleteTableColumn,
  $getTableColumnIndexFromTableCellNode,
  $getTableNodeFromLexicalNodeOrThrow,
  $getTableRowNodeFromTableCellNodeOrThrow,
  $insertTableColumnAtNode,
  $insertTableRowAtNode,
  $isTableCellNode,
} from "@lexical/table"
import { $getNearestNodeFromDOMNode } from "lexical"
import { Plus, Trash2 } from "lucide-react"
import * as React from "react"
import { createPortal } from "react-dom"

interface Position {
  x: number
  y: number
  width: number
  height: number
}

export function TableHoverActionsPlugin(): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  const [hoveredCell, setHoveredCell] = React.useState<{
    dom: HTMLElement
    rect: Position
  } | null>(null)
  const [isMenuHovered, setIsMenuHovered] = React.useState(false)

  React.useEffect(() => {
    const rootElement = editor.getRootElement()
    if (!rootElement) return

    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      const cell = target.closest("td, th")
      if (cell && rootElement.contains(cell)) {
        if (timeoutId) clearTimeout(timeoutId)
        const rect = cell.getBoundingClientRect()
        setHoveredCell({
          dom: cell as HTMLElement,
          rect: {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
          },
        })
      } else {
        if (!isMenuHovered) {
          timeoutId = setTimeout(() => {
            setHoveredCell(null)
          }, 400)
        }
      }
    }

    const handleMouseLeave = () => {
      if (!isMenuHovered) {
        timeoutId = setTimeout(() => {
          setHoveredCell(null)
        }, 300)
      }
    }

    rootElement.addEventListener("mousemove", handleMouseMove)
    rootElement.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      rootElement.removeEventListener("mousemove", handleMouseMove)
      rootElement.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [editor, isMenuHovered])

  if (!hoveredCell) return null

  const insertRow = (after: boolean) => {
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(hoveredCell.dom)
      if ($isTableCellNode(node)) {
        $insertTableRowAtNode(node, after)
      }
    })
  }

  const deleteRow = () => {
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(hoveredCell.dom)
      if ($isTableCellNode(node)) {
        try {
          const row = $getTableRowNodeFromTableCellNodeOrThrow(node)
          row.remove()
        } catch {}
      }
    })
    setHoveredCell(null)
  }

  const insertCol = (after: boolean) => {
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(hoveredCell.dom)
      if ($isTableCellNode(node)) {
        $insertTableColumnAtNode(node, after, true)
      }
    })
  }

  const deleteCol = () => {
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(hoveredCell.dom)
      if ($isTableCellNode(node)) {
        try {
          const table = $getTableNodeFromLexicalNodeOrThrow(node)
          const colIdx = $getTableColumnIndexFromTableCellNode(node)
          $deleteTableColumn(table, colIdx)
        } catch {}
      }
    })
    setHoveredCell(null)
  }

  return createPortal(
    <div
      onMouseEnter={() => setIsMenuHovered(true)}
      onMouseLeave={() => {
        setIsMenuHovered(false)
        setHoveredCell(null)
      }}
      className="pointer-events-auto fixed z-50 transition-opacity duration-150"
      style={{
        left: hoveredCell.rect.x,
        top: hoveredCell.rect.y,
        width: hoveredCell.rect.width,
        height: hoveredCell.rect.height,
        pointerEvents: "none",
      }}
    >
      {/* Column Insert (Top Button) */}
      <div
        className="pointer-events-auto absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-border/80 bg-background/95 px-1 py-0.5 shadow-xs backdrop-blur-xs transition-transform hover:scale-110"
        title="Column actions"
      >
        <button
          type="button"
          onClick={() => insertCol(false)}
          className="flex size-4 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Insert column left"
        >
          <Plus className="size-3" />
        </button>
        <button
          type="button"
          onClick={() => insertCol(true)}
          className="flex size-4 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Insert column right"
        >
          <Plus className="size-3" />
        </button>
        <button
          type="button"
          onClick={deleteCol}
          className="flex size-4 cursor-pointer items-center justify-center rounded-full text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
          title="Delete column"
        >
          <Trash2 className="size-2.5" />
        </button>
      </div>

      {/* Row Insert (Left Button) */}
      <div
        className="pointer-events-auto absolute top-1/2 -left-3 flex -translate-y-1/2 flex-col items-center gap-0.5 rounded-full border border-border/80 bg-background/95 p-0.5 shadow-xs backdrop-blur-xs transition-transform hover:scale-110"
        title="Row actions"
      >
        <button
          type="button"
          onClick={() => insertRow(false)}
          className="flex size-4 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Insert row above"
        >
          <Plus className="size-3" />
        </button>
        <button
          type="button"
          onClick={() => insertRow(true)}
          className="flex size-4 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Insert row below"
        >
          <Plus className="size-3" />
        </button>
        <button
          type="button"
          onClick={deleteRow}
          className="flex size-4 cursor-pointer items-center justify-center rounded-full text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
          title="Delete row"
        >
          <Trash2 className="size-2.5" />
        </button>
      </div>
    </div>,
    document.body
  )
}
