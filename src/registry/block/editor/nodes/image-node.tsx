/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical"
import {
  $applyNodeReplacement,
  $getNodeByKey,
  createCommand,
  DecoratorNode,
} from "lexical"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Check,
  Copy,
  Download,
  ExternalLink,
  Maximize2,
  Trash2,
  X,
} from "lucide-react"
import * as React from "react"
import { createPortal } from "react-dom"

import { cn } from "../utils/cn"

export interface ImagePayload {
  altText: string
  caption?: string
  height?: number | "inherit"
  key?: NodeKey
  maxWidth?: number
  showCaption?: boolean
  src: string
  width?: number | "inherit"
  alignment?: "left" | "center" | "right"
}

export type SerializedImageNode = Spread<
  {
    altText: string
    caption?: string
    height?: number | "inherit"
    maxWidth: number
    showCaption: boolean
    src: string
    width?: number | "inherit"
    alignment?: "left" | "center" | "right"
  },
  SerializedLexicalNode
>

export const INSERT_IMAGE_COMMAND = createCommand<ImagePayload>(
  "INSERT_IMAGE_COMMAND"
)

export const OPEN_IMAGE_DIALOG_COMMAND = createCommand<void>(
  "OPEN_IMAGE_DIALOG_COMMAND"
)

function ImageLightbox({
  src,
  altText,
  onClose,
}: {
  src: string
  altText: string
  onClose: () => void
}) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const handleDownload = () => {
    const a = document.createElement("a")
    a.href = src
    a.download = altText || "image"
    a.target = "_blank"
    a.rel = "noreferrer"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/85 p-4 backdrop-blur-md duration-150 fade-in"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] max-w-[92vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="absolute -top-12 right-0 left-0 flex items-center justify-between px-1 text-white/80">
          <span className="max-w-[300px] truncate text-xs font-medium">
            {altText || "Image Preview"}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="cursor-pointer rounded-md bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20"
              title="Download image"
            >
              <Download className="size-4" />
            </button>
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20"
              title="Open in new tab"
            >
              <ExternalLink className="size-4" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-md bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20"
              title="Close (Esc)"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Full Image */}
        <img
          src={src}
          alt={altText}
          className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl ring-1 ring-white/10"
        />
      </div>
    </div>,
    document.body
  )
}

