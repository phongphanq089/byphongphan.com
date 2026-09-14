import { Link } from "@tanstack/react-router"
import { ArrowUp, ArrowUpRight, Check, Clock, Copy } from "lucide-react"
import React, { useEffect, useState } from "react"

import { GridContainer } from "@/app/layouts"
import { siteConfig } from "@/shared/config"
import { PhongPhanIsometric } from "@/shared/ui/animation"
import { Button } from "@/shared/ui/core"
import { PPPixelMark } from "@/shared/ui/icons"

import {
  coreTechnologies,
  footerNavigation,
  footerSocials,
  inspriedBy,
} from "./setting-footer"

function useVietnamTime() {
  const [time, setTime] = useState<string>("")

  useEffect(() => {
    const update = () => {
      try {
        const now = new Date()
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now)
        setTime(formatted)
      } catch {
        setTime("")
      }
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  return time
}

export default function Footer() {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const vietnamTime = useVietnamTime()
  const currentYear = new Date().getFullYear()

  const handleCopyEmail = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(siteConfig.author.email)
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    }
  }

  return (
    <footer className="w-full bg-background text-foreground select-none">
      {/* ─── 1. Identity & Live Telemetry Block ──────────────────────────── */}
      <GridContainer
        borderTop
        showCrosshairs
        className="px-6 py-6 sm:px-8 md:py-7"
      >
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          {/* Identity & Status */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <PPPixelMark size={20} className="shrink-0 text-pp-primary" />
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold tracking-wider text-foreground">
                  PHONG PHAN
                </span>
                <span className="text-muted-foreground/40">/</span>
                <span className="text-muted-foreground">
                  Frontend Engineer & UI Architect
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span>Available for select contracts & design engineering</span>
            </div>
          </div>

          {/* Living Clock & 1-Click Email Action */}
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <div className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/20 px-3 py-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5 text-pp-primary" />
              <span className="whitespace-nowrap">Hanoi (UTC+7)</span>
              <span className="text-muted-foreground/40">•</span>
              <span
                className="font-semibold whitespace-nowrap text-foreground tabular-nums"
                suppressHydrationWarning
              >
                {vietnamTime || "00:00:00"}
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyEmail}
              className="h-8 gap-2 px-3 text-xs hover:border-pp-primary/60 hover:text-foreground"
            >
              <span className="whitespace-nowrap">
                {siteConfig.author.email}
              </span>
              {copiedEmail ? (
                <Check className="size-3 text-emerald-400" />
              ) : (
                <Copy className="size-3 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
      </GridContainer>

      {/* ─── 2. Main 3-Column Engineering Matrix (Directory, Tech, Signals) ─ */}
      <GridContainer
        borderTop
        showCrosshairs={false}
        className="grid grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0"
      >
        {/* Column 1: Directory / Sitemap */}
        <div className="flex flex-col gap-3.5 p-6 sm:p-7">
          <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground/70 uppercase">
              01 SITEMAP
            </span>
            <span className="text-[10px] text-muted-foreground/40">
              06 ROUTES
            </span>
          </div>

          <ul className="flex flex-col gap-2.5 text-xs">
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
                      <span className="hidden text-[10px] text-muted-foreground/40 sm:inline">
                        {item.shortcut}
                      </span>
                    )}
                    <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:text-pp-primary group-hover:opacity-100" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Core Architecture Stack */}
        <div className="flex flex-col gap-3.5 p-6 sm:p-7">
          <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground/70 uppercase">
              02 BUILT WITH
            </span>
            <span className="text-[10px] text-muted-foreground/40">
              CORE STACK
            </span>
          </div>

          <ul className="flex flex-col gap-2.5 text-xs">
            {coreTechnologies.map((tech) => {
              const IconComp = tech.icon
              return (
                <li key={tech.name}>
                  <a
                    href={tech.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between rounded-md p-1 transition-all hover:bg-muted/30"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border/60 bg-card p-1 text-foreground shadow-2xs transition-colors group-hover:border-pp-primary/50 group-hover:text-pp-primary">
                        <IconComp className="size-3.5" />
                      </div>
                      <span className="truncate text-xs font-semibold text-foreground transition-colors group-hover:text-pp-primary">
                        {tech.title}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded border border-border/60 bg-muted/40 px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground uppercase">
                        {tech.badge}
                      </span>
                      <ArrowUpRight className="size-3 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-pp-primary" />
                    </div>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Column 3: Connected Signals & Network */}
        <div className="flex flex-col gap-3.5 p-6 sm:p-7">
          <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground/70 uppercase">
              03 NETWORK
            </span>
            <span className="text-[10px] text-emerald-500">● ONLINE</span>
          </div>

          <ul className="flex flex-col gap-2.5 text-xs">
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
                    <span className="max-w-[150px] truncate">
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
                  <span>phong-dev-portfolio</span>
                  <ArrowUpRight className="size-3" />
                </div>
              </a>
            </li>
          </ul>
        </div>
      </GridContainer>

      {/* ─── 3. Technical Colophon & Inspirations Bar ────────────────────── */}
      <GridContainer
        borderTop
        showCrosshairs
        className="flex flex-col justify-between gap-3.5 px-6 py-4 text-xs text-muted-foreground sm:px-8 lg:flex-row lg:items-center"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
          <span className="font-medium text-foreground/90">
            © {currentYear} Phong Phan
          </span>
          <span className="text-muted-foreground/30">•</span>
          <span>Crafted with craft & precision</span>
          <span className="text-muted-foreground/30">•</span>
          <span className="text-muted-foreground/60">Netlify Edge</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end sm:gap-6">
          {/* Clean Inspirations Row - Zero Broken Words */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground/70">
            <span className="text-[10px] tracking-wider whitespace-nowrap text-muted-foreground/40 uppercase">
              Inspirations:
            </span>
            {inspriedBy.slice(0, 5).map((item, idx) => (
              <React.Fragment key={item.name}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="whitespace-nowrap transition-colors hover:text-foreground hover:underline"
                >
                  {item.name.replace(/\.com$/, "")}
                </a>
                {idx < Math.min(inspriedBy.length, 5) - 1 && (
                  <span className="text-muted-foreground/30">/</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Smooth Back to Top */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="h-7 shrink-0 gap-1 px-2 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <span>Top</span>
            <ArrowUp className="size-3" />
          </Button>
        </div>
      </GridContainer>

      {/* ─── 4. Signature 3D Isometric Art Canvas ────────────────────────── */}
      <div className="relative w-full overflow-hidden border-t border-border/40 py-6 sm:py-10">
        <PhongPhanIsometric padding />
      </div>
    </footer>
  )
}
