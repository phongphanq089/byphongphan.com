import {
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  FoldVertical,
  Search,
  UnfoldVertical,
  X,
} from "lucide-react"
import React, { useMemo, useState } from "react"

import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/core/badge"
import { Button } from "@/shared/ui/core/button"
import { Input } from "@/shared/ui/core/input"
import { ScrollFadeEffect } from "@/shared/ui/core/scroll-fade-effect"

interface JsonViewerProps {
  data: unknown
  title?: string
  className?: string
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

function getByteSize(data: unknown): number {
  try {
    const str = JSON.stringify(data)
    return new Blob([str]).size
  } catch {
    return 0
  }
}

// Interactive collapsible JSON tree node
interface JsonNodeProps {
  name?: string
  value: unknown
  isLast?: boolean
  searchQuery?: string
  depth?: number
  defaultExpandedDepth?: number
}

function JsonNode({
  name,
  value,
  isLast = true,
  searchQuery = "",
  depth = 0,
  defaultExpandedDepth = 2,
}: JsonNodeProps) {
  const [isOpen, setIsOpen] = useState(depth < defaultExpandedDepth)

  const isObject = value !== null && typeof value === "object"
  const isArray = Array.isArray(value)

  // Highlight search text
  const renderHighlighted = (text: string) => {
    if (!searchQuery) return text
    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"))
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark
              key={i}
              className="rounded-xs bg-amber-400/30 px-0.5 font-semibold text-amber-500 dark:bg-amber-400/25 dark:text-amber-300"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    )
  }

  // Primitive render
  if (!isObject) {
    let valueElement: React.ReactNode

    if (value === null) {
      valueElement = (
        <span className="font-medium text-rose-500 dark:text-rose-400">
          null
        </span>
      )
    } else if (typeof value === "boolean") {
      valueElement = (
        <span className="font-medium text-purple-600 dark:text-purple-400">
          {value ? "true" : "false"}
        </span>
      )
    } else if (typeof value === "number") {
      valueElement = (
        <span className="text-amber-600 dark:text-amber-400">
          {renderHighlighted(String(value))}
        </span>
      )
    } else if (typeof value === "string") {
      valueElement = (
        <span className="text-emerald-600 dark:text-emerald-400">
          &quot;{renderHighlighted(value)}&quot;
        </span>
      )
    } else {
      valueElement = (
        <span className="text-muted-foreground">{String(value)}</span>
      )
    }

    return (
      <div className="rounded-xs py-0.5 text-xs leading-5 transition-colors hover:bg-muted/40">
        <span style={{ paddingLeft: `${depth * 14}px` }} />
        {name !== undefined && (
          <span className="font-medium text-sky-600 dark:text-sky-300">
            &quot;{renderHighlighted(name)}&quot;
          </span>
        )}
        {name !== undefined && (
          <span className="text-muted-foreground">: </span>
        )}
        {valueElement}
        {!isLast && <span className="text-muted-foreground">,</span>}
      </div>
    )
  }

  const entries = isArray
    ? (value as unknown[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, unknown>)

  const itemsCount = entries.length
  const opening = isArray ? "[" : "{"
  const closing = isArray ? "]" : "}"

  return (
    <div className="text-xs leading-5">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center gap-1 rounded-xs py-0.5 transition-colors hover:bg-muted/40"
        style={{ paddingLeft: `${depth * 14}px` }}
      >
        <span className="flex size-3.5 items-center justify-center text-muted-foreground transition-transform">
          {isOpen ? (
            <ChevronDown className="size-3" />
          ) : (
            <ChevronRight className="size-3" />
          )}
        </span>

        {name !== undefined && (
          <span className="font-medium text-sky-600 dark:text-sky-300">
            &quot;{renderHighlighted(name)}&quot;
          </span>
        )}
        {name !== undefined && (
          <span className="text-muted-foreground">: </span>
        )}

        <span className="text-muted-foreground">{opening}</span>

        {!isOpen && (
          <span className="text-[10px] text-muted-foreground/60">
            {" "}
            ... {itemsCount} {itemsCount === 1 ? "item" : "items"}{" "}
          </span>
        )}

        {!isOpen && <span className="text-muted-foreground">{closing}</span>}
        {!isOpen && !isLast && <span className="text-muted-foreground">,</span>}
      </div>

      {isOpen && (
        <div>
          {entries.map(([childKey, childVal], index) => (
            <JsonNode
              key={childKey}
              name={isArray ? undefined : childKey}
              value={childVal}
              isLast={index === entries.length - 1}
              searchQuery={searchQuery}
              depth={depth + 1}
              defaultExpandedDepth={defaultExpandedDepth}
            />
          ))}
          <div
            className="rounded-xs py-0.5 text-muted-foreground transition-colors hover:bg-muted/30"
            style={{ paddingLeft: `${depth * 14}px` }}
          >
            <span className="inline-block w-3.5" />
            {closing}
            {!isLast && ","}
          </div>
        </div>
      )}
    </div>
  )
}

export function JsonViewer({
  data,
  title = "response",
  className,
}: JsonViewerProps) {
  const [copied, setCopied] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandDepth, setExpandDepth] = useState<number>(2)
  const [expandKey, setExpandKey] = useState(0)
  const [viewMode, setViewMode] = useState<"tree" | "raw">("tree")

