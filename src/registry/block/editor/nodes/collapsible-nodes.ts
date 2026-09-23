/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  Spread,
} from "lexical"
import {
  $applyNodeReplacement,
  $createParagraphNode,
  createCommand,
  ElementNode,
  isHTMLElement,
} from "lexical"

export type SerializedCollapsibleContainerNode = Spread<
  {
    open: boolean
  },
  SerializedElementNode
>

export const INSERT_COLLAPSIBLE_COMMAND = createCommand<void>(
  "INSERT_COLLAPSIBLE_COMMAND"
)
export const TOGGLE_COLLAPSIBLE_COMMAND = createCommand<NodeKey>(
  "TOGGLE_COLLAPSIBLE_COMMAND"
)

// 1. Container Node (<details>)
export class CollapsibleContainerNode extends ElementNode {
  __open: boolean

  static getType(): string {
    return "collapsible-container"
  }

  static clone(node: CollapsibleContainerNode): CollapsibleContainerNode {
    return new CollapsibleContainerNode(node.__open, node.__key)
  }

  constructor(open: boolean = true, key?: NodeKey) {
    super(key)
    this.__open = open
  }

  createDOM(_config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const dom = document.createElement("details")
    dom.classList.add(
      "collapsible-container",
      "my-3",
      "rounded-xl",
      "border",
      "border-border/60",
      "bg-card/40",
      "p-2",
      "transition-all"
    )
    if (this.__open) {
      dom.setAttribute("open", "")
    }
    dom.addEventListener("toggle", () => {
      const open = dom.open
      editor.update(() => {
        const node = this.getLatest()
        if (node instanceof CollapsibleContainerNode) {
          node.setOpen(open)
        }
      })
    })
    return dom
  }

  updateDOM(
    prevNode: CollapsibleContainerNode,
    dom: HTMLDetailsElement
  ): boolean {
    if (prevNode.__open !== this.__open) {
      dom.open = this.__open
    }
    return false
  }

  static importDOM(): DOMConversionMap | null {
    return {
      details: () => ({
        conversion: (domNode: Node): DOMConversionOutput | null => {
          if (isHTMLElement(domNode) && domNode.nodeName === "DETAILS") {
            const node = $createCollapsibleContainerNode(
              domNode.hasAttribute("open")
            )
            return { node }
          }
          return null
        },
        priority: 1,
      }),
    }
  }

  static importJSON(
    serializedNode: SerializedCollapsibleContainerNode
  ): CollapsibleContainerNode {
    const node = $createCollapsibleContainerNode(serializedNode.open)
    node.setFormat(serializedNode.format)
    node.setIndent(serializedNode.indent)
    node.setDirection(serializedNode.direction)
    return node
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("details")
    element.classList.add("collapsible-container")
    element.setAttribute("open", this.__open.toString())
    return { element }
  }

  exportJSON(): SerializedCollapsibleContainerNode {
    return {
      ...super.exportJSON(),
      open: this.__open,
      type: "collapsible-container",
      version: 1,
    }
  }

  setOpen(open: boolean): void {
    const writable = this.getWritable()
    writable.__open = open
  }

  getOpen(): boolean {
    return this.getLatest().__open
  }

  toggleOpen(): void {
    this.setOpen(!this.getOpen())
  }
}

// 2. Title Node (<summary>)
export class CollapsibleTitleNode extends ElementNode {
  static getType(): string {
    return "collapsible-title"
  }

  static clone(node: CollapsibleTitleNode): CollapsibleTitleNode {
    return new CollapsibleTitleNode(node.__key)
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const dom = document.createElement("summary")
    dom.classList.add(
      "collapsible-title",
      "cursor-pointer",
      "font-medium",
      "text-sm",
      "text-foreground",
      "py-1",
      "px-2",
      "rounded-md",
      "hover:bg-muted/40",
      "transition-colors",
      "outline-none"
    )
    return dom
  }

  updateDOM(): boolean {
    return false
  }

  static importJSON(
    serializedNode: SerializedElementNode
  ): CollapsibleTitleNode {
    const node = $createCollapsibleTitleNode()
    node.setFormat(serializedNode.format)
    node.setIndent(serializedNode.indent)
    node.setDirection(serializedNode.direction)
    return node
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: "collapsible-title",
      version: 1,
    }
  }

  insertNewAfter(): LexicalNode | null {
    const parent = this.getParentOrThrow()
    if (parent instanceof CollapsibleContainerNode) {
      const content = parent.getChildAtIndex(1)
      if (content instanceof CollapsibleContentNode) {
        const paragraph = $createParagraphNode()
        content.append(paragraph)
        return paragraph
      }
    }
    return null
  }
}

// 3. Content Node (<div>)
export class CollapsibleContentNode extends ElementNode {
  static getType(): string {
    return "collapsible-content"
  }

  static clone(node: CollapsibleContentNode): CollapsibleContentNode {
    return new CollapsibleContentNode(node.__key)
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const dom = document.createElement("div")
    dom.classList.add(
      "collapsible-content",
      "pt-2",
      "pb-1",
      "px-2",
      "border-t",
      "border-border/30",
      "mt-1"
    )
    return dom
  }

  updateDOM(): boolean {
    return false
  }

  static importJSON(
    serializedNode: SerializedElementNode
  ): CollapsibleContentNode {
    const node = $createCollapsibleContentNode()
    node.setFormat(serializedNode.format)
    node.setIndent(serializedNode.indent)
    node.setDirection(serializedNode.direction)
    return node
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: "collapsible-content",
      version: 1,
    }
  }
}

export function $createCollapsibleContainerNode(
  open: boolean = true
): CollapsibleContainerNode {
  return $applyNodeReplacement(new CollapsibleContainerNode(open))
}

export function $isCollapsibleContainerNode(
  node: LexicalNode | null | undefined
): node is CollapsibleContainerNode {
  return node instanceof CollapsibleContainerNode
}

export function $createCollapsibleTitleNode(): CollapsibleTitleNode {
  return $applyNodeReplacement(new CollapsibleTitleNode())
}

export function $isCollapsibleTitleNode(
  node: LexicalNode | null | undefined
): node is CollapsibleTitleNode {
  return node instanceof CollapsibleTitleNode
}

export function $createCollapsibleContentNode(): CollapsibleContentNode {
  return $applyNodeReplacement(new CollapsibleContentNode())
}

export function $isCollapsibleContentNode(
  node: LexicalNode | null | undefined
): node is CollapsibleContentNode {
  return node instanceof CollapsibleContentNode
}
