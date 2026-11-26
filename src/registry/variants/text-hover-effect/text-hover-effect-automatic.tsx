import { TextHoverEffect } from "@/registry/animated/text-hover-effect"

export function TextHoverEffectAutomatic() {
  return (
    <div className="flex size-full min-h-[240px] w-full items-center justify-center bg-transparent p-4 sm:p-6">
      <div className="w-full max-w-xl">
        <TextHoverEffect text="AUTOMATIC" automatic duration={0.8} />
      </div>
    </div>
  )
}
export default TextHoverEffectAutomatic
