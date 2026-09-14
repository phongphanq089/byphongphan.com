import {
  Code2,
  Database,
  ExternalLink,
  Layers,
  RefreshCw,
  Sparkles,
  Terminal,
} from "lucide-react"
import { useState } from "react"

import { cn } from "@/shared/lib/utils"
import {
  type ApiEntry,
  JsonViewer,
  useApiInspector,
} from "@/shared/tools/api-inspector"
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
  DrawerTrigger,
} from "@/shared/ui/core/drawer"
import { Spinner } from "@/shared/ui/core/spinner"

interface EndpointDef {
  id: string
  title: string
  url: string
  description: string
  method: "GET" | "POST"
}

const DEMO_ENDPOINTS: EndpointDef[] = [
  {
    id: "jp-posts",
    title: "JSONPlaceholder Posts",
    url: "https://jsonplaceholder.typicode.com/posts?_limit=5",
    description: "Fetches list of articles with userId, title & body",
    method: "GET",
  },
  {
    id: "jp-users",
    title: "JSONPlaceholder Users",
    url: "https://jsonplaceholder.typicode.com/users?_limit=3",
    description: "Fetches user profiles with company, geo & contact info",
    method: "GET",
  },
  {
    id: "jp-comments",
    title: "JSONPlaceholder Comments",
    url: "https://jsonplaceholder.typicode.com/comments?_limit=4",
    description: "Fetches post comments with author email and message",
    method: "GET",
  },
  {
    id: "jp-todos",
    title: "JSONPlaceholder Todos",
    url: "https://jsonplaceholder.typicode.com/todos?_limit=5",
    description: "Fetches task items with completion status flags",
    method: "GET",
  },
]

