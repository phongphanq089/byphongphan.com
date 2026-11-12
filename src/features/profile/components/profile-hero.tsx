import { siteConfig } from "@/shared/config"

import { ProfileStatusBadge } from "./profile-status-badge"
import { VietnamLiveClock } from "./vietnam-live-clock"

/**
 * Avatar + identity block with Vietnam live running clock and theme toggle.
 * Positioned at the top of the profile container (replacing the previous standalone header).
 */
export function ProfileHero() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex gap-5 max-sm:flex-col max-sm:items-start sm:gap-6">
        <div className="relative size-35 shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:size-28 md:size-32">
          <img
            src="/avatar-about.jpg"
            alt={siteConfig.author.name}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <ProfileStatusBadge />
          <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {siteConfig.author.name}
          </h2>
          <p className="font-mono text-[11px] tracking-[0.18em] whitespace-nowrap text-muted-foreground uppercase sm:text-xs">
            Frontend Engineer · Fullstack Capable
          </p>
          <div className="mt-1 flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] whitespace-nowrap text-muted-foreground/80 uppercase sm:text-[11px]">
            <span>
              VIET NAM · <VietnamLiveClock /> (UTC+7)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
