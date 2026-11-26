import { TextHoverEffect } from "@/registry/animated/text-hover-effect"

const SUNSET_PALETTE = ["#ffbe0b", "#fb5607", "#ff006e", "#8338ec"]

export function TextHoverEffectSunset() {
  return (
    <div className="flex size-full min-h-[240px] w-full items-center justify-center bg-transparent p-4 sm:p-6">
      <div className="w-full max-w-xl">
        <TextHoverEffect text="SUNSET" colors={SUNSET_PALETTE} />
      </div>
    </div>
  )
}
export default TextHoverEffectSunset