function ImageComponent({
  src,
  altText,
  nodeKey,
  width,
  maxWidth,
  caption,
  alignment = "center",
}: {
  src: string
  altText: string
  nodeKey: NodeKey
  width?: number | "inherit"
  maxWidth: number
  caption?: string
  alignment?: "left" | "center" | "right"
}) {
  const [editor] = useLexicalComposerContext()
  const [isSelected, setIsSelected] = React.useState(false)
  const [imageWidth, setImageWidth] = React.useState<number | "inherit">(
    width || "inherit"
  )
  const [currentAlign, setCurrentAlign] = React.useState<
    "left" | "center" | "right"
  >(alignment)
  const [captionText, setCaptionText] = React.useState(caption || "")
  const [isEditingCaption, setIsEditingCaption] = React.useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false)
  const [isCopied, setIsCopied] = React.useState(false)

  const containerRef = React.useRef<HTMLDivElement>(null)
  const isDraggingRef = React.useRef(false)
  const startXRef = React.useRef(0)
  const startWidthRef = React.useRef(0)

  // Sync with node props
  React.useEffect(() => {
    setImageWidth(width || "inherit")
  }, [width])

  React.useEffect(() => {
    setCurrentAlign(alignment)
  }, [alignment])

  const updateNodeWidth = React.useCallback(
    (newWidth: number | "inherit") => {
      setImageWidth(newWidth)
      editor.update(() => {
        const node = $getNodeByKey(nodeKey)
        if ($isImageNode(node)) {
          node.setWidthAndHeight(newWidth, "inherit")
        }
      })
    },
    [editor, nodeKey]
  )

  const updateNodeAlignment = React.useCallback(
    (newAlign: "left" | "center" | "right") => {
      setCurrentAlign(newAlign)
      editor.update(() => {
        const node = $getNodeByKey(nodeKey)
        if ($isImageNode(node)) {
          node.setAlignment(newAlign)
        }
      })
    },
    [editor, nodeKey]
  )

  const handleSaveCaption = React.useCallback(() => {
    setIsEditingCaption(false)
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isImageNode(node)) {
        node.setCaption(captionText)
      }
    })
  }, [editor, nodeKey, captionText])

  const handleDelete = React.useCallback(() => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if (node) {
        node.remove()
      }
    })
  }, [editor, nodeKey])

  const handleCopyLink = React.useCallback(() => {
    navigator.clipboard.writeText(src)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 1500)
  }, [src])

  // Drag resize handlers
  const handlePointerDownResize = (
    e: React.PointerEvent,
    direction: "left" | "right"
  ) => {
    e.preventDefault()
    e.stopPropagation()

    isDraggingRef.current = true
    startXRef.current = e.clientX

    const currentElemWidth =
      containerRef.current?.getBoundingClientRect().width || 400
    startWidthRef.current = currentElemWidth

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingRef.current) return
      const deltaX =
        direction === "right"
          ? moveEvent.clientX - startXRef.current
          : startXRef.current - moveEvent.clientX

      const newCalculatedWidth = Math.max(
        200,
        Math.min(1200, Math.round(startWidthRef.current + deltaX))
      )
      setImageWidth(newCalculatedWidth)
    }

    const handlePointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false
        window.removeEventListener("pointermove", handlePointerMove)
        window.removeEventListener("pointerup", handlePointerUp)

        const finalWidth =
          containerRef.current?.getBoundingClientRect().width ||
          startWidthRef.current
        updateNodeWidth(Math.round(finalWidth))
      }
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)
  }

  const alignmentClass = React.useMemo(() => {
    switch (currentAlign) {
      case "left":
        return "mr-auto ml-0"
      case "right":
        return "ml-auto mr-0"
      case "center":
      default:
        return "mx-auto"
    }
  }, [currentAlign])

  return (
    <>
      <div
        ref={containerRef}
        data-lexical-node={nodeKey}
        onClick={() => setIsSelected(true)}
        onBlur={(e) => {
          // If clicked inside, don't unselect
          if (containerRef.current?.contains(e.relatedTarget)) return
          setIsSelected(false)
        }}
        tabIndex={0}
        className={cn(
          "group relative my-4 flex flex-col overflow-visible rounded-xl border border-border/50 bg-card/60 shadow-xs transition-all outline-none select-none",
          alignmentClass,
          isSelected &&
            "shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background"
        )}
        style={{
          width: typeof imageWidth === "number" ? `${imageWidth}px` : "100%",
          maxWidth: maxWidth ? `${maxWidth}px` : "100%",
        }}
      >
        {/* Floating Action Bar (Hover or Selected) */}
        <div
          className={cn(
            "absolute -top-11 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-border/70 bg-popover/95 px-1.5 py-1 shadow-lg backdrop-blur-md transition-all duration-150",
            isSelected
              ? "pointer-events-auto scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100"
          )}
        >
          {/* Alignment controls */}
          <div className="flex items-center rounded-md bg-muted/60 p-0.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                updateNodeAlignment("left")
              }}
              className={cn(
                "cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:text-foreground",
                currentAlign === "left" &&
                  "bg-background font-semibold text-foreground shadow-2xs"
              )}
              title="Align left"
            >
              <AlignLeft className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                updateNodeAlignment("center")
              }}
              className={cn(
                "cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:text-foreground",
                currentAlign === "center" &&
                  "bg-background font-semibold text-foreground shadow-2xs"
              )}
              title="Align center"
            >
              <AlignCenter className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                updateNodeAlignment("right")
              }}
              className={cn(
                "cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:text-foreground",
                currentAlign === "right" &&
                  "bg-background font-semibold text-foreground shadow-2xs"
              )}
              title="Align right"
            >
              <AlignRight className="size-3.5" />
            </button>
          </div>

          <div className="mx-0.5 h-3.5 w-px bg-border/60" />

          {/* Width presets */}
          <div className="flex items-center gap-0.5 text-[11px] font-medium">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                updateNodeWidth(320)
              }}
              className={cn(
                "cursor-pointer rounded px-1.5 py-0.5 whitespace-nowrap text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                imageWidth === 320 && "bg-primary/10 font-semibold text-primary"
              )}
            >
              Small
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                updateNodeWidth(600)
              }}
              className={cn(
                "cursor-pointer rounded px-1.5 py-0.5 whitespace-nowrap text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                imageWidth === 600 && "bg-primary/10 font-semibold text-primary"
              )}
            >
              Medium
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                updateNodeWidth("inherit")
              }}
              className={cn(
                "cursor-pointer rounded px-1.5 py-0.5 whitespace-nowrap text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                imageWidth === "inherit" &&
                  "bg-primary/10 font-semibold text-primary"
              )}
            >
              Full
            </button>
          </div>

          <div className="mx-0.5 h-3.5 w-px bg-border/60" />

          {/* Quick utility actions */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsLightboxOpen(true)
            }}
            className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            title="View Fullscreen Lightbox"
          >
            <Maximize2 className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleCopyLink()
            }}
            className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            title="Copy image link"
          >
            {isCopied ? (
              <Check className="size-3.5 text-emerald-500" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
            className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            title="Delete image"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>

        {/* Main Image Container */}
        <div className="relative w-full overflow-hidden rounded-t-xl bg-muted/20">
          <img
            src={src}
            alt={altText}
            className="h-auto w-full max-w-full cursor-pointer object-contain transition-transform duration-200"
            loading="lazy"
            onClick={() => setIsSelected(true)}
            onDoubleClick={() => setIsLightboxOpen(true)}
          />

          {/* Left Resize Drag Handle */}
          {isSelected && (
            <div
              onPointerDown={(e) => handlePointerDownResize(e, "left")}
              className="absolute top-1/2 left-1 flex h-10 w-2.5 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-primary/80 shadow-md transition-colors hover:bg-primary"
              title="Drag to resize width"
            >
              <div className="h-4 w-0.5 rounded-full bg-white/80" />
            </div>
          )}

          {/* Right Resize Drag Handle */}
          {isSelected && (
            <div
              onPointerDown={(e) => handlePointerDownResize(e, "right")}
              className="absolute top-1/2 right-1 flex h-10 w-2.5 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-primary/80 shadow-md transition-colors hover:bg-primary"
              title="Drag to resize width"
            >
              <div className="h-4 w-0.5 rounded-full bg-white/80" />
            </div>
          )}
        </div>

        {/* Caption Bar */}
        <div className="border-t border-border/40 bg-card/60 px-3 py-1.5 text-center">
          {isEditingCaption ? (
            <input
              type="text"
              value={captionText}
              placeholder="Write a caption..."
              onChange={(e) => setCaptionText(e.target.value)}
              onBlur={handleSaveCaption}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveCaption()
              }}
              autoFocus
              className="w-full bg-transparent text-center text-xs text-muted-foreground outline-none focus:text-foreground"
            />
          ) : (
            <p
              onClick={(e) => {
                e.stopPropagation()
                setIsEditingCaption(true)
              }}
              className="cursor-pointer text-xs text-muted-foreground/75 transition-colors hover:text-foreground"
              title="Click to edit caption"
            >
              {captionText || "Add a caption…"}
            </p>
          )}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <ImageLightbox
          src={src}
          altText={altText || captionText || "Image"}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  )
}

