import { useState } from "react"
import { LineNav, type LineNavGroup } from "@/registry/animated/line-nav"

const GROUPED_ITEMS: LineNavGroup[] = [
  {
    title: "Crazy Hero",
    items: [
      { title: "Vercel Liquid simulation", href: "#vercel-liquid" },
      { title: "Ascii Simulation", href: "#ascii-simulation" },
      { title: "Interactive3d Hero", href: "#interactive3d-hero" },
      { title: "Canvas crowd", href: "#canvas-crowd" },
    ],
  },
  {
    title: "OG NavBars",
    items: [
      { title: "Nike menu", href: "#nike-menu" },
      { title: "Apple Navbar V001", href: "#apple-navbar-v001" },
      { title: "Vercel navigation bar", href: "#vercel-navigation-bar" },
      { title: "Apple Navbar V002", href: "#apple-navbar-v002" },
    ],
  },
  {
    title: "Scroll Effects",
    items: [
      { title: "Card stack scroll", href: "#card-stack-scroll" },
      { title: "Card stack with gsap and rotate", href: "#card-stack-gsap" },
      { title: "Svg follow scroll", href: "#svg-follow-scroll" },
      { title: "3D perspective text", href: "#3d-perspective-text" },
      { title: "Oliver parallax", href: "#oliver-parallax" },
      { title: "Text Scroll animation", href: "#text-scroll-animation" },
      { title: "Scroll images reveal 001", href: "#scroll-images-001" },
      { title: "Scroll images reveal 002", href: "#scroll-images-002" },
      { title: "Scroll images reveal 003", href: "#scroll-images-003" },
      { title: "Parallax Image", href: "#parallax-image" },
    ],
  },
]

export function LineNavGrouped() {
  const [activeHref, setActiveHref] = useState<string>("#card-stack-scroll")

  return (
    <div className="w-full max-w-sm rounded-md bg-accent p-4">
      <div className="mx-auto max-h-[520px] w-full overflow-y-auto pr-3">
        <LineNav
          groups={GROUPED_ITEMS}
          activeHref={activeHref}
          scrollActiveIntoView={false}
          onItemClick={(item, e) => {
            e.preventDefault()
            if (item.href) {
              setActiveHref(item.href)
            }
          }}
        />
      </div>
    </div>
  )
}

export default LineNavGrouped
