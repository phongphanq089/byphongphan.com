import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $deleteTableColumn,
  $getTableColumnIndexFromTableCellNode,
  $getTableNodeFromLexicalNodeOrThrow,
  $getTableRowNodeFromTableCellNodeOrThrow,
  $insertTableColumnAtNode,
  $insertTableRowAtNode,
  $isTableCellNode,
  TableCellHeaderStates,
} from "@lexical/table"
import { $getNearestNodeFromDOMNode } from "lexical"
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  Columns,
  Palette,
  Rows,
  Table as TableIcon,
  Trash2,
} from "lucide-react"
import * as React from "react"
import { createPortal } from "react-dom"

import { cn } from "@/shared/lib/utils"

const CELL_PALETTE: Array<{
  name: string
  value: string | null
  bgClass: string
}> = [
  {
    name: "Default",
    value: null,
    bgClass: "bg-transparent border border-dashed border-border",
  },
  {
    name: "Slate",
    value: "rgba(148, 163, 184, 0.16)",
    bgClass: "bg-slate-500/20",
  },
  {
    name: "Purple",
    value: "rgba(139, 92, 246, 0.18)",
    bgClass: "bg-purple-500/20",
  },
  { name: "Blue", value: "rgba(14, 165, 233, 0.18)", bgClass: "bg-sky-500/20" },
  {
    name: "Emerald",
    value: "rgba(16, 185, 129, 0.18)",
    bgClass: "bg-emerald-500/20",
  },
  {
    name: "Amber",
    value: "rgba(245, 158, 11, 0.18)",
    bgClass: "bg-amber-500/20",
  },
  { name: "Rose", value: "rgba(244, 63, 94, 0.18)", bgClass: "bg-rose-500/20" },
]

