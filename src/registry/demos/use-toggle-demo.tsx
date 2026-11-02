import { useToggle } from "@/registry/hooks/use-toggle"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"

export function UseToggleDemo() {
  const [value, toggle, { setTrue, setFalse }] = useToggle(false)

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 p-6">
      <div className="flex w-full items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Boolean State Helper
        </span>
        <Badge
          className={
            value
              ? "border-blue-500/30 bg-blue-500/20 text-blue-400"
              : "border-white/10 bg-white/5 text-muted-foreground"
          }
        >
          Value: {value ? "TRUE" : "FALSE"}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => toggle()} className="h-8 text-xs">
          toggle()
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={setTrue}
          className="h-8 text-xs"
        >
          setTrue()
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={setFalse}
          className="h-8 text-xs"
        >
          setFalse()
        </Button>
      </div>
    </div>
  )
}
