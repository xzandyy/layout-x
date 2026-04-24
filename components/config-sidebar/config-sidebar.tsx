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
 * 判断某个 href 是否是当前路径。
 * 策略：完整相等，或者当前路径以 href + "/" 开头（前缀匹配子路由）。
 * 根路由"/"单独处理：只有路径恰好为"/"时才匹配，避免将所有路径都标记为 current。
 */
function isCurrentHref(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
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
  const {
    icon,
    label,
    chip,
    actions,
    tooltip,
    href,
    children,
    onPress,
  } = node;

  const isCurrent = href ? isCurrentHref(pathname, href) : false;

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
        {/* MenuTrigger + MenuIndicator are auto-injected by Pro when children exist */}
      </Sidebar.MenuItemContent>

      {children && children.length > 0 && (
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
 * Provider 级默认值：
 *   collapsible="icon"  — 折叠为 icon-only rail
 *   variant="sidebar"   — 默认贴边样式
 *
 * navigate 由内部 useRouter().push 注入；isCurrent 由内部 usePathname() 自动派生。
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
    <Sidebar.Provider navigate={router.push} collapsible="icon">
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
