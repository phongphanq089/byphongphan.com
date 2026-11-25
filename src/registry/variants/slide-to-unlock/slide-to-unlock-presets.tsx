import { SlideToUnlock } from "@/registry/animated/slide-to-unlock"

export default function SlideToUnlockPresets() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 p-6">
      <div className="w-full">
        <span className="mb-2 block font-mono text-[11px] text-muted-foreground uppercase">
          1. Classic Lockscreen
        </span>
        <SlideToUnlock variant="unlock" />
      </div>

      <div className="w-full">
        <span className="mb-2 block font-mono text-[11px] text-muted-foreground uppercase">
          2. Slide to Power Off
        </span>
        <SlideToUnlock variant="power" />
      </div>

      <div className="w-full">
        <span className="mb-2 block font-mono text-[11px] text-muted-foreground uppercase">
          3. Slide to Pay / Authorize
        </span>
        <SlideToUnlock
          variant="confirm"
          label="slide to pay $48.00"
          confirmingLabel="Processing payment…"
          doneLabel="Paid"
        />
      </div>
    </div>
  )
}
