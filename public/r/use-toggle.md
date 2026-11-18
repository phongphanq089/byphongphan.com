# useToggle

> Toggles a boolean state value with memoized handlers.

## Installation

  

  ```bash
npx shadcn@latest add https://byphongphan.com/r/use-toggle.json
```

  
    
      - Copy and paste the hook into your project.
      ```tsx
// hooks/use-toggle.ts
import { useCallback, useState } from "react"

export interface UseToggleActions {
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
  setValue: (value: boolean) => void
}

/**
 * React hook to manage boolean state with convenient memoized action helpers.
 */
export function useToggle(
  initialValue = false
): [boolean, (nextValue?: boolean) => void, UseToggleActions] {
  const [value, setValue] = useState<boolean>(initialValue)

  const toggle = useCallback((nextValue?: boolean) => {
    setValue((prev) => (typeof nextValue === "boolean" ? nextValue : !prev))
  }, [])

  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return [
    value,
    toggle,
    {
      setTrue,
      setFalse,
      toggle: () => toggle(),
      setValue,
    },
  ]
}

```
      - Update the import paths to match your project setup.
    
  

## Usage

```tsx
import { useToggle } from "@/shared/hooks"

export function Modal() {
  const [isOpen, toggle, { setTrue, setFalse }] = useToggle(false)

  return (
    <div>
      <button onClick={() => toggle()}>Toggle</button>
      <button onClick={setTrue}>Open Modal</button>
      <button onClick={setFalse}>Close Modal</button>
      {isOpen && <div>Modal Content</div>}
    </div>
  )
}
```

## Props & Parameters

| Param          | Type      | Default | Description                  |
| :------------- | :-------- | :------ | :--------------------------- |
| `initialValue` | `boolean` | `false` | Initial boolean state value. |

## Returns

| Return                     | Type                                                    | Description                                                                                               |
| :------------------------- | :------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------- |
| `[value, toggle, actions]` | `[boolean, (next?: boolean) => void, UseToggleActions]` | Tuple containing state, toggle callback, and memoized action helpers (`setTrue`, `setFalse`, `setValue`). |
