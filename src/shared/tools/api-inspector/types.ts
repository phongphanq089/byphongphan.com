export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "GROQ"
  | "QUERY"
  | "MOCK"
  | "RPC"

export type HttpStatus =
  | number
  | "200"
  | "201"
  | "204"
  | "400"
  | "401"
  | "403"
  | "404"
  | "500"
  | "pending"
  | "loading"
  | "error"
  | "success"

export interface ApiEntry {
  /** Unique ID for the tab / record */
  id: string
  /** Human readable title (e.g. "Sanity Settings", "User Profile") */
  title: string
  /** Endpoint URL, query string, or function signature */
  endpoint: string
  /** HTTP / Query method */
  method?: HttpMethod
  /** Response status code or state */
  status?: HttpStatus
  /** When the request was initiated or logged */
  timestamp?: string
  /** Duration in milliseconds */
  durationMs?: number
  /** Payload size in bytes (automatically calculated if omitted) */
  sizeBytes?: number
  /** Response payload data */
  data: unknown
  /** Optional response headers */
  headers?: Record<string, string>
  /** Optional request headers sent */
  requestHeaders?: Record<string, string>
  /** Optional request body sent (e.g. JSON string or object for POST / PUT / PATCH) */
  requestBody?: unknown
  /** Optional contextual notes or description */
  description?: string
  /**
   * Function to re-fetch or re-trigger this API call dynamically.
   * If provided, clicking "Refetch" inside the Inspector will execute this function live!
   */
  fetcher?: () => Promise<unknown> | unknown
  /** Is this entry currently refetching in the background? */
  isLoading?: boolean
  /** Error message if fetch/execution failed */
  error?: string | null
  /** Optional request payload or query variables */
  params?: unknown
  /** Optional tags for filtering (e.g. ["sanity", "cms"]) */
  tags?: string[]
}

export interface RegisterApiOptions {
  /** Optional custom ID. If omitted, one is generated automatically. */
  id?: string
  /** Human-readable title for the entry */
  title: string
  /** Endpoint URL, GROQ query, or function identifier */
  endpoint?: string
  /** HTTP or Query method (defaults to "GET" or "QUERY") */
  method?: HttpMethod
  /**
   * The function that produces data. Can be async or sync.
   * Returns whatever data this API should inspect.
   */
  fetcher: () => Promise<unknown> | unknown
  /** Optional request/response headers */
  headers?: Record<string, string>
  /** Optional request body sent */
  requestBody?: unknown
  /** Optional contextual notes or description */
  description?: string
  /** Optional request payload or query variables */
  params?: unknown
  /** Optional tags for grouping / filtering */
  tags?: string[]
  /**
   * Whether to execute the function immediately upon registration.
   * Defaults to `true`.
   */
  autoExecute?: boolean
  /** Initial fallback data to display before execution */
  initialData?: unknown
  /** Payload / initial data (alias for initialData) */
  data?: unknown
}

export interface SendRequestOptions {
  /** Optional custom ID for this request tab */
  id?: string
  /** Custom display title (defaults to `METHOD url`) */
  title?: string
  /** The target HTTP endpoint URL */
  url: string
  /** HTTP Method: GET, POST, PUT, PATCH, DELETE */
  method: HttpMethod
  /** Custom request headers (e.g., Content-Type, Authorization) */
  headers?: Record<string, string>
  /** Request body (stringified JSON, object, or plain text) */
  body?: string | unknown
  /** Optional description */
  description?: string
}

export interface ApiInspectorContextType {
  entries: ApiEntry[]
  activeEntryId: string | null
  activeEntry: ApiEntry | null
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  openWithEntry: (entry: ApiEntry) => void
  /** Add or update an entry manually */
  inspect: (entry: Omit<ApiEntry, "id"> & { id?: string }) => void
  /**
   * Super convenient function-based registration:
   * Pass a function that returns data, and the inspector automatically handles
   * execution, timing, size calculation, error handling, and live refetching!
   */
  register: (options: RegisterApiOptions) => Promise<ApiEntry>
  /**
   * Interactive API Client Send Request:
   * Sends real POST, PUT, PATCH, DELETE, or GET requests with custom body and headers,
   * logs the result into a tab, and supports 1-click re-sending!
   */
  sendRequest: (options: SendRequestOptions) => Promise<ApiEntry>
  /** Re-execute / refetch an entry by ID */
  refetchEntry: (id: string) => Promise<void>
  /** Re-execute all entries with registered fetchers or fetchable endpoints */
  refetchAll: () => Promise<void>
  removeEntry: (id: string) => void
  clearEntries: () => void
  /**
   * Restore initial and default system APIs (e.g. Sanity Site Settings)
   * without needing to reload the web page.
   */
  restoreDefaultApis: () => void
  setActiveEntryId: (id: string) => void
}
