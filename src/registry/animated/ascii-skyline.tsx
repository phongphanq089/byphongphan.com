/* eslint-disable react-hooks/refs */

import React, { useEffect, useLayoutEffect, useRef, useState } from "react"

import { cn } from "@/shared/lib/utils"

export type SkylineStats = {
  cols: number
  rows: number
  activeWindows: number
}

export type Box = {
  left: number
  top: number
  right: number
  bottom: number
}

const STEP = 1 / 60
const MAX_STEPS = 4
const INTERACTIVE =
  "a, button, input, textarea, select, label, [role='button'], [data-ascii-ignore]"
const AVOID_TARGETS = "[data-ascii-avoid]"
const MEASURE_EVERY_FRAMES = 30
const MERGE_GAP_PX = 160

// Dải ký tự ASCII sắp xếp theo mật độ điểm ảnh tăng dần (từ tối/rỗng đến sáng/đặc)
const ASCII_RAMP =
  " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"

function clamp(v: number, min: number, max: number) {
  return v < min ? min : v > max ? max : v
}

function hash2D(x: number, y: number): number {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123
  return h - Math.floor(h)
}

function smoothNoise(x: number, y: number): number {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)

  const a = hash2D(ix, iy)
  const b = hash2D(ix + 1, iy)
  const c = hash2D(ix, iy + 1)
  const d = hash2D(ix + 1, iy + 1)

  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy
}

function mergeNearby(boxes: Box[]) {
  const merged: Box[] = []
  for (const b of [...boxes].sort((p, q) => p.top - q.top)) {
    const near = merged.find(
      (m) =>
        b.top - m.bottom < MERGE_GAP_PX &&
        b.left - m.right < MERGE_GAP_PX &&
        m.left - b.right < MERGE_GAP_PX
    )
    if (!near) {
      merged.push({ ...b })
      continue
    }
    near.left = Math.min(near.left, b.left)
    near.right = Math.max(near.right, b.right)
    near.bottom = Math.max(near.bottom, b.bottom)
  }
  return merged
}

// ============================================================================
// 1. WORLD: Mô phỏng hình học Toà nhà, Bầu trời, Cửa sổ & Tán cây
// ============================================================================
interface BuildingDef {
  x0: number // Tỷ lệ ngang 0..1
  x1: number
  yTop: number // Tỷ lệ dọc 0..1 (0 là đỉnh màn hình)
  layer: number // 0: xa, 1: vừa, 2: gần
  style: "tower" | "tapered-supertall" | "lattice" | "stepped"
  windowDensity: number
  hasCrane?: boolean
}

