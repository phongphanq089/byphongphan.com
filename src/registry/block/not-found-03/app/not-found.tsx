import { ArrowLeft, Home, Moon, Sparkles, Sun, Terminal } from "lucide-react"

import { Button } from "@/registry/ui/button"

import { PixelTrail } from "../components/pixel-trail"

export default function NotFound03() {
  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  return (
    <main className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-background text-foreground transition-colors select-none">
      {/* ── 1. Top Technical Header Bar ── */}
      <header className="relative z-30 flex shrink-0 items-center justify-between border-b border-border/80 bg-background/80 px-4 py-3.5 backdrop-blur-md sm:px-8">
        {/* Left: Terminal status indicator */}
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg border border-border bg-muted/60 text-muted-foreground">
            <Terminal className="size-4" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold tracking-widest text-primary uppercase">
                ERROR 404
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span className="font-mono text-xs text-muted-foreground">
                PIXEL_TRAIL_GRID
              </span>
            </div>
            <p className="hidden text-[11px] text-muted-foreground sm:inline-block">
              Coordinates unresolved • Digital void reached
            </p>
          </div>
        </div>

        {/* Right: Quick actions & theme switcher */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 gap-1.5 rounded-lg border-border/80 text-xs"
          >
            <a href="/">
              <Home className="size-3.5" />
              <span className="hidden sm:inline">Go to Home</span>
            </a>
          </Button>
        </div>
      </header>

      {/* ── 2. Full-Screen Interactive Pixel Trail Canvas ── */}
      <div className="absolute inset-0 z-10 pt-16">
        <PixelTrail
          pixelSize={24}
          fadeDuration={650}
          pixelClassName="bg-zinc-950 dark:bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_12px_#ffffff] rounded-[2px]"
        />
      </div>

      {/* ── 3. Foreground Message Overlay (Click-through to Trail) ── */}
      <section className="pointer-events-none relative z-20 my-auto flex flex-col items-center justify-center px-4 text-center">
        {/* Giant Monospace 404 */}
        <h1 className="font-mono text-7xl font-black tracking-tighter text-foreground sm:text-9xl lg:text-[11rem]">
          404
        </h1>

        {/* Title and Explanation */}
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Lost in the pixel void.
        </h2>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
          The page you requested does not exist or has dissolved into binary
          noise. Sweep your cursor across the grid to illuminate the path.
        </p>

        {/* Re-enable pointer events for buttons */}
        <div className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="default"
            asChild
            className="h-10 gap-2 rounded-xl bg-foreground px-5 text-sm font-medium text-background hover:opacity-90 dark:bg-white dark:text-zinc-950"
          >
            <a href="/">
              <Home className="size-4" />
              <span>Back to Home</span>
            </a>
          </Button>

          <Button
            variant="outline"
            size="default"
            onClick={handleBack}
            className="h-10 gap-2 rounded-xl border-border bg-background/80 px-5 text-sm backdrop-blur-sm hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            <span>Go Back</span>
          </Button>
        </div>
      </section>
    </main>
  )
}
