import { ScrollArea } from "@/registry/ui/scroll-area"

const LOGS = Array.from({ length: 40 }).map((_, i) => ({
  id: i + 1,
  time: `10:4${Math.floor(i / 10)}:${(i % 10) * 6}`,
  level: i % 7 === 0 ? "WARN" : i % 11 === 0 ? "ERROR" : "INFO",
  message:
    i % 7 === 0
      ? "Memory threshold warning triggered on cluster-01"
      : i % 11 === 0
        ? "Connection dropped, retrying in 300ms..."
        : `Request processed successfully [req_${i * 138}]`,
}))

export function ScrollAreaMinimal() {
  return (
    <ScrollArea
      className="h-64 w-full max-w-md rounded-md border border-border bg-neutral-950 font-mono text-xs"
      variant="minimal"
      size="sm"
      type="hover"
    >
      <div className="space-y-1.5 p-3">
        {LOGS.map((log) => (
          <div
            key={log.id}
            className="flex items-center gap-2 text-neutral-300"
          >
            <span className="text-neutral-500">{log.time}</span>
            <span
              className={
                log.level === "ERROR"
                  ? "font-semibold text-red-400"
                  : log.level === "WARN"
                    ? "font-semibold text-amber-400"
                    : "text-emerald-400"
              }
            >
              [{log.level}]
            </span>
            <span className="truncate">{log.message}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

export default ScrollAreaMinimal
