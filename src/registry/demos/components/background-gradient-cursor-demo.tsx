import { BackgroundGradientCursor } from "@/registry/animated/background-gradient-cursor"

export function BackgroundGradientCursorDemo() {
  return (
    <div className="relative flex size-full min-h-[400px] w-full items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-background p-6 shadow-xs select-none">
      <BackgroundGradientCursor
        position="absolute"
        gradient={{
          display: true,
          tilt: 135,
          colorStart: "emerald-500",
          colorEnd: "transparent",
          opacity: 25,
        }}
        dots={{
          display: true,
          size: 1.5,
          color: "white",
          opacity: 18,
        }}
        grid={{
          display: true,
          width: "36px",
          height: "36px",
          color: "white/10",
          opacity: 20,
        }}
        lines={{
          display: true,
          size: 24,
          opacity: 15,
        }}
        mask={{
          cursor: true,
          radius: 160,
          color: "rgba(16, 185, 129, 0.45)",
        }}
      />

      <div className="relative z-10 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-border/60 bg-background/60 p-6 text-center shadow-2xl backdrop-blur-md">
        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Move your cursor across this surface
        </h3>

        <p className="text-xs leading-relaxed text-muted-foreground">
          The radial mask tracks your cursor in real time with
          hardware-accelerated requestAnimationFrame easing, unveiling
          procedural grid layers and multi-stop directional gradients.
        </p>
      </div>
    </div>
  )
}

export default BackgroundGradientCursorDemo
