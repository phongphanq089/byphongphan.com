import { Activity, Wifi } from "lucide-react"

export function NetworkSchematic() {
  return (
    <div className="relative flex h-32 w-full max-w-[240px] items-center justify-center overflow-hidden rounded-xl select-none">
      {/* Connection lines */}
      <svg
        viewBox="0 0 240 128"
        className="absolute inset-0 size-full"
        fill="none"
      >
        <path
          d="M120 52 V32 M120 76 V96 M92 64 H64 M148 64 H176"
          stroke="var(--pp-primary)"
          strokeOpacity="0.2"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <circle cx="120" cy="32" r="2" fill="var(--pp-primary)" opacity="0.4" />
        <circle cx="120" cy="96" r="2" fill="var(--pp-primary)" opacity="0.4" />
        <circle cx="64" cy="64" r="2" fill="var(--pp-primary)" opacity="0.4" />
        <circle cx="176" cy="64" r="2" fill="var(--pp-primary)" opacity="0.4" />
      </svg>

      {/* Network node */}
      <div className="relative flex size-16 items-center justify-center rounded-xl border border-primary/30 bg-primary/[0.06]">
        <Wifi className="size-7 text-primary" strokeWidth={1.6} />

        {/* Online indicator */}
        <div className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full border border-background bg-primary">
          <div className="size-1.5 rounded-full bg-background" />
        </div>
      </div>

      {/* Connection status */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-md border border-primary/20 bg-background px-2 py-1">
        <span className="size-1.5 rounded-full bg-primary" />
        <span className="font-mono text-[9px] text-primary">ONLINE</span>
      </div>

      {/* Network metrics */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1">
        <Activity className="size-3 text-primary" />
        <span className="font-mono text-[9px] text-muted-foreground">
          4G · 24 Mbps
        </span>
      </div>
    </div>
  )
}

export default NetworkSchematic
