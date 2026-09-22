import { TextHoverEffect } from "@/registry/animated/text-hover-effect"

const NEON_PALETTE = ["#00f5d4", "#00bbf9", "#7b2cbf", "#f72585"]

export function TextHoverEffectNeon() {
  return (
    <div className="flex min-h-[240px] w-full items-center justify-center rounded-xl border border-border/80 bg-neutral-950 p-6 shadow-xs">
      <div className="w-full max-w-xl">
        <TextHoverEffect text="CYBERPUNK" colors={NEON_PALETTE} />
      </div>
    </div>
  )
}
export default TextHoverEffectNeon
