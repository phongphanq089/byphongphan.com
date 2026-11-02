import { Sparkles, Zap } from "lucide-react"
import { useState } from "react"

import { BorderGlow } from "@/registry/animated/border-glow"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"

export function BorderGlowDemo() {
  const [animated, setAnimated] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <BorderGlow
        animated={animated}
        borderRadius={20}
        edgeSensitivity={25}
        glowRadius={40}
        glowIntensity={1.0}
        className="w-full max-w-sm p-6"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-lg border border-black/10 bg-muted/50 dark:border-white/10">
              <Zap className="size-5 text-purple-400" />
            </div>
            <Badge variant="outline" className="text-[10px]">
              Mesh Beam
            </Badge>
          </div>

          <div className="flex flex-col gap-1.5">
            <h4 className="text-base font-semibold tracking-tight text-foreground">
              Border Glow
            </h4>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Dynamic mesh gradient edge illumination calculating real-time
              cursor proximity, entry angle, and outer atmospheric aura.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="font-mono text-[10px] text-muted-foreground">
              Zero Re-render
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setAnimated(false)
                setTimeout(() => setAnimated(true), 50)
              }}
              className="h-7 gap-1 text-xs"
            >
              <Sparkles className="size-3" />
              Trigger Sweep
            </Button>
          </div>
        </div>
      </BorderGlow>
    </div>
  )
}
