import { Link } from "@tanstack/react-router"
import { ArrowUp, ArrowUpRight, Globe, Mail } from "lucide-react"

import { siteConfig, TELEMETRY_CONFIG } from "@/shared/config"
import { ExternalLink } from "@/shared/ui"

import { footerNavigation, footerSocials } from "./setting-footer"
import { SpotlightText } from "./spotlight-text"
import UnderlineToBackground from "./underline-to-background"

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
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative w-full overflow-hidden border-t border-border bg-background text-foreground select-none max-md:pb-[100px]">
      {/* Full-width container with generous horizontal padding (No max-w constraint) */}
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        {/* Outer border wrapper providing the continuous outer border lines */}
        <div className="relative border-x border-b border-border">
          {/* ─── GIANT SPOTLIGHT WATERMARK TYPOGRAPHY ─── */}
          {/* Positioned at the bottom of the container. The 4 column dividers pass directly over it. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0">
            <SpotlightText
              text="PhongPhan"
              theme="dark"
              spotlightRadius={560}
              ambientOpacity={0.03}
              centerIntensity={1.0}
              bottomCropPercent={8}
              showColumnDividers={false}
            />
          </div>

          {/* ─── SINGLE UNIFIED 4-COLUMN GRID (Continuous from top to bottom) ─── */}
          <div className="xm:divide-y-0 relative z-10 grid grid-cols-1 divide-y divide-border sm:divide-x md:grid-cols-2 xl:grid-cols-4">
            {/* ─── COLUMN 1: 01 SITEMAP ─── */}
            <div className="flex flex-col pb-10 lg:pb-60">
              <div className="flex h-12 items-center justify-between px-6 pt-2">
                <span className="font-mono text-xs font-bold tracking-[0.2em] whitespace-nowrap text-muted-foreground uppercase">
                  01 SITEMAP
                </span>
                <span className="font-mono text-[10px] tracking-wider whitespace-nowrap text-muted-foreground/60 uppercase">
                  {String(footerNavigation.length).padStart(2, "0")} ROUTES
                </span>
              </div>

              <ul className="flex flex-col gap-3.5 px-6 pt-6">
                {footerNavigation.map((item) => {
                  const isComingSoon = item.badge === "COMING_SOON"
                  return (
                    <li key={item.name} className="flex h-7 items-center">
                      <Link
                        to={item.href}
                        className="group flex w-full items-center justify-between gap-3 text-sm transition-colors"
                      >
                        <UnderlineToBackground
                          targetTextColor="var(--background)"
                          className={
                            isComingSoon
                              ? "font-medium whitespace-nowrap text-muted-foreground transition-colors group-hover:text-foreground"
                              : "font-semibold whitespace-nowrap text-foreground/90 transition-colors group-hover:text-foreground"
                          }
                        >
                          {item.name}
                        </UnderlineToBackground>

                        <div className="flex shrink-0 items-center gap-2">
                          {item.badge && (
                            <span
                              className={
                                isComingSoon
                                  ? "inline-flex h-5 items-center justify-center rounded border border-border/50 bg-muted/30 px-1.5 font-mono text-[9px] font-semibold tracking-wider whitespace-nowrap text-muted-foreground/70 uppercase"
                                  : "inline-flex h-5 items-center justify-center rounded border border-border/80 bg-muted/50 px-1.5 font-mono text-[9px] font-bold tracking-wider whitespace-nowrap text-foreground uppercase"
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

            {/* ─── COLUMN 2: 02 SYSTEM ─── */}
            <div className="flex flex-col pb-10 lg:pb-60">
              <div className="flex h-12 items-center justify-between px-6 pt-2">
                <span className="font-mono text-xs font-bold tracking-[0.2em] whitespace-nowrap text-muted-foreground uppercase">
                  02 SYSTEM
                </span>
                <span className="font-mono text-[10px] tracking-wider whitespace-nowrap text-muted-foreground/60 uppercase">
                  SPECS
                </span>
              </div>

              <ul className="flex flex-col gap-3.5 px-6 pt-6">
                {SYSTEM_SPECS.map((spec) => (
                  <li
                    key={spec.label}
                    className="flex h-7 items-center justify-between gap-3 text-sm"
                  >
                    <span className="whitespace-nowrap text-muted-foreground">
                      {spec.label}
                    </span>
                    <div className="flex shrink-0 items-center gap-2">
                      {"badge" in spec && spec.badge && (
                        <span className="inline-flex h-5 items-center justify-center rounded border border-border/50 bg-muted/30 px-1.5 font-mono text-[9px] font-semibold tracking-wider whitespace-nowrap text-muted-foreground/70 uppercase">
                          {spec.badge}
                        </span>
                      )}
                      <span
                        className={
                          "badge" in spec
                            ? "font-mono text-xs whitespace-nowrap text-muted-foreground"
                            : "text-xs font-semibold whitespace-nowrap text-foreground/90"
                        }
                      >
                        {spec.value}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* ─── COLUMN 3: 03 INSPIRED BY ─── */}
            <div className="flex flex-col pb-10 lg:pb-60">
              <div className="flex h-12 items-center justify-between px-6 pt-2">
                <span className="font-mono text-xs font-bold tracking-[0.2em] whitespace-nowrap text-muted-foreground uppercase">
                  03 INSPIRED BY
                </span>
                <span className="font-mono text-[10px] tracking-wider whitespace-nowrap text-muted-foreground/60 uppercase">
                  {String(siteConfig.inspirations.length).padStart(2, "0")}{" "}
                  LINKS
                </span>
              </div>

              <ul className="flex flex-col gap-3.5 px-6 pt-6">
                {siteConfig.inspirations.map((item, index) => (
                  <li key={item.name} className="flex h-7 items-center">
                    <ExternalLink
                      href={item.href}
                      className="group flex w-full items-center justify-between gap-2 text-sm whitespace-nowrap transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 shrink-0 font-mono text-[11px] whitespace-nowrap text-muted-foreground/50">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <UnderlineToBackground
                          targetTextColor="var(--background)"
                          className="font-medium whitespace-nowrap text-foreground/80 transition-colors group-hover:text-foreground"
                        >
                          {item.name}
                        </UnderlineToBackground>
                      </div>
                      <ArrowUpRight className="size-3 shrink-0 text-muted-foreground/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* ─── COLUMN 4: 04 STAY CONNECTED & TELEMETRY ─── */}
            <div className="flex flex-col pb-36 lg:pb-60">
              <div className="flex h-12 items-center justify-between px-6 pt-2">
                <span className="font-mono text-xs font-bold tracking-[0.2em] whitespace-nowrap text-muted-foreground uppercase">
                  04 STAY CONNECTED
                </span>
                <span className="font-mono text-[10px] tracking-wider whitespace-nowrap text-muted-foreground/60 uppercase">
                  CHANNELS
                </span>
              </div>

              {/* Top Action Items in Column 4 */}
              <div className="flex flex-col gap-6 px-6 pt-6">
                {/* 1. Social Channels Row: Rounded icon buttons */}
                <div className="flex flex-col gap-2.5">
                  <span className="font-mono text-[11px] tracking-widest text-muted-foreground/60 uppercase">
                    Connect
                  </span>
                  <div className="flex items-center gap-2">
                    {footerSocials.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        title={`${social.name} (${social.handle})`}
                        aria-label={social.name}
                        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border/80 bg-muted/20 text-muted-foreground transition-all hover:scale-105 hover:border-foreground/50 hover:bg-muted/60 hover:text-foreground"
                      >
                        <SocialIcon name={social.name} />
                      </a>
                    ))}
                  </div>
                </div>

                {/* 2. Machine-Readable & Agents */}
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] tracking-widest text-muted-foreground/60 uppercase">
                    For Agents
                  </span>
                  <div className="flex items-center gap-2">
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
                </div>

                {/* 3. Source Repository */}
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] tracking-widest text-muted-foreground/60 uppercase">
                    Repository
                  </span>
                  <div>
                    <ExternalLink
                      href={siteConfig.repoUrl}
                      className="group inline-flex h-7 items-center gap-1.5 rounded border border-border/80 bg-muted/20 px-2.5 font-mono text-[11px] whitespace-nowrap text-foreground/90 transition-colors hover:border-foreground/40 hover:bg-muted/60"
                    >
                      <span>Source Code</span>
                      <ArrowUpRight className="size-3 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                    </ExternalLink>
                  </div>
                </div>
              </div>

              {/* 4. Full-width Telemetry Section with border-t (No isolated card box, seamless with column) */}
              <div className="mt-8 flex flex-col gap-2.5 border-t border-border px-6 pt-4 font-mono text-[11px] text-muted-foreground">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-foreground/80 uppercase">
                    BUILD {TELEMETRY_CONFIG.commitHash}
                  </span>
                  <span className="text-[10px] text-muted-foreground/70 uppercase">
                    {TELEMETRY_CONFIG.buildDate}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="uppercase">
                    REGISTRY: {TELEMETRY_CONFIG.totalRegistryItems} ITEMS
                  </span>
                  <span className="text-foreground/70">@byphongphan</span>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-2">
                  <ExternalLink
                    href={siteConfig.githubLicense}
                    className="transition-colors hover:text-foreground"
                  >
                    <UnderlineToBackground targetTextColor="var(--background)">
                      MIT LICENSE
                    </UnderlineToBackground>
                  </ExternalLink>

                  <button
                    type="button"
                    onClick={scrollToTop}
                    className="inline-flex cursor-pointer items-center gap-1 rounded border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
                    title="Scroll to top"
                  >
                    <span>TOP</span>
                    <ArrowUp className="size-2.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
