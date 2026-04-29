"use client";

import { Book, FileText } from "@gravity-ui/icons";
import { useMemo } from "react";

import type { RailMenuItem } from "@/components/Layout";

export function useMenuLibrary(): RailMenuItem {
  return useMemo(() => createMenuLibrary(), []);
}

export function createMenuLibrary(): RailMenuItem {
  return {
    label: "Library",
    icon: <Book />,
    sidebar: {
      items: [
        {
          type: "group",
          label: "Library",
          menu: [
            {
              icon: <Book />,
              label: "Catalog",
              children: [
                {
                  icon: <Book />,
                  label: "Main",
                  href: "/workspace/library",
                },
                {
                  icon: <FileText />,
                  label: "Playbooks",
                  href: "/workspace/library/playbooks",
                },
              ],
            },
          ],
        },
      ],
    },
  };
}
