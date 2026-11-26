import { SwooshText } from "@/registry/animated/swoosh-text"

export default function SwooshTextAccent() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <span className="mb-3 font-mono text-[10px] text-muted-foreground uppercase">
        Vivid Primary Under-Glow
      </span>
      <SwooshText
        text="CREATIVE"
        depth={14}
        length={0.24}
        accent="var(--primary)"
        className="text-4xl font-black sm:text-6xl"
      />
    </div>
  )
}
