import { ScrollArea } from "@/registry/ui/scroll-area"

const CHAPTERS = [
  { title: "1. Introduction to Quantum Systems", length: "14 mins" },
  { title: "2. Wave-Particle Duality Principles", length: "22 mins" },
  { title: "3. Superposition & State Vectors", length: "19 mins" },
  { title: "4. Quantum Entanglement Mechanics", length: "28 mins" },
  { title: "5. Quantum Gates & Circuit Design", length: "35 mins" },
  { title: "6. Error Correction Architectures", length: "41 mins" },
  { title: "7. Scalable Quantum Hardware", length: "30 mins" },
  { title: "8. Cryptographic Implementations", length: "25 mins" },
  { title: "9. Summary & Future Trajectories", length: "16 mins" },
]

export function ScrollAreaBordered() {
  return (
    <ScrollArea
      className="h-64 w-full max-w-sm rounded-md border border-border bg-card"
      variant="bordered"
      type="always"
      scrollbarGutter="stable"
    >
      <div className="space-y-2 p-4">
        <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Table of Contents
        </h3>
        <div className="divide-y divide-border/40">
          {CHAPTERS.map((chap) => (
            <div
              key={chap.title}
              className="flex items-center justify-between py-2 text-xs transition-colors hover:text-pp-primary"
            >
              <span className="font-medium">{chap.title}</span>
              <span className="text-muted-foreground">{chap.length}</span>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}

export default ScrollAreaBordered
