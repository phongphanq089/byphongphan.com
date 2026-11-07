import { useRef } from "react"

import {
  ScrollIndicator,
  type ScrollIndicatorSection,
} from "@/registry/animated/scroll-indicator"

const DEMO_SECTIONS: ScrollIndicatorSection[] = [
  {
    id: "demo-overview",
    title: "Overview",
    label: "Overview & Features",
    level: 2,
  },
  {
    id: "demo-installation",
    title: "Installation",
    label: "CLI Installation",
    level: 2,
  },
  {
    id: "demo-usage",
    title: "Usage",
    label: "Basic Usage",
    level: 2,
  },
  {
    id: "demo-props",
    title: "Props",
    label: "Component API",
    level: 2,
  },
  {
    id: "demo-micro-sound",
    title: "Micro Sound",
    label: "Web Audio Feedback",
    level: 2,
  },
]

export function ScrollIndicatorDemo() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative mx-auto flex h-[380px] w-full max-w-lg overflow-hidden rounded-xl border border-border/80 bg-background/95 shadow-md">
      {/* Scrollable Content Container */}
      <div
        ref={scrollContainerRef}
        className="h-full flex-1 overflow-y-auto px-6 py-6 pr-14"
      >
        <div className="flex flex-col gap-12 font-sans">
          {DEMO_SECTIONS.map((section, idx) => (
            <div
              key={section.id}
              id={section.id}
              data-section-index={idx}
              className="flex flex-col gap-2 rounded-lg border border-border/40 bg-card/60 p-5"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary">
                  0{idx + 1}
                </span>
                <h3 className="font-mono text-sm font-semibold tracking-wider text-foreground uppercase">
                  {section.title}
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Section content for {section.label}. Click the ruler or hover
                over the rail to see the interactive section titles slide in
                with micro-audio feedback.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Vertical Scroll Indicator */}
      <div className="absolute top-0 right-3 bottom-0 my-auto flex h-[300px] items-center">
        <ScrollIndicator
          sections={DEMO_SECTIONS}
          scrollRef={scrollContainerRef}
          className="h-full"
        />
      </div>
    </div>
  )
}

export default ScrollIndicatorDemo
