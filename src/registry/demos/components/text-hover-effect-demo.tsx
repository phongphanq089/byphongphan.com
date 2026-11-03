import { TextHoverEffect } from "@/registry/animated/text-hover-effect"

export function TextHoverEffectDemo() {
  return (
    <div className="relative flex min-h-[260px] w-full items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-accent p-6 shadow-xs">
      <div className="w-full max-w-2xl py-4">
        <TextHoverEffect text="PHONG PHAN" />
      </div>
    </div>
  )
}
