# Not Found 01

> A 404 page with a playable brick breaker game.

## Installation

```bash
npx shadcn@latest add https://byphongphan.com/r/not-found-01.json
```

## Source Code

### `block/not-found-01/app/not-found.tsx`

```tsx
import { ArrowRight, Home, SearchX } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Daikanoid } from "../components/daikanoid"

export default function NotFound() {
  return (
    <main className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-background text-foreground select-none">
      {/* ── 1. Top 404 Message Bar (Technical Blueprint Style) ── */}
      <header className="relative z-20 flex shrink-0 flex-col items-center justify-between gap-4 border-b border-border bg-background/80 px-4 py-4 backdrop-blur-md sm:flex-row sm:px-8">
        {/* Left: 404 Badge & Heading */}
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted/60 text-muted-foreground">
            <SearchX className="size-4" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                404
              </span>
              <span className="text-muted-foreground/40">•</span>
              <h1 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
                Page not found
              </h1>
            </div>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              The page you are looking for does not exist or has been moved.
            </p>
          </div>
        </div>

        {/* Right: CTA Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 gap-1.5 rounded-lg border-border/80 text-xs"
          >
            <a href="/">
              <Home className="size-3.5" />
              <span>Go to Home</span>
              <ArrowRight className="size-3" />
            </a>
          </Button>
        </div>
      </header>

      {/* ── 2. Full-Screen Edge-to-Edge Game Canvas ── */}
      <section className="relative z-10 flex w-full flex-1 overflow-hidden">
        <Daikanoid className="h-full w-full" />
      </section>
    </main>
  )
}

```

### `block/not-found-01/components/daikanoid/index.tsx`

```tsx
export { Daikanoid } from "./component"
export * from "./types"

```

### `block/not-found-01/components/daikanoid/component.tsx`

```tsx
import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"

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

      <div className="pointer-events-none absolute inset-x-4 bottom-3 z-20 flex flex-wrap items-center justify-between font-mono text-[10px] tracking-wider text-muted-foreground/50 max-sm:hidden max-sm:justify-center sm:inset-x-8 sm:bottom-4">
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
                <h3 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Final Score: {score}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Press Enter or click below to retry.
                </p>
                <Button onClick={resetGame} className="mt-3">
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

```

### `block/not-found-01/components/daikanoid/ball.ts`

```tsx
import { BALL_RADIUS, INITIAL_BALL_SPEED, MAX_BALL_SPEED } from "./constants"
import type { Ball, Brick, Paddle, Particle } from "./types"

export function createInitialBall(
  canvasWidth: number,
  canvasHeight: number
): Ball {
  return {
    x: canvasWidth / 2,
    y: Math.max(50, canvasHeight - 65),
    radius: BALL_RADIUS,
    dx: (Math.random() > 0.5 ? 1 : -1) * (INITIAL_BALL_SPEED * 0.65),
    dy: -INITIAL_BALL_SPEED,
    speed: INITIAL_BALL_SPEED,
  }
}

export function updateBallPosition(ball: Ball): void {
  ball.x += ball.dx
  ball.y += ball.dy
}

export function handleBallWallCollision(
  ball: Ball,
  canvasWidth: number,
  canvasHeight: number
): { lost: boolean } {
  // Left wall
  if (ball.x - ball.radius <= 0) {
    ball.x = ball.radius
    ball.dx = Math.abs(ball.dx)
  }
  // Right wall
  else if (ball.x + ball.radius >= canvasWidth) {
    ball.x = canvasWidth - ball.radius
    ball.dx = -Math.abs(ball.dx)
  }

  // Top wall
  if (ball.y - ball.radius <= 0) {
    ball.y = ball.radius
    ball.dy = Math.abs(ball.dy)
  }

  // Bottom edge (fell off screen)
  if (ball.y - ball.radius > canvasHeight) {
    return { lost: true }
  }

  return { lost: false }
}

export function handleBallPaddleCollision(ball: Ball, paddle: Paddle): boolean {
  if (
    ball.y + ball.radius >= paddle.y &&
    ball.y - ball.radius <= paddle.y + paddle.height &&
    ball.x + ball.radius >= paddle.x &&
    ball.x - ball.radius <= paddle.x + paddle.width &&
    ball.dy > 0
  ) {
    // Determine hit position relative to paddle center (-1 to 1)
    const paddleCenter = paddle.x + paddle.width / 2
    const hitOffset = (ball.x - paddleCenter) / (paddle.width / 2)
    const clampedOffset = Math.max(-0.92, Math.min(0.92, hitOffset))

    // Calculate bounce angle based on strike position
    const maxBounceAngle = (Math.PI / 180) * 60
    const bounceAngle = clampedOffset * maxBounceAngle

    // Gradually increase speed slightly on paddle hits
    const nextSpeed = Math.min(MAX_BALL_SPEED, ball.speed + 0.15)
    ball.speed = nextSpeed

    ball.dx = nextSpeed * Math.sin(bounceAngle)
    ball.dy = -nextSpeed * Math.cos(bounceAngle)

    return true
  }
  return false
}

export function checkBallBrickCollision(
  ball: Ball,
  brick: Brick
): { hit: boolean; particles: Particle[] } {
  if (brick.isDestroyed) {
    return { hit: false, particles: [] }
  }

  // Closest point to ball center on the brick
  const closestX = Math.max(brick.x, Math.min(ball.x, brick.x + brick.width))
  const closestY = Math.max(brick.y, Math.min(ball.y, brick.y + brick.height))

  const distanceX = ball.x - closestX
  const distanceY = ball.y - closestY
  const distanceSquared = distanceX * distanceX + distanceY * distanceY

  if (distanceSquared <= ball.radius * ball.radius) {
    brick.isDestroyed = true

    // Determine bounce direction
    const prevX = ball.x - ball.dx
    const prevY = ball.y - ball.dy

    if (prevX < brick.x || prevX > brick.x + brick.width) {
      ball.dx = -ball.dx
    } else {
      ball.dy = -ball.dy
    }

    // Spawn monochrome destruction particles
    const particles: Particle[] = []
    const particleCount = 6
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5)
      const speed = 1.2 + Math.random() * 2
      particles.push({
        x: closestX,
        y: closestY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 2,
        color: brick.color,
        life: 1,
        maxLife: 18 + Math.random() * 12,
      })
    }

    return { hit: true, particles }
  }

  return { hit: false, particles: [] }
}

```

