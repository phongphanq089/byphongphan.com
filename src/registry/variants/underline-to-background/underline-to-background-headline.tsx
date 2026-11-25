import { UnderlineToBackground } from "@/registry/animated/underline-to-background"

export default function UnderlineToBackgroundHeadline() {
  return (
    <div className="flex max-w-xl flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
        Building{" "}
        <UnderlineToBackground
          className="px-1 text-primary"
          targetTextColor="var(--primary-foreground, #fff)"
        >
          faster
        </UnderlineToBackground>
        , interfaces that feel{" "}
        <UnderlineToBackground
          className="px-1 text-foreground"
          targetTextColor="var(--background, #000)"
        >
          alive
        </UnderlineToBackground>
        .
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Dynamic font-proportional line height tracking with spring physics.
      </p>
    </div>
  )
}
