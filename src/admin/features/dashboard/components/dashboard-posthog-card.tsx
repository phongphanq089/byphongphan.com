import { Link } from "@tanstack/react-router"
import { Activity, Database, FileText, Images, KeyRound } from "lucide-react"

import { AdminContentCard } from "@/admin"
import { Badge, Button } from "@/shared/ui"

export function DashboardPostHogCard() {
  return (
    <AdminContentCard
      title={
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <Activity className="size-4 text-muted-foreground" />
          <span>PostHog Query API &amp; Quick Actions</span>
        </span>
      }
      description="Server-side analytics integration readiness and workspace shortcuts"
      minHeight="min-h-0"
      padding="default"
      className="flex-none"
      actions={
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-500/10 text-[10px] font-medium text-amber-700 dark:text-amber-400"
        >
          Demo Mode
        </Badge>
      }
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1 rounded-lg border border-border/70 bg-muted/25 px-3.5 py-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <KeyRound className="size-3.5 text-muted-foreground" />
              <span>POST /api/projects/:id/query/</span>
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              (HogQL · TrendsQuery)
            </span>
          </div>
          <p className="mt-1 text-muted-foreground">
            Ready to fetch live pageviews, unique visitors, referrers, and
            bounce rate via a TanStack Start server function with{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px] text-foreground">
              POSTHOG_PERSONAL_API_KEY
            </code>
            .
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 text-xs"
            asChild
          >
            <Link to="/admin/posts/new">
              <FileText className="size-3.5 text-muted-foreground" />
              <span>New Post</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 text-xs"
            asChild
          >
            <Link to="/admin/media">
              <Images className="size-3.5 text-muted-foreground" />
              <span>Media Library</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 text-xs"
            asChild
          >
            <Link to="/admin/settings">
              <Database className="size-3.5 text-muted-foreground" />
              <span>Site &amp; SEO</span>
            </Link>
          </Button>
        </div>
      </div>
    </AdminContentCard>
  )
}
