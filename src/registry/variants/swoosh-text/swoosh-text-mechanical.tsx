import { SwooshText } from "@/registry/animated/swoosh-text"

export default function SwooshTextMechanical() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <span className="mb-3 font-mono text-[10px] text-muted-foreground uppercase">
        Click to Press Letters (Keyboard Falloff)
      </span>
      <SwooshText
        text="TYPE 42"
        depth={16}
        length={0.3}
        className="text-4xl font-black sm:text-6xl"
      />
    </div>
  )
}
