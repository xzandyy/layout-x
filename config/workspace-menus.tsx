/**
 * Workspace 侧栏 / Rail 菜单：使用 {@link useWorkspaceMenus} 运行时组装。
 */
export {
  buildWorkspaceMenuConfig,
  workspaceRailSettings,
} from "./workspace-menu-builders";
export type { WorkspaceMenuState } from "./workspace-menu-types";
export {
  defaultWorkspaceMenuState,
} from "./workspace-menu-types";
export {
  useWorkspaceMenus,
  type UseWorkspaceMenusResult,
} from "./use-workspace-menus";

import type { MenuConfig } from "@/components/Layout";

import { buildWorkspaceMenuConfig } from "./workspace-menu-builders";
import { defaultWorkspaceMenuState } from "./workspace-menu-types";

/** @deprecated 仅兼容旧用法；请改用 `useWorkspaceMenus()` */
export const workspaceMenus: MenuConfig = buildWorkspaceMenuConfig(
  defaultWorkspaceMenuState,
);
