import { Code } from "lucide-react"

import { cn } from "@/shared/lib/utils"

export interface CategoryDataDisplaySchematicProps {
  /** Force the emphasized (hover-like) state — used by `RenderComponentCategorySchematic`. */
  active?: boolean
  className?: string
}

const CODE_LINES: Array<{
  no: string
  tokens: Array<"keyword" | "accent" | "plain" | "muted">
}> = [
  { no: "01", tokens: ["keyword", "plain", "accent"] },
  { no: "02", tokens: ["muted", "accent", "plain", "keyword"] },
  { no: "03", tokens: ["plain", "keyword", "muted"] },
]

export function CategoryDataDisplaySchematic({
  active,
  className,
}: CategoryDataDisplaySchematicProps) {
  const tokenClass = (token: "keyword" | "accent" | "plain" | "muted") => {
    switch (token) {
      case "keyword":
        return "w-5 bg-blue-500/70 group-hover:bg-blue-500 dark:bg-blue-400/70 dark:group-hover:bg-blue-400"
      case "accent":
        return "w-4 bg-emerald-500/70 group-hover:bg-emerald-500 dark:bg-emerald-400/70 dark:group-hover:bg-emerald-400"
      case "muted":
        return "w-3 bg-zinc-900/25 dark:bg-white/20"
      case "plain":
      default:
        return "w-6 bg-zinc-900/45 dark:bg-white/45"
    }
  }

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Top Header Badge */}
      <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <Code className="size-3 text-zinc-900/70 dark:text-white/70" />
        <span>CODE BLOCK • DATA DISPLAY</span>
      </div>

      {/* Mini code window */}
      <div className="w-full max-w-[210px] overflow-hidden rounded-md border border-zinc-900/10 bg-background shadow-xs sm:max-w-[230px] dark:border-white/10 dark:bg-zinc-950">
        {/* Title bar with window dots */}
        <div className="flex h-4 items-center gap-1 border-b border-zinc-900/10 px-2 dark:border-white/10">
          <span className="size-1.5 rounded-full bg-zinc-900/20 dark:bg-white/20" />
          <span className="size-1.5 rounded-full bg-zinc-900/20 dark:bg-white/20" />
          <span className="size-1.5 rounded-full bg-zinc-900/20 dark:bg-white/20" />
          <div className="mx-auto h-1 w-10 rounded-full bg-zinc-900/15 dark:bg-white/15" />
        </div>

        <div className="flex gap-1.5 p-2">
          {/* Code lines with line numbers */}
          <div className="flex flex-1 flex-col gap-1.5">
            {CODE_LINES.map((line) => (
              <div key={line.no} className="flex items-center gap-1.5">
                <span className="font-mono text-[6px] text-zinc-900/30 tabular-nums dark:text-white/25">
                  {line.no}
                </span>
                <div
                  className={cn(
                    "flex flex-1 items-center gap-1 transition-all duration-300",
                    active && "brightness-125"
                  )}
                >
                  {line.tokens.map((token, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "h-1 rounded-full transition-colors duration-300",
                        tokenClass(token)
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Scrollbar gutter with thumb */}
          <div className="flex w-1.5 shrink-0 flex-col items-center rounded-full bg-zinc-900/[0.06] py-0.5 dark:bg-white/[0.05]">
            <div className="h-5 w-1 rounded-full bg-zinc-900/35 transition-all duration-300 group-hover:bg-blue-500 dark:bg-white/30 dark:group-hover:bg-blue-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