// Thiết kế chuẩn theo bố cục bức ảnh mẫu của bạn
const SKYLINE_BUILDINGS: BuildingDef[] = [
  // Tháp khung giàn thép ngoài cùng bên trái
  {
    x0: 0.012,
    x1: 0.048,
    yTop: 0.34,
    layer: 1,
    style: "lattice",
    windowDensity: 0.15,
  },
  {
    x0: 0.088,
    x1: 0.125,
    yTop: 0.42,
    layer: 0,
    style: "tower",
    windowDensity: 0.25,
  },
  // Khối nhà bậc thang bên trái
  {
    x0: 0.155,
    x1: 0.255,
    yTop: 0.38,
    layer: 2,
    style: "stepped",
    windowDensity: 0.35,
  },
  {
    x0: 0.245,
    x1: 0.275,
    yTop: 0.33,
    layer: 0,
    style: "lattice",
    windowDensity: 0.1,
  },
  // Cụm cao ốc trung tâm trái + Tháp nhọn
  {
    x0: 0.285,
    x1: 0.365,
    yTop: 0.27,
    layer: 1,
    style: "stepped",
    windowDensity: 0.45,
  },
  {
    x0: 0.372,
    x1: 0.415,
    yTop: 0.44,
    layer: 0,
    style: "tower",
    windowDensity: 0.3,
  },
  {
    x0: 0.422,
    x1: 0.502,
    yTop: 0.39,
    layer: 2,
    style: "tower",
    windowDensity: 0.4,
  },
  // Tòa cao ốc trung tâm đứng cạnh vùng phát sáng
  {
    x0: 0.508,
    x1: 0.565,
    yTop: 0.27,
    layer: 1,
    style: "tower",
    windowDensity: 0.55,
  },
  {
    x0: 0.562,
    x1: 0.608,
    yTop: 0.41,
    layer: 0,
    style: "tower",
    windowDensity: 0.3,
  },
  {
    x0: 0.628,
    x1: 0.688,
    yTop: 0.35,
    layer: 1,
    style: "tower",
    windowDensity: 0.5,
  },
  // Tòa tháp chọc trời cao nhất (Supertall) có cần cẩu trên đỉnh
  {
    x0: 0.706,
    x1: 0.762,
    yTop: 0.075,
    layer: 2,
    style: "tapered-supertall",
    windowDensity: 0.48,
    hasCrane: true,
  },
  // Cụm cao ốc bên phải
  {
    x0: 0.735,
    x1: 0.805,
    yTop: 0.41,
    layer: 2,
    style: "tower",
    windowDensity: 0.35,
  },
  {
    x0: 0.802,
    x1: 0.848,
    yTop: 0.275,
    layer: 1,
    style: "tower",
    windowDensity: 0.45,
  },
  {
    x0: 0.858,
    x1: 0.922,
    yTop: 0.35,
    layer: 2,
    style: "stepped",
    windowDensity: 0.4,
  },
  {
    x0: 0.928,
    x1: 0.995,
    yTop: 0.315,
    layer: 2,
    style: "tower",
    windowDensity: 0.38,
  },
]

class SkylineWorld {
  public width = 1
  public height = 1
  public cols = 1
  public rows = 1
  public cellW = 6
  public cellH = 8
  public time = 0
  public avoid: Box[] = []
  public pointer = { x: 0, y: 0, active: false, speed: 0 }

  // Bộ đệm lưu trữ cấu trúc tĩnh (bầu trời, tòa nhà, cây cối) để không phải tính lại mỗi frame
  public staticMask = new Uint8Array(1) // 0: sky, 1: building, 2: window, 3: foliage, 4: crane/frame
  public baseLum = new Float32Array(1)
  public windowSeed = new Float32Array(1)
  public activeWindowCount = 0

  resize(width: number, height: number) {
    this.width = width
    this.height = height
    // Kích thước mỗi ô ký tự nhỏ mịn như trong ảnh mẫu
    this.cellW = width < 640 ? 5 : 6
    this.cellH = width < 640 ? 7 : 8
    this.cols = Math.max(1, Math.floor(width / this.cellW))
    this.rows = Math.max(1, Math.floor(height / this.cellH))

    const size = this.cols * this.rows
    this.staticMask = new Uint8Array(size)
    this.baseLum = new Float32Array(size)
    this.windowSeed = new Float32Array(size)

    this.bakeScene()
  }

  step(dt: number) {
    this.time += dt
  }

