import { TextHoverEffect } from "@/registry/animated/text-hover-effect"

export function TextHoverEffectAutomatic() {
  return (
    <div className="flex min-h-[240px] w-full items-center justify-center rounded-xl border border-border/80 bg-neutral-950 p-6 shadow-xs">
      <div className="w-full max-w-xl">
        <TextHoverEffect text="AUTOMATIC" automatic duration={0.8} />
      </div>
    </div>
  )
}
export default TextHoverEffectAutomatic
