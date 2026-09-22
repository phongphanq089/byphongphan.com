import { Check, Copy, Palette, Ruler, Type } from "lucide-react"
import { useState } from "react"

import { GridContainer } from "@/app/layouts"
import { Badge } from "@/shared/ui/core"

import {
  COLOPHON_COLOR_TOKENS,
  COLOPHON_FONT_SPECIMENS,
  COLOPHON_SPACING_TOKENS,
} from "../colophon-data"

export function ColophonDesignSystem() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const handleCopy = (text: string, token: string) => {
    navigator.clipboard.writeText(text)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 1500)
  }

  // Split color tokens into rows of 2
  const colorRow1 = COLOPHON_COLOR_TOKENS.slice(0, 2)
  const colorRow2 = COLOPHON_COLOR_TOKENS.slice(2, 4)

  return (
    <>
      {/* Section Header + Color Tokens Label */}
      <GridContainer
        borderBottom={true}
        showCrosshairs={true}
        className="p-4 md:p-8"
      >
        <div className="space-y-8">
          <div className="space-y-2">
            <span className="font-mono text-xs tracking-wider text-pp-primary uppercase">
              02 / TOKENS
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Design Tokens &amp; Colors
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Palette className="size-4 text-pp-primary" />
            <h3 className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              01. Color Tokens &amp; Theme Palettes
            </h3>
          </div>
        </div>
      </GridContainer>

      {/* Color Tokens — Row 1 */}
      <GridContainer columns={2} borderBottom={true} showCrosshairs={true}>
        {colorRow1.map((token) => {
          const isCopied = copiedToken === token.variable
          return (
            <div key={token.name} className="group p-5 sm:p-6">
              <div
                className="h-20 w-full rounded-lg border border-border/40"
                style={{ backgroundColor: token.swatchColor }}
              />
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">
                    {token.name}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleCopy(token.oklchDark, token.variable)}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    title="Copy OKLCH value"
                    aria-label={`Copy ${token.name} color value`}
                  >
                    {isCopied ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
                <p className="font-mono text-xs text-muted-foreground">
                  {token.variable}
                </p>
                <p className="font-mono text-xs text-muted-foreground/70">
                  {token.oklchDark}
                </p>
                <p className="text-xs text-muted-foreground/60">
                  {token.description}
                </p>
              </div>
            </div>
          )
        })}
      </GridContainer>

      {/* Color Tokens — Row 2 */}
      <GridContainer columns={2} borderBottom={true} showCrosshairs={true}>
        {colorRow2.map((token) => {
          const isCopied = copiedToken === token.variable
          return (
            <div key={token.name} className="group p-5 sm:p-6">
              <div
                className="h-20 w-full rounded-lg border border-border/40"
                style={{ backgroundColor: token.swatchColor }}
              />
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">
                    {token.name}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleCopy(token.oklchDark, token.variable)}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    title="Copy OKLCH value"
                    aria-label={`Copy ${token.name} color value`}
                  >
                    {isCopied ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
                <p className="font-mono text-xs text-muted-foreground">
                  {token.variable}
                </p>
                <p className="font-mono text-xs text-muted-foreground/70">
                  {token.oklchDark}
                </p>
                <p className="text-xs text-muted-foreground/60">
                  {token.description}
                </p>
              </div>
            </div>
          )
        })}
      </GridContainer>

      {/* Typography Label */}
      <GridContainer
        borderBottom={true}
        showCrosshairs={true}
        className="p-4 md:p-8"
      >
        <div className="flex items-center gap-2">
          <Type className="size-4 text-primary" />
          <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            02. Typography Specimens
          </h3>
        </div>
      </GridContainer>

      {/* Typography — 3 col grid */}
      <GridContainer columns={3} borderBottom={true} showCrosshairs={true}>
        {COLOPHON_FONT_SPECIMENS.map((specimen) => (
          <div
            key={specimen.name}
            className="flex h-full flex-col justify-between p-5 sm:p-6"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className="font-mono text-[10px]">
                  {specimen.badge}
                </Badge>
                <span className="text-[11px] text-muted-foreground">
                  {specimen.foundry}
                </span>
              </div>

              <div className="mt-4 space-y-1">
                <h4 className="text-lg font-bold text-foreground">
                  {specimen.name}
                </h4>
                <p className="text-xs text-muted-foreground">{specimen.role}</p>
              </div>

              <div className="mt-6 rounded-md border border-border/40 bg-background/60 p-3">
                <p
                  className={`text-sm leading-relaxed text-foreground/90 ${specimen.cssClass}`}
                >
                  {specimen.previewText}
                </p>
                <p
                  className={`mt-2 text-xs break-all text-muted-foreground/60 ${specimen.cssClass}`}
                >
                  {specimen.sampleGlyphs}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-1.5 border-t border-border/40 pt-3">
              {specimen.weights.map((weight) => (
                <span
                  key={weight}
                  className="rounded bg-muted/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                >
                  {weight}
                </span>
              ))}
            </div>
          </div>
        ))}
      </GridContainer>

      {/* Spacing Label */}
      <GridContainer
        borderBottom={true}
        showCrosshairs={true}
        className="px-4 md:px-8"
      >
        <div className="flex items-center gap-2 py-4">
          <Ruler className="size-4 text-pp-primary" />
          <h3 className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            03. Spacing &amp; Radius
          </h3>
        </div>
      </GridContainer>

      {/* Spacing Token Rows */}
      {COLOPHON_SPACING_TOKENS.map((token, index) => (
        <GridContainer
          key={token.variable}
          borderBottom={true}
          showCrosshairs={index === COLOPHON_SPACING_TOKENS.length - 1}
          className="px-4 md:px-8"
        >
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-medium text-foreground">
                {token.name}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {token.variable}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-muted-foreground/60 sm:inline">
                {token.description}
              </span>
              <span className="font-mono text-xs text-foreground">
                {token.value}
              </span>
            </div>
          </div>
        </GridContainer>
      ))}
    </>
  )
}
