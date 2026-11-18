# useCopyToClipboard

> Copies text to clipboard with feedback.

## Installation

  

  ```bash
npx shadcn@latest add https://byphongphan.com/r/use-copy-to-clipboard.json
```

  
    
      - Copy and paste the hook into your project.
      ```tsx
// hooks/use-copy-to-clipboard.ts
import { useCallback, useEffect, useRef, useState } from "react"

export interface UseCopyToClipboardOptions {
  /** Timeout in ms before isCopied resets to false. Defaults to 2000. */
  timeout?: number
  /** Callback on successful copy */
  onSuccess?: (text: string) => void
  /** Callback on copy error */
  onError?: (error: unknown) => void
}

export interface UseCopyToClipboardReturn {
  /** The most recently copied text string */
  copiedText: string | null
  /** Boolean indicating whether text was copied within the timeout duration */
  isCopied: boolean
  /** Copy function accepting text or a string generator */
  copy: (text: string) => Promise<boolean>
  /** Reset copied state back to idle immediately */
  reset: () => void
}

/**
 * React hook to copy arbitrary text to the clipboard with reactive copied feedback.
 */
export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {}
): UseCopyToClipboardReturn {
  const { timeout = 2000, onSuccess, onError } = options

  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    clearTimer()
    setIsCopied(false)
    setCopiedText(null)
  }, [clearTimer])

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      clearTimer()

      if (!navigator?.clipboard) {
        const error = new Error(
          "Clipboard API not supported on this device/environment"
        )
        onError?.(error)
        return false
      }

      try {
        await navigator.clipboard.writeText(text)
        setCopiedText(text)
        setIsCopied(true)
        onSuccess?.(text)

        if (timeout > 0) {
          timeoutRef.current = setTimeout(() => {
            setIsCopied(false)
          }, timeout)
        }

        return true
      } catch (error) {
        onError?.(error)
        setIsCopied(false)
        return false
      }
    },
    [clearTimer, onError, onSuccess, timeout]
  )

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  return { copiedText, isCopied, copy, reset }
}

```
      - Update the import paths to match your project setup.
    
  

## Usage

```tsx
import { useCopyToClipboard } from "@/shared/hooks"

export function CopySnippet() {
  const { isCopied, copy } = useCopyToClipboard({ timeout: 2000 })

  return (
    <button onClick={() => copy("npm install @pp/hooks")}>
      {isCopied ? "Copied to clipboard!" : "Copy Command"}
    </button>
  )
}
```

## Props & Parameters

| Param               | Type                       | Default | Description                                                                 |
| :------------------ | :------------------------- | :------ | :-------------------------------------------------------------------------- |
| `options.timeout`   | `number`                   | `2000`  | Duration in milliseconds before `isCopied` automatically resets to `false`. |
| `options.onSuccess` | `(text: string) => void`   | —       | Callback invoked when text is successfully written to clipboard.            |
| `options.onError`   | `(error: unknown) => void` | —       | Callback invoked when writing to clipboard fails or is denied.              |

## Returns

| Return       | Type                                 | Description                                                                                 |
| :----------- | :----------------------------------- | :------------------------------------------------------------------------------------------ |
| `isCopied`   | `boolean`                            | Reactive boolean state indicating whether text was copied within the active timeout window. |
| `copiedText` | `string \| null`                     | The most recently copied text string.                                                       |
| `copy`       | `(text: string) => Promise<boolean>` | Async function that writes provided text to browser clipboard.                              |
| `reset`      | `() => void`                         | Clears active timer and resets `isCopied` state back to idle immediately.                   |
