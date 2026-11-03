import {
  Activity,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  Layers,
  RotateCcw,
  ShieldCheck,
  ToggleLeft,
  X,
} from "lucide-react"
import { useState } from "react"

import { useDisclosure } from "@/registry/hooks/use-disclosure"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { cn } from "@/shared/lib/utils"

interface EventLog {
  id: number
  text: string
  timestamp: string
}

export function UseDisclosureDemo() {
  const [logs, setLogs] = useState<EventLog[]>([])

  const addLog = (text: string) => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    setLogs((prev) => [
      { id: Date.now(), text, timestamp: time },
      ...prev.slice(0, 4),
    ])
  }

  const [isOpen, handlers] = useDisclosure(false, {
    onOpen: () => addLog("onOpen callback executed"),
    onClose: () => addLog("onClose callback executed"),
  })

  const handleOpenClick = () => {
    addLog("handlers.open() triggered")
    handlers.open()
  }

  const handleToggleClick = () => {
    addLog("handlers.toggle() triggered")
    handlers.toggle()
  }

  const handleCloseClick = () => {
    addLog("handlers.close() triggered")
    handlers.close()
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-5 p-3 sm:p-5">
      {/* State Overview Header */}
      <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card/60 p-4 shadow-xs backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-xl border transition-all duration-300",
              isOpen
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                : "border-border/60 bg-muted/40 text-muted-foreground"
            )}
          >
            {isOpen ? (
              <Eye className="size-5" />
            ) : (
              <EyeOff className="size-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                Dialog Disclosure
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "font-mono text-[10px] uppercase transition-colors",
                  isOpen
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                    : "border-border/60 text-muted-foreground"
                )}
              >
                {isOpen ? "Open" : "Closed"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Manages boolean visibility state with memoized action handlers
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="font-mono text-xs font-semibold whitespace-nowrap text-primary">
            isOpen = {String(isOpen)}
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Hook Action Handlers
        </span>
        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleOpenClick}
            disabled={isOpen}
            className="flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="size-3.5" />
            <span>open()</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleToggleClick}
            className="flex items-center justify-center gap-1.5"
          >
            <ToggleLeft className="size-3.5" />
            <span>toggle()</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCloseClick}
            disabled={!isOpen}
            className="flex items-center justify-center gap-1.5"
          >
            <X className="size-3.5" />
            <span>close()</span>
          </Button>
        </div>
      </div>

      {/* Controlled Dialog Component */}
      <Dialog open={isOpen} onOpenChange={handlers.set}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <div className="flex flex-col text-left">
                <DialogTitle>Controlled Dialog Component</DialogTitle>
                <DialogDescription className="text-xs">
                  Connected to useDisclosure state and handlers.set
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-2 text-sm">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Current State:</span>
                <span className="font-mono font-semibold text-emerald-500">
                  isOpen: true
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Change Handler:</span>
                <code className="font-mono text-xs text-primary">
                  onOpenChange=&#123;handlers.set&#125;
                </code>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              This dialog can be closed via the action buttons below, pressing
              the{" "}
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                ESC
              </kbd>{" "}
              key, or clicking outside the backdrop overlay.
            </p>
          </div>

          <DialogFooter showCloseButton={false}>
            <Button variant="outline" size="sm" onClick={handlers.close}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                addLog("Confirmed deployment")
                handlers.close()
              }}
            >
              <CheckCircle2 className="mr-1 size-3.5" />
              Confirm Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Callbacks Activity Log */}
      <div className="flex flex-col gap-2 rounded-xl border border-border/70 bg-card/40 p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Activity className="size-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">
              Lifecycle Event Log
            </span>
          </div>
          {logs.length > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setLogs([])}
              className="h-6 gap-1 px-1.5 text-[10px] text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3" />
              Clear
            </Button>
          )}
        </div>

        {logs.length === 0 ? (
          <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/10 text-xs text-muted-foreground">
            No events recorded yet. Click open() or toggle() above.
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-md border border-border/40 bg-muted/20 px-2.5 py-1.5 font-mono text-xs"
              >
                <span className="text-foreground">{log.text}</span>
                <span className="text-[10px] text-muted-foreground">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Integration Reference */}
      <div className="flex items-center justify-between border-t border-border/70 pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Layers className="size-3.5 text-muted-foreground/80" />
          <span>Available Handlers:</span>
        </div>
        <div className="flex gap-1.5 font-mono text-[11px] text-foreground">
          <span className="rounded bg-muted/60 px-1.5 py-0.5">open</span>
          <span className="rounded bg-muted/60 px-1.5 py-0.5">close</span>
          <span className="rounded bg-muted/60 px-1.5 py-0.5">toggle</span>
          <span className="rounded bg-muted/60 px-1.5 py-0.5">set</span>
        </div>
      </div>
    </div>
  )
}

export default UseDisclosureDemo
