import { GridContainer } from "@/app/layouts"
import { cn } from "@/shared/lib"
import { StripedPattern } from "@/shared/ui"

import { COLOPHON_FONT_SPECIMENS, COLOR_TOKENS } from "../colophon-data"

export function ColophonDesignSystem() {
  return (
    <>
      <GridContainer
        borderBottom={true}
        showCrosshairs={true}
        className="relative px-4 py-2"
      >
        <StripedPattern variant="absolute" />
        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Design Tokens
        </h3>
      </GridContainer>

      <GridContainer
        borderBottom={true}
        showCrosshairs={true}
        className="p-3 md:px-4 md:py-2"
      >
        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          01. Color token
        </h3>
      </GridContainer>

      <GridContainer columns={2} borderBottom showCrosshairs className="w-full">
        {COLOR_TOKENS.map((token, idx) => (
          <div
            key={token.name}
            className={cn(
              "flex flex-col justify-between p-4 sm:p-6",
              idx % 2 === 0 ? "border-b border-border md:border-b-0" : "",
              idx < COLOR_TOKENS.length - 2
                ? "md:border-b md:border-border"
                : ""
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">
                  {token.name}
                </h3>
                <code className="text-xs text-pp-primary">
                  var({token.cssVar})
                </code>
                <p className="text-xs text-muted-foreground">
                  {token.description}
                </p>
              </div>
            </div>

            <div
              className={cn(
                "mt-4 flex h-20 w-full items-center justify-between rounded-lg p-3 shadow-inner sm:h-24 sm:p-4",
                token.bgClass,
                token.borderClass
              )}
            >
              <span className="rounded bg-black/40 px-2 py-1 text-[10px] text-white/90 backdrop-blur-md">
                {token.value}
              </span>
            </div>
          </div>
        ))}
      </GridContainer>

      <GridContainer
        borderBottom={true}
        showCrosshairs={true}
        className="p-3 md:px-4 md:py-2"
      >
        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          01. Typography
        </h3>
      </GridContainer>

      <GridContainer columns={2} borderBottom={true} showCrosshairs={true}>
        {COLOPHON_FONT_SPECIMENS.map((specimen) => (
          <div
            key={specimen.name}
            className="flex h-full flex-col justify-between p-5 sm:p-6"
          >
            <div className="mt-4 space-y-1">
              <h4 className="text-lg font-bold text-foreground">
                {specimen.name}
              </h4>
            </div>

            <div className="mt-2 rounded-md border border-border/40 bg-background/60 p-3">
              <p
                className={`mt-2 text-lg break-all text-muted-foreground/60 ${specimen.cssClass}`}
              >
                {specimen.sampleGlyphs}
              </p>
            </div>
          </div>
        ))}
      </GridContainer>
    </>
  )
}
