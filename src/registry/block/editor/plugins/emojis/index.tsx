import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import type { LexicalCommand } from "lexical"
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  TextNode,
} from "lexical"
import { Search, Smile, Sparkles, ThumbsUp, X, Zap } from "lucide-react"
import * as React from "react"
import { createPortal } from "react-dom"

import { cn } from "@/shared/lib/utils"

export const INSERT_EMOJI_COMMAND: LexicalCommand<string> = createCommand(
  "INSERT_EMOJI_COMMAND"
)

export const OPEN_EMOJI_PICKER_COMMAND: LexicalCommand<void> = createCommand(
  "OPEN_EMOJI_PICKER_COMMAND"
)

/* Shortcode mappings for real-time automatic transforms */
const SHORTCODES_MAP: Array<{ code: string; char: string }> = [
  { code: ":-)", char: "🙂" },
  { code: ":)", char: "🙂" },
  { code: ":-D", char: "😀" },
  { code: ":D", char: "😀" },
  { code: ";-)", char: "😉" },
  { code: ";)", char: "😉" },
  { code: ":-(", char: "🙁" },
  { code: ":(", char: "🙁" },
  { code: ":-P", char: "😛" },
  { code: ":P", char: "😛" },
  { code: ":p", char: "😛" },
  { code: "<3", char: "❤️" },
  { code: "</3", char: "💔" },
  { code: ":+1:", char: "👍" },
  { code: ":-1:", char: "👎" },
  { code: ":fire:", char: "🔥" },
  { code: ":rocket:", char: "🚀" },
  { code: ":star:", char: "⭐" },
  { code: ":sparkles:", char: "✨" },
  { code: ":check:", char: "✅" },
  { code: ":tada:", char: "🎉" },
  { code: ":eyes:", char: "👀" },
  { code: ":100:", char: "💯" },
  { code: ":wave:", char: "👋" },
  { code: ":coffee:", char: "☕" },
  { code: ":bulb:", char: "💡" },
  { code: ":heart:", char: "❤️" },
  { code: ":zap:", char: "⚡" },
  { code: ":bug:", char: "🐛" },
  { code: ":memo:", char: "📝" },
]

export interface EmojiItem {
  char: string
  name: string
  keywords: string[]
}

