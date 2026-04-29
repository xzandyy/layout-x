"use client";

import { useMemo } from "react";

import type { MenuConfig } from "@/components/Layout";

import { useMenuAgents } from "./use-menu-agents";
import { useMenuFlows } from "./use-menu-flows";
import { useMenuHome } from "./use-menu-home";
import { useMenuInbox } from "./use-menu-inbox";
import { useMenuLibrary } from "./use-menu-library";

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
