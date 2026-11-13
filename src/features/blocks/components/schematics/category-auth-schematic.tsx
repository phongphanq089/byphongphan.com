import { KeyRound } from "lucide-react"

import { cn } from "@/shared/lib/utils"

export interface CategoryAuthSchematicProps {
  /** Force the emphasized (hover-like) state — used by `RenderBlockCategorySchematic`. */
  active?: boolean
  className?: string
}

export function CategoryAuthSchematic({
  active,
  className,
}: CategoryAuthSchematicProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Top Header Badge */}
      <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <KeyRound className="size-3 text-zinc-900/70 dark:text-white/70" />
        <span>LOGIN FORM • AUTH</span>
      </div>

      {/* Miniature login modal wireframe */}
      <div className="flex w-52 flex-col items-center gap-1.5 rounded-lg border border-zinc-900/10 bg-background p-3 shadow-xs sm:w-56 dark:border-white/10 dark:bg-zinc-950">
        {/* Avatar slot */}
        <div className="flex size-6 items-center justify-center rounded-full border border-blue-500/40 bg-blue-500/10 dark:border-blue-400/40 dark:bg-blue-400/10">
          <div className="size-2 rounded-full bg-blue-500/60 dark:bg-blue-400/60" />
        </div>

        {/* Title bar */}
        <div className="h-1.5 w-16 rounded-full bg-zinc-900/80 dark:bg-white/80" />
        <div className="h-1 w-24 rounded-full bg-zinc-900/30 dark:bg-white/30" />

        {/* Input bars */}
        <div className="mt-1 flex w-full flex-col gap-1.5">
          {/* Email */}
          <div
            className={cn(
              "flex h-3.5 w-full items-center gap-1.5 rounded-[3px] border px-1.5 transition-colors duration-300",
              "border-zinc-900/15 bg-zinc-900/[0.04] group-hover:border-zinc-900/30 dark:border-white/15 dark:bg-white/[0.04] dark:group-hover:border-white/30",
              active && "border-zinc-900/30 dark:border-white/30"
            )}
          >
            <span className="font-mono text-[5px] tracking-widest text-zinc-900/40 uppercase dark:text-white/40">
              Email
            </span>
            <div className="h-1 w-10 rounded-full bg-zinc-900/30 dark:bg-white/30" />
          </div>
          {/* Password */}
          <div
            className={cn(
              "flex h-3.5 w-full items-center gap-1.5 rounded-[3px] border px-1.5 transition-colors duration-300",
              "border-zinc-900/15 bg-zinc-900/[0.04] group-hover:border-zinc-900/30 dark:border-white/15 dark:bg-white/[0.04] dark:group-hover:border-white/30",
              active && "border-zinc-900/30 dark:border-white/30"
            )}
          >
            <span className="font-mono text-[5px] tracking-widest text-zinc-900/40 uppercase dark:text-white/40">
              Pass
            </span>
            <div className="flex items-center gap-0.5">
              <span className="size-0.5 rounded-full bg-zinc-900/60 dark:bg-white/60" />
              <span className="size-0.5 rounded-full bg-zinc-900/60 dark:bg-white/60" />
              <span className="size-0.5 rounded-full bg-zinc-900/60 dark:bg-white/60" />
              <span className="size-0.5 rounded-full bg-zinc-900/60 dark:bg-white/60" />
              <span className="size-0.5 rounded-full bg-zinc-900/60 dark:bg-white/60" />
            </div>
          </div>
        </div>

        {/* Hatched schematic action bar — flips to solid primary on hover/active */}
        <div
          aria-hidden="true"
          className={cn(
            "mt-1 flex h-5 w-full items-center justify-center rounded border font-mono text-[7px] font-medium select-none",
            "border-[#5b8bf7]/50 bg-[repeating-linear-gradient(45deg,rgba(91,139,247,0.18)_0,rgba(91,139,247,0.18)_2px,transparent_2px,transparent_6px)] text-zinc-500 transition-all duration-200",
            "group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground dark:text-zinc-300",
            active && "border-primary bg-primary text-primary-foreground"
          )}
        >
          Sign in
        </div>
      </div>
    </div>
  )
}