  // Khởi tạo bản đồ độ sâu đường chân trời, cửa sổ và tán cây
  private bakeScene() {
    const { cols, rows } = this
    let winCount = 0

    // Tiền tính toán đường viền tán cây tiền cảnh (Foreground Foliage)
    const foliageTop = new Float32Array(cols)
    for (let c = 0; c < cols; c++) {
      const nx = c / cols
      const canopy =
        0.69 +
        Math.sin(nx * 19.0 + 0.5) * 0.045 +
        Math.cos(nx * 43.0 - 1.2) * 0.028 +
        (smoothNoise(nx * 32, 4.2) - 0.5) * 0.06
      foliageTop[c] = clamp(canopy, 0.58, 0.82)
    }

    // Pre-compute inverse values
    const invCols = 1 / cols
    const invRows = 1 / rows

    for (let r = 0; r < rows; r++) {
      const ny = r * invRows
      const rowOffset = r * cols

      for (let c = 0; c < cols; c++) {
        const nx = c * invCols
        const idx = rowOffset + c

        // 1. Độ sáng nền bầu trời (Tăng dần nhẹ về phía đường chân trời + sương mù)
        const horizonGlow = Math.exp(-Math.pow((ny - 0.44) / 0.26, 2)) * 0.18
        const vignette = 1 - Math.pow((nx - 0.5) * 1.15, 2) * 0.28
        let skyLum = (0.28 + horizonGlow) * vignette

        // Quầng sáng chữ nhật đặc trưng ở giữa (x ≈ 0.585, y ≈ 0.37) giống ảnh mẫu
        const bloomDx = (nx - 0.586) / 0.024
        const bloomDy = (ny - 0.368) / 0.062
        if (Math.abs(bloomDx) < 1.8 && Math.abs(bloomDy) < 1.6) {
          const bloom = Math.exp(
            -(bloomDx * bloomDx * 1.6 + bloomDy * bloomDy * 1.4)
          )
          skyLum += bloom * 0.42
        }

        // Quầng sáng phụ dịu hơn bên cạnh tòa tháp cao nhất
        const sideGlowDx = (nx - 0.775) / 0.035
        const sideGlowDy = (ny - 0.36) / 0.08
        skyLum +=
          Math.exp(-(sideGlowDx * sideGlowDx + sideGlowDy * sideGlowDy)) * 0.16

        this.staticMask[idx] = 0
        this.baseLum[idx] = clamp(skyLum, 0.05, 0.88)

        // 2. Kiểm tra va chạm với các tòa nhà (Skyline Buildings)
        for (let bIdx = 0; bIdx < SKYLINE_BUILDINGS.length; bIdx++) {
          const b = SKYLINE_BUILDINGS[bIdx]
          let left = b.x0
          let right = b.x1
          const top = b.yTop

          if (ny < top - 0.03) continue

          // Biến dạng hình học theo loại tòa nhà
          if (b.style === "tapered-supertall") {
            // Tháp cao nhất thu hẹp dần từ dưới lên đỉnh
            const progress = clamp((ny - top) / (0.65 - top), 0, 1)
            const halfW =
              (right - left) * 0.5 * (0.42 + 0.58 * Math.pow(progress, 0.75))
            const center = (left + right) * 0.5 - (1 - progress) * 0.004
            left = center - halfW
            right = center + halfW

            // Cần cẩu trên đỉnh tháp cao nhất
            if (b.hasCrane && ny >= top - 0.015 && ny <= top + 0.012) {
              const craneArmLeft = center - 0.005
              const craneArmRight = center + 0.036
              if (
                nx >= craneArmLeft &&
                nx <= craneArmRight &&
                ny <= top - 0.003
              ) {
                this.staticMask[idx] = 4
                this.baseLum[idx] = 0.08
              }
            }
          } else if (b.style === "stepped") {
            const stepProgress = ny - top
            if (stepProgress < 0.06) {
              left += (right - left) * 0.25
              right -= (right - left) * 0.25
            } else if (stepProgress < 0.13) {
              left += (right - left) * 0.12
            }
          }

          if (nx >= left && nx <= right && ny >= top) {
            if (b.style === "lattice") {
              // Kết cấu tháp khung thép rỗng bên trái
              const isEdge =
                nx - left < 0.004 || right - nx < 0.004 || ny - top < 0.008
              const isCross = (c + r) % 3 === 0 || r % 4 === 0
              if (isEdge || isCross) {
                this.staticMask[idx] = 4
                this.baseLum[idx] = 0.09
              }
              continue
            }

            // Thân tòa nhà đặc (tối sẫm tùy theo lớp xa/gần)
            const buildingShade =
              b.layer === 2 ? 0.035 : b.layer === 1 ? 0.065 : 0.1
            this.staticMask[idx] = 1
            this.baseLum[idx] = buildingShade

            // Tạo các dải ô cửa sổ sáng bên trong tòa nhà
            const isMargin =
              nx - left < 0.004 || right - nx < 0.004 || ny - top < 0.01
            if (!isMargin && r % 2 === 0 && c % 2 === 0) {
              const bandSeed = hash2D(
                bIdx * 17 + Math.floor(r / 2),
                Math.floor(c / 3)
              )
              if (bandSeed < b.windowDensity * 0.32) {
                this.staticMask[idx] = 2
                this.windowSeed[idx] = hash2D(c * 3.1, r * 7.3)
                this.baseLum[idx] = 0.16 + bandSeed * 0.45
                winCount++
              }
            }
          }
        }

        // 3. Tán cây tiền cảnh (Foliage Silhouette) ở phần dưới bức ảnh
        const treeLine = foliageTop[c]
        if (ny >= treeLine) {
          const depthInTree = (ny - treeLine) / (1 - treeLine)
          const leafNoise = smoothNoise(c * 0.35, r * 0.35)
          // Rìa tán cây có độ xốp tự nhiên
          if (depthInTree > 0.06 || leafNoise > 0.38) {
            this.staticMask[idx] = 3
            // Điểm xuyết vài khe sáng đèn đường dưới chân rặng cây (như góc dưới ảnh mẫu)
            const streetGlint =
              ny > 0.88 && hash2D(Math.floor(c / 2), Math.floor(r / 2)) > 0.965
                ? 0.28
                : 0
            this.baseLum[idx] =
              streetGlint > 0 ? streetGlint : 0.015 + leafNoise * 0.025
          }
        }
      }
    }

    this.activeWindowCount = winCount
  }
}

