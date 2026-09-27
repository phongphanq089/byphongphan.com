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
