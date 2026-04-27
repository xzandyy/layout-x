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

import type { RouteConfig, SidebarContentConfig } from "@/components/layout-x";

/** Icons + sidebars aligned with the EasyX.AI Appkit six-area shell. */
const ic = "size-4 shrink-0 text-foreground/90";
const railIc = "size-5 shrink-0";

/** Home rail: only `/` (avoid duplicate leaf hrefs in other entries for URL → rail resolution). */
const homeSidebar: SidebarContentConfig = {
  nodes: [
    {
      type: "group",
      label: "Overview",
      menu: [
        {
          icon: <House className={ic} />,
          label: "Home",
          href: "/",
        },
      ],
    },
  ],
};

/** Inbox + Review */
const inboxSidebar: SidebarContentConfig = {
  nodes: [
    {
      type: "group",
      label: "Inbox",
      menu: [
        {
          icon: <Envelope className={ic} />,
          label: "Inbox",
          href: "/inbox",
        },
        {
          icon: <CheckDouble className={ic} />,
          label: "Review",
          href: "/inbox/review",
        },
      ],
    },
  ],
};

const agentsSidebar: SidebarContentConfig = {
  nodes: [
    {
      type: "group",
      label: "Agents",
      menu: [
        {
          icon: <FaceRobot className={ic} />,
          label: "Overview",
          href: "/agents",
        },
      ],
    },
  ],
};

/** Workflows + Lead → CRM */
const workflowsSidebar: SidebarContentConfig = {
  nodes: [
    {
      type: "group",
      label: "Workflows",
      menu: [
        {
          icon: <FolderFlows className={ic} />,
          label: "All",
          children: [
            {
              icon: <FolderFlows className={ic} />,
              label: "Board",
              href: "/workflows",
            },
            {
              icon: <FolderFlows className={ic} />,
              label: "Lead → CRM",
              href: "/workflows/lead-crm",
            },
          ],
        },
      ],
    },
  ],
};

/** Library + Playbooks */
const librarySidebar: SidebarContentConfig = {
  nodes: [
    {
      type: "group",
      label: "Library",
      menu: [
        {
          icon: <Book className={ic} />,
          label: "Catalog",
          children: [
            {
              icon: <Book className={ic} />,
              label: "Main",
              href: "/library",
            },
            {
              icon: <FileText className={ic} />,
              label: "Playbooks",
              href: "/library/playbooks",
            },
          ],
        },
      ],
    },
  ],
};

const integrationsSidebar: SidebarContentConfig = {
  nodes: [
    {
      type: "group",
      label: "Settings",
      menu: [
        {
          icon: <Gear className={ic} />,
          label: "Integrations",
          href: "/integrations",
        },
      ],
    },
  ],
};

/** Six rail entries + per-entry sidebars; active rail from leaf `href` (see `sidebar-routing`). */
export const workspaceRoute: RouteConfig = {
  defaultEntryId: "home",
  entries: [
    {
      id: "home",
      label: "Home",
      icon: <House className={railIc} />,
      sidebar: homeSidebar,
    },
    {
      id: "inbox",
      label: "Inbox",
      icon: <Envelope className={railIc} />,
      sidebar: inboxSidebar,
    },
    {
      id: "agents",
      label: "Agents",
      icon: <FaceRobot className={railIc} />,
      sidebar: agentsSidebar,
    },
    {
      id: "workflows",
      label: "Flows",
      icon: <FolderFlows className={railIc} />,
      sidebar: workflowsSidebar,
    },
    {
      id: "library",
      label: "Library",
      icon: <Book className={railIc} />,
      sidebar: librarySidebar,
    },
    {
      id: "integrations",
      label: "Settings",
      icon: <Gear className={railIc} />,
      sidebar: integrationsSidebar,
    },
  ],
};
