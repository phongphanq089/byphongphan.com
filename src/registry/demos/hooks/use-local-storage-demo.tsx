import { RefreshCw, Database, Bell } from "lucide-react"

import { useLocalStorage } from "@/registry/hooks/use-local-storage"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Switch } from "@/registry/ui/switch"

export function UseLocalStorageDemo() {
  const [notifications, setNotifications, removeNotifications] =
    useLocalStorage<boolean>("demo_notifications_enabled", true)

  return (
    <div className="w-full min-w-0 p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-3 sm:gap-4">
        {/* Header */}
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Database className="size-3.5" />
            </div>
            <span className="text-[11px] font-semibold tracking-wide text-foreground sm:text-xs">
              LocalStorage
            </span>
          </div>

          <Badge
            variant="outline"
            className="h-6 max-w-full gap-1.5 rounded-md px-2 font-mono text-[9px] text-muted-foreground sm:text-[10px]"
          >
            <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
            demo_notifications_enabled
          </Badge>
        </div>

        {/* Settings card */}
        <div className="rounded-xl border border-border/70 bg-card shadow-sm">
          <div className="flex items-center justify-between gap-3 p-3.5 sm:p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Bell className="size-4 text-muted-foreground" />
              </div>

              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-xs font-semibold text-foreground sm:text-sm">
                  Push Notifications
                </span>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground sm:text-xs">
                    Current status
                  </span>

                  <span
                    className={
                      notifications
                        ? "text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
                        : "text-[10px] font-semibold text-muted-foreground"
                    }
                  >
                    {notifications ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>

            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
              aria-label="Toggle push notifications"
            />
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-border/60 bg-muted/20 px-3.5 py-2.5 sm:px-4">
            <span className="text-[10px] leading-relaxed text-muted-foreground sm:text-xs">
              Changes are saved automatically.
            </span>

            <Badge
              variant="outline"
              className="h-5 shrink-0 rounded px-1.5 text-[9px] font-normal text-muted-foreground"
            >
              Persistent
            </Badge>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
          <span className="text-[10px] leading-relaxed text-muted-foreground sm:text-xs">
            Try reloading to test persistence.
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeNotifications()}
            className="h-7 shrink-0 gap-1.5 px-2 text-[10px] text-muted-foreground sm:text-xs"
          >
            <RefreshCw className="size-3" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UseLocalStorageDemo
