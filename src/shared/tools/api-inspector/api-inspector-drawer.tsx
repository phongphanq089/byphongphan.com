import {
  Clock,
  Code2,
  Copy,
  Database,
  FileJson,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Terminal,
  Trash2,
  X,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/core/badge"
import { Button } from "@/shared/ui/core/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/core/drawer"
import { Input } from "@/shared/ui/core/input"
import { Kbd } from "@/shared/ui/core/kbd"
import { ScrollFadeEffect } from "@/shared/ui/core/scroll-fade-effect"
import { Separator } from "@/shared/ui/core/separator"
import { Spinner } from "@/shared/ui/core/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/core/tooltip"

import { useApiInspector } from "./api-inspector-context"
import { JsonViewer } from "./json-viewer"
import { RequestComposer } from "./request-composer"
import type { HttpMethod, HttpStatus } from "./types"

function getMethodBadgeClass(method?: HttpMethod) {
  switch (method) {
    case "POST":
      return "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
    case "PUT":
      return "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
    case "PATCH":
      return "border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400"
    case "DELETE":
      return "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
    case "GROQ":
    case "QUERY":
      return "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400"
    case "RPC":
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
    case "GET":
    default:
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
  }
}

function getStatusBadgeClass(status?: HttpStatus) {
  const s = String(status || "200")
  if (s.startsWith("2") || s === "success") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
  }
  if (s.startsWith("4") || s.startsWith("5") || s === "error") {
    return "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
  }
  if (s === "loading" || s === "pending") {
    return "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400"
  }
  return "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
}

function getLatencyBadgeClass(ms?: number) {
  if (ms === undefined) return "text-muted-foreground border-border"
  if (ms < 180) {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
  }
  if (ms < 500) {
    return "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
  }
  return "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
}

