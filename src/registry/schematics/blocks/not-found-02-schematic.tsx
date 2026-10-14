import { Boxes } from "lucide-react"

export function NotFound02Schematic() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <Boxes className="size-3 text-zinc-900/70 dark:text-white/70" />
        <span>2D GRAVITY • PHYSICS 404</span>
      </div>
      <div className="relative h-30 w-50 overflow-hidden rounded-md border border-zinc-900/10 bg-zinc-900/[0.02] dark:border-white/10 dark:bg-white/[0.02]">
        <div className="absolute inset-x-0 top-1.5 flex flex-col items-center gap-0.5">
          <div className="h-1 w-7 rounded-full bg-zinc-900/40 dark:bg-white/40" />
          <div className="flex gap-1">
            <div className="h-1 w-3 rounded-full border border-zinc-900/20 bg-zinc-900/5 dark:border-white/20 dark:bg-white/5" />
            <div className="h-1 w-2.5 rounded-full border border-zinc-900/20 bg-zinc-900/5 dark:border-white/20 dark:bg-white/5" />
          </div>
        </div>
        <div className="absolute bottom-[18px] left-1.5 size-4 rounded-[2px] border border-zinc-900/20 bg-zinc-900/15 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-3 dark:border-white/20 dark:bg-white/15" />
        <div className="absolute bottom-0.5 left-1.5 size-4 rounded-[2px] border border-zinc-900/25 bg-zinc-900/25 dark:border-white/25 dark:bg-white/25" />
        <div className="absolute bottom-[12px] left-[25px] h-4 w-3.5 rounded-[2px] border border-zinc-900/20 bg-zinc-900/20 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3 dark:border-white/20 dark:bg-white/20" />
        <div className="absolute bottom-0.5 left-[24px] h-2.5 w-4 rounded-[2px] border border-zinc-900/15 bg-zinc-900/10 dark:border-white/15 dark:bg-white/10" />
        <div className="absolute bottom-0.5 left-[42px] size-5 rounded-[2px] border border-zinc-900/30 bg-zinc-900/30 transition-transform duration-300 group-hover:-translate-y-0.5 dark:border-white/30 dark:bg-white/30" />
        <div className="absolute bottom-0.5 left-[64px] h-5 w-3.5 rounded-[2px] border border-zinc-900/20 bg-zinc-900/20 dark:border-white/20 dark:bg-white/20" />
        <div className="absolute bottom-0.5 left-[80px] size-3.5 rounded-[2px] border border-zinc-900/15 bg-zinc-900/15 dark:border-white/15 dark:bg-white/15" />
        <div className="absolute right-2.5 bottom-1 h-6 w-4.5 -rotate-[18deg] rounded-[2px] border border-zinc-900/30 bg-zinc-900/25 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-12 dark:border-white/30 dark:bg-white/25" />
      </div>
    </div>
  )
}
