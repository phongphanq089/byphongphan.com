import { ArrowRight, Home, SearchX } from "lucide-react"

import { Button } from "@/shared/ui/core"

import { Daikanoid } from "../components/daikanoid"

export default function NotFound() {
  return (
    <main className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-background text-foreground select-none">
      {/* ── 1. Top 404 Message Bar (Technical Blueprint Style) ── */}
      <header className="relative z-20 flex shrink-0 flex-col items-center justify-between gap-4 border-b border-border bg-background/80 px-4 py-4 backdrop-blur-md sm:flex-row sm:px-8">
        {/* Left: 404 Badge & Heading */}
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted/60 text-muted-foreground">
            <SearchX className="size-4" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                404
              </span>
              <span className="text-muted-foreground/40">•</span>
              <h1 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
                Page not found
              </h1>
            </div>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              The page you are looking for does not exist or has been moved.
            </p>
          </div>
        </div>

        {/* Right: CTA Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 gap-1.5 rounded-lg border-border/80 text-xs"
          >
            <a href="/">
              <Home className="size-3.5" />
              <span>Go to Home</span>
              <ArrowRight className="size-3" />
            </a>
          </Button>
        </div>
      </header>

      {/* ── 2. Full-Screen Edge-to-Edge Game Canvas ── */}
      <section className="relative z-10 flex w-full flex-1 overflow-hidden">
        <Daikanoid className="h-full w-full" />
      </section>
    </main>
  )
}