// ============================================================================
// 2. RENDERER: Pre-baked Glyph Atlas & High-Speed Canvas Matrix
// ============================================================================
class AsciiSkylineRenderer {
  private ctx: CanvasRenderingContext2D
  private dpr = 1
  private isLight = false
  private dimBoxes: Box[] = []

  // Offscreen Glyph Atlas giúp render 30.000+ ký tự ở 60fps
  private atlasCanvas: HTMLCanvasElement
  private atlasLevels = 32
  private cellW = 6
  private cellH = 8

  // Pre-computed dim mask (Uint8) giảm chi phí dimBox check trong hot loop
  private dimMask: Uint8Array | null = null
  private dimMaskCols = 0
  private dimMaskRows = 0

  constructor(private canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d", { alpha: false })
    if (!context) throw new Error("Canvas 2D context not supported")
    this.ctx = context
    this.atlasCanvas = document.createElement("canvas")
    this.rebuildAtlas()
  }

  setTheme(isLight: boolean) {
    if (this.isLight === isLight) return
    this.isLight = isLight
    this.rebuildAtlas()
  }

  setDimBoxes(
    boxes: Box[],
    cols: number,
    rows: number,
    cellW: number,
    cellH: number
  ) {
    this.dimBoxes = boxes

    // Pre-compute dim mask: đánh dấu cell nào nằm trong vùng dimBox
    // Thay vì check O(cells × boxes) mỗi frame, chỉ check 1 lần khi boxes thay đổi
    if (boxes.length === 0) {
      this.dimMask = null
      return
    }

    const size = cols * rows
    if (
      !this.dimMask ||
      this.dimMaskCols !== cols ||
      this.dimMaskRows !== rows
    ) {
      this.dimMask = new Uint8Array(size)
    } else {
      this.dimMask.fill(0)
    }
    this.dimMaskCols = cols
    this.dimMaskRows = rows

    for (let r = 0; r < rows; r++) {
      const py = r * cellH
      const rowOffset = r * cols
      for (let c = 0; c < cols; c++) {
        const px = c * cellW
        for (let b = 0; b < boxes.length; b++) {
          const box = boxes[b]
          if (
            px >= box.left - 24 &&
            px <= box.right + 24 &&
            py >= box.top - 24 &&
            py <= box.bottom + 24
          ) {
            this.dimMask![rowOffset + c] = 1
            break
          }
        }
      }
    }
  }

  resize(
    width: number,
    height: number,
    dpr: number,
    cellW: number,
    cellH: number
  ) {
    this.dpr = dpr
    this.cellW = cellW
    this.cellH = cellH
    this.canvas.width = Math.round(width * dpr)
    this.canvas.height = Math.round(height * dpr)
    this.rebuildAtlas()
  }

