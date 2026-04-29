import { LayoutRoot } from "./root";
import { Rail, RailHeader, RailMain, RailFooter } from "./rail";
import { Sidebar, SidebarHeader, SidebarMain, SidebarFooter } from "./sidebar";
import { Content, ContentHeader, ContentBody } from "./content";

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
export { LayoutSidebarHeaderSlot, LayoutContentHeaderSlot } from "./slot";

// -- Layout Root -- //
export type { LayoutProps } from "./root";
export const Layout = Object.assign(LayoutRoot, {
  Rail,
  RailHeader,
  RailMain,
  RailFooter,
  Sidebar,
  SidebarHeader,
  SidebarMain,
  SidebarFooter,
  Content,
  ContentHeader,
  ContentBody,
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