export function ApiInspectorDrawer() {
  const {
    isOpen,
    setIsOpen,
    entries,
    activeEntry,
    setActiveEntryId,
    refetchEntry,
    refetchAll,
    removeEntry,
    clearEntries,
    restoreDefaultApis,
  } = useApiInspector()

  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedCurl, setCopiedCurl] = useState(false)
  const [searchTab, setSearchTab] = useState("")
  const [activeSubTab, setActiveSubTab] = useState<
    "payload" | "requestBody" | "headers" | "code"
  >("payload")
  const [selectedMethodFilter, setSelectedMethodFilter] =
    useState<string>("ALL")
  const [isComposing, setIsComposing] = useState(false)
  const [composerInitial, setComposerInitial] = useState<{
    method?: HttpMethod
    url?: string
    headers?: Record<string, string>
    body?: string
  } | null>(null)

  // Auto-fetch data if active entry has a fetcher and no data yet
  useEffect(() => {
    if (
      isOpen &&
      activeEntry &&
      activeEntry.data === undefined &&
      typeof activeEntry.fetcher === "function" &&
      !activeEntry.isLoading
    ) {
      refetchEntry(activeEntry.id)
    }
  }, [isOpen, activeEntry, refetchEntry])

  // Determine if active entry has a genuine, non-empty request body
  const hasRequestBody = (() => {
    if (!activeEntry?.requestBody) return false
    if (typeof activeEntry.requestBody === "string") {
      const trimmed = activeEntry.requestBody.trim()
      return trimmed.length > 0 && trimmed !== '""' && trimmed !== "''"
    }
    if (typeof activeEntry.requestBody === "object") {
      return Object.keys(activeEntry.requestBody).length > 0
    }
    return true
  })()

  // If subtab is requestBody but entry has no request body, fall back to payload
  const currentSubTab =
    activeSubTab === "requestBody" && !hasRequestBody ? "payload" : activeSubTab

  // Check if active entry is a standard HTTP URL (supports curl and edit & resend)
  const isHttpEndpoint = Boolean(
    activeEntry?.endpoint &&
    (activeEntry.endpoint.startsWith("http://") ||
      activeEntry.endpoint.startsWith("https://") ||
      activeEntry.endpoint.startsWith("/"))
  )

  // Filter tabs by search query and method filter
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        !searchTab.trim() ||
        entry.title.toLowerCase().includes(searchTab.toLowerCase()) ||
        entry.endpoint.toLowerCase().includes(searchTab.toLowerCase())

      const matchesMethod =
        selectedMethodFilter === "ALL" ||
        (entry.method || "GET").toUpperCase() === selectedMethodFilter

      return matchesSearch && matchesMethod
    })
  }, [entries, searchTab, selectedMethodFilter])

  const isAnyLoading = useMemo(() => {
    return entries.some((e) => e.isLoading)
  }, [entries])

  const handleCopyEndpoint = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    } catch (err) {
      console.error("Failed to copy endpoint:", err)
    }
  }

  const handleCopyCurl = async () => {
    if (!activeEntry) return
    const method = activeEntry.method || "GET"
    let curlCommand = `curl -X ${method} "${activeEntry.endpoint}"`
    if (hasRequestBody && activeEntry.requestBody) {
      const bodyStr =
        typeof activeEntry.requestBody === "string"
          ? activeEntry.requestBody
          : JSON.stringify(activeEntry.requestBody)
      curlCommand += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${bodyStr}'`
    }
    try {
      await navigator.clipboard.writeText(curlCommand)
      setCopiedCurl(true)
      setTimeout(() => setCopiedCurl(false), 2000)
    } catch (err) {
      console.error("Failed to copy cURL:", err)
    }
  }

  const handleEditAndResend = () => {
    if (!activeEntry) return
    setComposerInitial({
      method: activeEntry.method || "POST",
      url: activeEntry.endpoint,
      headers: activeEntry.requestHeaders,
      body:
        typeof activeEntry.requestBody === "string"
          ? activeEntry.requestBody
          : activeEntry.requestBody
            ? JSON.stringify(activeEntry.requestBody, null, 2)
            : undefined,
    })
    setIsComposing(true)
  }

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="fixed inset-y-0 right-0 z-50 flex h-full flex-col border-l border-border/80 bg-background/95 backdrop-blur-xl data-[vaul-drawer-direction=right]:w-[95vw] data-[vaul-drawer-direction=right]:sm:max-w-xl data-[vaul-drawer-direction=right]:md:max-w-2xl data-[vaul-drawer-direction=right]:lg:max-w-3xl">
        {/* Drawer Header */}
        <DrawerHeader className="border-b border-border/70 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary shadow-xs">
                <Terminal className="size-4" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  <DrawerTitle className="text-sm font-bold tracking-tight text-foreground sm:text-base">
                    API RESPONSIVE INSPECTOR
                  </DrawerTitle>
                  <Badge
                    variant="outline"
                    className="border-primary/40 bg-primary/10 px-1.5 py-0 text-[9px] font-semibold text-primary"
                  >
                    DEV HUD v2.0
                  </Badge>
                </div>
                <DrawerDescription className="text-[11px] text-muted-foreground">
                  Inspect payloads, live re-triggering & interactive test
                  console
                </DrawerDescription>
              </div>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={isComposing ? "default" : "outline"}
                    size="xs"
                    onClick={() => {
                      setComposerInitial(null)
                      setIsComposing((prev) => !prev)
                    }}
                    className="h-7 gap-1 border-primary/50 text-xs font-medium whitespace-nowrap"
                  >
                    <Plus className="size-3" />
                    <span>
                      {isComposing ? "Close Composer" : "New Request"}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Test any API endpoint with custom body & headers (POST, PUT,
                  DELETE)
                </TooltipContent>
              </Tooltip>

              {entries.length > 0 ? (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={refetchAll}
                        disabled={isAnyLoading}
                        className="h-7 gap-1.5 border-border/70 text-xs whitespace-nowrap"
                      >
                        <RefreshCw
                          className={cn(
                            "size-3 text-primary",
                            isAnyLoading && "animate-spin"
                          )}
                        />
                        <span className="hidden sm:inline">Refetch All</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Re-run all registered APIs live
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={clearEntries}
                        className="h-7 gap-1 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-3" />
                        <span className="hidden sm:inline">Clear</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear all tabs</TooltipContent>
                  </Tooltip>
                </>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={restoreDefaultApis}
                      className="h-7 gap-1 border-emerald-500/40 text-xs font-medium whitespace-nowrap text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                    >
                      <RefreshCw className="size-3" />
                      <span>Restore Defaults</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Restore app default APIs without reloading the page
                  </TooltipContent>
                </Tooltip>
              )}

              <DrawerClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </Button>
              </DrawerClose>
            </div>
          </div>

          {/* Search Bar & Method Filter */}
          {entries.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-2.5">
              <div className="relative flex items-center">
                <Search className="pointer-events-none absolute left-2 size-3 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchTab}
                  onChange={(e) => setSearchTab(e.target.value)}
                  placeholder="Filter APIs by name or endpoint..."
                  className="h-6.5 w-40 rounded-md pr-6 pl-7 text-[11px] sm:w-56"
                />
                {searchTab && (
                  <button
                    type="button"
                    onClick={() => setSearchTab("")}
                    className="absolute right-1.5 flex size-3.5 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-2.5" />
                  </button>
                )}
              </div>

              {/* Method Filters */}
              <div className="flex items-center gap-1 overflow-x-auto text-[10px]">
                {["ALL", "GET", "POST", "PUT", "DELETE", "GROQ"].map((m) => (
                  <Button
                    key={m}
                    type="button"
                    variant={selectedMethodFilter === m ? "default" : "outline"}
                    size="xs"
                    onClick={() => setSelectedMethodFilter(m)}
                    className="h-5.5 px-2 text-[10px] whitespace-nowrap"
                  >
                    {m}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Horizontal API Tabs */}
          {filteredEntries.length > 0 && (
            <div className="mt-2 no-scrollbar flex w-full items-center gap-1.5 overflow-x-auto pt-1 pb-1">
              {filteredEntries.map((entry) => {
                const isActive = activeEntry?.id === entry.id
                return (
                  <div
                    key={entry.id}
                    onClick={() => {
                      setActiveEntryId(entry.id)
                      setIsComposing(false)
                    }}
                    className={cn(
                      "group flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-all select-none",
                      isActive
                        ? "border-primary/50 bg-primary/10 text-primary shadow-xs"
                        : "border-border/70 bg-card/60 text-muted-foreground hover:border-border hover:bg-accent/70 hover:text-foreground"
                    )}
                  >
                    {entry.isLoading ? (
                      <Spinner className="size-3 text-primary" />
                    ) : (
                      <Badge
                        variant="outline"
                        className={cn(
                          "h-4 px-1 text-[9px] font-bold tracking-wider uppercase",
                          getMethodBadgeClass(entry.method)
                        )}
                      >
                        {entry.method || "GET"}
                      </Badge>
                    )}

                    <span className="max-w-[120px] truncate font-medium sm:max-w-[160px]">
                      {entry.title}
                    </span>

                    {entry.status && !entry.isLoading && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "h-4 px-1 text-[9px] font-medium",
                          getStatusBadgeClass(entry.status)
                        )}
                      >
                        {entry.status}
                      </Badge>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeEntry(entry.id)
                      }}
                      className="ml-0.5 cursor-pointer rounded p-0.5 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
                      title="Remove tab"
                    >
                      <X className="size-2.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </DrawerHeader>

        {/* Drawer Scrollable Content */}
        <ScrollFadeEffect className="no-scrollbar flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <div className="space-y-4">
            {/* Interactive Request Composer */}
            {isComposing && (
              <RequestComposer
                initialMethod={composerInitial?.method || "POST"}
                initialUrl={
                  composerInitial?.url ||
                  "https://jsonplaceholder.typicode.com/posts"
                }
                initialHeaders={composerInitial?.headers}
                initialBody={composerInitial?.body}
                onClose={() => setIsComposing(false)}
                onSuccess={(entry) => {
                  setIsComposing(false)
                  setActiveEntryId(entry.id)
                }}
              />
            )}

            {/* Active Entry Detail */}
            {activeEntry ? (
              <div className="space-y-4">
                {/* Endpoint Meta & Live Trigger Action Bar */}
                <div className="space-y-3 rounded-xl border border-border/80 bg-card/40 p-3.5 backdrop-blur-xs">
                  {/* Top Row: Method, Endpoint, Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "h-5 px-1.5 text-[10px] font-bold tracking-wider uppercase",
                          getMethodBadgeClass(activeEntry.method)
                        )}
                      >
                        {activeEntry.method || "GET"}
                      </Badge>

                      <code className="truncate text-xs font-medium text-foreground select-all">
                        {activeEntry.endpoint}
                      </code>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleCopyEndpoint(activeEntry.endpoint)}
                        className="size-6 text-muted-foreground hover:text-foreground"
                        title="Copy Endpoint"
                      >
                        {copiedUrl ? (
                          <span className="text-[10px] text-emerald-500">
                            OK
                          </span>
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </Button>
                    </div>

                    {/* Action Buttons: Edit & Resend + Refetch */}
                    <div className="flex items-center gap-1.5">
                      {isHttpEndpoint && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleEditAndResend}
                          className="h-7.5 gap-1.5 px-2.5 text-xs whitespace-nowrap"
                          title="Edit payload or headers and send again"
                        >
                          <Pencil className="size-3 text-primary" />
                          <span className="hidden sm:inline">
                            Edit & Resend
                          </span>
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => refetchEntry(activeEntry.id)}
                        disabled={activeEntry.isLoading}
                        className="h-7.5 gap-1.5 px-3 text-xs font-medium whitespace-nowrap shadow-xs"
                      >
                        {activeEntry.isLoading ? (
                          <>
                            <Spinner className="size-3.5" />
                            <span>Refetching...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="size-3" />
                            <span>Refetch</span>
                            <Kbd className="ml-0.5 hidden text-[9px] sm:inline-flex">
                              R
                            </Kbd>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Sub Row: Latency, Size, Status, Timestamp & cURL */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-2.5 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      {activeEntry.status && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "h-5.5 gap-1 text-[10px] font-medium",
                            getStatusBadgeClass(activeEntry.status)
                          )}
                        >
                          <span>Status:</span>
                          <strong>{activeEntry.status}</strong>
                        </Badge>
                      )}

                      {activeEntry.durationMs !== undefined && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "h-5.5 gap-1 text-[10px]",
                            getLatencyBadgeClass(activeEntry.durationMs)
                          )}
                        >
                          <Clock className="size-3" />
                          <span>{activeEntry.durationMs} ms</span>
                        </Badge>
                      )}

                      {activeEntry.timestamp && (
                        <Badge
                          variant="outline"
                          className="h-5.5 text-[10px] text-muted-foreground"
                        >
                          {activeEntry.timestamp}
                        </Badge>
                      )}
                    </div>

                    {/* Dev Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      {isHttpEndpoint && (
                        <Button
                          type="button"
                          variant="outline"
                          size="xs"
                          onClick={handleCopyCurl}
                          className="h-6 gap-1 text-[11px] whitespace-nowrap text-muted-foreground hover:text-foreground"
                        >
                          <Code2 className="size-3" />
                          <span>
                            {copiedCurl ? "cURL Copied!" : "Copy cURL"}
                          </span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {activeEntry.description && (
                    <p className="text-[11px] text-muted-foreground">
                      {activeEntry.description}
                    </p>
                  )}
                </div>

                {/* Error Callout Banner if fetch failed */}
                {activeEntry.error && (
                  <div className="flex items-start justify-between gap-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400">
                    <div className="space-y-1">
                      <strong className="font-semibold">Request Failed:</strong>
                      <p className="text-[11px]">{activeEntry.error}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => refetchEntry(activeEntry.id)}
                      className="border-rose-500/30 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
                    >
                      Retry
                    </Button>
                  </div>
                )}

                {/* Subtabs: Payload vs Request Body vs Metadata vs Code */}
                <div className="flex items-center justify-between border-b border-border/70 pb-1">
                  <div className="flex items-center gap-1 overflow-x-auto">
                    <Button
                      type="button"
                      variant={
                        currentSubTab === "payload" ? "default" : "ghost"
                      }
                      size="xs"
                      onClick={() => setActiveSubTab("payload")}
                      className="h-6.5 text-[11px] whitespace-nowrap"
                    >
                      Response Payload
                    </Button>

                    {hasRequestBody && (
                      <Button
                        type="button"
                        variant={
                          currentSubTab === "requestBody" ? "default" : "ghost"
                        }
                        size="xs"
                        onClick={() => setActiveSubTab("requestBody")}
                        className="h-6.5 gap-1 text-[11px] whitespace-nowrap"
                      >
                        <FileJson className="size-3 text-primary" />
                        <span>Request Body</span>
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant={
                        currentSubTab === "headers" ? "default" : "ghost"
                      }
                      size="xs"
                      onClick={() => setActiveSubTab("headers")}
                      className="h-6.5 text-[11px] whitespace-nowrap"
                    >
                      Metadata & Headers
                    </Button>

                    {isHttpEndpoint && (
                      <Button
                        type="button"
                        variant={currentSubTab === "code" ? "default" : "ghost"}
                        size="xs"
                        onClick={() => setActiveSubTab("code")}
                        className="h-6.5 text-[11px] whitespace-nowrap"
                      >
                        Code Snippet
                      </Button>
                    )}
                  </div>
                </div>

                {/* Subtab Contents */}
                {currentSubTab === "payload" && (
                  <JsonViewer
                    data={activeEntry.data}
                    title={activeEntry.title}
                    className="w-full"
                  />
                )}

                {hasRequestBody && currentSubTab === "requestBody" && (
                  <JsonViewer
                    data={
                      typeof activeEntry.requestBody === "string"
                        ? (() => {
                            try {
                              return JSON.parse(activeEntry.requestBody)
                            } catch {
                              return activeEntry.requestBody
                            }
                          })()
                        : activeEntry.requestBody
                    }
                    title={`${activeEntry.title} Sent Request Body`}
                    className="w-full"
                  />
                )}

                {currentSubTab === "headers" && (
                  <div className="space-y-3 rounded-xl border border-border/80 bg-card/40 p-4 text-xs">
                    <h4 className="font-semibold text-foreground">
                      Entry Metadata
                    </h4>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div className="rounded-lg border border-border/60 bg-muted/20 p-2.5">
                        <span className="text-[10px] text-muted-foreground uppercase">
                          Identifier
                        </span>
                        <p className="text-xs text-foreground">
                          {activeEntry.id}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/60 bg-muted/20 p-2.5">
                        <span className="text-[10px] text-muted-foreground uppercase">
                          Method & Status
                        </span>
                        <p className="text-xs text-foreground">
                          {activeEntry.method || "GET"} &bull;{" "}
                          {activeEntry.status || 200}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/60 bg-muted/20 p-2.5">
                        <span className="text-[10px] text-muted-foreground uppercase">
                          Trigger Mode
                        </span>
                        <p className="text-xs text-foreground">
                          {typeof activeEntry.fetcher === "function"
                            ? "Custom Function / Interactive Client"
                            : "Native HTTP Fetcher"}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/60 bg-muted/20 p-2.5">
                        <span className="text-[10px] text-muted-foreground uppercase">
                          Last Latency
                        </span>
                        <p className="text-xs text-foreground">
                          {activeEntry.durationMs !== undefined
                            ? `${activeEntry.durationMs} ms`
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    {activeEntry.requestHeaders &&
                      Object.keys(activeEntry.requestHeaders).length > 0 && (
                        <div className="mt-3 space-y-2">
                          <h5 className="font-semibold text-foreground">
                            Request Headers Sent
                          </h5>
                          <div className="rounded-lg border border-border/60 bg-muted/20 p-3 text-[11px]">
                            {Object.entries(activeEntry.requestHeaders).map(
                              ([k, v]) => (
                                <div
                                  key={k}
                                  className="flex justify-between py-0.5"
                                >
                                  <span className="text-muted-foreground">
                                    {k}:
                                  </span>
                                  <span className="text-foreground">{v}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {activeEntry.headers &&
                      Object.keys(activeEntry.headers).length > 0 && (
                        <div className="mt-3 space-y-2">
                          <h5 className="font-semibold text-foreground">
                            Response Headers Received
                          </h5>
                          <div className="max-h-48 overflow-y-auto rounded-lg border border-border/60 bg-muted/20 p-3 text-[11px]">
                            {Object.entries(activeEntry.headers).map(
                              ([k, v]) => (
                                <div
                                  key={k}
                                  className="flex justify-between py-0.5"
                                >
                                  <span className="text-muted-foreground">
                                    {k}:
                                  </span>
                                  <span className="text-foreground">{v}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {isHttpEndpoint && currentSubTab === "code" && (
                  <div className="space-y-3 rounded-xl border border-border/80 bg-card/40 p-4 text-xs">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">
                          cURL Command
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="xs"
                          onClick={handleCopyCurl}
                          className="h-6 text-[11px]"
                        >
                          Copy
                        </Button>
                      </div>
                      <pre className="overflow-x-auto rounded-lg border border-border/70 bg-muted/30 p-3 text-[11px] text-foreground">
                        <code>{`curl -X ${activeEntry.method || "GET"} "${activeEntry.endpoint}"`}</code>
                      </pre>
                    </div>

                    <Separator />

                    <div className="space-y-1.5">
                      <span className="font-semibold text-foreground">
                        JavaScript Fetch Snippet
                      </span>
                      <pre className="overflow-x-auto rounded-lg border border-border/70 bg-muted/30 p-3 text-[11px] text-foreground">
                        <code>{`const response = await fetch("${activeEntry.endpoint}", {\n  method: "${activeEntry.method || "GET"}",\n});\nconst data = await response.json();`}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : !isComposing ? (
              /* Empty State with Instant Restore Button */
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-8 text-center">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-muted/30 text-muted-foreground shadow-xs">
                  <Database className="size-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    All API Requests Cleared
                  </h3>
                  <p className="max-w-md text-xs text-muted-foreground">
                    Restore your app&apos;s default APIs (such as Sanity Site
                    Settings) instantly without reloading the page, or compose a
                    new request:
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={restoreDefaultApis}
                    className="h-8 gap-1.5 px-3.5 text-xs font-semibold shadow-xs"
                  >
                    <RefreshCw className="size-3.5" />
                    <span>Restore Default APIs</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setComposerInitial(null)
                      setIsComposing(true)
                    }}
                    className="h-8 gap-1.5 text-xs font-medium"
                  >
                    <Plus className="size-3.5" />
                    <span>Compose Request</span>
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </ScrollFadeEffect>

        {/* Drawer Footer */}
        <DrawerFooter className="border-t border-border/70 px-4 py-3 sm:px-6">
          <div className="flex w-full items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex size-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="hidden sm:inline">Shortcuts:</span>
              <Kbd>Ctrl + Shift + A</Kbd>
              <span className="text-muted-foreground/60">&bull;</span>
              <Kbd>R</Kbd>
              <span className="text-[10px] text-muted-foreground/70">
                Refetch
              </span>
              <span className="text-muted-foreground/60">&bull;</span>
              <Kbd>Esc</Kbd>
            </div>

            <DrawerClose asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
              >
                Close
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
