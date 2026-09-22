/* eslint-disable react-hooks/set-state-in-effect */
import type {
  ExcalidrawElement,
  NonDeleted,
} from "@excalidraw/excalidraw/element/types"
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useLexicalEditable } from "@lexical/react/useLexicalEditable"
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection"
import type { NodeKey } from "lexical"
import {
  $getNodeByKey,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  isDOMNode,
  mergeRegister,
} from "lexical"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Pencil,
  Trash2,
} from "lucide-react"
import * as React from "react"

import { useTheme } from "@/shared/providers"

import { cn } from "../../utils/cn"
import { $isExcalidrawNode } from "../excalidraw-node"
import { ExcalidrawImage } from "./excalidraw-image"
import { ExcalidrawModal } from "./excalidraw-modal"
import type { Dimension, ExcalidrawNodeData } from "./types"

export interface ExcalidrawComponentProps {
  nodeKey: NodeKey
  data: string
  width?: Dimension
  height?: Dimension
  alignment?: "left" | "center" | "right"
}

export function ExcalidrawComponent({
  nodeKey,
  data,
  width = "inherit",
  height = "inherit",
  alignment = "center",
}: ExcalidrawComponentProps) {
  const [editor] = useLexicalComposerContext()
  const isEditable = useLexicalEditable()

  // Parse scene data safely
  const parsedData = React.useMemo<ExcalidrawNodeData>(() => {
    if (!data || data === "[]") return { elements: [], appState: {}, files: {} }
    try {
      return JSON.parse(data)
    } catch {
      return { elements: [], appState: {}, files: {} }
    }
  }, [data])

  const { elements = [], files = {}, appState = {} } = parsedData

  // If node was just inserted with empty data, immediately open modal for drawing
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(
    (!data || data === "[]" || elements.length === 0) && isEditable
  )
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey)
  const [currentWidth, setCurrentWidth] = React.useState<Dimension>(width)
  const [currentAlign, setCurrentAlign] = React.useState<
    "left" | "center" | "right"
  >(alignment)
  const [isResizing, setIsResizing] = React.useState<boolean>(false)

  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const isDraggingRef = React.useRef(false)
  const startXRef = React.useRef(0)
  const startWidthRef = React.useRef(0)

  // Track active theme dynamically
  const { theme } = useTheme()

  // Sync width & alignment from node
  React.useEffect(() => {
    setCurrentWidth(width)
  }, [width])

  React.useEffect(() => {
    setCurrentAlign(alignment)
  }, [alignment])

  // Click & selection handling
  React.useEffect(() => {
    if (!isEditable) {
      if (isSelected) clearSelection()
      return
    }

    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event: MouseEvent) => {
          const container = containerRef.current
          const eventTarget = event.target

          if (isResizing) return true

          if (
            container !== null &&
            isDOMNode(eventTarget) &&
            container.contains(eventTarget)
          ) {
            if (!event.shiftKey) {
              clearSelection()
            }
            setSelected(true)

            // Double click opens Excalidraw editor
            if (event.detail > 1) {
              setIsModalOpen(true)
            }
            return true
          }

          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [clearSelection, editor, isSelected, isResizing, setSelected, isEditable])

  const updateNodeData = React.useCallback(
    (
      newElements: readonly NonDeleted<ExcalidrawElement>[],
      newAppState: Partial<AppState>,
      newFiles: BinaryFiles
    ) => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey)
        if ($isExcalidrawNode(node)) {
          const nonDeleted = newElements.filter((el) => !el.isDeleted)
          if (nonDeleted.length > 0 || Object.keys(newFiles).length > 0) {
            node.setData(
              JSON.stringify({
                appState: newAppState,
                elements: nonDeleted,
                files: newFiles,
              })
            )
          } else {
            node.remove()
          }
        }
      })
    },
    [editor, nodeKey]
  )

  const updateNodeWidth = React.useCallback(
    (nextWidth: Dimension) => {
      setCurrentWidth(nextWidth)
      editor.update(() => {
        const node = $getNodeByKey(nodeKey)
        if ($isExcalidrawNode(node)) {
          node.setWidth(nextWidth)
        }
      })
    },
    [editor, nodeKey]
  )

  const updateNodeAlignment = React.useCallback(
    (nextAlign: "left" | "center" | "right") => {
      setCurrentAlign(nextAlign)
      editor.update(() => {
        const node = $getNodeByKey(nodeKey)
        if ($isExcalidrawNode(node)) {
          node.setAlignment(nextAlign)
        }
      })
    },
    [editor, nodeKey]
  )

  const deleteNode = React.useCallback(() => {
    setIsModalOpen(false)
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if (node) {
        node.remove()
      }
    })
  }, [editor, nodeKey])

  const closeModal = React.useCallback(() => {
    setIsModalOpen(false)
    if (elements.length === 0) {
      deleteNode()
    }
  }, [deleteNode, elements.length])

  // Drag resize handlers
  const handlePointerDownResize = (
    e: React.PointerEvent,
    direction: "left" | "right"
  ) => {
    e.preventDefault()
    e.stopPropagation()

    isDraggingRef.current = true
    startXRef.current = e.clientX

    const currentElemWidth =
      containerRef.current?.getBoundingClientRect().width || 600
    startWidthRef.current = currentElemWidth
    setIsResizing(true)

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingRef.current) return
      const deltaX =
        direction === "right"
          ? moveEvent.clientX - startXRef.current
          : startXRef.current - moveEvent.clientX

      const newWidth = Math.max(
        320,
        Math.min(1400, Math.round(startWidthRef.current + deltaX))
      )
      setCurrentWidth(newWidth)
    }

    const handlePointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false
        window.removeEventListener("pointermove", handlePointerMove)
        window.removeEventListener("pointerup", handlePointerUp)

        setTimeout(() => setIsResizing(false), 150)
        const finalWidth =
          containerRef.current?.getBoundingClientRect().width ||
          startWidthRef.current
        updateNodeWidth(Math.round(finalWidth))
      }
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)
  }

  const alignmentClass = React.useMemo(() => {
    switch (currentAlign) {
      case "left":
        return "mr-auto ml-0"
      case "right":
        return "ml-auto mr-0"
      case "center":
      default:
        return "mx-auto"
    }
  }, [currentAlign])

  return (
    <>
      {isEditable && isModalOpen && (
        <ExcalidrawModal
          isShown={isModalOpen}
          initialElements={elements}
          initialAppState={appState}
          initialFiles={files}
          onDelete={deleteNode}
          onClose={closeModal}
          onSave={(els, aps, fls) => {
            updateNodeData(els, aps, fls)
            setIsModalOpen(false)
          }}
        />
      )}

      {elements.length > 0 && (
        <div
          ref={containerRef}
          data-lexical-node={nodeKey}
          onClick={() => setSelected(true)}
          tabIndex={0}
          className={cn(
            "group relative my-5 flex flex-col overflow-visible rounded-2xl border border-border/50 bg-card/40 shadow-xs transition-all outline-none select-none",
            alignmentClass,
            isSelected &&
              "shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background"
          )}
          style={{
            width:
              typeof currentWidth === "number" ? `${currentWidth}px` : "100%",
          }}
        >
          {/* Floating Action Bar (Hover or Selected) */}
          {isEditable && (
            <div
              className={cn(
                "absolute -top-11 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-border/70 bg-popover/95 px-1.5 py-1 shadow-lg backdrop-blur-md transition-all duration-150",
                isSelected
                  ? "pointer-events-auto scale-100 opacity-100"
                  : "pointer-events-none scale-95 opacity-0 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100"
              )}
            >
              {/* Alignment controls */}
              <div className="flex items-center rounded-md bg-muted/60 p-0.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    updateNodeAlignment("left")
                  }}
                  className={cn(
                    "cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:text-foreground",
                    currentAlign === "left" &&
                      "bg-background font-semibold text-foreground shadow-2xs"
                  )}
                  title="Align left"
                >
                  <AlignLeft className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    updateNodeAlignment("center")
                  }}
                  className={cn(
                    "cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:text-foreground",
                    currentAlign === "center" &&
                      "bg-background font-semibold text-foreground shadow-2xs"
                  )}
                  title="Align center"
                >
                  <AlignCenter className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    updateNodeAlignment("right")
                  }}
                  className={cn(
                    "cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:text-foreground",
                    currentAlign === "right" &&
                      "bg-background font-semibold text-foreground shadow-2xs"
                  )}
                  title="Align right"
                >
                  <AlignRight className="size-3.5" />
                </button>
              </div>

              <div className="mx-0.5 h-3.5 w-px bg-border/60" />

              {/* Width presets */}
              <div className="flex items-center gap-0.5 text-[11px] font-medium">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    updateNodeWidth(400)
                  }}
                  className={cn(
                    "cursor-pointer rounded px-1.5 py-0.5 whitespace-nowrap text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    currentWidth === 400 &&
                      "bg-primary/10 font-semibold text-primary"
                  )}
                >
                  Small
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    updateNodeWidth(700)
                  }}
                  className={cn(
                    "cursor-pointer rounded px-1.5 py-0.5 whitespace-nowrap text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    currentWidth === 700 &&
                      "bg-primary/10 font-semibold text-primary"
                  )}
                >
                  Medium
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    updateNodeWidth("inherit")
                  }}
                  className={cn(
                    "cursor-pointer rounded px-1.5 py-0.5 whitespace-nowrap text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    currentWidth === "inherit" &&
                      "bg-primary/10 font-semibold text-primary"
                  )}
                >
                  Full
                </button>
              </div>

              <div className="mx-0.5 h-3.5 w-px bg-border/60" />

              {/* Edit Excalidraw Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsModalOpen(true)
                }}
                className="flex cursor-pointer items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary/20"
                title="Edit drawing (or double-click)"
              >
                <Pencil className="size-3" />
                <span>Edit</span>
              </button>

              <div className="mx-0.5 h-3.5 w-px bg-border/60" />

              {/* Delete */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteNode()
                }}
                className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                title="Delete whiteboard"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          )}

          {/* Render Vector SVG Preview */}
          <ExcalidrawImage
            elements={elements}
            files={files}
            appState={appState}
            width={currentWidth}
            height={height}
            isDark={theme === "dark"}
            className="cursor-pointer"
          />

          {/* Interactive Drag Handles for Width Resizing */}
          {isSelected && isEditable && (
            <>
              <div
                onPointerDown={(e) => handlePointerDownResize(e, "left")}
                className="absolute top-1/2 -left-2 z-20 flex h-9 w-2.5 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-border/80 bg-background shadow-md transition-transform hover:scale-125 hover:bg-primary hover:text-white"
                title="Drag to resize width"
              >
                <div className="h-3 w-0.5 rounded-full bg-muted-foreground/60" />
              </div>
              <div
                onPointerDown={(e) => handlePointerDownResize(e, "right")}
                className="absolute top-1/2 -right-2 z-20 flex h-9 w-2.5 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-border/80 bg-background shadow-md transition-transform hover:scale-125 hover:bg-primary hover:text-white"
                title="Drag to resize width"
              >
                <div className="h-3 w-0.5 rounded-full bg-muted-foreground/60" />
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default ExcalidrawComponent
