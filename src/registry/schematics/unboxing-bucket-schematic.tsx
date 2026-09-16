import { Sparkles } from "lucide-react"

export function UnboxingBucketSchematic() {
  return (
    <div className="relative flex w-full max-w-[210px] flex-col items-center justify-center select-none">
      {/* Ambient soft glow */}
      <div className="pointer-events-none absolute top-3 size-20 rounded-full bg-white/5 blur-xl" />

      {/* Floating Chip Badge */}
      <div className="z-10 -mb-2 flex items-center gap-2 rounded-full border border-white/20 bg-neutral-900/95 px-3 py-1.5 shadow-xl backdrop-blur-md">
        <div className="flex size-5 items-center justify-center rounded-full bg-white/10 text-white/90">
          <Sparkles className="size-2.5" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-2 w-14 rounded-full bg-white/85" />
          <div className="h-1.5 w-9 rounded-full bg-white/40" />
        </div>
      </div>

      {/* Isometric Package Box */}
      <svg
        viewBox="0 0 200 95"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-44 text-white/25"
      >
        {/* Back cavity wall */}
        <polygon
          points="40,28 100,12 160,28 100,44"
          className="fill-neutral-950/60 stroke-white/20"
          strokeWidth="1"
        />

        {/* Left open flap */}
        <polygon
          points="40,28 15,18 75,4 100,12"
          className="fill-white/[0.04] stroke-white/25"
          strokeWidth="1"
        />

        {/* Right open flap */}
        <polygon
          points="160,28 185,18 125,4 100,12"
          className="fill-white/[0.04] stroke-white/25"
          strokeWidth="1"
        />

        {/* Box Left Body Face */}
        <polygon
          points="40,28 100,44 100,86 40,70"
          className="fill-neutral-900/90 stroke-white/20"
          strokeWidth="1"
        />

        {/* Box Right Body Face */}
        <polygon
          points="100,44 160,28 160,70 100,86"
          className="fill-neutral-900/60 stroke-white/15"
          strokeWidth="1"
        />

        {/* Front dropped flap */}
        <polygon
          points="40,28 100,44 160,28 100,52"
          className="fill-white/[0.06] stroke-white/30"
          strokeWidth="1"
        />
      </svg>
    </div>
  )
}
