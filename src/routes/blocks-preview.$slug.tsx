/* eslint-disable react-hooks/set-state-in-effect */
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft, Loader2 } from "lucide-react"
import React, { lazy, Suspense, useEffect, useMemo, useState } from "react"

import {
  getLiveDemo,
  getRecordByItem,
  getStudioItemHref,
  resolveCanvasLayout,
} from "@/features/ui-studio/model/unified-registry.adapter"
import { REGISTRY_DEMOS } from "@/registry/demos"

/**
 * Registry mapping block slugs to lazy-loaded root block components.
 * Loaded inside an isolated iframe or standalone tab with its own window, document.body, and scroll contexts.
 */
function lazyWithRetry(
  factory: () => Promise<{ default: React.ComponentType }>
): React.LazyExoticComponent<React.ComponentType> {
  return lazy(async () => {
    try {
      return await factory()
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 600))
      return await factory()
    }
  })
}

const BLOCK_COMPONENTS: Record<
  string,
  React.LazyExoticComponent<React.ComponentType>
> = {
  "koi-background": lazyWithRetry(
    () => import("@/registry/block/koi-background/page")
  ),
  "login-01": lazyWithRetry(() => import("@/registry/block/login-01/page")),
  "not-found-01": lazyWithRetry(
    () => import("@/registry/block/not-found-01/app/not-found")
  ),
  "not-found-02": lazyWithRetry(
    () => import("@/registry/block/not-found-02/app/not-found")
  ),
  "not-found-03": lazyWithRetry(
    () => import("@/registry/block/not-found-03/app/not-found")
  ),
  "not-found-04": lazyWithRetry(
    () => import("@/registry/block/not-found-04/app/not-found")
  ),
  "stats-cards-01": lazyWithRetry(
    () => import("@/registry/block/stats-cards-01/page")
  ),
  "artcraft-scroll-01": lazyWithRetry(
    () => import("@/registry/block/artcraft-scroll-01/page")
  ),
}

export const Route = createFileRoute("/blocks-preview/$slug")({
  validateSearch: (search: Record<string, unknown>): { variant?: string } => ({
    variant: typeof search.variant === "string" ? search.variant : undefined,
  }),
  component: BlockPreviewFrame,
})

function BlockPreviewFrame() {
  const { slug } = Route.useParams()
  const search = Route.useSearch()
  const variantParam = search.variant

  const [isIframe, setIsIframe] = useState(true)

  useEffect(() => {
    try {
      setIsIframe(window.self !== window.top)
    } catch {
      setIsIframe(true)
    }
  }, [])

  // Resolve component or block from registry
  const { PreviewComponent, isFullBleed, record } = useMemo(() => {
    // 1. Check registered blocks
    const BlockComponent = BLOCK_COMPONENTS[slug]
    if (BlockComponent) {
      return {
        PreviewComponent: BlockComponent,
        isFullBleed: true,
        record: getRecordByItem(slug),
      }
    }

    // 2. Check unified studio registry (components, blocks, hooks)
    const rec = getRecordByItem(slug)
    if (rec) {
      const item = rec.item
      const fullBleed = resolveCanvasLayout(item) === "full"

      // Check variant if requested
      if (variantParam) {
        const variant = item.variants?.find((v) => v.id === variantParam)
        if (variant?.component) {
          return {
            PreviewComponent: variant.component,
            isFullBleed: fullBleed,
            record: rec,
          }
        }
      }

      // Default variant or live demo or schematic
      const defaultVariant = item.variants?.[0]?.component
      const demo = defaultVariant ?? getLiveDemo(item) ?? rec.schematic
      if (demo) {
        return {
          PreviewComponent: demo,
          isFullBleed: fullBleed,
          record: rec,
        }
      }
    }

    // 3. Fallback to direct registry demos map
    const Demo = REGISTRY_DEMOS[slug]
    if (Demo) {
      return {
        PreviewComponent: Demo,
        isFullBleed: false,
        record: rec,
      }
    }

    return {
      PreviewComponent: null,
      isFullBleed: false,
      record: undefined,
    }
  }, [slug, variantParam])

  // Synchronize dark/light theme with parent window & localStorage
  useEffect(() => {
    const syncTheme = () => {
      try {
        const parentDoc = window.parent?.document
        if (parentDoc && parentDoc !== document) {
          const parentIsDark =
            parentDoc.documentElement.classList.contains("dark")
          document.documentElement.classList.toggle("dark", parentIsDark)
          document.documentElement.classList.toggle("light", !parentIsDark)
          return
        }
      } catch {
        // Cross-origin fallback
      }

      const stored = localStorage.getItem("vite-ui-theme")
      const isDark =
        stored === "dark" ||
        (stored !== "light" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      document.documentElement.classList.toggle("dark", isDark)
      document.documentElement.classList.toggle("light", !isDark)
    }

    syncTheme()

    let observer: MutationObserver | null = null
    try {
      if (window.parent && window.parent.document) {
        observer = new MutationObserver(syncTheme)
        observer.observe(window.parent.document.documentElement, {
          attributes: true,
          attributeFilter: ["class"],
        })
      }
    } catch {
      // Cross-origin fallback
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "vite-ui-theme") {
        syncTheme()
      }
    }
    window.addEventListener("storage", handleStorage)

    return () => {
      observer?.disconnect()
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  if (!PreviewComponent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-8 text-foreground">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Preview Unavailable
          </p>
          <h1 className="mt-2 text-2xl font-bold text-foreground">{slug}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            No live preview demo found for this item.
          </p>
          <Link
            to="/ui"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Studio</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full min-h-screen w-full bg-background text-foreground antialiased">
      <style>{`
        html, body, #root {
          height: 100%;
          min-height: 100%;
        }
      `}</style>

      {/* Floating back button when opened standalone in a browser tab */}
      {!isIframe ? (
        <div className="fixed top-4 left-4 z-50 flex items-center gap-2 rounded-full border border-border/80 bg-background/90 px-3 py-1.5 shadow-lg backdrop-blur-md">
          <Link
            to={record ? getStudioItemHref(record.item) : "/ui"}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            <span>Studio</span>
          </Link>
          <span className="h-3 w-px bg-border/60" aria-hidden="true" />
          <span className="text-xs font-semibold text-foreground">
            {record?.item.title ?? slug}
          </span>
        </div>
      ) : null}

      <Suspense
        fallback={
          <div className="flex h-full min-h-screen items-center justify-center">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        }
      >
        {isFullBleed ? (
          <div className="h-full min-h-screen w-full overflow-hidden [&>*]:size-full [&>*]:rounded-none [&>*]:border-0 [&>*]:shadow-none">
            <PreviewComponent />
          </div>
        ) : (
          <div className="flex min-h-screen w-full items-center justify-center overflow-auto p-4 sm:p-8">
            <PreviewComponent />
          </div>
        )}
      </Suspense>
    </div>
  )
}
