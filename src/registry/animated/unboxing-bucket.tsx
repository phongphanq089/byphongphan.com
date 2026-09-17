/* eslint-disable react-hooks/set-state-in-effect */
import { ShieldCheck, Sparkles, Users, Zap } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import React, { useEffect, useState } from "react"

import { useIsMobile } from "@/registry/hooks/use-media-query"
import { cn } from "@/shared/lib/utils"

export interface UnboxingChipItem {
  id: number | string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

export interface UnboxingBucketProps {
  chips?: UnboxingChipItem[]
  intervalMs?: number
  className?: string
}

const DEFAULT_CHIPS: UnboxingChipItem[] = [
  {
    id: 1,
    title: "Production Ready",
    description: "Fully type-safe & rigorously tested",
    icon: ShieldCheck,
  },
  {
    id: 2,
    title: "Fluid Motion",
    description: "60fps physics & spring animations",
    icon: Zap,
  },
  {
    id: 3,
    title: "Accessible Primitives",
    description: "Radix UI & keyboard compliance",
    icon: Users,
  },
  {
    id: 4,
    title: "Modern UI Craft",
    description: "Tailwind v4 & React 19 architecture",
    icon: Sparkles,
  },
]

export function UnboxingBucket({
  chips = DEFAULT_CHIPS,
  intervalMs = 2600,
  className,
}: UnboxingBucketProps) {
  const [items, setItems] = useState<UnboxingChipItem[]>(chips)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (chips.length <= 1) return
    setItems(chips)
  }, [chips])

  useEffect(() => {
    if (items.length <= 1) return

    const timer = setInterval(() => {
      setItems((prev) => {
        const [first, ...rest] = prev
        return [...rest, first]
      })
    }, intervalMs)

    return () => clearInterval(timer)
  }, [items.length, intervalMs])

  return (
    <div
      className={cn(
        "relative flex h-fit w-full flex-col items-center justify-center select-none",
        className
      )}
    >
      <div
        className="relative isolate w-full max-w-[460px] sm:max-w-[540px]"
        style={{ aspectRatio: "655/352" }}
      >
        {/* Subtle ambient core glow emerging from inside the box */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/4 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl dark:bg-primary/30"
        />

        {/* â”€â”€â”€ Layer 1: Background Box Flaps (Behind the animated chip) â”€â”€â”€ */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 655 352"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 z-0"
        >
          {/* Left Flap */}
          <path
            d="M123.116 79.1145L171.548 42.8776L97.2715 12.5164C94.8305 11.5186 93.61 11.0197 92.3446 11.1143C91.0793 11.2089 89.9465 11.8837 87.681 13.2334L56.155 32.0149C48.1832 36.7641 44.1973 39.1386 44.4205 42.4378C44.6438 45.737 48.9132 47.553 57.4522 51.1849L123.116 79.1145Z"
            className="fill-foreground/20 stroke-border/40 dark:fill-white/25"
            strokeWidth="1"
          />

          {/* Right Flap */}
          <path
            d="M535.59 78.7427L487.973 42.8776L558.738 13.9516C562.902 12.2494 564.984 11.3984 567.143 11.5597C569.301 11.7211 571.233 12.8723 575.098 15.1747L590.22 24.1832C603.923 32.347 610.775 36.4289 610.372 42.0779C609.97 47.7269 602.609 50.7964 587.887 56.9354L535.59 78.7427Z"
            className="fill-foreground/20 stroke-border/40 dark:fill-white/25"
            strokeWidth="1"
          />

          {/* Back Wall of Cavity */}
          <path
            d="M487.973 42.8774L171.548 42.8775L123.116 79.1144L535.59 78.7424L487.973 42.8774Z"
            className="fill-muted-foreground/25 stroke-border/30 dark:fill-white/10"
            strokeWidth="1"
          />

          {/* Left Inside Corner Fold */}
          <path
            d="M171.548 78.9088V42.8774L123.116 79.1144L171.548 78.9088Z"
            className="fill-foreground/15 dark:fill-white/15"
          />

          {/* Right Inside Corner Fold */}
          <path
            d="M487.973 78.9088V42.8774L536.404 79.1144L487.973 78.9088Z"
            className="fill-foreground/15 dark:fill-white/15"
          />
        </svg>

        {/* â”€â”€â”€ Layer 2: Animated Floating Chip (Sandwiched in the middle) â”€â”€â”€ */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div
            className="relative flex h-full w-full items-center justify-center"
            style={{ paddingBottom: "56%" }}
          >
            <AnimatePresence mode="popLayout">
              {items.map((chip, index) => {
                if (index !== 0) return null
                const Icon = chip.icon

                return (
                  <motion.div
                    key={chip.id}
                    initial={{
                      y: isMobile ? 80 : 100, // Starts tucked inside the box opening
                      opacity: 0,
                      scale: 0.85,
                    }}
                    animate={{
                      y: 0, // Ascends above the opening and floats
                      opacity: 1,
                      scale: isMobile ? 0.95 : 1.15,
                      transition: {
                        duration: 0.65,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    }}
                    exit={{
                      y: isMobile ? -50 : -75, // Floats upward into the atmosphere and dissolves
                      opacity: 0,
                      scale: 0.9,
                      transition: {
                        duration: 0.5,
                        ease: [0.4, 0, 1, 1],
                      },
                    }}
                    className="pointer-events-auto absolute flex w-[265px] items-center gap-3 rounded-full border border-border/80 bg-card/95 p-2 shadow-2xl backdrop-blur-md transition-shadow"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary shadow-xs">
                      <Icon className="size-5" />
                    </div>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-xs font-bold tracking-tight text-foreground">
                        {chip.title}
                      </span>
                      <span className="truncate text-[11px] text-muted-foreground">
                        {chip.description}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* â”€â”€â”€ Layer 3: Foreground Box Body (Front face covering the lower chip) â”€â”€â”€ */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 655 352"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
        >
          {/* Main Front Body */}
          <path
            d="M512.766 79.1595L147.766 79.1624C136.453 79.1625 130.796 79.1626 127.281 82.6773C123.766 86.192 123.766 91.8488 123.766 103.162V327.159C123.766 338.473 123.766 344.13 127.281 347.645C130.796 351.159 136.453 351.159 147.766 351.159H512.766C524.08 351.159 529.737 351.159 533.252 347.645C536.766 344.13 536.766 338.473 536.766 327.159V103.159C536.766 91.8457 536.766 86.1888 533.252 82.6741C529.737 79.1594 524.08 79.1594 512.766 79.1595Z"
            className="fill-card stroke-border/90"
            strokeWidth="1.5"
          />

          {/* Front Dropped Lip / Flap */}
          <path
            d="M74.6011 164.033L123.116 79.1138L535.59 78.7419L581.532 164.469C588.006 176.55 591.243 182.59 588.568 187.06C585.892 191.529 579.039 191.529 565.333 191.529H90.5591C76.4759 191.529 69.4343 191.529 66.7781 186.953C64.1219 182.376 67.615 176.262 74.6011 164.033Z"
            className="fill-foreground/15 stroke-border/40 dark:fill-white/20"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  )
}
