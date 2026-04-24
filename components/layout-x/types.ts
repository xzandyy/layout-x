import type { ReactNode } from "react";
import type { Router } from "@/config/routes";

// ---------------------------------------------------------------------------
// 菜单节点类型（LayoutX.SidebarMain 的 content 配置）
// ---------------------------------------------------------------------------

/**
 * 折叠态 tooltip 配置，映射到 Sidebar.MenuItem 的 tooltipProps。
 * 侧栏折叠为 icon-only 时 Pro 将此配置渲染为悬浮提示。
 */
export type TooltipConfig = {
  /** Tooltip 内容 */
  content: ReactNode;
  /** 附加在 Tooltip 容器上的 className */
  className?: string;
  /** 显示前延迟（ms） */
  delay?: number;
  /** 隐藏前延迟（ms） */
  closeDelay?: number;
  /** 弹出方向，默认 "right" */
  placement?: "top" | "bottom" | "left" | "right";
};

/**
 * 单个菜单项，递归支持子项（children → Sidebar.Submenu）。
 *
 * 映射关系：
 *   icon     → Sidebar.MenuIcon
 *   label    → Sidebar.MenuLabel
 *   chip     → Sidebar.MenuChip
 *   actions  → Sidebar.MenuActions（ReactNode，调用方用 Sidebar.MenuAction 绑定事件）
 *   tooltip  → Sidebar.MenuItem tooltipProps（折叠态）
 *   href     → Sidebar.MenuItem href（Provider navigate 路由）
 *   children → Sidebar.Submenu；Pro 自动加 MenuTrigger + MenuIndicator
 *   onPress  → Sidebar.MenuItem onAction（RAC TreeItem），与 href 可并存
 */
export type SidebarMenuItemNode = {
  icon?: ReactNode;
  label: ReactNode;
  chip?: ReactNode;
  actions?: ReactNode;
  tooltip?: TooltipConfig;
  href?: string;
  children?: SidebarMenuItemNode[];
  onPress?: () => void;
};

/** 横向分隔线节点，映射到 Sidebar.Separator */
export type SidebarSeparatorNode = {
  type: "separator";
};

/**
 * 分组节点，映射到 Sidebar.Group + Sidebar.Menu。
 * label 存在时额外渲染 Sidebar.GroupLabel（折叠态自动隐藏）。
 */
export type SidebarGroupNode = {
  type: "group";
  /** 可选分组标题；省略则不渲染 GroupLabel */
  label?: ReactNode;
  menu: SidebarMenuItemNode[];
};

/** SidebarMain 的 content.nodes 中允许出现的节点类型联合 */
export type SidebarNode = SidebarSeparatorNode | SidebarGroupNode;

/**
 * 传给 `LayoutX.SidebarMain` 的 `content` prop 类型。
 * nodes 有序渲染，按类型 switch 分发到对应 Pro 组件。
 */
export type SidebarContentConfig = {
  nodes: SidebarNode[];
};

// ---------------------------------------------------------------------------
// LayoutX 组件 props 类型
// ---------------------------------------------------------------------------

/** LayoutX 根组件（含 Sidebar.Provider）props */
export type LayoutXProps = {
  /** 顶栏高度（rem），影响 ContentHeader 的 minHeight */
  headerHeight?: number;
  /** Rail 最窄宽度（rem） */
  railWidth?: number;
  className?: string;
  children: ReactNode;
};

/** Rail 区域、SidebarHeader/Footer 等通用区域 props */
export type LayoutXRegionProps = {
  className?: string;
  children?: ReactNode;
};

/** LayoutX.SidebarMain props：在 `children` 基础上新增 `content` 驱动菜单树 */
export type LayoutXSidebarMainProps = {
  className?: string;
  children?: ReactNode;
  /**
   * 配置化菜单内容；与 `children` 可并存，先渲染 content 再渲染 children。
   * 省略时仅渲染 children（手写模式）。
   */
  content?: SidebarContentConfig;
};

/** LayoutX.ContentHeader props */
export type LayoutXContentHeaderProps = {
  className?: string;
  /**
   * 顶栏左侧面包屑对应的路由树（来自 @/config/routes）。
   * 不传则不渲染面包屑。
   */
  breadcrumbRoute?: Router;
  /** 顶栏右侧自由区域，如操作按钮、搜索框 */
  end?: ReactNode;
};

/** LayoutX context 值，供 Rail / ContentHeader 读取尺寸 */
export type LayoutXContextValue = {
  headerHeight: number;
  railWidth: number;
};
