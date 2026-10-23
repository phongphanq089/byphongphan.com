import type { PostHog } from "posthog-js"

type CommandMenuLogAttributes = {
  command_group: string
  command_type: "action" | "external" | "navigation"
}

type ComponentCopyLogAttributes = {
  component_category: string
  component_slug: string
}

type BlockViewportLogAttributes = {
  block_category: string
  viewport: "desktop" | "tablet" | "mobile"
}

export const posthogInteractionLogger = {
  commandMenuItemSelected(
    posthog: PostHog,
    attributes: CommandMenuLogAttributes
  ) {
    posthog.logger.info("command menu item selected", attributes)
  },
  componentNameCopied(
    posthog: PostHog,
    attributes: ComponentCopyLogAttributes
  ) {
    posthog.logger.info("component name copied", attributes)
  },
  blockViewportChanged(
    posthog: PostHog,
    attributes: BlockViewportLogAttributes
  ) {
    posthog.logger.info("block preview viewport changed", attributes)
  },
}
