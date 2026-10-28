import { PPMarkIsometric } from "@/registry/animated/pp-mark-isometric"

export function PPMarkIsometricWireframe() {
  return (
    <div className="flex min-h-[360px] w-full items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-accent p-6 shadow-xs select-none">
      <div className="w-full max-w-md py-4">
        <PPMarkIsometric
          className="opacity-100 [--pattern:color-mix(in_oklab,var(--foreground)_28%,transparent)] [--stroke:color-mix(in_oklab,var(--foreground)_45%,transparent)]"
          enableSound={true}
        />
      </div>
    </div>
  )
}

export default PPMarkIsometricWireframe
