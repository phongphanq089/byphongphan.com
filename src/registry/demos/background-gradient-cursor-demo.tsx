import { BackgroundGradientCursor } from "@/registry/animated/background-gradient-cursor"

export function BackgroundGradientCursorDemo() {
  return (
    <div className="relative flex min-h-[360px] w-full items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-accent p-6 shadow-xs select-none">
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

      <div className="relative z-10 flex max-w-md flex-col items-center gap-3 text-center">
        <h3 className="text-xl font-bold tracking-tight sm:text-2xl dark:text-white">
          Move your cursor across this surface
        </h3>

        <p className="text-xs leading-relaxed text-neutral-400">
          The radial mask tracks your cursor in real time with
          hardware-accelerated requestAnimationFrame easing, unveiling
          procedural grid layers and multi-stop directional gradients.
        </p>
      </div>
    </div>
  )
}

export default BackgroundGradientCursorDemo
