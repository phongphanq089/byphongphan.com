# useIsFirstRender

> Determines whether the current render is the initial mount, returning true on the first render and false on subsequent re-renders.

## Installation

  

  ```bash
npx shadcn@latest add https://byphongphan.com/r/use-is-first-render.json
```

  
    
      - Copy and paste the hook into your project.
      ```tsx
// hooks/use-is-first-render.ts
import { useEffect, useRef } from "react"

/**
 * Custom hook that returns whether the current render cycle is the initial mount.
 * Complies with React Concurrent and Strict Mode guidelines by mutating the ref
 * inside an effect rather than during the render phase.
 *
 * @returns `true` during the initial render pass, and `false` on all subsequent re-renders.
 */
export function useIsFirstRender(): boolean {
  // Initialize ref as true for the initial render
  const isFirst = useRef(true)

  useEffect(() => {
    // Flip flag after the first commit phase completes
    isFirst.current = false
  }, [])

  return isFirst.current
}

```
      - Update the import paths to match your project setup.
    
  

## Usage

```tsx
import { useState } from "react"
import { useIsFirstRender } from "@/shared/hooks"

export function RenderComponent() {
  const isFirstRender = useIsFirstRender()
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>
        {isFirstRender
          ? "This is the initial render."
          : "This is a subsequent render."}
      </p>

      <p>Count: {count}</p>

      <button onClick={() => setCount((prev) => prev + 1)}>
        Trigger re-render
      </button>
    </div>
  )
}
```
