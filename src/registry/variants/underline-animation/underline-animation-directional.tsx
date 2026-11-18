import { UnderlineAnimation } from "@/registry/animated/underline-animation"

export default function UnderlineAnimationDirectional() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6">
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground uppercase">
            Left to Right
          </span>
          <UnderlineAnimation
            direction="left"
            className="text-lg font-semibold text-primary"
          >
            Expand From Left
          </UnderlineAnimation>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground uppercase">
            Right to Left
          </span>
          <UnderlineAnimation
            direction="right"
            className="text-lg font-semibold text-primary"
          >
            Expand From Right
          </UnderlineAnimation>
        </div>
      </div>
    </div>
  )
}
