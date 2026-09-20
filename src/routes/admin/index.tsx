import { createFileRoute, Link } from "@tanstack/react-router"
import {
  ArrowRight,
  BookmarkCheck,
  Boxes,
  Database,
  FilePlus,
  FileText,
  FolderGit2,
  HardDrive,
  Plus,
  SlidersHorizontal,
  Terminal,
} from "lucide-react"

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from "@/shared/ui"

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
})

function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* ─── Top Welcome Section ─── */}
      <div className="relative overflow-hidden rounded-xl border border-border/70 bg-gradient-to-br from-card via-card/90 to-card/50 p-6 shadow-sm md:p-8">
        {/* Subtle decorative red glow */}
        <div className="pointer-events-none absolute -top-12 -right-12 size-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary"
              >
                Admin Console
              </Badge>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span>Production Mode</span>
              </div>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
              Welcome back, Phong Phan
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Manage your blog articles, developer curated resources, and custom
              UI registry components powered by Neon Serverless & ImageKit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="sm"
              className="h-9 gap-1.5 rounded-lg font-medium shadow-sm"
            >
              <Link to="/admin/posts">
                <FilePlus className="size-4" />
                <span>New Blog Post</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-9 gap-1.5 rounded-lg border-border/80 font-medium"
            >
              <Link to="/admin/resources">
                <Plus className="size-4" />
                <span>Add Resource</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Metric Cards Grid (Standardized rounded-xl) ─── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Posts */}
        <Card className="rounded-xl border-border/70 bg-card/60 shadow-none transition-all hover:border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Blog Posts
            </CardTitle>
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <FileText className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              --
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Draft & published articles
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Link
              to="/admin/posts"
              className="group flex items-center text-xs font-medium text-primary hover:underline"
            >
              <span>Manage articles</span>
              <ArrowRight className="ml-1 size-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </CardFooter>
        </Card>

        {/* Metric 2: Resources */}
        <Card className="rounded-xl border-border/70 bg-card/60 shadow-none transition-all hover:border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Resources & Tools
            </CardTitle>
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <BookmarkCheck className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              --
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Curated developer tools
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Link
              to="/admin/resources"
              className="group flex items-center text-xs font-medium text-primary hover:underline"
            >
              <span>Explore tools</span>
              <ArrowRight className="ml-1 size-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </CardFooter>
        </Card>

        {/* Metric 3: Registry Hub */}
        <Card className="rounded-xl border-border/70 bg-card/60 shadow-none transition-all hover:border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Registry Primitives
            </CardTitle>
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Boxes className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              21
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Components in <code className="text-[11px]">src/registry/ui</code>
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Link
              to="/admin/registry"
              className="group flex items-center text-xs font-medium text-primary hover:underline"
            >
              <span>View registry hub</span>
              <ArrowRight className="ml-1 size-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </CardFooter>
        </Card>

        {/* Metric 4: Neon Database */}
        <Card className="rounded-xl border-border/70 bg-card/60 shadow-none transition-all hover:border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Database Engine
            </CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <Database className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-foreground">
                Neon Postgres
              </span>
              <Badge
                variant="outline"
                className="border-emerald-500/30 text-[10px] text-emerald-400"
              >
                Online
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Singapore Region (Serverless)
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <span className="text-xs text-muted-foreground">
              Drizzle ORM v0.45+
            </span>
          </CardFooter>
        </Card>
      </div>

      {/* ─── Main Grid: Management Shortcuts & Infrastructure Overview ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Content Modules (2 cols, standardized rounded-xl) */}
        <div className="h-full space-y-6 lg:col-span-2">
          <Card className="h-full rounded-xl border-border/70 bg-card/60 shadow-none">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="text-base font-bold text-foreground">
                Content Modules & Shortcuts
              </CardTitle>
              <CardDescription className="text-xs">
                Direct access to manage each domain of your website.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
              {/* Box 1: Blog */}
              <Link
                to="/admin/posts"
                className="group flex flex-col gap-2 rounded-lg border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/50 hover:bg-muted/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="size-4" />
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Blog Posts & Articles
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Create, edit draft, publish technical tutorials & updates.
                  </p>
                </div>
              </Link>

              {/* Box 2: Resources */}
              <Link
                to="/admin/resources"
                className="group flex flex-col gap-2 rounded-lg border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/50 hover:bg-muted/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BookmarkCheck className="size-4" />
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Resources & Dev Tools
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Manage curated developer tools, UI kits, libraries &
                    bookmarks.
                  </p>
                </div>
              </Link>

              {/* Box 3: Series */}
              <Link
                to="/admin/groups"
                className="group flex flex-col gap-2 rounded-lg border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/50 hover:bg-muted/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FolderGit2 className="size-4" />
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Series & Post Groups
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Organize articles into sequential learning tracks &
                    roadmaps.
                  </p>
                </div>
              </Link>

              {/* Box 4: Site Settings */}
              <Link
                to="/admin/settings"
                className="group flex flex-col gap-2 rounded-lg border border-border/60 bg-background/60 p-4 transition-all hover:border-primary/50 hover:bg-muted/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <SlidersHorizontal className="size-4" />
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    SEO & Site Settings
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Global metadata, OpenGraph images, favicons & credentials.
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Infrastructure & Architecture Status */}
        <div className="space-y-6">
          <Card className="rounded-xl border-border/70 bg-card/60 shadow-none">
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-foreground">
                  Stack Architecture
                </CardTitle>
                <Badge variant="outline" className="border-border text-[10px]">
                  Serverless
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Zero-cost serverless infrastructure overview.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-4 text-xs">
              {/* Item 1: Neon */}
              <div className="flex items-start justify-between gap-3 rounded-lg border border-border/40 bg-background/40 p-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 font-bold text-emerald-400">
                    <Database className="size-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Neon PostgreSQL
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      0.5 GB Free Tier • Scale to zero
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 text-[10px] text-emerald-400"
                >
                  Ready
                </Badge>
              </div>

              {/* Item 2: ImageKit */}
              <div className="flex items-start justify-between gap-3 rounded-lg border border-border/40 bg-background/40 p-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                    <HardDrive className="size-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      ImageKit CDN
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      20 GB Media Storage & Bandwidth
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-primary/30 text-[10px] text-primary"
                >
                  Active
                </Badge>
              </div>

              {/* Item 3: Registry Single Source of Truth */}
              <div className="flex items-start justify-between gap-3 rounded-lg border border-border/40 bg-background/40 p-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                    <Boxes className="size-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Registry Engine
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Single Source in{" "}
                      <code className="text-[10px]">src/registry</code>
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-primary/30 text-[10px] text-primary"
                >
                  Linked
                </Badge>
              </div>
            </CardContent>

            <Separator className="bg-border/40" />

            <CardFooter className="flex flex-col gap-2 p-4">
              <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Terminal className="size-3.5" />
                  <span>Drizzle Studio</span>
                </span>
                <code className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                  pnpm db:studio
                </code>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