  const formattedJson = useMemo(() => {
    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return String(data)
    }
  }, [data])

  const size = useMemo(() => getByteSize(data), [data])

  // Count search occurrences for developer feedback
  const matchCount = useMemo(() => {
    if (!searchQuery.trim()) return 0
    try {
      const regex = new RegExp(searchQuery, "gi")
      const matches = formattedJson.match(regex)
      return matches ? matches.length : 0
    } catch {
      return 0
    }
  }, [searchQuery, formattedJson])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedJson)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy JSON:", err)
    }
  }

  const handleDownload = () => {
    try {
      const blob = new Blob([formattedJson], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}-response.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Failed to download JSON:", err)
    }
  }

  const toggleExpandAll = () => {
    setExpandDepth((prev) => (prev >= 99 ? 0 : 99))
    setExpandKey((prev) => prev + 1)
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card/40 shadow-xs backdrop-blur-sm",
        className
      )}
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 bg-muted/30 px-3 py-2 text-xs">
        {/* Left: View Mode Toggle, Depth & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border border-border/80 bg-background/80 p-0.5 shadow-2xs">
            <Button
              type="button"
              variant={viewMode === "tree" ? "default" : "ghost"}
              size="xs"
              onClick={() => setViewMode("tree")}
              className="h-6 text-[11px]"
            >
              Tree View
            </Button>
            <Button
              type="button"
              variant={viewMode === "raw" ? "default" : "ghost"}
              size="xs"
              onClick={() => setViewMode("raw")}
              className="h-6 text-[11px]"
            >
              Raw JSON
            </Button>
          </div>

          {viewMode === "tree" && (
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={toggleExpandAll}
              className="h-6 gap-1 border-border/70 text-[11px] text-muted-foreground hover:text-foreground"
              title={
                expandDepth >= 99 ? "Collapse all nodes" : "Expand all nodes"
              }
            >
              {expandDepth >= 99 ? (
                <>
                  <FoldVertical className="size-3" />
                  <span>Collapse All</span>
                </>
              ) : (
                <>
                  <UnfoldVertical className="size-3" />
                  <span>Expand All</span>
                </>
              )}
            </Button>
          )}

          {/* Search Input using Core UI */}
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-2.5 size-3 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keys & values..."
              className="h-6.5 w-36 rounded-lg pr-6 pl-7 text-[11px] placeholder:text-muted-foreground/60 sm:w-48"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-1.5 flex size-4 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          {searchQuery && (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
              {matchCount} {matchCount === 1 ? "match" : "matches"}
            </Badge>
          )}
        </div>

        {/* Right: Payload Size & Actions */}
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="h-6 gap-1 text-[10px] text-muted-foreground"
          >
            <span>Size:</span>
            <strong className="text-foreground">{formatBytes(size)}</strong>
          </Badge>

          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={handleCopy}
            className="h-6 gap-1 text-[11px]"
          >
            {copied ? (
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
          </Button>

          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={handleDownload}
            className="h-6 gap-1 text-[11px]"
            title="Download JSON File"
          >
            <Download className="size-3" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* JSON Content Area */}
      <ScrollFadeEffect className="max-h-[500px] min-h-[180px] p-3 text-left">
        {viewMode === "tree" ? (
          <div key={expandKey} className="space-y-0.5">
            <JsonNode
              value={data}
              searchQuery={searchQuery}
              defaultExpandedDepth={expandDepth}
            />
          </div>
        ) : (
          <pre className="text-xs leading-relaxed text-foreground select-text">
            <code>{formattedJson}</code>
          </pre>
        )}
      </ScrollFadeEffect>
    </div>
  )
}
