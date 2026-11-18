# useDebounce

> Debounces a value or function for better performance.

## Installation

  

  ```bash
npx shadcn@latest add https://byphongphan.com/r/use-debounce.json
```

  
    
      - Copy and paste the hook into your project.
      ```tsx
// hooks/use-debounce.ts
import { useEffect, useState } from "react"

/**
 * Debounces a fast-changing value, updating only after the specified delay.
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

```
      - Update the import paths to match your project setup.
    
  

## Usage

```tsx
import { useState } from "react"
import { useDebounce } from "@/shared/hooks"

export function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce(searchTerm, 500)

  // Trigger network search query only when debouncedSearch settles
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search docs..."
    />
  )
}
```

## Props & Parameters

| Param   | Type     | Default | Description                                            |
| :------ | :------- | :------ | :----------------------------------------------------- |
| `value` | `T`      | —       | The rapidly changing input value to debounce.          |
| `delay` | `number` | `500`   | Delay in milliseconds before updating debounced value. |

## Returns

| Return           | Type | Description                                                                     |
| :--------------- | :--- | :------------------------------------------------------------------------------ |
| `debouncedValue` | `T`  | The debounced value updated only after the delay timer expires without changes. |
