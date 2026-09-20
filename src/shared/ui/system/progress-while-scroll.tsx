import NumberFlow from "@number-flow/react"
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react"
import { useState } from "react"

import { cn } from "@/shared/lib"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/core"

const ProgressWhileScroll = () => {
  const { scrollYProgress } = useScroll()
  const [progressPercent, setProgressPercent] = useState(0)

  const clampedProgress = useTransform(scrollYProgress, (value) =>
    Math.min(Math.max(value, 0), 1)
  )
  const progressAsPercent = useTransform(clampedProgress, (value) =>
    Math.round(value * 100)
  )

  useMotionValueEvent(progressAsPercent, "change", (value) => {
    setProgressPercent(value)
  })

  const svgRadius = 18
  const circumference = 2 * Math.PI * svgRadius

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const isScrolled = progressPercent > 0

  return (
    <motion.div
      drag
      dragMomentum={false}
      className={cn(
        "group relative cursor-grab items-center gap-1 active:cursor-grabbing"
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleScrollToTop}
            aria-label={isScrolled ? "Scroll to top" : "Scroll to explore"}
            className="relative flex size-12 items-center justify-center rounded-full border border-border/80 bg-background/80 shadow-[0_4px_20px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-200 hover:scale-105 hover:border-primary/50 active:scale-95 dark:border-white/15 dark:bg-[#121215]/90"
          >
            <svg
              className="pointer-events-none absolute size-10"
              viewBox="0 0 48 48"
              role="presentation"
            >
              <circle
                cx="24"
                cy="24"
                r={svgRadius}
                stroke="currentColor"
                strokeWidth="3"
                className="text-muted/40 dark:text-white/10"
                fill="none"
              />
              <motion.circle
                cx="24"
                cy="24"
                r={svgRadius}
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="text-primary drop-shadow-[0_0_6px_rgba(var(--primary),0.5)]"
                fill="none"
                strokeDasharray={`${circumference}`}
                style={{
                  pathLength: clampedProgress,
                  rotate: -90,
                  transformOrigin: "50% 50%",
                }}
              />
            </svg>

            {/* Number in the center */}
            <div className="relative z-10 flex items-center justify-center select-none">
              <NumberFlow
                value={progressPercent}
                className="text-[10px] font-bold tracking-tight text-foreground tabular-nums"
                suffix="%"
              />
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={8}>
          {isScrolled ? "Scroll to top" : "Scroll to explore"}
        </TooltipContent>
      </Tooltip>
    </motion.div>
  )
}

export default ProgressWhileScroll
