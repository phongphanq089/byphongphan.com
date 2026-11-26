import { SpotlightText } from "@/registry/animated/spotlight-text"

export function SpotlightTextDemo() {
  return (
    <div className="flex size-full min-h-[260px] w-full items-end justify-center overflow-hidden bg-transparent px-4 pt-12 pb-0">
      <SpotlightText
        text="Tanstack"
        theme="dark"
        spotlightRadius={420}
        ambientOpacity={0.05}
        centerIntensity={1}
        bottomCropPercent={12}
        autoAnimate
      />
    </div>
  )
}
