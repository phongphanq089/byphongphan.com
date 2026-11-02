import { Monitor, Smartphone, Tablet } from "lucide-react"
import { useState } from "react"

import { cn } from "@/shared/lib/utils"

export function MediaQueryPreview() {
  const [activeQuery, setActiveQuery] = useState<"sm" | "md" | "lg">("md")

  const devices = [
    {
      id: "sm" as const,
      label: "< 640px",
      icon: Smartphone,
    },
    {
      id: "md" as const,
      label: "640-1024px",
      icon: Tablet,
    },
    {
      id: "lg" as const,
      label: "> 1024px",
      icon: Monitor,
    },
  ]

  return (
    <div className="flex h-full w-full items-center justify-center gap-2.5 px-4 select-none">
      {devices.map((device) => {
        const Icon = device.icon
        const isActive = activeQuery === device.id

        return (
          <button
            key={device.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setActiveQuery(device.id)
            }}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border px-1 py-3 transition-all duration-300",
              isActive
                ? "border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)] ring-1 ring-blue-500/40"
                : "border-white/10 bg-white/[0.02] text-muted-foreground/70 hover:border-white/20 hover:bg-white/[0.05] hover:text-foreground"
            )}
          >
            <Icon
              className={cn(
                "size-5 transition-colors",
                isActive ? "text-blue-400" : "text-muted-foreground"
              )}
            />
            <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">
              {device.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
