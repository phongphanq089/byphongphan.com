import { Database, Plus, RotateCcw, Sparkles, Trash2, X } from "lucide-react"
import { useState } from "react"

import { useMap } from "@/registry/hooks/use-map"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Input } from "@/registry/ui/input"

const INITIAL_ENTRIES: [string, string][] = [
  ["theme", "dark"],
  ["language", "en-US"],
  ["role", "administrator"],
  ["notifications", "enabled"],
]

export function UseMapDemo() {
  const map = useMap<string, string>(INITIAL_ENTRIES)
  const [keyInput, setKeyInput] = useState("")
  const [valInput, setValInput] = useState("")

  const handleAdd = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!keyInput.trim()) return
    map.set(keyInput.trim(), valInput.trim())
    setKeyInput("")
    setValInput("")
  }

  const entries = Array.from(map.entries())

  return (
    <div className="w-full min-w-0 p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        {/* Header toolbar */}
        <div className="flex flex-col gap-2.5 border-b border-border/40 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Database className="size-4 text-primary" />
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Reactive Map Manager
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              size: {map.size}
            </Badge>

            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => map.reset()}
              title="Reset to initial entries"
            >
              <RotateCcw className="size-3" />
              Reset
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => map.clear()}
              disabled={map.size === 0}
              title="Remove all entries"
            >
              <X className="size-3" />
              Clear
            </Button>
          </div>
        </div>

        {/* Set/Add form */}
        <form
          onSubmit={handleAdd}
          className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card/60 p-3 shadow-xs sm:flex-row"
        >
          <div className="w-full flex-1 sm:w-auto">
            <Input
              placeholder="Key (e.g. 'status')"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="h-8 font-mono text-xs"
            />
          </div>

          <div className="w-full flex-1 sm:w-auto">
            <Input
              placeholder="Value (e.g. 'online')"
              value={valInput}
              onChange={(e) => setValInput(e.target.value)}
              className="h-8 text-xs"
            />
          </div>

          <Button
            type="submit"
            size="sm"
            className="h-8 w-full shrink-0 gap-1 text-xs sm:w-auto"
            disabled={!keyInput.trim()}
          >
            <Plus className="size-3.5" />
            Set Entry
          </Button>
        </form>

        {/* Map Entries List */}
        <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-border/40 px-1 pb-1 text-[11px] font-medium text-muted-foreground">
            <span>Key</span>
            <span>Value</span>
          </div>

          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-xs text-muted-foreground">
              <Database className="mb-1.5 size-6 text-muted-foreground/40" />
              <span>Map is currently empty</span>
              <button
                type="button"
                onClick={() => map.reset()}
                className="mt-2 text-[11px] text-primary hover:underline"
              >
                Restore initial entries
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {entries.map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-md px-1 py-2 text-xs transition-colors hover:bg-muted/20"
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="font-mono text-[11px] font-semibold text-primary"
                    >
                      {key}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="max-w-44 truncate font-mono text-xs text-foreground">
                      {val}
                    </span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-muted-foreground hover:text-destructive"
                      onClick={() => map.delete(key)}
                      aria-label={`Delete ${key}`}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
          <span>Quick actions:</span>
          <button
            type="button"
            onClick={() =>
              map.set("visits", String((Number(map.get("visits")) || 0) + 1))
            }
            className="rounded border border-border/60 bg-muted/30 px-2 py-0.5 text-foreground transition-colors hover:bg-muted"
          >
            +1 visits counter
          </button>
          <button
            type="button"
            onClick={() =>
              map.set("lastUpdated", new Date().toLocaleTimeString())
            }
            className="rounded border border-border/60 bg-muted/30 px-2 py-0.5 text-foreground transition-colors hover:bg-muted"
          >
            Update timestamp
          </button>
        </div>
      </div>
    </div>
  )
}

export default UseMapDemo
