import { UnderlineAnimation } from "@/registry/animated/underline-animation"

export function UnderlineAnimationDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-10 p-6 sm:p-10">
      <div className="flex w-full max-w-lg flex-col gap-8 rounded-2xl border border-border/80 bg-background/80 p-8 shadow-xs backdrop-blur-sm sm:flex-row sm:justify-between">
        {/* Left Column: Heading */}
        <div className="flex flex-col">
          <span className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
            Contact
          </span>
        </div>

        {/* Right Column: Social & Email Links */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-start gap-2 text-sm font-semibold tracking-wider text-foreground uppercase">
            <UnderlineAnimation
              as="a"
              className="text-primary hover:text-primary"
              direction="center"
            >
              LinkedIn
            </UnderlineAnimation>
            <UnderlineAnimation
              as="a"
              className="text-primary hover:text-primary"
              direction="center"
            >
              Instagram
            </UnderlineAnimation>
            <UnderlineAnimation
              as="a"
              className="text-primary hover:text-primary"
              direction="center"
            >
              X (Twitter)
            </UnderlineAnimation>
            <UnderlineAnimation
              as="a"
              className="text-primary hover:text-primary"
              direction="center"
            >
              GitHub
            </UnderlineAnimation>
          </div>

          <div className="flex flex-col items-start gap-2 font-mono text-sm text-primary uppercase">
            <UnderlineAnimation
              as="a"
              className="tracking-wider"
              direction="center"
            >
              fancy@fancy.dev
            </UnderlineAnimation>
            <UnderlineAnimation
              as="a"
              className="tracking-wider"
              direction="left"
            >
              hello@byphongphan.com
            </UnderlineAnimation>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
        <span>
          Hover over any item to preview the center-origin spring underline
          animation.
        </span>
      </div>
    </div>
  )
}

export default UnderlineAnimationDemo
