import { Volume2 } from "lucide-react"
import { useRef } from "react"

import {
  ScrollIndicator,
  type ScrollIndicatorSection,
} from "@/registry/animated/scroll-indicator"
import { playClickSound, playHoverSound } from "@/shared/lib/sound"

const DEMO_SECTIONS: ScrollIndicatorSection[] = [
  {
    id: "demo-overview",
    title: "Overview",
    label: "01 Vernier Ruler",
    level: 2,
  },
  {
    id: "demo-dynamics",
    title: "Dynamics",
    label: "02 Spring Kinematics",
    level: 2,
  },
  {
    id: "demo-micro-sound",
    title: "Haptics",
    label: "03 Synthetic Audio",
    level: 2,
  },
  {
    id: "demo-scroll-spy",
    title: "Scroll Spy",
    label: "04 RAF Measurement",
    level: 2,
  },
  {
    id: "demo-props",
    title: "API Spec",
    label: "05 Component Props",
    level: 2,
  },
]

const SPECS = [
  { label: "RESOLUTION", value: "0.25mm" },
  { label: "CADENCE", value: "60 Ticks" },
  { label: "SPRING", value: "280 / 30" },
  { label: "FRAME CLS", value: "0.00" },
]

export function ScrollIndicatorDemo() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative flex size-full min-h-[500px] w-full overflow-hidden bg-background select-none">
      {/* Scrollable Reading Viewport */}
      <div
        ref={scrollContainerRef}
        className="size-full overflow-y-auto scroll-smooth px-6 py-10 pr-16 sm:px-10 sm:py-14 sm:pr-24 md:px-14 md:pr-32"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-14 pb-36">
          {/* Hero Editorial Header */}
          <header className="flex flex-col gap-4 border-b border-border/60 pb-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Precision Viewport Scrubber
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                A mechanical ruler scroll indicator with sub-pixel vernier
                kinematics, zero-layout-shift RAF scroll spy, and synthetic
                micro-haptic audio feedback. Hover the rail or scroll the
                viewport to inspect.
              </p>
            </div>

            {/* Spec Metrics Row */}
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SPECS.map((spec) => (
                <div
                  key={spec.label}
                  className="flex flex-col gap-0.5 rounded-md border border-border/50 bg-card/40 p-2.5"
                >
                  <span className="text-[9px] tracking-wider text-muted-foreground uppercase">
                    {spec.label}
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </header>

          {/* Section 01: Overview & Vernier Ruler */}
          <section
            id="demo-overview"
            data-section-index={0}
            className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-xs transition-colors hover:border-border/80"
          >
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-primary">01</span>
                <span className="text-xs font-semibold tracking-wider text-foreground uppercase">
                  Vernier Caliper Track
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground/60 uppercase">
                Track Cadence
              </span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p>
                The vertical track recreates an industrial mechanical vernier
                height gauge. It renders 60 discrete laser-calibrated tick
                subdivisions along the right edge with a 5-tick major cadence.
              </p>
              <p>
                As scroll position advances, ticks ahead of the cursor remain
                dim while traversed ticks illuminate with higher opacity,
                providing instantaneous visual proprioception of document depth.
              </p>
            </div>

            <div className="mt-2 rounded-lg border border-border/40 bg-muted/30 p-3.5 text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground">
                PROPRIOCEPTIVE FEEDBACK:
              </span>{" "}
              The ruler dynamically updates tick opacity based on container
              scroll percentage with zero CPU overhead.
            </div>
          </section>

          {/* Section 02: Dynamics & Kinematics */}
          <section
            id="demo-dynamics"
            data-section-index={1}
            className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-xs transition-colors hover:border-border/80"
          >
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-primary">02</span>
                <span className="text-xs font-semibold tracking-wider text-foreground uppercase">
                  Damped Harmonic Kinematics
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground/60 uppercase">
                Euler Spring
              </span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p>
                Rather than binding raw scroll offsets directly to the DOM, the
                indicator channels movement through a damped harmonic oscillator
                (stiffness: 280, damping: 30, mass: 0.4).
              </p>
              <p>
                This decouples the visual pointer from erratic mousewheel spikes
                or abrupt trackpad inertia, creating a tactile, fluid gliding
                sensation reminiscent of heavy precision optics.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div className="rounded-md border border-border/40 bg-background/50 p-2 text-center">
                <div className="text-muted-foreground">STIFFNESS</div>
                <div className="mt-0.5 font-semibold text-foreground">280</div>
              </div>
              <div className="rounded-md border border-border/40 bg-background/50 p-2 text-center">
                <div className="text-muted-foreground">DAMPING</div>
                <div className="mt-0.5 font-semibold text-foreground">30</div>
              </div>
              <div className="rounded-md border border-border/40 bg-background/50 p-2 text-center">
                <div className="text-muted-foreground">MASS</div>
                <div className="mt-0.5 font-semibold text-foreground">0.4</div>
              </div>
            </div>
          </section>

          {/* Section 03: Synthetic Web Audio */}
          <section
            id="demo-micro-sound"
            data-section-index={2}
            className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-xs transition-colors hover:border-border/80"
          >
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-primary">03</span>
                <span className="text-xs font-semibold tracking-wider text-foreground uppercase">
                  Micro-Haptic Sound Synthesis
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground/60 uppercase">
                Web Audio API
              </span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p>
                Tactile feedback is reinforced using discrete Web Audio API
                synthesis. When scrubbing the ruler or hovering section anchors,
                short 800Hz–1200Hz sine bursts trigger with micro-decay
                envelopes.
              </p>
              <p>
                No external audio files or MP3 network payloads are
                downloaded—everything is synthesized dynamically on an in-memory
                AudioContext with zero latency.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  playHoverSound()
                }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border/60 bg-muted/50 px-3 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-muted active:scale-95"
              >
                <Volume2 className="size-3.5 text-primary" />
                Test Hover Click (800Hz)
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound()
                }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border/60 bg-muted/50 px-3 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-muted active:scale-95"
              >
                <Volume2 className="size-3.5 text-primary" />
                Test Nav Lock (1200Hz)
              </button>
            </div>
          </section>

          {/* Section 04: Zero-Thrashing Scroll Spy */}
          <section
            id="demo-scroll-spy"
            data-section-index={3}
            className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-xs transition-colors hover:border-border/80"
          >
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-primary">04</span>
                <span className="text-xs font-semibold tracking-wider text-foreground uppercase">
                  Zero-Thrashing RAF Engine
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground/60 uppercase">
                RAF Loop
              </span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p>
                The scroll spy uses a passive RequestAnimationFrame loop that
                throttles geometry queries to the monitor native refresh rate.
              </p>
              <p>
                Section offsets are measured with client bounding boxes and
                compared against a 20% viewport threshold, guaranteeing zero
                cumulative layout shifts (CLS) and smooth 60/120fps rendering.
              </p>
            </div>

            <div className="rounded-lg border border-border/40 bg-muted/30 p-3.5 text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground">
                PASSIVE SCROLL LISTENER:
              </span>{" "}
              Equipped with{" "}
              <code className="text-primary">&#123; passive: true &#125;</code>{" "}
              and cancelAnimationFrame cleanup to eliminate thread blocking.
            </div>
          </section>

          {/* Section 05: Headless Integration API */}
          <section
            id="demo-props"
            data-section-index={4}
            className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-xs transition-colors hover:border-border/80"
          >
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-primary">05</span>
                <span className="text-xs font-semibold tracking-wider text-foreground uppercase">
                  Container-Agnostic Binding
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground/60 uppercase">
                Headless Prop
              </span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p>
                Pass any standard React RefObject to{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-primary">
                  scrollRef
                </code>{" "}
                to bind the indicator to a nested overflow pane, modal, or
                drawer. If omitted, the indicator automatically falls back to
                listening to the global window scroll event.
              </p>
              <p>
                Supports custom click callbacks, controlled{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-primary">
                  activeIndex
                </code>
                , and arbitrary tick counts.
              </p>
            </div>

            <pre className="overflow-x-auto rounded-lg border border-border/50 bg-neutral-950 p-4 text-xs text-neutral-200">
              {`// Drop-in React usage:
<ScrollIndicator
  sections={sections}
  scrollRef={containerRef}
  totalTicks={60}
  scrollOffset={64}
  className="h-full"
/>`}
            </pre>
          </section>

          {/* Outro Callout */}
          <footer className="flex items-center justify-between border-t border-border/50 pt-6 text-muted-foreground">
            <span className="text-[11px]">
              End of Calibration Specification
            </span>
            <span className="text-[11px] text-primary">
              Vernier Rail Calibrated
            </span>
          </footer>
        </div>
      </div>

      {/* Floating Vernier Rail - Docked cleanly on the right edge */}
      <div className="pointer-events-auto absolute top-1/2 right-2 z-30 -translate-y-1/2 sm:right-5 md:right-7">
        <div className="flex h-[360px] items-center sm:h-[440px]">
          <ScrollIndicator
            sections={DEMO_SECTIONS}
            scrollRef={scrollContainerRef}
            className="h-full"
          />
        </div>
      </div>
    </div>
  )
}

export default ScrollIndicatorDemo
