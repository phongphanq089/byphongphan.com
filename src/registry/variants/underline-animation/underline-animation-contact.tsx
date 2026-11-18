import { UnderlineAnimation } from "@/registry/animated/underline-animation"

export function UnderlineAnimationContact() {
  return (
    <div className="flex w-full max-w-full items-center justify-center px-4 py-8 sm:p-10 md:p-14">
      <div className="grid w-full max-w-xl grid-cols-1 gap-6 text-sm font-semibold tracking-wider text-primary uppercase sm:grid-cols-2 sm:gap-8 sm:text-base">
        {/* Left column: Section label */}
        <div>
          <span>CONTACT</span>
        </div>

        {/* Right column: Social & Email Links */}
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col items-start gap-2">
            <UnderlineAnimation
              as="a"
              href="#linkedin"
              direction="center"
              className="text-primary transition-colors hover:text-primary"
            >
              LINKEDIN
            </UnderlineAnimation>
            <UnderlineAnimation
              as="a"
              href="#instagram"
              direction="center"
              className="text-primary transition-colors hover:text-primary"
            >
              INSTAGRAM
            </UnderlineAnimation>
            <UnderlineAnimation
              as="a"
              href="#twitter"
              direction="center"
              className="text-primary transition-colors hover:text-primary"
            >
              X (TWITTER)
            </UnderlineAnimation>
          </div>

          <div className="flex flex-col items-start gap-2 break-all sm:break-normal">
            <UnderlineAnimation
              as="a"
              href="mailto:fancy@fancy.dev"
              direction="left"
              className="text-primary transition-colors hover:text-primary"
            >
              FANCY@FANCY.DEV
            </UnderlineAnimation>
            <UnderlineAnimation
              as="a"
              href="mailto:hello@fancy.dev"
              direction="left"
              className="text-primary transition-colors hover:text-primary"
            >
              HELLO@FANCY.DEV
            </UnderlineAnimation>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnderlineAnimationContact
