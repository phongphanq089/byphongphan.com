import { SlideToUnlock } from "@/registry/animated/slide-to-unlock"

export default function SlideToUnlockSizes() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 p-6">
      <div className="w-full">
        <span className="mb-2 block font-mono text-[11px] text-muted-foreground uppercase">
          Compact (h=48px, thumb=54px)
        </span>
        <SlideToUnlock height={48} thumbWidth={54} label="slide to unlock" />
      </div>

      <div className="w-full">
        <span className="mb-2 block font-mono text-[11px] text-muted-foreground uppercase">
          Default iOS (h=56px, thumb=64px)
        </span>
        <SlideToUnlock height={56} thumbWidth={64} label="slide to unlock" />
      </div>

      <div className="w-full">
        <span className="mb-2 block font-mono text-[11px] text-muted-foreground uppercase">
          Expanded Hero (h=64px, thumb=72px)
        </span>
        <SlideToUnlock height={64} thumbWidth={72} label="slide to unlock" />
      </div>
    </div>
  )
}
