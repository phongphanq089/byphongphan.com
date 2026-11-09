import { useState } from "react"
import { ArrowLeft, Home, Terminal } from "lucide-react"

import { Button } from "@/registry/ui/button"

import { AsciiSkyline, type SkylineStats } from "../components/ascii-skyline"

export default function NotFound04() {
  const [stats, setStats] = useState<SkylineStats | null>(null)

  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  return (
    <main className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-background text-foreground transition-colors select-none">
      {/* ── 1. Full-Screen Interactive ASCII Skyline Canvas ── */}
      <div className="absolute inset-0 z-10">
        <AsciiSkyline
          onStats={setStats}
          className="absolute inset-0 size-full"
        />
      </div>

      {/* ── 2. Foreground Message Overlay (sitting directly outside on canvas) ── */}
      <section className="pointer-events-none relative z-20 my-auto flex flex-col items-center justify-center px-4 text-center">
        {/* Terminal Status Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3.5 py-1 font-mono text-xs text-muted-foreground backdrop-blur-xs">
          <Terminal className="size-3.5 text-primary" />
          <span>ERROR 404 • SECTOR UNREACHABLE</span>
        </div>

        {/* Giant Monospace 404 */}
        <h1 className="mt-3 font-mono text-8xl font-black tracking-tighter text-foreground sm:text-9xl lg:text-[11rem]">
          404
        </h1>

        {/* Title and Explanation */}
        <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-3xl">
          Lost in the ASCII matrix.
        </h2>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
          The requested coordinate does not exist in this sector. Move your
          cursor over the cityscape or navigate back to safety.
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

      {/* ── 3. Subtle Bottom Status Strip ── */}
      <footer className="relative z-30 flex shrink-0 items-center justify-between border-t border-border/80 bg-background/80 px-4 py-2.5 font-mono text-[10px] text-muted-foreground backdrop-blur-md sm:px-8">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            ASCII ENGINE: ONLINE
          </span>
          {stats && (
            <span className="hidden text-muted-foreground/60 sm:inline">
              • GRID: {stats.cols}×{stats.rows} • WINDOWS: {stats.activeWindows}
            </span>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground/80">
          INTERACTIVE CITYSCAPE RAYCASTER • 60 FPS
        </span>
      </footer>
    </main>
  )
}
