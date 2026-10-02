import { useState } from "react"

import { Editor } from "../editor"

const INITIAL_MARKDOWN = `# Modern Editorial Rich Text Editor

Welcome to the **Lexical Rich Text Editor** block built for modern publishing, documentation, and notes.

## Key Capabilities

- **Rich Formatting**: Bold, italic, underline, strikethrough, inline code, and highlights.
- **Hierarchical Headings**: H1, H2, and H3 with quick keyboard formatting.
- **Lists & Checklists**: Bulleted, numbered lists, and interactive task checklists.
- **Slash Commands**: Type \`/\` anywhere to open the command palette and insert tables, dividers, code blocks, or formulas.
- **Markdown Shortcuts**: Type \`# \` for heading 1, \`* \` for bullet list, or \`[] \` for checklists on any new line.

> Tip: Highlight any text snippet to summon the floating bubble toolbar, or press \`Cmd+/\` / \`Ctrl+/\` to inspect shortcuts!

### Interactive Tasks

- [x] Integrate Lexical editor core with TanStack Router
- [x] Support responsive toolbar and floating action dock
- [ ] Add real-time collaborative editing with Yjs
`

export default function EditorBlockPage() {
  const [content, setContent] = useState(INITIAL_MARKDOWN || "")

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col bg-background text-foreground select-text">
      <Editor
        variant="default"
        value={content}
        onChange={(data) => setContent(data.markdown)}
        className="flex-1"
        minHeight="calc(100vh - 140px)"
      />
    </main>
  )
}
