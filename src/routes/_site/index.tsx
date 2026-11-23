import { createFileRoute } from "@tanstack/react-router"

import { createSeoMeta } from "@/shared/config"

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: createSeoMeta("home"),
  }),
  component: HomePage,
})

function HomePage() {
  return (
    <div
      id="canvas"
      className="relative z-10 mx-auto flex min-h-[900px] w-full max-w-[1024px] flex-col items-center justify-center px-4 py-28 select-none sm:px-6"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-lg text-pp-secondary sm:text-xl">
          Architectural Drafting Grid
        </span>
        <span className="font-mono text-[11px] tracking-widest text-muted-foreground/50 uppercase">
          1024px 5-Track Swiss Drafting Framework • All Sections Closed
        </span>
      </div>
    </div>
  )
}
