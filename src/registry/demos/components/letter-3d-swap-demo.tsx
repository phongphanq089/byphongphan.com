import { Letter3DSwap } from "@/registry/animated/letter-3d-swap"

export function Letter3DSwapDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-10 p-6 text-center sm:p-12">
      <div className="flex flex-col items-center gap-2">
        <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          3D Typography Kinetic Swap
        </span>
        <Letter3DSwap
          as="h2"
          className="text-4xl font-black tracking-tight sm:text-6xl"
          frontFaceClassName="text-foreground"
          secondFaceClassName="text-primary font-black"
          staggerDuration={0.04}
          staggerFrom="center"
          rotateDirection="top"
        >
          FUTURE OF UI
        </Letter3DSwap>
        <p className="mt-2 max-w-md text-xs text-muted-foreground">
          Hover over the text to trigger a 3D isometric letter rotation with
          staggered kinematics.
        </p>
      </div>

      {/* Grid of direction showcases */}
      <div className="grid w-full max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col items-center justify-center rounded-xl border border-border/80 bg-background/80 p-4 shadow-xs backdrop-blur-sm">
          <span className="mb-2 font-mono text-[10px] text-muted-foreground uppercase">
            Top
          </span>
          <Letter3DSwap
            as="span"
            className="text-sm font-bold text-foreground"
            secondFaceClassName="text-primary font-bold"
            rotateDirection="top"
            staggerFrom="first"
          >
            ROTATE TOP
          </Letter3DSwap>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-border/80 bg-background/80 p-4 shadow-xs backdrop-blur-sm">
          <span className="mb-2 font-mono text-[10px] text-muted-foreground uppercase">
            Right
          </span>
          <Letter3DSwap
            as="span"
            className="text-sm font-bold text-foreground"
            secondFaceClassName="text-primary font-bold"
            rotateDirection="right"
            staggerFrom="first"
          >
            ROTATE RIGHT
          </Letter3DSwap>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-border/80 bg-background/80 p-4 shadow-xs backdrop-blur-sm">
          <span className="mb-2 font-mono text-[10px] text-muted-foreground uppercase">
            Bottom
          </span>
          <Letter3DSwap
            as="span"
            className="text-sm font-bold text-foreground"
            secondFaceClassName="text-primary font-bold"
            rotateDirection="bottom"
            staggerFrom="last"
          >
            ROTATE BOTTOM
          </Letter3DSwap>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-border/80 bg-background/80 p-4 shadow-xs backdrop-blur-sm">
          <span className="mb-2 font-mono text-[10px] text-muted-foreground uppercase">
            Left
          </span>
          <Letter3DSwap
            as="span"
            className="text-sm font-bold text-foreground"
            secondFaceClassName="text-primary font-bold"
            rotateDirection="left"
            staggerFrom="random"
          >
            ROTATE LEFT
          </Letter3DSwap>
        </div>
      </div>
    </div>
  )
}

export default Letter3DSwapDemo
