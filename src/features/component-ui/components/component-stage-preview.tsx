import { Check, ChevronUp, Copy, FileCode2, Sparkles } from "lucide-react"
import { useMemo, useState } from "react"

import { cn } from "@/shared/lib"
import { Button } from "@/shared/ui/core"

import type { SchematicType } from "../types"
import { RenderSchematic } from "./schematics"

const KEYWORDS = new Set([
  "import",
  "export",
  "from",
  "default",
  "function",
  "return",
  "const",
  "let",
  "var",
  "type",
  "interface",
  "as",
  "typeof",
  "keyof",
  "async",
  "await",
  "new",
  "if",
  "else",
  "switch",
  "case",
  "break",
])

interface CodeToken {
  type:
    | "space"
    | "comment"
    | "string"
    | "tag"
    | "keyword"
    | "component"
    | "punct"
    | "identifier"
    | "text"
  text: string
}

function tokenizeLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = []
  const regex =
    /(\/\*[\s\S]*?\*\/|\/\/.*|{[/*].*?[*/]}|'(?:\\.|[^'])*'|"(?:\\.|[^"])*"|`(?:\\.|[^`])*`|<\/?[A-Za-z][A-Za-z0-9_.-]*|\b[A-Z][A-Za-z0-9_]*\b|\b[a-z_][A-Za-z0-9_]*\b|[{}(),;:.[\]=><+\-*/|&!~?]+|\s+)/g

  let match: RegExpExecArray | null
  let lastIndex = 0

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", text: line.slice(lastIndex, match.index) })
    }
    const text = match[0]
    lastIndex = regex.lastIndex

    if (/^\s+$/.test(text)) {
      tokens.push({ type: "space", text })
    } else if (
      text.startsWith("//") ||
      text.startsWith("/*") ||
      text.startsWith("{/*")
    ) {
      tokens.push({ type: "comment", text })
    } else if (
      text.startsWith("'") ||
      text.startsWith('"') ||
      text.startsWith("`")
    ) {
      tokens.push({ type: "string", text })
    } else if (text.startsWith("</") || text.startsWith("<")) {
      tokens.push({ type: "tag", text })
    } else if (KEYWORDS.has(text)) {
      tokens.push({ type: "keyword", text })
    } else if (/^[A-Z]/.test(text)) {
      tokens.push({ type: "component", text })
    } else if (/^[{}(),;:.[\]=><+\-*/|&!~?]+$/.test(text)) {
      tokens.push({ type: "punct", text })
    } else {
      tokens.push({ type: "identifier", text })
    }
  }

  if (lastIndex < line.length) {
    tokens.push({ type: "text", text: line.slice(lastIndex) })
  }

  return tokens
}

function renderHighlightedTokens(tokens: CodeToken[]) {
  return tokens.map((tok, idx) => {
    switch (tok.type) {
      case "keyword":
        return (
          <span key={idx} className="font-medium text-rose-400">
            {tok.text}
          </span>
        )
      case "string":
        return (
          <span key={idx} className="text-emerald-400">
            {tok.text}
          </span>
        )
      case "comment":
        return (
          <span key={idx} className="text-zinc-500 italic">
            {tok.text}
          </span>
        )
      case "component":
        return (
          <span key={idx} className="text-cyan-300">
            {tok.text}
          </span>
        )
      case "tag": {
        const isClosing = tok.text.startsWith("</")
        const prefix = isClosing ? "</" : "<"
        const tagName = tok.text.slice(prefix.length)
        const isPascal = /^[A-Z]/.test(tagName)
        return (
          <span key={idx}>
            <span className="text-zinc-500">{prefix}</span>
            <span className={isPascal ? "text-cyan-300" : "text-sky-400"}>
              {tagName}
            </span>
          </span>
        )
      }
      case "punct":
        return (
          <span key={idx} className="text-zinc-400">
            {tok.text}
          </span>
        )
      case "identifier":
        return (
          <span key={idx} className="text-zinc-200">
            {tok.text}
          </span>
        )
      case "space":
        return <span key={idx}>{tok.text}</span>
      default:
        return (
          <span key={idx} className="text-zinc-300">
            {tok.text}
          </span>
        )
    }
  })
}

export interface ComponentStagePreviewProps {
  slug: string
  schematicType?: SchematicType
  liveDemo?: React.ComponentType | null
  code: string
  className?: string
}

