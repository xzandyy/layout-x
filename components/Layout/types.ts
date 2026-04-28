import type { ReactNode } from "react";
import appRouterJson from "@/config/routes.json";

export type RouteConfig = {
  rail: RailMenuConfig[];
  defaultRailItemId?: string;
  defaultSidebarItemId?: string;
};

export type RailMenuConfig = {
  items: RailMenuItem[];
};

export type RailMenuItem = {
  id: string;
  icon: ReactNode;
  label: ReactNode;
  sidebar: SidebarMenuConfig;
};

export type SidebarMenuConfig = {
  items: SidebarMenuItem[];
};

export type SidebarMenuItem = SidebarSeparatorItem | SidebarGroupItem;

export type SidebarSeparatorItem = {
  type: "separator";
};

export type SidebarGroupItem = {
  type: "group";
  label?: ReactNode;
  menu: SidebarMenuItemNode[];
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
