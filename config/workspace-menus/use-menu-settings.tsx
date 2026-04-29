"use client";

import { Gear } from "@gravity-ui/icons";
import { useMemo } from "react";

import type { RailMenuItem } from "@/components/Layout";

/** Footer Rail「Settings」项（RailMenuItem 引用需在挂载侧保持稳定）。 */
export function useMenuSettings(): RailMenuItem {
  return useMemo(() => createMenuSettings(), []);
}

export function createMenuSettings(): RailMenuItem {
  return {
    label: "Settings",
    icon: <Gear />,
    sidebar: {
      items: [
        {
          type: "group",
          label: "Settings",
          menu: [
            {
              icon: <Gear />,
              label: "Integrations",
              href: "/workspace/integrations",
            },
          ],
        },
      ],
    },
  };
}
