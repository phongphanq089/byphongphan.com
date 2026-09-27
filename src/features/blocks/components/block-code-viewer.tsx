import { Check, Copy } from "lucide-react"
import { useMemo, useState } from "react"

import { cn } from "@/shared/lib"
import { Button } from "@/shared/ui/core"

import type { ResolvedBlockFile } from "../types"

interface BlockCodeViewerProps {
  file: ResolvedBlockFile | null
  className?: string
}

export function BlockCodeViewer({ file, className }: BlockCodeViewerProps) {
  const [copied, setCopied] = useState(false)

  const lines = useMemo(() => {
    if (!file) return []
    return file.code.split("\n")
  }, [file])

  const handleCopy = () => {
    if (!file || !navigator.clipboard) return
    navigator.clipboard.writeText(file.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!file) {
    return (
      <div
        className={cn(
          "flex h-full items-center justify-center text-xs text-muted-foreground",
          className
        )}
      >
        Select a file to view its source code.
      </div>
    )
  }

  return (
    <div className={cn("flex h-full flex-col overflow-hidden", className)}>
      {/* File Header Bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-border/60 bg-muted/20 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-foreground">
            {file.path}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleCopy}
          className="size-6"
        >
          {copied ? (
            <Check className="size-3 text-emerald-400" />
          ) : (
            <Copy className="size-3" />
          )}
        </Button>
      </div>

      {/* Code Content with Line Numbers */}
      <div className="flex-1 overflow-auto">
        <pre className="min-h-full p-4 text-[13px] leading-6">
          <code>
            {lines.map((line, idx) => (
              <div key={idx} className="flex">
                <span className="inline-block w-10 shrink-0 pr-4 text-right text-muted-foreground/40 select-none">
                  {idx + 1}
                </span>
                <span className="flex-1 text-foreground/90">{line || " "}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}
