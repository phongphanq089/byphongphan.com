import { Activity, Wifi, WifiOff } from "lucide-react"

import { useNetwork } from "@/registry/hooks/use-network"
import { cn } from "@/shared/lib/utils"

export function UseNetworkDemo() {
  const network = useNetwork()

  const connectionDetails = [
    {
      label: "Connection type",
      value: network.effectiveType ?? network.type ?? "Unavailable",
    },
    {
      label: "Downlink",
      value:
        network.downlink !== undefined
          ? `${network.downlink} Mbps`
          : "Unavailable",
    },
    {
      label: "Round-trip time",
      value: network.rtt !== undefined ? `${network.rtt} ms` : "Unavailable",
    },
    {
      label: "Data saver",
      value:
        network.saveData !== undefined
          ? network.saveData
            ? "Enabled"
            : "Disabled"
          : "Unavailable",
    },
  ]

  return (
    <div className="w-full min-w-0 p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
        {/* Network status */}
        <div
          className={cn(
            "flex items-center justify-between rounded-xl border p-4 transition-colors",
            network.online
              ? "border-primary/30 bg-primary/[0.04]"
              : "border-border bg-muted/10"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-lg border",
                network.online
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-muted text-muted-foreground"
              )}
            >
              {network.online ? (
                <Wifi className="size-5" />
              ) : (
                <WifiOff className="size-5" />
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                {network.online ? "You're online" : "You're offline"}
              </p>
              <p className="text-xs text-muted-foreground">
                {network.online
                  ? "Network connection is available"
                  : "Check your internet connection"}
              </p>
            </div>
          </div>

          <span
            className={cn(
              "size-2 rounded-full",
              network.online ? "bg-primary" : "bg-muted-foreground/40"
            )}
          />
        </div>

        {/* Connection details */}
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="flex items-center gap-2 border-b border-border bg-muted/20 px-3.5 py-2.5">
            <Activity className="size-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">
              Connection details
            </span>
          </div>

          <div className="divide-y divide-border/60 px-3.5">
            {connectionDetails.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 py-3"
              >
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>

                <span
                  className={cn(
                    "text-right font-mono text-xs font-medium",
                    item.value === "Unavailable"
                      ? "text-muted-foreground/60"
                      : "text-foreground"
                  )}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {network.since && (
          <p className="px-1 text-[10px] text-muted-foreground">
            Last updated{" "}
            {network.since.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  )
}

export default UseNetworkDemo
