import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { play } from "cuelume"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Code2,
  ExternalLink,
  X,
} from "lucide-react"
import { useMemo } from "react"

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
  onClose: () => void
  activeVariantId?: string
  onSelectVariant: (variantId: string | null) => void
}

/**
 * Docked documentation view for a studio detail item: breadcrumb, badges,
 * external links, install/copy actions, prev/next navigation and the full
 * MDX doc (ComponentPreview is suppressed — the preview lives on the stage).
 */
export function StudioDocsView({ item, onClose }: StudioDocsViewProps) {
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
      {/* Breadcrumb + close */}
      <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-border/70 px-4">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5 text-[12px] text-muted-foreground"
        >
          <Link
            to="/ui"
            className="shrink-0 transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <ChevronRight
            className="size-3 shrink-0 text-muted-foreground/60"
            aria-hidden="true"
          />
          {segment ? (
            <>
              <Link
                to="/ui/$collection"
                params={{ collection: segment }}
                className="max-w-32 shrink-0 truncate transition-colors hover:text-foreground"
              >
                {getStudioSegmentLabel(segment, segment)}
              </Link>
              <ChevronRight
                className="size-3 shrink-0 text-muted-foreground/60"
                aria-hidden="true"
              />
            </>
          ) : null}
          <span
            aria-current="page"
            className="min-w-0 truncate font-medium text-foreground"
          >
            {title}
          </span>
        </nav>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel (Esc)"
          title="Close panel (Esc)"
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      <ScrollArea className="min-h-0 flex-1" scrollFade>
        <article className="flex flex-col gap-5 p-5">
          {/* Title + badges + description */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {item.isNew ? (
                <Badge
                  variant="outline"
                  size="sm"
                  shape="rounded"
                  className="gap-1.5 border-primary/30 bg-primary/10 text-[11px] font-medium text-primary"
                >
                  <BadgeDot pulse />
                  <span>New</span>
                </Badge>
              ) : item.isUpdated ? (
                <Badge
                  variant="success"
                  size="sm"
                  shape="rounded"
                  className="gap-1.5 text-[11px] font-medium"
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
                  className="border-border/50 bg-secondary/80 text-[11px] font-medium text-secondary-foreground"
                >
                  <span>{customBadge}</span>
                </Badge>
              ) : null}

              {item.categoryName ? (
                <Badge
                  variant="subtle"
                  size="sm"
                  shape="rounded"
                  className="border-border/40 text-[11px] font-medium text-muted-foreground capitalize"
                >
                  <span>{item.categoryName.replace(/-/g, " ")}</span>
                </Badge>
              ) : null}
            </div>

            <h3 className="text-2xl leading-tight font-semibold tracking-tight text-foreground">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>

            {links && (links.doc || links.api) ? (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {links.doc ? (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-7 gap-1.5 rounded-lg border-border/80 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <a href={links.doc} target="_blank" rel="noreferrer">
                      <BookOpen
                        className="size-3 text-pp-primary"
                        aria-hidden="true"
                      />
                      <span>Docs</span>
                      <ExternalLink
                        className="size-2.5 opacity-60"
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
                    className="h-7 gap-1.5 rounded-lg border-border/80 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <a href={links.api} target="_blank" rel="noreferrer">
                      <Code2
                        className="size-3 text-pp-primary"
                        aria-hidden="true"
                      />
                      <span>API Reference</span>
                      <ExternalLink
                        className="size-2.5 opacity-60"
                        aria-hidden="true"
                      />
                    </a>
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Sub-bar: Copy Page + Source Code + prev/next */}
          <div className="flex items-center justify-between gap-2 border-y border-border/60 py-2">
            <div className="flex items-center gap-1.5">
              <DocActionsDropdown
                item={item}
                segment={segment}
                rawMdxContent={mdxData?.rawMdxContent}
              />

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={toggleCode}
              >
                <Code2
                  className="size-3.5 text-pp-primary"
                  aria-hidden="true"
                />
                <span>Source Code</span>
              </Button>
            </div>

            <div className="flex items-center gap-1.5">
              {prev ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      aria-label="Previous component"
                      onClick={goPrev}
                      className="size-7"
                    >
                      <ArrowLeft
                        className="size-4 opacity-60"
                        aria-hidden="true"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-[10px]">
                    Previous Component{" "}
                    <Kbd>
                      <ArrowLeft />
                    </Kbd>
                  </TooltipContent>
                </Tooltip>
              ) : null}

              {next ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      aria-label="Next component"
                      onClick={goNext}
                      className="size-7"
                    >
                      <ArrowRight
                        className="size-4 opacity-60"
                        aria-hidden="true"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-[10px]">
                    Next Component{" "}
                    <Kbd>
                      <ArrowRight />
                    </Kbd>
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </div>
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
