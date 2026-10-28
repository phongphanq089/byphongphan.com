import type { ErrorComponentProps } from "@tanstack/react-router"
import { Link, rootRouteId, useMatch, useRouter } from "@tanstack/react-router"
import {
  AlertCircle,
  Check,
  ChevronLeft,
  Code2,
  Copy,
  Home,
  Layers,
  RefreshCw,
  Terminal,
  WifiOff,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/shared/ui/core/button"

interface StackFrame {
  method: string
  location: string
  isInternal: boolean
}

/**
 * Checks whether the error was caused by lost internet connection
 * or a dynamic import chunk failure (e.g. offline or new deployment hash mismatch).
 */
function isNetworkOrChunkError(error: unknown): boolean {
  if (typeof window !== "undefined" && !navigator.onLine) {
    return true
  }
  if (error instanceof Error) {
    const msg = error.message.toLowerCase()
    return (
      msg.includes("failed to fetch dynamically imported module") ||
      msg.includes("failed to fetch") ||
      msg.includes("network error") ||
      msg.includes("loading chunk") ||
      msg.includes("dynamically imported module") ||
      error.name === "ChunkLoadError"
    )
  }
  return false
}

/**
 * Parses a standard JavaScript error stack string into structured stack frames.
 */
function parseStackTrace(stack?: string): StackFrame[] {
  if (!stack) return []
  const lines = stack.split("\n")
  const frames: StackFrame[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed.startsWith("at ")) continue

    const matchWithMethod = trimmed.match(
      /^at\s+(?:async\s+)?([^\s(]+)\s+\((.+)\)$/
    )
    const matchWithoutMethod = trimmed.match(/^at\s+(?:async\s+)?(.+)$/)

    if (matchWithMethod) {
      const method = matchWithMethod[1]
      const location = matchWithMethod[2]
      const isInternal =
        location.includes("node_modules") ||
        location.includes("chunk-") ||
        location.includes("@tanstack") ||
        location.includes("react-dom") ||
        location.includes("vite/")
      frames.push({ method, location, isInternal })
    } else if (matchWithoutMethod) {
      const location = matchWithoutMethod[1]
      const isInternal =
        location.includes("node_modules") ||
        location.includes("chunk-") ||
        location.includes("@tanstack") ||
        location.includes("react-dom") ||
        location.includes("vite/")
      frames.push({ method: "<anonymous>", location, isInternal })
    }
  }

  return frames
}

/**
 * Extracts a referenced file/URL from the error message if present.
 */
function extractSourceFromError(error: unknown): string | null {
  if (!(error instanceof Error)) return null
  const match = error.message.match(/https?:\/\/[^\s'")]+/)
  if (match) return match[0]
  const fileMatch = error.message.match(
    /(?:\/|\.\/)[a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+/
  )
  if (fileMatch) return fileMatch[0]
  return null
}

/**
 * Modern Next.js 14/15-Inspired Debug Overlay for TanStack Start.
 * Features dark obsidian aesthetic, Mac window controls, structured Call Stack,
 * "Copy Error" clipboard action, and offline recovery handling.
 */
export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  const [activeTab, setActiveTab] = useState<"stack" | "raw">("stack")
  const [hideInternal, setHideInternal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)

  const isNetworkError = isNetworkOrChunkError(error)
  const isDev = import.meta.env.DEV

  const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred"
  const errorName = error instanceof Error ? error.name : "RuntimeError"
  const errorStack = error instanceof Error ? error.stack : undefined
  const extractedSource = extractSourceFromError(error)

  const stackFrames = useMemo(() => parseStackTrace(errorStack), [errorStack])
  const visibleFrames = useMemo(() => {
    if (!hideInternal) return stackFrames
    return stackFrames.filter((f) => !f.isInternal)
  }, [stackFrames, hideInternal])

  // Lock body & html overflow to prevent background scrolling behind the error overlay
  useEffect(() => {
    if (typeof document === "undefined") return
    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
    }
  }, [])

  // Log error to console for observability
  useEffect(() => {
    console.error("Caught error in DefaultCatchBoundary: ", error)
  }, [error])

  // Auto-reload once in production if it's a chunk mismatch from a new deployment
  useEffect(() => {
    if (
      !isDev &&
      isNetworkError &&
      typeof window !== "undefined" &&
      navigator.onLine
    ) {
      const storageKey = "chunk_reload_attempted"
      const alreadyAttempted = sessionStorage.getItem(storageKey)
      if (!alreadyAttempted) {
        sessionStorage.setItem(storageKey, Date.now().toString())
        window.location.reload()
      }
    }
  }, [isDev, isNetworkError])

  const handleCopy = () => {
    const textToCopy = errorStack
      ? `${errorMessage}\n\n${errorStack}`
      : errorMessage
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      })
    }
  }

  const handleRetry = () => {
    setIsRetrying(true)
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("chunk_reload_attempted")
      if (isNetworkError) {
        window.location.reload()
        return
      }
    }
    router.invalidate().finally(() => setIsRetrying(false))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md select-none sm:p-6">
      <div className="relative flex h-full max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#0c0c0c] text-zinc-100 shadow-[0_0_50px_rgba(0,0,0,0.85),0_20px_25px_-5px_rgba(0,0,0,0.6)]">
        {/* ── Top Window Bar (Next.js Mac Window Aesthetic) ── */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-800/80 bg-zinc-950 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mac Window Controls */}
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
            </div>

            <div className="h-3.5 w-px bg-zinc-800" />

            {/* Error Pill Badge */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium ${
                isNetworkError
                  ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                  : "border-red-500/20 bg-red-500/10 text-red-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isNetworkError ? "bg-amber-400" : "animate-pulse bg-red-500"
                }`}
              />
              {isNetworkError
                ? "Offline · Network Connection Error"
                : isDev
                  ? "Unhandled Runtime Error (Dev)"
                  : "Runtime Application Error"}
            </span>

            <span className="hidden font-mono text-xs text-zinc-500 sm:inline">
              TanStack Start
            </span>
          </div>

          {/* Top Actions: Copy Error */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 font-mono text-xs text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="text-primry h-3.5 w-3.5" />
                  <span className="text-primary">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Copy Error</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Error Headline Callout (Next.js Redbox Banner) ── */}
        <div className="shrink-0 border-b border-zinc-800/80 bg-gradient-to-b from-red-950/20 via-red-950/5 to-transparent p-5 text-left sm:p-6">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-red-400/90 uppercase">
            {isNetworkError ? (
              <WifiOff className="h-3.5 w-3.5 text-amber-400" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5 text-red-400" />
            )}
            <span>{isNetworkError ? "NetworkError" : errorName}</span>
          </div>

          <h1 className="mt-2 font-mono text-base leading-relaxed font-bold break-words text-zinc-100 sm:text-lg">
            {errorMessage}
          </h1>

          {extractedSource && (
            <div className="mt-3 flex max-w-full items-center gap-2 font-mono text-xs text-zinc-400">
              <span className="text-zinc-500">Source:</span>
              <span className="max-w-full truncate rounded border border-zinc-800 bg-zinc-900/90 px-2 py-0.5 text-zinc-300">
                {extractedSource}
              </span>
            </div>
          )}
        </div>

        {/* ── Navigation Tabs (Call Stack / Raw Trace) ── */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-800/80 bg-zinc-950/60 px-5 py-2 font-mono text-xs sm:px-6">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("stack")}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-colors ${
                activeTab === "stack"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Call Stack
              {stackFrames.length > 0 && (
                <span className="py-0.2 rounded-full bg-zinc-700/60 px-1.5 text-[10px] text-zinc-300">
                  {stackFrames.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("raw")}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-colors ${
                activeTab === "raw"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              Raw Trace
            </button>
          </div>

          {activeTab === "stack" && stackFrames.length > 0 && (
            <label className="flex cursor-pointer items-center gap-1.5 text-zinc-400 hover:text-zinc-200">
              <input
                type="checkbox"
                checked={hideInternal}
                onChange={(e) => setHideInternal(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-zinc-700 bg-zinc-900 text-red-500 focus:ring-0"
              />
              <span className="hidden sm:inline">Hide internal frames</span>
            </label>
          )}
        </div>

        {/* ── Scrollable Trace Content ── */}
        <div className="custom-scrollbar relative flex-1 overflow-auto bg-[#09090b] p-4 text-left sm:p-6">
          {activeTab === "stack" ? (
            <div className="flex flex-col divide-y divide-zinc-900 font-mono text-xs">
              {visibleFrames.length > 0 ? (
                visibleFrames.map((frame, idx) => (
                  <div
                    key={idx}
                    className="group flex flex-col gap-1 rounded-lg px-3 py-2.5 transition-colors hover:bg-zinc-900/60"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-200 transition-colors group-hover:text-red-400">
                        {frame.method}
                      </span>
                      {frame.isInternal && (
                        <span className="py-0.2 rounded bg-zinc-800/80 px-1.5 font-sans text-[10px] text-zinc-400">
                          internal
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] break-all text-zinc-500">
                      {frame.location}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-500">
                  <Terminal className="mb-2 h-6 w-6 opacity-40" />
                  <p className="text-xs">
                    {stackFrames.length === 0
                      ? "No structured call stack frames available."
                      : "All frames are internal framework calls (uncheck 'Hide internal frames' to view)."}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <pre className="overflow-x-auto rounded-lg border border-zinc-800/80 bg-zinc-950/90 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-zinc-300 selection:bg-red-500/30">
              {errorStack || errorMessage}
            </pre>
          )}
        </div>

        {/* ── Next.js Style Action Footer Bar ── */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-zinc-800/80 bg-zinc-950 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
            <Terminal className="h-3.5 w-3.5 text-zinc-600" />
            <span className="hidden sm:inline">
              Check the browser console for full network details
            </span>
            <span className="sm:hidden">Inspect console for details</span>
          </div>

          <div className="flex w-full items-center justify-end gap-2.5 sm:w-auto">
            {!isRoot ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.history.back()}
                className="h-8 border-zinc-800 bg-zinc-900 font-mono text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <ChevronLeft className="mr-1.5 h-3.5 w-3.5" />
                Go Back
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8 border-zinc-800 bg-zinc-900 font-mono text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <Link to="/">
                  <Home className="mr-1.5 h-3.5 w-3.5" />
                  Home
                </Link>
              </Button>
            )}

            <Button
              variant="default"
              size="sm"
              onClick={handleRetry}
              disabled={isRetrying}
              className="h-8 bg-red-600 font-mono text-xs font-semibold text-white shadow-sm hover:bg-red-500"
            >
              <RefreshCw
                className={`mr-1.5 h-3.5 w-3.5 ${isRetrying ? "animate-spin" : ""}`}
              />
              Try Again
              <kbd className="ml-1.5 hidden rounded bg-red-700/80 px-1.5 py-0.5 font-mono text-[10px] sm:inline">
                ⌘R
              </kbd>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DefaultCatchBoundary
