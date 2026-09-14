import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import type {
  ApiEntry,
  ApiInspectorContextType,
  RegisterApiOptions,
  SendRequestOptions,
} from "./types"

const ApiInspectorContext = createContext<ApiInspectorContextType | null>(null)

interface ApiInspectorProviderProps {
  children: React.ReactNode
  initialEntries?: ApiEntry[]
  shortcutEnabled?: boolean
}

function calculateSizeBytes(data: unknown): number {
  if (data === undefined || data === null) return 0
  try {
    const str = typeof data === "string" ? data : JSON.stringify(data)
    return new Blob([str]).size
  } catch {
    return 0
  }
}

function isFetchableUrl(url?: string): boolean {
  if (!url) return false
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/")
  )
}

export function ApiInspectorProvider({
  children,
  initialEntries = [],
  shortcutEnabled = true,
}: ApiInspectorProviderProps) {
  // Store pristine initial entries to enable instant restoration without page reload
  const initialEntriesRef = useRef<ApiEntry[]>(
    initialEntries.map((e) => ({
      ...e,
      sizeBytes: e.sizeBytes ?? calculateSizeBytes(e.data),
    }))
  )
  const registeredOptionsRef = useRef<Map<string, RegisterApiOptions>>(
    new Map()
  )

  const [entries, setEntries] = useState<ApiEntry[]>(() => {
    return initialEntries.map((e) => ({
      ...e,
      sizeBytes: e.sizeBytes ?? calculateSizeBytes(e.data),
    }))
  })
  const [isOpen, setIsOpen] = useState(false)
  const [activeEntryId, setActiveEntryId] = useState<string | null>(
    initialEntries[0]?.id || null
  )

  // Ref keeps track of latest entries for asynchronous callbacks without stale closures
  const entriesRef = useRef(entries)
  useEffect(() => {
    entriesRef.current = entries
  }, [entries])

  // Add or update an entry manually
  const inspect = useCallback(
    (entryInput: Omit<ApiEntry, "id"> & { id?: string }) => {
      const id =
        entryInput.id ||
        `api-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const timestamp = entryInput.timestamp || new Date().toLocaleTimeString()
      const sizeBytes =
        entryInput.sizeBytes ?? calculateSizeBytes(entryInput.data)

      const newEntry: ApiEntry = {
        ...entryInput,
        id,
        timestamp,
        method: entryInput.method || "GET",
        status: entryInput.status || 200,
        sizeBytes,
      }

      setEntries((prev) => {
        const existsIndex = prev.findIndex((e) => e.id === id)
        if (existsIndex >= 0) {
          const copy = [...prev]
          copy[existsIndex] = { ...copy[existsIndex], ...newEntry }
          return copy
        }
        return [newEntry, ...prev]
      })

      setActiveEntryId(id)
    },
    []
  )

  // Refetch a specific entry by ID
  const refetchEntry = useCallback(async (id: string) => {
    const currentList = entriesRef.current
    const entry = currentList.find((e) => e.id === id)
    if (!entry || entry.isLoading) return

    // Set loading state
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isLoading: true } : e))
    )

    const start = performance.now()

    if (typeof entry.fetcher === "function") {
      try {
        const result = await entry.fetcher()
        const durationMs = Math.round(performance.now() - start)
        const sizeBytes = calculateSizeBytes(result)

        setEntries((prev) =>
          prev.map((e) =>
            e.id === id
              ? {
                  ...e,
                  data: result,
                  durationMs,
                  sizeBytes,
                  status: 200,
                  timestamp: new Date().toLocaleTimeString(),
                  isLoading: false,
                  error: null,
                }
              : e
          )
        )
      } catch (err) {
        const durationMs = Math.round(performance.now() - start)
        const errorMessage = err instanceof Error ? err.message : String(err)

        setEntries((prev) =>
          prev.map((e) =>
            e.id === id
              ? {
                  ...e,
                  data: { error: errorMessage },
                  durationMs,
                  status: "error",
                  error: errorMessage,
                  timestamp: new Date().toLocaleTimeString(),
                  isLoading: false,
                }
              : e
          )
        )
      }
    } else if (isFetchableUrl(entry.endpoint)) {
      try {
        const headers = { ...entry.requestHeaders }
        let bodyPayload: BodyInit | undefined = undefined

        if (entry.requestBody) {
          if (typeof entry.requestBody === "string") {
            bodyPayload = entry.requestBody
            if (!headers["Content-Type"] && !headers["content-type"]) {
              try {
                JSON.parse(entry.requestBody)
                headers["Content-Type"] = "application/json"
              } catch {
                // Not JSON string
              }
            }
          } else {
            bodyPayload = JSON.stringify(entry.requestBody)
            if (!headers["Content-Type"] && !headers["content-type"]) {
              headers["Content-Type"] = "application/json"
            }
          }
        }

        const res = await fetch(entry.endpoint, {
          method: entry.method || "GET",
          headers,
          body: bodyPayload,
        })

        const durationMs = Math.round(performance.now() - start)
        const responseHeaders: Record<string, string> = {}
        res.headers.forEach((value, key) => {
          responseHeaders[key] = value
        })

        const contentType = res.headers.get("content-type") || ""
        let data: unknown
        if (contentType.includes("application/json")) {
          try {
            data = await res.json()
          } catch {
            data = { message: "Empty or invalid JSON body" }
          }
        } else {
          data = await res.text()
        }
        const sizeBytes = calculateSizeBytes(data)

        setEntries((prev) =>
          prev.map((e) =>
            e.id === id
              ? {
                  ...e,
                  data,
                  headers: responseHeaders,
                  durationMs,
                  sizeBytes,
                  status: res.status,
                  timestamp: new Date().toLocaleTimeString(),
                  isLoading: false,
                  error: null,
                }
              : e
          )
        )
      } catch (err) {
        const durationMs = Math.round(performance.now() - start)
        const errorMessage = err instanceof Error ? err.message : String(err)

        setEntries((prev) =>
          prev.map((e) =>
            e.id === id
              ? {
                  ...e,
                  data: { error: errorMessage },
                  durationMs,
                  status: "error",
                  error: errorMessage,
                  timestamp: new Date().toLocaleTimeString(),
                  isLoading: false,
                }
              : e
          )
        )
      }
    } else {
      // No fetcher and non-URL endpoint
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, isLoading: false } : e))
      )
    }
  }, [])

  // Refetch all entries with fetchers or URLs
  const refetchAll = useCallback(async () => {
    const candidates = entriesRef.current.filter(
      (e) => typeof e.fetcher === "function" || isFetchableUrl(e.endpoint)
    )
    if (candidates.length === 0) return
    await Promise.all(candidates.map((entry) => refetchEntry(entry.id)))
  }, [refetchEntry])

  // Register an API via a function that returns data
  const register = useCallback(
    async (options: RegisterApiOptions): Promise<ApiEntry> => {
      const id =
        options.id ||
        `api-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const autoExecute = options.autoExecute !== false

      registeredOptionsRef.current.set(id, options)

      const initialEntry: ApiEntry = {
        id,
        title: options.title,
        endpoint: options.endpoint || options.title,
        method: options.method || "GET",
        status: autoExecute ? "loading" : 200,
        timestamp: new Date().toLocaleTimeString(),
        data: options.data ?? options.initialData ?? null,
        headers: options.headers,
        requestBody: options.requestBody,
        description: options.description,
        params: options.params,
        tags: options.tags,
        fetcher: options.fetcher,
        isLoading: autoExecute,
        error: null,
      }

      setEntries((prev) => {
        const existsIndex = prev.findIndex((e) => e.id === id)
        if (existsIndex >= 0) {
          const copy = [...prev]
          copy[existsIndex] = { ...copy[existsIndex], ...initialEntry }
          return copy
        }
        return [initialEntry, ...prev]
      })
      setActiveEntryId(id)

      if (!autoExecute) {
        return initialEntry
      }

      const start = performance.now()
      try {
        const data = await options.fetcher()
        const durationMs = Math.round(performance.now() - start)
        const sizeBytes = calculateSizeBytes(data)

        const resolvedEntry: ApiEntry = {
          ...initialEntry,
          data,
          durationMs,
          sizeBytes,
          status: 200,
          timestamp: new Date().toLocaleTimeString(),
          isLoading: false,
          error: null,
        }

        setEntries((prev) => prev.map((e) => (e.id === id ? resolvedEntry : e)))
        return resolvedEntry
      } catch (err) {
        const durationMs = Math.round(performance.now() - start)
        const errorMessage = err instanceof Error ? err.message : String(err)

        const errorEntry: ApiEntry = {
          ...initialEntry,
          data: { error: errorMessage },
          durationMs,
          status: "error",
          error: errorMessage,
          timestamp: new Date().toLocaleTimeString(),
          isLoading: false,
        }

        setEntries((prev) => prev.map((e) => (e.id === id ? errorEntry : e)))
        return errorEntry
      }
    },
    []
  )

  // Send an interactive HTTP request (POST, PUT, PATCH, DELETE, GET)
  const sendRequest = useCallback(
    async (options: SendRequestOptions): Promise<ApiEntry> => {
      const id =
        options.id ||
        `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const shortUrl = options.url.replace(/^https?:\/\//, "")
      const title =
        options.title ||
        `${options.method} ${shortUrl.length > 28 ? `${shortUrl.slice(0, 25)}...` : shortUrl}`

      // Sanitize body: NEVER set empty string or null as requestBody
      const hasBody =
        options.body !== undefined &&
        options.body !== null &&
        options.body !== ""
      const requestBody = hasBody ? options.body : undefined

      const initialEntry: ApiEntry = {
        id,
        title,
        endpoint: options.url,
        method: options.method,
        status: "loading",
        timestamp: new Date().toLocaleTimeString(),
        data: null,
        requestHeaders: options.headers,
        requestBody,
        description: options.description,
        isLoading: true,
        error: null,
      }

      setEntries((prev) => [initialEntry, ...prev.filter((e) => e.id !== id)])
      setActiveEntryId(id)

      const start = performance.now()
      const headers: Record<string, string> = { ...options.headers }
      let bodyPayload: BodyInit | undefined = undefined

      if (hasBody) {
        if (typeof options.body === "string") {
          bodyPayload = options.body
          if (!headers["Content-Type"] && !headers["content-type"]) {
            try {
              JSON.parse(options.body)
              headers["Content-Type"] = "application/json"
            } catch {
              // Plain text
            }
          }
        } else {
          bodyPayload = JSON.stringify(options.body)
          if (!headers["Content-Type"] && !headers["content-type"]) {
            headers["Content-Type"] = "application/json"
          }
        }
      }

      try {
        const res = await fetch(options.url, {
          method: options.method,
          headers,
          body: bodyPayload,
        })

        const durationMs = Math.round(performance.now() - start)
        const responseHeaders: Record<string, string> = {}
        res.headers.forEach((val, key) => {
          responseHeaders[key] = val
        })

        const contentType = res.headers.get("content-type") || ""
        let data: unknown
        if (contentType.includes("application/json")) {
          try {
            data = await res.json()
          } catch {
            data = { message: "Empty or non-JSON body" }
          }
        } else {
          data = await res.text()
        }

        const sizeBytes = calculateSizeBytes(data)

        const resolvedEntry: ApiEntry = {
          ...initialEntry,
          data,
          headers: responseHeaders,
          durationMs,
          sizeBytes,
          status: res.status,
          timestamp: new Date().toLocaleTimeString(),
          isLoading: false,
          error: null,
        }

        setEntries((prev) => prev.map((e) => (e.id === id ? resolvedEntry : e)))
        return resolvedEntry
      } catch (err) {
        const durationMs = Math.round(performance.now() - start)
        const errorMessage = err instanceof Error ? err.message : String(err)

        const errorEntry: ApiEntry = {
          ...initialEntry,
          data: { error: errorMessage },
          durationMs,
          status: "error",
          error: errorMessage,
          timestamp: new Date().toLocaleTimeString(),
          isLoading: false,
        }

        setEntries((prev) => prev.map((e) => (e.id === id ? errorEntry : e)))
        return errorEntry
      }
    },
    []
  )

  // Restore default and registered APIs without reloading page
  const restoreDefaultApis = useCallback(() => {
    const defaults = [...initialEntriesRef.current]
    setEntries(defaults)
    setActiveEntryId(defaults[0]?.id || null)

    // Re-register any dynamically registered APIs
    registeredOptionsRef.current.forEach((opts) => {
      register(opts)
    })
  }, [register])

  // Open directly with a specific entry
  const openWithEntry = useCallback(
    (entryInput: ApiEntry) => {
      inspect(entryInput)
      setIsOpen(true)
    },
    [inspect]
  )

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
    setActiveEntryId((prevActive) => (prevActive === id ? null : prevActive))
  }, [])

  const clearEntries = useCallback(() => {
    setEntries([])
    setActiveEntryId(null)
  }, [])

  // Global hotkeys:
  // - Ctrl + Shift + A (Cmd + Shift + A): Toggle Drawer
  // - R: Refetch active entry when drawer is open and not focusing an input
  useEffect(() => {
    if (!shortcutEnabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const isInput =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable

      // Toggle drawer shortcut: Ctrl + Shift + A
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "A" || e.key === "a")
      ) {
        e.preventDefault()
        setIsOpen((prev) => !prev)
        return
      }

      // Quick Refetch shortcut: 'r' or 'R' when drawer is open
      if (isOpen && !isInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === "r" || e.key === "R") {
          e.preventDefault()
          const currentActive =
            entriesRef.current.find((entry) => entry.id === activeEntryId) ||
            entriesRef.current[0]
          if (currentActive) {
            refetchEntry(currentActive.id)
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [shortcutEnabled, isOpen, activeEntryId, refetchEntry])

  // Active entry resolution
  const activeEntry = useMemo(() => {
    if (!activeEntryId && entries.length > 0) {
      return entries[0]
    }
    return entries.find((e) => e.id === activeEntryId) || entries[0] || null
  }, [entries, activeEntryId])

  const value = useMemo<ApiInspectorContextType>(
    () => ({
      entries,
      activeEntryId: activeEntry?.id || null,
      activeEntry,
      isOpen,
      setIsOpen,
      openWithEntry,
      inspect,
      register,
      sendRequest,
      refetchEntry,
      refetchAll,
      removeEntry,
      clearEntries,
      restoreDefaultApis,
      setActiveEntryId,
    }),
    [
      entries,
      activeEntry,
      isOpen,
      openWithEntry,
      inspect,
      register,
      sendRequest,
      refetchEntry,
      refetchAll,
      removeEntry,
      clearEntries,
      restoreDefaultApis,
    ]
  )

  return (
    <ApiInspectorContext.Provider value={value}>
      {children}
    </ApiInspectorContext.Provider>
  )
}

export function useApiInspector(): ApiInspectorContextType {
  const context = useContext(ApiInspectorContext)
  if (!context) {
    throw new Error(
      "useApiInspector must be used within an <ApiInspectorProvider>"
    )
  }
  return context
}

/**
 * Convenient React hook to register an inspectable function or query on mount.
 * Automatically manages live state and provides a refetch handler!
 */
export function useInspectableApi(options: RegisterApiOptions) {
  const inspector = useApiInspector()
  const registerFn = inspector.register

  useEffect(() => {
    registerFn(options)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.id || options.title])

  const targetEntry = inspector.entries.find(
    (e) => e.id === (options.id || options.title) || e.title === options.title
  )

  return {
    entry: targetEntry,
    data: targetEntry?.data,
    isLoading: targetEntry?.isLoading ?? false,
    error: targetEntry?.error,
    refetch: () => {
      if (targetEntry) {
        return inspector.refetchEntry(targetEntry.id)
      }
    },
    openInspector: () => {
      if (targetEntry) {
        inspector.openWithEntry(targetEntry)
      } else {
        inspector.setIsOpen(true)
      }
    },
  }
}
