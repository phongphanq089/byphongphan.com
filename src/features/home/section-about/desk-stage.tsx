import { motion, useReducedMotion } from "motion/react"
import React, { useRef, useState } from "react"

import { playClickSound, playHoverSound } from "@/shared/lib/sound"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui"

export interface DeskStageProps {
  className?: string
}

export function DeskStage({ className }: DeskStageProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [resetKey, setResetKey] = useState(0)
  const reduceMotion = useReducedMotion()

  const handleReset = () => {
    playClickSound()
    setResetKey((prev) => prev + 1)
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border-b border-border bg-background/95",
        className
      )}
    >
      {/* Background radial gradient glow & dot pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_48%_at_50%_46%,rgba(203,213,225,0.08),transparent_75%)]" />
        <div className="size-full bg-[radial-gradient(rgba(203,213,225,0.45)_1.2px,transparent_1.2px)] [mask-image:radial-gradient(ellipse_78%_58%_at_50%_48%,black_35%,transparent_90%)] [background-size:18px_18px] opacity-35" />
      </div>

      <div
        ref={stageRef}
        key={resetKey}
        className="relative flex h-[340px] w-full items-center justify-center overflow-hidden select-none sm:h-[320px] md:h-[300px]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.035]"
        />

        {/* Top Floating Controls */}
        <div className="absolute top-3.5 right-4 z-40 flex items-center gap-2 sm:top-4 sm:right-6">
          <div className="items-center gap-1.5 rounded-full border bg-background/70 px-3 py-1 font-mono text-[10px] text-muted-foreground backdrop-blur-md sm:flex">
            <span>Drag to explore</span>
          </div>
          <Button
            type="button"
            onClick={handleReset}
            onMouseEnter={() => playHoverSound()}
            variant="secondary"
            size="xs"
            className="text-muted-foreground"
          >
            <span>Reset</span>
          </Button>
        </div>

        {/* Sticker 1: Laptop Workstation */}
        <motion.div
          drag={!reduceMotion}
          dragConstraints={stageRef}
          dragElastic={0.2}
          whileHover={{ scale: 1.05, cursor: "grab", zIndex: 30 }}
          whileTap={{ scale: 1.08, cursor: "grabbing", zIndex: 40 }}
          onMouseEnter={() => playHoverSound()}
          onPointerDown={() => playClickSound()}
          className="absolute drop-shadow-[0_18px_32px_rgba(0,0,0,0.65)] filter select-none"
          style={{
            left: "6%",
            top: "10%",
            width: "clamp(190px, 28vw, 340px)",
            rotate: "-7deg",
          }}
        >
          <img
            src="/laptop.png"
            alt="MacBook / Laptop Workstation"
            className="pointer-events-none h-auto w-full select-none"
            draggable={false}
          />
        </motion.div>

        {/* Sticker 2: Retro Mechanical Keyboard */}
        <motion.div
          drag={!reduceMotion}
          dragConstraints={stageRef}
          dragElastic={0.2}
          whileHover={{ scale: 1.05, cursor: "grab", zIndex: 30 }}
          whileTap={{ scale: 1.08, cursor: "grabbing", zIndex: 40 }}
          onMouseEnter={() => playHoverSound()}
          onPointerDown={() => playClickSound()}
          className="absolute drop-shadow-[0_16px_30px_rgba(0,0,0,0.7)] filter select-none"
          style={{
            left: "26%",
            top: "28%",
            width: "clamp(220px, 34vw, 400px)",
            rotate: "-9deg",
          }}
        >
          <img
            src="/keyboard.png"
            alt="Retro Mechanical Keyboard"
            className="pointer-events-none h-auto w-full select-none"
            draggable={false}
          />
        </motion.div>

        {/* Sticker 3: Mouse */}
        <motion.div
          drag={!reduceMotion}
          dragConstraints={stageRef}
          dragElastic={0.2}
          whileHover={{ scale: 1.08, cursor: "grab", zIndex: 30 }}
          whileTap={{ scale: 1.12, cursor: "grabbing", zIndex: 40 }}
          onMouseEnter={() => playHoverSound()}
          onPointerDown={() => playClickSound()}
          className="absolute drop-shadow-[0_12px_22px_rgba(0,0,0,0.55)] filter select-none"
          style={{
            left: "68%",
            top: "40%",
            width: "clamp(80px, 12vw, 135px)",
            rotate: "16deg",
          }}
        >
          <img
            src="/mouse.png"
            alt="Mouse"
            className="pointer-events-none h-auto w-full select-none"
            draggable={false}
          />
        </motion.div>

        {/* Sticker 4: Coffee Cup */}
        <motion.div
          drag={!reduceMotion}
          dragConstraints={stageRef}
          dragElastic={0.2}
          whileHover={{ scale: 1.08, cursor: "grab", zIndex: 30 }}
          whileTap={{ scale: 1.12, cursor: "grabbing", zIndex: 40 }}
          onMouseEnter={() => playHoverSound()}
          onPointerDown={() => playClickSound()}
          className="absolute drop-shadow-[0_14px_24px_rgba(0,0,0,0.55)] filter select-none"
          style={{
            right: "8%",
            top: "14%",
            width: "clamp(85px, 13vw, 140px)",
            rotate: "6deg",
          }}
        >
          <img
            src="/coffee.avif"
            alt="Coffee Cup"
            className="pointer-events-none h-auto w-full select-none"
            draggable={false}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default DeskStage
