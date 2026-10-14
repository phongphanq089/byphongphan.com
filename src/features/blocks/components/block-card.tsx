import { Link } from "@tanstack/react-router"
import { ArrowUpRight, Boxes, FileText, Gamepad2, Layout } from "lucide-react"

import { cn } from "@/shared/lib/utils"

import type { BlockItem } from "../types"

interface BlockCardProps {
  block: BlockItem
}

export function BlockCard({ block }: BlockCardProps) {
  return (
    <Link
      to="/blocks/$category/$slug"
      params={{ category: block.category, slug: block.slug }}
      className={cn(
        "group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl p-4 transition-all duration-300 sm:p-5",
        "border border-black/10 bg-muted dark:border-white/10",
        "shadow-xs backdrop-blur-xl",
        "hover:border hover:bg-muted/70 hover:shadow-lg dark:hover:border-primary/40 dark:hover:bg-muted/40",
        "translate-z-0 will-change-transform focus:outline-none"
      )}
    >
      <div className="relative flex aspect-[16/10] w-full flex-col justify-between overflow-hidden rounded-lg border border-black/5 bg-background p-3.5 transition-colors group-hover:border sm:aspect-[16/9] sm:p-4 dark:border-white/5 dark:bg-background dark:group-hover:border-primary/20">
        <div className="pointer-events-none absolute inset-0 bg-radial from-white/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-white/[0.06]" />
        <div className="relative z-20 flex items-center justify-between gap-2">
          {/* Left: Window dots + Category chip */}
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 sm:flex">
              <span className="size-1.5 rounded-full bg-accent-foreground dark:bg-white/20" />
              <span className="size-1.5 rounded-full bg-accent-foreground dark:bg-white/20" />
              <span className="size-1.5 rounded-full bg-accent-foreground dark:bg-white/20" />
            </div>
            <span className="rounded border border-white/10 bg-accent-foreground px-1.5 py-0.5 text-[9px] font-medium tracking-wider text-white uppercase dark:bg-white/5">
              {block.category}
            </span>
          </div>

          {/* Right: Pro Badge & Arrow */}
          <div className="flex items-center gap-1.5">
            {block.isPro && (
              <span className="flex items-center rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-white/90 uppercase">
                Pro
              </span>
            )}
            <div className="flex size-5.5 items-center justify-center rounded border border-white/10 bg-accent-foreground text-white transition-all duration-200 group-hover:border-primary/30 group-hover:bg-primary/70 dark:bg-white/5 dark:group-hover:bg-primary/10">
              <ArrowUpRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>

        {/* Center: Block Visual Preview Mockup */}
        <div className="relative z-10 my-auto flex h-full w-full flex-col items-center justify-center py-2 transition-transform duration-300 will-change-transform group-hover:scale-[1.02]">
          {block.slug === "not-found-01" ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
                <Gamepad2 className="size-3 text-zinc-900/70 dark:text-white/70" />
                <span>DAIKANOID • 404 BRICKS</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                {/* Bricks Grid */}
                <div className="grid grid-cols-12 gap-0.5 sm:gap-1">
                  {[
                    1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1,
                    0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0,
                    1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1,
                  ].map((val, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "size-1.5 rounded-[1px] transition-colors sm:size-2",
                        val === 1
                          ? [
                              "bg-zinc-900/85 shadow-[0_0_6px_rgba(0,0,0,0.2)] group-hover:bg-zinc-900",
                              "dark:bg-white/85 dark:shadow-[0_0_6px_rgba(255,255,255,0.4)] dark:group-hover:bg-white",
                            ]
                          : "bg-zinc-900/[0.06] dark:bg-white/[0.04]"
                      )}
                    />
                  ))}
                </div>

                {/* Ball */}
                <div className="my-1 size-1.5 rounded-full bg-zinc-900 shadow-[0_0_8px_rgba(0,0,0,0.3)] dark:bg-white dark:shadow-[0_0_8px_#ffffff]" />

                {/* Paddle */}
                <div className="h-1 w-12 rounded-full bg-zinc-900/80 shadow-[0_0_8px_rgba(0,0,0,0.25)] dark:bg-white/80 dark:shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
              </div>
            </div>
          ) : block.slug === "not-found-02" ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
                <Boxes className="size-3 text-zinc-900/70 dark:text-white/70" />
                <span>2D GRAVITY • PHYSICS 404</span>
              </div>
              <div className="relative h-30 w-50 overflow-hidden rounded-md border border-zinc-900/10 bg-zinc-900/[0.02] dark:border-white/10 dark:bg-white/[0.02]">
                <div className="absolute inset-x-0 top-1.5 flex flex-col items-center gap-0.5">
                  <div className="h-1 w-7 rounded-full bg-zinc-900/40 dark:bg-white/40" />
                  <div className="flex gap-1">
                    <div className="h-1 w-3 rounded-full border border-zinc-900/20 bg-zinc-900/5 dark:border-white/20 dark:bg-white/5" />
                    <div className="h-1 w-2.5 rounded-full border border-zinc-900/20 bg-zinc-900/5 dark:border-white/20 dark:bg-white/5" />
                  </div>
                </div>
                <div className="absolute bottom-[18px] left-1.5 size-4 rounded-[2px] border border-zinc-900/20 bg-zinc-900/15 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-3 dark:border-white/20 dark:bg-white/15" />
                <div className="absolute bottom-0.5 left-1.5 size-4 rounded-[2px] border border-zinc-900/25 bg-zinc-900/25 dark:border-white/25 dark:bg-white/25" />
                <div className="absolute bottom-[12px] left-[25px] h-4 w-3.5 rounded-[2px] border border-zinc-900/20 bg-zinc-900/20 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3 dark:border-white/20 dark:bg-white/20" />
                <div className="absolute bottom-0.5 left-[24px] h-2.5 w-4 rounded-[2px] border border-zinc-900/15 bg-zinc-900/10 dark:border-white/15 dark:bg-white/10" />
                <div className="absolute bottom-0.5 left-[42px] size-5 rounded-[2px] border border-zinc-900/30 bg-zinc-900/30 transition-transform duration-300 group-hover:-translate-y-0.5 dark:border-white/30 dark:bg-white/30" />
                <div className="absolute bottom-0.5 left-[64px] h-5 w-3.5 rounded-[2px] border border-zinc-900/20 bg-zinc-900/20 dark:border-white/20 dark:bg-white/20" />
                <div className="absolute bottom-0.5 left-[80px] size-3.5 rounded-[2px] border border-zinc-900/15 bg-zinc-900/15 dark:border-white/15 dark:bg-white/15" />
                <div className="absolute right-2.5 bottom-1 h-6 w-4.5 -rotate-[18deg] rounded-[2px] border border-zinc-900/30 bg-zinc-900/25 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-12 dark:border-white/30 dark:bg-white/25" />
              </div>
            </div>
          ) : block.slug === "editor" ? (
            <div className="flex w-full max-w-[290px] flex-col items-center gap-1.5">
              {/* Header */}
              <div className="flex items-center gap-1.5 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
                <FileText className="size-3 text-zinc-900/70 dark:text-white/70" />
                <span>LEXICAL • RICH TEXT EDITOR</span>
              </div>

              <div className="flex w-full flex-col overflow-hidden rounded-md border border-zinc-900/10 bg-zinc-900/[0.03] shadow-inner dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between border-b border-zinc-900/10 bg-zinc-900/[0.04] px-2 py-1 dark:border-white/5 dark:bg-white/[0.04]">
                  <div className="flex items-center gap-1.5 text-[8px]">
                    <span className="font-serif font-bold text-zinc-900/80 dark:text-white/80">
                      B
                    </span>
                    <span className="font-serif text-zinc-900/60 italic dark:text-white/60">
                      I
                    </span>
                    <span className="text-zinc-900/50 line-through dark:text-white/50">
                      S
                    </span>
                    <span className="font-mono text-[7px] text-zinc-900/40 dark:text-white/40">
                      &lt;/&gt;
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="size-1 rounded-full bg-zinc-900/40 dark:bg-white/40" />
                    <div className="h-1.5 w-4 rounded-xs bg-zinc-900/20 dark:bg-white/20" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 p-4">
                  {/* Title Bar */}
                  <div className="h-2 w-3/4 rounded-xs bg-zinc-900/85 shadow-[0_0_6px_rgba(0,0,0,0.15)] dark:bg-white/85 dark:shadow-[0_0_6px_rgba(255,255,255,0.2)]" />
                  {/* Text lines */}
                  <div className="h-1 w-full rounded-xs bg-zinc-900/40 dark:bg-white/40" />
                  <div className="h-1 w-5/6 rounded-xs bg-zinc-900/30 dark:bg-white/30" />
                  {/* Quote / callout line */}
                  <div className="flex items-center gap-1.5 border-l-2 border-zinc-900/50 py-0.5 pl-1.5 dark:border-white/50">
                    <div className="h-1 w-2/3 rounded-xs bg-zinc-900/50 dark:bg-white/50" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Layout className="size-8 text-white/30 transition-colors group-hover:text-primary/60" />
              <span className="font-mono text-[9px] text-white/40">
                {block.title}
              </span>
            </div>
          )}
        </div>
        <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-1.5 text-[8px] text-white/30">
          <span className="font-mono">{block.slug}</span>
          <span className="text-[7px] tracking-widest uppercase">
            Interactive Block
          </span>
        </div>
      </div>

      {/* 2. Bottom Meta / Title & Description */}
      <div className="flex flex-col gap-1.5 pt-3.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-base">
            {block.title}
          </h3>
          <span className="text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-primary">
            Preview &rarr;
          </span>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {block.description}
        </p>
      </div>
    </Link>
  )
}
