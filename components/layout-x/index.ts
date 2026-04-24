import {
  LayoutXRoot,
  LayoutXRail,
  LayoutXRailHeader,
  LayoutXRailMain,
  LayoutXRailRouteNav,
  LayoutXRailFooter,
  LayoutXSidebar,
  LayoutXSidebarHeader,
  LayoutXSidebarEntryHeading,
  LayoutXSidebarMain,
  LayoutXSidebarFooter,
  LayoutXContent,
  LayoutXContentHeader,
  LayoutXContentBody,
  useLayoutX,
} from "./layout-x";

/**
 * 整合组件：三列工作区骨架（Rail + Sidebar + Content）+ 配置化 Pro Sidebar。
 *
 * 静态子组件：
 *   LayoutX.Rail / RailHeader / RailMain / RailRouteNav / RailFooter
 *   LayoutX.Sidebar / SidebarHeader / SidebarEntryHeading / SidebarMain / SidebarFooter
 *   LayoutX.Content / ContentHeader / ContentBody
 *
 * 典型用法：
 *   <LayoutX route={routeConfig}>
 *     <LayoutX.Rail>…<LayoutX.RailMain><LayoutX.RailRouteNav /></LayoutX.RailMain>…</LayoutX.Rail>
 *     <LayoutX.Sidebar>
 *       <LayoutX.SidebarHeader><LayoutX.SidebarEntryHeading /></LayoutX.SidebarHeader>
 *       <LayoutX.SidebarMain />
 *       <LayoutX.SidebarFooter>…</LayoutX.SidebarFooter>
 *     </LayoutX.Sidebar>
 *     <LayoutX.Content>
 *       <LayoutX.ContentHeader breadcrumbRoute={appRouter} />
 *       <LayoutX.ContentBody>{children}</LayoutX.ContentBody>
 *     </LayoutX.Content>
 *   </LayoutX>
 */
export const LayoutX = Object.assign(LayoutXRoot, {
  Rail: LayoutXRail,
  RailHeader: LayoutXRailHeader,
  RailMain: LayoutXRailMain,
  RailRouteNav: LayoutXRailRouteNav,
  RailFooter: LayoutXRailFooter,
  Sidebar: LayoutXSidebar,
  SidebarHeader: LayoutXSidebarHeader,
  SidebarEntryHeading: LayoutXSidebarEntryHeading,
  SidebarMain: LayoutXSidebarMain,
  SidebarFooter: LayoutXSidebarFooter,
  Content: LayoutXContent,
  ContentHeader: LayoutXContentHeader,
  ContentBody: LayoutXContentBody,
});

export { useLayoutX };

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
