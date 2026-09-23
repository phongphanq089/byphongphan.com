/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  DOMConversionMap,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  Spread,
} from "lexical"
import {
  $applyNodeReplacement,
  createCommand,
  ElementNode,
  isHTMLElement,
} from "lexical"

export type LayoutGap = "compact" | "normal" | "relaxed"
export type LayoutBorder = "dashed" | "card" | "clean"

export interface InsertLayoutPayload {
  templateColumns: string
  gap?: LayoutGap
  borderStyle?: LayoutBorder
}

export interface UpdateLayoutPayload {
  containerKey: NodeKey
  templateColumns?: string
  gap?: LayoutGap
  borderStyle?: LayoutBorder
}

export type SerializedLayoutContainerNode = Spread<
  {
    templateColumns: string
    gap?: LayoutGap
    borderStyle?: LayoutBorder
  },
  SerializedElementNode
>

export const INSERT_LAYOUT_COMMAND = createCommand<
  InsertLayoutPayload | string
>("INSERT_LAYOUT_COMMAND")

export const OPEN_LAYOUT_DIALOG_COMMAND = createCommand<void>(
  "OPEN_LAYOUT_DIALOG_COMMAND"
)

export const UPDATE_LAYOUT_COMMAND = createCommand<UpdateLayoutPayload>(
  "UPDATE_LAYOUT_COMMAND"
)

// 1. Layout Container
export class LayoutContainerNode extends ElementNode {
  __templateColumns: string
  __gap: LayoutGap
  __borderStyle: LayoutBorder

  static getType(): string {
    return "layout-container"
  }

  static clone(node: LayoutContainerNode): LayoutContainerNode {
    return new LayoutContainerNode(
      node.__templateColumns,
      node.__gap,
      node.__borderStyle,
      node.__key
    )
  }

  constructor(
    templateColumns: string = "1fr 1fr",
    gap: LayoutGap = "normal",
    borderStyle: LayoutBorder = "dashed",
    key?: NodeKey
  ) {
    super(key)
    this.__templateColumns = templateColumns
    this.__gap = gap
    this.__borderStyle = borderStyle
  }

  getGapClass(): string {
    switch (this.__gap) {
      case "compact":
        return "gap-2"
      case "relaxed":
        return "gap-6"
      case "normal":
      default:
        return "gap-4"
    }
  }

  getBorderClasses(): string[] {
    switch (this.__borderStyle) {
      case "card":
        return [
          "border",
          "border-border/70",
          "bg-card/60",
          "shadow-xs",
          "p-3.5",
          "rounded-xl",
        ]
      case "clean":
        return [
          "border",
          "border-transparent",
          "hover:border-border/30",
          "p-2",
          "rounded-xl",
        ]
      case "dashed":
      default:
        return [
          "border",
          "border-dashed",
          "border-border/60",
          "p-3",
          "bg-muted/10",
          "rounded-xl",
        ]
    }
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const dom = document.createElement("div")
    dom.style.gridTemplateColumns = this.__templateColumns
    dom.setAttribute("data-lexical-layout-container", "true")
    dom.setAttribute("data-gap", this.__gap)
    dom.setAttribute("data-border", this.__borderStyle)
    dom.classList.add(
      "layout-container",
      "grid",
      "my-4",
      "w-full",
      "transition-all",
      "duration-200",
      this.getGapClass(),
      ...this.getBorderClasses()
    )
    return dom
  }

