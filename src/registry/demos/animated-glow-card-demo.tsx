import { Card, CardCanvas } from "@/registry/animated/animated-glow-card"

export function AnimatedGlowCardDemo() {
  return (
    <CardCanvas className="flex w-full items-center justify-center p-4">
      <Card className="w-full max-w-sm" showCrosshairs={true}>
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
              SEC-01 // RADIAL
            </span>
            <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
          </div>
          <h4 className="text-base font-semibold text-foreground">
            Specular Highlight
          </h4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Dynamic cursor-following glow border utilizing mouse tracking CSS
            variables.
          </p>
        </div>
      </Card>
    </CardCanvas>
  )
}
