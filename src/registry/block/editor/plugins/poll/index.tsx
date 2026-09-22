import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $insertNodeToNearestRoot } from "@lexical/utils"
import { COMMAND_PRIORITY_EDITOR } from "lexical"
import * as React from "react"

import type { PollOption } from "../../nodes/poll-node"
import { $createPollNode, INSERT_POLL_COMMAND } from "../../nodes/poll-node"

export function PollPlugin(): null {
  const [editor] = useLexicalComposerContext()

  React.useEffect(() => {
    return editor.registerCommand(
      INSERT_POLL_COMMAND,
      (payload) => {
        const { question, options } = payload
        const pollOptions: PollOption[] | undefined = options?.map(
          (text, idx) => ({
            text,
            uid: `${Date.now()}-${idx}`,
            votes: [],
          })
        )

        editor.update(() => {
          $insertNodeToNearestRoot($createPollNode(question, pollOptions))
        })
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}
