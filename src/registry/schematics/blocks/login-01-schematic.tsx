import { LogIn } from "lucide-react"

export function Login01Schematic() {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Top Header Badge */}
      <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <LogIn className="size-3 text-zinc-900/70 dark:text-white/70" />
        <span>SPLIT SCREEN • AUTH 01</span>
      </div>

      {/* Miniature Split Screen Card */}
      <div className="relative flex h-30 w-52 overflow-hidden rounded-md border border-zinc-900/10 bg-background shadow-xs dark:border-white/10 dark:bg-zinc-950">
        {/* Left Side: Form Preview Wireframe */}
        <div className="flex w-1/2 flex-col justify-between border-r border-zinc-900/10 p-2 dark:border-white/10">
          {/* Logo Mark Wireframe */}
          <div className="flex items-center gap-1">
            <div className="size-1.5 rounded-full bg-zinc-900/60 dark:bg-white/60" />
            <div className="h-1 w-4 rounded-full bg-zinc-900/40 dark:bg-white/40" />
          </div>

          {/* Form Content Wireframe */}
          <div className="flex flex-col gap-1 py-1">
            <div className="h-1.5 w-11 rounded-full bg-zinc-900/80 dark:bg-white/80" />
            <div className="h-1 w-14 rounded-full bg-zinc-900/30 dark:bg-white/30" />

            <div className="mt-1 flex flex-col gap-1">
              <div className="h-2 w-full rounded-[3px] border border-zinc-900/15 bg-zinc-900/[0.04] dark:border-white/15 dark:bg-white/[0.04]" />
              <div className="h-2 w-full rounded-[3px] border border-zinc-900/15 bg-zinc-900/[0.04] dark:border-white/15 dark:bg-white/[0.04]" />
              <div className="h-2.5 w-full rounded-full bg-zinc-900/85 shadow-xs dark:bg-white/85" />
            </div>
          </div>

          {/* Footer Line Wireframe */}
          <div className="h-1 w-12 rounded-full bg-zinc-900/30 dark:bg-white/30" />
        </div>

        {/* Right Side: Ocean Photo Wireframe with Bottom Quote */}
        <div className="relative flex w-1/2 flex-col justify-end overflow-hidden bg-gradient-to-br from-sky-400/20 via-cyan-500/15 to-emerald-400/20 p-2 dark:from-sky-950/60 dark:via-cyan-900/40 dark:to-zinc-950">
          {/* Subtle water ripples / light glint */}
          <div className="absolute top-2 right-2 size-2 rounded-full bg-white/40 blur-[1px] dark:bg-white/20" />
          <div className="absolute top-5 left-3 size-1 rounded-full bg-white/30 dark:bg-white/15" />
          <div className="absolute top-7 right-4 size-1.5 rounded-full bg-white/30 dark:bg-white/15" />

          {/* Bottom Dark Gradient & Quote Wireframe */}
          <div className="relative z-10 flex flex-col gap-0.5">
            <div className="h-1 w-16 rounded-full bg-zinc-900/60 shadow-xs dark:bg-white/70" />
            <div className="h-1 w-10 rounded-full bg-zinc-900/40 dark:bg-white/50" />
          </div>
        </div>
      </div>
    </div>
  )
}
