import { Check, RotateCw } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { useIsFirstRender } from "@/registry/hooks/use-is-first-render"
import { cn } from "cn"

export function UseIsFirstRenderDemo() {
  const isFirstRender = useIsFirstRender()
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Render status
        </span>

        <Badge
          variant={isFirstRender ? "default" : "secondary"}
          className="font-mono"
        >
          {isFirstRender ? "First render" : "Re-render"}
        </Badge>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-muted/40 p-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">isFirstRender</p>
          <p className="font-mono text-2xl font-semibold tracking-tight">
            {String(isFirstRender)}
          </p>
        </div>

        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-full",
            isFirstRender
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isFirstRender ? (
            <Check className="size-5" />
          ) : (
            <RotateCw className="size-5" />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          Render count:{" "}
          <span className="font-mono font-medium text-foreground">
            {count + 1}
          </span>
        </div>

        <Button size="sm" onClick={() => setCount((prev) => prev + 1)}>
          <RotateCw className="mr-2 size-3.5" />
          Trigger re-render
        </Button>
      </div>
    </div>
  )
}
