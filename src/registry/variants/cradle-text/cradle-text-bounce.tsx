import { CradleText } from "@/registry/animated/cradle-text"

export function CradleTextBounce() {
  return (
    <div className="flex w-full max-w-full flex-col items-center justify-center gap-8 px-3 py-6 text-center sm:gap-12 sm:p-10 md:p-12">
      <div className="flex w-full max-w-full flex-col items-center gap-2">
        <span className="font-mono text-xs text-muted-foreground uppercase">
          Steel Restitution (0.98) — High Elasticity & Chain Knocks
        </span>
        <div className="flex w-full max-w-full items-center justify-center py-2">
          <CradleText
            text="STEEL"
            bounce={0.98}
            className="text-2xl font-black text-foreground xs:text-3xl sm:text-5xl"
          />
        </div>
      </div>

      <div className="flex w-full max-w-full flex-col items-center gap-2">
        <span className="font-mono text-xs text-muted-foreground uppercase">
          Damped Restitution (0.50) — Soft Impact Dissipation
        </span>
        <div className="flex w-full max-w-full items-center justify-center py-2">
          <CradleText
            text="DAMPED"
            bounce={0.5}
            className="text-2xl font-black text-foreground xs:text-3xl sm:text-5xl"
          />
        </div>
      </div>
    </div>
  )
}

export default CradleTextBounce
