import { Letter3DSwap } from "@/registry/animated/letter-3d-swap"

export default function Letter3DSwapStagger() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-[10px] text-muted-foreground uppercase">
          Stagger: Center
        </span>
        <Letter3DSwap
          as="span"
          className="text-2xl font-black text-foreground sm:text-3xl"
          secondFaceClassName="text-primary font-black"
          staggerFrom="center"
          staggerDuration={0.06}
          rotateDirection="right"
        >
          SYMMETRICAL BURST
        </Letter3DSwap>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-[10px] text-muted-foreground uppercase">
          Stagger: Random
        </span>
        <Letter3DSwap
          as="span"
          className="text-2xl font-black text-foreground sm:text-3xl"
          secondFaceClassName="text-primary font-black"
          staggerFrom="random"
          staggerDuration={0.05}
          rotateDirection="top"
        >
          RANDOM SCRAMBLE
        </Letter3DSwap>
      </div>
    </div>
  )
}
