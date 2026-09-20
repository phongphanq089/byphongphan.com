import { ArrowUpRight, Check, Star } from "lucide-react"

import type { BlockSchematicType } from "../../types"

// 1. Not Found 01 (Playable Brick Breaker Game) - Image 1
export function NotFoundBrickSchematic() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-between p-2">
      {/* Top Header Indicators */}
      <div className="flex w-full items-center justify-between px-2 text-[8px] text-white/40">
        <span>SCORE: 0404</span>
        <div className="flex gap-1">
          <span className="size-1.5 rounded-full bg-white/60" />
          <span className="size-1.5 rounded-full bg-white/60" />
          <span className="size-1.5 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Retro Pixel Brick Matrix forming "404" / "CD" */}
      <div className="my-auto flex flex-col items-center gap-1">
        <div className="grid grid-cols-8 gap-1">
          {[
            1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0,
            1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1,
          ].map((val, idx) => (
            <div
              key={idx}
              className={`size-2.5 rounded-[2px] ${
                val === 1
                  ? "bg-white/70 shadow-[0_0_6px_rgba(255,255,255,0.3)]"
                  : "bg-white/[0.04]"
              }`}
            />
          ))}
        </div>

        {/* Bouncing pixel ball */}
        <div className="my-2 size-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />

        {/* Bottom player paddle */}
        <div className="h-1.5 w-12 rounded-full bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
      </div>

      <div className="h-1 w-16 rounded-full bg-white/10" />
    </div>
  )
}

// 2. Social Proof 01 (Logos Carousel) - Image 1
export function SocialProofLogosSchematic() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 p-3">
      {/* Top divider with label */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-white/10" />
        <div className="h-1.5 w-20 rounded-full bg-white/30" />
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* 4-column Logo cells */}
      <div className="grid grid-cols-4 divide-x divide-white/10 rounded-xl border border-white/15 bg-white/[0.03] py-4">
        {/* Logo 1: Triangle + Bar */}
        <div className="flex items-center justify-center gap-1.5 px-2">
          <div className="size-0 border-x-4 border-b-[7px] border-x-transparent border-b-white/80" />
          <div className="h-2 w-10 rounded-full bg-white/70" />
        </div>

        {/* Logo 2: Circle + Bar */}
        <div className="flex items-center justify-center gap-1.5 px-2">
          <div className="size-2 rounded-full bg-white/80" />
          <div className="h-2 w-12 rounded-full bg-white/70" />
        </div>

        {/* Logo 3: Star / Asterisk + Bar */}
        <div className="flex items-center justify-center gap-1.5 px-2">
          <span className="text-xs font-black text-white/80">✱</span>
          <div className="h-2 w-9 rounded-full bg-white/70" />
        </div>

        {/* Logo 4: Dual pill + Bar */}
        <div className="flex items-center justify-center gap-1.5 px-2">
          <div className="flex gap-0.5">
            <div className="h-3 w-1 rounded-full bg-white/80" />
            <div className="h-3 w-1 rounded-full bg-white/50" />
          </div>
          <div className="h-2 w-10 rounded-full bg-white/70" />
        </div>
      </div>
    </div>
  )
}

// 3. Social Links 01 (Lined Grid Layout) - Image 1
export function SocialLinksGridSchematic() {
  return (
    <div className="flex h-full w-full items-center justify-center p-3">
      {/* 2x3 Grid */}
      <div className="grid w-full grid-cols-3 divide-x divide-y divide-white/10 rounded-xl border border-white/15 bg-white/[0.02]">
        {[
          { label: "Twitter / X" },
          { label: "GitHub" },
          { label: "Discord" },
          { label: "YouTube" },
          { label: "LinkedIn" },
          { label: "Telegram" },
        ].map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2.5 transition-colors hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-2">
              <div className="size-3.5 rounded-md bg-white/20" />
              <div className="h-1.5 w-8 rounded-full bg-white/60" />
            </div>
            <ArrowUpRight className="size-2.5 text-white/40" />
          </div>
        ))}
      </div>
    </div>
  )
}

