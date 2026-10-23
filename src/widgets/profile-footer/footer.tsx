import { Link } from "@tanstack/react-router"
import { ArrowUp, ArrowUpRight, Globe, Mail } from "lucide-react"

import { GridContainer } from "@/app/layouts"
import { siteConfig, TELEMETRY_CONFIG } from "@/shared/config"
import { ExternalLink } from "@/shared/ui"
import { PhongPhanIsometric } from "@/shared/ui/animation"
import { FlipClock } from "@/shared/ui/core/flip-clock"

import { footerNavigation, footerSocials } from "./setting-footer"

const SYSTEM_SPECS = [
  { label: "Framework", value: "TanStack Start" },
  { label: "UI Craft", value: "Base UI · Tailwind 4" },
  { label: "Data Layer", value: "v0.2", badge: "COMING_SOON" },
  { label: "Hosting & Stats", value: "Netlify · Posthog" },
] as const

function SocialIcon({ name }: { name: string }) {
  const key = name.toLowerCase()

  if (key.includes("github")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-3.5 shrink-0"
      >
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
      </svg>
    )
  }

  if (key.includes("linkedin")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-3.5 shrink-0"
      >
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
      </svg>
    )
  }

  if (key.includes("x") || key.includes("twitter")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-3 shrink-0">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  }

  if (key.includes("mail") || key.includes("email")) {
    return <Mail className="size-3.5 shrink-0" />
  }

  return <Globe className="size-3.5 shrink-0" />
}

