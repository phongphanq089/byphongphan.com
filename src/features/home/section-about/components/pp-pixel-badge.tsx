import { Link } from "@tanstack/react-router"

import { PPPixelMark } from "@/shared/ui/icons/pp-pixel-mark"

export interface PPPixelBadgeProps {
  className?: string
  plateNumber?: string
}

/**
 * Architectural Plate 1 Pixel Mark Badge
 *
 * Sits on the 224px left drafting rail, representing the primary CAD seal.
 */
export function PPPixelBadge({ className }: PPPixelBadgeProps) {
  return (
    <div className={className}>
      <div className="space-y-1.5">
        <Link
          to="/"
          className="group relative flex size-20 items-center justify-center border border-border p-2"
        >
          <PPPixelMark
            size={54}
            className="h-auto w-full text-foreground transition-all duration-300 group-hover:scale-105 group-hover:text-pp-secondary group-hover:drop-shadow-[0_0_12px_var(--pp-secondary-glow)]"
            variant="outline"
          />
        </Link>
      </div>
    </div>
  )
}
