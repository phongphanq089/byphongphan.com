import { TextHoverEffect } from "@/registry/animated/text-hover-effect"

const SUNSET_PALETTE = ["#ffbe0b", "#fb5607", "#ff006e", "#8338ec"]

export function TextHoverEffectSunset() {
  return (
    <div className="flex min-h-[240px] w-full items-center justify-center rounded-xl border border-border/80 bg-neutral-950 p-6 shadow-xs">
      <div className="w-full max-w-xl">
        <TextHoverEffect text="SUNSET" colors={SUNSET_PALETTE} />
      </div>
    </div>
  )
}
export default TextHoverEffectSunset
