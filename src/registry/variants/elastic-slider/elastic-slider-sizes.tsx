import { Sliders } from "lucide-react"

import { ElasticSlider } from "@/registry/animated/elastic-slider"

export function ElasticSliderSizes() {
  return (
    <div className="flex w-full max-w-lg flex-col items-center justify-center gap-6 p-6 sm:p-10">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="font-mono text-xs text-muted-foreground uppercase">
          Scale & Vertical Density
        </span>
        <p className="text-xs text-muted-foreground">
          Compact 32px (sm) for dense inspector sidebars to prominent 48px (lg)
          for touch controls.
        </p>
      </div>

      <div className="flex w-full flex-col gap-4">
        <ElasticSlider
          label="Compact Density"
          defaultValue={35}
          size="sm"
          icon={<Sliders />}
        />
        <ElasticSlider
          label="Default Control"
          defaultValue={65}
          size="default"
          icon={<Sliders />}
        />
        <ElasticSlider
          label="Hero Controller"
          defaultValue={85}
          size="lg"
          icon={<Sliders />}
        />
      </div>
    </div>
  )
}

export default ElasticSliderSizes