### `block/not-found-01/components/daikanoid/brick.ts`

```tsx
import type { GameColorPalette } from "./colors"
import {
  BASE_BRICK_GAP,
  BASE_BRICK_HEIGHT,
  BASE_BRICK_WIDTH,
  RETRO_404_MATRIX,
} from "./constants"
import type { Brick, Particle } from "./types"

export function create404Bricks(
  canvasWidth: number,
  canvasHeight: number,
  colors: GameColorPalette
): Brick[] {
  const bricks: Brick[] = []
  const rows = RETRO_404_MATRIX.length
  const cols = RETRO_404_MATRIX[0].length

  // Calculate responsive brick sizing so "404" is big, bold, and centered
  const availableWidth = Math.max(300, canvasWidth - 48)

  let gap = BASE_BRICK_GAP
  let brickWidth = BASE_BRICK_WIDTH
  let brickHeight = BASE_BRICK_HEIGHT

  if (canvasWidth < 600) {
    gap = 4
    brickWidth = Math.max(
      16,
      Math.floor((availableWidth - (cols - 1) * gap) / cols)
    )
    brickHeight = Math.max(12, Math.floor(brickWidth * 0.5))
  } else if (canvasWidth < 960) {
    gap = 6
    brickWidth = Math.min(
      42,
      Math.floor((availableWidth - (cols - 1) * gap) / cols)
    )
    brickHeight = Math.round(brickWidth * 0.46)
  } else {
    // Large viewports: substantial, punchy, arcade-scale 404
    gap = BASE_BRICK_GAP
    brickWidth = Math.min(
      56,
      Math.max(46, Math.floor((availableWidth - (cols - 1) * gap) / cols))
    )
    brickHeight = Math.round(brickWidth * 0.46)
  }

  const totalGridWidth = cols * brickWidth + (cols - 1) * gap
  const startX = (canvasWidth - totalGridWidth) / 2
  const startY = Math.max(48, Math.min(130, canvasHeight * 0.16))

  for (let r = 0; r < rows; r++) {
    const rowColor = colors.brickRows[r % colors.brickRows.length]
    const rowPoints = (rows - r) * 10

    for (let c = 0; c < cols; c++) {
      if (RETRO_404_MATRIX[r][c] === 1) {
        const x = startX + c * (brickWidth + gap)
        const y = startY + r * (brickHeight + gap)

        bricks.push({
          id: `brick-${r}-${c}`,
          x,
          y,
          width: brickWidth,
          height: brickHeight,
          rowIndex: r,
          color: rowColor,
          points: rowPoints,
          isDestroyed: false,
        })
      }
    }
  }

  return bricks
}

export function updateParticles(particles: Particle[]): Particle[] {
  return particles.filter((p) => {
    p.x += p.dx
    p.y += p.dy
    p.life += 1
    return p.life < p.maxLife
  })
}

```

### `block/not-found-01/components/daikanoid/paddle.ts`

