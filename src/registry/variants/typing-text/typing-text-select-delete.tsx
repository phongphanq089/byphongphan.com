import { TypingText } from "@/registry/animated/typing-text"

export default function TypingTextSelectDelete() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <span className="mb-2 font-mono text-[10px] text-muted-foreground uppercase">
        Select & Cut Mode (Shift + Home)
      </span>
      <TypingText
        sequences={[
          { text: "Fast Highlight Deletion", deleteAfter: true },
          { text: "No Character-by-Character Lag", deleteAfter: true },
        ]}
        deleteMode="select"
        typingSpeed={45}
        textClassName="text-2xl sm:text-4xl font-extrabold text-foreground"
      />
    </div>
  )
}
