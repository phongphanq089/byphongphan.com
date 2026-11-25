import { PluckedText } from "@/registry/animated/plucked-text"

export function PluckedTextAccent() {
  return (
    <div className="flex w-full max-w-full flex-col items-center justify-center gap-6 px-3 py-6 text-center sm:gap-10 sm:p-10 md:p-14">
      <div className="flex w-full max-w-full flex-col items-center gap-3">
        <span className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
          Vibrant Editorial Accent
        </span>
        <div className="flex w-full max-w-full items-center justify-center py-2 sm:py-4">
          <PluckedText
            text="HARMONIC RESONANCE"
            tension={1.2}
            strum={true}
            className="text-base font-black tracking-tight text-primary xs:text-lg sm:text-2xl md:text-4xl lg:text-5xl"
          />
        </div>
        <p className="max-w-md px-2 text-center text-xs text-balance text-muted-foreground">
          Sweep across or pluck to watch the custom string line and pins
          resonate in sync with the typography.
        </p>
      </div>
    </div>
  )
}

export default PluckedTextAccent
