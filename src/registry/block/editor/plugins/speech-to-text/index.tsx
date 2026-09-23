import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from "lexical"
import { Mic, MicOff } from "lucide-react"
import * as React from "react"

export const SPEECH_TO_TEXT_COMMAND = createCommand<boolean | void>(
  "SPEECH_TO_TEXT_COMMAND"
)

interface SpeechRecognitionInstance {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: (event: any) => void
  onerror: (event: any) => void
  onend: () => void
}

export function SpeechToTextPlugin(): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  const [isRecording, setIsRecording] = React.useState(false)
  const [isSupported, setIsSupported] = React.useState(false)
  const recognitionRef = React.useRef<SpeechRecognitionInstance | null>(null)

  React.useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)
      const recognition = new SpeechRecognition() as SpeechRecognitionInstance
      recognition.continuous = true
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onresult = (event: any) => {
        const results = event.results
        const latest = results[results.length - 1]
        if (latest && latest[0]) {
          const transcript = latest[0].transcript
          editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              selection.insertText(transcript)
            }
          })
        }
      }

      recognition.onerror = () => {
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      recognitionRef.current?.stop()
    }
  }, [editor])

  React.useEffect(() => {
    return editor.registerCommand(
      SPEECH_TO_TEXT_COMMAND,
      (force) => {
        if (!recognitionRef.current) return false
        const shouldRecord = typeof force === "boolean" ? force : !isRecording

        if (shouldRecord) {
          try {
            recognitionRef.current.start()
            setIsRecording(true)
          } catch {}
        } else {
          try {
            recognitionRef.current.stop()
            setIsRecording(false)
          } catch {}
        }
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor, isRecording])

  if (!isSupported || !isRecording) return null

  return (
    <div className="fixed right-6 bottom-6 z-50 flex animate-pulse items-center gap-2 rounded-full border border-red-500/50 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-500 shadow-lg backdrop-blur-md">
      <Mic className="size-4 animate-bounce text-red-500" />
      <span>Listening... Speak to dictate</span>
      <button
        type="button"
        onClick={() => editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, false)}
        className="ml-1 cursor-pointer rounded-full p-0.5 hover:bg-red-500/20"
      >
        <MicOff className="size-3.5" />
      </button>
    </div>
  )
}
