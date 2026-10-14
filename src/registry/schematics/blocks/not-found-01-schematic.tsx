import { Gamepad2 } from "lucide-react"

import { cn } from "@/shared/lib/utils"

const BRICK_MATRIX = [
  1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1,
  1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0,
  1, 1, 1, 1, 0, 0, 0, 1,
]

export function NotFound01Schematic() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <Gamepad2 className="size-3 text-zinc-900/70 dark:text-white/70" />
        <span>DAIKANOID • 404 BRICKS</span>
      </div>

      <div className="flex flex-col items-center gap-1">
        {/* Bricks Grid */}
        <div className="grid grid-cols-12 gap-0.5 sm:gap-1">
          {BRICK_MATRIX.map((val, idx) => (
            <div
              key={idx}
              className={cn(
                "size-1.5 rounded-[1px] transition-colors sm:size-2",
                val === 1
                  ? [
                      "bg-zinc-900/85 shadow-[0_0_6px_rgba(0,0,0,0.2)] group-hover:bg-zinc-900",
                      "dark:bg-white/85 dark:shadow-[0_0_6px_rgba(255,255,255,0.4)] dark:group-hover:bg-white",
                    ]
                  : "bg-zinc-900/[0.06] dark:bg-white/[0.04]"
              )}
            />
          ))}
        </div>

        {/* Ball */}
        <div className="my-1 size-1.5 rounded-full bg-zinc-900 shadow-[0_0_8px_rgba(0,0,0,0.3)] dark:bg-white dark:shadow-[0_0_8px_#ffffff]" />

        {/* Paddle */}
        <div className="h-1 w-12 rounded-full bg-zinc-900/80 shadow-[0_0_8px_rgba(0,0,0,0.25)] dark:bg-white/80 dark:shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
      </div>
    </div>
  )
}
