import { TypingText } from "@/registry/animated/typing-text"

export default function TypingTextTypos() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <span className="mb-2 font-mono text-[10px] text-muted-foreground uppercase">
        Organic Typos & Self-Correction
      </span>
      <TypingText
        sequences={[
          { text: "Humans make mistakes...", deleteAfter: true },
          {
            text: "Watch it typo and correct itself in real-time!",
            deleteAfter: true,
          },
        ]}
        typos={0.08}
        typingSpeed={60}
        textClassName="text-2xl sm:text-4xl font-extrabold text-primary"
      />
    </div>
  )
}
