import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"

import { Button } from "@/shared/ui/core"
import { PPPixelMark } from "@/shared/ui/icons/pp-pixel-mark"
import { ModeToggle } from "@/shared/ui/system/mode-toggle"

import { CommandMenuTrigger } from "../command-menu"
import { DesktopNavbar } from "./desktop-navbar"
import { GitHubStarButton } from "./github-star-button"

// Re-export desktop navbar and types for backwards compatibility
export {
  DesktopNavbar,
  type DesktopNavbarProps,
  FlashlightNavbar,
  type FlashlightNavbarProps,
  SpotlightNavbar,
  type SpotlightNavbarProps,
} from "./desktop-navbar"

export function Header() {
  return (
    <header className="flex h-12 w-full items-center justify-between bg-accent/40 backdrop-blur-md dark:bg-background/90">
      <Link
        to="/"
        className="flex h-full items-center gap-2 border-r border-border px-4 text-sm font-medium text-muted-foreground transition-all hover:bg-accent/60 hover:text-foreground"
      >
        <PPPixelMark size={32} className="text-pp-primary" variant="glow" />
      </Link>

      <div className="relative z-10 flex shrink-0 items-stretch border-l border-border bg-background/50 backdrop-blur-xs lg:hidden">
        <div className="flex items-center border-r border-border">
          <GitHubStarButton />
        </div>
        <Button
          variant="ghost"
          className="group/btn h-full rounded-none border-0 px-3.5 py-3 font-mono text-[11px] font-medium text-foreground transition-all duration-200 hover:bg-accent/60 hover:text-foreground active:bg-accent sm:px-6 sm:text-xs"
          asChild
        >
          <Link to="/component-ui">
            <span>Component UI</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </div>

      {/* Desktop header — hidden below lg, visible at lg+ */}
      <div className="ml-auto hidden h-full items-center lg:flex">
        <div className="flex h-full items-center px-3">
          <DesktopNavbar />
        </div>
        <div className="flex h-full items-center border-l border-border px-3">
          <CommandMenuTrigger compact />
        </div>
        <div className="flex h-full items-center border-l border-border">
          <GitHubStarButton />
        </div>
        <div className="flex h-full items-center border-l border-border px-3">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

export default Header
