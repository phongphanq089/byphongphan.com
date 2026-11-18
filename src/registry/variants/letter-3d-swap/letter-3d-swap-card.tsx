import { ArrowUpRight } from "lucide-react"

import { Letter3DSwap } from "@/registry/animated/letter-3d-swap"

export default function Letter3DSwapCard() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-border/80 bg-background/80 p-6 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-primary">
          EXPERIMENT 01
        </span>
        <ArrowUpRight className="size-4 text-muted-foreground" />
      </div>

      <div className="flex flex-col gap-1 py-2">
        <Letter3DSwap
          as="h3"
          className="text-2xl font-bold text-foreground"
          secondFaceClassName="text-primary font-bold"
          rotateDirection="right"
          staggerDuration={0.03}
        >
          INTERACTIVE CUBES
        </Letter3DSwap>
        <p className="text-xs text-muted-foreground">
          Letters morph smoothly on card interactions without clipping bounds.
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-border/60 pt-3">
        <span className="font-mono text-[10px] text-muted-foreground">
          ROTATION
        </span>
        <Letter3DSwap
          as="span"
          className="font-mono text-[11px] font-bold text-primary"
          secondFaceClassName="text-foreground font-bold"
          rotateDirection="top"
        >
          EXPLORE →
        </Letter3DSwap>
      </div>
    </div>
  )
}