export function ComponentStagePreview({
  slug,
  schematicType,
  liveDemo: LiveDemo,
  code,
  className,
}: ComponentStagePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const lines = useMemo(() => {
    return code.split("\n")
  }, [code])

  const tokenizedLines = useMemo(() => {
    return lines.map((line) => tokenizeLine(line))
  }, [lines])

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // First 3 lines for collapsed preview
  const collapsedLines = tokenizedLines.slice(0, 3)

  return (
    <div
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-black/60 shadow-2xl backdrop-blur-2xl transition-all duration-300 dark:border-white/10 dark:bg-[#0c0c0f]",
        className
      )}
    >
      {/* 1. Component Live Preview Stage */}
      <div className="relative flex min-h-[380px] w-full items-center justify-center p-8 sm:p-12">
        {/* Ambient Radial Spotlight */}
        <div className="pointer-events-none absolute inset-0 bg-radial from-white/[0.04] to-transparent" />

        {/* Live Interactive Demo or Schematic Fallback */}
        <div className="relative z-10 flex w-full items-center justify-center">
          {LiveDemo ? (
            <div className="flex items-center justify-center p-4">
              <LiveDemo />
            </div>
          ) : (
            <div className="scale-110 sm:scale-125">
              <RenderSchematic type={schematicType ?? "not-found"} />
            </div>
          )}
        </div>

        {/* Stage Footer Note */}
        <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
          <Sparkles className="size-3 text-pp-primary" />
          <span>
            {LiveDemo
              ? "Interactive live component stage"
              : "Pixel-perfect dark schematic stage"}
          </span>
        </div>
      </div>

      {/* 2. Code Snippet Section with Collapsible State */}
      <div className="relative border-t border-black/10 bg-black/90 dark:border-white/10 dark:bg-[#08080a]">
        {!isExpanded ? (
          /* Collapsed View: 3 lines + Centered View Code Button */
          <div className="relative overflow-hidden py-4">
            <div className="space-y-1 font-mono text-xs">
              {collapsedLines.map((toks, idx) => (
                <div key={idx} className="flex items-center px-4">
                  <span className="w-8 shrink-0 pr-4 text-right font-mono text-xs text-zinc-600 select-none dark:text-zinc-500">
                    {idx + 1}
                  </span>
                  <span className="truncate whitespace-pre">
                    {renderHighlightedTokens(toks)}
                  </span>
                </div>
              ))}
            </div>

            {/* Gradient Backdrop & Centered "View Code" Action */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/90 via-black/40 to-transparent">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(true)}
                className="h-8 gap-1.5 rounded-lg border border-white/20 bg-zinc-900/95 px-4 text-xs font-medium text-white shadow-xl backdrop-blur-md transition-all hover:border-white/30 hover:bg-zinc-800 active:scale-95"
              >
                View Code
              </Button>
            </div>
          </div>
        ) : (
          /* Expanded View: Full Code Block with Actions */
          <div className="flex flex-col">
            {/* Header: File info & Actions */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <FileCode2 className="size-3.5 text-pp-primary" />
                <span className="font-mono text-xs text-white/70">
                  {slug}.tsx
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyCode}
                  className="h-7 gap-1.5 rounded-md px-2.5 text-xs text-white/80 hover:bg-white/10 hover:text-white active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="size-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" />
                      <span>Copy Code</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="h-7 gap-1.5 rounded-md px-2.5 text-xs text-white/80 hover:bg-white/10 hover:text-white active:scale-95"
                >
                  <ChevronUp className="size-3.5" />
                  <span>Collapse</span>
                </Button>
              </div>
            </div>

            {/* Scrollable Code View with Line Numbers */}
            <div className="max-h-[520px] overflow-x-auto overflow-y-auto p-4 font-mono text-xs leading-relaxed">
              <div className="space-y-0.5">
                {tokenizedLines.map((toks, idx) => (
                  <div key={idx} className="flex min-w-full">
                    <span className="w-10 shrink-0 pr-4 text-right font-mono text-xs text-zinc-600 select-none dark:text-zinc-500">
                      {idx + 1}
                    </span>
                    <span className="whitespace-pre">
                      {renderHighlightedTokens(toks)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Collapse Bar for Long Code */}
            <div className="flex items-center justify-end border-t border-white/10 bg-white/[0.02] px-4 py-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-7 gap-1.5 rounded-md px-2.5 text-xs text-white/60 hover:bg-white/10 hover:text-white active:scale-95"
              >
                <ChevronUp className="size-3.5" />
                <span>Collapse Code</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
