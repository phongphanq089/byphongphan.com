import { Separator } from "@/registry/ui/separator"

export function SeparatorDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-border/80 bg-background/60 p-5 shadow-xs">
      <div className="space-y-1">
        <h4 className="text-sm leading-none font-semibold text-foreground">
          Radix UI Primitives
        </h4>
        <p className="text-xs text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-1" />
      <div className="flex h-5 items-center space-x-4 text-xs">
        <div className="font-medium text-foreground">Blog</div>
        <Separator orientation="vertical" />
        <div className="font-medium text-foreground">Docs</div>
        <Separator orientation="vertical" />
        <div className="font-medium text-foreground">Source</div>
      </div>
    </div>
  )
}
