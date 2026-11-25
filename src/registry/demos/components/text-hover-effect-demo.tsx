import { TextHoverEffect } from "@/registry/animated/text-hover-effect"

export function TextHoverEffectDemo() {
  return (
    <div className="flex size-full min-h-[260px] w-full items-center justify-center bg-transparent p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        <TextHoverEffect text="PHONG PHAN" />
      </div>
    </div>
  )
}
