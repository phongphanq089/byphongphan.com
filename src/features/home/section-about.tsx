import { motion } from "motion/react"
import { Mascot } from "page-mascot"
import { Suspense } from "react"

import { GridContainer } from "@/app/layouts"
import { siteConfig } from "@/shared/config"
import { getCachedContributions } from "@/shared/lib"
import { SkeletonHover } from "@/shared/ui/animation/skeleton-hover"
import {
  GitHubContributions,
  GitHubContributionsFallback,
} from "@/shared/ui/system/github-contributions"
import { SectionHeading } from "@/shared/ui/system/section-heading"

const HobbyTag = ({ label }: { label: string }) => (
  <motion.span className="group inline-flex cursor-pointer items-center gap-2 rounded-sm border border-border bg-foreground/3 px-3.5 py-1 text-[11px] text-foreground transition-colors duration-300">
    <span className="h-1.5 w-1.5 rounded-full bg-pp-primary transition-all duration-300 group-hover:scale-125" />
    {label}
  </motion.span>
)

const SectionAbout = () => {
  const GITHUB_USERNAME = siteConfig.author.githubUsername
  const GITHUB_PROFILE_URL = siteConfig.social.github.href

  const contributions = getCachedContributions(GITHUB_USERNAME)
  return (
    <>
      <GridContainer className="px-4 py-3 md:px-8" borderTop>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex w-full gap-3">
            <GridContainer showCrosshairs={false} borderTop={true}>
              <div className="h-auto w-30">
                <Mascot
                  className="mx-auto"
                  directions="/assets/kamran-directions.webp"
                  reactions="/assets/kamran-reactions.webp"
                />
              </div>
            </GridContainer>

            <div className="flex w-full flex-col gap-2">
              <GridContainer
                showCrosshairs={false}
                borderTop={true}
                className="w-full p-0"
              >
                <SectionHeading id="about" heading="About Me" />
              </GridContainer>
              <GridContainer
                showCrosshairs={false}
                borderTop={true}
                className="w-full p-3"
              >
                <p className="text-[11px] tracking-wider text-muted-foreground/90">
                  Frontend Engineer · Fullstack Capable · Viet Nam
                </p>
              </GridContainer>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <SkeletonHover
              text1="There are tons of awesome frameworks like React, Angular, Vue, and Svelte that can make your life... easier (or a complete mess, depending on your code)"
              text2="DELUSIONAL"
            />
          </div>
        </div>
      </GridContainer>

      <GridContainer
        showCrosshairs={false}
        borderBottom={false}
        className="p-4 md:p-8"
      >
        <div className="flex flex-col gap-4 text-base leading-relaxed text-muted-foreground">
          <p>
            I’m{" "}
            <span className="font-semibold text-foreground">Phong Phan</span> —
            a{" "}
            <span className="font-medium text-foreground">
              Frontend Engineer
            </span>{" "}
            with a solid fullstack foundation, passionate about crafting highly
            polished user interfaces, fluid micro-interactions, and obsessive
            attention to visual detail.
          </p>

          <p>
            I love bridging the gap between aesthetics and engineering —
            transforming complex ideas into intuitive, responsive, and
            delightfully smooth digital experiences.
          </p>

          <p>
            My core strength is the modern frontend ecosystem:{" "}
            <span className="font-semibold text-foreground">
              TypeScript, React, Next.js, TanStack
            </span>
            , Tailwind CSS, motion design, and scalable UI component systems.
            Across the stack, I comfortably work with{" "}
            <span className="font-semibold text-foreground">Node.js</span>, REST
            APIs, and Headless CMS to deliver complete, end-to-end web products.
          </p>

          <p>
            Always excited to build high-quality web applications, refine user
            experiences, and collaborate with ambitious teams.
          </p>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <p className="text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase">
            Beyond Coding
          </p>
          <div className="flex flex-wrap gap-2">
            <HobbyTag label="Gym" />
            <HobbyTag label="Football" />
            <HobbyTag label="Mountain climbing" />
            <HobbyTag label="Reading" />
            <HobbyTag label="Traveling" />
          </div>
        </div>

        <div className="pt-8">
          <Suspense fallback={<GitHubContributionsFallback />}>
            <GitHubContributions
              contributions={contributions}
              githubProfileUrl={GITHUB_PROFILE_URL}
            />
          </Suspense>
        </div>
      </GridContainer>
    </>
  )
}

export default SectionAbout
