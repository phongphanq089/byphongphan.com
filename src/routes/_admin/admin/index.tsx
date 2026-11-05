import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowUpRight, Boxes, FileText, Sparkles } from "lucide-react"

import { AdminContentCard, AdminPageHeader } from "@/admin"
import { Button } from "@/shared/ui"

export const Route = createFileRoute("/_admin/admin/")({
  component: AdminDashboardPage,
})

function AdminDashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <AdminPageHeader
        title="Dashboard Overview"
        description="Welcome to the management control center of byphongphan.com."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Overview" },
        ]}
      />

      {/* 4 Quick Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/70 bg-card p-4 shadow-xs">
          <p className="text-xs font-medium text-muted-foreground">
            Total Posts
          </p>
          <p className="mt-2 text-2xl font-bold text-foreground">12</p>
          <p className="mt-1 text-xs text-muted-foreground/80">
            Across 4 categories
          </p>
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-4 shadow-xs">
          <p className="text-xs font-medium text-muted-foreground">
            Registry Components
          </p>
          <p className="mt-2 text-2xl font-bold text-foreground">48</p>
          <p className="mt-1 text-xs text-muted-foreground/80">
            UI Primitives & Animated
          </p>
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-4 shadow-xs">
          <p className="text-xs font-medium text-muted-foreground">
            Curated Resources
          </p>
          <p className="mt-2 text-2xl font-bold text-foreground">36</p>
          <p className="mt-1 text-xs text-muted-foreground/80">
            Tools, inspirations & assets
          </p>
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-4 shadow-xs">
          <p className="text-xs font-medium text-muted-foreground">
            Database Status
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">Connected</p>
          <p className="mt-1 text-xs text-muted-foreground/80">
            Neon Serverless PostgreSQL
          </p>
        </div>
      </div>

      {/* Full-Height Content Card */}
      <AdminContentCard
        title="Quick Actions & Getting Started"
        description="Jump straight into publishing, component testing, or reviewing your website."
        actions={
          <Button variant="outline" size="sm" asChild className="gap-1.5">
            <Link to="/" target="_blank">
              <span>View Frontend</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        }
      >
        <div className="grid flex-1 gap-4 py-4 md:grid-cols-3">
          <div className="flex flex-col justify-between rounded-lg border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
            <div className="space-y-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Manage Blog Posts
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Draft, edit markdown articles, and organize series collections.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              asChild
              className="mt-4 w-full"
            >
              <Link to="/admin/posts">Go to Posts</Link>
            </Button>
          </div>

          <div className="flex flex-col justify-between rounded-lg border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
            <div className="space-y-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Boxes className="size-5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Registry Hub
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Inspect component distribution files and CLI schema manifests.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              asChild
              className="mt-4 w-full"
            >
              <Link to="/admin/registry">Go to Registry</Link>
            </Button>
          </div>

          <div className="flex flex-col justify-between rounded-lg border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
            <div className="space-y-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="size-5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Curated Resources
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Add and manage creative tools, portfolios, and design
                references.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              asChild
              className="mt-4 w-full"
            >
              <Link to="/admin/resources">Go to Resources</Link>
            </Button>
          </div>
        </div>
      </AdminContentCard>
    </div>
  )
}
