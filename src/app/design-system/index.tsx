import { Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"

import { DESIGN_SYSTEM_TOC_ITEMS } from "@/shared/config"
import { ThemeProvider } from "@/shared/providers/theme-provider"
import { ScrollToTop } from "@/shared/ui"
import { ModeToggle } from "@/shared/ui/system/mode-toggle"
import { TOCMinimap } from "@/shared/ui/system/toc-minimap"

import { AnimationsSection } from "./sections/animations-section"
import { ApiInspectorSection } from "./sections/api-inspector-section"
import { BlueprintSection } from "./sections/blueprint-section"
import { BrandSection } from "./sections/brand-section"
import { ButtonsSection } from "./sections/buttons-section"
import { CardsSection } from "./sections/cards-section"
import { FeedbackSection } from "./sections/feedback-section"
import { IconsSection } from "./sections/icons-section"
import { TokensSection } from "./sections/tokens-section"

export function DesignSystemShowcase() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20">
        {/* Floating TOC Minimap */}
        <div className="fixed top-1/2 right-0 z-50 -translate-y-1/2">
          <TOCMinimap items={DESIGN_SYSTEM_TOC_ITEMS} />
        </div>

        {/* Top Sticky Bar */}
        <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Portfolio</span>
              </Link>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">
                  Design System
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ModeToggle />
            </div>
          </div>
        </header>

        {/* Hero Banner */}
        <div
          id="overview"
          className="scroll-mt-20 border-b border-border/60 bg-card/40 px-4 py-12 sm:px-6"
        >
          <div className="mx-auto max-w-7xl">
            <p className="mb-2 text-xs tracking-widest text-primary uppercase">
              // DESIGN SYSTEM & COMPONENT CATALOG
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Engineering Design System
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              A comprehensive library of atomic primitives, micro-animations,
              shaders, and layout widgets built with React 19, Tailwind CSS v4,
              and Radix UI.
            </p>
          </div>
        </div>

        {/* Content Container */}
        <main className="mx-auto max-w-7xl space-y-20 px-4 py-12 sm:px-6">
          {/* 01. Brand Identity */}
          <section className="space-y-6">
            <div
              id="brand"
              className="scroll-mt-24 space-y-1 border-b border-border/60 pb-3"
            >
              <span className="text-xs font-semibold text-primary">
                01 / BRAND
              </span>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Logo & Brand Identity
              </h2>
            </div>
            <BrandSection />
          </section>

          {/* 02. Design Tokens */}
          <section className="space-y-6">
            <div
              id="tokens"
              className="scroll-mt-24 space-y-1 border-b border-border/60 pb-3"
            >
              <span className="text-xs font-semibold text-primary">
                02 / TOKENS
              </span>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Design Tokens & Colors
              </h2>
            </div>
            <TokensSection />
          </section>

          {/* 03. Buttons & Controls */}
          <section className="space-y-6">
            <div
              id="buttons"
              className="scroll-mt-24 space-y-1 border-b border-border/60 pb-3"
            >
              <span className="text-xs font-semibold text-primary">
                03 / CONTROLS
              </span>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Buttons & Interactions
              </h2>
            </div>
            <ButtonsSection />
          </section>

          {/* 04. Shaders & FX */}
          <section className="space-y-6">
            <div
              id="animations"
              className="scroll-mt-24 space-y-1 border-b border-border/60 pb-3"
            >
              <span className="text-xs font-semibold text-primary">
                04 / FX & MOTION
              </span>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Shaders & Animation Effects
              </h2>
            </div>
            <AnimationsSection />
          </section>

          {/* 05. Cards & Containers */}
          <section className="space-y-6">
            <div
              id="cards"
              className="scroll-mt-24 space-y-1 border-b border-border/60 pb-3"
            >
              <span className="text-xs font-semibold text-primary">
                05 / CONTAINERS
              </span>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Cards & Structured Surfaces
              </h2>
            </div>
            <CardsSection />
          </section>

          {/* 06. Blueprint & Layout Surfaces */}
          <section className="space-y-6">
            <div
              id="blueprint"
              className="scroll-mt-24 space-y-1 border-b border-border/60 pb-3"
            >
              <span className="text-xs font-semibold text-primary">
                06 / BLUEPRINT & LAYOUT
              </span>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Blueprint Patterns & Page Banners
              </h2>
            </div>
            <BlueprintSection />
          </section>

          {/* 07. States & Feedback */}
          <section className="space-y-6">
            <div
              id="feedback"
              className="scroll-mt-24 space-y-1 border-b border-border/60 pb-3"
            >
              <span className="text-xs font-semibold text-primary">
                07 / FEEDBACK
              </span>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Feedback & System Indicators
              </h2>
            </div>
            <FeedbackSection />
          </section>

          {/* 08. Tech Icons */}
          <section className="space-y-6">
            <div
              id="icons"
              className="scroll-mt-24 space-y-1 border-b border-border/60 pb-3"
            >
              <span className="text-xs font-semibold text-primary">
                08 / ICONS
              </span>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Tech Stack Icons Hub
              </h2>
            </div>
            <IconsSection />
          </section>

          {/* 09. API Inspector Dev Tool */}
          <section className="space-y-6">
            <div
              id="api-inspector"
              className="scroll-mt-24 space-y-1 border-b border-border/60 pb-3"
            >
              <span className="text-xs font-semibold text-primary">
                09 / DEV TOOLS
              </span>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                API Inspector & JSON Viewer Tool
              </h2>
            </div>
            <ApiInspectorSection />
          </section>
        </main>

        <div className="fixed right-6 bottom-22 z-10 flex flex-col items-end gap-3 lg:bottom-6">
          <ScrollToTop />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default DesignSystemShowcase
