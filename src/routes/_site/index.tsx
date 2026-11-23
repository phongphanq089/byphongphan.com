import { createFileRoute } from "@tanstack/react-router"

import { SectionAbout } from "@/features/home"
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
      className="relative z-10 mx-auto w-full max-w-[1024px] px-4 pt-4 pb-28 select-none sm:px-6"
    >
      {/* SECTION I: ABOUT / HERO */}
      <SectionAbout />
    </div>
  )
}
