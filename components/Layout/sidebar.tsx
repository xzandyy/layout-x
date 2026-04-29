"use client";

import { useCallback, useMemo, useState, type CSSProperties } from "react";
import type { Key } from "react-aria-components";
import { Heading } from "react-aria-components";
import { usePathname } from "next/navigation";
import { Sidebar as HeroSidebar } from "@heroui-pro/react";
import { cn } from "@/lib/utils";
import { type LayoutChild, renderLayoutChild, useLayout } from "./context";
import type {
  SidebarCustomItem,
  SidebarGroupItem,
  SidebarMenuItem,
  SidebarMenuConfig,
  SidebarMenuItemNode,
  TooltipConfig,
} from "./types";
import {
  isExternalHref,
  itemHasChildren,
  normalizePath,
} from "./utils";

export {
  findActiveSidebarNavItem,
  findBestRailMenuForPathname,
  findGlobalActiveLeafNorm,
  getActiveLeafNormForConfig,
} from "./utils";

// -- Sidebar -- //

export type SidebarProps = {
  className?: string;
  children?: LayoutChild;
};

export function Sidebar({ className, children }: SidebarProps) {
  const ctx = useLayout();
  const resolvedChildren = renderLayoutChild(children, ctx);
  const { rootState, railState } = ctx;
  const { sidebarWidth } = rootState;
  const { mobileRailSlot } = railState;
  const sidebarVars = useMemo(
    () =>
      ({
        "--sidebar-width": `${sidebarWidth}rem`,
      }) as CSSProperties,
    [sidebarWidth],
  );
  return (
    <>
      <HeroSidebar
        className={cn(
          "bg-canvas border-none shadow-none pl-2 md:pr-2",
          className,
        )}
        style={sidebarVars}
      >
        {resolvedChildren}
      </HeroSidebar>
      <HeroSidebar.Mobile>
        <Heading slot="title" className="sr-only">
          Sidebar
        </Heading>
        {mobileRailSlot != null ? (
          <div className="flex h-svh max-h-svh min-h-0 w-full flex-row overflow-hidden bg-canvas">
            {mobileRailSlot}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-canvas pr-2">
              {resolvedChildren}
            </div>
          </div>
        ) : (
          resolvedChildren
        )}
      </HeroSidebar.Mobile>
    </>
  );
}

// -- Sidebar Header -- //

export type SidebarHeaderProps = {
  className?: string;
  children?: LayoutChild;
};

export function SidebarHeader({ className, children }: SidebarHeaderProps) {
  const ctx = useLayout();
  const { sidebarHeaderPortalMounts, setSidebarHeaderAnchor } = ctx.slotState;
  const defaultTrailing = renderLayoutChild(children, ctx);
  const portalOpen = sidebarHeaderPortalMounts > 0;
  const hasNoSlot = !portalOpen;

  return (
    <HeroSidebar.Header className={cn("p-0", className)}>
      {!portalOpen && defaultTrailing != null ? (
        <div className="w-full min-w-0">{defaultTrailing}</div>
      ) : null}
      <div
        ref={setSidebarHeaderAnchor}
        className={cn(
          "w-full min-h-0 min-w-0",
          hasNoSlot &&
            "pointer-events-none size-0 min-h-0 min-w-0 overflow-hidden opacity-0",
        )}
        aria-hidden={hasNoSlot}
      />
    </HeroSidebar.Header>
  );
}

// -- Sidebar Footer -- //

export type SidebarFooterProps = {
  className?: string;
  children?: LayoutChild;
};

export function SidebarFooter({ className, children }: SidebarFooterProps) {
  const ctx = useLayout();
  return (
    <HeroSidebar.Footer className={cn("p-0", className)}>
      {renderLayoutChild(children, ctx)}
    </HeroSidebar.Footer>
  );
}

// -- Sidebar Main -- //

export type SidebarMainProps = {
  className?: string;
  children?: LayoutChild;
};

export function SidebarMain({ className, children }: SidebarMainProps) {
  const pathname = usePathname();
  const ctx = useLayout();
  const sidebar = ctx.rootState.activeRailMenu?.sidebar;
  return (
    <HeroSidebar.Content className={cn("p-0", className)}>
      {sidebar && <MenuTree config={sidebar} pathname={pathname} />}
      {renderLayoutChild(children, ctx)}
    </HeroSidebar.Content>
  );
}