  // Tạo sẵn dải 32 mức độ sáng ký tự ASCII + đường kẻ lưới (Grid Matrix)
  private rebuildAtlas() {
    const { atlasLevels, cellW, cellH, dpr, isLight } = this
    const w = Math.max(1, Math.round(cellW * dpr))
    const h = Math.max(1, Math.round(cellH * dpr))

    this.atlasCanvas.width = w * atlasLevels
    this.atlasCanvas.height = h

    const actx = this.atlasCanvas.getContext("2d")
    if (!actx) return

    actx.textAlign = "center"
    actx.textBaseline = "middle"
    actx.font = `600 ${Math.max(6, Math.round(h * 0.82))}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

    for (let i = 0; i < atlasLevels; i++) {
      const t = i / (atlasLevels - 1) // 0 (tối đen) -> 1 (sáng rõ)
      const x = i * w

      // Màu nền từng ô (Cell Background)
      const bgVal = isLight
        ? Math.round(245 - (1 - t) * 215)
        : Math.round(4 + Math.pow(t, 1.15) * 95)
      actx.fillStyle = `rgb(${bgVal}, ${bgVal}, ${bgVal})`
      actx.fillRect(x, 0, w, h)

      // Đường kẻ lưới CRT / Matrix siêu mảnh giống hệt kết cấu trong ảnh mẫu
      const gridVal = isLight
        ? Math.max(0, bgVal - 16)
        : Math.max(0, Math.round(bgVal * 0.72))
      actx.fillStyle = `rgb(${gridVal}, ${gridVal}, ${gridVal})`
      actx.fillRect(x, 0, w, Math.max(1, Math.round(dpr * 0.6)))
      actx.fillRect(x, 0, Math.max(1, Math.round(dpr * 0.6)), h)

      // Chọn ký tự ASCII tương ứng với độ sáng
      const charIdx = Math.min(
        ASCII_RAMP.length - 1,
        Math.floor(Math.pow(t, 0.9) * (ASCII_RAMP.length - 1))
      )
      const ch = ASCII_RAMP[charIdx]

      // Màu ký tự ASCII
      const fgVal = isLight
        ? Math.round(255 - (1 - t) * 235)
        : Math.min(255, Math.round(12 + Math.pow(t, 0.95) * 215))
      actx.fillStyle = `rgb(${fgVal}, ${fgVal}, ${fgVal})`
      actx.fillText(ch, x + w * 0.5, h * 0.54)
    }
  }

  render(world: SkylineWorld) {
    const { cols, rows, cellW, cellH, time, pointer } = world
    const { dpr, atlasLevels, atlasCanvas, ctx, dimMask } = this
    const cw = Math.round(cellW * dpr)
    const ch = Math.round(cellH * dpr)
    const levelsM1 = atlasLevels - 1

    ctx.save()
    ctx.imageSmoothingEnabled = false

    // Pre-compute pointer values outside loop khi active
    const pActive = pointer.active
    const pX = pointer.x
    const pY = pointer.y
    const radiusSq = 180 * 180

    // Grain tick cho sky — thay đổi chậm (~4 lần/giây) để dot nháy nhẹ
    const grainTick = Math.floor(time * 4)

    // Pre-compute sin values for window flicker — chỉ phụ thuộc vào time, cache ngoài loop
    // Vì windowSeed biến thiên liên tục nên ta dùng sin/cos expansion:
    // sin(t * (0.6 + s*1.8) + s*30) = sin(0.6t + s*(1.8t+30))
    const sinBase = Math.sin(time * 0.6)
    const cosBase = Math.cos(time * 0.6)

    // Pre-compute crane beacon state
    const beaconOn = Math.sin(time * 3.2) > 0.3
    const beaconLum = beaconOn ? 0.65 : 0.08
    const craneRowThreshold = rows * 0.1

    for (let r = 0; r < rows; r++) {
      const rowOffset = r * cols
      const rCh = r * ch

      for (let c = 0; c < cols; c++) {
        const idx = rowOffset + c

        const mask = world.staticMask[idx]
        let lum = world.baseLum[idx]

        if (mask === 0) {
          // Bầu trời: chỉ grain nhấp nháy nhẹ kiểu ASCII dot
          lum += (hash2D(c + grainTick, r) - 0.5) * 0.04
        } else if (mask === 2) {
          // Ô cửa sổ: nhấp nháy chậm
          const seed = world.windowSeed[idx]
          const phase = seed * (1.8 * time + 30) // s*(1.8t+30)
          const sinPhase = Math.sin(phase)
          const cosPhase = Math.cos(phase)
          // sin(0.6t + phase) = sin(0.6t)cos(phase) + cos(0.6t)sin(phase)
          const pulse = sinBase * cosPhase + cosBase * sinPhase
          lum = pulse > -0.35 ? lum * (0.85 + 0.25 * pulse) : 0.04
        } else if (mask === 4 && r < craneRowThreshold) {
          // Đèn cảnh báo trên đỉnh cần cẩu tháp chọc trời
          if (c % 6 === 0) lum = beaconLum
        }

        // Hiệu ứng tương tác trỏ chuột (Ánh trăng / Đèn rọi dịu qua sương mù)
        if (pActive) {
          const px = c * cellW
          const py = r * cellH
          const dx = px - pX
          const dy = py - pY
          const distSq = dx * dx + dy * dy
          if (distSq < radiusSq) {
            const t = 1 - distSq / radiusSq
            lum += t * t * (mask === 0 ? 0.22 : 0.12)
          }
        }

        // Quantize luminance to atlas level
        let level = (lum * levelsM1) | 0
        if (level < 0) level = 0
        else if (level > levelsM1) level = levelsM1

        ctx.drawImage(atlasCanvas, level * cw, 0, cw, ch, c * cw, rCh, cw, ch)
      }
    }

    ctx.restore()
  }
}

// ============================================================================
// 3. ENGINE: Quản lý vòng lặp, ResizeObserver, IntersectionObserver & Events
// ============================================================================
class SkylineEngine {
  private world = new SkylineWorld()
  private renderer: AsciiSkylineRenderer
  private raf = 0
  private last = 0
  private acc = 0
  private frames = 0
  private lastPointerTime = 0
  private reported: SkylineStats = { cols: -1, rows: -1, activeWindows: -1 }
  private visible = true
  private disposed = false
  private reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  private resizeObserver = new ResizeObserver(() => this.resize())
  private intersectionObserver = new IntersectionObserver(([entry]) => {
    this.visible = entry.isIntersecting
    this.schedule()
  })

  constructor(
    private canvas: HTMLCanvasElement,
    private onStats?: (stats: SkylineStats) => void
  ) {
    this.renderer = new AsciiSkylineRenderer(canvas)
    this.resizeObserver.observe(canvas)
    this.intersectionObserver.observe(canvas)
    this.reducedMotion.addEventListener("change", this.schedule)
    window.addEventListener("pointermove", this.onPointerMove, {
      passive: true,
    })
    document.documentElement.addEventListener(
      "pointerleave",
      this.onPointerLeave
    )
    window.addEventListener("blur", this.onPointerLeave)
    this.resize()
    this.schedule()
  }

  destroy() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    this.resizeObserver.disconnect()
    this.intersectionObserver.disconnect()
    this.reducedMotion.removeEventListener("change", this.schedule)
    window.removeEventListener("pointermove", this.onPointerMove)
    document.documentElement.removeEventListener(
      "pointerleave",
      this.onPointerLeave
    )
    window.removeEventListener("blur", this.onPointerLeave)
  }

  setTheme(isLight: boolean) {
    this.renderer.setTheme(isLight)
    if (this.reducedMotion.matches) this.drawStill()
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect()
    if (rect.width < 1 || rect.height < 1) return
    this.world.resize(rect.width, rect.height)
    this.renderer.resize(
      rect.width,
      rect.height,
      Math.min(window.devicePixelRatio || 1, 2),
      this.world.cellW,
      this.world.cellH
    )
    this.measureContent()
    this.report()
    if (this.reducedMotion.matches) this.drawStill()
  }

  private report() {
    const { cols, rows, activeWindowCount } = this.world
    if (
      cols === this.reported.cols &&
      rows === this.reported.rows &&
      activeWindowCount === this.reported.activeWindows
    )
      return
    this.reported = { cols, rows, activeWindows: activeWindowCount }
    this.onStats?.(this.reported)
  }

  private schedule = () => {
    cancelAnimationFrame(this.raf)
    if (this.disposed || !this.visible) return
    if (this.reducedMotion.matches) {
      this.drawStill()
      return
    }
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.frame)
  }

  private measureContent() {
    const origin = this.canvas.getBoundingClientRect()
    const measured = Array.from(
      document.querySelectorAll(AVOID_TARGETS),
      (el) => el.getBoundingClientRect()
    )
      .filter((b) => b.width > 0 && b.height > 0)
      .map((b) => ({
        left: b.left - origin.left,
        top: b.top - origin.top,
        right: b.right - origin.left,
        bottom: b.bottom - origin.top,
      }))
    const boxes = mergeNearby(measured)
    this.renderer.setDimBoxes(
      boxes,
      this.world.cols,
      this.world.rows,
      this.world.cellW,
      this.world.cellH
    )
    this.world.avoid = boxes
  }

  private frame = (now: number) => {
    const dt = Math.min(0.1, (now - this.last) / 1000)
    this.last = now
    this.acc += dt
    let steps = 0
    while (this.acc >= STEP && steps < MAX_STEPS) {
      this.world.step(STEP)
      this.acc -= STEP
      steps++
    }
    if (steps === MAX_STEPS) this.acc = 0
    if (++this.frames % MEASURE_EVERY_FRAMES === 0) this.measureContent()
    this.renderer.render(this.world)
    this.report()
    this.raf = requestAnimationFrame(this.frame)
  }

  private drawStill() {
    this.measureContent()
    this.renderer.render(this.world)
    this.report()
  }

  private toLocal(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    return {
      x,
      y,
      inside: x >= 0 && y >= 0 && x <= rect.width && y <= rect.height,
    }
  }

  private onPointerMove = (e: PointerEvent) => {
    if (
      e
        .composedPath()
        .some((n) => n instanceof Element && n.matches(INTERACTIVE))
    )
      return
    const { x, y, inside } = this.toLocal(e)
    const p = this.world.pointer
    const elapsed = Math.max(1, e.timeStamp - this.lastPointerTime) / 1000
    const speed = Math.hypot(x - p.x, y - p.y) / elapsed
    p.speed += (Math.min(speed, 5000) - p.speed) * 0.5
    this.lastPointerTime = e.timeStamp
    p.x = x
    p.y = y
    p.active = inside && e.pointerType !== "touch"
  }

  private onPointerLeave = () => {
    this.world.pointer.active = false
    this.world.pointer.speed = 0
  }
}

// ============================================================================
// 4. REACT COMPONENT: AsciiSkyline
// ============================================================================
export interface AsciiSkylineProps {
  className?: string
  onStats?: (stats: SkylineStats) => void
}

export function AsciiSkyline({ className, onStats }: AsciiSkylineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<SkylineEngine | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(true)

  const onStatsRef = useRef(onStats)
  onStatsRef.current = onStats

  // Tự động theo dõi class "dark" trên thẻ <html> giống koi-pond.tsx
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    checkDark()

    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  // useLayoutEffect để engine render frame đầu tiên trước browser paint —
  // user thấy skyline ngay lập tức thay vì flash trắng/đen rồi mới fade in
  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const engine = new SkylineEngine(canvas, (stats) =>
      onStatsRef.current?.(stats)
    )
    engineRef.current = engine
    setMounted(true)
    return () => {
      engine.destroy()
      engineRef.current = null
    }
  }, [])

  useEffect(() => {
    engineRef.current?.setTheme(!isDark)
  }, [isDark])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none transition-opacity duration-1000 ease-out",
        mounted ? "opacity-100" : "opacity-0",
        className
      )}
    />
  )
}

export default AsciiSkyline
