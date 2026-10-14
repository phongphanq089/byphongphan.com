import { Sparkles } from "lucide-react"

export function UnboxingBucketSchematic() {
  return (
    <div className="relative flex w-full max-w-[410px] flex-col items-center justify-center select-none">
      <div className="pointer-events-none absolute top-3 size-20 rounded-full bg-white/5 blur-xl" />
      <div className="z-10 -mb-12 flex items-center gap-2 rounded-md border border-white/20 bg-neutral-900/50 px-3 py-1.5 shadow-xl backdrop-blur-md dark:bg-neutral-900/95">
        <div className="flex size-5 items-center justify-center rounded-full bg-white/10 text-white/90"></div>
        <div className="flex flex-col gap-1">
          <div className="h-2 w-14 rounded-full bg-white/85" />
          <div className="h-1.5 w-9 rounded-full bg-white/40" />
        </div>
      </div>

      <svg
        width="180px"
        height="180px"
        viewBox="-20 0 190 190"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="-mb-12"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M128.36 87.1899L96.53 107L79 106L64.24 110.69L24.84 100.48L39.43 95.4799L24.89 84.6099L56.64 64.6099L71 75.0999L81.66 61.6299L123 72.6999L111.93 86.2699L128.36 87.1899ZM72 79.8599L49.35 93.8599L79.2 102L104.2 87.1499L72 79.8599ZM46.81 110.91L46.94 132.14L81.56 140.92L81.21 111.16L97.09 112.66L113.46 102.94L114.22 129.63L84.59 150L39.59 137.81L39.99 108.89L46.81 110.91Z"

          className="fill-black/60 dark:fill-accent"
        />
      </svg>
    </div>
  )
}
