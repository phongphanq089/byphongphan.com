import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowSquareOutIcon,
  BookOpenIcon,
  CaretRightIcon,
  CodeIcon,
  XIcon,
} from "@phosphor-icons/react"
import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { play } from "cuelume"
import { useMemo } from "react"

import { cn } from "@/shared/lib/utils"
import { ScrollArea } from "@/shared/ui"
import {
  Badge,
  BadgeDot,
  Button,
  Kbd,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/core"
import { CodeBlockCommand } from "@/shared/ui/core/code-block"

import {
  getStudioMdxData,
  studioMdxComponents,
} from "../model/studio-mdx.adapter"
import type { StudioItem } from "../model/types"
import {
  getStudioAdjacentItems,
  getStudioItemHref,
  getStudioSegmentLabel,
} from "../model/unified-registry.adapter"
import { useStudioStore } from "../store/studio-store"
import { DocActionsDropdown } from "./doc-actions-dropdown"

interface StudioDocsViewProps {
  item: StudioItem
  /** Close the whole docked panel. */
  onClose?: () => void
  /** Renders the compact close header bar (used on mobile drawers). */
  showHeaderBar?: boolean
  activeVariantId?: string
  onSelectVariant: (variantId: string | null) => void
}

/**
 * Floating borderless documentation view for a studio detail item:
 * - On desktop: sits directly on the outer background with no heavy box/header border.
 * - Top breathing room leaves space under the top-right floating action capsule.
 */
export function StudioDocsView({
  item,
  onClose,
  showHeaderBar = false,
}: StudioDocsViewProps) {
  const rawParams = useParams({ strict: false }) as {
    collection?: string
  }
  const segment =
    typeof rawParams.collection === "string" ? rawParams.collection : null
  const toggleCode = useStudioStore((state) => state.toggleCode)
  const navigate = useNavigate()

  const mdxData = useMemo(() => getStudioMdxData(item.slug), [item.slug])
  const { prev, next } = useMemo(() => getStudioAdjacentItems(item), [item])

  const frontmatter = mdxData?.frontmatter
  const title = frontmatter?.title ?? item.title
  const description = frontmatter?.description ?? item.description
  const links = frontmatter?.links
  const customBadge = frontmatter?.badge

  const goTo = (target: StudioItem) => {
    void navigate({ href: getStudioItemHref(target) })
  }

  const goPrev = () => {
    if (!prev) return
    play("attention", { direction: "back", emphasis: "subtle" })
    goTo(prev)
  }

  const goNext = () => {
    if (!next) return
    play("attention", { direction: "forward", emphasis: "subtle" })
    goTo(next)
  }

  return (
    <div className="flex h-full w-full flex-col">
      {showHeaderBar ? (
        <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-border/60 px-4">
          <span className="truncate font-mono text-xs font-medium text-muted-foreground uppercase">
            {title}
          </span>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <XIcon size={16} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      ) : null}

      <ScrollArea className="min-h-0 flex-1" scrollFade>
        <article
          className={cn(
            "flex flex-col gap-5 px-5 pb-12",
            showHeaderBar ? "pt-5" : "pt-16 sm:px-6"
          )}
        >
          {/* Quiet inline breadcrumb + micro nav */}
          <div className="flex items-center justify-between gap-2">
            <nav
              aria-label="Breadcrumb"
              className="flex min-w-0 items-center gap-1 font-mono text-[10px] tracking-wider text-muted-foreground/70 uppercase"
            >
              <Link
                to="/ui"
                className="shrink-0 transition-colors hover:text-foreground"
              >
                UI
              </Link>
              {segment ? (
                <>
                  <CaretRightIcon
                    size={10}
                    className="shrink-0 opacity-50"
                    aria-hidden="true"
                  />
                  <Link
                    to="/ui/$collection"
                    params={{ collection: segment }}
                    className="max-w-28 shrink-0 truncate transition-colors hover:text-foreground"
                  >
                    {getStudioSegmentLabel(segment, segment)}
                  </Link>
                </>
              ) : null}
              <CaretRightIcon
                size={10}
                className="shrink-0 opacity-50"
                aria-hidden="true"
              />
              <span
                aria-current="page"
                className="min-w-0 truncate text-foreground/85"
              >
                {title}
              </span>
            </nav>

            <div className="flex shrink-0 items-center gap-1">
              {prev ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label="Previous component"
                      onClick={goPrev}
                      className="inline-flex size-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground/70 transition-colors hover:bg-muted/70 hover:text-foreground"
                    >
                      <ArrowLeftIcon size={15} aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-[10px]">
                    Previous <Kbd>←</Kbd>
                  </TooltipContent>
                </Tooltip>
              ) : null}

              {next ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label="Next component"
                      onClick={goNext}
                      className="inline-flex size-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground/70 transition-colors hover:bg-muted/70 hover:text-foreground"
                    >
                      <ArrowRightIcon size={15} aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-[10px]">
                    Next <Kbd>→</Kbd>
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </div>
          </div>

          {/* Editorial Title + Badges + Description */}
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              {item.isNew ? (
                <Badge
                  variant="outline"
                  size="sm"
                  shape="rounded"
                  className="gap-1.5 border-primary/30 bg-primary/10 text-[10px] font-medium text-primary"
                >
                  <BadgeDot pulse />
                  <span>New</span>
                </Badge>
              ) : item.isUpdated ? (
                <Badge
                  variant="success"
                  size="sm"
                  shape="rounded"
                  className="gap-1.5 text-[10px] font-medium"
                >
                  <BadgeDot pulse />
                  <span>Updated</span>
                </Badge>
              ) : null}

              {customBadge ? (
                <Badge
                  variant="secondary"
                  size="sm"
                  shape="rounded"
                  className="border-border/50 bg-secondary/70 text-[10px] font-medium text-secondary-foreground"
                >
                  <span>{customBadge}</span>
                </Badge>
              ) : null}
            </div>

            <h3 className="text-xl leading-snug font-semibold tracking-tight text-foreground sm:text-2xl">
              {description}
            </h3>

            {links && (links.doc || links.api) ? (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {links.doc ? (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-7 gap-1.5 rounded-lg border-border/70 bg-transparent text-xs text-muted-foreground hover:text-foreground"
                  >
                    <a href={links.doc} target="_blank" rel="noreferrer">
                      <BookOpenIcon
                        size={14}
                        className="text-pp-primary"
                        aria-hidden="true"
                      />
                      <span>Docs</span>
                      <ArrowSquareOutIcon
                        size={12}
                        className="opacity-60"
                        aria-hidden="true"
                      />
                    </a>
                  </Button>
                ) : null}
                {links.api ? (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-7 gap-1.5 rounded-lg border-border/70 bg-transparent text-xs text-muted-foreground hover:text-foreground"
                  >
                    <a href={links.api} target="_blank" rel="noreferrer">
                      <CodeIcon
                        size={14}
                        className="text-pp-primary"
                        aria-hidden="true"
                      />
                      <span>API Reference</span>
                      <ArrowSquareOutIcon
                        size={12}
                        className="opacity-60"
                        aria-hidden="true"
                      />
                    </a>
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Quiet hairline actions bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-y border-border/50 py-2.5">
            <DocActionsDropdown
              item={item}
              segment={segment}
              rawMdxContent={mdxData?.rawMdxContent}
            />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleCode}
              className="h-8 gap-1.5 rounded-lg px-3 text-xs text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            >
              <CodeIcon
                size={15}
                className="text-pp-primary"
                aria-hidden="true"
              />
              <span>View Source</span>
            </Button>
          </div>

          {/* MDX doc (or fallback for blocks without .mdx) */}
          {mdxData ? (
            <mdxData.Component components={studioMdxComponents} />
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Install
                </p>
                <CodeBlockCommand name={item.slug} className="mt-1" />
              </div>

              {item.dependencies && item.dependencies.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Dependencies
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {item.dependencies.map((dependency) => (
                      <li
                        key={dependency}
                        className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                      >
                        {dependency}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          )}
        </article>
      </ScrollArea>
    </div>
  )
}
