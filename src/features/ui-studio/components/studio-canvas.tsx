/* eslint-disable react-hooks/static-components */
import { ExternalLink, Globe, Loader2 } from "lucide-react"
import { Suspense } from "react"

import { CodeBlock } from "@/registry/ui/code-block"
import { siteConfig } from "@/shared/config"
import { cn } from "@/shared/lib/utils"

import type { StudioControlValue, StudioItem } from "../model/types"
import {
  getLiveDemo,
  getRecordByItem,
  getStudioSourceFiles,
} from "../model/unified-registry.adapter"
import { StudioPropsCustomizer } from "./studio-props-customizer"

interface StudioCanvasProps {
  item: StudioItem
  variantId?: string
  onSelectVariant: (variantId: string | null) => void
  customizerValues: Record<string, StudioControlValue>
  onCustomizerChange: (key: string, value: StudioControlValue) => void
  onResetCustomizer: () => void
}

function kebabToPascal(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

function hookExportName(slug: string): string {
  return `use${kebabToPascal(slug.replace(/^use-/, ""))}`
}

/** Renders the selected variant (or base demo) inside a Suspense boundary. */
function LiveStage({
  item,
  variantId,
}: {
  item: StudioItem
  variantId?: string
}) {
  const variant = item.variants?.find((entry) => entry.id === variantId)
  const VariantComponent = variant?.component
  const Demo = VariantComponent ?? getLiveDemo(item)

  if (Demo) {
    return (
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            <Loader2
              className="size-6 animate-spin text-muted-foreground"
              aria-label="Loading preview"
            />
          </div>
        }
      >
        <Demo />
      </Suspense>
    )
  }

  const record = getRecordByItem(item.id)
  const Schematic = record?.schematic
  if (Schematic) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Schematic />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
      <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase">
        No live preview
      </p>
      <p className="max-w-xs text-sm text-muted-foreground">
        This entry ships documentation only. Open the Code tab to read the
        source.
      </p>
    </div>
  )
}

/** hook-code render mode: read the real registry source instead of a fake demo. */
function HookCodeStage({ item }: { item: StudioItem }) {
  const files = getStudioSourceFiles(item)
  const primary = files[0]
  if (!primary) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-sm text-muted-foreground">
        Source unavailable in the local registry.
      </div>
    )
  }
  const importPath = `@/hooks/${item.slug}`
  const exportName = hookExportName(item.slug)
  return (
    <div className="flex h-full w-full max-w-2xl flex-col gap-3 overflow-y-auto p-4 sm:p-6">
      <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase">
        {exportName}
      </p>
      <CodeBlock
        code={`import { ${exportName} } from "${importPath}"\n\n// Full source → use the Code tab for every file in this hook.`}
        language="tsx"
        className="shrink-0 rounded-lg border border-border/60"
        showLineNumbers={false}
      />
      <CodeBlock
        code={primary.code}
        language="typescript"
        className="min-h-0 rounded-lg border border-border/60"
        showLineNumbers
        maxLines={18}
      />
    </div>
  )
}

/**
 * Stage frame: browser chrome with a live URL pill over a dot-grid CAD board.
 */
export function StudioCanvas({
  item,
  variantId,
  onSelectVariant,
  customizerValues,
  onCustomizerChange,
  onResetCustomizer,
}: StudioCanvasProps) {
  const registryJsonUrl = `${siteConfig.url}/r/${item.slug}.json`

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Browser chrome */}
      <div className="flex h-11 shrink-0 items-center gap-3 border-b border-border/70 bg-muted/20 px-3">
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-rose-400/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <div className="mx-auto flex h-7 w-full max-w-md min-w-0 items-center gap-1.5 rounded-md border border-border/60 bg-background/70 px-2.5 font-mono text-[10px] text-muted-foreground">
          <Globe className="size-3 shrink-0" aria-hidden="true" />
          <span className="truncate">acme.app/preview/{item.slug}</span>
        </div>
        <a
          href={registryJsonUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Open registry item JSON"
          title="Open registry item JSON"
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      </div>

      {/* Variant pills (when the item ships variants) */}
      {item.variants && item.variants.length > 0 ? (
        <div
          className="flex shrink-0 items-center gap-1.5 overflow-x-auto border-b border-border/60 px-3 py-2"
          aria-label="Variants"
        >
          {item.variants.map((variant) => {
            const isActive = variant.id === variantId
            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => onSelectVariant(isActive ? null : variant.id)}
                aria-pressed={isActive}
                className={cn(
                  "shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isActive
                    ? "border-transparent bg-foreground text-background"
                    : "border-border/70 bg-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                )}
              >
                {variant.title}
              </button>
            )
          })}
        </div>
      ) : null}

      {/* CAD board */}
      <div className="relative min-h-0 flex-1 overflow-hidden [background-image:radial-gradient(circle_at_1px_1px,var(--color-border)_1px,transparent_0)] [background-size:18px_18px]">
        {item.collection === "blocks" ? (
          <iframe
            key={item.slug}
            src={`/blocks-preview/${item.slug}`}
            title={`${item.title} preview`}
            className="h-full w-full border-0 bg-background"
          />
        ) : item.renderMode === "hook-code" ? (
          <div className="flex h-full items-start justify-center overflow-y-auto">
            <HookCodeStage item={item} />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center overflow-auto p-4 sm:p-8">
            <LiveStage item={item} variantId={variantId} />
          </div>
        )}

        {item.controls && item.controls.length > 0 ? (
          <StudioPropsCustomizer
            controls={item.controls}
            values={customizerValues}
            onChange={onCustomizerChange}
            onReset={onResetCustomizer}
          />
        ) : null}
      </div>
    </div>
  )
}
