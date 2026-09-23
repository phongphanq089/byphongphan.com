/* eslint-disable react-hooks/set-state-in-effect */
import {
  Check,
  Code,
  Copy,
  Download,
  Eye,
  FileCode2,
  FileText,
} from "lucide-react"
import * as React from "react"

import { useTheme } from "@/shared/providers"

import type { EditorChangeData } from "../types"
import {
  downloadHtmlFile,
  renderExcalidrawDrawingsInHtml,
} from "../utils/export-html"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"

export function InspectorDialog({
  open,
  onOpenChange,
  data,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: EditorChangeData | null
}) {
  const [tab, setTab] = React.useState<
    "preview" | "html" | "markdown" | "json"
  >("preview")
  const [copied, setCopied] = React.useState(false)
  const { theme } = useTheme()

  const [processedHtml, setProcessedHtml] = React.useState<string>(
    data?.html || ""
  )

  React.useEffect(() => {
    let active = true
    const rawHtml = data?.html || ""
    if (!rawHtml) {
      setProcessedHtml("")
      return
    }

    if (rawHtml.includes("data-lexical-excalidraw")) {
      void renderExcalidrawDrawingsInHtml(rawHtml, theme === "dark").then(
        (res) => {
          if (active) {
            setProcessedHtml(res)
          }
        }
      )
    } else {
      const clean = rawHtml.replace(/\s*data-tsd-source="[^"]*"/g, "")
      setProcessedHtml(clean)
    }

    return () => {
      active = false
    }
  }, [data?.html, theme])

  const handleCopy = () => {
    if (!data) return
    let content = ""
    if (tab === "preview" || tab === "html")
      content = processedHtml || data.html
    else if (tab === "markdown") content = data.markdown
    else if (tab === "json") content = data.json

    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!data) return

    if (tab === "preview" || tab === "html") {
      void downloadHtmlFile(
        processedHtml || data.html,
        "document.html",
        "Note Export"
      )
      return
    }

    let content = ""
    let filename = "document"
    let type = "text/plain"

    if (tab === "markdown") {
      content = data.markdown
      filename = "document.md"
      type = "text/markdown"
    } else if (tab === "json") {
      content = data.json
      filename = "document.json"
      type = "application/json"
    }

    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-3xl flex-col gap-4 p-6">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <FileCode2 className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                Blackbox Output Inspector
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Inspect and export real-time Lexical content in multiple formats
              </p>
            </div>
          </div>

          <div className="mr-6 flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 gap-1.5 text-xs"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="h-8 gap-1.5 text-xs"
            >
              <Download className="size-3.5" />
              <span>Download</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Tab Selection */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/60 p-1">
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all ${
              tab === "preview"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="size-3.5" />
            <span>HTML Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setTab("html")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all ${
              tab === "html"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code className="size-3.5" />
            <span>HTML Source</span>
          </button>

          <button
            type="button"
            onClick={() => setTab("markdown")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all ${
              tab === "markdown"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="size-3.5" />
            <span>Markdown</span>
          </button>

          <button
            type="button"
            onClick={() => setTab("json")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all ${
              tab === "json"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileCode2 className="size-3.5" />
            <span>JSON State</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="max-h-[50vh] flex-1 overflow-y-auto rounded-lg border border-border bg-muted/30 p-4">
          {!data || data.isEmpty ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No content yet. Type inside the editor to inspect the output.
            </div>
          ) : (
            <>
              {tab === "preview" && (
                <div
                  className="prose dark:prose-invert max-w-none text-sm leading-relaxed [&_.excalidraw-drawing-wrapper]:my-4 [&_.excalidraw-drawing-wrapper]:flex [&_.excalidraw-drawing-wrapper]:justify-center [&_.excalidraw-drawing-wrapper]:rounded-xl [&_.excalidraw-drawing-wrapper]:border [&_.excalidraw-drawing-wrapper]:border-border/40 [&_.excalidraw-drawing-wrapper]:bg-card/60 [&_.excalidraw-drawing-wrapper]:p-4 [&_.excalidraw-drawing-wrapper_svg]:h-auto [&_.excalidraw-drawing-wrapper_svg]:max-w-full"
                  dangerouslySetInnerHTML={{
                    __html: processedHtml || data.html,
                  }}
                />
              )}

              {tab === "html" && (
                <pre className="font-mono text-xs break-all whitespace-pre-wrap text-foreground select-text">
                  {processedHtml || data.html}
                </pre>
              )}

              {tab === "markdown" && (
                <pre className="font-mono text-xs whitespace-pre-wrap text-foreground select-text">
                  {data.markdown || "(Empty markdown output)"}
                </pre>
              )}

              {tab === "json" && (
                <pre className="font-mono text-[11px] whitespace-pre-wrap text-foreground select-text">
                  {JSON.stringify(data.state, null, 2)}
                </pre>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
