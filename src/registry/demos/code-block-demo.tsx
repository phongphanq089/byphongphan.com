import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLanguage,
  CodeBlockTitle,
} from "@/registry/ui/code-block"

const SAMPLE_CODE = `import { useMemo, useState } from "react"

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)

  const stats = useMemo(() => ({
    isEven: count % 2 === 0,
    isPositive: count > 0,
  }), [count])

  const increment = () => setCount((c) => c + 1)
  const decrement = () => setCount((c) => c - 1)
  const reset = () => setCount(initialValue)

  return { count, stats, increment, decrement, reset }
}`

export function CodeBlockDemo() {
  return (
    <div className="w-full max-w-xl">
      <CodeBlock
        code={SAMPLE_CODE}
        language="typescript"
        showLineNumbers
        highlightedLines="6-9"
      >
        <CodeBlockHeader>
          <CodeBlockTitle>use-counter.ts</CodeBlockTitle>
          <CodeBlockLanguage />
          <CodeBlockCopyButton className="ml-auto" />
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}
