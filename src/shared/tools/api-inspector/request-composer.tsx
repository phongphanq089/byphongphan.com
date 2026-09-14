import {
  AlertCircle,
  Check,
  Code2,
  FileJson,
  Play,
  Sparkles,
  Wand2,
  X,
} from "lucide-react"
import { useMemo, useState } from "react"

import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/core/badge"
import { Button } from "@/shared/ui/core/button"
import { Input } from "@/shared/ui/core/input"
import { Spinner } from "@/shared/ui/core/spinner"
import { Textarea } from "@/shared/ui/core/textarea"

import { useApiInspector } from "./api-inspector-context"
import type { ApiEntry, HttpMethod } from "./types"

const HTTP_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"]

const TEMPLATES: Array<{
  name: string
  method: HttpMethod
  url: string
  body: string
  description: string
}> = [
  {
    name: "POST - Create Post",
    method: "POST",
    url: "https://jsonplaceholder.typicode.com/posts",
    body: JSON.stringify(
      {
        title: "High-craft UI Engineering",
        body: "Testing POST request composer inside API Inspector DevTool.",
        userId: 1,
      },
      null,
      2
    ),
    description:
      "Creates a new post resource on JSONPlaceholder (Returns 201 Created)",
  },
  {
    name: "PUT - Replace Post #1",
    method: "PUT",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    body: JSON.stringify(
      {
        id: 1,
        title: "Full Update via PUT",
        body: "Entire entity updated with new contents.",
        userId: 1,
      },
      null,
      2
    ),
    description: "Completely replaces an existing post (Returns 200 OK)",
  },
  {
    name: "PATCH - Update Title #1",
    method: "PATCH",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    body: JSON.stringify(
      {
        title: "Partially Updated Title (PATCH)",
      },
      null,
      2
    ),
    description:
      "Partially modifies specific fields of a resource (Returns 200 OK)",
  },
  {
    name: "DELETE - Delete Post #1",
    method: "DELETE",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    body: "",
    description: "Sends HTTP DELETE to remove the resource (Returns 200/204)",
  },
]

function getMethodColorClass(method: HttpMethod) {
  switch (method) {
    case "POST":
      return "border-blue-500/40 bg-blue-500/15 text-blue-600 dark:text-blue-400"
    case "PUT":
      return "border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400"
    case "PATCH":
      return "border-orange-500/40 bg-orange-500/15 text-orange-600 dark:text-orange-400"
    case "DELETE":
      return "border-rose-500/40 bg-rose-500/15 text-rose-600 dark:text-rose-400"
    case "GET":
    default:
      return "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
  }
}

export interface RequestComposerProps {
  initialMethod?: HttpMethod
  initialUrl?: string
  initialHeaders?: Record<string, string>
  initialBody?: string
  onClose?: () => void
  onSuccess?: (entry: ApiEntry) => void
  className?: string
}

