import { LayoutRoot } from "./root";
import { Rail, RailHeader, RailMain, RailFooter, RailMenuItem } from "./rail";
import { Sidebar, SidebarHeader, SidebarMain, SidebarFooter } from "./sidebar";
import { Content, ContentBody, ContentFooter, ContentHeader } from "./content";

// -- Layout Context -- //
export { useLayout } from "./context";
export type {
  LayoutContextValue,
  RootState,
  RailState,
  SidebarState,
  SlotState,
} from "./context";

// -- Layout Slot -- //
export type { LayoutChild } from "./context";
export {
  useLayoutSidebarHeaderSlot,
  useLayoutContentHeaderSlot,
  useLayoutContentFooterSlot,
  LayoutSidebarHeaderSlot,
  LayoutContentHeaderSlot,
  LayoutContentFooterSlot,
} from "./slot";

// -- Layout Root -- //
export { collectRailMenuItems } from "./utils";
export type { LayoutProps } from "./root";
export const Layout = Object.assign(LayoutRoot, {
  Rail,
  RailHeader,
  RailMain,
  RailFooter,
  RailMenuItem,
  Sidebar,
  SidebarHeader,
  SidebarMain,
  SidebarFooter,
  Content,
  ContentHeader,
  ContentBody,
  ContentFooter,
});

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
  ContentFooterProps,
} from "./content";

// -- Types（rail / sidebar 菜单与路径树） -- //
export type {
  MenuConfig,
  RailMenuConfig,
  RailMenuItem,
  SidebarMenuConfig,
  SidebarMenuItem,
  SidebarSeparatorItem,
  SidebarGroupItem,
  SidebarCustomItem,
  SidebarMenuItemNode,
  SidebarNavItem,
  SidebarSubmenu,
  TooltipConfig,
  Paths,
} from "./types";

export { workspacePaths } from "./types";
