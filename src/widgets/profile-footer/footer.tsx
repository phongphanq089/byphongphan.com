import { Link } from "@tanstack/react-router"
import { ArrowUp, ArrowUpRight } from "lucide-react"
import React from "react"

import { GridContainer } from "@/app/layouts"
import { siteConfig } from "@/shared/config"
import { PhongPhanIsometric } from "@/shared/ui/animation"
import { Button } from "@/shared/ui/core"
import { FlipClock } from "@/shared/ui/core/flip-clock"

import { footerNavigation, footerSocials } from "./setting-footer"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-background text-foreground select-none">
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

      <GridContainer
        showCrosshairs={false}
        className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0"
      >
        {/* Column 1: Sitemap */}
        <div className="flex flex-col gap-3.5">
          <GridContainer
            showCrosshairs={false}
            borderLeft={false}
            borderRight={false}
            borderBottom
            className="flex items-center justify-between px-4 py-4 sm:px-6"
          >
            <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
              01 SITEMAP
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              06 ROUTES
            </span>
          </GridContainer>

          <ul className="flex flex-col gap-2.5 px-4 pb-6 text-sm sm:px-6">
            {footerNavigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className="group flex items-center justify-between text-muted-foreground transition-all hover:translate-x-1 hover:text-foreground"
                >
                  <span className="font-medium transition-colors group-hover:text-foreground">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="rounded bg-pp-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-pp-primary">
                        {item.badge}
                      </span>
                    )}
                    {item.shortcut && (
                      <span className="hidden text-[10px] text-muted-foreground sm:inline">
                        {item.shortcut}
                      </span>
                    )}
                    <ArrowUpRight className="size-3 opacity-60 transition-opacity group-hover:text-pp-primary group-hover:opacity-100" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Social Links */}
        <div className="flex flex-col gap-3.5">
          <GridContainer
            showCrosshairs={false}
            borderLeft={false}
            borderRight={false}
            borderBottom
            className="flex items-center justify-between px-4 py-4 sm:px-6"
          >
            <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
              02 SOCIAL
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              CONNECT
            </span>
          </GridContainer>

          <ul className="flex flex-col gap-2.5 px-4 pb-6 text-sm sm:px-6">
            {footerSocials.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between py-0.5 text-muted-foreground transition-all hover:translate-x-1 hover:text-foreground"
                >
                  <span className="font-medium text-foreground transition-colors group-hover:text-pp-primary">
                    {social.name}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
                    <span className="max-w-[140px] truncate">
                      {social.handle}
                    </span>
                    <ArrowUpRight className="size-3 text-muted-foreground/40 transition-colors group-hover:text-pp-primary" />
                  </div>
                </a>
              </li>
            ))}

            {/* Open Source Repo Link */}
            <li className="mt-0.5 border-t border-border/40 pt-2">
              <a
                href={siteConfig.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between text-xs text-pp-primary/90 transition-all hover:translate-x-1 hover:text-pp-primary"
              >
                <span className="font-semibold">Source Code</span>
                <div className="flex items-center gap-1 text-[10px]">
                  <span>byphongphan.com</span>
                  <ArrowUpRight className="size-3" />
                </div>
              </a>
            </li>
          </ul>
        </div>
      </GridContainer>

      {/* ─── 2. Signature 3D Isometric Art Canvas ────────────────────────── */}
      <div className="relative w-full overflow-hidden py-6 sm:py-10">
        <PhongPhanIsometric padding />
      </div>

      {/* ─── 3. Minimal Copyright Bar ────────────────────────────────────── */}
      <GridContainer
        borderTop
        showCrosshairs
        className="flex flex-col items-center justify-between gap-3.5 px-6 py-4 text-xs text-muted-foreground sm:flex-row sm:px-8"
      >
        <div className="flex items-center gap-2 text-[11px]">
          <span className="font-medium text-foreground/90">
            © {currentYear} Phong Phan. All rights reserved.
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="rounded"
        >
          <span>Top</span>
          <ArrowUp className="size-3" />
        </Button>
      </GridContainer>
    </footer>
  )
}
