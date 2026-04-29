"use client";

import { useMemo } from "react";

import type { MenuConfig, RailMenuItem } from "@/components/Layout";

import { useMenuAgents } from "./menu-agents";
import { useMenuFlows } from "./menu-flows";
import { useMenuHome } from "./menu-home";
import { useMenuInbox } from "./menu-inbox";
import { useMenuLibrary } from "./menu-library";
import { workspaceRailSettings } from "./menu-settings";

export function useWorkspaceMenus(): {
  menuConfig: MenuConfig;
  manualMenuItems: RailMenuItem[];
} {
  const home = useMenuHome();
  const inbox = useMenuInbox();
  const agents = useMenuAgents();
  const flows = useMenuFlows();
  const library = useMenuLibrary();

  return useMemo(
    () => ({
      menuConfig: { rail: [{ items: [home, inbox, agents, flows, library] }] },
      manualMenuItems: [workspaceRailSettings],
    }),
    [home, inbox, agents, flows, library],
  );
}
