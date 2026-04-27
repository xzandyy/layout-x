import {
  Root,
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
} from "./layout-x";

export const LayoutX = Object.assign(Root, {
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

export { useLayout as useLayoutX };

export type {
  LayoutXProps,
  LayoutXRegionProps,
  LayoutXSidebarMainProps,
  LayoutXContentHeaderProps,
  LayoutXContextValue,
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
