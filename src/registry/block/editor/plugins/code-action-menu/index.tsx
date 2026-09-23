// @ts-nocheck
import { $isCodeNode, CodeNode, getCodeLanguageOptions } from "@lexical/code"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $getNearestNodeFromDOMNode } from "lexical"
import { Check, Copy } from "lucide-react"
import * as React from "react"
import { createPortal } from "react-dom"

export function CodeActionMenuPlugin({
  anchorElem = typeof document !== "undefined" ? document.body : null,
}: {
  anchorElem?: HTMLElement | null
}) {
  const [editor] = useLexicalComposerContext()
  const [activeCodeNodeKey, setActiveCodeNodeKey] = React.useState<
    string | null
  >(null)
  const [language, setLanguage] = React.useState("")
  const [coords, setCoords] = React.useState<{
    top: number
    right: number
  } | null>(null)
  const [isCopied, setIsCopied] = React.useState(false)

  const codeLanguageOptions = React.useMemo(() => getCodeLanguageOptions(), [])

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      const codeElement = target.closest("code.editor-code-block")
      if (codeElement) {
        try {
          editor.read(() => {
            const node = $getNearestNodeFromDOMNode(codeElement)
            if ($isCodeNode(node)) {
              const rect = codeElement.getBoundingClientRect()
              setActiveCodeNodeKey(node.getKey())
              setLanguage(node.getLanguage() || "")
              setCoords({
                top: rect.top + window.scrollY + 8,
                right: window.innerWidth - rect.right - window.scrollX + 8,
              })
            }
          })
        } catch {
          // ignore if editor is not active
        }
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [editor])

  const handleCopy = () => {
    if (!activeCodeNodeKey) return
    editor.getEditorState().read(() => {
      const node = editor.getEditorState()._nodeMap.get(activeCodeNodeKey)
      if ($isCodeNode(node)) {
        const text = node.getTextContent()
        navigator.clipboard.writeText(text)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 1500)
      }
    })
  }

  const handleLanguageChange = (newLang: string) => {
    if (!activeCodeNodeKey) return
    editor.update(() => {
      const node = editor.getEditorState()._nodeMap.get(activeCodeNodeKey)
      if (node instanceof CodeNode) {
        node.setLanguage(newLang)
        setLanguage(newLang)
      }
    })
  }

  if (!coords || !anchorElem || !activeCodeNodeKey) return null

  return createPortal(
    <div
      style={{ top: `${coords.top}px`, right: `${coords.right}px` }}
      className="fixed z-40 flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/90 px-2 py-1 shadow-md backdrop-blur-xs select-none"
    >
      <select
        value={language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="cursor-pointer bg-transparent font-mono text-[11px] text-muted-foreground outline-none hover:text-foreground"
      >
        <option value="" className="bg-popover text-popover-foreground">
          (No language)
        </option>
        {codeLanguageOptions.map(([lang, label]) => (
          <option
            key={lang}
            value={lang}
            className="bg-popover text-popover-foreground"
          >
            {label}
          </option>
        ))}
      </select>

      <div className="h-3 w-px bg-border/60" />

      <button
        type="button"
        onClick={handleCopy}
        className="flex cursor-pointer items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
        title="Copy code"
      >
        {isCopied ? (
          <>
            <Check className="size-3 text-emerald-500" />
            <span className="text-emerald-500">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="size-3" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>,
    anchorElem
  )
}
