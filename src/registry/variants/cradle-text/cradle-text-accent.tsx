import { CradleText } from "@/registry/animated/cradle-text"

export function CradleTextAccent() {
  return (
    <div className="flex w-full max-w-full flex-col items-center justify-center gap-6 px-3 py-6 text-center sm:gap-10 sm:p-10 md:p-14">
      <div className="flex w-full max-w-full flex-col items-center gap-3">
        <span className="font-mono text-xs font-semibold tracking-wider text-primary uppercase">
          Vibrant Editorial Accent
        </span>
        <div className="flex w-full max-w-full items-center justify-center py-4">
          <CradleText
            text="PENDULUM"
            bounce={0.96}
            intro={true}
            className="text-2xl font-black tracking-tight text-primary xs:text-3xl sm:text-5xl md:text-6xl"
          />
        </div>
        <p className="max-w-md px-2 text-center text-xs text-balance text-muted-foreground">
          Letters suspend from the overhead rail with micro threads. Pull any
          glyph to observe pure impulse transfer.
        </p>
      </div>
    </div>
  )
}

export default CradleTextAccent
