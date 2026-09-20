import { Code2 } from "lucide-react"
import { useState } from "react"

import { cn } from "@/shared/lib"
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/core"

import type { ComponentVariant } from "../types"
import { VariantModal } from "./variant-modal"

interface VariantsGridProps {
  variants: ComponentVariant[]
  componentSlug: string
  className?: string
}

export function VariantsGrid({
  variants,
  componentSlug,
  className,
}: VariantsGridProps) {
  const [selectedVariant, setSelectedVariant] =
    useState<ComponentVariant | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleOpenCode = (variant: ComponentVariant) => {
    setSelectedVariant(variant)
    setModalOpen(true)
  }

  if (!variants || variants.length === 0) return null

  return (
    <div className={cn("my-6 flex w-full flex-col gap-4", className)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {variants.map((variant) => {
          const VariantComp = variant.component
          return (
            <div
              key={variant.id}
              className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card/60 p-5 shadow-xs transition-all hover:border-foreground/20 hover:shadow-md"
            >
              {/* Header: Title and View Code Action */}
              <div className="flex items-start justify-between gap-2 pb-6">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-foreground">
                    {variant.title}
                  </span>
                  {variant.description && (
                    <span className="text-[11px] text-muted-foreground">
                      {variant.description}
                    </span>
                  )}
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleOpenCode(variant)}
                      className="size-7 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground active:scale-95"
                    >
                      <Code2 className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <span className="text-[11px]">View code</span>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Center Stage: Live Component Preview */}
              <div className="flex min-h-[90px] w-full items-center justify-center py-2">
                <div className="w-full">
                  <VariantComp />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Code Inspection Modal */}
      <VariantModal
        variant={selectedVariant}
        componentSlug={componentSlug}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  )
}