export function TableActionMenuPlugin(): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  const [targetCell, setTargetCell] = React.useState<{
    dom: HTMLElement
    rect: DOMRect
  } | null>(null)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Track cell mouse move / hover
  React.useEffect(() => {
    const rootElement = editor.getRootElement()
    if (!rootElement) return

    let closeTimer: ReturnType<typeof setTimeout> | null = null

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      const cell = target.closest("td, th")
      if (cell instanceof HTMLElement && rootElement.contains(cell)) {
        if (closeTimer) clearTimeout(closeTimer)
        const rect = cell.getBoundingClientRect()
        setTargetCell({ dom: cell, rect })
      } else {
        if (!menuOpen) {
          closeTimer = setTimeout(() => {
            setTargetCell(null)
          }, 350)
        }
      }
    }

    const handleScrollOrResize = () => {
      if (menuOpen) {
        setMenuOpen(false)
      }
      setTargetCell(null)
    }

    rootElement.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScrollOrResize, true)
    window.addEventListener("resize", handleScrollOrResize)

    return () => {
      if (closeTimer) clearTimeout(closeTimer)
      rootElement.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScrollOrResize, true)
      window.removeEventListener("resize", handleScrollOrResize)
    }
  }, [editor, menuOpen])

  // Handle click outside to close menu
  React.useEffect(() => {
    if (!menuOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
        setTargetCell(null)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [menuOpen])

  if (!targetCell) return null

  // Action Handlers
  const insertRow = (after: boolean) => {
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(targetCell.dom)
      if ($isTableCellNode(node)) {
        $insertTableRowAtNode(node, after)
      }
    })
    setMenuOpen(false)
  }

  const deleteRow = () => {
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(targetCell.dom)
      if ($isTableCellNode(node)) {
        try {
          const row = $getTableRowNodeFromTableCellNodeOrThrow(node)
          row.remove()
        } catch {}
      }
    })
    setMenuOpen(false)
    setTargetCell(null)
  }

  const insertColumn = (after: boolean) => {
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(targetCell.dom)
      if ($isTableCellNode(node)) {
        $insertTableColumnAtNode(node, after, true)
      }
    })
    setMenuOpen(false)
  }

  const deleteColumn = () => {
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(targetCell.dom)
      if ($isTableCellNode(node)) {
        try {
          const table = $getTableNodeFromLexicalNodeOrThrow(node)
          const colIdx = $getTableColumnIndexFromTableCellNode(node)
          $deleteTableColumn(table, colIdx)
        } catch {}
      }
    })
    setMenuOpen(false)
    setTargetCell(null)
  }

  const deleteTable = () => {
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(targetCell.dom)
      if ($isTableCellNode(node)) {
        try {
          const table = $getTableNodeFromLexicalNodeOrThrow(node)
          table.remove()
        } catch {}
      }
    })
    setMenuOpen(false)
    setTargetCell(null)
  }

  const toggleHeader = (type: "row" | "col") => {
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(targetCell.dom)
      if ($isTableCellNode(node)) {
        const flag =
          type === "row"
            ? TableCellHeaderStates.ROW
            : TableCellHeaderStates.COLUMN
        node.toggleHeaderStyle(flag)
      }
    })
    setMenuOpen(false)
  }

  const setCellColor = (color: string | null) => {
    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(targetCell.dom)
      if ($isTableCellNode(node)) {
        node.setBackgroundColor(color)
      }
    })
    setMenuOpen(false)
  }

  return createPortal(
    <div
      ref={menuRef}
      className="pointer-events-auto fixed z-50 select-none"
      style={{
        left: targetCell.rect.right - 24,
        top: targetCell.rect.top + 4,
      }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        aria-label="Table Cell Actions"
        onClick={() => setMenuOpen((p) => !p)}
        className={cn(
          "border-ns-border/60 bg-ns-surface/90 text-ns-muted hover:bg-ns-surface-alt hover:text-ns-text flex size-5 items-center justify-center rounded border shadow-sm backdrop-blur transition-all duration-150",
          menuOpen &&
            "border-ns-primary bg-ns-primary shadow-ns-primary/30 text-white"
        )}
      >
        <ChevronDown className="size-3.5" />
      </button>

      {/* Dropdown Popover */}
      {menuOpen && (
        <div
          className="border-ns-border/80 bg-ns-surface/95 absolute top-6 right-0 w-56 animate-in rounded-xl border p-1.5 shadow-2xl backdrop-blur-xl duration-100 fade-in-0 zoom-in-95"
          style={{ maxHeight: "85vh", overflowY: "auto" }}
        >
          {/* Section: Row Actions */}
          <div className="text-ns-muted px-2 py-1 text-[10px] font-semibold tracking-wider uppercase">
            Row Operations
          </div>
          <button
            type="button"
            onClick={() => insertRow(false)}
            className="text-ns-text hover:bg-ns-surface-alt hover:text-ns-primary-lt flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors"
          >
            <ArrowUp className="text-ns-muted size-3.5" />
            <span>Insert row above</span>
          </button>
          <button
            type="button"
            onClick={() => insertRow(true)}
            className="text-ns-text hover:bg-ns-surface-alt hover:text-ns-primary-lt flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors"
          >
            <ArrowDown className="text-ns-muted size-3.5" />
            <span>Insert row below</span>
          </button>
          <button
            type="button"
            onClick={deleteRow}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-400 transition-colors hover:bg-rose-500/10"
          >
            <Trash2 className="size-3.5" />
            <span>Delete row</span>
          </button>

          <div className="border-ns-border-soft my-1 border-t" />

          {/* Section: Column Actions */}
          <div className="text-ns-muted px-2 py-1 text-[10px] font-semibold tracking-wider uppercase">
            Column Operations
          </div>
          <button
            type="button"
            onClick={() => insertColumn(false)}
            className="text-ns-text hover:bg-ns-surface-alt hover:text-ns-primary-lt flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors"
          >
            <ArrowLeft className="text-ns-muted size-3.5" />
            <span>Insert column left</span>
          </button>
          <button
            type="button"
            onClick={() => insertColumn(true)}
            className="text-ns-text hover:bg-ns-surface-alt hover:text-ns-primary-lt flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors"
          >
            <ArrowRight className="text-ns-muted size-3.5" />
            <span>Insert column right</span>
          </button>
          <button
            type="button"
            onClick={deleteColumn}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-400 transition-colors hover:bg-rose-500/10"
          >
            <Trash2 className="size-3.5" />
            <span>Delete column</span>
          </button>

          <div className="border-ns-border-soft my-1 border-t" />

          {/* Section: Header Formatting */}
          <div className="text-ns-muted px-2 py-1 text-[10px] font-semibold tracking-wider uppercase">
            Header Styles
          </div>
          <button
            type="button"
            onClick={() => toggleHeader("row")}
            className="text-ns-text hover:bg-ns-surface-alt flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors"
          >
            <Rows className="text-ns-muted size-3.5" />
            <span>Toggle Row Header</span>
          </button>
          <button
            type="button"
            onClick={() => toggleHeader("col")}
            className="text-ns-text hover:bg-ns-surface-alt flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors"
          >
            <Columns className="text-ns-muted size-3.5" />
            <span>Toggle Column Header</span>
          </button>

          <div className="border-ns-border-soft my-1 border-t" />

          {/* Section: Cell Background Color */}
          <div className="text-ns-muted flex items-center justify-between px-2 py-1 text-[10px] font-semibold tracking-wider uppercase">
            <span>Cell Background</span>
            <Palette className="text-ns-muted size-3" />
          </div>
          <div className="grid grid-cols-7 gap-1 px-2 py-1">
            {CELL_PALETTE.map((color) => (
              <button
                key={color.name}
                type="button"
                title={color.name}
                onClick={() => setCellColor(color.value)}
                className={cn(
                  "size-5 rounded-md shadow-xs transition-transform hover:scale-115 active:scale-95",
                  color.bgClass
                )}
              />
            ))}
          </div>

          <div className="border-ns-border-soft my-1 border-t" />

          {/* Section: Delete Table */}
          <button
            type="button"
            onClick={deleteTable}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-500 transition-colors hover:bg-rose-500/15"
          >
            <TableIcon className="size-3.5" />
            <span>Delete table</span>
          </button>
        </div>
      )}
    </div>,
    document.body
  )
}
