import { UnderlineToBackground } from "@/registry/animated/underline-to-background"

export function UnderlineToBackgroundDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
          Typography Micro-interaction
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Crafted with{" "}
          <UnderlineToBackground
            className="px-1 text-primary"
            targetTextColor="var(--primary-foreground, #fff)"
          >
            passion
          </UnderlineToBackground>{" "}
          and{" "}
          <UnderlineToBackground
            className="px-1 text-foreground"
            targetTextColor="var(--background, #000)"
          >
            precision
          </UnderlineToBackground>
        </h2>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-muted-foreground">
        <UnderlineToBackground
          as="a"
          className="hover:text-foreground"
          targetTextColor="var(--background, #000)"
        >
          Design System
        </UnderlineToBackground>
        <span className="text-muted-foreground/30">•</span>
        <UnderlineToBackground
          as="a"
          className="text-primary hover:text-primary"
          targetTextColor="var(--primary-foreground, #fff)"
        >
          Animation Craft
        </UnderlineToBackground>
        <span className="text-muted-foreground/30">•</span>
        <UnderlineToBackground
          as="a"
          className="hover:text-foreground"
          targetTextColor="var(--background, #000)"
        >
          Interactive UI
        </UnderlineToBackground>
      </div>

      <p className="max-w-md text-xs text-muted-foreground/80">
        Hover over the underlined text to see the underline smoothly expand into
        a full background fill with inverted contrast.
      </p>
    </div>
  )
}

export default UnderlineToBackgroundDemo
