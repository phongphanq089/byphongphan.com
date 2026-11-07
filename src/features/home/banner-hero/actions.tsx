import { Code2 } from "lucide-react"

import { CornerButton } from "@/features/home/banner-hero/corner-button"
import { cn } from "@/shared/lib/utils"

export interface ActionsProps {
  className?: string
}

export function Actions({ className }: ActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-4 pt-4 sm:gap-6",
        className
      )}
    >
      <CornerButton
        href="/component-ui"
        accentColor="var(--primary)"
        icon={<Code2 className="size-4 shrink-0" />}
        wrapperClassName="scale-95 sm:scale-100"
      >
        Explore Components
      </CornerButton>
    </div>
  )
}
