import { StatsCards } from "./components/stats-cards"

export default function StatsCardsPage() {
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col justify-between overflow-x-hidden bg-background p-6 text-foreground transition-colors sm:p-10 lg:p-16">
      {/* ── Main Content Area ── */}
      <main className="my-auto flex flex-col items-center justify-center py-10 text-center">
        {/* Section Heading */}
        <div className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Scale your brand with <br className="hidden sm:inline" />
            <span className="text-[#FF4400]">high-performing</span> content.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Turn passive scrollers into passionate buyers with high-converting
            organic campaigns engineered to scale.
          </p>
        </div>

        {/* ── Interactive Stats Cards Stack ── */}
        <div className="w-full max-w-7xl">
          <StatsCards />
        </div>
      </main>

      {/* ── Bottom Proof Strip ── */}
      <footer className="grid grid-cols-1 gap-4 border-t border-border/50 pt-8 sm:grid-cols-3 sm:gap-6">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <span className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            400+ Brands
          </span>
          <span className="text-xs text-muted-foreground">
            Direct-to-consumer businesses scaled globally
          </span>
        </div>
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <span className="text-lg font-semibold tracking-tight text-[#FF4400] sm:text-xl">
            3.4x Average ROAS
          </span>
          <span className="text-xs text-muted-foreground">
            Measurable returns on performance social campaigns
          </span>
        </div>
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <span className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            98% Retention
          </span>
          <span className="text-xs text-muted-foreground">
            Long-term partnerships driven by consistent ROI
          </span>
        </div>
      </footer>
    </div>
  )
}
