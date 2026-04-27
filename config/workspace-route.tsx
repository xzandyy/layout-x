import {
  Book,
  CheckDouble,
  Envelope,
  FaceRobot,
  FileText,
  FolderFlows,
  Gear,
  House,
} from "@gravity-ui/icons";

import type { RouteConfig } from "@/components/layout-x";

export const workspaceRoute: RouteConfig = {
  defaultEntryId: "home",
  entries: [
    {
      id: "home",
      label: "Home",
      icon: <House />,
      sidebar: {
        nodes: [
          {
            type: "group",
            label: "Overview",
            menu: [
              {
                icon: <House />,
                label: "Home",
                href: "/",
              },
            ],
          },
        ],
      },
    },
    {
      id: "inbox",
      label: "Inbox",
      icon: <Envelope />,
      sidebar: {
        nodes: [
          {
            type: "group",
            label: "Inbox",
            menu: [
              {
                icon: <Envelope />,
                label: "Inbox",
                href: "/inbox",
              },
              {
                icon: <CheckDouble />,
                label: "Review",
                href: "/inbox/review",
              },
            ],
          },
        ],
      },
    },
    {
      id: "agents",
      label: "Agents",
      icon: <FaceRobot />,
      sidebar: {
        nodes: [
          {
            type: "group",
            label: "Agents",
            menu: [
              {
                icon: <FaceRobot />,
                label: "Overview",
                href: "/agents",
              },
            ],
          },
        ],
      },
    },
    {
      id: "workflows",
      label: "Flows",
      icon: <FolderFlows />,
      sidebar: {
        nodes: [
          {
            type: "group",
            label: "Workflows",
            menu: [
              {
                icon: <FolderFlows />,
                label: "All",
                children: [
                  {
                    icon: <FolderFlows />,
                    label: "Board",
                    href: "/workflows",
                  },
                  {
                    icon: <FolderFlows />,
                    label: "Lead → CRM",
                    href: "/workflows/lead-crm",
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: "library",
      label: "Library",
      icon: <Book />,
      sidebar: {
        nodes: [
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
                    href: "/library",
                  },
                  {
                    icon: <FileText />,
                    label: "Playbooks",
                    href: "/library/playbooks",
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: "integrations",
      label: "Settings",
      icon: <Gear />,
      sidebar: {
        nodes: [
          {
            type: "group",
            label: "Settings",
            menu: [
              {
                icon: <Gear />,
                label: "Integrations",
                href: "/integrations",
              },
            ],
          },
        ],
      },
    },
  ],
};
