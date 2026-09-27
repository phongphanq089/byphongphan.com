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
