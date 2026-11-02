import { useToggle } from "@/registry/hooks/use-toggle"
import { cn } from "@/shared/lib/utils"

export function UseToggleDemo() {
  const [value, toggle, { setTrue, setFalse }] = useToggle(false)

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 p-3 sm:p-5">
      {/* State */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-muted-foreground">
          Boolean state
        </span>

        <span className="font-mono text-xs text-muted-foreground">
          {value ? "true" : "false"}
        </span>
      </div>

      {/* Main switch */}
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => toggle()}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/20 p-4 text-left transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
      >
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-sm font-medium text-foreground">
            Toggle state
          </span>
          <span className="text-xs text-muted-foreground">
            Click to switch between true and false
          </span>
        </div>

        <span
          className={cn(
            "relative flex h-6 w-11 shrink-0 items-center rounded-full border p-0.5 transition-colors duration-200",
            value ? "border-primary bg-primary" : "border-border bg-muted"
          )}
        >
          <span
            className={cn(
              "size-5 rounded-full bg-background shadow-sm transition-transform duration-200",
              value ? "translate-x-5" : "translate-x-0"
            )}
          />
        </span>
      </button>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => toggle()}
          className="flex h-9 items-center justify-center rounded-md border border-primary/40 bg-primary/5 px-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
        >
          toggle()
        </button>

        <button
          type="button"
          onClick={setTrue}
          disabled={value}
          className="h-9 rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          setTrue()
        </button>

        <button
          type="button"
          onClick={setFalse}
          disabled={!value}
          className="h-9 rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          setFalse()
        </button>
      </div>

      {/* Current value */}
      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">Current value</span>

        <code className="font-mono text-xs font-medium text-primary">
          {String(value)}
        </code>
      </div>
    </div>
  )
}

export default UseToggleDemo
