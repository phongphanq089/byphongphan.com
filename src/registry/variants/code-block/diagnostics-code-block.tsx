import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLanguage,
  CodeBlockTitle,
} from "@/registry/ui/code-block"

const DIAGNOSTIC_CODE = `interface UserProfile {
  id: string
  name: string
  email: string
  role?: "admin" | "editor" | "viewer"
}

export function formatGreeting(user: UserProfile): string {
  // TS2345: Argument of type 'undefined' is not assignable to parameter of type 'string'
  const normalizedEmail = user.email.toLowerCase()

  // ESLint: prefer-optional-chain
  if (user && user.role && user.role === "admin") {
    return \`Welcome, Administrator \${user.name} (\${normalizedEmail})\`
  }

  return \`Welcome back, \${user.name}!\`
}`

export function DiagnosticsCodeBlock() {
  return (
    <div className="w-full max-w-xl">
      <CodeBlock
        code={DIAGNOSTIC_CODE}
        language="typescript"
        showLineNumbers
        lineLevels={{
          info: "1-6",
          error: "10",
          warning: "13",
        }}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>src/utils/greeting.ts</CodeBlockTitle>
          <CodeBlockLanguage />
          <CodeBlockCopyButton className="ml-auto" />
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}

export default DiagnosticsCodeBlock
