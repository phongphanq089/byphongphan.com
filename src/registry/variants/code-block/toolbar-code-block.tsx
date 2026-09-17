import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockDownloadButton,
  CodeBlockHeader,
  CodeBlockLanguage,
  CodeBlockTitle,
  CodeBlockWrapToggle,
} from "@/registry/ui/code-block"

const TOOLBAR_CODE = `import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof Response && error.status === 404) return false
        return failureCount < 3
      },
    },
    mutations: {
      onError: (err) => {
        console.error("Mutation failed with error:", err)
      },
    },
  },
})`

export function ToolbarCodeBlock() {
  return (
    <div className="w-full max-w-xl">
      <CodeBlock
        code={TOOLBAR_CODE}
        language="typescript"
        showLineNumbers
        highlightedLines="6-8"
      >
        <CodeBlockHeader>
          <CodeBlockTitle>src/lib/query-client.ts</CodeBlockTitle>
          <CodeBlockLanguage />
          <div className="ml-auto flex items-center gap-1">
            <CodeBlockWrapToggle />
            <CodeBlockDownloadButton filename="query-client.ts" />
            <CodeBlockCopyButton />
          </div>
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}

export default ToolbarCodeBlock
