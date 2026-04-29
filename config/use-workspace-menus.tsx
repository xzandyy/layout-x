"use client";

import { useMemo, useState } from "react";

import type { MenuConfig } from "@/components/Layout";

import { buildWorkspaceMenuConfig } from "./workspace-menu-builders";
import {
  defaultWorkspaceMenuState,
  type WorkspaceMenuState,
} from "./workspace-menu-types";

export type UseWorkspaceMenusResult = {
  menuConfig: MenuConfig;
  menuState: WorkspaceMenuState;
  setMenuState: React.Dispatch<React.SetStateAction<WorkspaceMenuState>>;
};

/**
 * 运行时组装 workspace `MenuConfig`，便于接入未读数等状态。
 * `menuConfig` 已 `useMemo`，避免无谓刷新 Layout。
 */
export function useWorkspaceMenus(
  initialState: WorkspaceMenuState = defaultWorkspaceMenuState,
): UseWorkspaceMenusResult {
  const [menuState, setMenuState] = useState<WorkspaceMenuState>(initialState);

  const menuConfig = useMemo(
    () => buildWorkspaceMenuConfig(menuState),
    [menuState],
  );

  return { menuConfig, menuState, setMenuState };
}