// 4. Benefits 01 (Alternating Rows with Text and Dashboard) - Image 2
export function BenefitsAlternatingSchematic() {
  return (
    <div className="flex h-full w-full items-center gap-3 p-3">
      {/* Left Column: Text & Features */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="size-5 rounded-md bg-white/20" />
        <div className="flex flex-col gap-1">
          <div className="h-2 w-20 rounded-full bg-white/90" />
          <div className="h-1.5 w-28 rounded-full bg-white/30" />
        </div>
        <div className="flex flex-col gap-1 pt-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="size-2 rounded-full border border-white/30 bg-white/10" />
              <div className="h-1 w-20 rounded-full bg-white/40" />
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Dashboard Mock Window */}
      <div className="flex flex-1 flex-col gap-1.5 rounded-xl border border-white/20 bg-black/80 p-2.5 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
          <div className="h-1.5 w-12 rounded-full bg-white/60" />
          <div className="flex gap-1">
            <span className="size-1 rounded-full bg-red-400" />
            <span className="size-1 rounded-full bg-emerald-400" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
          <div className="rounded-md border border-white/10 bg-white/[0.04] p-1.5">
            <span className="text-[7px] text-white/40">Checking</span>
            <div className="text-[9px] font-bold text-white">$25,895</div>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.04] p-1.5">
            <span className="text-[7px] text-white/40">Revenue</span>
            <div className="text-[9px] font-bold text-blue-400">$8,325</div>
          </div>
        </div>

        {/* Mini Chart Bars */}
        <div className="flex h-8 items-end gap-1 px-1 pt-1">
          {[30, 60, 45, 80, 50, 95, 70, 100, 65, 85, 40].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-xs bg-blue-500"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// 5. Hero Marketing Section Schematic
export function HeroMarketingSchematic() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-between p-3">
      {/* Top Eyebrow */}
      <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.08] px-2.5 py-0.5">
        <span className="size-1.5 rounded-full bg-pp-primary" />
        <div className="h-1.5 w-14 rounded-full bg-white/80" />
      </div>

      {/* Main Title & Subtitle */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <div className="h-3 w-40 rounded-full bg-white/90" />
        <div className="h-2 w-32 rounded-full bg-white/40" />
      </div>

      {/* Dual CTA Buttons */}
      <div className="flex items-center gap-2">
        <div className="flex h-5 items-center justify-center rounded-md bg-white px-2.5 shadow-xs">
          <span className="text-[8px] font-bold text-black">Get Started</span>
        </div>
        <div className="flex h-5 items-center justify-center rounded-md border border-white/20 bg-white/[0.05] px-2.5">
          <span className="text-[8px] font-medium text-white/70">
            View Demo
          </span>
        </div>
      </div>

      {/* Bottom Floating App Mock */}
      <div className="h-6 w-48 rounded-t-lg border-x border-t border-white/20 bg-white/[0.06] shadow-md" />
    </div>
  )
}

