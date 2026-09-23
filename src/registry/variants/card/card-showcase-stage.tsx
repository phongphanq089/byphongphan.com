import { Sparkles } from "lucide-react"
import { type ReactNode } from "react"

import { cn } from "@/shared/lib"
import { Badge } from "@/shared/ui/core/badge"
import { Button } from "@/shared/ui/core/button"

export interface CardShowcaseStageProps {
  title?: string
  description?: string
  tag?: string
  className?: string
  children?: ReactNode
}

export function CardShowcaseStage({
  title = "Interactive Control Group",
  description = "Preview container with segregated header, category tag, and recessed canvas stage.",
  tag = "System",
  className,
}: CardShowcaseStageProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-lg flex-col rounded-xl border border-border bg-card p-6 shadow-sm select-none",
        className
      )}
    >
      {/* Header with Title, Description, and Category Tag */}
      <div className="mb-4 flex items-start justify-between gap-4 border-b border-border/60 pb-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {tag && (
          <Badge
            variant="outline"
            className="border-primary/30 font-mono text-[10px] text-primary uppercase"
          >
            {tag}
          </Badge>
        )}
      </div>

      {/* Recessed Preview Canvas Stage */}
      <div className="relative flex min-h-[140px] flex-1 items-center justify-center overflow-hidden rounded-lg border border-border/40 bg-background/50 p-6">
        {/* Subtle grid background texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundSize: "20px 20px",
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
          }}
        />

        {/* Content on stage */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
          <Button variant="default" size="sm">
            <Sparkles className="size-3.5" />
            Primary
          </Button>
          <Button variant="secondary" size="sm">
            Secondary
          </Button>
          <Button variant="outline" size="sm">
            Outline
          </Button>
        </div>
      </div>

      {/* Footer Info Row */}
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-mono text-[11px]">
          Stage: 140px recessed canvas
        </span>
        <Badge variant="secondary" className="text-[10px]">
          Live preview
        </Badge>
      </div>
    </div>
  )
}

export default CardShowcaseStage
