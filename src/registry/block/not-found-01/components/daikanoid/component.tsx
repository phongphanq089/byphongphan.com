import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { Button } from "@/shared/ui/core"

import {
  checkBallBrickCollision,
  createInitialBall,
  handleBallPaddleCollision,
  handleBallWallCollision,
  updateBallPosition,
} from "./ball"
import { create404Bricks, updateParticles } from "./brick"
import { getGameColors } from "./colors"
import { createInitialPaddle, movePaddleByDelta, movePaddleTo } from "./paddle"
import type { Ball, Brick, GameStatus, Paddle, Particle } from "./types"

interface DaikanoidProps {
  className?: string
  onScoreChange?: (score: number) => void
}

export function Daikanoid({ className, onScoreChange }: DaikanoidProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [status, setStatus] = useState<GameStatus>("idle")
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [highScore, setHighScore] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Fluid viewport dimensions
  const dimsRef = useRef({ width: 800, height: 480 })

  // Real-time Dark/Light theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document === "undefined") return true
    return (
      document.documentElement.classList.contains("dark") ||
      (!document.documentElement.classList.contains("light") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    )
  })

  // Watch for theme toggles dynamically
  useEffect(() => {
    const updateTheme = () => {
      const dark =
        document.documentElement.classList.contains("dark") ||
        (!document.documentElement.classList.contains("light") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      setIsDark(dark)
    }

    updateTheme()

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === "class") {
          updateTheme()
        }
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    const handleMql = () => updateTheme()
    mql.addEventListener("change", handleMql)

    return () => {
      observer.disconnect()
      mql.removeEventListener("change", handleMql)
    }
  }, [])

  // Game state refs for 60fps loop
  const ballRef = useRef<Ball>(createInitialBall(800, 480))
  const paddleRef = useRef<Paddle>(createInitialPaddle(800, 480))
  const bricksRef = useRef<Brick[]>([])
  const particlesRef = useRef<Particle[]>([])
  const scoreRef = useRef(0)
  const livesRef = useRef(3)
  const statusRef = useRef<GameStatus>("idle")
  const animationFrameRef = useRef<number | null>(null)
  const isDarkRef = useRef(isDark)
  isDarkRef.current = isDark

  // Web Audio synthesizer (soft sine wave matching technical UI)
  const playBeep = useCallback(
    (freq: number, duration = 0.06) => {
      if (!soundEnabled) return
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext
        if (!AudioContextClass) return
        const ctx = new AudioContextClass()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(freq, ctx.currentTime)
        gain.gain.setValueAtTime(0.04, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + duration
        )
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + duration)
      } catch {
        // Silently ignore audio autoplay restrictions
      }
    },
    [soundEnabled]
  )

  const initGame = useCallback(
    (w: number, h: number) => {
      const colors = getGameColors(isDarkRef.current)
      const paddle = createInitialPaddle(w, h)
      paddleRef.current = paddle

      const ball = createInitialBall(w, h)
      ball.x = paddle.x + paddle.width / 2
      ball.y = paddle.y - ball.radius - 2
      ballRef.current = ball

      bricksRef.current = create404Bricks(w, h, colors)
      particlesRef.current = []
      scoreRef.current = 0
      livesRef.current = 3
      setScore(0)
      setLives(3)
      onScoreChange?.(0)
    },
    [onScoreChange]
  )

  const resetGame = useCallback(() => {
    const { width, height } = dimsRef.current
    initGame(width, height)
    setStatus("playing")
    statusRef.current = "playing"
  }, [initGame])

  const startGame = useCallback(() => {
    if (status === "idle") {
      setStatus("playing")
      statusRef.current = "playing"
    } else if (status === "game_over" || status === "victory") {
      resetGame()
    } else {
      setStatus("playing")
      statusRef.current = "playing"
    }
  }, [status, resetGame])

  // ResizeObserver for fluid full-screen canvas
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleResize = () => {
      const rect = container.getBoundingClientRect()
      const w = Math.floor(rect.width)
      const h = Math.floor(rect.height)
      if (w <= 0 || h <= 0) return

      dimsRef.current = { width: w, height: h }

      const canvas = canvasRef.current
      if (canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = w * dpr
        canvas.height = h * dpr
      }

      // Re-align paddle and bricks if game is in idle state
      if (statusRef.current === "idle") {
        initGame(w, h)
      } else {
        paddleRef.current.y = Math.max(50, h - 38)
      }
    }

    handleResize()
    const ro = new ResizeObserver(handleResize)
    ro.observe(container)

    return () => ro.disconnect()
  }, [initGame])

  // Mouse / Pointer Move
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const canvasX = e.clientX - rect.left
      movePaddleTo(paddleRef.current, canvasX, dimsRef.current.width)

      // If idle, ball tracks on top of paddle
      if (statusRef.current === "idle") {
        const paddle = paddleRef.current
        ballRef.current.x = paddle.x + paddle.width / 2
        ballRef.current.y = paddle.y - ballRef.current.radius - 2
      }
    },
    []
  )

  // Clicking on canvas when idle launches the game
  const handleCanvasClick = useCallback(() => {
    if (statusRef.current === "idle") {
      startGame()
    }
  }, [startGame])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (statusRef.current !== "playing") {
        if (e.code === "Space" || e.code === "Enter") {
          e.preventDefault()
          startGame()
        }
        return
      }

      const { width } = dimsRef.current
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        movePaddleByDelta(paddleRef.current, -35, width)
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        movePaddleByDelta(paddleRef.current, 35, width)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [startGame])

  // 60fps Game Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const render = () => {
      const { width: w, height: h } = dimsRef.current
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const colors = getGameColors(isDarkRef.current)

      ctx.save()
      ctx.scale(dpr, dpr)

      // 1. Clear Canvas (Transparent to blend with site background)
      ctx.clearRect(0, 0, w, h)

      // 2. Blueprint Grid
      ctx.strokeStyle = colors.grid
      ctx.lineWidth = 1
      const gridSize = 48
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      // 3. Render Bricks (using current theme row color dynamically)
      for (const brick of bricksRef.current) {
        if (!brick.isDestroyed) {
          ctx.save()
          const brickColor =
            colors.brickRows[brick.rowIndex % colors.brickRows.length]
          ctx.fillStyle = brickColor
          ctx.strokeStyle = colors.brickBorder
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 3)
          ctx.fill()
          ctx.stroke()
          ctx.restore()
        }
      }

      // 4. Render Particles
      particlesRef.current = updateParticles(particlesRef.current)
      for (const p of particlesRef.current) {
        ctx.save()
        ctx.fillStyle = p.color
        const alpha = 1 - p.life / p.maxLife
        ctx.globalAlpha = Math.max(0, alpha)
        ctx.fillRect(p.x, p.y, p.size, p.size)
        ctx.restore()
      }

      // 5. Render Paddle
      const paddle = paddleRef.current
      ctx.save()
      ctx.fillStyle = colors.paddle
      ctx.shadowColor = colors.paddleGlow
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 7)
      ctx.fill()
      ctx.restore()

      // 6. Render Ball
      const ball = ballRef.current
      ctx.save()
      ctx.fillStyle = colors.ball
      ctx.shadowColor = colors.ballGlow
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // 7. Physics Step
      if (statusRef.current === "playing") {
        updateBallPosition(ball)

        // Wall collisions
        const wallResult = handleBallWallCollision(ball, w, h)
        if (wallResult.lost) {
          livesRef.current -= 1
          setLives(livesRef.current)
          playBeep(160, 0.15)

          if (livesRef.current <= 0) {
            statusRef.current = "game_over"
            setStatus("game_over")
          } else {
            // Respawn ball above paddle
            const respawnBall = createInitialBall(w, h)
            respawnBall.x = paddle.x + paddle.width / 2
            respawnBall.y = paddle.y - respawnBall.radius - 2
            ballRef.current = respawnBall
          }
        }

        // Paddle collision
        if (handleBallPaddleCollision(ball, paddle)) {
          playBeep(420, 0.05)
        }

        // Brick collisions
        let remainingBricks = 0
        for (const brick of bricksRef.current) {
          if (!brick.isDestroyed) {
            remainingBricks++
            const collision = checkBallBrickCollision(ball, brick)
            if (collision.hit) {
              scoreRef.current += brick.points
              setScore(scoreRef.current)
              onScoreChange?.(scoreRef.current)
              setHighScore((prev) => Math.max(prev, scoreRef.current))
              particlesRef.current.push(...collision.particles)
              playBeep(520 + brick.points * 5, 0.04)
              break
            }
          }
        }

        // Victory check
        if (remainingBricks === 0) {
          statusRef.current = "victory"
          setStatus("victory")
          playBeep(840, 0.25)
        }
      }

      ctx.restore()
      animationFrameRef.current = requestAnimationFrame(render)
    }

    animationFrameRef.current = requestAnimationFrame(render)

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [playBeep, onScoreChange])

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden select-none ${className ?? ""}`}
    >
      {/* Top Floating HUD Bar (Monochrome, Blueprint Typography) */}
      <div className="pointer-events-none absolute inset-x-4 top-4 z-20 flex items-center justify-between sm:inset-x-8 sm:top-6">
        {/* Score & High Score */}
        <div className="pointer-events-auto flex items-center gap-6">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              Score
            </span>
            <span className="font-mono text-sm font-semibold tracking-tight text-foreground sm:text-base">
              {score.toString().padStart(4, "0")}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              High
            </span>
            <span className="font-mono text-sm font-semibold tracking-tight text-foreground/80 sm:text-base">
              {highScore.toString().padStart(4, "0")}
            </span>
          </div>
        </div>

        {/* Lives & Audio Toggle */}
        <div className="pointer-events-auto flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="mr-1 hidden font-mono text-[10px] tracking-widest text-muted-foreground uppercase sm:inline-block">
              Lives
            </span>
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={`size-2.5 rounded-full transition-all duration-200 ${
                  i < lives
                    ? "bg-foreground shadow-[0_0_8px_currentColor]"
                    : "border border-border opacity-20"
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSoundEnabled((prev) => !prev)}
            className="size-7 rounded-md text-muted-foreground hover:text-foreground"
            title={soundEnabled ? "Mute audio" : "Enable audio"}
          >
            {soundEnabled ? (
              <Volume2 className="size-3.5" />
            ) : (
              <VolumeX className="size-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Edge-to-Edge Canvas Surface */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onPointerMove={handlePointerMove}
        className="h-full w-full cursor-pointer touch-none"
      />

      {/* Subtle Bottom Controls Hint */}
      <div className="pointer-events-none absolute inset-x-4 bottom-3 z-20 flex items-center justify-between font-mono text-[10px] tracking-wider text-muted-foreground/50 sm:inset-x-8 sm:bottom-4">
        <span>Move mouse or [A / D / ← / →] to steer</span>
        <span>Click / Space / Enter to launch</span>
      </div>

      {/* ── Start Game Prompt (Non-blocking Floating Button - NO BLUR OVERLAY) ── */}
      {status === "idle" && (
        <div className="pointer-events-auto absolute top-[60%] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2">
          <Button
            variant="default"
            size="default"
            onClick={startGame}
            className="h-9 gap-2 rounded-xl px-5 font-mono text-xs font-semibold shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Play className="size-3.5 fill-current" />
            <span>START GAME</span>
            <span className="ml-1 rounded border border-primary-foreground/30 bg-primary-foreground/15 px-1.5 py-0.5 text-[9px] font-normal tracking-normal">
              ↵ Enter
            </span>
          </Button>
          <span className="font-mono text-[10px] text-muted-foreground/70">
            or press [Space] to launch
          </span>
        </div>
      )}

      {/* ── Game Over / Victory Floating Modal (Compact card, no full-screen veil) ── */}
      {(status === "game_over" || status === "victory") && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/50 p-4 backdrop-blur-xs">
          <div className="flex flex-col items-center rounded-2xl border border-border bg-background/95 p-6 shadow-2xl backdrop-blur-md">
            {status === "game_over" && (
              <>
                <span className="font-mono text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  Game Over
                </span>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Final Score: {score}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Press Enter or click below to retry.
                </p>
                <Button
                  variant="default"
                  size="default"
                  onClick={resetGame}
                  className="mt-5 gap-2 rounded-xl px-5 font-semibold"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Play Again</span>
                  <span className="ml-1 rounded border border-primary-foreground/30 bg-primary-foreground/15 px-1.5 py-0.5 text-[9px] font-normal tracking-normal">
                    ↵ Enter
                  </span>
                </Button>
              </>
            )}

            {status === "victory" && (
              <>
                <span className="font-mono text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  Victory
                </span>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  All 404 Bricks Cleared!
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Final Score: {score}
                </p>
                <Button
                  variant="default"
                  size="default"
                  onClick={resetGame}
                  className="mt-5 gap-2 rounded-xl px-5 font-semibold"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Play Again</span>
                  <span className="ml-1 rounded border border-primary-foreground/30 bg-primary-foreground/15 px-1.5 py-0.5 text-[9px] font-normal tracking-normal">
                    ↵ Enter
                  </span>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
