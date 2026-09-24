import { PPMarkIsometric } from "@/registry/animated/pp-mark-isometric"

export function PPMarkIsometricBlueprint() {
  return (
    <div className="relative flex min-h-[360px] w-full items-center justify-center overflow-hidden rounded-xl border border-sky-500/20 bg-accent p-6 shadow-xs select-none">
      {/* Blueprint grid underlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundSize: "20px 20px",
          backgroundImage:
            "linear-gradient(to right, rgba(56, 189, 248, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.4) 1px, transparent 1px)",
        }}
      />
      <div className="relative z-10 w-full max-w-md py-4">
        <PPMarkIsometric className="[--pattern:rgba(56,189,248,0.25)] [--stroke:rgba(56,189,248,0.35)]" />
      </div>
    </div>
  )
}

export default PPMarkIsometricBlueprint
