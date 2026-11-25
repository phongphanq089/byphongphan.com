import { Badge, BadgeDot } from "@/registry/ui/badge"

export function BadgeStatus() {
  return (
    <div className="flex w-full max-w-full flex-col items-center justify-center gap-6 p-6 sm:p-10">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="font-mono text-xs text-muted-foreground uppercase">
          Dynamic Status & Health Indicators
        </span>
        <p className="text-xs text-muted-foreground">
          Translucent status badges with reactive color-matching micro dots.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Badge variant="success">
          <BadgeDot pulse />
          Operational (99.98%)
        </Badge>
        <Badge variant="info">
          <BadgeDot pulse />
          Syncing Index
        </Badge>
        <Badge variant="warning">
          <BadgeDot />
          Rate Limited
        </Badge>
        <Badge variant="destructive">
          <BadgeDot pulse />
          Service Outage
        </Badge>
        <Badge variant="subtle">
          <BadgeDot />
          Offline
        </Badge>
      </div>
    </div>
  )
}

export default BadgeStatus