export default function Footer() {
  return (
    <footer className="w-full bg-background text-foreground select-none">
      {/* Flip Clock */}
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

      {/* 01 SITEMAP | 02 SYSTEM & AGENTS (2 Columns, 6 Aligned Rows) */}
      <GridContainer
        borderBottom
        showCrosshairs
        className="relative grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0"
      >
        {/* 01 SITEMAP */}
        <div className="flex min-w-0 flex-col">
          <div className="flex h-11 items-center justify-between border-b border-border px-5 sm:px-6">
            <span className="font-mono text-xs font-bold tracking-widest whitespace-nowrap text-muted-foreground uppercase">
              01 SITEMAP
            </span>
            <span className="font-mono text-[10px] tracking-wider whitespace-nowrap text-muted-foreground/70 uppercase">
              {String(footerNavigation.length).padStart(2, "0")} ROUTES
            </span>
          </div>

          <ul className="flex flex-col gap-3 px-5 py-5 sm:px-6">
            {footerNavigation.map((item) => {
              const isComingSoon = item.badge === "COMING_SOON"
              return (
                <li key={item.name} className="flex h-7 items-center">
                  <Link
                    to={item.href}
                    className="group flex w-full items-center justify-between gap-3 text-sm transition-colors"
                  >
                    <span
                      className={
                        isComingSoon
                          ? "font-medium whitespace-nowrap text-muted-foreground transition-colors group-hover:text-foreground"
                          : "font-semibold whitespace-nowrap text-foreground transition-colors group-hover:text-foreground"
                      }
                    >
                      {item.name}
                    </span>

                    <div className="flex shrink-0 items-center gap-2.5">
                      {item.badge && (
                        <span
                          className={
                            isComingSoon
                              ? "inline-flex h-5 items-center justify-center rounded border border-border/50 bg-muted/30 px-2 font-mono text-[9px] font-semibold tracking-wider whitespace-nowrap text-muted-foreground/70 uppercase"
                              : "inline-flex h-5 items-center justify-center rounded border border-border/80 bg-muted/50 px-2 font-mono text-[9px] font-bold tracking-wider whitespace-nowrap text-foreground uppercase"
                          }
                        >
                          {item.badge}
                        </span>
                      )}
                      <ArrowUpRight className="size-3 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* 02 SYSTEM & AGENTS */}
        <div className="flex min-w-0 flex-col">
          <div className="flex h-11 items-center justify-between border-b border-border px-5 sm:px-6">
            <span className="font-mono text-xs font-bold tracking-widest whitespace-nowrap text-muted-foreground uppercase">
              02 SYSTEM
            </span>
            <span className="font-mono text-[10px] tracking-wider whitespace-nowrap text-muted-foreground/70 uppercase">
              SPECS
            </span>
          </div>

          <ul className="flex flex-col gap-3 px-5 py-5 sm:px-6">
            {SYSTEM_SPECS.map((spec) => (
              <li
                key={spec.label}
                className="flex h-7 items-center justify-between gap-3 text-sm"
              >
                <span className="whitespace-nowrap text-muted-foreground">
                  {spec.label}
                </span>
                <div className="flex shrink-0 items-center gap-2.5">
                  {"badge" in spec && spec.badge && (
                    <span className="inline-flex h-5 items-center justify-center rounded border border-border/50 bg-muted/30 px-2 font-mono text-[9px] font-semibold tracking-wider whitespace-nowrap text-muted-foreground/70 uppercase">
                      {spec.badge}
                    </span>
                  )}
                  <span
                    className={
                      "badge" in spec
                        ? "font-mono text-xs whitespace-nowrap text-muted-foreground"
                        : "text-xs font-semibold whitespace-nowrap text-foreground"
                    }
                  >
                    {spec.value}
                  </span>
                </div>
              </li>
            ))}

            {/* Row 5: For Agents */}
            <li className="flex h-7 items-center justify-between gap-3 text-sm">
              <span className="font-semibold whitespace-nowrap text-muted-foreground">
                For Agents
              </span>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex h-7 items-center gap-1.5 rounded border border-border/80 bg-muted/20 px-2.5 font-mono text-[11px] whitespace-nowrap text-foreground/90 transition-colors hover:border-foreground/40 hover:bg-muted/60"
                >
                  <span>llms.txt</span>
                  <ArrowUpRight className="size-3 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                </a>
                <a
                  href="/index.md"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex h-7 items-center gap-1.5 rounded border border-border/80 bg-muted/20 px-2.5 font-mono text-[11px] whitespace-nowrap text-foreground/90 transition-colors hover:border-foreground/40 hover:bg-muted/60"
                >
                  <span>index.md</span>
                  <ArrowUpRight className="size-3 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                </a>
              </div>
            </li>

            {/* Row 6: Connect (Social Icons + Source Code) */}
            <li className="flex h-7 items-center justify-between gap-3 text-sm">
              <span className="font-semibold whitespace-nowrap text-muted-foreground">
                Connect
              </span>
              <div className="flex shrink-0 items-center gap-1.5">
                {footerSocials.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    title={`${social.name} (${social.handle})`}
                    aria-label={social.name}
                    className="inline-flex size-7 items-center justify-center rounded border border-border/80 bg-muted/20 text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-muted/60 hover:text-foreground"
                  >
                    <SocialIcon name={social.name} />
                  </a>
                ))}
                <ExternalLink
                  href={siteConfig.repoUrl}
                  className="group ml-0.5 inline-flex h-7 items-center gap-1.5 rounded border border-border/80 bg-muted/20 px-2.5 font-mono text-[11px] whitespace-nowrap text-foreground/90 transition-colors hover:border-foreground/40 hover:bg-muted/60"
                >
                  <span>Source</span>
                  <ArrowUpRight className="size-3 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                </ExternalLink>
              </div>
            </li>
          </ul>
        </div>
      </GridContainer>

      <GridContainer
        borderBottom
        showCrosshairs={false}
        className="flex flex-col"
      >
        <div className="flex h-11 items-center justify-between border-b border-border px-5 sm:px-6">
          <span className="font-mono text-xs font-bold tracking-widest whitespace-nowrap text-muted-foreground uppercase">
            03 INSPIRED BY
          </span>
          <span className="font-mono text-[10px] tracking-wider whitespace-nowrap text-muted-foreground/70 uppercase">
            {String(siteConfig.inspirations.length).padStart(2, "0")} LINKS
          </span>
        </div>

        <div className="grid grid-cols-3 gap-x-3 gap-y-3 px-5 py-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:gap-2">
          {siteConfig.inspirations.map((item, index) => (
            <ExternalLink
              key={item.name}
              href={item.href}
              className="group inline-flex min-w-0 items-center gap-1.5 text-xs whitespace-nowrap transition-colors"
            >
              {index > 0 && (
                <span className="mr-1.5 hidden text-muted-foreground/40 select-none lg:inline">
                  ·
                </span>
              )}
              <span className="w-4 shrink-0 font-mono text-[11px] whitespace-nowrap text-muted-foreground/60">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-semibold whitespace-nowrap text-foreground/90 transition-colors group-hover:text-pp-primary">
                {item.name}
              </span>
            </ExternalLink>
          ))}
        </div>
      </GridContainer>

      <GridContainer
        borderBottom
        showCrosshairs
        className="flex flex-col items-center justify-between gap-3 px-5 py-3.5 text-[11px] text-muted-foreground sm:flex-row sm:px-6"
      >
        <div className="flex flex-wrap items-center justify-center gap-2 whitespace-nowrap">
          <span className="text-muted-foreground/40">·</span>
          <span className="whitespace-nowrap uppercase">
            BUILD {TELEMETRY_CONFIG.commitHash}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="whitespace-nowrap">
            {TELEMETRY_CONFIG.buildDate}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="whitespace-nowrap uppercase">
            REGISTRY: {TELEMETRY_CONFIG.totalRegistryItems} ITEMS
          </span>
        </div>

        <div className="flex items-center gap-2 tracking-wider whitespace-nowrap text-muted-foreground/80 uppercase">
          <span className="whitespace-nowrap">CRAFTED BY @byphongphan</span>
          <span className="text-muted-foreground/40">·</span>
          <ExternalLink href={siteConfig.githubLicense}>
            <span className="whitespace-nowrap">MIT LICENSE</span>
          </ExternalLink>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="ml-2 inline-flex items-center gap-1 rounded border border-border/40 bg-muted/30 px-1.5 py-0.5 text-[10px] whitespace-nowrap text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
            title="Scroll to top"
          >
            <span>TOP</span>
            <ArrowUp className="size-2.5" />
          </button>
        </div>
      </GridContainer>

      <div className="relative w-full overflow-hidden py-4 sm:py-8">
        <PhongPhanIsometric padding />
      </div>
    </footer>
  )
}
