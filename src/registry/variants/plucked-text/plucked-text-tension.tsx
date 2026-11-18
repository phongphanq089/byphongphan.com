import { PluckedText } from "@/registry/animated/plucked-text"

export function PluckedTextTension() {
  return (
    <div className="flex w-full max-w-full flex-col items-center justify-center gap-8 px-3 py-6 text-center sm:gap-12 sm:p-10 md:p-12">
      <div className="flex w-full max-w-full flex-col items-center gap-2">
        <span className="font-mono text-xs text-muted-foreground uppercase">
          Loose Tension (0.5) — Slow Deep Vibration
        </span>
        <div className="flex w-full max-w-full items-center justify-center py-2">
          <PluckedText
            text="LOW TENSION"
            tension={0.5}
            className="text-lg font-extrabold text-foreground xs:text-xl sm:text-3xl md:text-5xl"
          />
        </div>
      </div>

      <div className="flex w-full max-w-full flex-col items-center gap-2">
        <span className="font-mono text-xs text-muted-foreground uppercase">
          High Tension (2.0) — Snappy Fast Settle
        </span>
        <div className="flex w-full max-w-full items-center justify-center py-2">
          <PluckedText
            text="HIGH TENSION"
            tension={2.0}
            className="text-lg font-extrabold text-foreground xs:text-xl sm:text-3xl md:text-5xl"
          />
        </div>
      </div>
    </div>
  )
}

export default PluckedTextTension
