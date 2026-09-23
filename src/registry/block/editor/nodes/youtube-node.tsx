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

export type SerializedYouTubeNode = Spread<
  {
    videoID: string
    format?: ElementFormatType
  },
  SerializedLexicalNode
>

export const INSERT_YOUTUBE_COMMAND = createCommand<string>(
  "INSERT_YOUTUBE_COMMAND"
)

function YouTubeComponent({
  videoID,
  format,
  nodeKey,
}: {
  videoID: string
  format?: ElementFormatType
  nodeKey: NodeKey
}) {
  return (
    <BlockWithAlignableContents
      format={format}
      nodeKey={nodeKey}
      className="my-4"
    >
      <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-xl border border-border/60 bg-black shadow-lg">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube-nocookie.com/embed/${videoID}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      </div>
    </BlockWithAlignableContents>
  )
}

export class YouTubeNode extends DecoratorNode<React.JSX.Element> {
  __id: string
  __format?: ElementFormatType

  static getType(): string {
    return "youtube"
  }

  static clone(node: YouTubeNode): YouTubeNode {
    return new YouTubeNode(node.__id, node.__format, node.__key)
  }

  static importJSON(serializedNode: SerializedYouTubeNode): YouTubeNode {
    return $createYouTubeNode(serializedNode.videoID, serializedNode.format)
  }

  exportJSON(): SerializedYouTubeNode {
    return {
      format: this.__format,
      type: "youtube",
      version: 1,
      videoID: this.__id,
    }
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("iframe")
    element.setAttribute("data-lexical-youtube", this.__id)
    element.setAttribute("width", "560")
    element.setAttribute("height", "315")
    element.setAttribute(
      "src",
      `https://www.youtube-nocookie.com/embed/${this.__id}`
    )
    element.setAttribute("frameborder", "0")
    element.setAttribute("allowfullscreen", "true")
    return { element }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      iframe: (domNode: Node) => {
        if (!domNode.hasChildNodes()) {
          if (domNode instanceof HTMLIFrameElement) {
            const dataLexicalYouTube = domNode.getAttribute(
              "data-lexical-youtube"
            )
            if (dataLexicalYouTube) {
              return {
                conversion: () => ({
                  node: $createYouTubeNode(dataLexicalYouTube),
                }),
                priority: 1,
              }
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
      <YouTubeComponent
        format={this.__format}
        nodeKey={this.getKey()}
        videoID={this.__id}
      />
    )
  }
}

export function extractYouTubeId(urlOrId: string): string | null {
  const match = urlOrId.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  )
  return match ? match[1] : urlOrId.length === 11 ? urlOrId : null
}

export function $createYouTubeNode(
  videoID: string,
  format?: ElementFormatType
): YouTubeNode {
  return $applyNodeReplacement(new YouTubeNode(videoID, format))
}

export function $isYouTubeNode(
  node: LexicalNode | null | undefined
): node is YouTubeNode {
  return node instanceof YouTubeNode
}
