import { Link } from "@tanstack/react-router"
import { ArrowUpRight, Globe } from "lucide-react"

import { AdminContentCard } from "@/admin"
import { Button } from "@/shared/ui"

import type { TopPageItem } from "../types"

interface DashboardTopPagesCardProps {
  pages: TopPageItem[]
}

export function DashboardTopPagesCard({ pages }: DashboardTopPagesCardProps) {
  const maxViews = Math.max(...pages.map((p) => p.views), 1)

  return (
    <AdminContentCard
      title={
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <Globe className="size-4 text-muted-foreground" />
          <span>Top Routes &amp; Pages</span>
        </span>
      }
      description="Most visited paths ranked by $pageview count"
      minHeight="min-h-0"
      padding="default"
      className="h-full"
      actions={
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs"
          asChild
        >
          <Link to="/" target="_blank">
            <span>Live Site</span>
            <ArrowUpRight className="size-3" />
          </Link>
        </Button>
      }
    >
      <div className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60 bg-muted/10">
        {pages.map((page) => {
          const widthPct = Math.round((page.views / maxViews) * 100)
          return (
            <div
              key={page.path}
              className="relative flex items-center justify-between gap-4 px-4 py-3 text-xs"
            >
              <div
                style={{ width: `${widthPct}%` }}
                className="pointer-events-none absolute inset-y-1 left-1 rounded-md bg-primary/[0.04]"
              />
              <div className="relative min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">
                  {page.title}
                </p>
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {page.path}
                </p>
              </div>

              <div className="relative flex shrink-0 items-center gap-5 text-right tabular-nums">
                <div>
                  <p className="font-mono font-semibold text-foreground">
                    {page.views.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground">views</p>
                </div>
                <div className="hidden sm:block">
                  <p className="font-mono font-medium text-foreground">
                    {page.visitors.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground">visitors</p>
                </div>
                <div className="w-12">
                  <p className="font-mono text-muted-foreground">
                    {page.bounceRate}
                  </p>
                  <p className="text-[10px] text-muted-foreground">bounce</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </AdminContentCard>
  )
}
