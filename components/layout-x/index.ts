import {
  LayoutXRoot,
  LayoutXRail,
  LayoutXRailHeader,
  LayoutXRailMain,
  LayoutXRailFooter,
  LayoutXSidebar,
  LayoutXSidebarHeader,
  LayoutXSidebarMain,
  LayoutXSidebarFooter,
  LayoutXContent,
  LayoutXContentHeader,
  LayoutXContentBody,
} from "./layout-x";

/**
 * 整合组件：三列工作区骨架（Rail + Sidebar + Content）+ 配置化 Pro Sidebar。
 *
 * 静态子组件：
 *   LayoutX.Rail / RailHeader / RailMain / RailFooter
 *   LayoutX.Sidebar / SidebarHeader / SidebarMain / SidebarFooter
 *   LayoutX.Content / ContentHeader / ContentBody
 *
 * 典型用法：
 *   <LayoutX>
 *     <LayoutX.Rail>...</LayoutX.Rail>
 *     <LayoutX.Sidebar>
 *       <LayoutX.SidebarHeader>导航</LayoutX.SidebarHeader>
 *       <LayoutX.SidebarMain content={sidebarContent} />
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
  RailFooter: LayoutXRailFooter,
  Sidebar: LayoutXSidebar,
  SidebarHeader: LayoutXSidebarHeader,
  SidebarMain: LayoutXSidebarMain,
  SidebarFooter: LayoutXSidebarFooter,
  Content: LayoutXContent,
  ContentHeader: LayoutXContentHeader,
  ContentBody: LayoutXContentBody,
});

export type {
  LayoutXProps,
  LayoutXRegionProps,
  LayoutXSidebarMainProps,
  LayoutXContentHeaderProps,
  LayoutXContextValue,
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
