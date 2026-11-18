import { StatsCards } from "./components/stats-cards"

export default function StatsCardsPage() {
  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-x-hidden bg-[#FAF7F2] p-4 text-foreground transition-colors sm:p-8 md:p-12 lg:p-16 dark:bg-[#09090b]">
      {/* ── Main Content Area: Pure, focused stage for the card fan deck ── */}
      <main className="flex w-full max-w-7xl items-center justify-center py-6">
        <StatsCards />
      </main>
    </div>
  )
}
