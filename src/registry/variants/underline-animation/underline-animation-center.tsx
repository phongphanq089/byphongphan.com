import { UnderlineAnimation } from "@/registry/animated/underline-animation"

export default function UnderlineAnimationCenter() {
  const LINKS = ["About", "Projects", "Writing", "Playground", "Contact"]

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-6">
      {LINKS.map((link) => (
        <UnderlineAnimation
          key={link}
          as="span"
          direction="center"
          className="text-base font-medium text-foreground transition-colors hover:text-primary"
        >
          {link}
        </UnderlineAnimation>
      ))}
    </div>
  )
}
