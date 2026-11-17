/* eslint-disable react-hooks/static-components */
import { Globe, Loader2 } from "lucide-react"
import { Suspense } from "react"

import { CodeBlock } from "@/registry/ui/code-block"

import { useStudioLayout } from "../hooks/studio-layout-context"
import { useStudioDisplayUrl } from "../hooks/use-studio-display-url"
import type { StudioItem } from "../model/types"
import {
  getLiveDemo,
  getRecordByItem,
  getStudioSourceFiles,
} from "../model/unified-registry.adapter"
import { StudioCanvasBackground } from "./studio-canvas-background"
import { StudioPropsCustomizer } from "./studio-props-customizer"

interface StudioCanvasProps {
  item: StudioItem
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
      <p className="text-[11px] font-semibold text-muted-foreground">
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
 * Stage frame: renders live demo, hook source, or block iframe over CAD dot-grid.
 */
export function StudioCanvas({ item }: StudioCanvasProps) {
  const {
    activeVariantId,
    customizerValues,
    setCustomizerValue,
    resetCustomizer,
  } = useStudioLayout()
  const displayUrl = useStudioDisplayUrl()

  const isBlock = item.collection === "blocks"

  return (
    <StudioCanvasBackground
      showArcBands={!isBlock}
      showGrid={!isBlock}
      className="flex h-full min-h-0 w-full flex-1 flex-col"
    >
      <div className="hidden h-11 shrink-0 items-center justify-between gap-3 border-b border-border/70 bg-background/80 px-3 backdrop-blur-xs max-md:flex">
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-rose-400/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <div className="flex h-7 w-full max-w-md min-w-0 items-center justify-center gap-1.5 rounded-md border border-border/60 bg-muted/80 px-2.5 font-mono text-[10px] text-muted-foreground backdrop-blur-xs">
          <Globe className="size-3 shrink-0" aria-hidden="true" />
          <span className="truncate" title={displayUrl}>
            {displayUrl}
          </span>
        </div>
      </div>
      {isBlock ? (
        <div className="relative h-full min-h-0 w-full flex-1">
          <iframe
            key={item.slug}
            src={`/blocks-preview/${item.slug}`}
            title={`${item.title} preview`}
            className="absolute inset-0 h-full w-full border-0 bg-background"
          />
        </div>
      ) : item.renderMode === "hook-code" ? (
        <div className="flex h-full min-h-0 flex-1 items-start justify-center overflow-y-auto">
          <HookCodeStage item={item} />
        </div>
      ) : (
        <div className="flex h-full min-h-0 flex-1 items-center justify-center overflow-auto p-4 sm:p-8">
          <LiveStage item={item} variantId={activeVariantId} />
        </div>
      )}

      {item.controls && item.controls.length > 0 ? (
        <StudioPropsCustomizer
          controls={item.controls}
          values={customizerValues}
          onChange={setCustomizerValue}
          onReset={resetCustomizer}
        />
      ) : null}
    </StudioCanvasBackground>
  )
}