// -- MenuTree -- //

function MenuTree({
  config,
  pathname,
}: {
  config: SidebarMenuConfig;
  pathname: string;
}) {
  const globalActiveLeafNorm = useLayout().rootState.activeNavItemHref;
  const activeRoute = useMemo(
    () => resolveActiveRoute(config, globalActiveLeafNorm),
    [config, globalActiveLeafNorm],
  );

  const { getExpandedForGroup, handleExpandedChange } = useMenuExpansion({
    pathname,
    requiredBranchIds: activeRoute.branchIds,
  });

  return (
    <>
      {config.items.map((node, i) => (
        <MenuNode
          key={i}
          node={node}
          groupIndex={i}
          activeRoute={activeRoute}
          expandedKeys={getExpandedForGroup(i)}
          onExpandedChange={(keys) => handleExpandedChange(i, keys)}
        />
      ))}
    </>
  );
}

function MenuNode({
  node,
  ...rest
}: {
  node: SidebarMenuItem;
  groupIndex: number;
  activeRoute: ActiveRoute;
  expandedKeys: Set<string>;
  onExpandedChange: (keys: Set<Key> | "all") => void;
}) {
  if (node.type === "separator") return <HeroSidebar.Separator />;
  if (node.type === "custom") return <CustomSlot node={node} />;
  return <GroupNode node={node} {...rest} />;
}

function CustomSlot({ node }: { node: SidebarCustomItem }) {
  return <div className="contents">{node.content}</div>;
}

function GroupNode({
  node,
  groupIndex,
  activeRoute,
  expandedKeys,
  onExpandedChange,
}: {
  node: SidebarGroupItem;
  groupIndex: number;
  activeRoute: ActiveRoute;
  expandedKeys: Set<string>;
  onExpandedChange: (keys: Set<Key> | "all") => void;
}) {
  return (
    <HeroSidebar.Group>
      {node.label && (
        <HeroSidebar.GroupLabel className="text-fg-4 text-xs font-mono tracking-wider">
          {node.label}
        </HeroSidebar.GroupLabel>
      )}
      <HeroSidebar.Menu
        aria-label={ariaLabelForSidebarMenu(node, groupIndex)}
        expandedKeys={expandedKeys}
        onExpandedChange={onExpandedChange}
      >
        {node.menu.map((item, i) => (
          <MenuItem
            key={i}
            item={item}
            groupIndex={groupIndex}
            itemPath={[i]}
            activeLeafNorm={activeRoute.activeLeafNorm}
          />
        ))}
      </HeroSidebar.Menu>
    </HeroSidebar.Group>
  );
}

function MenuItem({
  item,
  groupIndex,
  itemPath,
  activeLeafNorm,
}: {
  item: SidebarMenuItemNode;
  groupIndex: number;
  itemPath: number[];
  activeLeafNorm: string | undefined;
}) {
  const { icon, label, chip, actions, tooltip, onPress } = item;
  const children = "children" in item ? item.children : undefined;
  const hasSubmenu = Boolean(children && children.length > 0);
  const href = hasSubmenu ? undefined : "href" in item ? item.href : undefined;
  const isCurrent = Boolean(
    href && activeLeafNorm && normalizePath(href) === activeLeafNorm,
  );

  return (
    <HeroSidebar.MenuItem
      id={getItemId(groupIndex, itemPath)}
      href={href}
      isCurrent={isCurrent}
      onAction={onPress}
      tooltipProps={tooltip ? toTooltipProps(tooltip) : undefined}
    >
      <HeroSidebar.MenuItemContent
        className={cn(
          "flex items-center gap-2 min-h-8 my-px",
          "px-2.5 py-1 rounded-md",
          "transition-all duration-150",
          isCurrent
            ? "bg-surface text-fg-1"
            : "bg-transparent text-fg-3 hover:bg-canvas-2 hover:text-fg-1",
        )}
      >
        {icon && (
          <HeroSidebar.MenuIcon
            className={cn(
              "[&>svg]:size-3.75",
              isCurrent ? "text-fg-1" : "text-fg-3",
            )}
          >
            {icon}
          </HeroSidebar.MenuIcon>
        )}

        <HeroSidebar.MenuLabel
          className={cn(
            "text-[0.8125rem]",
            isCurrent ? "text-fg-1" : "text-fg-3",
          )}
        >
          {label}
        </HeroSidebar.MenuLabel>
        {chip && <HeroSidebar.MenuChip>{chip}</HeroSidebar.MenuChip>}
        {actions && (
          <HeroSidebar.MenuActions>{actions}</HeroSidebar.MenuActions>
        )}
        {hasSubmenu && (
          <HeroSidebar.MenuTrigger>
            <HeroSidebar.MenuIndicator />
          </HeroSidebar.MenuTrigger>
        )}
      </HeroSidebar.MenuItemContent>

      {hasSubmenu && children != null && (
        <HeroSidebar.Submenu>
          {children.map((child, i) => (
            <MenuItem
              key={i}
              item={child}
              groupIndex={groupIndex}
              itemPath={[...itemPath, i]}
              activeLeafNorm={activeLeafNorm}
            />
          ))}
        </HeroSidebar.Submenu>
      )}
    </HeroSidebar.MenuItem>
  );
}

