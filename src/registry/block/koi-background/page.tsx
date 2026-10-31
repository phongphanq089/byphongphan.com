import { KoiPond } from "./components/koi-pond"

export default function KoiBackgroundPage() {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-background">
      <KoiPond className="absolute inset-0 h-full w-full" />
    </div>
  )
}
