import type {
  Body as MatterBodyType,
  Engine as MatterEngineType,
  IChamferableBodyDefinition,
  MouseConstraint as MatterMouseConstraintType,
  Render as MatterRenderType,
  Runner as MatterRunnerType,
  Vector as MatterVectorType,
} from "matter-js"
import MatterPkg from "matter-js"
import decompPkg from "poly-decomp"
import {
  createContext,
  forwardRef,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import SVGPathCommanderPkg from "svg-path-commander"

import { cn } from "@/shared/lib/utils"

// Robust resolution for CommonJS / ESM interop across Vite and SSR
const Matter =
  (MatterPkg as unknown as { default?: typeof MatterPkg }).default || MatterPkg
const {
  Bodies,
  Body,
  Common,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Query,
  Render,
  Runner,
  Sleeping,
  World,
} = Matter

const decomp =
  (decompPkg as unknown as { default?: typeof decompPkg }).default || decompPkg
const SVGPathCommander =
  (SVGPathCommanderPkg as unknown as { default?: typeof SVGPathCommanderPkg })
    .default || SVGPathCommanderPkg

// Set poly-decomp for concave polygon decomposition in Matter.js
if (typeof window !== "undefined" && Common) {
  ;(window as unknown as { decomp: unknown }).decomp = decomp
  Common.setDecomp(decomp)
}

export function calculatePosition(
  value: number | string | undefined,
  containerSize: number,
  elementSize: number
): number {
  if (typeof value === "string" && value.endsWith("%")) {
    const percentage = parseFloat(value) / 100
    return containerSize * percentage
  }
  if (typeof value === "number") {
    return value
  }
  return (containerSize - elementSize) / 2
}

export function parsePathToVertices(path: string, sampleLength = 15) {
  const commander = new SVGPathCommander(path)
  const points: { x: number; y: number }[] = []
  let lastPoint: { x: number; y: number } | null = null
  const totalLength = commander.getTotalLength()
  let length = 0

  while (length < totalLength) {
    const point = commander.getPointAtLength(length)
    if (!lastPoint || point.x !== lastPoint.x || point.y !== lastPoint.y) {
      points.push({ x: point.x, y: point.y })
      lastPoint = point
    }
    length += sampleLength
  }

  const finalPoint = commander.getPointAtLength(totalLength)
  if (
    lastPoint &&
    (finalPoint.x !== lastPoint.x || finalPoint.y !== lastPoint.y)
  ) {
    points.push({ x: finalPoint.x, y: finalPoint.y })
  }

  return points
}

function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms = 300
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | undefined
  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
  debounced.cancel = () => {
    if (timer) clearTimeout(timer)
  }
  return debounced
}

export interface MatterBodyProps {
  children: ReactNode
  matterBodyOptions?: IChamferableBodyDefinition
  isDraggable?: boolean
  bodyType?: "rectangle" | "circle" | "svg"
  sampleLength?: number
  x?: number | string
  y?: number | string
  angle?: number
  className?: string
}

interface PhysicsBody {
  element: HTMLElement
  body: MatterBodyType
  props: MatterBodyProps
  halfWidth: number
  halfHeight: number
}

export interface GravityRef {
  start: () => void
  stop: () => void
  reset: () => void
  scatter: () => void
}

export interface GravityProps {
  children: ReactNode
  debug?: boolean
  gravity?: { x: number; y: number }
  resetOnResize?: boolean
  grabCursor?: boolean
  addTopWall?: boolean
  autoStart?: boolean
  className?: string
}

const GravityContext = createContext<{
  registerElement: (
    id: string,
    element: HTMLElement,
    props: MatterBodyProps
  ) => void
  unregisterElement: (id: string) => void
} | null>(null)

export function MatterBody({
  children,
  className,
  matterBodyOptions = {
    friction: 0.2,
    restitution: 0.2,
    density: 0.001,
    isStatic: false,
  },
  bodyType = "rectangle",
  isDraggable = true,
  sampleLength = 15,
  x = 0,
  y = 0,
  angle = 0,
  ...props
}: MatterBodyProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const id = useId()
  const context = useContext(GravityContext)

  useEffect(() => {
    if (!elementRef.current || !context) return
    const activeId = id
    context.registerElement(activeId, elementRef.current, {
      children,
      matterBodyOptions,
      bodyType,
      sampleLength,
      isDraggable,
      x,
      y,
      angle,
      ...props,
    })

    return () => context.unregisterElement(activeId)
  }, [
    props,
    children,
    matterBodyOptions,
    isDraggable,
    bodyType,
    sampleLength,
    x,
    y,
    angle,
    context,
    id,
  ])

  return (
    <div
      ref={elementRef}
      className={cn(
        "absolute top-0 left-0 touch-none will-change-transform",
        className,
        isDraggable && "pointer-events-none"
      )}
    >
      {children}
    </div>
  )
}