// 6. Pricing Matrix Schematic
export function PricingMatrixSchematic() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-2 p-2">
      {/* Tier 1 */}
      <div className="flex flex-1 flex-col gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-2">
        <div className="h-1.5 w-8 rounded-full bg-white/60" />
        <div className="text-[9px] font-bold text-white">$0</div>
        <div className="h-1 w-full rounded-full bg-white/20" />
        <div className="h-1 w-4/5 rounded-full bg-white/20" />
      </div>

      {/* Tier 2 (Highlighted) */}
      <div className="flex flex-1 flex-col gap-1.5 rounded-xl border border-pp-primary/50 bg-black/90 p-2.5 shadow-lg ring-1 ring-pp-primary/30">
        <div className="h-1.5 w-10 rounded-full bg-pp-primary" />
        <div className="text-[10px] font-bold text-white">$29</div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Check className="size-2 text-emerald-400" />
            <div className="h-1 w-10 rounded-full bg-white/60" />
          </div>
          <div className="flex items-center gap-1">
            <Check className="size-2 text-emerald-400" />
            <div className="h-1 w-8 rounded-full bg-white/60" />
          </div>
        </div>
        <div className="flex h-4 items-center justify-center rounded-md bg-white">
          <span className="text-[7px] font-bold text-black">Upgrade</span>
        </div>
      </div>

      {/* Tier 3 */}
      <div className="flex flex-1 flex-col gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-2">
        <div className="h-1.5 w-10 rounded-full bg-white/60" />
        <div className="text-[9px] font-bold text-white">$99</div>
        <div className="h-1 w-full rounded-full bg-white/20" />
        <div className="h-1 w-4/5 rounded-full bg-white/20" />
      </div>
    </div>
  )
}

// 7. Dashboard Overview Schematic
export function DashboardOverviewSchematic() {
  return (
    <div className="flex h-full w-full gap-2 p-2">
      {/* Mini Sidebar */}
      <div className="flex w-10 flex-col gap-1.5 rounded-lg border border-white/10 bg-black/60 p-1.5">
        <div className="size-3 rounded-md bg-white/40" />
        <div className="mt-2 flex flex-col gap-1">
          <div className="h-1.5 w-full rounded-full bg-white/80" />
          <div className="h-1.5 w-full rounded-full bg-white/20" />
          <div className="h-1.5 w-full rounded-full bg-white/20" />
        </div>
      </div>

      {/* Main Dashboard Canvas */}
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.03] p-1.5">
          <div className="h-1.5 w-16 rounded-full bg-white/60" />
          <div className="size-3 rounded-full bg-white/20" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="rounded-md border border-white/10 bg-white/[0.04] p-1.5">
            <span className="text-[6px] text-white/40">Users</span>
            <div className="text-[8px] font-bold text-white">48.2k</div>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.04] p-1.5">
            <span className="text-[6px] text-white/40">MRR</span>
            <div className="text-[8px] font-bold text-emerald-400">+$14.2k</div>
          </div>
        </div>

        {/* Mini Area Chart */}
        <div className="flex flex-1 items-end gap-1 rounded-md border border-white/10 bg-black/40 p-1.5">
          {[40, 65, 55, 90, 75, 100, 85].map((h, idx) => (
            <div
              key={idx}
              className="flex-1 rounded-t-xs bg-pp-primary/80"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// 8. Feature Grid Schematic
export function FeatureGridSchematic() {
  return (
    <div className="grid h-full w-full grid-cols-3 gap-2 p-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex flex-col justify-between rounded-xl border border-white/15 bg-white/[0.03] p-2.5 transition-colors hover:border-white/30"
        >
          <div className="size-5 rounded-lg bg-white/15" />
          <div className="flex flex-col gap-1">
            <div className="h-2 w-12 rounded-full bg-white/80" />
            <div className="h-1 w-full rounded-full bg-white/25" />
            <div className="h-1 w-4/5 rounded-full bg-white/20" />
          </div>
        </div>
      ))}
    </div>
  )
}

// 9. CTA Banner Schematic
export function CtaBannerSchematic() {
  return (
    <div className="flex h-full w-full items-center justify-between rounded-xl border border-white/20 bg-gradient-to-r from-pp-primary/20 via-black/80 to-blue-500/20 p-4 shadow-xl">
      <div className="flex flex-col gap-1.5">
        <div className="h-3 w-28 rounded-full bg-white/90 font-bold" />
        <div className="h-1.5 w-36 rounded-full bg-white/40" />
      </div>
      <div className="flex h-7 items-center justify-center rounded-lg bg-white px-3 shadow-lg">
        <span className="text-[9px] font-bold text-black">Start free</span>
      </div>
    </div>
  )
}

