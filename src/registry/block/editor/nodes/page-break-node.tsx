/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  DOMConversionMap,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
} from "lexical"
import { $applyNodeReplacement, createCommand, DecoratorNode } from "lexical"
import * as React from "react"

export type SerializedPageBreakNode = SerializedLexicalNode

export const INSERT_PAGE_BREAK_COMMAND = createCommand<void>(
  "INSERT_PAGE_BREAK_COMMAND"
)

function PageBreakComponent({ nodeKey }: { nodeKey: NodeKey }) {
  return (
    <div
      data-lexical-node={nodeKey}
      className="editor-page-break relative my-6 flex items-center justify-center select-none print:break-after-page"
    >
      <div className="absolute inset-x-0 h-px border-b-2 border-dashed border-border" />
      <span className="relative z-10 rounded-full border border-border bg-background px-3 py-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase shadow-xs">
        Page Break
      </span>
    </div>
  )
}

export class PageBreakNode extends DecoratorNode<React.JSX.Element> {
  static getType(): string {
    return "page-break"
  }

  static clone(node: PageBreakNode): PageBreakNode {
    return new PageBreakNode(node.__key)
  }

  static importJSON(): PageBreakNode {
    return $createPageBreakNode()
  }

  exportJSON(): SerializedPageBreakNode {
    return {
      type: "page-break",
      version: 1,
    }
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("div")
    element.setAttribute("data-lexical-page-break", "true")
    element.style.pageBreakAfter = "always"
    return { element }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: Node) => {
        if (
          domNode instanceof HTMLElement &&
          domNode.hasAttribute("data-lexical-page-break")
        ) {
          return {
            conversion: () => ({ node: $createPageBreakNode() }),
            priority: 1,
          }
        }
        return null
      },
    }
  }

  updateDOM(): false {
    return false
  }

  decorate(_editor: LexicalEditor, _config: EditorConfig): React.JSX.Element {
    return <PageBreakComponent nodeKey={this.getKey()} />
  }
}

export function $createPageBreakNode(): PageBreakNode {
  return $applyNodeReplacement(new PageBreakNode())
}

export function $isPageBreakNode(
  node: LexicalNode | null | undefined
): node is PageBreakNode {
  return node instanceof PageBreakNode
}