export interface EmojiCategory {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  emojis: EmojiItem[]
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: "smileys",
    name: "Smileys & Emotion",
    icon: Smile,
    emojis: [
      { char: "😀", name: "Grinning Face", keywords: ["happy", "smile"] },
      { char: "😃", name: "Smiley", keywords: ["happy", "joy"] },
      { char: "😄", name: "Smile", keywords: ["laugh"] },
      { char: "😁", name: "Beaming", keywords: ["grin"] },
      { char: "😆", name: "Laughing", keywords: ["lol"] },
      { char: "😅", name: "Sweat Smile", keywords: ["relief"] },
      { char: "😂", name: "Joy", keywords: ["tears", "crying"] },
      { char: "🤣", name: "ROFL", keywords: ["rolling"] },
      { char: "🙂", name: "Slight Smile", keywords: ["calm"] },
      { char: "😉", name: "Wink", keywords: ["playful"] },
      { char: "😊", name: "Blush", keywords: ["sweet"] },
      { char: "😇", name: "Angel", keywords: ["innocent"] },
      { char: "🥰", name: "In Love", keywords: ["affection"] },
      { char: "😍", name: "Heart Eyes", keywords: ["love"] },
      { char: "🤩", name: "Star Struck", keywords: ["excited"] },
      { char: "😎", name: "Cool", keywords: ["sunglasses"] },
      { char: "🤔", name: "Thinking", keywords: ["ponder"] },
      { char: "🤫", name: "Shushing", keywords: ["quiet"] },
      { char: "😐", name: "Neutral", keywords: ["blank"] },
      { char: "😴", name: "Sleeping", keywords: ["tired"] },
    ],
  },
  {
    id: "gestures",
    name: "Gestures & People",
    icon: ThumbsUp,
    emojis: [
      { char: "👍", name: "Thumbs Up", keywords: ["approve", "like", "+1"] },
      { char: "👎", name: "Thumbs Down", keywords: ["disapprove", "-1"] },
      { char: "👏", name: "Clapping", keywords: ["applause", "praise"] },
      { char: "🙌", name: "Raising Hands", keywords: ["hooray", "celebrate"] },
      { char: "👋", name: "Waving Hand", keywords: ["hello", "bye"] },
      { char: "🤝", name: "Handshake", keywords: ["agreement", "deal"] },
      { char: "✌️", name: "Victory", keywords: ["peace"] },
      { char: "🤞", name: "Fingers Crossed", keywords: ["luck", "hope"] },
      { char: "🙏", name: "Folded Hands", keywords: ["please", "thanks"] },
      { char: "💪", name: "Flexed Biceps", keywords: ["strong", "power"] },
      { char: "✍️", name: "Writing", keywords: ["note", "author"] },
      { char: "👀", name: "Eyes", keywords: ["look", "watching"] },
    ],
  },
  {
    id: "tech",
    name: "Tech & Work",
    icon: Zap,
    emojis: [
      { char: "🚀", name: "Rocket", keywords: ["launch", "fast", "speed"] },
      { char: "🔥", name: "Fire", keywords: ["hot", "trend", "lit"] },
      { char: "⚡", name: "Lightning", keywords: ["fast", "electric"] },
      { char: "💻", name: "Laptop", keywords: ["computer", "code"] },
      { char: "📱", name: "Phone", keywords: ["mobile"] },
      { char: "💡", name: "Lightbulb", keywords: ["idea", "insight"] },
      { char: "🛠️", name: "Hammer & Wrench", keywords: ["tools", "build"] },
      { char: "⚙️", name: "Gear", keywords: ["settings", "config"] },
      { char: "📦", name: "Package", keywords: ["bundle", "ship"] },
      { char: "🐛", name: "Bug", keywords: ["issue", "fix"] },
      { char: "☕", name: "Coffee", keywords: ["drink", "break"] },
      { char: "🎉", name: "Tada", keywords: ["celebration", "party"] },
    ],
  },
  {
    id: "symbols",
    name: "Symbols & Accents",
    icon: Sparkles,
    emojis: [
      { char: "✨", name: "Sparkles", keywords: ["magic", "clean"] },
      { char: "⭐", name: "Star", keywords: ["favorite", "rating"] },
      { char: "✅", name: "Check Mark", keywords: ["done", "complete"] },
      { char: "❌", name: "Cross Mark", keywords: ["cancel", "error"] },
      { char: "⚠️", name: "Warning", keywords: ["alert", "caution"] },
      { char: "💯", name: "Hundred", keywords: ["perfect", "score"] },
      { char: "❤️", name: "Red Heart", keywords: ["love"] },
      { char: "💜", name: "Purple Heart", keywords: ["brand"] },
      { char: "🔒", name: "Locked", keywords: ["security", "private"] },
      { char: "🏷️", name: "Tag", keywords: ["label"] },
      { char: "📌", name: "Pushpin", keywords: ["pinned"] },
      { char: "📝", name: "Memo", keywords: ["note", "doc"] },
    ],
  },
]