// 10. Testimonial Cards Schematic
export function TestimonialCardsSchematic() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-2 p-3">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="flex flex-1 flex-col gap-2 rounded-xl border border-white/15 bg-white/[0.03] p-3 shadow-md"
        >
          <div className="flex gap-0.5 text-amber-400">
            {[0, 1, 2, 3, 4].map((s) => (
              <Star key={s} className="size-2 fill-current" />
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-1.5 w-full rounded-full bg-white/70" />
            <div className="h-1.5 w-4/5 rounded-full bg-white/40" />
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <div className="size-4 rounded-full bg-white/20" />
            <div className="h-1.5 w-12 rounded-full bg-white/80" />
          </div>
        </div>
      ))}
    </div>
  )
}

// 11. Ecommerce Product Grid Schematic
export function ProductGridSchematic() {
  return (
    <div className="grid h-full w-full grid-cols-3 gap-2 p-2.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex flex-col justify-between rounded-lg border border-white/15 bg-white/[0.03] p-1.5"
        >
          <div className="h-14 w-full rounded-md bg-white/10" />
          <div className="flex flex-col gap-1 pt-1.5">
            <div className="h-1.5 w-10 rounded-full bg-white/70" />
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold text-white">$120</span>
              <div className="size-3 rounded-xs bg-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// 12. FAQ Accordion Block Schematic
export function FaqAccordionBlockSchematic() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-1.5 p-3">
      {[{ open: true }, { open: false }, { open: false }].map((faq, idx) => (
        <div
          key={idx}
          className={`flex flex-col rounded-lg border p-2 ${
            faq.open
              ? "border-white/20 bg-white/[0.06]"
              : "border-white/10 bg-white/[0.02]"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="h-1.5 w-24 rounded-full bg-white/80" />
            <span className="text-[10px] text-white/50">
              {faq.open ? "−" : "+"}
            </span>
          </div>
          {faq.open && (
            <div className="flex flex-col gap-1 pt-2">
              <div className="h-1 w-full rounded-full bg-white/30" />
              <div className="h-1 w-3/4 rounded-full bg-white/20" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// 13. Stats & Metrics Schematic
export function StatsMetricsSchematic() {
  return (
    <div className="grid h-full w-full grid-cols-2 gap-2 p-3">
      {[
        { val: "99.9%", label: "Uptime SLA" },
        { val: "120K+", label: "Active Devs" },
        { val: "10x", label: "Faster Build" },
        { val: "24/7", label: "Support" },
      ].map((stat, idx) => (
        <div
          key={idx}
          className="flex flex-col justify-center rounded-xl border border-white/15 bg-white/[0.03] p-2.5"
        >
          <span className="text-sm font-black text-white">{stat.val}</span>
          <span className="text-[8px] text-white/50">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

export function RenderBlockSchematic({ type }: { type: BlockSchematicType }) {
  switch (type) {
    case "not-found-brick":
      return <NotFoundBrickSchematic />
    case "social-proof-logos":
      return <SocialProofLogosSchematic />
    case "social-links-grid":
      return <SocialLinksGridSchematic />
    case "benefits-alternating":
      return <BenefitsAlternatingSchematic />
    case "hero-marketing":
      return <HeroMarketingSchematic />
    case "pricing-matrix":
      return <PricingMatrixSchematic />
    case "dashboard-overview":
      return <DashboardOverviewSchematic />
    case "feature-grid":
      return <FeatureGridSchematic />
    case "cta-banner":
      return <CtaBannerSchematic />
    case "testimonial-cards":
      return <TestimonialCardsSchematic />
    case "product-grid":
      return <ProductGridSchematic />
    case "faq-accordion":
      return <FaqAccordionBlockSchematic />
    case "stats-metrics":
      return <StatsMetricsSchematic />
    default:
      return null
  }
}
