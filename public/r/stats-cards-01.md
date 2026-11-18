# Stats Cards 01

> Overlapping interactive marketing stats cards with spring physics hover, metrics showcase, and dark mode support.

## Installation

```bash
npx shadcn@latest add https://byphongphan.com/r/stats-cards-01.json
```

## Source Code

### `block/stats-cards-01/page.tsx`

```tsx
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

```

### `block/stats-cards-01/components/stats-cards.tsx`

```tsx
import { domAnimation, LazyMotion, m } from "motion/react"

import { cn } from "@/lib/utils"

export interface StatsCardsProps {
  className?: string
  width?: string
  height?: string
  images?: string[]
}

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
]

export function StatsCards({
  className,
  width = "w-[240px] sm:w-[270px] md:w-[290px] lg:w-[310px]",
  height = "h-[350px] sm:h-[390px] md:h-[420px] lg:h-[440px]",
  images = DEFAULT_IMAGES,
}: StatsCardsProps) {
  const img1 = images[0] || DEFAULT_IMAGES[0]
  const img2 = images[1] || DEFAULT_IMAGES[1]

  return (
    <LazyMotion features={domAnimation}>
      {/* Outer viewport container with generous vertical breathing room for rotations & lift */}
      <div
        className={cn(
          "relative w-full overflow-x-auto overflow-y-visible px-4 py-12 select-none sm:px-8 sm:py-16",
          className
        )}
      >
        {/* Fan deck row: strictly flex-nowrap to keep cards organically overlapping */}
        <div className="mx-auto flex min-w-max flex-nowrap items-center justify-start px-4 py-8 md:min-w-0 md:justify-center">
          {/* ── Card 1: Revenue Driven (Signature Crisp White Card) ── */}
          <m.div
            className={cn(
              `relative z-10 ${width} ${height} flex shrink-0 flex-col justify-between rounded-[28px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-shadow hover:z-50 sm:p-7`,
              "border border-black/[0.06] bg-white text-[#FF4400] shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:border-white/10 dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
            )}
            initial={{ rotate: -5, y: 0 }}
            whileHover={{
              rotate: 0,
              scale: 1.05,
              y: -12,
              transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            <div>
              <span className="text-4xl font-bold tracking-tighter text-[#FF4400] sm:text-5xl lg:text-6xl">
                $100k+
              </span>
            </div>
            <div>
              <h4 className="text-base font-semibold tracking-tight text-[#FF4400] sm:text-lg">
                Revenue driven
              </h4>
              <div className="my-2.5 h-px w-full bg-[#FF4400]/25" />
              <p className="max-w-[92%] text-xs leading-snug font-medium tracking-tight text-[#FF4400]/85 sm:text-sm">
                From scroll-stopping campaigns that actually sell.
              </p>
            </div>
          </m.div>

          {/* ── Card 2: Image Stats (Liked) ── */}
          <m.div
            className={cn(
              `group relative z-20 ${width} ${height} -ml-10 shrink-0 overflow-hidden rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-shadow hover:z-50 sm:-ml-12 md:-ml-14 lg:-ml-16`,
              "border border-black/5 dark:border-white/10 dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
            )}
            initial={{ rotate: 1, y: -4 }}
            whileHover={{
              rotate: 0,
              scale: 1.05,
              y: -12,
              transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            <img
              src={img1}
              alt="Editorial campaign showcase"
              className="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute top-5 left-5 rounded-full border border-black/5 bg-white/95 px-3.5 py-1.5 text-xs font-semibold tracking-tight text-zinc-900 shadow-sm backdrop-blur-md">
              900k Liked
            </div>
          </m.div>

          {/* ── Card 3: Organic Impressions (Signature Vibrant Orange Card) ── */}
          <m.div
            className={cn(
              `relative z-30 ${width} ${height} -ml-10 flex shrink-0 flex-col justify-between rounded-[28px] bg-[#FF4400] p-6 shadow-[0_25px_60px_rgba(255,68,0,0.35)] transition-shadow hover:z-50 sm:-ml-12 sm:p-7 md:-ml-14 lg:-ml-16`,
              "border border-white/15 dark:shadow-[0_25px_60px_rgba(255,68,0,0.25)]"
            )}
            initial={{ rotate: 7, y: -8 }}
            whileHover={{
              rotate: 0,
              scale: 1.05,
              y: -12,
              transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            <div>
              <span className="text-4xl font-bold tracking-tighter text-white sm:text-5xl lg:text-6xl">
                37M+
              </span>
            </div>
            <div>
              <h4 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                Organic impressions
              </h4>
              <div className="my-2.5 h-px w-full bg-white/30" />
              <p className="max-w-[92%] text-xs leading-snug font-medium tracking-tight text-white/90 sm:text-sm">
                Growth through content that sells, not just trends.
              </p>
            </div>
          </m.div>

          {/* ── Card 4: Image Stats (Viewed) ── */}
          <m.div
            className={cn(
              `group relative z-40 ${width} ${height} -ml-10 shrink-0 overflow-hidden rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-shadow hover:z-50 sm:-ml-12 md:-ml-14 lg:-ml-16`,
              "border border-black/5 dark:border-white/10 dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
            )}
            initial={{ rotate: -3, y: 4 }}
            whileHover={{
              rotate: 0,
              scale: 1.05,
              y: -12,
              transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            <img
              src={img2}
              alt="Campaign creative visual"
              className="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute right-5 bottom-5 rounded-full border border-black/5 bg-white/95 px-3.5 py-1.5 text-xs font-semibold tracking-tight text-zinc-900 shadow-sm backdrop-blur-md">
              1.5M Viewed
            </div>
          </m.div>
        </div>
      </div>
    </LazyMotion>
  )
}

```
