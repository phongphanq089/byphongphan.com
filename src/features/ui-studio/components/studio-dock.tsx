import { DotsSixIcon } from "@phosphor-icons/react"
import { play } from "cuelume"
import { useMemo } from "react"

import {
  GlassSelectContent,
  GlassSelectItem,
  GlassSelectRoot,
  GlassSelectTrigger,
  GlassSelectValue,
} from "@/registry/animated/glass-select"

import type { StudioItem } from "../model/types"
import { useStudioStore } from "../store/studio-store"

interface StudioDockProps {
  item: StudioItem | null
}

/**
 * Floating variant selector at the bottom-center of the preview stage.
 * Uses Liquid Glass `GlassSelect` opening upward over the preview canvas.
 */
export function StudioVariantBar({ item }: StudioDockProps) {
  const storedVariantId = useStudioStore((state) => state.activeVariantId)
  const setActiveVariantId = useStudioStore((state) => state.setActiveVariantId)

  const variants = useMemo(() => item?.variants ?? [], [item?.variants])
  const selectItems = useMemo(
    () => variants.map((v) => ({ value: v.id, label: v.title })),
    [variants]
  )

  if (!item || variants.length === 0) return null

  const activeVariant =
    variants.find((variant) => variant.id === storedVariantId) ??
    variants[0] ??
    null

  return (
    <div className="pointer-events-none absolute bottom-3.5 left-1/2 z-20 flex w-full max-w-[calc(100%-1.5rem)] -translate-x-1/2 justify-center sm:bottom-4">
      <div className="pointer-events-auto max-w-full">
        <GlassSelectRoot
          value={activeVariant?.id ?? null}
          items={selectItems}
          matchWidth={false}
          opening="stretch"
          onValueChange={(nextId) => {
            if (!nextId) return
            play("tap", { emphasis: "subtle" })
            setActiveVariantId(nextId)
          }}
        >
          <GlassSelectTrigger
            size="sm"
            aria-label="Component variants"
            className="h-9 w-auto max-w-full min-w-36 gap-2 pr-3 pl-3 text-xs"
          >
            <DotsSixIcon
              size={15}
              aria-hidden="true"
              className="shrink-0 opacity-50"
            />
            <GlassSelectValue placeholder="Select variant" />
          </GlassSelectTrigger>

          <GlassSelectContent
            side="top"
            sideOffset={12}
            className="max-w-[min(18rem,calc(100vw-2rem))] min-w-48 text-sm"
          >
            {variants.map((variant, index) => (
              <GlassSelectItem
                key={variant.id}
                value={variant.id}
                index={index}
                className="h-9 text-xs sm:text-sm"
              >
                {variant.title}
              </GlassSelectItem>
            ))}
          </GlassSelectContent>
        </GlassSelectRoot>
      </div>
    </div>
  )
}

export const StudioDock = StudioVariantBar
