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
