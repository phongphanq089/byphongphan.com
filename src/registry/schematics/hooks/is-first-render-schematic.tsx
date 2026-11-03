import { ArrowRight, Check, RotateCw } from "lucide-react"

export function IsFirstRenderSchematic() {
  return (
    <div className="relative flex h-32 w-full max-w-[240px] items-center justify-center overflow-hidden rounded-xl select-none">
      <div className="flex items-center gap-2.5">
        <div className="flex w-[76px] flex-col items-center gap-2 rounded-lg border border-primary/25 bg-primary/[0.05] p-2.5">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
            <Check className="size-4 text-primary" />
          </div>

          <span className="font-mono text-[9px] text-primary">true</span>

          <span className="text-[9px] text-muted-foreground">Initial</span>
        </div>

        <ArrowRight className="size-3.5 shrink-0 text-muted-foreground/50" />

        <div className="flex w-[76px] flex-col items-center gap-2 rounded-lg border border-border bg-muted/30 p-2.5">
          <div className="flex size-8 items-center justify-center rounded-md bg-muted">
            <RotateCw className="size-4 text-muted-foreground" />
          </div>

          <span className="font-mono text-[9px] text-muted-foreground">
            false
          </span>

          <span className="text-[9px] text-muted-foreground">Re-render</span>
        </div>
      </div>
    </div>
  )
}

export default IsFirstRenderSchematic
