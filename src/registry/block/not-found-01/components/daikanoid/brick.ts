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
