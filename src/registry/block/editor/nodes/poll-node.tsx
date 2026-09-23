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
import { BarChart3, CheckCircle2, Plus } from "lucide-react"
import * as React from "react"

export interface PollOption {
  text: string
  uid: string
  votes: string[]
}

export type SerializedPollNode = Spread<
  {
    question: string
    options: PollOption[]
  },
  SerializedLexicalNode
>

export const INSERT_POLL_COMMAND = createCommand<{
  question: string
  options?: string[]
}>("INSERT_POLL_COMMAND")

function PollComponent({
  question,
  options: initialOptions,
  nodeKey,
}: {
  question: string
  options: PollOption[]
  nodeKey: NodeKey
}) {
  const [options, setOptions] = React.useState<PollOption[]>(initialOptions)
  const [votedOptionUid, setVotedOptionUid] = React.useState<string | null>(
    null
  )
  const [newOptionText, setNewOptionText] = React.useState("")
  const [isAddingOption, setIsAddingOption] = React.useState(false)

  const totalVotes = React.useMemo(() => {
    return options.reduce((sum, opt) => sum + opt.votes.length, 0)
  }, [options])

  const handleVote = (uid: string) => {
    setOptions((prev) =>
      prev.map((opt) => {
        if (opt.uid === uid) {
          const hasVoted = opt.votes.includes("currentUser")
          return {
            ...opt,
            votes: hasVoted
              ? opt.votes.filter((u) => u !== "currentUser")
              : [...opt.votes, "currentUser"],
          }
        }
        return {
          ...opt,
          votes: opt.votes.filter((u) => u !== "currentUser"),
        }
      })
    )
    setVotedOptionUid((curr) => (curr === uid ? null : uid))
  }

  const handleAddOption = () => {
    if (!newOptionText.trim()) return
    const newOpt: PollOption = {
      text: newOptionText.trim(),
      uid: Math.random().toString(36).substring(2, 9),
      votes: [],
    }
    setOptions((prev) => [...prev, newOpt])
    setNewOptionText("")
    setIsAddingOption(false)
  }

  return (
    <div
      data-lexical-node={nodeKey}
      className="mx-auto my-4 max-w-xl rounded-2xl border border-border/80 bg-card/80 p-5 shadow-lg backdrop-blur-xs select-none"
    >
      <div className="mb-3 flex items-center gap-2">
        <BarChart3 className="size-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">{question}</h3>
      </div>

      <div className="space-y-2.5">
        {options.map((opt) => {
          const voteCount = opt.votes.length
          const percentage =
            totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0
          const isVoted =
            votedOptionUid === opt.uid || opt.votes.includes("currentUser")

          return (
            <div
              key={opt.uid}
              onClick={() => handleVote(opt.uid)}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-muted/20 p-3 transition-all hover:border-primary/40 hover:bg-muted/40 active:scale-[0.99]"
            >
              {/* Progress fill */}
              <div
                className="absolute inset-y-0 left-0 bg-primary/15 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />

              <div className="relative z-10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex size-4 items-center justify-center rounded-full border transition-colors ${
                      isVoted
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/40"
                    }`}
                  >
                    {isVoted && <CheckCircle2 className="size-3" />}
                  </div>
                  <span
                    className={`font-medium ${isVoted ? "text-primary" : "text-foreground"}`}
                  >
                    {opt.text}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                  <span>{voteCount} votes</span>
                  <span className="font-bold text-foreground">
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add option button & footer */}
      <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
        <span>{totalVotes} total votes</span>

        {isAddingOption ? (
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={newOptionText}
              placeholder="New option title..."
              onChange={(e) => setNewOptionText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddOption()
                if (e.key === "Escape") setIsAddingOption(false)
              }}
              autoFocus
              className="rounded-md border border-border/70 bg-background px-2 py-0.5 text-xs text-foreground outline-none"
            />
            <button
              type="button"
              onClick={handleAddOption}
              className="cursor-pointer rounded-md bg-primary px-2 py-0.5 text-xs text-primary-foreground hover:bg-primary/90"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingOption(true)}
            className="flex cursor-pointer items-center gap-1 text-primary hover:underline"
          >
            <Plus className="size-3" />
            <span>Add option</span>
          </button>
        )}
      </div>
    </div>
  )
}

export class PollNode extends DecoratorNode<React.JSX.Element> {
  __question: string
  __options: PollOption[]

  static getType(): string {
    return "poll"
  }

  static clone(node: PollNode): PollNode {
    return new PollNode(node.__question, node.__options, node.__key)
  }

  static importJSON(serializedNode: SerializedPollNode): PollNode {
    return $createPollNode(serializedNode.question, serializedNode.options)
  }

  exportJSON(): SerializedPollNode {
    return {
      options: this.__options,
      question: this.__question,
      type: "poll",
      version: 1,
    }
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("div")
    element.setAttribute("data-lexical-poll-question", this.__question)
    return { element }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: Node) => {
        if (domNode instanceof HTMLElement) {
          const question = domNode.getAttribute("data-lexical-poll-question")
          if (question) {
            return {
              conversion: () => ({ node: $createPollNode(question) }),
              priority: 1,
            }
          }
        }
        return null
      },
    }
  }

  constructor(question: string, options: PollOption[] = [], key?: NodeKey) {
    super(key)
    this.__question = question
    this.__options = options.length
      ? options
      : [
          { text: "Option 1", uid: "1", votes: [] },
          { text: "Option 2", uid: "2", votes: [] },
        ]
  }

  updateDOM(): false {
    return false
  }

  decorate(_editor: LexicalEditor, _config: EditorConfig): React.JSX.Element {
    return (
      <PollComponent
        nodeKey={this.getKey()}
        question={this.__question}
        options={this.__options}
      />
    )
  }
}

export function $createPollNode(
  question: string,
  options?: PollOption[]
): PollNode {
  return $applyNodeReplacement(new PollNode(question, options))
}

export function $isPollNode(
  node: LexicalNode | null | undefined
): node is PollNode {
  return node instanceof PollNode
}
