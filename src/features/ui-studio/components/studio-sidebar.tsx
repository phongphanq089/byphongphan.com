import { Layers3 } from "lucide-react"

import { cn } from "@/shared/lib/utils"

import type { StudioCollectionId, StudioCollectionMeta } from "../model/types"

interface StudioSidebarProps {
  collections: StudioCollectionMeta[]
  activeCollection: StudioCollectionId
  onSelectCollection: (id: StudioCollectionId) => void
}

/**
 * Studio sidebar: hero offset hero block that scrolls away, then a sticky
 * "Sorted by Collection" label, then the collection tree. A caliper-tick
 * ruler runs down the far-left edge.
 */
export function StudioSidebar({
  collections,
  activeCollection,
  onSelectCollection,
}: StudioSidebarProps) {
  return (
    <div className="relative flex h-full w-60 flex-col bg-background select-none">
      {/* Caliper ticks — left edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-2 border-r border-border/60 text-border [background:repeating-linear-gradient(to_bottom,transparent_0_14px,currentColor_14px_15px,transparent_15px_28px)]"
      />

      <div className="relative h-full overflow-y-auto overscroll-contain pl-2">
        {/* Hero offset: brand block, scrolls away with content */}
        <div className="flex flex-col gap-1.5 px-5 pt-8 pb-6">
          <div className="flex size-9 items-center justify-center rounded-xl border border-border/70 bg-muted/40">
            <Layers3 className="size-4.5 text-pp-primary" aria-hidden="true" />
          </div>
          <p className="mt-2 font-mono text-[9px] tracking-[0.28em] text-muted-foreground/60 uppercase">
            Shadcn Registry
          </p>
          <h2 className="font-serif text-xl leading-tight font-bold tracking-tight text-foreground">
            UI Studio
          </h2>
          <p className="text-[11px] leading-snug text-muted-foreground">
            Browse, preview and install the component registry.
          </p>
        </div>

        {/* Sticky collection sorter label */}
        <div className="sticky top-0 z-10 border-y border-border/60 bg-background/90 px-5 py-2 backdrop-blur-sm">
          <p className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground/70 uppercase">
            Sorted by Collection
          </p>
        </div>

        <ul className="flex flex-col gap-0.5 p-2" aria-label="Collections">
          {collections.map((collection) => {
            const isActive = activeCollection === collection.id
            return (
              <li key={collection.id}>
                <button
                  type="button"
                  onClick={() => onSelectCollection(collection.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isActive
                      ? "bg-accent font-semibold text-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-1.5 rounded-full transition-colors",
                      isActive ? "bg-pp-primary" : "bg-border"
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {collection.label}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground/70 tabular-nums">
                    {String(collection.count).padStart(2, "0")}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="px-5 pt-4 pb-6">
          <p className="font-mono text-[8px] leading-relaxed tracking-[0.2em] text-muted-foreground/40 uppercase">
            MIT Licensed — Copy, paste, ship.
          </p>
        </div>
      </div>
    </div>
  )
}
