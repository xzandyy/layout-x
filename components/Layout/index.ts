import { LayoutRoot } from "./root";
import { Rail, RailHeader, RailMain, RailRouteNav, RailFooter } from "./rail";
import { Sidebar, SidebarHeader, SidebarMain, SidebarFooter } from "./sidebar";
import { Content, ContentHeader, ContentBody } from "./content";

export const Layout = Object.assign(LayoutRoot, {
  Rail,
  RailHeader,
  RailMain,
  RailRouteNav,
  RailFooter,
  Sidebar,
  SidebarHeader,
  SidebarMain,
  SidebarFooter,
  Content,
  ContentHeader,
  ContentBody,
});

export { LayoutRoot, useLayout, useLayoutContext } from "./root";

export type { RootProps, LayoutContextValue } from "./root";
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
  RailRouteNavProps,
} from "./rail";
export type {
  SidebarProps,
  SidebarHeaderProps,
  SidebarFooterProps,
  SidebarMainProps,
} from "./sidebar";
export type {
  RouteConfig,
  RouteEntry,
  SidebarContentConfig,
  SidebarNode,
  SidebarGroupNode,
  SidebarSeparatorNode,
  SidebarMenuItemNode,
  SidebarMenuItemLeaf,
  SidebarMenuItemBranch,
  TooltipConfig,
  Router,
} from "./types";

export { appRouter } from "./types";

export { Breadcrumbs } from "./breadcrumbs";
export type { BreadcrumbsProps } from "./breadcrumbs";
