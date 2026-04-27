import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Menu nodes (SidebarContentConfig, passed from RouteEntry.sidebar, etc.)
// ---------------------------------------------------------------------------

/**
 * Collapsed-mode tooltip; maps to `Sidebar.MenuItem` `tooltipProps`.
 * When the sidebar is icon-only, Pro renders this as a tooltip.
 */
export type TooltipConfig = {
  /** Tooltip content */
  content: ReactNode;
  /** Optional class on the tooltip container */
  className?: string;
  /** Show delay (ms) */
  delay?: number;
  /** Hide delay (ms) */
  closeDelay?: number;
  /** Placement, default "right" */
  placement?: "top" | "bottom" | "left" | "right";
};

type SidebarMenuItemBase = {
  icon?: ReactNode;
  label: ReactNode;
  chip?: ReactNode;
  actions?: ReactNode;
  tooltip?: TooltipConfig;
  onPress?: () => void;
};

/**
 * Leaf: may have `href` to navigate, **no** submenu (`children` absent).
 */
export type SidebarMenuItemLeaf = SidebarMenuItemBase & {
  href?: string;
  children?: never;
};

/**
 * Branch: with `children`, **`href` is not allowed** (expand/collapse only, no navigation).
 */
export type SidebarMenuItemBranch = SidebarMenuItemBase & {
  children: SidebarMenuItemNode[];
  href?: never;
};

/**
 * Menu item: leaf XOR branch, enforcing "submenu => no href".
 */
export type SidebarMenuItemNode = SidebarMenuItemLeaf | SidebarMenuItemBranch;

/** Horizontal rule; maps to `Sidebar.Separator` */
export type SidebarSeparatorNode = {
  type: "separator";
};

/**
 * Group; maps to `Sidebar.Group` + `Sidebar.Menu`.
 * When `label` is set, also renders `Sidebar.GroupLabel` (hidden when collapsed).
 */
export type SidebarGroupNode = {
  type: "group";
  /** Optional group title; if omitted, no GroupLabel */
  label?: ReactNode;
  menu: SidebarMenuItemNode[];
};

/** Allowed node types in `SidebarContentConfig.nodes` */
export type SidebarNode = SidebarSeparatorNode | SidebarGroupNode;

/**
 * Sidebar config root; `RouteEntry.sidebar` uses this.
 * `nodes` render in order; `menu-tree` dispatches to Pro by node type.
 */
export type SidebarContentConfig = {
  nodes: SidebarNode[];
};

// ---------------------------------------------------------------------------
// Route (rail slot + bound sidebar)
// ---------------------------------------------------------------------------

/**
 * One rail slot (icon + bound sidebar).
 * Click only switches the visible sidebar (see `setActiveEntryId`); it does not navigate.
 * Which entry is active for a URL is derived from leaf `href`s in implementation; this type has no extra match field.
 */
export type RouteEntry = {
  id: string;
  icon: ReactNode;
  label: ReactNode;
  tooltip?: TooltipConfig;
  sidebar: SidebarContentConfig;
};

/**
 * Full route config: multiple rail entries and their sidebars.
 * Passed from the `Layout` root; Context fans out to `Rail` / `SidebarMain`.
 */
export type RouteConfig = {
  entries: RouteEntry[];
  /**
   * Fallback `entry.id` when pathname matches no leaf in any `sidebar`.
   * If omitted, falls back to `entries[0]?.id`.
   */
  defaultEntryId?: string;
};