// ---------------------------------------------------------------------------
// 以下为侧栏菜单匹配 / 展开状态 / Hero 组件适配辅助
// ---------------------------------------------------------------------------

interface ActiveRoute {
  activeLeafNorm?: string;
  branchIds: string[];
}

interface DismissedState {
  forPath: string;
  keys: ReadonlySet<string>;
}

const EMPTY_SET: ReadonlySet<string> = new Set<string>();
const EMPTY_DISMISSED: DismissedState = { forPath: "", keys: EMPTY_SET };

/**
 * 同一菜单分组下所有 item id 的前缀，用于按分组隔离展开 keys。
 */
function getGroupIdPrefix(groupIndex: number): string {
  return `g${groupIndex}:`;
}

/**
 * 拼出菜单项的全局唯一 id：分组下标 + 项在树中的路径下标，便于跨层级定位。
 */
function getItemId(groupIndex: number, itemPath: readonly number[]): string {
  return `${getGroupIdPrefix(groupIndex)}${itemPath.join(".")}`;
}

/**
 * 给侧栏菜单计算可访问性 label：优先使用分组的 label，否则回退到「Menu group N」。
 */
function ariaLabelForSidebarMenu(
  node: SidebarGroupItem,
  groupIndex: number,
): string {
  const { label } = node;
  if (typeof label === "string" && label.trim() !== "") {
    return `${label} menu`;
  }
  return `Menu group ${groupIndex + 1}`;
}

/**
 * 把通用的 `TooltipConfig` 适配为 Hero 组件的 tooltip props，placement 缺省为 `right`。
 */
function toTooltipProps(tooltip: TooltipConfig) {
  return {
    content: tooltip.content,
    className: tooltip.className,
    delay: tooltip.delay,
    closeDelay: tooltip.closeDelay,
    placement: tooltip.placement ?? "right",
  } as const;
}

/**
 * 把 react-aria 的 `Iterable<Key>` 统一转成字符串集合，便于后续按前缀筛选与比对。
 */
function toStringSet(input: Iterable<Key>): Set<string> {
  const out = new Set<string>();
  for (const k of input) out.add(String(k));
  return out;
}

/**
 * 从字符串集合中筛出指定前缀的所有 key（用于按分组取出该组的展开状态）。
 */
function filterByPrefix(
  source: ReadonlySet<string>,
  prefix: string,
): Set<string> {
  const out = new Set<string>();
  for (const k of source) {
    if (k.startsWith(prefix)) out.add(k);
  }
  return out;
}

/**
 * 用 `nextGroupKeys` 替换 `source` 中所有以 `prefix` 开头的 key，其它分组的 key 保持不变。
 */
function replaceGroup(
  source: ReadonlySet<string>,
  prefix: string,
  nextGroupKeys: ReadonlySet<string>,
): Set<string> {
  const out = new Set<string>();
  for (const k of source) {
    if (!k.startsWith(prefix)) out.add(k);
  }
  for (const k of nextGroupKeys) out.add(k);
  return out;
}

/**
 * 根据用户最新展开状态，推算「在当前路径下被主动折叠」的分支集合，
 * 用以避免 URL 命中的分支被自动重新展开。
 */
