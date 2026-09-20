import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockExpandButton,
  CodeBlockHeader,
  CodeBlockLanguage,
  CodeBlockTitle,
} from "@/registry/ui/code-block"

const LONG_CODE = `import { useQuery } from "@tanstack/react-query"
import { z } from "zod"

const projectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  status: z.enum(["active", "archived", "draft"]),
  stars: z.number().int().nonnegative(),
  updatedAt: z.string().datetime(),
})

type Project = z.infer<typeof projectSchema>

async function fetchProjects(): Promise<Project[]> {
  const response = await fetch("/api/projects")
  if (!response.ok) {
    throw new Error(\`Failed to fetch projects: \${response.statusText}\`)
  }
  const data = await response.json()
  return z.array(projectSchema).parse(data)
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 2,
  })
}`

export function CollapsibleCodeBlock() {
  return (
    <div className="w-full max-w-xl">
      <CodeBlock
        code={LONG_CODE}
        language="typescript"
        showLineNumbers
        maxLines={8}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>src/hooks/use-projects.ts</CodeBlockTitle>
          <CodeBlockLanguage />
          <CodeBlockCopyButton className="ml-auto" />
        </CodeBlockHeader>
        <CodeBlockExpandButton />
      </CodeBlock>
    </div>
  )
}

export default CollapsibleCodeBlock
