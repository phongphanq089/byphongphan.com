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
import { Check, Edit2, Sigma } from "lucide-react"
import * as React from "react"

export type SerializedEquationNode = Spread<
  {
    equation: string
    inline: boolean
  },
  SerializedLexicalNode
>

export const INSERT_EQUATION_COMMAND = createCommand<{
  equation: string
  inline?: boolean
}>("INSERT_EQUATION_COMMAND")

function EquationComponent({
  equation: initialEquation,
  inline,
  nodeKey,
}: {
  equation: string
  inline: boolean
  nodeKey: NodeKey
}) {
  const [equation, setEquation] = React.useState(initialEquation)
  const [isEditing, setIsEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(initialEquation)

  const handleSave = () => {
    setEquation(draft)
    setIsEditing(false)
  }

  if (inline) {
    return (
      <span
        data-lexical-node={nodeKey}
        onClick={() => setIsEditing(true)}
        className="group relative mx-1 inline-flex cursor-pointer items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-xs text-primary transition-all hover:border-primary/40 hover:bg-muted/70"
        title="Click to edit formula"
      >
        <Sigma className="size-3 text-primary/70" />
        <span>{equation}</span>
      </span>
    )
  }

  return (
    <div
      data-lexical-node={nodeKey}
      className="mx-auto my-4 max-w-xl rounded-xl border border-border/80 bg-card/70 p-4 shadow-md backdrop-blur-xs select-none"
    >
      <div className="mb-3 flex items-center justify-between border-b border-border/40 pb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <Sigma className="size-4 text-primary" />
          <span>LaTeX Formula</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setDraft(equation)
            setIsEditing((p) => !p)
          }}
          className="flex cursor-pointer items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
        >
          <Edit2 className="size-3" />
          <span>{isEditing ? "Close" : "Edit"}</span>
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder="Type LaTeX math formula (e.g. f(x) = \int_{-\infty}^{\infty} e^{-x^2} dx)..."
            className="w-full rounded-lg border border-border/70 bg-muted/30 p-2 font-mono text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="cursor-pointer rounded-md border border-border/60 px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex cursor-pointer items-center gap-1 rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground hover:bg-primary/90"
            >
              <Check className="size-3" />
              <span>Apply</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex min-h-[50px] items-center justify-center overflow-x-auto rounded-lg bg-muted/20 p-4 font-mono text-sm tracking-wide text-foreground">
          {equation || "\\text{Empty equation}"}
        </div>
      )}
    </div>
  )
}

export class EquationNode extends DecoratorNode<React.JSX.Element> {
  __equation: string
  __inline: boolean

  static getType(): string {
    return "equation"
  }

  static clone(node: EquationNode): EquationNode {
    return new EquationNode(node.__equation, node.__inline, node.__key)
  }

  static importJSON(serializedNode: SerializedEquationNode): EquationNode {
    return $createEquationNode(serializedNode.equation, serializedNode.inline)
  }

  exportJSON(): SerializedEquationNode {
    return {
      equation: this.__equation,
      inline: this.__inline,
      type: "equation",
      version: 1,
    }
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement(this.__inline ? "span" : "div")
    element.setAttribute("data-lexical-equation", this.__equation)
    element.setAttribute("data-lexical-inline", `${this.__inline}`)
    element.innerText = this.__equation
    return { element }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: Node) => {
        if (domNode instanceof HTMLElement) {
          const eq = domNode.getAttribute("data-lexical-equation")
          if (eq) {
            return {
              conversion: () => ({ node: $createEquationNode(eq, false) }),
              priority: 1,
            }
          }
        }
        return null
      },
      span: (domNode: Node) => {
        if (domNode instanceof HTMLElement) {
          const eq = domNode.getAttribute("data-lexical-equation")
          if (eq) {
            return {
              conversion: () => ({ node: $createEquationNode(eq, true) }),
              priority: 1,
            }
          }
        }
        return null
      },
    }
  }

  constructor(equation: string, inline: boolean = false, key?: NodeKey) {
    super(key)
    this.__equation = equation
    this.__inline = inline
  }

  updateDOM(): false {
    return false
  }

  decorate(_editor: LexicalEditor, _config: EditorConfig): React.JSX.Element {
    return (
      <EquationComponent
        nodeKey={this.getKey()}
        equation={this.__equation}
        inline={this.__inline}
      />
    )
  }
}

export function $createEquationNode(
  equation: string,
  inline: boolean = false
): EquationNode {
  return $applyNodeReplacement(new EquationNode(equation, inline))
}

export function $isEquationNode(
  node: LexicalNode | null | undefined
): node is EquationNode {
  return node instanceof EquationNode
}
