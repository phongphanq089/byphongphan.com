import { DrawerCreateHandle } from "@/registry/ui/drawer"

/**
 * Shared handle connecting the detached sidebar trigger (studio header
 * toggle button) with the sidebar `<Drawer>` root. Base UI uses it to sync
 * `aria-expanded` / `aria-controls` and toggle state between the two
 * sibling trees without prop drilling.
 */
export const studioSidebarHandle = DrawerCreateHandle()
