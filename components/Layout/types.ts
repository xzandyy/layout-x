import type { ReactNode } from "react";
import workspacePathsJson from "@/config/workspace-paths.json";

export type MenuConfig = {
  rail: RailMenuConfig[];
};

export type RailMenuConfig = {
  items: RailMenuItem[];
};

export type RailMenuItem = {
  icon: ReactNode;
  label: ReactNode;
  sidebar: SidebarMenuConfig;
};

export type SidebarMenuConfig = {
  items: SidebarMenuItem[];
};

export type SidebarMenuItem =
  | SidebarSeparatorItem
  | SidebarGroupItem
  | SidebarCustomItem;

export type SidebarSeparatorItem = {
  type: "separator";
};

export type SidebarGroupItem = {
  type: "group";
  label?: ReactNode;
  menu: SidebarMenuItemNode[];
};

export type SidebarCustomItem = {
  type: "custom";
  content: ReactNode;
};

export type SidebarMenuItemNode = SidebarNavItem | SidebarSubmenu;

type SidebarMenuItemBase = {
  icon?: ReactNode;
  label: ReactNode;
  chip?: ReactNode;
  actions?: ReactNode;
  tooltip?: TooltipConfig;
  onPress?: () => void;
};

export type SidebarSubmenu = SidebarMenuItemBase & {
  children: SidebarMenuItemNode[];
  href?: never;
};

export type SidebarNavItem = SidebarMenuItemBase & {
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

// -- 路径树（生成自 create-workspace-paths） -- //

export type Paths = {
  path: string;
  title: string;
  hasPage?: boolean;
  children?: Paths[];
};

export const workspacePaths = workspacePathsJson as Paths;
