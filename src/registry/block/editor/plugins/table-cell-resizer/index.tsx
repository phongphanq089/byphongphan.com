import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getTableColumnIndexFromTableCellNode,
  $getTableNodeFromLexicalNodeOrThrow,
  $isTableCellNode,
  $isTableRowNode,
} from "@lexical/table"
import { $getNearestNodeFromDOMNode } from "lexical"
import * as React from "react"
import { createPortal } from "react-dom"

interface ResizerState {
  cellDom: HTMLElement
  tableDom: HTMLElement
  lineLeft: number
  tableTop: number
  tableHeight: number
  startClientX: number
  startWidth: number
  currentWidth: number
}

const MIN_COLUMN_WIDTH = 45

export function TableCellResizerPlugin(): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  const [activeHandle, setActiveHandle] = React.useState<{
    cellDom: HTMLElement
    tableDom: HTMLElement
    x: number
    top: number
    height: number
  } | null>(null)
  const [resizing, setResizing] = React.useState<ResizerState | null>(null)

  // Track hover near right edge of cells
  React.useEffect(() => {
    const root = editor.getRootElement()
    if (!root || resizing) return

    let clearTimer: ReturnType<typeof setTimeout> | null = null

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      const cell = target.closest("td, th")
      const table = cell?.closest("table")

      if (
        cell instanceof HTMLElement &&
        table instanceof HTMLElement &&
        root.contains(cell)
      ) {
        const cellRect = cell.getBoundingClientRect()
        const tableRect = table.getBoundingClientRect()

        // Check if mouse is near the right boundary of the cell (within 7px)
        const isNearRightEdge =
          Math.abs(e.clientX - cellRect.right) <= 7 &&
          e.clientY >= cellRect.top &&
          e.clientY <= cellRect.bottom

        if (isNearRightEdge) {
          if (clearTimer) clearTimeout(clearTimer)
          setActiveHandle({
            cellDom: cell,
            tableDom: table,
            x: cellRect.right,
            top: tableRect.top,
            height: tableRect.height,
          })
          return
        }
      }

      if (activeHandle) {
        clearTimer = setTimeout(() => {
          setActiveHandle(null)
        }, 150)
      }
    }

    const handleMouseLeave = () => {
      setActiveHandle(null)
    }

    root.addEventListener("mousemove", handleMouseMove)
    root.addEventListener("mouseleave", handleMouseLeave)
    return () => {
      if (clearTimer) clearTimeout(clearTimer)
      root.removeEventListener("mousemove", handleMouseMove)
      root.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [editor, resizing, activeHandle])

  // Mouse down on handle -> start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!activeHandle) return

    const cellRect = activeHandle.cellDom.getBoundingClientRect()
    const tableRect = activeHandle.tableDom.getBoundingClientRect()

    setResizing({
      cellDom: activeHandle.cellDom,
      tableDom: activeHandle.tableDom,
      lineLeft: activeHandle.x,
      tableTop: tableRect.top,
      tableHeight: tableRect.height,
      startClientX: e.clientX,
      startWidth: cellRect.width,
      currentWidth: cellRect.width,
    })
  }

  // Handle global drag & release
  React.useEffect(() => {
    if (!resizing) return

    const handlePointerMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizing.startClientX
      const nextWidth = Math.max(resizing.startWidth + deltaX, MIN_COLUMN_WIDTH)

      setResizing((prev) =>
        prev
          ? {
              ...prev,
              lineLeft: prev.lineLeft + (nextWidth - prev.currentWidth),
              currentWidth: nextWidth,
            }
          : null
      )
    }

    const handlePointerUp = () => {
      if (resizing) {
        const finalWidth = resizing.currentWidth
        const targetCellDom = resizing.cellDom

        editor.update(() => {
          const node = $getNearestNodeFromDOMNode(targetCellDom)
          if ($isTableCellNode(node)) {
            try {
              const tableNode = $getTableNodeFromLexicalNodeOrThrow(node)
              const colIdx = $getTableColumnIndexFromTableCellNode(node)

              // Update width across all cells in this column
              const rows = tableNode.getChildren()
              for (const row of rows) {
                if ($isTableRowNode(row)) {
                  const cells = row.getChildren()
                  const colCell = cells[colIdx]
                  if ($isTableCellNode(colCell)) {
                    colCell.setWidth(finalWidth)
                  }
                }
              }
            } catch (err) {
              console.error("[TableCellResizer Error]:", err)
            }
          }
        })
      }

      setResizing(null)
      setActiveHandle(null)
    }

    window.addEventListener("mousemove", handlePointerMove)
    window.addEventListener("mouseup", handlePointerUp)
    return () => {
      window.removeEventListener("mousemove", handlePointerMove)
      window.removeEventListener("mouseup", handlePointerUp)
    }
  }, [resizing, editor])

  // If currently resizing, show the vertical guide line across the table
  if (resizing) {
    return createPortal(
      <div
        className="pointer-events-none fixed z-[9999] select-none"
        style={{
          left: resizing.lineLeft,
          top: resizing.tableTop,
          height: resizing.tableHeight,
          width: "2px",
          backgroundColor: "var(--primary, #3b82f6)",
          boxShadow: "0 0 8px rgba(59, 130, 246, 0.6)",
        }}
      >
        {/* Width tooltip bubble */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white shadow">
          {Math.round(resizing.currentWidth)}px
        </div>
      </div>,
      document.body
    )
  }

  // If hovering near right edge, render the hover resizer handle
  if (activeHandle) {
    return createPortal(
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize column"
        onMouseDown={handleMouseDown}
        className="fixed z-40 w-2 -translate-x-1/2 cursor-col-resize transition-colors select-none hover:bg-primary/50 active:bg-primary"
        style={{
          left: activeHandle.x,
          top: activeHandle.top,
          height: activeHandle.height,
        }}
      >
        <div className="mx-auto h-full w-[2px] bg-primary/40 transition-colors hover:bg-primary" />
      </div>,
      document.body
    )
  }

  return null
}
