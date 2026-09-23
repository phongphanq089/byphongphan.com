/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer"
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin"
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedEditor,
  SerializedLexicalNode,
  Spread,
} from "lexical"
import {
  $applyNodeReplacement,
  $getNodeByKey,
  createCommand,
  createEditor,
  DecoratorNode,
} from "lexical"
import { GripHorizontal, Pin, X } from "lucide-react"
import * as React from "react"
import { createPortal } from "react-dom"

import { cn } from "../utils/cn"

export type StickyColor = "yellow" | "pink" | "blue" | "green" | "purple"

export interface StickyColorConfig {
  id: StickyColor
  name: string
  bgClass: string
  borderClass: string
  textClass: string
  dotClass: string
}

export const STICKY_COLORS: StickyColorConfig[] = [
  {
    id: "yellow",
    name: "Yellow",
    bgClass: "bg-amber-100 dark:bg-amber-950/80",
    borderClass: "border-amber-300 dark:border-amber-700/60",
    textClass: "text-amber-950 dark:text-amber-100",
    dotClass: "bg-amber-400 hover:ring-amber-500",
  },
  {
    id: "pink",
    name: "Pink",
    bgClass: "bg-pink-100 dark:bg-pink-950/80",
    borderClass: "border-pink-300 dark:border-pink-700/60",
    textClass: "text-pink-950 dark:text-pink-100",
    dotClass: "bg-pink-400 hover:ring-pink-500",
  },
  {
    id: "blue",
    name: "Blue",
    bgClass: "bg-sky-100 dark:bg-sky-950/80",
    borderClass: "border-sky-300 dark:border-sky-700/60",
    textClass: "text-sky-950 dark:text-sky-100",
    dotClass: "bg-sky-400 hover:ring-sky-500",
  },
  {
    id: "green",
    name: "Green",
    bgClass: "bg-emerald-100 dark:bg-emerald-950/80",
    borderClass: "border-emerald-300 dark:border-emerald-700/60",
    textClass: "text-emerald-950 dark:text-emerald-100",
    dotClass: "bg-emerald-400 hover:ring-emerald-500",
  },
  {
    id: "purple",
    name: "Purple",
    bgClass: "bg-purple-100 dark:bg-purple-950/80",
    borderClass: "border-purple-300 dark:border-purple-700/60",
    textClass: "text-purple-950 dark:text-purple-100",
    dotClass: "bg-purple-400 hover:ring-purple-500",
  },
]

export type SerializedStickyNode = Spread<
  {
    xOffset: number
    yOffset: number
    color: StickyColor
    caption: SerializedEditor
  },
  SerializedLexicalNode
>

export const INSERT_STICKY_COMMAND = createCommand<{
  x?: number
  y?: number
  color?: StickyColor
} | void>("INSERT_STICKY_COMMAND")

