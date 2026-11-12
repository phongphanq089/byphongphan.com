const STACK_GROUPS = [
  {
    label: "Frontend Core",
    value:
      "TypeScript · React · Next.js · TanStack · Tailwind CSS · Motion · Scalable UI Systems",
  },
  {
    label: "Fullstack",
    value: "Node.js · REST APIs · Headless CMS",
  },
] as const

/**
 * Editorial bio: intro paragraphs (verbatim from the original home page section)
 * and the core stack, opened by accent micro-labels.
 */
export function ProfileBio() {
  return (
    <section aria-label="Introduction" className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase">
          ( Intro )
        </p>
        <div className="flex flex-col gap-4 text-base leading-relaxed text-muted-foreground">
          <p className="flex items-start gap-3">
            <span>
              I’m{" "}
              <span className="font-semibold text-foreground">Phong Phan</span>{" "}
              — a{" "}
              <span className="font-medium text-foreground">
                Frontend Engineer
              </span>{" "}
              with a solid fullstack foundation, passionate about crafting
              highly polished user interfaces, fluid micro-interactions, and
              obsessive attention to visual detail.
            </span>
          </p>

          <p>
            I love bridging the gap between aesthetics and engineering —
            transforming complex ideas into intuitive, responsive, and
            delightfully smooth digital experiences.
          </p>

          <p>
            Always excited to build high-quality web applications, refine user
            experiences, and collaborate with ambitious teams.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase">
          ( Core Stack )
        </p>
        <div className="flex flex-col gap-3 text-sm leading-relaxed">
          {STACK_GROUPS.map((group) => (
            <div
              key={group.label}
              className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="w-32 shrink-0 font-mono text-[9px] tracking-[0.2em] whitespace-nowrap text-muted-foreground/60 uppercase">
                {group.label}
              </span>
              <span className="text-muted-foreground">{group.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
