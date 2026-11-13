import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"

import { useScrollPosition } from "@/shared/hooks/use-scroll-position"
import { cn } from "@/shared/lib/utils"
import { PPPixelMark } from "@/shared/ui/icons/pp-pixel-mark"
import { ModeToggle } from "@/shared/ui/system/mode-toggle"

import { CommandMenuTrigger } from "../command-menu"
import { GitHubStarButton } from "./github-star-button"
import { GooeyNavbar } from "./gooey-navbar"

// Re-export desktop navbar and types for backwards compatibility
export {
  DesktopNavbar,
  type DesktopNavbarProps,
  FlashlightNavbar,
  type FlashlightNavbarProps,
  SpotlightNavbar,
  type SpotlightNavbarProps,
} from "./desktop-navbar"

/** Frosted, borderless capsule for mobile buttons. */
const CAPSULE =
  "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-foreground/5 text-foreground transition-colors duration-200 outline-none hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-primary dark:bg-white/5 dark:hover:bg-white/10"

export function Header() {
  const { y } = useScrollPosition()
  const isScrolled = y > 20

  return (
    <header
      className={cn(
        "relative w-full overflow-visible transition-all duration-300 ease-out select-none",
        isScrolled ? "px-3 sm:px-6 sm:pt-3 lg:pt-2" : "px-0 pt-0"
      )}
    >
      {/* 1. Main Frosted Glass Base Layer (Fades out when scrolled so only floating island is visible) */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 bg-background/80 backdrop-blur-xl transition-opacity duration-300 supports-[backdrop-filter]:bg-background/60",
          isScrolled ? "opacity-0" : "opacity-100"
        )}
      />

      {/* 2. Downward Gradient Blur Bleed Layer (Fades out when scrolled) */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 -bottom-8 -z-10 h-8 bg-gradient-to-b from-background/80 via-background/30 to-transparent [mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)] backdrop-blur-md transition-opacity duration-300 [-webkit-mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)]",
          isScrolled ? "opacity-0" : "opacity-100"
        )}
      />

      {/* 3. Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-16 bg-[radial-gradient(40rem_4rem_at_50%_0%,rgba(56,189,248,0.08),transparent_70%)] dark:bg-[radial-gradient(40rem_4rem_at_50%_0%,rgba(56,189,248,0.12),transparent_70%)]"
      />

      {/* 4. Header Content / Floating Island (Transforms into a rounded pill island with borders on scroll) */}
      <div
        className={cn(
          "relative mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 ease-out lg:h-15",
          isScrolled
            ? "rounded-lg border-4 border-muted bg-background/90 px-4 shadow-[0_8px_30px_rgb(0_0_0/0.06)] backdrop-blur-xl sm:rounded-2xl sm:px-6 dark:border-white/15 dark:bg-neutral-950/80 dark:shadow-[0_12px_36px_rgb(0_0_0/0.4)]"
            : "border-transparent bg-transparent px-4 shadow-none sm:px-6"
        )}
      >
        {/* Brand mark — borderless interactive pill */}
        <Link
          to="/"
          aria-label="Phong Phan — home"
          className="flex size-9 shrink-0 items-center justify-center"
        >
          <PPPixelMark className="size-full text-pp-primary" variant="glow" />
        </Link>

        {/* Mobile / tablet cluster — visible below lg */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:hidden">
          <GitHubStarButton />
          <Link
            to="/component-ui"
            className={cn(CAPSULE, "group/btn gap-1 pr-3 pl-3.5")}
          >
            <span className="font-mono text-[11px] font-medium sm:text-xs">
              Component UI
            </span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          </Link>
        </div>

        {/* Desktop bar — Gooey navbar centered, actions right; below lg hidden */}
        <div className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
          <GooeyNavbar />
        </div>

        <div className="ml-auto hidden h-9 items-center gap-2 lg:flex">
          <CommandMenuTrigger compact />
          <GitHubStarButton />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

export default Header
