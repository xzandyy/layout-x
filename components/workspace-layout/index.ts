import {
  WorkspaceLayoutBody,
  WorkspaceLayoutHeader,
  WorkspaceLayoutMain,
  WorkspaceLayoutPanel,
  WorkspaceLayoutRail,
  WorkspaceLayoutRoot,
  WorkspaceLayoutSidebar,
  WorkspaceLayoutSidebarSecondary,
} from "./workspace-layout";

/**
 * 在入口文件内组装，保证 `WorkspaceLayout.Rail` 等静态属性
 * 经 `import { WorkspaceLayout } from "@/components/workspace-layout"` 不会变成 `undefined`。
 */
export const WorkspaceLayout = Object.assign(WorkspaceLayoutRoot, {
  Rail: WorkspaceLayoutRail,
  Sidebar: WorkspaceLayoutSidebar,
  Panel: WorkspaceLayoutPanel,
  Header: WorkspaceLayoutHeader,
  Body: WorkspaceLayoutBody,
  SidebarSecondary: WorkspaceLayoutSidebarSecondary,
  Main: WorkspaceLayoutMain,
});

export {
  type WorkspaceLayoutContextValue,
  type WorkspaceLayoutHeaderProps,
  type WorkspaceLayoutProps,
  type WorkspaceLayoutRegionProps,
} from "./workspace-layout";
