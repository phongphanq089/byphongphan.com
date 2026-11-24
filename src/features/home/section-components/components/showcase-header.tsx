import { ArrowRightIcon } from "@phosphor-icons/react"
import { Link } from "@tanstack/react-router"

import { playClickSound, playHoverSound } from "@/shared/lib/sound"
import { cn } from "@/shared/lib/utils"
import TextBurnNeon from "@/shared/ui/animation/text-burn-neon"
import UnderlineToBackground from "@/shared/ui/animation/underline-to-background"

import type { ShowcaseHeaderProps } from "../types"

export function ShowcaseHeader({
  romanIndex = "III",
  title = "UI COMPONENTS SHOWCASE",
  subtitle = "INTERACTIVE PRIMITIVES • SHADERS • TACTILE PHYSICS",
  catalogHref = "/ui/$collection",
  className,
}: ShowcaseHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 flex w-full justify-between border-b border-border px-4 pb-6 select-none max-md:flex-col max-md:gap-3 sm:px-6 md:items-center md:px-8 xl:px-10 2xl:px-12",
        className
      )}
    >
      <div className="flex gap-2 text-xs whitespace-nowrap max-lg:flex-col md:items-center">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-serif text-lg font-medium text-pp-secondary italic">
            {romanIndex}
          </span>
          <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            <TextBurnNeon>{title}</TextBurnNeon>
          </span>
        </div>
        <span className="hidden text-muted-foreground/40 lg:inline">•</span>
        <span className="mt-1 inline text-[10px] text-muted-foreground">
          {subtitle}
        </span>
      </div>

      <Link
        to={catalogHref}
        params={{ collection: "base" }}
        onMouseEnter={() => playHoverSound()}
        onClick={() => playClickSound()}
      >
        <UnderlineToBackground
          targetTextColor="var(--background)"
          className="font-medium whitespace-nowrap text-foreground/80 transition-colors group-hover:text-foreground"
        >
          <span className="flex items-center gap-2">
            EXPLORE UI
            <ArrowRightIcon size={18} />
          </span>
        </UnderlineToBackground>
      </Link>
    </div>
  )
}

export default ShowcaseHeader