function StickyComponent({
  color,
  nodeKey,
  caption,
  x,
  y,
}: {
  color: StickyColor
  nodeKey: NodeKey
  caption: LexicalEditor
  x: number
  y: number
}): React.JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [activeColor, setActiveColor] = React.useState<StickyColor>(color)
  const [currentPos, setCurrentPos] = React.useState<{ x: number; y: number }>({
    x,
    y,
  })
  const [isDragging, setIsDragging] = React.useState(false)

  // Sync position if node props change from history or external updates
  React.useEffect(() => {
    setCurrentPos({ x, y })
  }, [x, y])

  const colorConfig =
    STICKY_COLORS.find((c) => c.id === activeColor) ?? STICKY_COLORS[0]

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if (node) {
        node.remove()
      }
    })
  }

  const handleChangeColor = (newColor: StickyColor) => {
    setActiveColor(newColor)
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isStickyNode(node)) {
        node.setColor(newColor)
      }
    })
  }

  // Pointer drag handling across the canvas
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return // Only primary mouse or touch
    const target = event.target as HTMLElement
    // Ignore clicks on buttons or inside nested text editor
    if (target.closest("button") || target.closest(".sticky-editor-area")) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    const startX = event.clientX
    const startY = event.clientY
    const initialX = currentPos.x
    const initialY = currentPos.y

    setIsDragging(true)

    const onPointerMove = (e: PointerEvent) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      const newX = Math.max(0, initialX + deltaX)
      const newY = Math.max(0, initialY + deltaY)
      setCurrentPos({ x: newX, y: newY })
    }

    const onPointerUp = (e: PointerEvent) => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      setIsDragging(false)

      const finalDeltaX = e.clientX - startX
      const finalDeltaY = e.clientY - startY
      const finalX = Math.max(0, initialX + finalDeltaX)
      const finalY = Math.max(0, initialY + finalDeltaY)

      editor.update(() => {
        const node = $getNodeByKey(nodeKey)
        if ($isStickyNode(node)) {
          node.setPosition(finalX, finalY)
        }
      })
    }

    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
  }

  return (
    <div
      style={{
        position: "absolute",
        left: `${currentPos.x}px`,
        top: `${currentPos.y}px`,
        zIndex: isDragging ? 40 : 20,
      }}
      className={cn(
        "w-[270px] touch-none select-none",
        isDragging && "pointer-events-auto"
      )}
    >
      <div
        className={cn(
          "group relative flex flex-col rounded-2xl border p-3.5 shadow-md transition-shadow duration-200",
          isDragging
            ? "scale-[1.02] cursor-grabbing shadow-2xl ring-2 ring-primary/40"
            : "hover:shadow-xl",
          colorConfig.bgClass,
          colorConfig.borderClass,
          colorConfig.textClass
        )}
      >
        {/* Top Header Controls / Drag Handle */}
        <div
          onPointerDown={handlePointerDown}
          className={cn(
            "flex items-center justify-between border-b border-current/15 pb-2.5",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
          title="Drag to reposition sticky note anywhere on canvas"
        >
          {/* Drag Handle & Pin */}
          <div className="flex items-center gap-1.5">
            <span className="flex size-4 items-center justify-center opacity-70">
              <Pin className="size-3 -rotate-45" />
            </span>
            <GripHorizontal className="size-3.5 opacity-40 transition-opacity group-hover:opacity-75" />
            <div className="ml-0.5 flex items-center gap-1">
              {STICKY_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  title={c.name}
                  onClick={() => handleChangeColor(c.id)}
                  className={cn(
                    "size-3 cursor-pointer rounded-full transition-transform hover:scale-125 hover:ring-1",
                    c.dotClass,
                    activeColor === c.id &&
                      "scale-110 shadow-xs ring-2 ring-current"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Delete Button */}
          <button
            type="button"
            title="Delete sticky note"
            onClick={handleDelete}
            className="flex size-5 cursor-pointer items-center justify-center rounded-md text-current/60 transition-colors hover:bg-current/10 hover:text-current"
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* Nested Lexical Editor Area */}
        <div className="sticky-editor-area relative mt-2 min-h-[90px] w-full">
          <LexicalNestedComposer initialEditor={caption}>
            <PlainTextPlugin
              contentEditable={
                <ContentEditable className="min-h-[90px] w-full cursor-text text-xs leading-relaxed font-normal outline-none select-text" />
              }
              placeholder={
                <div className="pointer-events-none absolute top-0 left-0 text-xs font-normal opacity-50 select-none">
                  Write a quick sticky note...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
          </LexicalNestedComposer>
        </div>

        {/* Paper Fold Corner Deco */}
        <div className="pointer-events-none absolute right-0 bottom-0 size-3 rounded-tl-sm bg-current/10" />
      </div>
    </div>
  )
}

export class StickyNode extends DecoratorNode<React.JSX.Element> {
  __x: number
  __y: number
  __color: StickyColor
  __caption: LexicalEditor

  static override getType(): string {
    return "sticky"
  }

  static override clone(node: StickyNode): StickyNode {
    return new StickyNode(
      node.__x,
      node.__y,
      node.__color,
      node.__caption,
      node.__key
    )
  }

  static override importJSON(prevNode: SerializedStickyNode): StickyNode {
    const stickyNode = new StickyNode(
      prevNode.xOffset ?? 24,
      prevNode.yOffset ?? 24,
      prevNode.color ?? "yellow"
    )
    const caption = prevNode.caption
    const nestedEditor = stickyNode.__caption
    const editorState = nestedEditor.parseEditorState(caption.editorState)
    if (!editorState.isEmpty()) {
      nestedEditor.setEditorState(editorState)
    }
    return stickyNode
  }

  override exportJSON(): SerializedStickyNode {
    return {
      caption: this.__caption.toJSON(),
      color: this.__color,
      xOffset: this.__x,
      yOffset: this.__y,
      type: "sticky",
      version: 1,
    }
  }

  constructor(
    x: number = 24,
    y: number = 24,
    color: StickyColor = "yellow",
    caption?: LexicalEditor,
    key?: NodeKey
  ) {
    super(key)
    this.__x = x
    this.__y = y
    this.__color = color
    this.__caption = caption ?? createEditor()
  }

  setPosition(x: number, y: number): this {
    const writable = this.getWritable()
    writable.__x = x
    writable.__y = y
    return writable
  }

  getPosition(): { x: number; y: number } {
    return { x: this.__x, y: this.__y }
  }

  setColor(color: StickyColor): this {
    const writable = this.getWritable()
    writable.__color = color
    return writable
  }

  getColor(): StickyColor {
    return this.__color
  }

  override isIsolated(): true {
    return true
  }

  override createDOM(_config: EditorConfig): HTMLElement {
    const div = document.createElement("div")
    div.style.display = "contents"
    return div
  }

  override updateDOM(): false {
    return false
  }

  override exportDOM(): DOMExportOutput {
    const element = document.createElement("div")
    element.setAttribute("data-lexical-sticky", "true")
    element.setAttribute("data-color", this.__color)
    element.setAttribute("data-x", String(this.__x))
    element.setAttribute("data-y", String(this.__y))
    return { element }
  }

  static override importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-lexical-sticky")) {
          return null
        }
        return {
          conversion: (element: HTMLElement): DOMConversionOutput => {
            const color =
              (element.getAttribute("data-color") as StickyColor) || "yellow"
            const x = parseInt(element.getAttribute("data-x") || "24", 10)
            const y = parseInt(element.getAttribute("data-y") || "24", 10)
            return { node: $createStickyNode(x, y, color) }
          },
          priority: 1,
        }
      },
    }
  }

  override decorate(
    editor: LexicalEditor,
    _config: EditorConfig
  ): React.JSX.Element {
    const rootElement = editor.getRootElement()
    const targetContainer =
      rootElement?.parentElement ??
      (typeof document !== "undefined" ? document.body : null)

    const component = (
      <StickyComponent
        color={this.__color}
        nodeKey={this.getKey()}
        caption={this.__caption}
        x={this.__x}
        y={this.__y}
      />
    )

    if (!targetContainer) {
      return component
    }

    return createPortal(component, targetContainer)
  }
}

export function $createStickyNode(
  x: number = 24,
  y: number = 24,
  color: StickyColor = "yellow",
  caption?: LexicalEditor
): StickyNode {
  return $applyNodeReplacement(new StickyNode(x, y, color, caption))
}

export function $isStickyNode(
  node: LexicalNode | null | undefined
): node is StickyNode {
  return node instanceof StickyNode
}
