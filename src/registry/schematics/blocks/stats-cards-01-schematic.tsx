import { Layers } from "lucide-react"

export function StatsCards01Schematic() {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Top Header Badge */}
      <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <Layers className="size-3 text-[#FF4400]" />
        <span>STACKED STATS • MARKETING 01</span>
      </div>

      {/* Miniature Overlapping Cards Mockup */}
      <div className="relative flex h-30 w-52 items-center justify-center overflow-hidden rounded-md border border-zinc-900/10 bg-orange-50/40 p-2 shadow-xs dark:border-white/10 dark:bg-zinc-950">
        <div className="flex items-center justify-center">
          {/* Card 1: Revenue ($100k) */}
          <div className="relative z-10 flex h-18 w-11 -rotate-4 flex-col justify-between rounded-[6px] border border-orange-200 bg-white p-1 shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="h-1.5 w-6 rounded-xs bg-[#FF4400]" />
            <div className="flex flex-col gap-0.5">
              <div className="h-0.5 w-7 rounded-xs bg-[#FF4400]/80" />
              <div className="h-px w-full bg-[#FF4400]/30" />
              <div className="h-0.5 w-5 rounded-xs bg-[#FF4400]/50" />
            </div>
          </div>

          {/* Card 2: Image 1 */}
          <div className="relative z-20 -ml-3 flex h-18 w-11 rotate-2 flex-col justify-start overflow-hidden rounded-[6px] border border-black/10 bg-zinc-200 p-1 shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-0 dark:border-white/10 dark:bg-zinc-800">
            <div className="h-1.5 w-5 rounded-full bg-white/90 shadow-2xs dark:bg-black/80" />
          </div>

          {/* Card 3: Orange Impressions (37M+) */}
          <div className="relative z-30 -ml-3 flex h-18 w-11 rotate-6 flex-col justify-between rounded-[6px] bg-[#FF4400] p-1 shadow-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-4">
            <div className="h-1.5 w-6 rounded-xs bg-white" />
            <div className="flex flex-col gap-0.5">
              <div className="h-0.5 w-7 rounded-xs bg-white/90" />
              <div className="h-px w-full bg-white/40" />
              <div className="h-0.5 w-5 rounded-xs bg-white/60" />
            </div>
          </div>

          {/* Card 4: Image 2 */}
          <div className="relative z-40 -ml-3 flex h-18 w-11 -rotate-3 flex-col justify-end overflow-hidden rounded-[6px] border border-black/10 bg-zinc-300 p-1 shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-1 dark:border-white/10 dark:bg-zinc-700">
            <div className="h-1.5 w-5 self-end rounded-full bg-white/90 shadow-2xs dark:bg-black/80" />
          </div>
        </div>
      </div>
    </div>
  )
}
