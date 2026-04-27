import type { ReactNode } from "react";
import type { Router } from "@/config/routes";

// ---------------------------------------------------------------------------
// 菜单节点（SidebarContentConfig，由 RouteEntry.sidebar 等传入）
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

type SidebarMenuItemBase = {
  icon?: ReactNode;
  label: ReactNode;
  chip?: ReactNode;
  actions?: ReactNode;
  tooltip?: TooltipConfig;
  onPress?: () => void;
};

/**
 * 叶子项：可带 `href` 导航，**无**子菜单（无 `children`）。
 */
export type SidebarMenuItemLeaf = SidebarMenuItemBase & {
  href?: string;
  children?: never;
};

/**
 * 分支项：有 `children` 时**禁止** `href`（仅用于展开/收起子菜单，不导航）。
 */
export type SidebarMenuItemBranch = SidebarMenuItemBase & {
  children: SidebarMenuItemNode[];
  href?: never;
};

/**
 * 菜单项；叶子与分支二选一，保证「有子菜单则无 href」。
 */
export type SidebarMenuItemNode = SidebarMenuItemLeaf | SidebarMenuItemBranch;

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

/** SidebarContentConfig 的 `nodes` 中允许出现的节点类型联合 */
export type SidebarNode = SidebarSeparatorNode | SidebarGroupNode;

/**
 * 侧栏配置树根；`RouteEntry.sidebar` 持有此类型。
 * nodes 有序渲染，在 menu-tree 中按类型分发给 Pro 组件。
 */
export type SidebarContentConfig = {
  nodes: SidebarNode[];
};

// ---------------------------------------------------------------------------
// Route（Rail 入口 + 每个入口绑定的 Sidebar 内容）
// ---------------------------------------------------------------------------

/**
 * 一个 Rail 入口（图标 + 绑定的侧栏内容）。
 * 点击仅切换当前展示的 sidebar，不导航（由 `LayoutXContext.setActiveEntryId` 表示）。
 * URL 上应高亮/激活哪个 entry：由 `sidebar` 中叶子 `href` 在实现层推导，本类型不声明单独 match 字段。
 */
export type RouteEntry = {
  id: string;
  icon: ReactNode;
  label: ReactNode;
  tooltip?: TooltipConfig;
  sidebar: SidebarContentConfig;
};

/**
 * 整合配置：多入口 Rail 与各自侧栏内容。
 * 由 `LayoutX` 根传入，经 Context 分发给 `LayoutX.RailMain` / `LayoutX.SidebarMain`。
 */
export type RouteConfig = {
  entries: RouteEntry[];
  /**
   * 当 pathname 无法与任一 entry 的 `sidebar` 叶子 `href` 匹配时的兜底 `entry.id`。
   * 省略则回退为 `entries[0]?.id`。
   */
  defaultEntryId?: string;
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
  /**
   * 侧栏宽度（rem），对应 Pro `Sidebar` 的 `--sidebar-width`（文档默认 240px ≈ 15rem）。本布局不启用侧栏折叠，不设 `--sidebar-width-collapsed`。
   * @see https://docs-prod.heroui.pro/docs/react/components/sidebar#css-variables
   */
  sidebarWidth?: number;
  className?: string;
  /**
   * Rail 入口 + 各入口侧栏内容；与 Context 中 `activeEntry` / `setActiveEntryId` 配合使用。
   */
  route?: RouteConfig;
  children: ReactNode;
};

/** Rail 区域、SidebarHeader/Footer 等通用区域 props */
export type LayoutXRegionProps = {
  className?: string;
  children?: ReactNode;
};

/** LayoutX.SidebarMain props：菜单树由根 `route` 与当前 `activeEntry.sidebar` 驱动；`children` 附加在配置菜单之后。 */
export type LayoutXSidebarMainProps = {
  className?: string;
  children?: ReactNode;
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

/** LayoutX context：尺寸 + 可选的 route 与当前激活 entry（hybrid：URL 推断 + 用户点 Rail 覆盖） */
export type LayoutXContextValue = {
  headerHeight: number;
  railWidth: number;
  /**
   * 侧栏宽度（rem），与 Pro `Sidebar` 的 `--sidebar-width` 一致。
   */
  sidebarWidth: number;
  /** 根传入的 `route`（若有） */
  route?: RouteConfig;
  /** 当前激活的 entry id；无 `route` 时为 `undefined` */
  activeEntryId?: string;
  /** 当前激活的 entry 对象 */
  activeEntry?: RouteEntry;
  /** 用户点击 Rail 图标切换 entry（在下次 pathname 变化时由实现重置与 URL 对齐） */
  setActiveEntryId: (id: string) => void;
};