function computeDismissed(
  prev: DismissedState,
  args: {
    pathname: string;
    prefix: string;
    nextGroupKeys: ReadonlySet<string>;
    requiredBranchIds: readonly string[];
  },
): DismissedState {
  const { pathname, prefix, nextGroupKeys, requiredBranchIds } = args;
  const base = prev.forPath === pathname ? prev.keys : EMPTY_SET;
  const next = new Set(base);
  for (const id of requiredBranchIds) {
    if (!id.startsWith(prefix)) continue;
    if (nextGroupKeys.has(id)) next.delete(id);
    else next.add(id);
  }
  return { forPath: pathname, keys: next };
}

/**
 * 在指定 sidebar 配置内，按 **目标 normHref**（已规范化）定位匹配的叶子项及其沿途分支 id。
 *
 * 与旧版「在本 config 内自挑最长匹配」不同：active 由调用方在更高层（跨所有 rail）裁决出
 * 唯一的 `targetLeafNorm` 后传入；本函数只负责在当前 config 中**精确**查找该 norm 对应的叶子。
 * 找不到则返回空的 `{ branchIds: [] }`。
 */
function resolveActiveRoute(
  config: SidebarMenuConfig,
  targetLeafNorm: string | undefined,
): ActiveRoute {
  if (!targetLeafNorm) return { branchIds: [] };

  let result: ActiveRoute = { branchIds: [] };
  let found = false;

  const visit = (
    items: readonly SidebarMenuItemNode[],
    groupIndex: number,
    pathSoFar: readonly number[],
    branchIdsSoFar: readonly string[],
  ) => {
    for (let i = 0; i < items.length; i++) {
      if (found) return;
      const item = items[i]!;
      const itemPath = [...pathSoFar, i];
      const itemId = getItemId(groupIndex, itemPath);
      const isBranch = itemHasChildren(item);

      if (isBranch) {
        visit(item.children, groupIndex, itemPath, [...branchIdsSoFar, itemId]);
        continue;
      }

      const href = "href" in item ? item.href : undefined;
      if (!href || isExternalHref(href)) continue;

      const normHref = normalizePath(href);
      if (normHref !== targetLeafNorm) continue;

      result = {
        activeLeafNorm: normHref,
        branchIds: [...branchIdsSoFar],
      };
      found = true;
      return;
    }
  };

  for (let gi = 0; gi < config.items.length; gi++) {
    if (found) break;
    const node = config.items[gi]!;
    if (node.type === "group") visit(node.menu, gi, [], []);
  }

  return result;
}

/**
 * 管理侧栏菜单展开/收起状态：
 * - URL 命中的分支默认展开；
 * - 用户主动折叠后会记下来，避免被自动展开覆盖；
 * - 切换路径时会清空这份「主动折叠」记录。
 */
function useMenuExpansion({
  pathname,
  requiredBranchIds,
}: {
  pathname: string;
  requiredBranchIds: readonly string[];
}) {
  const [userExpanded, setUserExpanded] =
    useState<ReadonlySet<string>>(EMPTY_SET);
  const [dismissed, setDismissed] = useState<DismissedState>(EMPTY_DISMISSED);

  const activeDismissed =
    dismissed.forPath === pathname ? dismissed.keys : EMPTY_SET;

  const mergedExpanded = useMemo(() => {
    const out = new Set(userExpanded);
    for (const id of requiredBranchIds) {
      if (!activeDismissed.has(id)) out.add(id);
    }
    return out;
  }, [userExpanded, requiredBranchIds, activeDismissed]);

  const getExpandedForGroup = useCallback(
    (groupIndex: number): Set<string> => {
      const prefix = getGroupIdPrefix(groupIndex);
      return filterByPrefix(mergedExpanded, prefix);
    },
    [mergedExpanded],
  );

  const handleExpandedChange = useCallback(
    (groupIndex: number, nextKeys: Set<Key> | "all") => {
      if (nextKeys === "all") return;

      const prefix = getGroupIdPrefix(groupIndex);
      const nextGroupKeys = toStringSet(nextKeys);

      setUserExpanded((prev) => replaceGroup(prev, prefix, nextGroupKeys));
      setDismissed((prev) =>
        computeDismissed(prev, {
          pathname,
          prefix,
          nextGroupKeys,
          requiredBranchIds,
        }),
      );
    },
    [pathname, requiredBranchIds],
  );

  return { getExpandedForGroup, handleExpandedChange };
}
