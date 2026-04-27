import {
  LayoutRoot,
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
  useLayout,
} from "./Layout";

export const Layout = Object.assign(LayoutRoot, {
  Rail: Rail,
  RailHeader: RailHeader,
  RailMain: RailMain,
  RailRouteNav: RailRouteNav,
  RailFooter: RailFooter,
  Sidebar: Sidebar,
  SidebarHeader: SidebarHeader,
  SidebarMain: SidebarMain,
  SidebarFooter: SidebarFooter,
  Content: Content,
  ContentHeader: ContentHeader,
  ContentBody: ContentBody,
});

export { useLayout };

export type {
  LayoutProps,
  LayoutRegionProps,
  LayoutSidebarMainProps,
  LayoutContentHeaderProps,
  LayoutContextValue,
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
} from "./types";

export { RouteBreadcrumbs } from "./route-breadcrumbs";
export type { RouteBreadcrumbsProps } from "./route-breadcrumbs";
