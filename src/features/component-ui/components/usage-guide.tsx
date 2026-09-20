import { CodeBlock, CodeBlockCopyButton } from "@/registry/ui/code-block"
import { cn } from "@/shared/lib"

interface UsageGuideProps {
  importCode: string
  exampleCode: string
  className?: string
}

export function UsageGuide({
  importCode,
  exampleCode,
  className,
}: UsageGuideProps) {
  return (
    <div className={cn("my-6 flex w-full flex-col gap-4", className)}>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        Usage
      </h2>

      {/* 1. Import Code Block */}
      <CodeBlock code={importCode} language="tsx">
        <CodeBlockCopyButton position="pinned" />
      </CodeBlock>

      {/* 2. Invocation Code Block */}
      <CodeBlock code={exampleCode} language="tsx">
        <CodeBlockCopyButton position="pinned" />
      </CodeBlock>
    </div>
  )
}
