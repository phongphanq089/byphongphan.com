import { AlertTriangle, CheckCircle, Flame, Sparkles } from "lucide-react"

import { ElasticSlider } from "@/registry/animated/elastic-slider"

export function ElasticSliderThemes() {
  return (
    <div className="flex w-full max-w-lg flex-col items-center justify-center gap-6 p-6 sm:p-10">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="font-mono text-xs text-muted-foreground uppercase">
          Semantic Color Palettes
        </span>
        <p className="text-xs text-muted-foreground">
          Calibrated accent fills reflecting functional state and intent.
        </p>
      </div>

      <div className="flex w-full flex-col gap-4">
        <ElasticSlider
          label="Primary Accent"
          defaultValue={70}
          variant="primary"
          icon={<Sparkles />}
        />
        <ElasticSlider
          label="Safe Threshold"
          defaultValue={88}
          variant="success"
          icon={<CheckCircle />}
        />
        <ElasticSlider
          label="Critical Limit"
          defaultValue={94}
          variant="destructive"
          icon={<AlertTriangle />}
        />
      </div>
    </div>
  )
}

export default ElasticSliderThemes
