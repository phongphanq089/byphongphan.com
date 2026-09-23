import { PhongPhanIsometric } from "@/registry/animated/phong-phan-isometric"

export function PhongPhanIsometricPadded() {
  return (
    <div className="flex min-h-[320px] w-full items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-neutral-950 p-6 shadow-xs select-none">
      <div className="w-full max-w-4xl">
        <PhongPhanIsometric variant="padded" showGrid={true} />
      </div>
    </div>
  )
}

export default PhongPhanIsometricPadded
