import { ArrowUpRight, Sparkles } from "lucide-react"

import { SpotlightCard } from "@/registry/animated/spotlight-card"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"

export function SpotlightCardDemo() {
  return (
    <div className="flex w-full max-w-sm items-center justify-center p-4">
      <SpotlightCard enableTilt spotlightSize={300} className="w-full p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-lg border border-black/10 bg-muted/50 dark:border-white/10">
              <Sparkles className="size-5 text-primary" />
            </div>
            <Badge variant="outline" className="text-[10px]">
              Hover & Tilt
            </Badge>
          </div>

          <div className="flex flex-col gap-1.5">
            <h4 className="text-base font-semibold tracking-tight text-foreground">
              Spotlight Card
            </h4>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Interactive surface with radial cursor illumination, dynamic 1px
              masked border glow, and smooth 3D tilt perspective.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="font-mono text-[10px] text-muted-foreground">
              Zero Re-render
            </span>
            <Button size="sm" variant="outline" className="h-7 gap-1 text-xs">
              Explore <ArrowUpRight className="size-3" />
            </Button>
          </div>
        </div>
      </SpotlightCard>
    </div>
  )
}
