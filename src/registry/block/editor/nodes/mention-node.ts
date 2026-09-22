import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  Spread,
} from "lexical"
import { $applyNodeReplacement, TextNode } from "lexical"

export type SerializedMentionNode = Spread<
  {
    mentionName: string
    mentionId?: string
  },
  SerializedTextNode
>

export class MentionNode extends TextNode {
  __mention: string
  __mentionId?: string

  static override getType(): string {
    return "mention"
  }

  static override clone(node: MentionNode): MentionNode {
    return new MentionNode(
      node.__mention,
      node.__mentionId,
      node.__text,
      node.__key
    )
  }

  constructor(
    mentionName: string,
    mentionId?: string,
    text?: string,
    key?: NodeKey
  ) {
    super(text ?? `@${mentionName}`, key)
    this.__mention = mentionName
    this.__mentionId = mentionId
  }

  static override importJSON(
    serializedNode: SerializedMentionNode
  ): MentionNode {
    const node = $createMentionNode(
      serializedNode.mentionName,
      serializedNode.mentionId
    )
    node.setTextContent(serializedNode.text)
    node.setFormat(serializedNode.format)
    node.setDetail(serializedNode.detail)
    node.setMode(serializedNode.mode)
    node.setStyle(serializedNode.style)
    return node
  }

  override exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mentionName: this.__mention,
      mentionId: this.__mentionId,
      type: "mention",
      version: 1,
    }
  }

  override createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config)
    dom.className = "editor-mention"
    dom.spellcheck = false
    return dom
  }

  override exportDOM(): DOMExportOutput {
    const element = document.createElement("span")
    element.setAttribute("data-lexical-mention", "true")
    if (this.__mentionId) {
      element.setAttribute("data-mention-id", this.__mentionId)
    }
    element.textContent = this.__text
    return { element }
  }

  static override importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-lexical-mention")) {
          return null
        }
        return {
          conversion: (element: HTMLElement): DOMConversionOutput => {
            const text = element.textContent ?? ""
            const name = text.startsWith("@") ? text.slice(1) : text
            const id = element.getAttribute("data-mention-id") ?? undefined
            return { node: $createMentionNode(name, id) }
          },
          priority: 1,
        }
      },
    }
  }

  override canInsertTextBefore(): boolean {
    return false
  }

  override canInsertTextAfter(): boolean {
    return false
  }

  override isTextEntity(): boolean {
    return true
  }
}

export function $createMentionNode(
  mentionName: string,
  mentionId?: string
): MentionNode {
  const mentionNode = new MentionNode(mentionName, mentionId)
  mentionNode.setMode("segmented").toggleDirectionless()
  return $applyNodeReplacement(mentionNode)
}

export function $isMentionNode(
  node: LexicalNode | null | undefined
): node is MentionNode {
  return node instanceof MentionNode
}
