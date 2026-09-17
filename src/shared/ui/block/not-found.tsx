import { Link } from "@tanstack/react-router"
import { Dices, Lightbulb, RotateCcw } from "lucide-react"
import { useEffect, useRef } from "react"

import { Gravity, type GravityRef, MatterBody } from "@/shared/ui/block/gravity"
import { Button } from "@/shared/ui/core/button"

export function NotFound({ children }: { children?: React.ReactNode }) {
  const gravityRef = useRef<GravityRef | null>(null)

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
    }
  }, [])

  return (
    <main className="fixed inset-0 z-50 flex h-[100dvh] w-screen flex-col overflow-hidden bg-background text-foreground transition-colors duration-300 select-none">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 grid grid-cols-[1fr_repeat(2,min(560px,42vw))_1fr] grid-rows-[24px_60px_auto_60px_1fr]"
      >
        <div className="border-r border-b border-border/40" />
        <div className="border-r border-b border-border/40" />
        <div className="border-r border-b border-border/40" />
        <div className="border-b border-border/40" />

        <div className="border-r border-b border-border" />
        <div className="border-r border-b border-border/40" />
        <div className="border-r border-b border-border" />
        <div className="border-b border-border" />

        <div className="border-r border-b border-border" />
        <div className="border-r border-b border-border" />
        <div className="border-r border-b border-border" />
        <div className="border-b border-border" />
        <div className="border-r border-b border-border" />
        <div className="border-r border-b border-border/40" />
        <div className="border-r border-b border-border" />
        <div className="border-b border-border" />

        <div className="border-r border-border" />
        <div className="border-r border-border" />
        <div className="border-r border-border" />
        <div />
      </div>

      <div className="absolute inset-0 z-10 h-full w-full">
        <Gravity
          ref={gravityRef}
          gravity={{ x: 0, y: 1 }}
          addTopWall={false}
          grabCursor={true}
          className="h-full w-full"
        >
          <MatterBody
            x="14%"
            y="-10%"
            angle={-3}
            matterBodyOptions={{ friction: 0.3, restitution: 0.2 }}
          >
            <div className="flex h-[155px] w-[100px] flex-col items-center justify-center rounded-xl border border-black/10 bg-[#9cd517] text-[#05461c] shadow-lg transition-colors select-none sm:h-[230px] sm:w-[200px] dark:border-white/10 dark:bg-[#1d320d] dark:text-[#a3e635]">
              <Lightbulb className="size-16 stroke-[2.5] sm:size-32" />
            </div>
          </MatterBody>

          <MatterBody
            x="14%"
            y="-38%"
            angle={2}
            matterBodyOptions={{ friction: 0.3, restitution: 0.2 }}
          >
            <div className="flex h-[155px] w-[100px] flex-col items-center justify-center gap-2.5 rounded-xl border border-black/10 bg-[#f97316] shadow-lg transition-colors select-none sm:h-[230px] sm:w-[200px] sm:gap-4 dark:border-white/10 dark:bg-[#3a1306]">
              <svg
                width="80px"
                height="80px"
                viewBox="0 0 20 20"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>file_svg [#1746]</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g
                  id="Page-1"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <g
                    id="Dribbble-Light-Preview"
                    transform="translate(-260.000000, -1319.000000)"
                    className="fill-white/80"
                  >
                    <g id="icons" transform="translate(56.000000, 160.000000)">
                      <path
                        d="M214.25,1177.0005 L213.75,1177.0005 L213,1171.0005 L211,1171.0005 L212,1179.0005 L213,1179.0005 L214,1179.0005 L215,1179.0005 L216,1179.0005 L217,1171.0005 L215,1171.0005 L214.25,1177.0005 Z M218,1175.0005 C218,1177.2095 219.791,1179.0005 222,1179.0005 L224,1179.0005 L224,1175.0005 L222,1175.0005 L222,1177.1055 C220.895,1177.1055 220,1176.1575 220,1175.0525 C220,1173.9485 220.895,1173.0005 222,1173.0005 L224,1173.0005 L224,1171.0005 L222,1171.0005 C219.791,1171.0005 218,1172.7915 218,1175.0005 L218,1175.0005 Z M206,1171.0005 C204.895,1171.0005 204,1172.0005 204,1173.1055 L204,1174.1055 C204,1175.2095 204.895,1176.0005 206,1176.0005 L207.5,1176.0005 C207.776,1176.0005 208,1176.2245 208,1176.5005 C208,1176.7765 207.776,1177.0005 207.5,1177.0005 L204,1177.0005 L204,1179.0005 L208,1179.0005 L208.021,1179.0005 C209.114,1179.0005 210,1178.2195 210,1177.1255 L210,1176.0845 C210,1174.9915 209.114,1174.0005 208.021,1174.0005 L208,1174.0005 L206.5,1174.0005 C206.224,1174.0005 206,1173.7765 206,1173.5005 C206,1173.2245 206.224,1173.0005 206.5,1173.0005 L210,1173.0005 L210,1171.0005 L206,1171.0005 Z M224,1165.4385 L224,1169.0005 L222,1169.0005 L222,1167.0005 L216,1167.0005 L216,1161.0005 L206,1161.0005 L206,1169.0005 L204,1169.0005 L204,1159.0005 L217.979,1159.0005 L224,1165.4385 Z"
                        id="file_svg-[#1746]"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          </MatterBody>

          <MatterBody
            x="28%"
            y="-18%"
            angle={-2}
            matterBodyOptions={{ friction: 0.3, restitution: 0.2 }}
          >
            <div className="flex h-[95px] w-[135px] items-center justify-center rounded-xl border border-black/10 bg-[#fad246] p-6 px-3 text-[#3f1d0b] shadow-lg transition-colors select-none sm:h-[135px] sm:w-[200px] dark:border-white/10 dark:bg-[#352605] dark:text-[#fde047]">
              <svg
                className="fill-white/90 stroke-4"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                width="80px"
                height="80px"
              >
                <path
                  id="design-and-development--01"
                  d="M31,31.36H1v-0.72h30V31.36z M31,28.36H1v-0.72h30V28.36z M31,25.36H1v-0.72h30V25.36z
                  M31,22.36H1c-0.199,0-0.36-0.161-0.36-0.36V1c0-0.199,0.161-0.36,0.36-0.36h30c0.199,0,0.36,0.161,0.36,0.36v21
                  C31.36,22.199,31.199,22.36,31,22.36z M1.36,21.64h29.28V4.36H1.36V21.64z M1.36,3.64h29.28V1.36H1.36V3.64z M29,2.5
                  C29,2.776,28.776,3,28.5,3S28,2.776,28,2.5S28.224,2,28.5,2S29,2.224,29,2.5z M26.5,2C26.224,2,26,2.224,26,2.5S26.224,3,26.5,3
                  S27,2.776,27,2.5S26.776,2,26.5,2z M24.5,2C24.224,2,24,2.224,24,2.5S24.224,3,24.5,3S25,2.776,25,2.5S24.776,2,24.5,2z M10,14.36H4
                  v-0.72h6V14.36z M10,11.36H4v-0.72h6V11.36z M10,8.36H4V7.64h6V8.36z"
                />
                <rect
                  id="_Transparent_Rectangle"
                  className="fill-none"
                  width="32"
                  height="32"
                />
              </svg>
            </div>
          </MatterBody>

          <MatterBody
            x="28%"
            y="-42%"
            angle={3}
            matterBodyOptions={{ friction: 0.3, restitution: 0.2 }}
          >
            <div className="relative flex h-[150px] w-[100px] items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-[#67164b] shadow-lg transition-colors select-none sm:h-[220px] sm:w-[150px] dark:border-white/10 dark:bg-[#2b0720]">
              <svg
                className="fill-white/90"
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1.293,11.293l4-4A1,1,0,1,1,6.707,8.707L3.414,12l3.293,3.293a1,1,0,1,1-1.414,1.414l-4-4A1,1,0,0,1,1.293,11.293Zm17.414-4a1,1,0,1,0-1.414,1.414L20.586,12l-3.293,3.293a1,1,0,1,0,1.414,1.414l4-4a1,1,0,0,0,0-1.414ZM13.039,4.726l-4,14a1,1,0,0,0,.686,1.236A1.053,1.053,0,0,0,10,20a1,1,0,0,0,.961-.726l4-14a1,1,0,1,0-1.922-.548Z" />
              </svg>
            </div>
          </MatterBody>

          <MatterBody
            x="48%"
            y="-16%"
            angle={-2}
            matterBodyOptions={{ friction: 0.3, restitution: 0.2 }}
          >
            <div className="relative flex h-[185px] w-[100px] items-center justify-center rounded-xl border border-black/10 bg-[#1e293b] p-3 shadow-lg transition-colors select-none sm:h-[290px] sm:w-[250px]! sm:p-4 dark:border-white/10 dark:bg-[#0f172a]">
              <svg
                version="1.1"
                id="Uploaded to svgrepo.com"
                xmlns="http://www.w3.org/2000/svg"
                width="120px"
                height="120px"
                viewBox="0 0 32 32"
                className="fill-white/90"
              >
                <path
                  d="M29,4H3C1.343,4,0,5.343,0,7v16c0,1.657,1.343,3,3,3h9v3h-1.5c-0.276,0-0.5,0.224-0.5,0.5l0,0
	c0,0.276,0.224,0.5,0.5,0.5h11c0.276,0,0.5-0.224,0.5-0.5l0,0c0-0.276-0.224-0.5-0.5-0.5H20v-3h9c1.657,0,3-1.343,3-3V7
	C32,5.343,30.657,4,29,4z M19,29h-6v-3h6V29z M31,23c0,1.105-0.895,2-2,2H3c-1.105,0-2-0.895-2-2V7c0-1.105,0.895-2,2-2h26
	c1.105,0,2,0.895,2,2V23z M25.805,9.03c-0.782-0.154-1.475,0.3-1.713,0.97H18V9h-4v1H7.908C7.67,9.33,6.976,8.876,6.195,9.03
	c-0.573,0.113-1.04,0.572-1.16,1.144C4.83,11.145,5.565,12,6.5,12c0.652,0,1.202-0.419,1.408-1H14v0.224
	c-4.388,0.897-7.745,4.658-7.986,9.246C5.999,20.757,6.227,21,6.515,21h0c0.263,0,0.484-0.204,0.497-0.467
	c0.209-4.065,3.134-7.41,6.988-8.289V13h4v-0.757c3.854,0.88,6.779,4.225,6.988,8.289C25.002,20.796,25.222,21,25.485,21h0
	c0.288,0,0.516-0.243,0.501-0.53c-0.241-4.588-3.598-8.349-7.986-9.246V11h6.092c0.207,0.581,0.756,1,1.408,1
	c0.935,0,1.67-0.855,1.466-1.826C26.845,9.602,26.378,9.143,25.805,9.03z M6.5,11C6.224,11,6,10.776,6,10.5S6.224,10,6.5,10
	S7,10.224,7,10.5S6.776,11,6.5,11z M17,12h-2v-2h2V12z M25.5,11c-0.276,0-0.5-0.224-0.5-0.5s0.224-0.5,0.5-0.5s0.5,0.224,0.5,0.5
	S25.776,11,25.5,11z"
                />
              </svg>
            </div>
          </MatterBody>

          <MatterBody
            x="58%"
            y="-32%"
            angle={3}
            matterBodyOptions={{ friction: 0.3, restitution: 0.2 }}
          >
            <div className="relative flex h-[185px] w-[100px] items-center justify-center rounded-xl border border-black/10 bg-[#c5b4f8] p-3 shadow-lg transition-colors select-none sm:h-[290px] sm:w-[150px] sm:p-4 dark:border-white/10 dark:bg-[#240f3b]">
              <svg
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.5"
                  d="M11.9999 2H8.66659C6.82564 2 5.33325 3.49238 5.33325 5.33333C5.33325 7.17428 6.82563 8.66667 8.66658 8.66667H11.9999V2Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
                <path
                  d="M11.9999 8.6665H8.66659C6.82564 8.6665 5.33325 10.1589 5.33325 11.9998C5.33325 13.8408 6.82563 15.3332 8.66658 15.3332H11.9999V8.6665Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
                <path
                  opacity="0.5"
                  d="M18.6667 11.9998C18.6667 13.8408 17.1743 15.3332 15.3333 15.3332C13.4924 15.3332 12 13.8408 12 11.9998C12 10.1589 13.4924 8.6665 15.3333 8.6665C17.1743 8.6665 18.6667 10.1589 18.6667 11.9998Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
                <path
                  opacity="0.5"
                  d="M8.66658 15.3335H11.9999V18.6668C11.9999 20.5078 10.5075 22.0002 8.66659 22.0002C6.82564 22.0002 5.33325 20.5078 5.33325 18.6668C5.33325 16.8259 6.82563 15.3335 8.66658 15.3335Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 2H15.3333C17.1743 2 18.6667 3.49238 18.6667 5.33333C18.6667 7.17428 17.1743 8.66667 15.3333 8.66667H12V2Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </MatterBody>

          <MatterBody
            x="72%"
            y="-14%"
            angle={-2}
            matterBodyOptions={{ friction: 0.3, restitution: 0.2 }}
          >
            <div className="flex h-[118px] w-[118px] items-center justify-end rounded-xl border border-black/10 bg-[#fa501e] pr-2.5 shadow-lg transition-colors select-none sm:h-[180px] sm:w-[180px] sm:pr-4 dark:border-white/10 dark:bg-[#441208]">
              <span className="-rotate-90 text-[78px] leading-none font-black tracking-tight text-[#3b0764] select-none sm:text-[120px] dark:text-[#fca5a5]">
                Aa
              </span>
            </div>
          </MatterBody>

          <MatterBody
            x="82%"
            y="-26%"
            angle={4}
            matterBodyOptions={{ friction: 0.3, restitution: 0.2 }}
          >
            <div className="relative flex h-[200px] w-[100px] items-center justify-center rounded-xl border border-black/10 bg-[#30c6e8] shadow-lg transition-colors select-none sm:h-[310px] sm:w-[200px] dark:border-white/10 dark:bg-[#082f49]">
              <svg
                version="1.1"
                id="Uploaded to svgrepo.com"
                xmlns="http://www.w3.org/2000/svg"
                width="800px"
                height="800px"
                viewBox="0 0 32 32"
                className="fill-white/90"
              >
                <style type="text/css"></style>
                <g>
                  <g>
                    <rect x="9" y="1" width="13" height="2" />
                    <path
                      d="M24.598,12.998C22.318,11.098,21,8.284,21,5.316V4H10v1.316c0,2.968-1.318,5.782-3.598,7.682
                      L4,15l11,16V19.95c-1.141-0.232-2-1.24-2-2.45c0-1.381,1.119-2.5,2.5-2.5s2.5,1.119,2.5,2.5c0,1.209-0.859,2.218-2,2.45V31l11-16
                      L24.598,12.998z"
                    />
                  </g>
                  <g>
                    <rect
                      x="9"
                      y="1"

                      width="13"
                      height="2"
                    />
                    <path
                      d="M24.598,12.998C22.318,11.098,21,8.284,21,5.316V4H10v1.316c0,2.968-1.318,5.782-3.598,7.682
                      L4,15l11,16V19.95c-1.141-0.232-2-1.24-2-2.45c0-1.381,1.119-2.5,2.5-2.5s2.5,1.119,2.5,2.5c0,1.209-0.859,2.218-2,2.45V31l11-16
                      L24.598,12.998z"
                    />
                  </g>
                </g>
              </svg>
            </div>
          </MatterBody>
        </Gravity>
      </div>

      <div className="pointer-events-none h-[60px] w-full shrink-0" />

      <header className="pointer-events-none relative z-20 mx-auto flex w-full max-w-4xl shrink-0 flex-col items-center px-4 py-8 text-center md:py-10">
        <h1 className="pointer-events-auto mb-4 text-3xl tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Page not found
        </h1>
        <p className="text-md pointer-events-auto mb-4">
          We couldn't find the page you were looking for.{" "}
          <Link to="/" className="underline underline-offset-2">
            Take Me Home
          </Link>
        </p>

        {children && (
          <div className="pointer-events-auto mb-3 max-w-lg text-sm text-muted-foreground md:text-base">
            {children}
          </div>
        )}

        <nav
          aria-label="404 Actions"
          className="pointer-events-auto flex flex-wrap items-center justify-center gap-2.5"
        >
          <Button
            size="default"
            variant="outline"
            type="button"
            onClick={() => gravityRef.current?.reset()}
          >
            <RotateCcw className="size-3.5" />
            <span>Reassemble</span>
          </Button>

          <Button
            size="default"
            variant="secondary"
            type="button"
            onClick={() => gravityRef.current?.scatter()}
          >
            <Dices className="size-3.5" />
            <span>Scatter</span>
          </Button>
        </nav>
      </header>
    </main>
  )
}
