/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  DOMConversionMap,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical"
import { $applyNodeReplacement, createCommand, DecoratorNode } from "lexical"
import * as React from "react"

import type { Dimension } from "./excalidraw/types"

export type SerializedExcalidrawNode = Spread<
  {
    data: string
    width?: Dimension
    height?: Dimension
    alignment?: "left" | "center" | "right"
  },
  SerializedLexicalNode
>

export const INSERT_EXCALIDRAW_COMMAND = createCommand<string | void>(
  "INSERT_EXCALIDRAW_COMMAND"
)

const ExcalidrawComponent = React.lazy(
  () => import("./excalidraw/excalidraw-component")
)

export class ExcalidrawNode extends DecoratorNode<React.JSX.Element> {
  __data: string
  __width: Dimension
  __height: Dimension
  __alignment: "left" | "center" | "right"

  static getType(): string {
    return "excalidraw"
  }

  static clone(node: ExcalidrawNode): ExcalidrawNode {
    return new ExcalidrawNode(
      node.__data,
      node.__width,
      node.__height,
      node.__alignment,
      node.__key
    )
  }

  afterCloneFrom(prevNode: this): void {
    super.afterCloneFrom(prevNode)
    this.__data = prevNode.__data
    this.__width = prevNode.__width
    this.__height = prevNode.__height
    this.__alignment = prevNode.__alignment
  }

  static importJSON(serializedNode: SerializedExcalidrawNode): ExcalidrawNode {
    return new ExcalidrawNode(
      serializedNode.data,
      serializedNode.width ?? "inherit",
      serializedNode.height ?? "inherit",
      serializedNode.alignment ?? "center"
    )
  }

  exportJSON(): SerializedExcalidrawNode {
    return {
      ...super.exportJSON(),
      data: this.__data,
      width: this.__width === "inherit" ? undefined : this.__width,
      height: this.__height === "inherit" ? undefined : this.__height,
      alignment: this.__alignment,
      type: "excalidraw",
      version: 1,
    }
  }

  constructor(
    data: string = "[]",
    width: Dimension = "inherit",
    height: Dimension = "inherit",
    alignment: "left" | "center" | "right" = "center",
    key?: NodeKey
  ) {
    super(key)
    this.__data = data
    this.__width = width
    this.__height = height
    this.__alignment = alignment
  }

  // View
  createDOM(_config: EditorConfig): HTMLElement {
    const span = document.createElement("span")
    span.style.display = "inline-block"
    return span
  }

  updateDOM(): false {
    return false
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const element = document.createElement("div")
    element.className = "excalidraw-export-container"
    element.style.display = "block"
    element.style.margin = "1.5rem auto"
    element.style.textAlign = this.__alignment || "center"

    let svg: SVGElement | null = null
    const targetElement =
      editor.getElementByKey(this.getKey()) ??
      (typeof document !== "undefined"
        ? document.querySelector(`[data-lexical-node="${this.getKey()}"]`)
        : null)

    if (targetElement) {
      // Exclusively select the rendered canvas SVG, never toolbar buttons/Lucide icons
      const canvasSvg = targetElement.querySelector<SVGElement>(
        "[data-excalidraw-svg-container] svg, svg.excalidraw-canvas-svg"
      )

      if (
        canvasSvg &&
        !canvasSvg.classList.contains("lucide") &&
        !canvasSvg.closest("button")
      ) {
        const cleanSvg = canvasSvg.cloneNode(true) as SVGElement
        cleanSvg.removeAttribute("data-tsd-source")
        cleanSvg.removeAttribute("data-lexical-editor")
        Array.from(cleanSvg.querySelectorAll("[data-tsd-source]")).forEach(
          (child) => child.removeAttribute("data-tsd-source")
        )
        svg = cleanSvg
      }
    }

    if (svg !== null) {
      element.innerHTML = svg.outerHTML
    }

    element.style.width =
      this.__width === "inherit" ? "inherit" : `${this.__width}px`
    element.style.height =
      this.__height === "inherit" ? "inherit" : `${this.__height}px`

    element.setAttribute("data-lexical-excalidraw-json", this.__data)
    return { element }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: Node) => {
        if (domNode instanceof HTMLElement) {
          const data = domNode.getAttribute("data-lexical-excalidraw-json")
          if (data) {
            return {
              conversion: () => ({ node: $createExcalidrawNode(data) }),
              priority: 2,
            }
          }
        }
        return null
      },
      div: (domNode: Node) => {
        if (domNode instanceof HTMLElement) {
          const data = domNode.getAttribute("data-lexical-excalidraw")
          if (data) {
            return {
              conversion: () => ({ node: $createExcalidrawNode(data) }),
              priority: 1,
            }
          }
        }
        return null
      },
    }
  }

  setData(data: string): this {
    const self = this.getWritable()
    self.__data = data
    return self
  }

  getData(): string {
    return this.getLatest().__data
  }

  getWidth(): Dimension {
    return this.getLatest().__width
  }

  setWidth(width: Dimension): this {
    const self = this.getWritable()
    self.__width = width
    return self
  }

  getHeight(): Dimension {
    return this.getLatest().__height
  }

  setHeight(height: Dimension): this {
    const self = this.getWritable()
    self.__height = height
    return self
  }

  getAlignment(): "left" | "center" | "right" {
    return this.getLatest().__alignment
  }

  setAlignment(alignment: "left" | "center" | "right"): this {
    const self = this.getWritable()
    self.__alignment = alignment
    return self
  }

  decorate(_editor: LexicalEditor, _config: EditorConfig): React.JSX.Element {
    return (
      <React.Suspense
        fallback={
          <div className="mx-auto my-5 h-48 w-full max-w-2xl animate-pulse rounded-2xl border border-border/50 bg-muted/20" />
        }
      >
        <ExcalidrawComponent
          nodeKey={this.getKey()}
          data={this.__data}
          width={this.__width}
          height={this.__height}
          alignment={this.__alignment}
        />
      </React.Suspense>
    )
  }
}

export function $createExcalidrawNode(
  data: string = "[]",
  width: Dimension = "inherit",
  height: Dimension = "inherit",
  alignment: "left" | "center" | "right" = "center"
): ExcalidrawNode {
  return $applyNodeReplacement(
    new ExcalidrawNode(data, width, height, alignment)
  )
}

export function $isExcalidrawNode(
  node: LexicalNode | null | undefined
): node is ExcalidrawNode {
  return node instanceof ExcalidrawNode
}
