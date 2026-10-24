import { ScrollArea } from "@/registry/ui/scroll-area"

const NOTIFICATIONS = [
  {
    id: 1,
    title: "Deployment Successful",
    desc: "Production build deployed to Vercel edge.",
    time: "2m ago",
  },
  {
    id: 2,
    title: "New Subscriber",
    desc: "Alex subscribed to Developer Pro membership.",
    time: "15m ago",
  },
  {
    id: 3,
    title: "Database Backup Completed",
    desc: "Automated snapshot captured 4.2GB of data.",
    time: "1h ago",
  },
  {
    id: 4,
    title: "Security Patch Applied",
    desc: "Dependencies upgraded with 0 vulnerabilities.",
    time: "3h ago",
  },
  {
    id: 5,
    title: "Pull Request Merged",
    desc: "Feature/scroll-area-variants merged to main.",
    time: "5h ago",
  },
  {
    id: 6,
    title: "Domain SSL Renewed",
    desc: "Certificate auto-renewed for byphongphan.com.",
    time: "1d ago",
  },
]

export function ScrollAreaFloating() {
  return (
    <ScrollArea
      className="h-64 w-full max-w-sm rounded-xl border border-border bg-card p-3 shadow-md"
      variant="floating"
      size="lg"
      type="hover"
    >
      <div className="space-y-2 pr-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-semibold">Activity Feed</span>
          <span className="rounded bg-pp-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-pp-primary">
            Live
          </span>
        </div>
        {NOTIFICATIONS.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-border/40 bg-muted/40 p-2.5 text-xs transition-colors hover:bg-muted/70"
          >
            <div className="flex items-center justify-between font-medium">
              <span>{item.title}</span>
              <span className="text-[10px] text-muted-foreground">
                {item.time}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

export default ScrollAreaFloating
