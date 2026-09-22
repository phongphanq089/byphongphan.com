import { ArrowDownRight } from "lucide-react"

import { GridContainer } from "@/app/layouts"
import { PPMarkIsometric } from "@/shared/ui"
import TextBurnNeon from "@/shared/ui/animation/text-burn-neon"
import { StripedPattern } from "@/shared/ui/system"

export default function BannerHero() {
  return (
    <>
      <StripedPattern
        variant="absolute"
        className="opacity-40 dark:opacity-20"
      />

      <GridContainer
        borderBottom={true}
        borderLeft={true}
        borderRight={true}
        showCrosshairs={false}
        className="relative z-10"
      >
        <div className="flex items-center justify-end gap-3 px-4 py-3 text-xs text-muted-foreground/80 sm:px-8">
          <span className="font-semibold tracking-widest text-foreground/80 uppercase">
            PHONG PHAN
          </span>
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
            FRONTEND / UI ENGINEER
          </span>
        </div>
      </GridContainer>

      <div className="w-ful relative z-10 mx-auto my-4 max-w-[1400px] px-4 md:px-8">
        <div className="group relative mx-auto flex flex-col items-center justify-center">
          {/* Left Column — Title + Disciplines */}
          <div className="absolute top-12 left-0 flex flex-col gap-2.5 text-[11px] text-muted-foreground/80 sm:top-20">
            <div className="relative z-10 mx-auto mb-6 flex flex-col select-none">
              <h1 className="text-3xl leading-[0.88] font-black tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                FRONTEND
              </h1>
              <TextBurnNeon className="mt-1 text-3xl leading-[0.88] font-black tracking-tighter text-primary sm:text-5xl md:text-6xl lg:text-7xl">
                ENGINEER
              </TextBurnNeon>
            </div>

            <span className="text-[10px] font-bold tracking-widest text-primary/80 uppercase">
              DISCIPLINES
            </span>
            <div className="flex flex-col gap-1.5 text-foreground/70 max-xs:text-[10px]">
              <span className="transition-colors hover:text-primary">
                INTERACTIVE UI & MOTION
              </span>
              <span className="transition-colors hover:text-primary">
                DESIGN SYSTEMS & TOKENS
              </span>
              <span className="transition-colors hover:text-primary">
                FULL-STACK CAPABILITY
              </span>
            </div>
          </div>

          {/* Isometric Logo */}
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
            <PPMarkIsometric />
          </div>
        </div>
      </div>

      {/* Tagline */}
      <GridContainer
        borderTop={true}
        borderBottom={true}
        borderLeft={true}
        borderRight={true}
        showCrosshairs={false}
        className="relative z-10"
      >
        <div className="mx-auto max-w-xl px-4 py-4 text-center sm:px-8">
          <p className="text-xs leading-relaxed tracking-wide text-muted-foreground sm:text-sm">
            CRAFTING HIGH-PERFORMANCE INTERFACES, DELIGHTFUL MICRO-INTERACTIONS
            &amp; THOUGHTFULLY ENGINEERED WEB EXPERIENCES.
          </p>
        </div>
      </GridContainer>

      {/* Footer — Portfolio Year + Recent Work */}
      <GridContainer
        columns={2}
        borderBottom={false}
        borderLeft={true}
        borderRight={true}
        showCrosshairs={false}
        className="relative z-10"
      >
        <div className="flex items-center gap-3 px-4 py-4 text-[11px] text-muted-foreground sm:px-8">
          <div className="flex flex-col text-center">
            <span className="font-semibold text-foreground">
              PORTFOLIO &apos;26
            </span>
            <span className="text-[10px] text-muted-foreground/70">
              CRAFTED WITH PRECISION
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end justify-center px-4 py-4 text-right sm:px-8">
          <div className="flex items-center gap-1.5 text-[10px] tracking-widest text-muted-foreground uppercase">
            <span>RECENT WORK</span>
            <ArrowDownRight className="h-3 w-3 text-primary" />
          </div>
          <span className="text-xs font-semibold tracking-tight text-foreground uppercase sm:text-sm">
            CRAFTED WITH PRECISION
          </span>
        </div>
      </GridContainer>
    </>
  )
}