export function RequestComposer({
  initialMethod = "POST",
  initialUrl = "https://jsonplaceholder.typicode.com/posts",
  initialHeaders = { "Content-Type": "application/json" },
  initialBody = '{\n  "title": "New Article",\n  "body": "Hello from API Inspector",\n  "userId": 1\n}',
  onClose,
  onSuccess,
  className,
}: RequestComposerProps) {
  const { sendRequest } = useApiInspector()

  const [method, setMethod] = useState<HttpMethod>(initialMethod)
  const [url, setUrl] = useState<string>(initialUrl)
  const [bodyText, setBodyText] = useState<string>(initialBody)
  const [headersText, setHeadersText] = useState<string>(() => {
    return Object.entries(initialHeaders)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n")
  })
  const [composerTab, setComposerTab] = useState<
    "body" | "headers" | "templates"
  >("body")
  const [isSending, setIsSending] = useState(false)
  const [formatSuccess, setFormatSuccess] = useState(false)

  // Validate JSON syntax on the fly
  const jsonError = useMemo(() => {
    if (method === "GET" || method === "DELETE" || !bodyText.trim()) {
      return null
    }
    try {
      JSON.parse(bodyText)
      return null
    } catch (err) {
      return err instanceof Error ? err.message : "Invalid JSON syntax"
    }
  }, [bodyText, method])

  // Parse headers from "Key: Value" lines
  const parsedHeaders = useMemo(() => {
    const headers: Record<string, string> = {}
    headersText.split("\n").forEach((line) => {
      const parts = line.split(":")
      if (parts.length >= 2) {
        const key = parts[0].trim()
        const value = parts.slice(1).join(":").trim()
        if (key && value) {
          headers[key] = value
        }
      }
    })
    return headers
  }, [headersText])

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(bodyText)
      setBodyText(JSON.stringify(parsed, null, 2))
      setFormatSuccess(true)
      setTimeout(() => setFormatSuccess(false), 1500)
    } catch {
      // cannot format invalid json
    }
  }

  const handleMethodChange = (m: HttpMethod) => {
    setMethod(m)
    if ((m === "GET" || m === "DELETE") && composerTab === "body") {
      setComposerTab("headers")
    }
  }

  const handleApplyTemplate = (tpl: (typeof TEMPLATES)[number]) => {
    setMethod(tpl.method)
    setUrl(tpl.url)
    setBodyText(tpl.body)
    setComposerTab(
      tpl.method === "GET" || tpl.method === "DELETE" ? "headers" : "body"
    )
  }

  const handleSend = async () => {
    if (!url.trim()) return
    setIsSending(true)

    const isPayloadMethod =
      method === "POST" || method === "PUT" || method === "PATCH"
    const bodyToSend =
      isPayloadMethod && bodyText.trim().length > 0
        ? bodyText.trim()
        : undefined

    try {
      const entry = await sendRequest({
        url: url.trim(),
        method,
        headers: parsedHeaders,
        body: bodyToSend,
      })
      onSuccess?.(entry)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col space-y-3 rounded-xl border border-primary/40 bg-card/60 p-4 shadow-sm backdrop-blur-md",
        className
      )}
    >
      {/* Composer Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-primary/50 bg-primary/10 text-[9px] font-bold text-primary"
          >
            API CLIENT
          </Badge>
          <span className="text-xs font-semibold text-foreground">
            Request Composer
          </span>
          <span className="hidden text-[11px] text-muted-foreground sm:inline">
            (Test POST, PUT, PATCH, DELETE)
          </span>
        </div>

        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            className="size-6 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>

      {/* Method & URL Address Bar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Method Selector Pills */}
        <div className="flex items-center rounded-lg border border-border/80 bg-background/80 p-0.5 shadow-2xs">
          {HTTP_METHODS.map((m) => {
            const isSelected = method === m
            return (
              <Button
                key={m}
                type="button"
                variant={isSelected ? "default" : "ghost"}
                size="xs"
                onClick={() => handleMethodChange(m)}
                className={cn(
                  "h-6.5 px-2 text-[10px] font-bold transition-all",
                  isSelected
                    ? getMethodColorClass(m)
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m}
              </Button>
            )
          })}
        </div>

        {/* URL Input */}
        <div className="flex min-w-[200px] flex-1 items-center">
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/v1/resource"
            className="h-7.5 text-xs"
          />
        </div>

        {/* Send Button */}
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={handleSend}
          disabled={isSending || !url.trim()}
          className="h-7.5 gap-1.5 px-3.5 text-xs font-semibold shadow-xs"
        >
          {isSending ? (
            <>
              <Spinner className="size-3.5" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Play className="size-3.5 fill-current" />
              <span>Send Request</span>
            </>
          )}
        </Button>
      </div>

      {/* Subtab Selector: Body vs Headers vs Templates */}
      <div className="flex items-center justify-between border-b border-border/60 pb-1">
        <div className="flex items-center gap-1">
          {method !== "GET" && (
            <Button
              type="button"
              variant={composerTab === "body" ? "default" : "ghost"}
              size="xs"
              onClick={() => setComposerTab("body")}
              className="h-6 gap-1 text-[11px]"
            >
              <FileJson className="size-3" />
              <span>Request Body</span>
              {jsonError && (
                <span className="size-1.5 rounded-full bg-rose-500" />
              )}
            </Button>
          )}

          <Button
            type="button"
            variant={composerTab === "headers" ? "default" : "ghost"}
            size="xs"
            onClick={() => setComposerTab("headers")}
            className="h-6 gap-1 text-[11px]"
          >
            <Code2 className="size-3" />
            <span>Headers</span>
            <Badge variant="outline" className="h-4 px-1 text-[9px]">
              {Object.keys(parsedHeaders).length}
            </Badge>
          </Button>

          <Button
            type="button"
            variant={composerTab === "templates" ? "default" : "ghost"}
            size="xs"
            onClick={() => setComposerTab("templates")}
            className="h-6 gap-1 text-[11px]"
          >
            <Sparkles className="size-3 text-primary" />
            <span>Presets & Templates</span>
          </Button>
        </div>

        {/* Format JSON button (only if on body tab) */}
        {composerTab === "body" && method !== "GET" && (
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={handleFormatJson}
            disabled={Boolean(jsonError)}
            className="h-6 gap-1 text-[11px]"
            title="Prettify JSON formatting"
          >
            {formatSuccess ? (
              <>
                <Check className="size-3 text-emerald-500" />
                <span className="text-emerald-500">Formatted!</span>
              </>
            ) : (
              <>
                <Wand2 className="size-3" />
                <span>Format JSON</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Tab 1: Request Body (JSON) */}
      {composerTab === "body" && method !== "GET" && (
        <div className="space-y-1.5">
          <Textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            placeholder='{\n  "key": "value"\n}'
            rows={5}
            className="text-xs leading-relaxed"
          />

          {jsonError && (
            <div className="flex items-center gap-1.5 text-[11px] text-rose-500">
              <AlertCircle className="size-3.5 shrink-0" />
              <span className="truncate">{jsonError}</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Custom Headers */}
      {composerTab === "headers" && (
        <div className="space-y-2">
          <p className="text-[11px] text-muted-foreground">
            Enter request headers, one per line in{" "}
            <code className="rounded bg-muted px-1 text-[10px] text-foreground">
              Header-Name: Value
            </code>{" "}
            format:
          </p>
          <Textarea
            value={headersText}
            onChange={(e) => setHeadersText(e.target.value)}
            placeholder="Content-Type: application/json&#10;Authorization: Bearer my-token"
            rows={4}
            className="text-xs leading-relaxed"
          />
        </div>
      )}

      {/* Tab 3: Quick Templates */}
      {composerTab === "templates" && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {TEMPLATES.map((tpl) => (
            <div
              key={tpl.name}
              onClick={() => handleApplyTemplate(tpl)}
              className="group flex cursor-pointer flex-col justify-between rounded-lg border border-border/70 bg-background/50 p-2.5 transition-colors select-none hover:border-primary/50 hover:bg-card"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    {tpl.name}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px] font-bold uppercase",
                      getMethodColorClass(tpl.method)
                    )}
                  >
                    {tpl.method}
                  </Badge>
                </div>
                <p className="line-clamp-2 text-[11px] text-muted-foreground">
                  {tpl.description}
                </p>
              </div>

              <div className="mt-2 flex items-center justify-end text-[10px] font-medium text-primary">
                <span>Load Template &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
