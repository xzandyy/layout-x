"use client";

import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@heroui-pro/react";
import type {
  ConfigSidebarProps,
  SidebarGroupNode,
  SidebarMenuItemNode,
  SidebarNode,
  TooltipConfig,
} from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * 规范化路径，增强版：
 * - 保证开头有单一斜杠
 * - 去除末尾所有多余斜杠（除根路径外）
 * - 合并连续的斜杠为一个
 * - 去除路径中的 hash/query/fragment（仅保留纯路径部分）
 */
function normalize(p: string) {
  if (!p) return "/";
  // 移除 hash、query（仅保留纯路径部分）
  p = p.split("#")[0].split("?")[0];

  // 合并连续斜杠为单一斜杠
  p = p.replace(/\/{2,}/g, "/");

  // 保证开头有单一斜杠
  if (!p.startsWith("/")) p = "/" + p;

  // 移除结尾所有斜杠（除非是根路径“/”）
  if (p !== "/" && p.endsWith("/")) p = p.replace(/\/+$/, "");

  // 万一清理后变空
  if (!p) return "/";

  return p;
}

/**
 * 判断某个 href 是否是当前路径。
 * 策略：完整相等，或者当前路径以 href + "/" 开头（前缀匹配子路由）。
 * 根路由"/"单独处理：只有路径恰好为"/"时才匹配，避免将所有路径都标记为 current。
 */
function isCurrentHref(pathname: string, href: string): boolean {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return false; // 外链永远不视为 current
  }

  const normPath = normalize(pathname);
  const normHref = normalize(href);

  if (normHref === "/") return normPath === "/";
  return normPath === normHref || normPath.startsWith(normHref + "/");
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
// Recursive menu item renderer
// ---------------------------------------------------------------------------

interface MenuItemProps {
  node: SidebarMenuItemNode;
  pathname: string;
}

function MenuItem({ node, pathname }: MenuItemProps) {
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

// ---------------------------------------------------------------------------
// Group renderer
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Content node dispatcher
// ---------------------------------------------------------------------------

function ContentNode({
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
// ConfigSidebar
// ---------------------------------------------------------------------------

/**
 * 配置驱动的侧栏组件。
 *
 * 用法：
 *   <ConfigSidebar
 *     header={<MyLogo />}
 *     footer={<UserMenu />}
 *     content={sidebarConfig}
 *     main={<div>页面主体</div>}
 *   />
 *
 */
export function ConfigSidebar({
  header,
  footer,
  content,
  main,
}: ConfigSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Sidebar.Provider navigate={router.push}>
      <Sidebar>
        {header && <Sidebar.Header>{header}</Sidebar.Header>}

        <Sidebar.Content>
          {content.nodes.map((node, i) => (
            <ContentNode key={i} node={node} pathname={pathname} />
          ))}
        </Sidebar.Content>

        {footer && <Sidebar.Footer>{footer}</Sidebar.Footer>}
      </Sidebar>

      <Sidebar.Main>{main}</Sidebar.Main>
    </Sidebar.Provider>
  );
}