export class ImageNode extends DecoratorNode<React.JSX.Element> {
  __src: string
  __altText: string
  __width: "inherit" | number
  __height: "inherit" | number
  __maxWidth: number
  __showCaption: boolean
  __caption?: string
  __alignment: "left" | "center" | "right"

  static getType(): string {
    return "image"
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__showCaption,
      node.__caption,
      node.__alignment,
      node.__key
    )
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const {
      altText,
      height,
      width,
      maxWidth,
      caption,
      src,
      showCaption,
      alignment,
    } = serializedNode
    return $createImageNode({
      altText,
      height,
      maxWidth,
      showCaption,
      src,
      width,
      caption,
      alignment: alignment || "center",
    })
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img")
    element.setAttribute("src", this.__src)
    element.setAttribute("alt", this.__altText)
    if (this.__width) {
      element.setAttribute("width", this.__width.toString())
    }
    if (this.__height) {
      element.setAttribute("height", this.__height.toString())
    }
    return { element }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: (domNode: Node): DOMConversionOutput | null => {
          if (domNode instanceof HTMLImageElement) {
            const { src, alt, width, height } = domNode
            const node = $createImageNode({
              altText: alt,
              height: height || undefined,
              src,
              width: width || undefined,
            })
            return { node }
          }
          return null
        },
        priority: 0,
      }),
    }
  }

  constructor(
    src: string,
    altText: string,
    maxWidth: number = 800,
    width?: "inherit" | number,
    height?: "inherit" | number,
    showCaption: boolean = true,
    caption?: string,
    alignment: "left" | "center" | "right" = "center",
    key?: NodeKey
  ) {
    super(key)
    this.__src = src
    this.__altText = altText
    this.__maxWidth = maxWidth
    this.__width = width || "inherit"
    this.__height = height || "inherit"
    this.__showCaption = showCaption
    this.__caption = caption
    this.__alignment = alignment
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      caption: this.__caption,
      height: this.__height === "inherit" ? 0 : this.__height,
      maxWidth: this.__maxWidth,
      showCaption: this.__showCaption,
      src: this.getSrc(),
      type: "image",
      version: 1,
      width: this.__width === "inherit" ? 0 : this.__width,
      alignment: this.__alignment,
    }
  }

  getSrc(): string {
    return this.__src
  }

  getAltText(): string {
    return this.__altText
  }

  getAlignment(): "left" | "center" | "right" {
    return this.__alignment
  }

  setAlignment(alignment: "left" | "center" | "right"): void {
    const writable = this.getWritable()
    writable.__alignment = alignment
  }

  setWidthAndHeight(
    width: "inherit" | number,
    height: "inherit" | number
  ): void {
    const writable = this.getWritable()
    writable.__width = width
    writable.__height = height
  }

  setCaption(caption: string): void {
    const writable = this.getWritable()
    writable.__caption = caption
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span")
    const theme = config.theme
    const className = theme.image
    if (className !== undefined) {
      span.className = className
    }
    return span
  }

  updateDOM(): false {
    return false
  }

  decorate(_editor: LexicalEditor, _config: EditorConfig): React.JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        maxWidth={this.__maxWidth}
        nodeKey={this.getKey()}
        caption={this.__caption}
        alignment={this.__alignment}
      />
    )
  }
}

export function $createImageNode({
  altText,
  height,
  maxWidth = 800,
  src,
  width,
  showCaption = true,
  caption,
  alignment = "center",
  key,
}: ImagePayload): ImageNode {
  return $applyNodeReplacement(
    new ImageNode(
      src,
      altText,
      maxWidth,
      width,
      height,
      showCaption,
      caption,
      alignment,
      key
    )
  )
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode
}
