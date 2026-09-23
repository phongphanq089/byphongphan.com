import { ArrowUpRight, Cpu, Sparkles, TrendingUp } from "lucide-react"

import { cn } from "@/shared/lib"
import { Badge } from "@/shared/ui/core/badge"
import { Button } from "@/shared/ui/core/button"

export interface CardGradientGlassFeatureProps {
  category?: string
  title?: string
  metric?: string
  metricLabel?: string
  description?: string
  tags?: string[]
  className?: string
}

export function CardGradientGlassFeature({
  category = "Neural Engine",
  title = "Distributed Tensor Acceleration",
  metric = "3.8x",
  metricLabel = "faster cold-start execution latency",
  description = "Hardware-optimized pipeline combining speculative decoding and quantized weights for ultra-low latency edge inferencing.",
  tags = ["FP8 Quantization", "CUDA 12", "Sub-10ms"],
  className,
}: CardGradientGlassFeatureProps) {
  return (
    <div
      className={cn(
        "relative isolate w-full max-w-md overflow-hidden rounded-2xl p-1.5 select-none",
        "bg-white/5 dark:bg-black/80",
        "bg-gradient-to-br from-black/5 to-black/[0.02] dark:from-white/10 dark:to-white/[0.02]",
        "backdrop-blur-xl backdrop-saturate-[180%]",
        "border border-black/10 dark:border-white/10",
        "shadow-[0_12px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_36px_rgba(0,0,0,0.4)]",
        className
      )}
    >
      <div
        className={cn(
          "relative flex h-full flex-col justify-between rounded-xl p-6",
          "bg-gradient-to-br from-black/[0.03] to-transparent dark:from-white/[0.06] dark:to-transparent",
          "backdrop-blur-md",
          "border border-black/[0.05] dark:border-white/[0.08]",
          "text-foreground",
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-xl",
          "before:bg-gradient-to-br before:from-emerald-500/[0.05] before:to-transparent before:opacity-0 before:transition-opacity",
          "hover:before:opacity-100"
        )}
      >
        <div>
          {/* Header Tag & Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-foreground/[0.04]">
                <Cpu className="size-4 text-emerald-400" />
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {category}
              </span>
            </div>

            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-950/40 text-emerald-400"
            >
              <Sparkles className="mr-1 size-3 text-emerald-400" />
              Active
            </Badge>
          </div>

          {/* Metric Callout */}
          <div className="mt-5 flex items-baseline gap-2.5">
            <span className="text-4xl font-bold tracking-tight text-foreground">
              {metric}
            </span>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
              <TrendingUp className="size-3.5" />
              <span>{metricLabel}</span>
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>

          {/* Feature Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border/40 bg-foreground/[0.02] px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 border-t border-border/40 pt-4">
          <Button
            variant="outline"
            className="w-full justify-between border-border/60 bg-foreground/[0.02] hover:bg-foreground/[0.06]"
          >
            <span>Explore Architecture</span>
            <ArrowUpRight className="size-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CardGradientGlassFeature
