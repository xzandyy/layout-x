import type { ReactNode } from "react";

/**
 * 折叠态 tooltip 的配置，映射到 Sidebar.MenuItem 的 tooltipProps（Sidebar.Tooltip）。
 * 当 Sidebar 折叠为 icon-only 时，Pro 会将此配置渲染为悬浮提示。
 */
export type TooltipConfig = {
  /** Tooltip 内容，可传任意 ReactNode */
  content: ReactNode;
  /** 附加在 Tooltip 容器上的 className */
  className?: string;
  /** 显示前延迟（ms） */
  delay?: number;
  /** 隐藏前延迟（ms） */
  closeDelay?: number;
  /** Tooltip 弹出方向，默认 "right"（Pro 文档默认值） */
  placement?: "top" | "bottom" | "left" | "right";
};

/**
 * 单个菜单项节点，递归支持子项（通过 children 挂 Sidebar.Submenu）。
 *
 * 映射关系：
 *   icon     → Sidebar.MenuIcon（ReactNode）
 *   label    → Sidebar.MenuLabel（ReactNode）
 *   chip     → Sidebar.MenuChip（ReactNode）
 *   actions  → Sidebar.MenuActions（ReactNode）
 *   tooltip  → Sidebar.MenuItem tooltipProps（悬浮显示）
 *   href     → Sidebar.MenuItem href（Provider navigate 路由）
 *   children → Sidebar.Submenu；Pro 自动加 MenuTrigger + MenuIndicator
 *   onPress  → Sidebar.MenuItem onAction（RAC TreeItem 事件），与 href 可并存
 */
export type SidebarMenuItemNode = {
  /** 图标 */
  icon?: ReactNode;
  /** 菜单项文字 */
  label: ReactNode;
  /** 右侧始终可见 */
  chip?: ReactNode;
  /** 右侧悬浮可见 */
  actions?: ReactNode;
  /** 悬浮 tooltip 配置 */
  tooltip?: TooltipConfig;
  /** 点击跳转的路径 */
  href?: string;
  /** 子菜单项；有值时 Pro 渲染 Sidebar.Submenu 并自动添加展开/折叠触发器 */
  children?: SidebarMenuItemNode[];
  /**
   * 菜单项被按下时的回调（映射到 RAC TreeItem onAction）。
   * 与 href 可并存：onPress 先执行，之后 Pro 触发 navigate。
   */
  onPress?: () => void;
};

/**
 * 横向分隔线节点，映射到 Sidebar.Separator。
 */
export type SidebarSeparatorNode = {
  type: "separator";
};

/**
 * 分组节点，映射到 Sidebar.Group + Sidebar.Menu。
 * label 存在时额外渲染 Sidebar.GroupLabel（折叠态自动隐藏）。
 */
export type SidebarGroupNode = {
  type: "group";
  /** 可选分组标题；省略则只渲染 Sidebar.Group 不加 GroupLabel */
  label?: ReactNode;
  /** 该分组下的菜单项列表 */
  menu: SidebarMenuItemNode[];
};

/**
 * content.nodes 中允许出现的节点类型联合。
 */
export type SidebarNode = SidebarSeparatorNode | SidebarGroupNode;

/**
 * Sidebar.Content 区的内容配置。
 * nodes 为有序节点数组，渲染时按顺序 switch 分发。
 */
export type SidebarContentConfig = {
  nodes: SidebarNode[];
};

/**
 * ConfigSidebar 组件的 props。
 *
 * header / footer 作为 ReactNode 插槽，分别映射到 Sidebar.Header / Sidebar.Footer。
 * Provider 级选项（defaultOpen / variant / collapsible 等）本迭代不在此暴露，
 * 由组件内部写定默认值；后续按需作为顶层字段加进来。
 */
export type ConfigSidebarProps = {
  /** 渲染进 Sidebar.Header 的内容 */
  header?: ReactNode;
  /** 渲染进 Sidebar.Footer 的内容 */
  footer?: ReactNode;
  /** 可滚动内容区配置 */
  content: SidebarContentConfig;
  /** 紧挨侧栏的主内容区，渲染进 Sidebar.Main */
  main: ReactNode;
};
