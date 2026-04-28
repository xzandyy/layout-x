export {
  useLayoutContext,
  useLayout,
  useLayoutRailOutlet,
  LayoutRootClient,
} from "./root-client";
export type {
  RootProps,
  LayoutContextValue,
  LayoutRailOutletContextValue,
} from "./root-client";
export type {
  ContentProps,
  ContentHeaderProps,
  ContentBodyProps,
} from "./content";
export type {
  RailProps,
  RailHeaderProps,
  RailFooterProps,
  RailMainProps,
} from "./rail";
export type {
  SidebarProps,
  SidebarHeaderProps,
  SidebarFooterProps,
  SidebarMainProps,
} from "./sidebar";
export type {
  RouteConfig,
  RailMenuConfig,
  RailMenuItem,
  SidebarMenuConfig,
  SidebarMenuItem,
  SidebarSeparatorItem,
  SidebarGroupItem,
  SidebarMenuItemNode,
  SidebarMenuItemLeaf,
  SidebarMenuItemBranch,
  TooltipConfig,
  Router,
} from "./types";

export { appRouter } from "./types";

export { Breadcrumbs } from "./breadcrumbs";
export type { BreadcrumbsProps } from "./breadcrumbs";

/** @deprecated 使用 `RailMenuItem` */
export type { RailMenuItem as RouteEntry } from "./types";
/** @deprecated 使用 `SidebarMenuConfig` */
export type { SidebarMenuConfig as SidebarContentConfig } from "./types";
/** @deprecated 使用 `SidebarMenuItem` */
export type { SidebarMenuItem as SidebarNode } from "./types";
/** @deprecated 使用 `SidebarGroupItem` */
export type { SidebarGroupItem as SidebarGroupNode } from "./types";
/** @deprecated 使用 `SidebarSeparatorItem` */
export type { SidebarSeparatorItem as SidebarSeparatorNode } from "./types";
