# usePrevious

> Stores previous value of a state or prop across renders.

## Installation

  

  ```bash
npx shadcn@latest add https://byphongphan.com/r/use-previous.json
```

  
    
      - Copy and paste the hook into your project.
      ```tsx
// hooks/use-previous.ts
import { useEffect, useRef } from "react"

/**
 * React hook that stores and returns the previous value of a state or prop across renders.
 */
export function usePrevious<T>(value: T): T | undefined {
  const currentRef = useRef<T>(value)
  const previousRef = useRef<T | undefined>(undefined)

  if (currentRef.current !== value) {
    previousRef.current = currentRef.current
    currentRef.current = value
  }

  useEffect(() => {
    currentRef.current = value
  }, [value])

  return previousRef.current
}

```
      - Update the import paths to match your project setup.
    
  

## Usage

```tsx
import { useState } from "react"
import { usePrevious } from "@/shared/hooks"

export function Counter() {
  const [count, setCount] = useState(0)
  const previousCount = usePrevious(count)

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {previousCount ?? "None"}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  )
}
```

## Props & Parameters

| Param   | Type | Default | Description                                            |
| :------ | :--- | :------ | :----------------------------------------------------- |
| `value` | `T`  | —       | Any state or prop value to track across render cycles. |

## Returns

| Return          | Type             | Description                                                                    |
| :-------------- | :--------------- | :----------------------------------------------------------------------------- |
| `previousValue` | `T \| undefined` | The value from the previous render cycle, or `undefined` on the initial mount. |
