"use client";

import { Gear } from "@gravity-ui/icons";

import type { RailMenuItem } from "@/components/Layout";

export const workspaceRailSettings: RailMenuItem = {
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
