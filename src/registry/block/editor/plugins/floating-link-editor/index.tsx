import {
  $isAutoLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
} from "@lexical/link"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
} from "lexical"
import { Check, ExternalLink, Pencil, Trash2, X } from "lucide-react"
import * as React from "react"
import { createPortal } from "react-dom"

import { getSelectedNode } from "../../utils/get-selected-node"
import { sanitizeUrl } from "../../utils/url"

export function FloatingLinkEditorPlugin({
  anchorElem = typeof document !== "undefined" ? document.body : null,
}: {
  anchorElem?: HTMLElement | null
}) {
  const [editor] = useLexicalComposerContext()
  const editorRef = React.useRef<HTMLDivElement | null>(null)
  const [linkUrl, setLinkUrl] = React.useState("")
  const [isEditMode, setIsEditMode] = React.useState(false)
  const [draftUrl, setDraftUrl] = React.useState("")
  const [coords, setCoords] = React.useState<{
    top: number
    left: number
  } | null>(null)

  const updateLinkEditor = React.useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      let activeLink = null

      if ($isLinkNode(parent) || $isAutoLinkNode(parent)) {
        activeLink = parent
      } else if ($isLinkNode(node) || $isAutoLinkNode(node)) {
        activeLink = node
      }

      if (activeLink !== null) {
        setLinkUrl(activeLink.getURL())
        setDraftUrl(activeLink.getURL())

        const domNode = editor.getElementByKey(activeLink.getKey())
        if (domNode) {
          const rect = domNode.getBoundingClientRect()
          setCoords({
            left: rect.left + window.scrollX,
            top: rect.bottom + window.scrollY + 8,
          })
          return
        }
      }
    }

    setCoords(null)
    setIsEditMode(false)
  }, [editor])

  React.useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateLinkEditor()
        return false
      },
      COMMAND_PRIORITY_LOW
    )
  }, [editor, updateLinkEditor])

  const handleSave = () => {
    const cleanUrl = sanitizeUrl(draftUrl)
    if (cleanUrl) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, cleanUrl)
    }
    setIsEditMode(false)
  }

  const handleUnlink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    setCoords(null)
  }

  if (!coords || !anchorElem) return null

  return createPortal(
    <div
      ref={editorRef}
      style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
      className="fixed z-50 flex animate-in items-center gap-1.5 rounded-xl border border-border/80 bg-background/95 p-1.5 shadow-xl backdrop-blur-md duration-100 select-none zoom-in-95 fade-in"
    >
      {isEditMode ? (
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={draftUrl}
            onChange={(e) => setDraftUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave()
              if (e.key === "Escape") setIsEditMode(false)
            }}
            placeholder="Paste URL..."
            autoFocus
            className="w-56 rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="button"
            onClick={handleSave}
            className="cursor-pointer rounded p-1 text-primary hover:bg-primary/10"
            title="Save URL"
          >
            <Check className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsEditMode(false)}
            className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-muted"
            title="Cancel"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-1 text-xs">
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-[200px] truncate text-primary hover:underline"
            title={linkUrl}
          >
            {linkUrl}
          </a>
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Open in new tab"
          >
            <ExternalLink className="size-3.5" />
          </a>
          <button
            type="button"
            onClick={() => setIsEditMode(true)}
            className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Edit URL"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={handleUnlink}
            className="cursor-pointer rounded p-1 text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
            title="Remove Link"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      )}
    </div>,
    anchorElem
  )
}
