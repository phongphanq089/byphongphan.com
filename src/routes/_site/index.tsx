import { createFileRoute } from "@tanstack/react-router"

import {
  SectionAbout,
  SectionBlocks,
  SectionBlog,
  SectionComponents,
  SectionHooks,
  SectionLocation,
  SectionResources,
  SectionTechStack,
} from "@/features/home"
import { createSeoMeta } from "@/shared/config"

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: createSeoMeta("home"),
  }),
  component: HomePage,
})

function HomePage() {
  return (
    <div id="canvas" className="relative z-10 w-full select-none">
      {/* ─── PART 1: 1024px ARCHITECTURAL BLUEPRINT SHEET (UPPER CONTAINER) ─── */}
      <div className="mx-auto w-full max-w-[1024px] px-4 pt-4 sm:px-6">
        {/* SECTION I: ABOUT / HERO */}
        <SectionAbout />

        {/* SECTION II: TECH STACK */}
        <SectionTechStack />
      </div>

      {/* ─── PART 2: FULL-WIDTH BREAKOUT — SECTION III: UI COMPONENTS SHOWCASE ─── */}
      {/* Expands to 100% full viewport width with flush bottom baseline */}
      <SectionComponents />

      {/* ─── PART 3: SECTION IV: PRODUCTION BLOCKS (HORIZONTAL SLIDE TO RIGHT) ─── */}
      {/* Aligns with 1024px content column on the left and bleeds to the right edge */}
      <SectionBlocks />

      {/* ─── PART 4: 1024px ARCHITECTURAL BLUEPRINT SHEET (LOWER CONTAINER) ─── */}
      <div className="mx-auto w-full max-w-[1024px] px-4 pt-14 sm:px-6">
        {/* SECTION V: HOOKS */}
        <SectionHooks className="pb-0!" />

        {/* SECTION VI: BLOG / WRITING */}
        <SectionBlog className="pb-0!" />

        {/* SECTION VII: RESOURCES */}
        <SectionResources className="pb-0!" />

        {/* SECTION VIII: LOCATION & PHILOSOPHY */}
        <SectionLocation />
      </div>
    </div>
  )
}