export function EmojisPlugin(): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  const [pickerOpen, setPickerOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeCategory, setActiveCategory] = React.useState("smileys")
  const modalRef = React.useRef<HTMLDivElement>(null)

  // 1. Text transform: automatically convert shortcodes like :-) or :rocket:
  React.useEffect(() => {
    return editor.registerNodeTransform(TextNode, (node) => {
      // Avoid transforming inside code blocks
      const parent = node.getParent()
      if (parent && parent.getType() === "code") {
        return
      }

      const text = node.getTextContent()

      for (const { code, char } of SHORTCODES_MAP) {
        const index = text.indexOf(code)
        if (index !== -1) {
          let targetNode: TextNode
          if (index === 0) {
            ;[targetNode] = node.splitText(index + code.length)
          } else {
            ;[, targetNode] = node.splitText(index, index + code.length)
          }
          const emojiNode = $createTextNode(char)
          targetNode.replace(emojiNode)
          return
        }
      }
    })
  }, [editor])

  // 2. Register Insert Emoji command
  React.useEffect(() => {
    const removeInsert = editor.registerCommand(
      INSERT_EMOJI_COMMAND,
      (emoji) => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            selection.insertText(emoji)
          }
        })
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )

    const removeOpenPicker = editor.registerCommand(
      OPEN_EMOJI_PICKER_COMMAND,
      () => {
        setPickerOpen(true)
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )

    return () => {
      removeInsert()
      removeOpenPicker()
    }
  }, [editor])

  // 3. Close on Escape or click outside
  React.useEffect(() => {
    if (!pickerOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPickerOpen(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setPickerOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [pickerOpen])

  // Select emoji
  const handleSelectEmoji = (char: string) => {
    editor.dispatchCommand(INSERT_EMOJI_COMMAND, char)
    setPickerOpen(false)
    setSearchQuery("")
  }

  // Filtered emojis
  const filteredEmojis = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return null
    }
    const q = searchQuery.toLowerCase().trim()
    const results: EmojiItem[] = []
    for (const cat of EMOJI_CATEGORIES) {
      for (const item of cat.emojis) {
        if (
          item.name.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.toLowerCase().includes(q))
        ) {
          results.push(item)
        }
      }
    }
    return results
  }, [searchQuery])

  if (!pickerOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex animate-in items-center justify-center bg-black/50 p-4 backdrop-blur-xs duration-150 fade-in-0 select-none">
      <div
        ref={modalRef}
        className="border-ns-border/80 bg-ns-surface flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl"
      >
        {/* Header & Search */}
        <div className="border-ns-border-soft border-b p-3">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <span className="bg-ns-primary/10 text-ns-primary-lt flex size-6 items-center justify-center rounded-lg">
                <Smile className="size-3.5" />
              </span>
              <h3 className="text-ns-text text-xs font-bold tracking-tight">
                Insert Emoji
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setPickerOpen(false)}
              className="text-ns-muted hover:bg-ns-surface-alt hover:text-ns-text rounded-md p-1 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="text-ns-muted absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emoji (e.g. rocket, smile, check)..."
              autoFocus
              className="border-ns-border-soft bg-ns-bg/80 text-ns-text placeholder:text-ns-muted/60 focus:border-ns-primary w-full rounded-lg border py-1.5 pr-3 pl-8 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Category Tabs (only when not searching) */}
        {!searchQuery.trim() && (
          <div className="border-ns-border-soft bg-ns-surface-alt/40 flex border-b px-2 py-1">
            {EMOJI_CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  title={cat.name}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-md py-1 text-xs transition-colors",
                    isActive
                      ? "bg-ns-surface text-ns-primary-lt font-medium shadow-xs"
                      : "text-ns-muted hover:text-ns-text"
                  )}
                >
                  <Icon className="size-3.5" />
                </button>
              )
            })}
          </div>
        )}

        {/* Emoji Grid */}
        <div className="max-h-64 scrollbar-thin overflow-y-auto p-3">
          {filteredEmojis !== null ? (
            <div>
              <div className="text-ns-muted mb-2 text-[10px] font-semibold tracking-wider uppercase">
                Search Results ({filteredEmojis.length})
              </div>
              {filteredEmojis.length === 0 ? (
                <div className="text-ns-muted py-8 text-center text-xs">
                  No emojis matching &quot;{searchQuery}&quot;
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {filteredEmojis.map((emoji) => (
                    <button
                      key={emoji.name}
                      type="button"
                      title={emoji.name}
                      onClick={() => handleSelectEmoji(emoji.char)}
                      className="hover:bg-ns-surface-alt flex size-9 items-center justify-center rounded-lg text-lg transition-transform hover:scale-125 active:scale-95"
                    >
                      {emoji.char}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              {EMOJI_CATEGORIES.filter((c) => c.id === activeCategory).map(
                (cat) => (
                  <div key={cat.id}>
                    <div className="text-ns-muted mb-2 text-[10px] font-semibold tracking-wider uppercase">
                      {cat.name}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {cat.emojis.map((emoji) => (
                        <button
                          key={emoji.name}
                          type="button"
                          title={emoji.name}
                          onClick={() => handleSelectEmoji(emoji.char)}
                          className="hover:bg-ns-surface-alt flex size-9 items-center justify-center rounded-lg text-lg transition-transform hover:scale-125 active:scale-95"
                        >
                          {emoji.char}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="border-ns-border-soft bg-ns-surface-alt/30 text-ns-muted border-t px-3 py-1.5 text-[11px]">
          💡 Tip: Type shortcuts like{" "}
          <code className="text-ns-primary-lt">:)</code>,{" "}
          <code className="text-ns-primary-lt">&lt;3</code>, or{" "}
          <code className="text-ns-primary-lt">:fire:</code> directly!
        </div>
      </div>
    </div>,
    document.body
  )
}

export default EmojisPlugin
