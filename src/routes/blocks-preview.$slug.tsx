import { createFileRoute } from "@tanstack/react-router"
import React, { lazy, Suspense, useEffect } from "react"

/**
 * Registry mapping block slugs to lazy-loaded root block components.
 * Loaded inside an isolated iframe with its own window, document.body, and scroll contexts.
 */
const BLOCK_COMPONENTS: Record<
  string,
  React.LazyExoticComponent<React.ComponentType>
> = {
  "not-found-01": lazy(
    () => import("@/registry/block/not-found-01/app/not-found")
  ),
}

export const Route = createFileRoute("/blocks-preview/$slug")({
  component: BlockPreviewFrame,
})

function BlockPreviewFrame() {
  const { slug } = Route.useParams()
  const BlockComponent = BLOCK_COMPONENTS[slug]

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

  if (!BlockComponent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-8 text-foreground">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Block Preview
          </p>
          <h1 className="mt-2 text-2xl font-bold text-foreground">{slug}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Block component will render here in an isolated context.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground antialiased">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <div className="size-6 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          </div>
        }
      >
        <BlockComponent />
      </Suspense>
    </div>
  )
}
