import { Link } from "@tanstack/react-router"
import { ArrowUp, ArrowUpRight } from "lucide-react"
import React from "react"

import { Crosshair, GridContainer } from "@/app/layouts"
import { siteConfig, TELEMETRY_CONFIG } from "@/shared/config"
import { PhongPhanIsometric } from "@/shared/ui/animation"
import { FlipClock } from "@/shared/ui/core/flip-clock"

import { footerNavigation, footerSocials } from "./setting-footer"

export default function Footer() {
  return (
    <footer className="w-full bg-background text-foreground select-none">
      {/* ─── 1. Mechanical Clock Display ──────────────────────────────── */}
      <GridContainer
        showCrosshairs={false}
        className="flex items-center justify-center px-4 py-8 sm:py-12 md:px-8"
      >
        <FlipClock
          mode="clock"
          variant="default"
          size="full"
          timeZone="Asia/Ho_Chi_Minh"
          showLabels={true}
          format12h={true}
          showSeconds={true}
        />
      </GridContainer>

      {/* ─── 2. Signature 3D Isometric Art Canvas ────────────────────── */}
      <div className="relative w-full overflow-hidden py-4 sm:py-8">
        <PhongPhanIsometric padding />
      </div>

      {/* ─── 3. Blueprint Header Bar ──────────────────────────────────── */}
      <GridContainer
        borderTop
        borderBottom
        showCrosshairs
        className="relative flex flex-col items-start justify-between gap-2 px-5 py-4 sm:flex-row sm:items-center sm:px-6"
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-base font-bold tracking-tight text-foreground sm:text-lg">
            byphongphan.com
          </span>
        </div>
        <p className="font-mono text-xs text-muted-foreground/80">
          A pixel-perfect dev portfolio and UI Registry.
        </p>
      </GridContainer>

      {/* ─── 4. Top Grid: 01 Sitemap & 02 Social ─────────────────────── */}
      <GridContainer
        borderBottom
        showCrosshairs
        className="relative grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0"
      >
        <Crosshair className="top-[-6px] left-1/2 hidden -translate-x-1/2 md:block" />
        <Crosshair className="bottom-[-6px] left-1/2 hidden -translate-x-1/2 md:block" />

        {/* ─── 01 SITEMAP ─── */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5 sm:px-6">
            <span className="font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase">
              01 SITEMAP
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/80">
              {String(footerNavigation.length).padStart(2, "0")} ROUTES
            </span>
          </div>

          <ul className="flex flex-col gap-2.5 px-5 py-4 sm:px-6">
            {footerNavigation.map((item) => {
              const isComingSoon = item.badge === "COMING_SOON"
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="group flex items-center justify-between text-sm text-muted-foreground transition-all hover:translate-x-1 hover:text-foreground"
                  >
                    <span className="font-medium transition-colors group-hover:text-foreground">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span
                          className={
                            isComingSoon
                              ? "rounded border border-border/40 bg-muted/40 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-muted-foreground/70"
                              : "rounded border border-border/60 bg-muted/70 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-foreground/90"
                          }
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.shortcut && (
                        <span className="hidden font-mono text-[10px] tracking-wider text-muted-foreground/60 sm:inline">
                          {item.shortcut}
                        </span>
                      )}
                      <ArrowUpRight className="size-3 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* ─── 02 SOCIAL ─── */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5 sm:px-6">
            <span className="font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase">
              02 SOCIAL
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/80">
              CONNECT
            </span>
          </div>

          <ul className="flex flex-col gap-2.5 px-5 py-4 sm:px-6">
            {footerSocials.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between text-sm text-muted-foreground transition-all hover:translate-x-1 hover:text-foreground"
                >
                  <span className="font-medium text-foreground/90 transition-colors group-hover:text-foreground">
                    {social.name}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground/80">
                    <span className="max-w-[200px] truncate sm:max-w-none">
                      {social.handle}
                    </span>
                    <ArrowUpRight className="size-3 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                  </div>
                </a>
              </li>
            ))}

            {/* Dashed Separator */}
            <li className="my-1 border-t border-dashed border-border/70 pt-2">
              <a
                href={siteConfig.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between text-sm text-foreground/90 transition-all hover:translate-x-1 hover:text-foreground"
              >
                <span className="font-medium">Source Code (MIT)</span>
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                  <span>byphongphan.com</span>
                  <ArrowUpRight className="size-3 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                </div>
              </a>
            </li>
          </ul>
        </div>
      </GridContainer>

      {/* ─── 5. Bottom Grid: 03 Architecture & 04 Inspired By ────────── */}
      <GridContainer
        borderBottom
        showCrosshairs
        className="relative grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0"
      >
        <Crosshair className="top-[-6px] left-1/2 hidden -translate-x-1/2 md:block" />
        <Crosshair className="bottom-[-6px] left-1/2 hidden -translate-x-1/2 md:block" />

        {/* ─── 03 ARCHITECTURE & AGENTS ─── */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5 sm:px-6">
            <span className="font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase">
              03 ARCHITECTURE & AGENTS
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/80">
              TELEMETRY
            </span>
          </div>

          <div className="flex flex-col gap-3.5 px-5 py-4.5 sm:px-6">
            {/* Row 1: Runtime */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                RUNTIME
              </span>
              <span className="font-mono font-medium text-foreground/90">
                TanStack Start · React 19 · Netlify
              </span>
            </div>

            {/* Row 2: UI & Motion */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                UI & MOTION
              </span>
              <span className="font-mono font-medium text-foreground/90">
                Base UI · Tailwind v4 · Motion
              </span>
            </div>

            {/* Row 3: Backend v0.2 */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                BACKEND v0.2
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-muted-foreground/80">
                  Neon · Drizzle · Better Auth
                </span>
                <span className="rounded border border-border/40 bg-muted/60 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-muted-foreground uppercase">
                  SOON
                </span>
              </div>
            </div>

            {/* Dashed Separator */}
            <div className="my-1 border-t border-dashed border-border/70" />

            {/* Row 4: For Agents */}
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                FOR AGENTS
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 rounded border border-border/80 bg-muted/30 px-2.5 py-1 font-mono text-xs text-foreground/90 transition-all hover:border-foreground/40 hover:bg-muted/70"
                >
                  <span>/llms.txt</span>
                  <ArrowUpRight className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                </a>
                <a
                  href="/index.md"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 rounded border border-border/80 bg-muted/30 px-2.5 py-1 font-mono text-xs text-foreground/90 transition-all hover:border-foreground/40 hover:bg-muted/70"
                >
                  <span>/index.md</span>
                  <ArrowUpRight className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 04 INSPIRED BY ─── */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5 sm:px-6">
            <span className="font-mono text-xs font-bold tracking-widest text-muted-foreground uppercase">
              04 INSPIRED BY
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/80">
              {String(siteConfig.inspirations.length).padStart(2, "0")} LINKS
            </span>
          </div>

          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-3 overflow-hidden rounded border border-border/70 divide-x divide-y divide-border/60">
              {siteConfig.inspirations.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-11 items-center justify-between px-3 text-xs font-medium text-foreground/90 transition-colors hover:bg-accent/40 hover:text-pp-primary sm:px-4"
                >
                  <span className="truncate">{item.name}</span>
                  <ArrowUpRight className="ml-1 size-3 shrink-0 text-muted-foreground/50 transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-pp-primary" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </GridContainer>

      {/* ─── 6. Bottom Status & Telemetry Bar ─────────────────────────── */}
      <GridContainer
        borderBottom
        showCrosshairs
        className="flex flex-col items-center justify-between gap-3 px-5 py-3.5 font-mono text-[11px] text-muted-foreground sm:flex-row sm:px-6"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-500">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
            </span>
            SYSTEM NORMAL
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="uppercase">BUILD {TELEMETRY_CONFIG.commitHash}</span>
          <span className="text-muted-foreground/40">·</span>
          <span>{TELEMETRY_CONFIG.buildDate}</span>
          <span className="text-muted-foreground/40">·</span>
          <span className="uppercase">
            REGISTRY: {TELEMETRY_CONFIG.totalRegistryItems} ITEMS
          </span>
        </div>

        <div className="flex items-center gap-2 tracking-wider text-muted-foreground/80 uppercase">
          <span>
            CRAFTED BY @
            {(
              siteConfig.author.githubUsername ||
              siteConfig.social.github.username ||
              "PHONGPHANQ089"
            ).toUpperCase()}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span>MIT LICENSE</span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="ml-2 inline-flex items-center gap-1 rounded border border-border/40 bg-muted/30 px-1.5 py-0.5 text-[10px] text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
            title="Scroll to top"
          >
            <span>TOP</span>
            <ArrowUp className="size-2.5" />
          </button>
        </div>
      </GridContainer>
    </footer>
  )
}
