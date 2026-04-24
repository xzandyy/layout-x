"use client";

import { Sidebar } from "@heroui-pro/react";
import type {
  SidebarContentConfig,
  SidebarGroupNode,
  SidebarMenuItemNode,
  SidebarNode,
  TooltipConfig,
} from "./types";

// ---------------------------------------------------------------------------
// Path helpers
// ---------------------------------------------------------------------------

/**
 * 规范化路径：
 * - 移除 hash / query，只保留纯路径
 * - 合并连续斜杠
 * - 保证以 "/" 开头，无尾斜杠（根路径除外）
 */
function normalize(p: string): string {
  if (!p) return "/";
  p = p.split("#")[0]!.split("?")[0]!;
  p = p.replace(/\/{2,}/g, "/");
  if (!p.startsWith("/")) p = "/" + p;
  if (p !== "/" && p.endsWith("/")) p = p.replace(/\/+$/, "");
  if (!p) return "/";
  return p;
}

/**
 * 判断 href 是否对应当前「页面」以用于 isCurrent 高亮。
 * 仅做**路径完全相等**（归一化后），**不做**前缀匹配，避免父级（如 /products）与
 * 子级（/products/phones）同时高亮；子菜单展开由 Tree/Sidebar 根据选中子项处理。
 * 外链永远 false。
 */
export function isCurrentHref(pathname: string, href: string): boolean {
  if (href.startsWith("http://") || href.startsWith("https://")) return false;
  const normPath = normalize(pathname);
  const normHref = normalize(href);
  return normPath === normHref;
}

function buildTooltipProps(tooltip: TooltipConfig) {
  return {
    content: tooltip.content,
    className: tooltip.className,
    delay: tooltip.delay,
    closeDelay: tooltip.closeDelay,
    placement: tooltip.placement ?? "right",
  } as const;
}

// ---------------------------------------------------------------------------
// Recursive item renderer
// ---------------------------------------------------------------------------

function MenuItem({
  node,
  pathname,
}: {
  node: SidebarMenuItemNode;
  pathname: string;
}) {
  const { icon, label, chip, actions, tooltip, href, children, onPress } = node;
  const isCurrent = href ? isCurrentHref(pathname, href) : false;
  const hasSubmenu = children && children.length > 0;

  return (
    <Sidebar.MenuItem
      href={href}
      isCurrent={isCurrent}
      onAction={onPress}
      tooltipProps={tooltip ? buildTooltipProps(tooltip) : undefined}
    >
      <Sidebar.MenuItemContent>
        {icon && <Sidebar.MenuIcon>{icon}</Sidebar.MenuIcon>}
        <Sidebar.MenuLabel>{label}</Sidebar.MenuLabel>
        {chip && <Sidebar.MenuChip>{chip}</Sidebar.MenuChip>}
        {actions && <Sidebar.MenuActions>{actions}</Sidebar.MenuActions>}
        {hasSubmenu && (
          <Sidebar.MenuTrigger>
            <Sidebar.MenuIndicator />
          </Sidebar.MenuTrigger>
        )}
      </Sidebar.MenuItemContent>

      {hasSubmenu && (
        <Sidebar.Submenu>
          {children.map((child, i) => (
            <MenuItem key={i} node={child} pathname={pathname} />
          ))}
        </Sidebar.Submenu>
      )}
    </Sidebar.MenuItem>
  );
}

function GroupNode({
  node,
  pathname,
}: {
  node: SidebarGroupNode;
  pathname: string;
}) {
  return (
    <Sidebar.Group>
      {node.label && <Sidebar.GroupLabel>{node.label}</Sidebar.GroupLabel>}
      <Sidebar.Menu>
        {node.menu.map((item, i) => (
          <MenuItem key={i} node={item} pathname={pathname} />
        ))}
      </Sidebar.Menu>
    </Sidebar.Group>
  );
}

function SidebarContentNode({
  node,
  pathname,
}: {
  node: SidebarNode;
  pathname: string;
}) {
  switch (node.type) {
    case "separator":
      return <Sidebar.Separator />;
    case "group":
      return <GroupNode node={node} pathname={pathname} />;
  }
}

// ---------------------------------------------------------------------------
// Public: MenuTree
// ---------------------------------------------------------------------------

/**
 * 将 `SidebarContentConfig` 渲染为 Pro Sidebar 菜单节点树。
 * 由 `LayoutX.SidebarMain` 在接收到 `content` prop 时内部调用，
 * 不需要外部单独使用。
 */
export function MenuTree({
  config,
  pathname,
}: {
  config: SidebarContentConfig;
  pathname: string;
}) {
  return (
    <>
      {config.nodes.map((node, i) => (
        <SidebarContentNode key={i} node={node} pathname={pathname} />
      ))}
    </>
  );
}
