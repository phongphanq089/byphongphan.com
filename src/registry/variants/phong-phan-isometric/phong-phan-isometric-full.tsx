import { PhongPhanIsometric } from "@/registry/animated/phong-phan-isometric"

export function PhongPhanIsometricFull() {
  return (
    <div className="flex min-h-[320px] w-full items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-accent p-4 shadow-xs select-none">
      <div className="w-full max-w-4xl">
        <PhongPhanIsometric variant="full" showGrid={true} />
      </div>
    </div>
  )
}

export default PhongPhanIsometricFull
