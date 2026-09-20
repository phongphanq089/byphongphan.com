import { createFileRoute, Link, useRouterState } from "@tanstack/react-router"
import {
  ArrowLeft,
  ArrowRight,
  BookmarkCheck,
  Boxes,
  Compass,
  FileText,
  LayoutDashboard,
  Search,
} from "lucide-react"

import { Badge, Button } from "@/shared/ui"

export const Route = createFileRoute("/admin/$")({
  component: AdminNotFoundPage,
})

const QUICK_LINKS = [
  {
    title: "Overview",
    description: "System stats & activity",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Blog Posts",
    description: "Articles & drafts",
    href: "/admin/posts",
    icon: FileText,
  },
  {
    title: "Resources",
    description: "Curated developer tools",
    href: "/admin/resources",
    icon: BookmarkCheck,
  },
  {
    title: "UI Registry",
    description: "Components & blocks",
    href: "/admin/registry",
    icon: Boxes,
  },
]

function AdminNotFoundPage() {
  const router = useRouterState()
  const invalidPath = router.location.pathname

  return (
    <div className="relative flex min-h-[calc(100vh-10rem)] w-full flex-col items-center justify-center px-4 py-8">
      {/* Ambient Red Glow Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl"
      />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center space-y-6">
        {/* ─── Main Status Card ─── */}
        <div className="w-full rounded-xl border border-border/80 bg-card/60 p-6 text-center shadow-sm backdrop-blur-sm sm:p-8">
          {/* Compass Icon Badge */}
          <div className="relative mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border border-border/80 bg-muted/40 shadow-xs">
            <Compass className="size-6 text-primary" />
            <span className="absolute -top-1 -right-1 flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-center gap-2">
              <Badge
                variant="outline"
                className="rounded-md border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
              >
                ERR_ROUTE_404
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Page Not Found
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              The requested admin resource or route does not exist.
            </p>
          </div>

          {/* Path Inspector Bar */}
          <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/40 px-3.5 py-2 text-left text-xs">
            <div className="flex min-w-0 items-center gap-2">
              <span className="text-[11px] tracking-wider text-muted-foreground uppercase">
                Path
              </span>
              <span className="truncate font-medium text-foreground">
                {invalidPath}
              </span>
            </div>
            <Badge
              variant="outline"
              className="shrink-0 rounded-md border-border/80 bg-background/60 px-1.5 py-0 text-[10px] text-muted-foreground"
            >
              Unresolved
            </Badge>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="sm"
              className="h-9 gap-2 rounded-lg px-4 text-xs font-medium shadow-xs"
            >
              <Link to="/admin">
                <LayoutDashboard className="size-3.5" />
                <span>Back to Dashboard</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
              className="h-9 gap-2 rounded-lg border-border/80 bg-background/50 px-4 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span>Previous Page</span>
            </Button>
          </div>
        </div>

        {/* ─── Suggested Destinations Section ─── */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Quick Destinations
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Search className="size-3" />
              <span>Navigation</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group flex items-center justify-between rounded-xl border border-border/70 bg-card/40 p-3.5 transition-all hover:border-primary/40 hover:bg-muted/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-foreground transition-colors group-hover:text-primary">
                        {link.title}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {link.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="ml-2 size-3.5 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* ─── Command Palette Hint ─── */}
        <p className="text-xs text-muted-foreground">
          Tip: Press{" "}
          <kbd className="rounded-md border border-border/80 bg-muted/60 px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
            Ctrl + K
          </kbd>{" "}
          anywhere to open the command palette
        </p>
      </div>
    </div>
  )
}