  updateDOM(prevNode: LayoutContainerNode, dom: HTMLElement): boolean {
    if (prevNode.__templateColumns !== this.__templateColumns) {
      dom.style.gridTemplateColumns = this.__templateColumns
    }
    if (
      prevNode.__gap !== this.__gap ||
      prevNode.__borderStyle !== this.__borderStyle
    ) {
      dom.setAttribute("data-gap", this.__gap)
      dom.setAttribute("data-border", this.__borderStyle)
      dom.className = [
        "layout-container",
        "grid",
        "my-4",
        "w-full",
        "transition-all",
        "duration-200",
        this.getGapClass(),
        ...this.getBorderClasses(),
      ].join(" ")
    }
    return false
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: Node) => {
        if (
          isHTMLElement(domNode) &&
          domNode.classList.contains("layout-container")
        ) {
          const style = domNode.style.gridTemplateColumns || "1fr 1fr"
          const gap =
            (domNode.getAttribute("data-gap") as LayoutGap) || "normal"
          const borderStyle =
            (domNode.getAttribute("data-border") as LayoutBorder) || "dashed"
          return {
            conversion: () => ({
              node: $createLayoutContainerNode(style, gap, borderStyle),
            }),
            priority: 2,
          }
        }
        return null
      },
    }
  }

  static importJSON(
    serializedNode: SerializedLayoutContainerNode
  ): LayoutContainerNode {
    const node = $createLayoutContainerNode(
      serializedNode.templateColumns,
      serializedNode.gap || "normal",
      serializedNode.borderStyle || "dashed"
    )
    node.setFormat(serializedNode.format)
    node.setIndent(serializedNode.indent)
    node.setDirection(serializedNode.direction)
    return node
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("div")
    element.classList.add(
      "layout-container",
      this.getGapClass(),
      ...this.getBorderClasses()
    )
    element.style.gridTemplateColumns = this.__templateColumns
    element.setAttribute("data-gap", this.__gap)
    element.setAttribute("data-border", this.__borderStyle)
    return { element }
  }

  exportJSON(): SerializedLayoutContainerNode {
    return {
      ...super.exportJSON(),
      templateColumns: this.__templateColumns,
      gap: this.__gap,
      borderStyle: this.__borderStyle,
      type: "layout-container",
      version: 1,
    }
  }

  setTemplateColumns(templateColumns: string): void {
    const writable = this.getWritable()
    writable.__templateColumns = templateColumns
  }

  getTemplateColumns(): string {
    return this.getLatest().__templateColumns
  }

  setGap(gap: LayoutGap): void {
    const writable = this.getWritable()
    writable.__gap = gap
  }

  getGap(): LayoutGap {
    return this.getLatest().__gap
  }

  setBorderStyle(borderStyle: LayoutBorder): void {
    const writable = this.getWritable()
    writable.__borderStyle = borderStyle
  }

  getBorderStyle(): LayoutBorder {
    return this.getLatest().__borderStyle
  }
}

// 2. Layout Item (Column)
export class LayoutItemNode extends ElementNode {
  static getType(): string {
    return "layout-item"
  }

  static clone(node: LayoutItemNode): LayoutItemNode {
    return new LayoutItemNode(node.__key)
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const dom = document.createElement("div")
    dom.setAttribute("data-lexical-layout-item", "true")
    dom.classList.add(
      "layout-item",
      "min-w-0",
      "rounded-lg",
      "border",
      "border-border/40",
      "bg-card/40",
      "p-3",
      "transition-colors",
      "focus-within:border-primary/40",
      "focus-within:bg-card/80"
    )
    return dom
  }

  updateDOM(): boolean {
    return false
  }

  static importJSON(serializedNode: SerializedElementNode): LayoutItemNode {
    const node = $createLayoutItemNode()
    node.setFormat(serializedNode.format)
    node.setIndent(serializedNode.indent)
    node.setDirection(serializedNode.direction)
    return node
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: "layout-item",
      version: 1,
    }
  }
}

export function $createLayoutContainerNode(
  templateColumns: string = "1fr 1fr",
  gap: LayoutGap = "normal",
  borderStyle: LayoutBorder = "dashed"
): LayoutContainerNode {
  return $applyNodeReplacement(
    new LayoutContainerNode(templateColumns, gap, borderStyle)
  )
}

export function $isLayoutContainerNode(
  node: LexicalNode | null | undefined
): node is LayoutContainerNode {
  return node instanceof LayoutContainerNode
}

export function $createLayoutItemNode(): LayoutItemNode {
  return $applyNodeReplacement(new LayoutItemNode())
}

export function $isLayoutItemNode(
  node: LexicalNode | null | undefined
): node is LayoutItemNode {
  return node instanceof LayoutItemNode
}
