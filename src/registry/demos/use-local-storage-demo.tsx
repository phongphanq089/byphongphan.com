import { RefreshCw } from "lucide-react"

import { useLocalStorage } from "@/registry/hooks/use-local-storage"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Switch } from "@/registry/ui/switch"

export function UseLocalStorageDemo() {
  const [notifications, setNotifications, removeNotifications] =
    useLocalStorage<boolean>("demo_notifications_enabled", true)

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 p-6">
      <div className="flex w-full items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          LocalStorage Synchronization
        </span>
        <Badge
          variant="outline"
          className="gap-1.5 border-emerald-500/30 font-mono text-xs text-emerald-400"
        >
          <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          Key: demo_notifications
        </Badge>
      </div>

      <div className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#0B0F17] p-4 shadow-inner">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-semibold text-foreground">
            Push Notifications
          </span>
          <span className="text-[11px] text-muted-foreground">
            Current status: {notifications ? "ENABLED" : "DISABLED"}
          </span>
        </div>
        <Switch
          checked={notifications}
          onCheckedChange={(checked) => setNotifications(checked)}
        />
      </div>

      <div className="flex w-full items-center justify-between">
        <span className="font-mono text-[10px] text-muted-foreground">
          Try reloading the page — value persists
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeNotifications()}
          className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="size-3" />
          Reset
        </Button>
      </div>
    </div>
  )
}
