import { TextHoverEffect } from "@/registry/animated/text-hover-effect"

const NEON_PALETTE = ["#00f5d4", "#00bbf9", "#7b2cbf", "#f72585"]

export function TextHoverEffectNeon() {
  return (
    <div className="flex size-full min-h-[240px] w-full items-center justify-center bg-transparent p-4 sm:p-6">
      <div className="w-full max-w-xl">
        <TextHoverEffect text="CYBERPUNK" colors={NEON_PALETTE} />
      </div>
    </div>
  )
}
export default TextHoverEffectNeon
