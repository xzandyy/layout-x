"use client";

import { useMemo } from "react";

import type { MenuConfig } from "@/components/Layout";

import { createMenuAgents, useMenuAgents } from "./use-menu-agents";
import { createMenuFlows, useMenuFlows } from "./use-menu-flows";
import { createMenuHome, useMenuHome } from "./use-menu-home";
import { createMenuInbox, useMenuInbox } from "./use-menu-inbox";
import { createMenuLibrary, useMenuLibrary } from "./use-menu-library";

export function useWorkspaceMenus(): MenuConfig {
  const home = useMenuHome();
  const inbox = useMenuInbox();
  const agents = useMenuAgents();
  const flows = useMenuFlows();
  const library = useMenuLibrary();

  return useMemo(
    () => ({
      rail: [{ items: [home, inbox, agents, flows, library] }],
    }),
    [home, inbox, agents, flows, library],
  );
}

export function buildWorkspaceMenuConfig(): MenuConfig {
  return {
    rail: [
      {
        items: [
          createMenuHome(),
          createMenuInbox(),
          createMenuAgents(),
          createMenuFlows(),
          createMenuLibrary(),
        ],
      },
    ],
  };
}

/** @deprecated 仅兼容旧用法；请改用 `useWorkspaceMenus()` */
export const workspaceMenus: MenuConfig = buildWorkspaceMenuConfig();

export {
  createMenuAgents,
  useMenuAgents,
} from "./use-menu-agents";
export {
  createMenuFlows,
  useMenuFlows,
} from "./use-menu-flows";
export {
  createMenuHome,
  useMenuHome,
} from "./use-menu-home";
export {
  createMenuInbox,
  useMenuInbox,
} from "./use-menu-inbox";
export {
  createMenuLibrary,
  useMenuLibrary,
} from "./use-menu-library";
export {
  createMenuSettings,
  useMenuSettings,
} from "./use-menu-settings";
