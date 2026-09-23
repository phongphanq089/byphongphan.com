import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $isHeadingNode } from "@lexical/rich-text"
import type { NodeKey } from "lexical"
import { $getRoot } from "lexical"
import { ListTree, X } from "lucide-react"
import * as React from "react"

export interface TableOfContentsEntry {
  key: NodeKey
  text: string
  tag: "h1" | "h2" | "h3"
}

export function TableOfContentsPlugin(): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  const [headings, setHeadings] = React.useState<TableOfContentsEntry[]>([])
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot()
        const newHeadings: TableOfContentsEntry[] = []

        for (const child of root.getChildren()) {
          if ($isHeadingNode(child)) {
            const tag = child.getTag() as "h1" | "h2" | "h3"
            const text = child.getTextContent()
            if (text.trim()) {
              newHeadings.push({
                key: child.getKey(),
                text,
                tag,
              })
            }
          }
        }
        setHeadings(newHeadings)
      })
    })
  }, [editor])

  const scrollToHeading = (key: NodeKey) => {
    const element = editor.getElementByKey(key)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  if (headings.length === 0) return null

  return (
    <div className="absolute top-3 right-3 z-30 flex flex-col items-end">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-border/80 bg-background/90 text-muted-foreground shadow-xs backdrop-blur-xs transition-all hover:bg-muted hover:text-foreground"
          title="Table of Contents"
        >
          <ListTree className="size-4" />
        </button>
      ) : (
        <div className="w-56 animate-in rounded-xl border border-border/80 bg-background/95 p-3 shadow-lg backdrop-blur-md transition-all zoom-in-95 fade-in">
          <div className="mb-2 flex items-center justify-between border-b border-border/50 pb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <ListTree className="size-3.5 text-primary" />
              Table of Contents
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex size-5 cursor-pointer items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </div>
          <div className="max-h-60 space-y-1 overflow-y-auto pr-1 text-xs">
            {headings.map((h) => (
              <button
                key={h.key}
                type="button"
                onClick={() => scrollToHeading(h.key)}
                className={`block w-full truncate rounded-md px-2 py-1 text-left transition-colors hover:bg-muted hover:text-foreground ${
                  h.tag === "h1"
                    ? "font-semibold text-foreground"
                    : h.tag === "h2"
                      ? "pl-4 text-muted-foreground"
                      : "pl-6 text-muted-foreground/80"
                }`}
              >
                {h.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
