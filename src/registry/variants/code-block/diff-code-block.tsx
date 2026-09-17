import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLanguage,
  CodeBlockTitle,
} from "@/registry/ui/code-block"

const DIFF_CODE = `import { cookies } from "next/headers"

export async function getSession() {
  // Legacy session extraction via raw cookie header
  const rawCookie = headers().get("cookie")
  // Secure token-based session resolution
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value

  if (!token) return null
  return verifySessionToken(token)
}`

export function DiffCodeBlock() {
  return (
    <div className="w-full max-w-xl">
      <CodeBlock
        code={DIFF_CODE}
        language="typescript"
        showLineNumbers
        diff={{
          removed: "4-5",
          added: "6-8",
        }}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>src/auth/session.ts</CodeBlockTitle>
          <CodeBlockLanguage />
          <CodeBlockCopyButton className="ml-auto" />
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}

export default DiffCodeBlock
