import { ArrowUpRight, Globe, Mail } from "lucide-react"

import { footerSocials } from "@/shared/config"
import { playClickSound, playHoverSound } from "@/shared/lib/sound"
import { cn } from "@/shared/lib/utils"

export interface AboutHeroSocialsProps {
  className?: string
}

/**
 * Social Links & Quick Actions Dock
 *
 * Provides tactile, audio-enhanced social links and navigation shortcuts.
 */
export function AboutHeroSocials({ className }: AboutHeroSocialsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3",
        className
      )}
    >
      {/* Social Links Pills */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {footerSocials.map((item) => {
          return (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.name}
              onMouseEnter={() => playHoverSound()}
              onClick={() => playClickSound()}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border/80 bg-muted/20 text-muted-foreground transition-all hover:scale-105 hover:border-foreground/50 hover:bg-muted/60 hover:text-foreground"
            >
              <SocialIcon name={item.name} />
            </a>
          )
        })}
      </div>

      {/* Quick Explore CTAs */}
      <div className="flex items-center gap-2">
        <a
          href="/ui"
          className="group inline-flex items-center gap-1 rounded-xs border border-border/70 bg-card/40 px-4 py-1 font-mono text-[11px] text-muted-foreground shadow-2xs transition-all hover:border-border hover:bg-card hover:text-foreground"
        >
          <span>Ui studio</span>
          <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </div>
  )
}

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
