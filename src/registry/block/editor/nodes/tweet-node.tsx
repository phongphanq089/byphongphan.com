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

export type SerializedTweetNode = Spread<
  {
    id: string
    format?: ElementFormatType
  },
  SerializedLexicalNode
>

export const INSERT_TWEET_COMMAND = createCommand<string>(
  "INSERT_TWEET_COMMAND"
)

function TweetComponent({
  id,
  format,
  nodeKey,
}: {
  id: string
  format?: ElementFormatType
  nodeKey: NodeKey
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    let isMounted = true

    const loadTweet = () => {
      const win = window as unknown as {
        twttr?: {
          widgets: {
            createTweet: (
              id: string,
              el: HTMLElement,
              opts?: unknown
            ) => Promise<unknown>
          }
        }
      }
      if (win.twttr && containerRef.current) {
        containerRef.current.innerHTML = ""
        win.twttr.widgets
          .createTweet(id, containerRef.current, {
            theme: "dark",
            align: "center",
            dnt: true,
          })
          .then(() => {
            if (isMounted) setIsLoaded(true)
          })
      }
    }

    if (!(window as unknown as { twttr?: unknown }).twttr) {
      const script = document.createElement("script")
      script.src = "https://platform.twitter.com/widgets.js"
      script.async = true
      script.onload = loadTweet
      document.body.appendChild(script)
    } else {
      loadTweet()
    }

    return () => {
      isMounted = false
    }
  }, [id])

  return (
    <BlockWithAlignableContents
      format={format}
      nodeKey={nodeKey}
      className="my-4"
    >
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-card/60 p-4 shadow-md">
        <div
          ref={containerRef}
          className="flex min-h-[140px] w-full items-center justify-center"
        >
          {!isLoaded && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-2 animate-ping rounded-full bg-sky-400" />
              <span>Loading Post (ID: {id})...</span>
            </div>
          )}
        </div>
      </div>
    </BlockWithAlignableContents>
  )
}

export class TweetNode extends DecoratorNode<React.JSX.Element> {
  __id: string
  __format?: ElementFormatType

  static getType(): string {
    return "tweet"
  }

  static clone(node: TweetNode): TweetNode {
    return new TweetNode(node.__id, node.__format, node.__key)
  }

  static importJSON(serializedNode: SerializedTweetNode): TweetNode {
    return $createTweetNode(serializedNode.id, serializedNode.format)
  }

  exportJSON(): SerializedTweetNode {
    return {
      format: this.__format,
      id: this.__id,
      type: "tweet",
      version: 1,
    }
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("div")
    element.setAttribute("data-lexical-tweet-id", this.__id)
    return { element }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: Node) => {
        if (domNode instanceof HTMLElement) {
          const tweetId = domNode.getAttribute("data-lexical-tweet-id")
          if (tweetId) {
            return {
              conversion: () => ({ node: $createTweetNode(tweetId) }),
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
      <TweetComponent
        format={this.__format}
        nodeKey={this.getKey()}
        id={this.__id}
      />
    )
  }
}

export function extractTweetId(urlOrId: string): string | null {
  const match = urlOrId.match(
    /(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/
  )
  return match ? match[2] : /^\d+$/.test(urlOrId) ? urlOrId : null
}

export function $createTweetNode(
  id: string,
  format?: ElementFormatType
): TweetNode {
  return $applyNodeReplacement(new TweetNode(id, format))
}

export function $isTweetNode(
  node: LexicalNode | null | undefined
): node is TweetNode {
  return node instanceof TweetNode
}
