import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin"
import type { TextNode } from "lexical"
import { $createTextNode } from "lexical"
import { AtSign } from "lucide-react"
import * as React from "react"
import { createPortal } from "react-dom"

import { $createMentionNode } from "../../nodes/mention-node"

export interface MentionUser {
  id: string
  name: string
  handle: string
  role: string
  color: string
}

const DEFAULT_USERS: MentionUser[] = [
  {
    id: "usr-1",
    name: "Phong Phan",
    handle: "phongphan",
    role: "Lead Architect",
    color: "from-violet-500 to-indigo-600",
  },
  {
    id: "usr-2",
    name: "Sarah Connor",
    handle: "sarah",
    role: "Core Engineer",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "usr-3",
    name: "Alex Rivera",
    handle: "alex",
    role: "Product Designer",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "usr-4",
    name: "Elena Rostova",
    handle: "elena",
    role: "Edge Systems",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: "usr-5",
    name: "David Chen",
    handle: "david",
    role: "Security Specialist",
    color: "from-sky-500 to-blue-600",
  },
  {
    id: "usr-6",
    name: "Note Flow Bot",
    handle: "agent",
    role: "Autonomous AI",
    color: "from-purple-600 to-violet-700",
  },
]

export class MentionOption extends MenuOption {
  user: MentionUser

  constructor(user: MentionUser) {
    super(user.name)
    this.user = user
  }
}

export function MentionsPlugin({
  users = DEFAULT_USERS,
  anchorElem = typeof document !== "undefined" ? document.body : null,
}: {
  users?: MentionUser[]
  anchorElem?: HTMLElement | null
}): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  const [queryString, setQueryString] = React.useState<string | null>(null)

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("@", {
    minLength: 0,
  })

  const options = React.useMemo(() => {
    if (!queryString) {
      return users.map((u) => new MentionOption(u))
    }
    const query = queryString.toLowerCase()
    return users
      .filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.handle.toLowerCase().includes(query) ||
          u.role.toLowerCase().includes(query)
      )
      .map((u) => new MentionOption(u))
  }, [queryString, users])

  const onSelectOption = React.useCallback(
    (
      selectedOption: MentionOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(
          selectedOption.user.name,
          selectedOption.user.id
        )
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode)
        }
        // Insert a trailing space so user can smoothly continue typing
        const spaceNode = $createTextNode(" ")
        mentionNode.insertAfter(spaceNode)
        spaceNode.select()
        closeMenu()
      })
    },
    [editor]
  )

  if (!anchorElem) return null

  return (
    <LexicalTypeaheadMenuPlugin<MentionOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) => {
        if (anchorElementRef.current == null || options.length === 0) {
          return null
        }

        const rect = anchorElementRef.current.getBoundingClientRect()

        return createPortal(
          <div
            className="border-ns-border/80 bg-ns-surface/95 fixed z-50 max-h-72 w-64 animate-in overflow-y-auto rounded-xl border p-1.5 shadow-2xl backdrop-blur-xl fade-in-0 outline-none select-none zoom-in-95"
            style={{
              top: rect.bottom + 6,
              left: Math.min(rect.left, window.innerWidth - 270),
            }}
          >
            <div className="text-ns-muted flex items-center justify-between px-2 py-1 text-[10px] font-semibold tracking-wider uppercase">
              <span>Mention Member</span>
              <AtSign className="text-ns-muted size-3" />
            </div>

            <div className="space-y-0.5">
              {options.map((option, index) => {
                const isSelected = selectedIndex === index
                const user = option.user
                const initials = user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)

                return (
                  <button
                    key={user.id}
                    type="button"
                    tabIndex={-1}
                    onClick={() => {
                      setHighlightedIndex(index)
                      selectOptionAndCleanUp(option)
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors outline-none ${
                      isSelected
                        ? "bg-ns-primary/15 text-ns-text font-medium"
                        : "text-ns-muted hover:bg-ns-surface-alt hover:text-ns-text"
                    }`}
                  >
                    <div
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-bold text-white shadow-xs ${user.color}`}
                    >
                      {initials}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-ns-text truncate text-xs leading-tight font-semibold">
                          {user.name}
                        </span>
                        <span className="text-ns-muted truncate font-mono text-[10px]">
                          @{user.handle}
                        </span>
                      </div>
                      <span className="text-ns-muted/80 truncate text-[10px]">
                        {user.role}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>,
          anchorElem
        )
      }}
    />
  )
}

export default MentionsPlugin
