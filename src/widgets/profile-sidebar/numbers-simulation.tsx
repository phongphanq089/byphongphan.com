import { useEffect, useRef, useState } from "react"

const NumbersSimulation = () => {
  const [lineCount, setLineCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateLineCount = () => {
      if (!containerRef.current) return
      const wrapper =
        containerRef.current.closest(".min-h-screen") || document.body
      const lineHeight = 24 // Matches h-6
      const contentHeight = Math.max(wrapper.scrollHeight, wrapper.clientHeight)
      const count = Math.max(1, Math.ceil(contentHeight / lineHeight))
      setLineCount(count)
    }

    const wrapper =
      containerRef.current?.closest(".min-h-screen") || document.body

    // Observe container and document size changes via ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateLineCount)
    })
    resizeObserver.observe(wrapper)

    updateLineCount()

    window.addEventListener("resize", updateLineCount)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", updateLineCount)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex w-12 flex-col items-center overflow-hidden text-[10px] text-muted-foreground/50 select-none"
    >
      {Array.from({ length: lineCount }).map((_, i) => (
        <div key={i} className="flex h-6 w-full items-center justify-center">
          {String(i + 1).padStart(2, "0")}
        </div>
      ))}
    </div>
  )
}

export default NumbersSimulation
