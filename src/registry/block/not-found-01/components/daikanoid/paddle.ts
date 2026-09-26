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
