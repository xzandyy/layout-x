import {
  WorkspaceLayoutPanel,
  WorkspaceLayoutPanelHeader,
  WorkspaceLayoutPanelMain,
  WorkspaceLayoutRail,
  WorkspaceLayoutRailFooter,
  WorkspaceLayoutRailHeader,
  WorkspaceLayoutRailMain,
  WorkspaceLayoutRoot,
  WorkspaceLayoutSidebar,
  WorkspaceLayoutSidebarFooter,
  WorkspaceLayoutSidebarHeader,
  WorkspaceLayoutSidebarMain,
} from "./workspace-layout";

/**
 * 在入口文件内组装，保证 `WorkspaceLayout.Rail` 等静态属性
 * 经 `import { WorkspaceLayout } from "@/components/workspace-layout"` 不会变成 `undefined`。
 */
export const WorkspaceLayout = Object.assign(WorkspaceLayoutRoot, {
  Rail: WorkspaceLayoutRail,
  RailHeader: WorkspaceLayoutRailHeader,
  RailMain: WorkspaceLayoutRailMain,
  RailFooter: WorkspaceLayoutRailFooter,
  Sidebar: WorkspaceLayoutSidebar,
  SidebarHeader: WorkspaceLayoutSidebarHeader,
  SidebarMain: WorkspaceLayoutSidebarMain,
  SidebarFooter: WorkspaceLayoutSidebarFooter,
  Panel: WorkspaceLayoutPanel,
  PanelHeader: WorkspaceLayoutPanelHeader,
  PanelMain: WorkspaceLayoutPanelMain,
});

export {
  type WorkspaceLayoutContextValue,
  type WorkspaceLayoutPanelHeaderProps,
  type WorkspaceLayoutProps,
  type WorkspaceLayoutRegionProps,
} from "./workspace-layout";
