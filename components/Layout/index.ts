// -- Layout Root -- //
export { Layout } from "./layout";
export type { LayoutProps } from "./root-client";

// -- Layout Context -- //
export { useLayout } from "./root-client";
export type { LayoutContextValue } from "./root-client";

// -- Rail -- //
export type {
  RailProps,
  RailHeaderProps,
  RailFooterProps,
  RailMainProps,
} from "./rail";

// -- Sidebar -- //
export type {
  SidebarProps,
  SidebarHeaderProps,
  SidebarFooterProps,
  SidebarMainProps,
} from "./sidebar";

// -- Content -- //
export type {
  ContentProps,
  ContentHeaderProps,
  ContentBodyProps,
} from "./content";

// -- Types（主要是 rail 和 sidebar 的菜单配置类型） -- //
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
} from "./types";