export function ApiInspectorSection() {
  const { openWithEntry, register, setIsOpen } = useApiInspector()

  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})
  const [resultsMap, setResultsMap] = useState<Record<string, ApiEntry>>({})
  const [selectedEndpointId, setSelectedEndpointId] =
    useState<string>("jp-posts")
  const [batchLoading, setBatchLoading] = useState(false)
  const [customFnLoading, setCustomFnLoading] = useState(false)

  // Fetch a single endpoint using function-based registration
  const handleFetchEndpoint = async (
    endpoint: EndpointDef,
    openDrawerAfter = false
  ) => {
    setLoadingMap((prev) => ({ ...prev, [endpoint.id]: true }))

    try {
      const entry = await register({
        id: endpoint.id,
        title: endpoint.title,
        endpoint: endpoint.url,
        method: endpoint.method,
        fetcher: async () => {
          const res = await fetch(endpoint.url)
          return await res.json()
        },
        description: endpoint.description,
      })

      setResultsMap((prev) => ({ ...prev, [endpoint.id]: entry }))

      if (openDrawerAfter) {
        openWithEntry(entry)
      }
    } finally {
      setLoadingMap((prev) => ({ ...prev, [endpoint.id]: false }))
    }
  }

  // Fetch all endpoints and open Drawer with all tabs
  const handleFetchAll = async () => {
    setBatchLoading(true)
    for (const ep of DEMO_ENDPOINTS) {
      await handleFetchEndpoint(ep, false)
    }
    setBatchLoading(false)
    setIsOpen(true)
  }

  // Demo triggering a custom function that returns data without needing an explicit URL
  const handleTriggerCustomFunction = async () => {
    setCustomFnLoading(true)
    try {
      const entry = await register({
        id: "demo-custom-calculator",
        title: "Developer Metrics Service",
        endpoint: "calculateDevStats({ mock: true })",
        method: "RPC",
        description:
          "Example of registering an async function directly returning rich analytics data",
        fetcher: async () => {
          await new Promise((resolve) => setTimeout(resolve, 320))
          return {
            status: "ok",
            timestamp: new Date().toISOString(),
            metrics: {
              activeProjects: 8,
              totalCommitsThisMonth: 142,
              uptimeRatio: 0.9998,
              codeQualityScore: "A+",
              cacheHitRatePercent: 94.2,
            },
            system: {
              runtime: "Vite 8 / React 19",
              bundleSizeKB: 184.6,
              memoryUsedMB: 42.1,
            },
          }
        },
      })
      openWithEntry(entry)
    } finally {
      setCustomFnLoading(false)
    }
  }

  const currentResult = resultsMap[selectedEndpointId]

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="rounded-xl border border-border/70 bg-card/40 p-5 backdrop-blur-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-primary/40 bg-primary/10 text-[10px] font-bold text-primary uppercase"
              >
                Interactive Dev Tool HUD
              </Badge>
              <span className="text-xs text-muted-foreground">
                Zero-Reload &bull; Function-Based &bull; Built-in API Client
              </span>
            </div>
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              API Responses Inspector Drawer
            </h3>
            <p className="max-w-3xl text-xs text-muted-foreground">
              A visual API debugging and testing HUD that completely replaces{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-foreground">
                console.log
              </code>
              . Pass any data-returning function, test custom endpoints with{" "}
              <strong>POST, PUT, PATCH, DELETE</strong>, measure live latency,
              and <strong>re-trigger requests live</strong> without reloading
              the page.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTriggerCustomFunction}
              disabled={customFnLoading}
              className="h-8 gap-1.5 text-xs whitespace-nowrap"
            >
              {customFnLoading ? (
                <Spinner className="size-3.5" />
              ) : (
                <Sparkles className="size-3.5 text-primary" />
              )}
              <span>Inspect Custom Function</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFetchAll}
              disabled={batchLoading}
              className="h-8 gap-1.5 text-xs whitespace-nowrap"
            >
              {batchLoading ? (
                <Spinner className="size-3.5" />
              ) : (
                <RefreshCw className="size-3.5 text-primary" />
              )}
              <span>Fetch All (4 Tabs)</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={() => setIsOpen(true)}
              className="h-8 gap-1.5 text-xs whitespace-nowrap"
            >
              <Terminal className="size-3.5" />
              <span>Open Inspector</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Endpoints Grid - 2 columns on mobile for densification */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {DEMO_ENDPOINTS.map((endpoint) => {
          const isLoading = Boolean(loadingMap[endpoint.id])
          const result = resultsMap[endpoint.id]
          const isSelected = selectedEndpointId === endpoint.id

          return (
            <div
              key={endpoint.id}
              onClick={() => setSelectedEndpointId(endpoint.id)}
              className={cn(
                "group relative flex cursor-pointer flex-col justify-between rounded-xl border p-3 transition-all select-none sm:p-4",
                isSelected
                  ? "border-primary/50 bg-primary/[0.04] shadow-xs"
                  : "border-border/70 bg-card/30 hover:border-border hover:bg-card/70"
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1">
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 px-1 py-0 text-[9px] font-bold text-emerald-600 dark:text-emerald-400"
                  >
                    {endpoint.method}
                  </Badge>

                  {result && (
                    <Badge
                      variant="outline"
                      className="text-[9px] text-muted-foreground"
                    >
                      {result.durationMs}ms
                    </Badge>
                  )}
                </div>

                <div>
                  <h4 className="line-clamp-1 text-xs font-bold text-foreground">
                    {endpoint.title}
                  </h4>
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                    {endpoint.description}
                  </p>
                </div>
              </div>

              {/* Card Actions using Core UI Button */}
              <div className="mt-3 flex items-center justify-between gap-1.5 border-t border-border/40 pt-2.5 sm:mt-4 sm:pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleFetchEndpoint(endpoint, false)
                  }}
                  disabled={isLoading}
                  className="h-6 gap-1 px-1.5 text-[11px] font-medium whitespace-nowrap text-primary hover:text-primary"
                >
                  {isLoading ? (
                    <>
                      <Spinner className="size-3" />
                      <span className="hidden sm:inline">Fetching...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="size-3" />
                      <span>{result ? "Refetch" : "Fetch"}</span>
                    </>
                  )}
                </Button>

                {result && (
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      openWithEntry(result)
                    }}
                    className="h-6 gap-1 px-1.5 text-[10px] whitespace-nowrap text-muted-foreground hover:text-foreground"
                    title="Inspect in Drawer"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="size-2.5" />
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Live Preview Console for Selected Endpoint */}
      <div className="space-y-3 rounded-xl border border-border/70 bg-card/20 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Database className="size-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">
              Live Preview:{" "}
              {DEMO_ENDPOINTS.find((e) => e.id === selectedEndpointId)?.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => {
                const ep = DEMO_ENDPOINTS.find(
                  (e) => e.id === selectedEndpointId
                )
                if (ep) handleFetchEndpoint(ep, false)
              }}
              className="h-7 gap-1.5 text-xs whitespace-nowrap"
            >
              <RefreshCw className="size-3" />
              <span>Fetch Now</span>
            </Button>

            {currentResult && (
              <Button
                type="button"
                size="xs"
                variant="default"
                onClick={() => openWithEntry(currentResult)}
                className="h-7 gap-1.5 text-xs whitespace-nowrap"
              >
                <Terminal className="size-3" />
                <span>Open in Drawer</span>
              </Button>
            )}
          </div>
        </div>

        {/* JSON Viewer inline */}
        {currentResult ? (
          <JsonViewer
            data={currentResult.data}
            title={currentResult.title}
            className="w-full"
          />
        ) : (
          <div className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-6 text-center">
            <span className="text-xs text-muted-foreground">
              Click &ldquo;Fetch Now&rdquo; above or choose an endpoint to fetch
              live data from JSONPlaceholder
            </span>
            <Button
              type="button"
              variant="link"
              size="xs"
              onClick={() => {
                const ep = DEMO_ENDPOINTS.find(
                  (e) => e.id === selectedEndpointId
                )
                if (ep) handleFetchEndpoint(ep, false)
              }}
              className="text-xs font-semibold text-primary"
            >
              Fetch{" "}
              {DEMO_ENDPOINTS.find((e) => e.id === selectedEndpointId)?.title}
            </Button>
          </div>
        )}
      </div>

      {/* Function Registration Code Showcase */}
      <div className="rounded-xl border border-border/70 bg-card/30 p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <Code2 className="size-4 text-primary" />
          <span>How to Test POST, PUT, DELETE Programmatically or via UI</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          You can test APIs interactively using the Request Composer in the
          Drawer or programmatically using `sendRequest`:
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-border/70 bg-muted/40 p-3.5 text-[11px] leading-relaxed text-foreground">
          <code>{`// In any React component:
const { sendRequest } = useApiInspector();

// Send POST request with JSON body:
await sendRequest({
  url: "https://api.example.com/posts",
  method: "POST",
  body: { title: "New Article", userId: 1 },
});`}</code>
        </pre>
      </div>

      {/* Standalone Right-Slide Drawer Demo */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/70 bg-card/30 p-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Layers className="size-3.5 text-primary" />
            <span>Right-Slide Scrollable Drawer Pattern</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Displays a slide-over drawer from the right edge (
            <code className="rounded bg-muted px-1 py-0.5 text-[11px] text-foreground">
              direction=&quot;right&quot;
            </code>
            ) featuring independent, isolated scrollable content.
          </p>
        </div>

        <DrawerScrollableContent />
      </div>
    </div>
  )
}

export function DrawerScrollableContent() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="cursor-pointer text-xs whitespace-nowrap"
        >
          Open Right Drawer (Scrollable Demo)
        </Button>
      </DrawerTrigger>
      <DrawerContent className="fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col border-l border-border/80 bg-background/95 backdrop-blur-xl data-[vaul-drawer-direction=right]:w-[90vw] data-[vaul-drawer-direction=right]:sm:max-w-md">
        <DrawerHeader className="border-b border-border/70 p-4">
          <DrawerTitle className="text-sm font-bold">Move Goal</DrawerTitle>
          <DrawerDescription className="text-xs text-muted-foreground">
            Set your daily activity goal and inspect scrollable content.
          </DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4 text-xs text-muted-foreground">
          {Array.from({ length: 8 }).map((_, index) => (
            <p
              key={index}
              className="rounded-lg border border-border/60 bg-card/40 p-3 leading-relaxed"
            >
              <strong className="text-foreground">Entry #{index + 1}:</strong>{" "}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          ))}
        </div>
        <DrawerFooter className="flex flex-row items-center justify-end gap-2 border-t border-border/70 p-4">
          <Button
            size="sm"
            className="cursor-pointer text-xs whitespace-nowrap"
          >
            Submit
          </Button>
          <DrawerClose asChild>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer text-xs whitespace-nowrap"
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
