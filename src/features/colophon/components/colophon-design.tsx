import { Check, Copy, Palette, Type } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/shared/ui/core"

import {
  COLOPHON_COLOR_TOKENS,
  COLOPHON_FONT_SPECIMENS,
} from "../colophon-data"

export function ColophonDesign() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const handleCopy = (text: string, token: string) => {
    navigator.clipboard.writeText(text)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 1500)
  }

  return (
    <div className="space-y-12 py-10 sm:py-14">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs tracking-wider text-pp-primary uppercase">
            02 / VISUAL SYSTEM
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Design & Aesthetics
        </h2>
      </div>

      {/* Editorial Narrative (Matching User Reference Image 1) */}
      <div className="max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground sm:text-[17px]">
        <p>
          In terms of design and graphical content, I used three typefaces:{" "}
          <span className="font-semibold text-foreground">Geist Mono</span>,{" "}
          <span className="font-semibold text-foreground">
            Inter / System Sans
          </span>
          , and{" "}
          <span className="font-serif text-foreground italic">
            Playfair Display
          </span>
          .{" "}
          <span className="font-mono text-xs text-foreground">Geist Mono</span>{" "}
          by Vercel provides the structural backbone for technical coordinates,
          eyebrow tags, and code tokens. The body copy and titles rely on a
          clean, high-legibility sans-serif, while Playfair Display lends
          selective editorial warmth.
        </p>

        <p>
          The colors were engineered using modern{" "}
          <span className="font-medium text-foreground">OKLCH color math</span>,
          extracted from architectural blueprints and minimal editorial
          journals. The primary accent is a signature signal red (
          <span className="font-mono text-xs text-pp-primary">
            --pp-primary: oklch(0.985 0 0)
          </span>
          ) set against a deep carbon canvas, with hairline coordinate borders
          punctuated by dynamic crosshairs.
        </p>

        <p>
          For icons, I relied on{" "}
          <a
            href="https://lucide.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-pp-primary hover:decoration-pp-primary"
          >
            Lucide Icons
          </a>
          , which provide a crisp selection of SVG vector icons with consistent
          stroke weights and optical alignments. Custom brand glyphs—including
          the pixel-grid{" "}
          <span className="font-mono text-xs text-foreground">PPPixelMark</span>
          —were custom-drawn in code to unify the portfolio&apos;s identity.
        </p>
      </div>

      {/* Typography Specimen Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/50 pb-2">
          <Type className="size-4 text-pp-primary" />
          <h3 className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Typography Specimens
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {COLOPHON_FONT_SPECIMENS.map((specimen) => (
            <div
              key={specimen.name}
              className="flex h-full flex-col justify-between rounded-lg border border-border/60 bg-card/40 p-5 transition-colors hover:border-border"
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
                  <p className="text-xs text-muted-foreground">
                    {specimen.role}
                  </p>
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
        </div>
      </div>

      {/* Color System Tokens */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/50 pb-2">
          <Palette className="size-4 text-pp-primary" />
          <h3 className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Color Palette & OKLCH Architecture
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {COLOPHON_COLOR_TOKENS.map((token) => {
            const isCopied = copiedToken === token.variable

            return (
              <div
                key={token.name}
                className="group flex h-full flex-col justify-between rounded-lg border border-border/60 bg-card/40 p-4 transition-all duration-150 hover:border-border"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {token.variable}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(token.oklchDark, token.variable)
                      }
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

                  <h4 className="mt-2 text-sm font-semibold text-foreground">
                    {token.name}
                  </h4>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">
                    {token.description}
                  </p>
                </div>

                <div className="mt-4 space-y-1.5 border-t border-border/40 pt-3">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-muted-foreground">Dark:</span>
                    <span className="text-foreground">{token.oklchDark}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-muted-foreground">Light:</span>
                    <span className="text-foreground">{token.oklchLight}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