```tsx
import { PADDLE_HEIGHT, PADDLE_SPEED } from "./constants"
import type { Paddle } from "./types"

export function createInitialPaddle(
  canvasWidth: number,
  canvasHeight: number
): Paddle {
  const width = Math.max(110, Math.min(170, canvasWidth * 0.15))
  return {
    x: (canvasWidth - width) / 2,
    y: Math.max(60, canvasHeight - 38),
    width,
    height: PADDLE_HEIGHT,
    speed: PADDLE_SPEED,
  }
}

export function movePaddleTo(
  paddle: Paddle,
  targetCenterX: number,
  canvasWidth: number
): void {
  const newX = targetCenterX - paddle.width / 2
  paddle.x = Math.max(0, Math.min(canvasWidth - paddle.width, newX))
}

export function movePaddleByDelta(
  paddle: Paddle,
  deltaX: number,
  canvasWidth: number
): void {
  const newX = paddle.x + deltaX
  paddle.x = Math.max(0, Math.min(canvasWidth - paddle.width, newX))
}

```

### `block/not-found-01/components/daikanoid/constants.ts`

```tsx
export const PADDLE_HEIGHT = 14
export const PADDLE_SPEED = 14

export const BALL_RADIUS = 7
export const INITIAL_BALL_SPEED = 6
export const MAX_BALL_SPEED = 12

export const BASE_BRICK_WIDTH = 52
export const BASE_BRICK_HEIGHT = 24
export const BASE_BRICK_GAP = 8

/**
 * 2D binary matrix representing "4 0 4" retro typography (16 columns x 5 rows).
 * 1 = Brick present, 0 = Empty space
 */
export const RETRO_404_MATRIX: number[][] = [
  // Row 0
  [1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1],
  // Row 1
  [1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
  // Row 2
  [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
  // Row 3
  [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  // Row 4
  [0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
]

```

### `block/not-found-01/components/daikanoid/colors.ts`

```tsx
/**
 * Technical Blueprint & Monochrome color tokens for Daikanoid.
 * Strictly adheres to the project's design system: pure grayscale,
 * calibrated contrast for both dark and light modes, zero rogue rainbow colors.
 */
export interface GameColorPalette {
  background: string
  grid: string
  crosshair: string
  paddle: string
  paddleGlow: string
  ball: string
  ballGlow: string
  brickRows: string[]
  brickBorder: string
  text: string
  textMuted: string
}

export function getGameColors(isDark = true): GameColorPalette {
  if (isDark) {
    return {
      background: "transparent",
      grid: "rgba(255, 255, 255, 0.035)",
      crosshair: "rgba(255, 255, 255, 0.08)",
      paddle: "rgba(255, 255, 255, 0.98)",
      paddleGlow: "rgba(255, 255, 255, 0.35)",
      ball: "#ffffff",
      ballGlow: "rgba(255, 255, 255, 0.55)",
      brickRows: [
        "rgba(255, 255, 255, 0.98)",
        "rgba(255, 255, 255, 0.86)",
        "rgba(255, 255, 255, 0.74)",
        "rgba(255, 255, 255, 0.60)",
        "rgba(255, 255, 255, 0.48)",
      ],
      brickBorder: "rgba(255, 255, 255, 0.22)",
      text: "rgba(255, 255, 255, 0.98)",
      textMuted: "rgba(255, 255, 255, 0.55)",
    }
  }

  return {
    background: "transparent",
    grid: "rgba(0, 0, 0, 0.04)",
    crosshair: "rgba(0, 0, 0, 0.08)",
    paddle: "rgba(0, 0, 0, 0.92)",
    paddleGlow: "rgba(0, 0, 0, 0.15)",
    ball: "rgba(0, 0, 0, 0.96)",
    ballGlow: "rgba(0, 0, 0, 0.25)",
    brickRows: [
      "rgba(0, 0, 0, 0.92)",
      "rgba(0, 0, 0, 0.78)",
      "rgba(0, 0, 0, 0.65)",
      "rgba(0, 0, 0, 0.52)",
      "rgba(0, 0, 0, 0.38)",
    ],
    brickBorder: "rgba(0, 0, 0, 0.16)",
    text: "rgba(0, 0, 0, 0.92)",
    textMuted: "rgba(0, 0, 0, 0.55)",
  }
}

```

### `block/not-found-01/components/daikanoid/types.ts`

```tsx
export interface Point {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Velocity {
  dx: number
  dy: number
}

export interface Ball {
  x: number
  y: number
  radius: number
  dx: number
  dy: number
  speed: number
}

export interface Paddle {
  x: number
  y: number
  width: number
  height: number
  speed: number
}

export interface Brick {
  id: string
  x: number
  y: number
  width: number
  height: number
  rowIndex: number
  color: string
  points: number
  isDestroyed: boolean
}

export interface Particle {
  x: number
  y: number
  dx: number
  dy: number
  size: number
  color: string
  life: number
  maxLife: number
}

export type GameStatus = "idle" | "playing" | "game_over" | "victory"

```
