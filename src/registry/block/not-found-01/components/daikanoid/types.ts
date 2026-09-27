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
