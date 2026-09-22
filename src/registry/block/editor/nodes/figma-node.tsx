/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  DOMConversionMap,
  DOMExportOutput,
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical"
import { $applyNodeReplacement, createCommand, DecoratorNode } from "lexical"
import * as React from "react"

import { BlockWithAlignableContents } from "../components/block-with-alignable-contents"

export type SerializedFigmaNode = Spread<
  {
    documentID: string
    format?: ElementFormatType
  },
  SerializedLexicalNode
>

export const INSERT_FIGMA_COMMAND = createCommand<string>(
  "INSERT_FIGMA_COMMAND"
)

function FigmaComponent({
  documentID,
  format,
  nodeKey,
}: {
  documentID: string
  format?: ElementFormatType
  nodeKey: NodeKey
}) {
  return (
    <BlockWithAlignableContents
      format={format}
      nodeKey={nodeKey}
      className="my-4"
    >
      <div className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-xl border border-border/70 bg-card shadow-lg">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.figma.com/embed?embed_host=lexical&url=${encodeURIComponent(documentID)}`}
          title="Figma design viewer"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      </div>
    </BlockWithAlignableContents>
  )
}

export class FigmaNode extends DecoratorNode<React.JSX.Element> {
  __id: string
  __format?: ElementFormatType

  static getType(): string {
    return "figma"
  }

  static clone(node: FigmaNode): FigmaNode {
    return new FigmaNode(node.__id, node.__format, node.__key)
  }

  static importJSON(serializedNode: SerializedFigmaNode): FigmaNode {
    return $createFigmaNode(serializedNode.documentID, serializedNode.format)
  }

  exportJSON(): SerializedFigmaNode {
    return {
      documentID: this.__id,
      format: this.__format,
      type: "figma",
      version: 1,
    }
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("iframe")
    element.setAttribute("data-lexical-figma", this.__id)
    element.setAttribute("width", "560")
    element.setAttribute("height", "315")
    element.setAttribute(
      "src",
      `https://www.figma.com/embed?embed_host=lexical&url=${encodeURIComponent(this.__id)}`
    )
    return { element }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      iframe: (domNode: Node) => {
        if (domNode instanceof HTMLIFrameElement) {
          const dataLexicalFigma = domNode.getAttribute("data-lexical-figma")
          if (dataLexicalFigma) {
            return {
              conversion: () => ({ node: $createFigmaNode(dataLexicalFigma) }),
              priority: 1,
            }
          }
        }
        return null
      },
    }
  }

  constructor(id: string, format?: ElementFormatType, key?: NodeKey) {
    super(key)
    this.__id = id
    this.__format = format
  }

  updateDOM(): false {
    return false
  }

  getId(): string {
    return this.__id
  }

  decorate(_editor: LexicalEditor, _config: EditorConfig): React.JSX.Element {
    return (
      <FigmaComponent
        format={this.__format}
        nodeKey={this.getKey()}
        documentID={this.__id}
      />
    )
  }
}

export function $createFigmaNode(
  documentID: string,
  format?: ElementFormatType
): FigmaNode {
  return $applyNodeReplacement(new FigmaNode(documentID, format))
}

export function $isFigmaNode(
  node: LexicalNode | null | undefined
): node is FigmaNode {
  return node instanceof FigmaNode
}
