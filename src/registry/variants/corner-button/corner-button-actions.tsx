import { ArrowRight, Compass, Rocket, Sparkles } from "lucide-react"

import { CornerButton } from "@/registry/animated/corner-button"

export default function CornerButtonActions() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-6">
      <CornerButton
        accentColor="var(--primary)"
        icon={<Rocket className="corner-btn-svg" />}
      >
        Deploy Stack
      </CornerButton>

      <CornerButton
        accentColor="#06b6d4"
        icon={<Sparkles className="corner-btn-svg" />}
      >
        AI Generation
      </CornerButton>

      <CornerButton
        accentColor="#ec4899"
        icon={<Compass className="corner-btn-svg" />}
      >
        Explore Studio
      </CornerButton>

      <CornerButton
        accentColor="#3b82f6"
        icon={<ArrowRight className="corner-btn-svg" />}
      >
        Get Started
      </CornerButton>
    </div>
  )
}
