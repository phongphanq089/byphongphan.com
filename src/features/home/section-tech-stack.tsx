import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"
import React from "react"

import { GridContainer } from "@/app/layouts"
import { TECH_STACK } from "@/shared/config"
import { SectionHeading } from "@/shared/ui"
import { iconComponents } from "@/shared/ui/icons"

const SectionTechStack = () => {
  return (
    <section id="tech-stack">
      {/* Blueprint Heading with Striped Pattern Background */}
      <GridContainer borderTop className="relative p-0" showCrosshairs={false}>
        <SectionHeading
          id="tech-stack"
          heading="Tech Stack"
          count={TECH_STACK.length}
        />
      </GridContainer>

      {/* Tech Cards Responsive Grid with Motion */}
      <GridContainer showCrosshairs={false} className="p-4 sm:p-6 md:p-8">
        <div className="grid w-full grid-cols-2 gap-3 xs:grid-cols-3 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-7">
          {TECH_STACK.map((item, index) => {
            const IconComp = iconComponents[item.icon]
            return (
              <motion.a
                key={item.label}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                title={`Visit ${item.label} official website`}
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.025, 0.3),
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -5,
                  transition: { type: "spring", stiffness: 400, damping: 20 },
                }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex flex-col items-center justify-between overflow-hidden rounded-xl border border-border/60 bg-card/60 p-3.5 transition-colors duration-300 hover:border-primary/50 hover:bg-accent/40 hover:shadow-[0_8px_24px_rgba(220,38,38,0.12)] sm:p-4.5 dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.06)]"
              >
                {/* Radial ambient glow on hover */}
                <div className="pointer-events-none absolute -top-10 left-1/2 size-20 -translate-x-1/2 rounded-full bg-primary/10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

                {/* Top card action: external link arrow */}
                <div className="relative z-10 flex w-full items-center justify-end">
                  <ArrowUpRight className="size-3.5 text-muted-foreground/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </div>

                {/* Icon Area: substantially enlarged 42px */}
                <div className="relative z-10 my-2 flex size-12 items-center justify-center sm:my-3 sm:size-14">
                  {IconComp ? (
                    <IconComp
                      size={42}
                      className="size-10 transition-transform duration-300 ease-out group-hover:scale-115 sm:size-11"
                    />
                  ) : null}
                </div>

                {/* Label */}
                <div className="relative z-10 w-full text-center">
                  <span className="block truncate text-xs font-semibold tracking-tight text-foreground/90 transition-colors group-hover:text-foreground">
                    {item.label}
                  </span>
                </div>
              </motion.a>
            )
          })}
        </div>
      </GridContainer>
    </section>
  )
}

export default SectionTechStack
