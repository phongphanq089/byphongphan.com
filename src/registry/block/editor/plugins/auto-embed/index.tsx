import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  PASTE_COMMAND,
} from "lexical"
import * as React from "react"

import { $createFigmaNode, INSERT_FIGMA_COMMAND } from "../../nodes/figma-node"
import {
  $createTweetNode,
  extractTweetId,
  INSERT_TWEET_COMMAND,
} from "../../nodes/tweet-node"
import {
  $createYouTubeNode,
  extractYouTubeId,
  INSERT_YOUTUBE_COMMAND,
} from "../../nodes/youtube-node"

export { INSERT_FIGMA_COMMAND, INSERT_TWEET_COMMAND, INSERT_YOUTUBE_COMMAND }

export function AutoEmbedPlugin() {
  const [editor] = useLexicalComposerContext()

  React.useEffect(() => {
    // 1. YouTube command
    const unregisterYouTube = editor.registerCommand<string>(
      INSERT_YOUTUBE_COMMAND,
      (payload) => {
        const videoId = extractYouTubeId(payload)
        if (videoId) {
          editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              const node = $createYouTubeNode(videoId)
              selection.insertNodes([node])
            }
          })
          return true
        }
        return false
      },
      COMMAND_PRIORITY_LOW
    )

    // 2. Figma command
    const unregisterFigma = editor.registerCommand<string>(
      INSERT_FIGMA_COMMAND,
      (payload) => {
        if (
          payload &&
          (payload.includes("figma.com/file/") ||
            payload.includes("figma.com/design/"))
        ) {
          editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              const node = $createFigmaNode(payload)
              selection.insertNodes([node])
            }
          })
          return true
        }
        return false
      },
      COMMAND_PRIORITY_LOW
    )

    // 3. Tweet command
    const unregisterTweet = editor.registerCommand<string>(
      INSERT_TWEET_COMMAND,
      (payload) => {
        const tweetId = extractTweetId(payload)
        if (tweetId) {
          editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              const node = $createTweetNode(tweetId)
              selection.insertNodes([node])
            }
          })
          return true
        }
        return false
      },
      COMMAND_PRIORITY_LOW
    )

    // 4. Smart paste detection
    const unregisterPaste = editor.registerCommand(
      PASTE_COMMAND,
      (event) => {
        const clipboardData =
          "clipboardData" in event ? event.clipboardData : null
        const text = clipboardData?.getData("text/plain")?.trim()
        if (!text) return false

        // Check YouTube
        const youtubeId = extractYouTubeId(text)
        if (
          youtubeId &&
          (text.includes("youtube.com") || text.includes("youtu.be"))
        ) {
          event.preventDefault()
          editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, text)
          return true
        }

        // Check Tweet
        const tweetId = extractTweetId(text)
        if (
          tweetId &&
          (text.includes("twitter.com") || text.includes("x.com"))
        ) {
          event.preventDefault()
          editor.dispatchCommand(INSERT_TWEET_COMMAND, text)
          return true
        }

        // Check Figma
        if (
          text.includes("figma.com/file/") ||
          text.includes("figma.com/design/")
        ) {
          event.preventDefault()
          editor.dispatchCommand(INSERT_FIGMA_COMMAND, text)
          return true
        }

        return false
      },
      COMMAND_PRIORITY_LOW
    )

    return () => {
      unregisterYouTube()
      unregisterFigma()
      unregisterTweet()
      unregisterPaste()
    }
  }, [editor])

  return null
}