export const Gravity = forwardRef<GravityRef, GravityProps>(function Gravity(
  {
    children,
    debug = false,
    gravity = { x: 0, y: 1 },
    grabCursor = true,
    resetOnResize = true,
    addTopWall = false,
    autoStart = true,
    className,
    ...props
  },
  ref
) {
  const canvasContainer = useRef<HTMLDivElement>(null)
  const engine = useRef<MatterEngineType | null>(null)
  const render = useRef<MatterRenderType | undefined>(undefined)
  const runner = useRef<MatterRunnerType | undefined>(undefined)
  const bodiesMap = useRef(new Map<string, PhysicsBody>())
  const frameId = useRef<number | undefined>(undefined)
  const mouseConstraint = useRef<MatterMouseConstraintType | undefined>(
    undefined
  )
  const mouseDown = useRef(false)
  const [, setCanvasSize] = useState({ width: 0, height: 0 })
  const isRunning = useRef(false)

  // Store active cleanup listeners to avoid memory leaks
  const cleanupsRef = useRef<(() => void)[]>([])

  // One-time manual DOM sync (without layout queries)
  const syncElements = useCallback(() => {
    bodiesMap.current.forEach(({ element, body, halfWidth, halfHeight }) => {
      const { x: posX, y: posY } = body.position
      const rotation = (body.angle * 180) / Math.PI

      element.style.transform = `translate3d(${
        posX - halfWidth
      }px, ${posY - halfHeight}px, 0px) rotate(${rotation}deg)`
    })
  }, [])

  // Start continuous RAF loop with sleeping optimization and zero layout thrashing
  const startLoop = useCallback(() => {
    if (frameId.current) {
      cancelAnimationFrame(frameId.current)
    }

    const loop = () => {
      bodiesMap.current.forEach(({ element, body, halfWidth, halfHeight }) => {
        // Skip sleeping bodies to save 100% CPU when blocks settle
        if (body.isSleeping) return

        const { x: posX, y: posY } = body.position
        const rotation = (body.angle * 180) / Math.PI

        // Hardware-accelerated translate3d with zero offsetWidth / offsetHeight queries
        element.style.transform = `translate3d(${
          posX - halfWidth
        }px, ${posY - halfHeight}px, 0px) rotate(${rotation}deg)`
      })
      frameId.current = requestAnimationFrame(loop)
    }
    frameId.current = requestAnimationFrame(loop)
  }, [])

  // Register Matter.js body in the physics world
  const registerElement = useCallback(
    (id: string, element: HTMLElement, bodyProps: MatterBodyProps) => {
      if (!canvasContainer.current) return
      if (!engine.current) {
        engine.current = Engine.create({
          enableSleeping: true, // Crucial: puts at-rest bodies to sleep to eliminate stutter
        })
      }
      const width = element.offsetWidth || 100
      const height = element.offsetHeight || 100
      const halfWidth = width / 2
      const halfHeight = height / 2
      const canvasRect = canvasContainer.current.getBoundingClientRect()

      const angleRad = ((bodyProps.angle || 0) * Math.PI) / 180

      const posX = calculatePosition(bodyProps.x, canvasRect.width, width)
      const posY = calculatePosition(bodyProps.y, canvasRect.height, height)

      const { chamfer, ...restOptions } = bodyProps.matterBodyOptions || {}
      const safeOptions: IChamferableBodyDefinition = {
        ...restOptions,
        ...(chamfer ? { chamfer } : {}),
      }

      let body: MatterBodyType | undefined
      if (bodyProps.bodyType === "circle") {
        const radius = Math.max(width, height) / 2
        body = Bodies.circle(posX, posY, radius, {
          ...safeOptions,
          angle: angleRad,
          render: {
            fillStyle: debug ? "#888888" : "#00000000",
            strokeStyle: debug ? "#333333" : "#00000000",
            lineWidth: debug ? 3 : 0,
          },
        })
      } else if (bodyProps.bodyType === "svg") {
        const paths = element.querySelectorAll("path")
        const vertexSets: MatterVectorType[][] = []

        paths.forEach((path) => {
          const d = path.getAttribute("d")
          if (d) {
            const p = parsePathToVertices(d, bodyProps.sampleLength)
            vertexSets.push(p)
          }
        })

        if (vertexSets.length > 0) {
          body = Bodies.fromVertices(posX, posY, vertexSets, {
            ...safeOptions,
            angle: angleRad,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          })
        }
      }

      if (!body) {
        body = Bodies.rectangle(posX, posY, width, height, {
          ...safeOptions,
          angle: angleRad,
          render: {
            fillStyle: debug ? "#888888" : "#00000000",
            strokeStyle: debug ? "#333333" : "#00000000",
            lineWidth: debug ? 3 : 0,
          },
        })
      }

      if (body) {
        World.add(engine.current.world, [body])
        bodiesMap.current.set(id, {
          element,
          body,
          props: bodyProps,
          halfWidth,
          halfHeight,
        })
      }
    },
    [debug]
  )

  // Unregister Matter.js body from the physics world
  const unregisterElement = useCallback((id: string) => {
    if (!engine.current) return
    const bodyObj = bodiesMap.current.get(id)
    if (bodyObj) {
      World.remove(engine.current.world, bodyObj.body)
      bodiesMap.current.delete(id)
    }
  }, [])

  const startEngine = useCallback(() => {
    if (!engine.current) return
    if (runner.current) {
      runner.current.enabled = true
      Runner.run(runner.current, engine.current)
    }
    if (debug && render.current) {
      Render.run(render.current)
    }
    startLoop()
    isRunning.current = true
  }, [debug, startLoop])

  const stopEngine = useCallback(() => {
    if (!isRunning.current) return

    if (runner.current) {
      Runner.stop(runner.current)
    }
    if (render.current) {
      Render.stop(render.current)
    }
    if (frameId.current) {
      cancelAnimationFrame(frameId.current)
      frameId.current = undefined
    }
    isRunning.current = false
  }, [])

  // Clear the Matter.js world and all event listeners
  const clearRenderer = useCallback(() => {
    if (frameId.current) {
      cancelAnimationFrame(frameId.current)
      frameId.current = undefined
    }

    // Clean up DOM listeners
    cleanupsRef.current.forEach((fn) => fn())
    cleanupsRef.current = []

    if (mouseConstraint.current && engine.current) {
      World.remove(engine.current.world, mouseConstraint.current)
      mouseConstraint.current = undefined
    }

    if (render.current) {
      Mouse.clearSourceEvents(render.current.mouse)
      Render.stop(render.current)
      render.current.canvas.remove()
      render.current = undefined
    }

    if (runner.current) {
      Runner.stop(runner.current)
      runner.current = undefined
    }

    if (engine.current) {
      Events.off(engine.current, "beforeUpdate", undefined)
      World.clear(engine.current.world, false)
      Engine.clear(engine.current)
    }

    bodiesMap.current.clear()
  }, [])

  const initializeRenderer = useCallback(() => {
    if (!canvasContainer.current) return
    if (!engine.current) {
      engine.current = Engine.create({
        enableSleeping: true,
      })
    }

    const height = canvasContainer.current.offsetHeight
    const width = canvasContainer.current.offsetWidth

    engine.current.gravity.x = gravity.x
    engine.current.gravity.y = gravity.y

    render.current = Render.create({
      element: canvasContainer.current,
      engine: engine.current,
      options: {
        width,
        height,
        wireframes: false,
        background: "#00000000",
      },
    })

    // Style the generated canvas overlay so it does not interfere with layout
    if (render.current.canvas) {
      render.current.canvas.style.position = "absolute"
      render.current.canvas.style.top = "0"
      render.current.canvas.style.left = "0"
      render.current.canvas.style.width = "100%"
      render.current.canvas.style.height = "100%"
      render.current.canvas.style.pointerEvents = "auto"
      render.current.canvas.style.touchAction = "none"
      render.current.canvas.style.zIndex = "1"
    }

    const mouse = Mouse.create(render.current.canvas)
    mouseConstraint.current = MouseConstraint.create(engine.current, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: debug,
        },
      },
    })

    // Add boundaries (floor, left, right, top)
    const walls = [
      // Floor (extended width for safety)
      Bodies.rectangle(width / 2, height + 25, width * 2, 50, {
        isStatic: true,
        friction: 0.8,
        render: { visible: debug },
      }),
      // Right wall
      Bodies.rectangle(width + 25, height / 2, 50, height * 4, {
        isStatic: true,
        friction: 0.8,
        render: { visible: debug },
      }),
      // Left wall
      Bodies.rectangle(-25, height / 2, 50, height * 4, {
        isStatic: true,
        friction: 0.8,
        render: { visible: debug },
      }),
    ]

    // Only add top wall if requested; otherwise allow objects to spawn from above
    if (addTopWall) {
      walls.push(
        Bodies.rectangle(width / 2, -25, width * 2, 50, {
          isStatic: true,
          friction: 0.8,
          render: { visible: debug },
        })
      )
    }

    const touchingMouse = () =>
      mouseConstraint.current && engine.current
        ? Query.point(
            engine.current.world.bodies,
            mouseConstraint.current.mouse.position || { x: 0, y: 0 }
          ).length > 0
        : false

    const container = canvasContainer.current
    if (grabCursor && container) {
      let lastCheck = 0
      const handleBeforeUpdate = () => {
        const now = performance.now()
        if (now - lastCheck < 50) return // Throttle cursor query to max 20fps
        lastCheck = now

        if (!mouseDown.current && !touchingMouse()) {
          container.style.cursor = "default"
        } else if (touchingMouse()) {
          container.style.cursor = mouseDown.current ? "grabbing" : "grab"
        }
      }

      Events.on(engine.current, "beforeUpdate", handleBeforeUpdate)

      const handleDown = () => {
        mouseDown.current = true
        container.style.cursor = touchingMouse() ? "grabbing" : "default"
      }
      const handleUp = () => {
        mouseDown.current = false
        container.style.cursor = touchingMouse() ? "grab" : "default"
      }

      container.addEventListener("mousedown", handleDown)
      container.addEventListener("mouseup", handleUp)
      container.addEventListener("touchstart", handleDown, { passive: true })
      container.addEventListener("touchend", handleUp, { passive: true })

      cleanupsRef.current.push(() => {
        if (engine.current) {
          Events.off(engine.current, "beforeUpdate", handleBeforeUpdate)
        }
        container.removeEventListener("mousedown", handleDown)
        container.removeEventListener("mouseup", handleUp)
        container.removeEventListener("touchstart", handleDown)
        container.removeEventListener("touchend", handleUp)
      })
    }

    World.add(engine.current.world, [mouseConstraint.current, ...walls])

    if (render.current) {
      render.current.mouse = mouse
    }
    runner.current = Runner.create()

    if (debug) {
      Render.run(render.current)
    }
    syncElements()
    runner.current.enabled = false

    if (autoStart) {
      runner.current.enabled = true
      startEngine()
    }
  }, [
    syncElements,
    debug,
    autoStart,
    gravity.x,
    gravity.y,
    addTopWall,
    grabCursor,
    startEngine,
  ])

  const handleResize = useCallback(() => {
    if (!canvasContainer.current || !resetOnResize) return

    const newWidth = canvasContainer.current.offsetWidth
    const newHeight = canvasContainer.current.offsetHeight

    setCanvasSize({ width: newWidth, height: newHeight })

    clearRenderer()
    initializeRenderer()
  }, [clearRenderer, initializeRenderer, resetOnResize])

  const reset = useCallback(() => {
    stopEngine()
    if (!canvasContainer.current) return
    const rect = canvasContainer.current.getBoundingClientRect()

    bodiesMap.current.forEach((item) => {
      const { element, body, props: bProps } = item
      // Re-measure in case responsive breakpoints changed dimensions
      item.halfWidth = (element.offsetWidth || 100) / 2
      item.halfHeight = (element.offsetHeight || 100) / 2

      Sleeping.set(body, false)
      Body.setAngle(body, ((bProps.angle || 0) * Math.PI) / 180)
      Body.setVelocity(body, { x: 0, y: 0 })
      Body.setAngularVelocity(body, 0)

      const posX = calculatePosition(bProps.x, rect.width, element.offsetWidth)
      const posY = calculatePosition(
        bProps.y,
        rect.height,
        element.offsetHeight
      )
      Body.setPosition(body, { x: posX, y: posY })
    })
    syncElements()
    startEngine()
  }, [stopEngine, startEngine, syncElements])

  const scatter = useCallback(() => {
    bodiesMap.current.forEach(({ body }) => {
      // Wake up body before applying velocity
      Sleeping.set(body, false)
      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 30,
        y: -15 - Math.random() * 20,
      })
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.3)
    })
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      start: startEngine,
      stop: stopEngine,
      reset,
      scatter,
    }),
    [startEngine, stopEngine, reset, scatter]
  )

  useEffect(() => {
    if (!resetOnResize) return

    const debouncedResize = debounce(handleResize, 400)
    window.addEventListener("resize", debouncedResize)

    return () => {
      window.removeEventListener("resize", debouncedResize)
      debouncedResize.cancel()
    }
  }, [handleResize, resetOnResize])

  useEffect(() => {
    initializeRenderer()
    return clearRenderer
  }, [initializeRenderer, clearRenderer])

  return (
    <GravityContext.Provider value={{ registerElement, unregisterElement }}>
      <div
        ref={canvasContainer}
        className={cn(
          className,
          "absolute top-0 left-0 h-full w-full touch-none overflow-hidden"
        )}
        {...props}
      >
        {children}
      </div>
    </GravityContext.Provider>
  )
})
