import {
  Activity,
  AlertTriangle,
  FileSearch,
  Globe,
  ImageIcon,
  Search,
  Share2,
} from "lucide-react"

import { AdminContentCard } from "@/admin"
import { Badge, Separator, Switch } from "@/shared/ui"

import type { AdminSiteSettingsData } from "../types"

interface SettingsPreviewSidebarProps {
  values: AdminSiteSettingsData
  onFieldChange: <K extends keyof AdminSiteSettingsData>(
    field: K,
    value: AdminSiteSettingsData[K]
  ) => void
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return "byphongphan.com"
  }
}

export function SettingsPreviewSidebar({
  values,
  onFieldChange,
}: SettingsPreviewSidebarProps) {
  const hostname = getHostname(values.siteUrl)

  return (
    <div className="flex flex-col gap-6 xl:sticky xl:top-20 xl:self-start">
      {/* Search Engine Snippet Preview */}
      <AdminContentCard
        title={
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <Search className="size-4 text-muted-foreground" />
            <span>Search Snippet Preview</span>
          </span>
        }
        description="Approximate Google search result appearance"
        minHeight="min-h-0"
        padding="default"
        className="flex-none"
        actions={
          <Badge
            variant="outline"
            className={
              values.noIndex
                ? "border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-700 dark:text-amber-400"
                : "border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-700 dark:text-emerald-400"
            }
          >
            {values.noIndex ? "noindex" : "index, follow"}
          </Badge>
        }
      >
        <div className="space-y-1.5 rounded-lg border border-border/70 bg-background p-3.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground">
              {values.siteName.slice(0, 1).toUpperCase() || "P"}
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[11px] font-medium text-foreground">
                {values.siteName || "Site Name"}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                {values.siteUrl || "https://byphongphan.com"}
              </p>
            </div>
          </div>

          <h4 className="line-clamp-1 pt-1 text-sm font-medium text-blue-600 dark:text-blue-400">
            {values.siteTitle || "Untitled Website"}
          </h4>

          <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
            {values.siteDescription ||
              "Add a concise meta description so search engines can summarize your site."}
          </p>
        </div>
      </AdminContentCard>

      {/* OpenGraph / Social Card Preview */}
      <AdminContentCard
        title={
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <Share2 className="size-4 text-muted-foreground" />
            <span>Social Share Card</span>
          </span>
        }
        description="OpenGraph &amp; X card preview"
        minHeight="min-h-0"
        padding="default"
        className="flex-none"
      >
        <div className="overflow-hidden rounded-lg border border-border/70 bg-background">
          {values.twitterCard === "summary_large_image" ? (
            <>
              <div className="relative aspect-[1.91/1] w-full overflow-hidden border-b border-border/60 bg-muted/40">
                {values.ogImage ? (
                  <img
                    src={values.ogImage}
                    alt="OpenGraph preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
                    <ImageIcon className="size-8" />
                  </div>
                )}
              </div>
              <div className="space-y-1 p-3">
                <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                  {hostname}
                </p>
                <p className="line-clamp-1 text-xs font-semibold text-foreground">
                  {values.siteTitle}
                </p>
                <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                  {values.siteDescription}
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-stretch">
              <div className="flex size-24 shrink-0 items-center justify-center border-r border-border/60 bg-muted/40">
                {values.ogImage ? (
                  <img
                    src={values.ogImage}
                    alt="OpenGraph preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="size-6 text-muted-foreground/50" />
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-1 p-3">
                <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                  {hostname}
                </p>
                <p className="line-clamp-1 text-xs font-semibold text-foreground">
                  {values.siteTitle}
                </p>
                <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                  {values.siteDescription}
                </p>
              </div>
            </div>
          )}
        </div>
      </AdminContentCard>

      {/* Crawling & Platform Toggles */}
      <AdminContentCard
        title={
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <Globe className="size-4 text-muted-foreground" />
            <span>Indexing &amp; Platform</span>
          </span>
        }
        description="Search engine crawling, sitemap, and runtime flags"
        minHeight="min-h-0"
        padding="default"
        className="flex-none"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <FileSearch className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-foreground">
                  Allow Search Indexing
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Disable to emit noindex meta tag
                </p>
              </div>
            </div>
            <Switch
              checked={!values.noIndex}
              onCheckedChange={(checked) => onFieldChange("noIndex", !checked)}
              aria-label="Toggle search engine indexing"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <Globe className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-foreground">
                  XML Sitemap
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Expose /sitemap.xml for crawlers
                </p>
              </div>
            </div>
            <Switch
              checked={values.enableSitemap}
              onCheckedChange={(checked) =>
                onFieldChange("enableSitemap", checked)
              }
              aria-label="Toggle XML sitemap"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <Activity className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-foreground">
                  PostHog Analytics
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Track pageviews &amp; registry events
                </p>
              </div>
            </div>
            <Switch
              checked={values.enableAnalytics}
              onCheckedChange={(checked) =>
                onFieldChange("enableAnalytics", checked)
              }
              aria-label="Toggle PostHog analytics"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-foreground">
                  Maintenance Mode
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Show maintenance banner to visitors
                </p>
              </div>
            </div>
            <Switch
              checked={values.maintenanceMode}
              onCheckedChange={(checked) =>
                onFieldChange("maintenanceMode", checked)
              }
              aria-label="Toggle maintenance mode"
            />
          </div>
        </div>
      </AdminContentCard>
    </div>
  )
}
