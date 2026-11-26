/* eslint-disable react-hooks/static-components */
import { SpinnerGapIcon } from "@phosphor-icons/react"
import { Suspense } from "react"

import { CodeBlock } from "@/registry/ui/code-block"
import { cn } from "@/shared/lib/utils"

import type { StudioItem } from "../model/types"
import {
  getLiveDemo,
  getRecordByItem,
  getStudioSourceFiles,
  resolveCanvasLayout,
} from "../model/unified-registry.adapter"
import { useStudioStore } from "../store/studio-store"
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
            <SpinnerGapIcon
              size={24}
              className="animate-spin text-muted-foreground"
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
function HookCodeStage({
  item,
  hasVariants,
}: {
  item: StudioItem
  hasVariants: boolean
}) {
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
    <div
      className={cn(
        "flex h-full w-full max-w-2xl flex-col gap-3 overflow-y-auto px-4 pt-14 sm:px-6",
        hasVariants ? "pb-20" : "pb-8"
      )}
    >
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
 * Stage frame: renders live demo, hook source, or block iframe over a calm
 * studio surface, with safe clearances for the top-right action pill and
 * optional bottom variant pill.
 */
export function StudioCanvas({ item }: StudioCanvasProps) {
  const storedVariantId = useStudioStore((state) => state.activeVariantId)
  const activeVariantId = storedVariantId ?? item.variants?.[0]?.id
  const customizerValues = useStudioStore((state) => state.customizerValues)
  const setCustomizerValue = useStudioStore((state) => state.setCustomizerValue)
  const resetCustomizer = useStudioStore((state) => state.resetCustomizer)

  const isBlock = item.collection === "blocks"
  const isFullBleed = resolveCanvasLayout(item) === "full"
  const hasVariants = (item.variants?.length ?? 0) > 0

  return (
    <StudioCanvasBackground className="flex h-full min-h-0 w-full flex-1 flex-col">
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
          <HookCodeStage item={item} hasVariants={hasVariants} />
        </div>
      ) : isFullBleed ? (
        <div className="relative h-full min-h-0 w-full flex-1 overflow-hidden [&>*]:size-full [&>*]:rounded-none [&>*]:border-0 [&>*]:shadow-none">
          <LiveStage item={item} variantId={activeVariantId} />
        </div>
      ) : (
        <div
          className={cn(
            "flex h-full min-h-0 flex-1 items-center justify-center overflow-auto px-4 pt-14 sm:px-8",
            hasVariants ? "pb-18" : "pb-8"
          )}
        >
          <LiveStage item={item} variantId={activeVariantId} />
        </div>
      )}

      {item.controls && item.controls.length > 0 ? (
        <StudioPropsCustomizer
          controls={item.controls}
          values={customizerValues}
          onChange={setCustomizerValue}
          onReset={resetCustomizer}
          className={hasVariants ? "bottom-16" : "bottom-3.5"}
        />
      ) : null}
    </StudioCanvasBackground>
  )
}
