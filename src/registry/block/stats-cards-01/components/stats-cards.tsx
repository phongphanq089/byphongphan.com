import { domAnimation, LazyMotion, m } from "motion/react"

import { cn } from "@/shared/lib/utils"

export interface StatsCardsProps {
  className?: string
  width?: string
  height?: string
  images?: string[]
}

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
]

export function StatsCards({
  className,
  width = "w-[210px] sm:w-[240px] md:w-[260px] lg:w-[280px]",
  height = "h-[300px] sm:h-[330px] md:h-[350px] lg:h-[360px]",
  images = DEFAULT_IMAGES,
}: StatsCardsProps) {
  const img1 = images[0] || DEFAULT_IMAGES[0]
  const img2 = images[1] || DEFAULT_IMAGES[1]

  return (
    <LazyMotion features={domAnimation}>
      {/* Outer container with generous padding to prevent hover shadows/rotations from clipping */}
      <div
        className={cn(
          "relative w-full overflow-x-auto overflow-y-visible px-4 py-12 select-none sm:px-8 sm:py-16",
          "rounded-3xl border border-orange-200/50 bg-orange-50/70 backdrop-blur-sm transition-colors",
          "dark:border-orange-500/10 dark:bg-zinc-950/40",
          className
        )}
      >
        {/* Strictly flex-nowrap to completely prevent row wrapping on any screen size */}
        <div className="mx-auto flex min-w-max flex-nowrap items-center justify-start md:min-w-0 md:justify-center">
          {/* ── Card 1: Revenue Driven ── */}
          <m.div
            className={cn(
              `relative z-10 ${width} ${height} flex shrink-0 flex-col justify-between rounded-[16px] p-5 shadow-xl transition-shadow hover:z-50`,
              "border border-orange-100 bg-white dark:border-zinc-800 dark:bg-zinc-900/90 dark:shadow-2xl dark:shadow-black/60"
            )}
            initial={{ rotate: -3 }}
            whileHover={{
              rotate: 0,
              scale: 1.05,
              y: -8,
              transition: { duration: 0.25, ease: "easeOut" },
            }}
          >
            <div>
              <h2 className="text-4xl font-semibold tracking-tighter text-[#FF4400] sm:text-5xl">
                $100k+
              </h2>
            </div>
            <div>
              <h4 className="text-base leading-tight font-medium tracking-tighter text-[#FF4400] sm:text-lg">
                Revenue driven
              </h4>
              <div className="my-2 h-px w-full bg-[#FF4400]/30 dark:bg-[#FF4400]/40" />
              <p className="max-w-[90%] text-xs leading-tight tracking-tight text-[#FF4400]/90 sm:text-sm dark:text-[#FF4400]">
                From scroll-stopping campaigns that actually sell.
              </p>
            </div>
          </m.div>

          {/* ── Card 2: Image Stats (Liked) ── */}
          <m.div
            className={cn(
              `group relative z-20 ${width} ${height} -ml-10 shrink-0 overflow-hidden rounded-[16px] shadow-xl transition-shadow hover:z-50 sm:-ml-12 md:-ml-14 lg:-ml-16`,
              "border border-black/5 dark:border-white/10 dark:shadow-2xl dark:shadow-black/60"
            )}
            initial={{ rotate: 2, y: 1 }}
            whileHover={{
              rotate: 0,
              scale: 1.05,
              y: -8,
              transition: { duration: 0.25, ease: "easeOut" },
            }}
          >
            <img
              src={img1}
              alt="Campaign model showcase"
              className="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute top-5 left-5 rounded-full border border-black/5 bg-white/90 px-2.5 py-1 text-xs font-semibold tracking-tighter text-black shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/80 dark:text-white">
              900k Liked
            </div>
          </m.div>

          {/* ── Card 3: Organic Impressions (Signature Orange Card) ── */}
          <m.div
            className={cn(
              `relative z-30 ${width} ${height} -ml-10 flex shrink-0 flex-col justify-between rounded-[16px] bg-[#FF4400] p-5 shadow-2xl shadow-orange-600/30 transition-shadow hover:z-50 sm:-ml-12 md:-ml-14 lg:-ml-16`,
              "border border-orange-400/40"
            )}
            initial={{ rotate: 8 }}
            whileHover={{
              rotate: 0,
              scale: 1.03,
              y: -8,
              transition: { duration: 0.25, ease: "easeOut" },
            }}
          >
            <div>
              <h2 className="text-4xl font-semibold tracking-tighter text-white sm:text-5xl">
                37M+
              </h2>
            </div>
            <div>
              <h4 className="text-base leading-tight font-medium tracking-tighter text-white sm:text-lg">
                Organic impressions
              </h4>
              <div className="my-2 h-px w-full bg-white/30" />
              <p className="max-w-[90%] text-xs leading-tight tracking-tight text-white/90 sm:text-sm">
                Growth through content that sells, not just trends.
              </p>
            </div>
          </m.div>

          {/* ── Card 4: Image Stats (Viewed) ── */}
          <m.div
            className={cn(
              `group relative z-40 ${width} ${height} -ml-10 shrink-0 overflow-hidden rounded-[16px] shadow-xl transition-shadow hover:z-50 sm:-ml-12 md:-ml-14 lg:-ml-16`,
              "border border-black/5 dark:border-white/10 dark:shadow-2xl dark:shadow-black/60"
            )}
            initial={{ rotate: -4 }}
            whileHover={{
              rotate: 0,
              scale: 1.05,
              y: -8,
              transition: { duration: 0.25, ease: "easeOut" },
            }}
          >
            <img
              src={img2}
              alt="Campaign creative visual"
              className="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute right-5 bottom-5 rounded-full border border-black/5 bg-white/90 px-2.5 py-1 text-xs font-semibold tracking-tighter text-black shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/80 dark:text-white">
              1.5M Viewed
            </div>
          </m.div>
        </div>
      </div>
    </LazyMotion>
  )
}
