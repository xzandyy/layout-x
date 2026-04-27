import type { ReactNode } from "react";
import appRouterJson from "../../config/routes.json";

export type RouteConfig = {
  entries: RailMenuItem[];
  defaultEntryId?: string;
};

export type RailMenuItem = {
  id: string;
  icon: ReactNode;
  label: ReactNode;
  tooltip?: TooltipConfig;
  sidebar: SidebarMenuConfig;
};

export type SidebarMenuConfig = {
  nodes: SidebarNode[];
};

export type SidebarNode = SidebarSeparatorNode | SidebarGroupNode;

export type SidebarGroupNode = {
  type: "group";
  label?: ReactNode;
  menu: SidebarMenuItemNode[];
};

export type SidebarSeparatorNode = {
  type: "separator";
};

export type SidebarMenuItemNode = SidebarMenuItemLeaf | SidebarMenuItemBranch;

type SidebarMenuItemBase = {
  icon?: ReactNode;
  label: ReactNode;
  chip?: ReactNode;
  actions?: ReactNode;
  tooltip?: TooltipConfig;
  onPress?: () => void;
};

export type SidebarMenuItemBranch = SidebarMenuItemBase & {
  children: SidebarMenuItemNode[];
  href?: never;
};

export type SidebarMenuItemLeaf = SidebarMenuItemBase & {
  href?: string;
  children?: never;
};

export type TooltipConfig = {
  content: ReactNode;
  className?: string;
  delay?: number;
  closeDelay?: number;
  placement?: "top" | "bottom" | "left" | "right";
};

// -- 所有路径 -- //

export type Router = {
  path: string;
  title: string;
  hasPage?: boolean;
  children?: Router[];
};

export const appRouter = appRouterJson as Router;
